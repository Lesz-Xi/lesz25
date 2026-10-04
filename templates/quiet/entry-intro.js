// One finite native SVG sequence. No frame loop, scroll owner or progress fiction.
import { copyFor } from './copy.js';

export const ENTRY_KEY = 'rhine-quiet-welcome-v1';
export const ENTRY_EASE = 'cubic-bezier(0.215, 0.61, 0.355, 1)';
export const FLAG_STEPS = Object.freeze([
  { name: 'pole', selector: '#_c1u96v6 path', draw: true, duration: 160 },
  ...[8, 9, 10, 16, 17, 18].map((id, index) => ({ name: `stripe-${index + 1}`, selector: `#_c1u96v${id}`, draw: true, duration: 140 })),
  { name: 'sun', selector: '#_c1u96v12', draw: false, duration: 120 },
  ...[1, 2, 3].map(index => ({ name: `star-${index}`, selector: `#_c1u96v11 > use:nth-child(${index})`, draw: false, duration: 120 })),
].map(step => Object.freeze(step)));
export const ENTRY_HOLD = 1500;
export const ENTRY_DURATION = FLAG_STEPS.reduce((sum, step) => sum + step.duration, 0) + 220 + ENTRY_HOLD + 150;
export const ENTRY_SAFETY = ENTRY_DURATION + 350;
export function shouldPlayEntry({ hash = '', reduced = false, hidden = false, seen = false, returning = false, reload = false }) {
  return !hash && !reduced && !hidden && (!seen || reload) && !returning;
}

export function initEntryIntro({ locale = 'en' } = {}) {
  const cover = document.querySelector('#entry-intro');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let seen = true;
  let storageAvailable = false;
  try {
    seen = sessionStorage.getItem(ENTRY_KEY) === 'seen';
    storageAvailable = true;
  } catch { /* Unavailable session storage always bypasses motion, including reload. */ }
  const navigation = performance.getEntriesByType('navigation')[0]?.type;
  const returning = navigation === 'back_forward';
  const reload = navigation === 'reload';
  const allowed = cover && storageAvailable && performance.now() < 1200 && scrollY === 0 && scrollX === 0
    && typeof Element.prototype.animate === 'function'
    && shouldPlayEntry({ hash: location.hash, reduced: reduced.matches, hidden: document.hidden, seen, returning, reload });
  if (!allowed) return { dispose() {}, finished: Promise.resolve({ played: false, reason: 'bypassed' }) };

  const c = copyFor(locale);
  cover.setAttribute('aria-label', c.entryWelcome);
  cover.querySelector('.entry-description').textContent = c.entryDescription;
  cover.querySelector('.entry-description').lang = locale;
  const host = cover.querySelector('.entry-artwork');
  const caption = cover.querySelector('.entry-caption');
  const controller = new AbortController();
  const animations = new Set();
  const snapshots = new Map();
  const removers = [];
  let stopped = false;
  let played = false;
  let deadline;
  let holdTimer;
  let resolveHold;
  let resolveFinished;
  const finished = new Promise(resolve => { resolveFinished = resolve; });
  try { sessionStorage.setItem(ENTRY_KEY, 'seen'); } catch {
    dispose('storage'); // Without a durable visit marker, prefer no interruption.
    return { dispose, finished };
  }

  function remember(element) {
    snapshots.set(element, { style: element.getAttribute('style'), pathLength: element.getAttribute('pathLength') });
  }
  function restore(element) {
    const original = snapshots.get(element);
    if (!original) return;
    for (const [name, value] of Object.entries(original)) {
      if (value === null) element.removeAttribute(name); else element.setAttribute(name, value);
    }
  }
  function dispose(reason = 'interrupted') {
    if (stopped) return;
    stopped = true;
    clearTimeout(deadline);
    clearTimeout(holdTimer);
    resolveHold?.();
    controller.abort();
    for (const animation of animations) animation.cancel();
    animations.clear();
    for (const remove of removers) remove();
    removers.length = 0;
    const focusedInside = cover.contains(document.activeElement);
    cover.hidden = true;
    host.replaceChildren(); // Retire disposable SVG nodes; do not rewrite their styles in the body.
    restore(caption);
    restore(cover);
    snapshots.clear();
    cover.dataset.state = 'done';
    cover.dataset.reason = reason;
    // If focus entered the transient region, return it to the page without scrolling.
    if (focusedInside) document.querySelector('#main')?.focus({ preventScroll: true });
    resolveFinished({ played, reason });
  }
  function listen(target, event, handler, options) {
    target.addEventListener(event, handler, options);
    removers.push(() => target.removeEventListener(event, handler, options));
  }
  const interrupt = () => dispose('input');
  listen(document, 'pointerdown', interrupt, { capture: true, passive: true });
  listen(document, 'click', interrupt, true); // Includes assistive-technology activation.
  listen(document, 'focusin', event => { if (!cover.contains(event.target)) dispose('focus'); });
  listen(document, 'keydown', interrupt, true); // Tab dismisses before it can focus covered controls.
  listen(document, 'wheel', interrupt, { capture: true, passive: true });
  listen(document, 'touchstart', interrupt, { capture: true, passive: true });
  listen(window, 'hashchange', () => dispose('route'));
  listen(window, 'popstate', () => dispose('route'));
  listen(window, 'pagehide', () => dispose('pagehide'));
  listen(window, 'pageshow', event => { if (event.persisted) dispose('return'); });
  listen(document, 'visibilitychange', () => { if (document.hidden) dispose('hidden'); });
  listen(reduced, 'change', () => { if (reduced.matches) dispose('reduced-motion'); });
  deadline = setTimeout(() => dispose('asset-timeout'), 350);

  async function animate(element, keyframes, duration) {
    if (stopped) throw new Error('Entry retired');
    const animation = element.animate(keyframes, { duration, easing: ENTRY_EASE, fill: 'forwards' });
    animations.add(animation);
    await animation.finished;
    if (stopped) throw new Error('Entry retired');
    return animation;
  }
  async function run() {
    const response = await fetch('/quiet/philippines-flag.svg', { signal: controller.signal, credentials: 'same-origin' });
    if (!response.ok) throw new Error('Flag unavailable');
    const xml = new DOMParser().parseFromString(await response.text(), 'image/svg+xml');
    const source = xml.documentElement;
    const permitted = new Set(['svg', 'defs', 'linearGradient', 'radialGradient', 'stop', 'path', 'g', 'use', 'ellipse']);
    if (source.localName !== 'svg' || source.namespaceURI !== 'http://www.w3.org/2000/svg'
      || [source, ...source.querySelectorAll('*')].some(node => !permitted.has(node.localName)
        || [...node.attributes].some(attr => /^on/i.test(attr.name) || attr.name === 'style' || (/href$/i.test(attr.name) && !attr.value.startsWith('#'))))) throw new Error('Unexpected SVG');
    if (stopped || document.activeElement !== document.body || document.hidden || location.hash) return dispose('interrupted');
    const svg = document.importNode(source, true);
    const steps = FLAG_STEPS.map(step => ({ ...step, element: svg.querySelector(step.selector) }));
    if (steps.some(step => !step.element)) throw new Error('Incomplete flag');
    svg.setAttribute('aria-hidden', 'true');
    svg.setAttribute('focusable', 'false');
    for (const step of steps) {
      remember(step.element);
      if (step.draw) {
        step.element.setAttribute('pathLength', '1');
        Object.assign(step.element.style, { stroke: step.element.getAttribute('fill'), strokeWidth: '4.5', strokeDasharray: '1', strokeDashoffset: '1', fillOpacity: '0' });
      } else step.element.style.opacity = '0';
    }
    remember(caption);
    remember(cover);
    caption.style.opacity = '0';
    host.replaceChildren(svg);
    clearTimeout(deadline);
    deadline = setTimeout(() => dispose('safety-timeout'), ENTRY_SAFETY);
    played = true;
    cover.dataset.state = 'playing';
    cover.hidden = false;
    for (const step of steps) {
      cover.dataset.phase = step.name;
      const motion = await animate(step.element, step.draw ? [
        { offset: 0, strokeDashoffset: '1', fillOpacity: 0, strokeOpacity: 1 },
        { offset: 0.72, strokeDashoffset: '0', fillOpacity: 0, strokeOpacity: 1 },
        { offset: 1, strokeDashoffset: '0', fillOpacity: 1, strokeOpacity: 0 },
      ] : [{ opacity: 0 }, { opacity: 1 }], step.duration);
      motion.cancel();
      animations.delete(motion);
      restore(step.element); // Rest is the exact supplied artwork, including the pole stroke.
    }
    cover.dataset.phase = 'greeting';
    const greeting = await animate(caption, [{ opacity: 0, transform: 'translateY(6px)' }, { opacity: 1, transform: 'translateY(0)' }], 220);
    greeting.cancel();
    animations.delete(greeting);
    restore(caption);
    cover.dataset.phase = 'complete';
    await new Promise(resolve => { resolveHold = resolve; holdTimer = setTimeout(resolve, ENTRY_HOLD); });
    if (stopped) return;
    cover.dataset.phase = 'exit';
    await animate(cover, [{ opacity: 1 }, { opacity: 0 }], 150);
    dispose('complete');
  }
  run().catch(() => dispose('failure'));
  return { dispose, finished };
}
