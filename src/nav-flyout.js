// Preview flyout — navigation01's morphing-flyout internals (shared bg +
// clipped viewport + per-trigger panels, directional enter/leave, hover bridge)
// adapted to live outside the popover: the panel's runtime clip-path would
// clip an in-panel flyout, so this layer is position:fixed on <body> and is
// placed from the hovered menu link's getBoundingClientRect().
// Only the desktop flyout mechanics are kept — no header shell, scroll-shrink,
// accordions, or mega/featured image previews.

import { t, onLangChange } from './i18n.js';

const SECTIONS = [
  { key: 'about', sub: 'Three registers, one practice' },
  { key: 'work', sub: 'Selected work' },
  { key: 'research', sub: 'Papers & preprints' },
  { key: 'photography', sub: 'Albums & collections' },
  { key: 'archive', sub: 'Field notes' },
  { key: 'contact', sub: 'Say hello' },
  { key: 'purpose', sub: 'The ground under the work' },
];

const GAP = 12;           // gap between popover panel and flyout
const VIEWPORT_PAD = 16;  // minimum distance from viewport edges

export function initNavFlyout() {
  const root = document.querySelector('[data-menu-01]');
  const menuPanel = root && root.querySelector('[data-menu-panel]');
  if (!root || !menuPanel) return;

  // Hover previews are hover-capable pointers only — on touch the popover is
  // just the menu.
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
  if (!finePointer.matches) return;

  const flyout = document.createElement('div');
  flyout.className = 'nav-flyout nav-flyout--preview';
  flyout.hidden = true;
  flyout.innerHTML = `
    <div class="nav-flyout__bg" aria-hidden="true"></div>
    <div class="nav-flyout__viewport">
      ${SECTIONS.map((s) => `
      <div class="nav-flyout__panel nav-flyout__panel--simple" data-panel="${s.key}">
        <div class="nav-dropdown__inner">
          <span class="nav-preview__kicker">${s.sub}</span>
          <span class="nav-preview__title" data-preview-title="${s.key}">${t(`nav.${s.key}`)}</span>
        </div>
      </div>`).join('')}
    </div>`;
  document.body.appendChild(flyout);

  // Titles follow the language; the kicker subline stays English by design.
  const renderTitles = () => {
    flyout.querySelectorAll('[data-preview-title]').forEach((el) => {
      el.textContent = t(`nav.${el.dataset.previewTitle}`);
    });
  };
  onLangChange(renderTitles);

  const flyoutBg = flyout.querySelector('.nav-flyout__bg');
  const flyoutViewport = flyout.querySelector('.nav-flyout__viewport');
  if (!flyoutBg || !flyoutViewport) return;

  const PANEL_CLASSES = [
    'is-active',
    'is-leaving-left',
    'is-leaving-right',
    'is-enter-right',
    'is-enter-left',
  ];
  const flyoutFrameElements = [flyoutBg, flyoutViewport];

  const registry = new Map();
  let currentTrigger = null;
  let closeTimeout;
  let closeHandler = null;
  let leaveTimer = null;

  const resetPanel = (panel) => panel.classList.remove(...PANEL_CLASSES);

  const setPanelInert = (panel, inert) => {
    panel.inert = inert;
    panel.setAttribute('aria-hidden', inert ? 'true' : 'false');
  };

  const clearCloseWatchers = () => {
    clearTimeout(closeTimeout);
    if (closeHandler) {
      flyoutBg.removeEventListener('transitionend', closeHandler);
      closeHandler = null;
    }
  };

  // Morph frame: size + viewport-fixed position travel together via
  // --flyout-x / --flyout-y on both the bg and the clipped viewport.
  const setBg = (panelRect, x, y) => {
    const w = `${panelRect.width}px`;
    const h = `${panelRect.height}px`;
    flyoutFrameElements.forEach((element) => {
      element.style.width = w;
      element.style.height = h;
      element.style.setProperty('--flyout-x', `${x}px`);
      element.style.setProperty('--flyout-y', `${y}px`);
    });
  };

  const triggers = [...menuPanel.querySelectorAll('[data-menu-item][data-flyout]')];

  triggers.forEach((trigger, index) => {
    const key = trigger.dataset.flyout;
    const panel = flyout.querySelector(`.nav-flyout__panel[data-panel="${key}"]`);
    if (!panel) return;
    registry.set(trigger, { panel, index });
    setPanelInert(panel, true);
  });

  // Placement: left of the popover, vertically centered on the hovered link,
  // clamped into the viewport.
  const measureFor = (trigger, entry) => {
    const linkRect = trigger.getBoundingClientRect();
    const panelRect = {
      width: entry.panel.offsetWidth,
      height: entry.panel.offsetHeight,
    };
    const x = Math.max(VIEWPORT_PAD, linkRect.left - GAP - panelRect.width);
    const y = Math.min(
      Math.max(VIEWPORT_PAD, linkRect.top + linkRect.height / 2 - panelRect.height / 2),
      window.innerHeight - VIEWPORT_PAD - panelRect.height,
    );
    return { panelRect, x, y };
  };

  const open = (trigger) => {
    const entry = registry.get(trigger);
    if (!entry) return;
    if (trigger === currentTrigger) return;

    clearCloseWatchers();
    flyout.hidden = false;

    const prevEntry = currentTrigger ? registry.get(currentTrigger) : null;
    const { panelRect, x, y } = measureFor(trigger, entry);

    if (!prevEntry) {
      registry.forEach((e) => {
        resetPanel(e.panel);
        setPanelInert(e.panel, true);
      });

      flyoutBg.classList.add('is-instant');
      flyoutViewport.classList.add('is-instant');
      setBg(panelRect, x, y);
      flyoutBg.offsetHeight;
      flyoutBg.classList.remove('is-instant');
      flyoutViewport.classList.remove('is-instant');

      resetPanel(entry.panel);
      entry.panel.classList.add('is-active');
      setPanelInert(entry.panel, false);
      flyout.classList.add('is-open');
    } else {
      flyout.classList.add('is-open');
      const direction = Math.sign(entry.index - prevEntry.index) || 1;
      setBg(panelRect, x, y);

      prevEntry.panel.classList.remove('is-active');
      prevEntry.panel.classList.add(
        direction > 0 ? 'is-leaving-left' : 'is-leaving-right',
      );
      setPanelInert(prevEntry.panel, true);

      resetPanel(entry.panel);
      entry.panel.classList.add(
        direction > 0 ? 'is-enter-right' : 'is-enter-left',
      );
      entry.panel.offsetHeight;
      entry.panel.classList.remove('is-enter-right', 'is-enter-left');
      entry.panel.classList.add('is-active');
      setPanelInert(entry.panel, false);
    }

    currentTrigger = trigger;
  };

  const finalizeClose = () => {
    registry.forEach((entry) => {
      resetPanel(entry.panel);
      setPanelInert(entry.panel, true);
    });
  };

  const close = () => {
    if (currentTrigger === null) return;

    clearCloseWatchers();
    const closingEntry = registry.get(currentTrigger);
    currentTrigger = null;

    if (closingEntry) {
      resetPanel(closingEntry.panel);
      setPanelInert(closingEntry.panel, true);
    }

    flyout.classList.remove('is-open');

    let closed = false;
    const finalize = () => {
      if (closed) return;
      closed = true;
      flyout.hidden = true;
      finalizeClose();
      clearCloseWatchers();
    };

    closeHandler = (event) => {
      if (event.target !== flyoutBg) return;
      if (
        event.propertyName !== 'background-color' &&
        event.propertyName !== 'border-color' &&
        event.propertyName !== 'backdrop-filter' &&
        event.propertyName !== '-webkit-backdrop-filter'
      ) {
        return;
      }
      if (flyout.classList.contains('is-open')) return;
      finalize();
    };

    flyoutBg.addEventListener('transitionend', closeHandler);
    closeTimeout = setTimeout(() => {
      if (!flyout.classList.contains('is-open')) finalize();
    }, 220);
  };

  // Hover bridge: leaving the popover panel toward the flyout (or back) does
  // not close it — the CSS ::before strip covers the 12px gap — and a short
  // grace delay forgives diagonal crossings.
  const scheduleClose = () => {
    clearTimeout(leaveTimer);
    leaveTimer = setTimeout(close, 90);
  };
  const cancelClose = () => clearTimeout(leaveTimer);

  menuPanel.addEventListener('pointerleave', (event) => {
    if (event.relatedTarget instanceof Node && flyout.contains(event.relatedTarget)) return;
    scheduleClose();
  });
  flyout.addEventListener('pointerleave', (event) => {
    if (event.relatedTarget instanceof Node && menuPanel.contains(event.relatedTarget)) return;
    scheduleClose();
  });
  menuPanel.addEventListener('pointerenter', cancelClose);
  flyout.addEventListener('pointerenter', cancelClose);

  registry.forEach((_entry, trigger) => {
    trigger.addEventListener('pointerenter', () => open(trigger));
  });

  // Whenever the popover closes, the flyout goes with it.
  new MutationObserver(() => {
    if (!root.classList.contains('is-open')) close();
  }).observe(root, { attributes: true, attributeFilter: ['class'] });
}
