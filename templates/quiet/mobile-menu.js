// One non-modal disclosure, with the existing links and view controls.
// Without this enhancement the static navigation remains visible and usable.
import { getLang, onLangChange } from '../../src/i18n.js';
import { copyFor } from './copy.js';

export function initMobileMenu({ beforeNavigate = () => {} } = {}) {
  const header = document.querySelector('.topbar');
  const toggle = document.querySelector('#quiet-menu');
  const panel = document.querySelector('#quiet-navigation');
  const preferences = header.querySelector('.preferences');
  const view = panel.querySelector('.mobile-view');
  const modes = preferences.querySelector('.mode-controls');
  const theme = preferences.querySelector('#quiet-theme');
  const mobile = matchMedia('(max-width: 700px)');
  let open = false;

  function paint() {
    const c = copyFor(getLang());
    toggle.hidden = !mobile.matches;
    toggle.setAttribute('aria-expanded', String(mobile.matches && open));
    toggle.querySelector('[data-menu-label]').textContent = open ? c.menuClose : c.menu;
    toggle.lang = getLang();
    panel.hidden = mobile.matches && !open;
  }
  function close({ restoreFocus = false } = {}) {
    const hiddenFocus = mobile.matches && panel.contains(document.activeElement);
    open = false;
    paint();
    if (mobile.matches && (restoreFocus || hiddenFocus)) toggle.focus({ preventScroll: true });
  }
  function resize() {
    const focused = document.activeElement;
    const ownedFocus = focused === toggle || modes.contains(focused) || panel.contains(focused);
    open = false;
    view.hidden = !mobile.matches;
    if (mobile.matches) { view.append(modes); header.append(panel); }
    else { preferences.insertBefore(modes, theme); header.insertBefore(panel, preferences); }
    paint();
    if (ownedFocus) {
      const target = mobile.matches ? toggle : focused === toggle ? panel.querySelector('a') : focused;
      target.focus({ preventScroll: true });
    }
  }
  toggle.addEventListener('click', () => {
    if (!mobile.matches) return;
    open = !open;
    paint();
  });
  panel.addEventListener('click', event => {
    if (!(event.target instanceof Element)) return;
    const link = event.target.closest('.section-nav a');
    if (link && event.button === 0 && !event.ctrlKey && !event.metaKey && !event.altKey && !event.shiftKey) {
      const sameHash = location.hash === link.hash;
      const destination = link.hash;
      beforeNavigate();
      const section = document.getElementById(destination.slice(1));
      const heading = section?.querySelector('h2');
      // Focus a real destination before hiding its trigger. Keep the href's
      // default scroll/history action; this also works for the current hash.
      if (heading) { heading.tabIndex = -1; heading.focus({ preventScroll: true }); }
      close();
      if (sameHash && heading) requestAnimationFrame(() => {
        // Native same-fragment activation resets focus without hashchange.
        // Repair only that reset, never a later deliberate focus/route choice.
        if (location.hash === destination && heading.isConnected && (document.activeElement === document.body || document.activeElement === section)) heading.focus({ preventScroll: true });
      });
    } else if (event.target.closest('.view-control')) {
      // Runs after the existing view listener: Dev input keeps its focus;
      // an otherwise hidden GUI control returns focus to Menu.
      close();
    }
  });
  document.addEventListener('keydown', event => {
    if (!open || event.key !== 'Escape' || event.isComposing) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    close({ restoreFocus: true });
  }, true);
  document.addEventListener('click', event => {
    if (open && event.target instanceof Node && !header.contains(event.target)) close();
  });
  window.addEventListener('hashchange', () => close());
  window.addEventListener('pageshow', () => close());
  mobile.addEventListener('change', resize);
  onLangChange(paint);
  header.classList.add('menu-ready');
  resize();
  return { close };
}
