// Reveal Hero adaptation: a horizontal photographic aperture, not the Lab's
// full-screen zoom/overlay/SplitText stack. Default markup stays fully visible.
export const HERO_DURATION = 1100;
export const HERO_SAFETY = 1700; // Includes the existing 150ms welcome exit.
export const HERO_EASE = 'cubic-bezier(0.65, 0, 0.35, 1)';
export const HERO_APERTURE = Object.freeze([
  { clipPath: 'inset(48% 44% 48% 44%)', offset: 0 },
  { clipPath: 'inset(44% 0% 44% 0%)', offset: 0.4 },
  { clipPath: 'inset(0% 0% 0% 0%)', offset: 1 },
].map(frame => Object.freeze(frame)));

export function createHeroReveal() {
  const root = document.documentElement;
  const host = document.querySelector('#quiet-hero');
  const image = host?.querySelector('.cinematic img');
  const heading = host?.querySelector('.intro h1');
  const copy = host?.querySelector('.intro > p');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const animations = new Set();
  const removers = [];
  let decodedSource = null;
  let prepared = false;
  let playing = false;
  let stopped = false;
  let deadline;

  // Never wait for a late image after the welcome has exposed the page.
  // Prepare only if the current responsive source decoded under the cover.
  if (image && typeof image.decode === 'function') {
    image.decode().then(() => { if (!stopped) decodedSource = image.currentSrc; }).catch(() => {});
  }
  function dispose(reason = 'interrupted') {
    if (stopped) return;
    stopped = true;
    clearTimeout(deadline);
    for (const animation of animations) {
      try { animation.cancel(); } catch { /* Retire every owned animation independently. */ }
    }
    animations.clear();
    for (const remove of removers) remove();
    removers.length = 0;
    root.dataset.heroReveal = reason === 'complete' ? 'done' : 'bypassed';
    root.dataset.heroReason = reason;
  }
  function eligible() {
    const box = image?.getBoundingClientRect();
    return host?.isConnected && image?.isConnected && heading?.isConnected && copy?.isConnected
      && document.querySelector('#quiet-hero') === host
      && !document.querySelector('#quiet-gui')?.hidden
      && !document.hidden && !reduced.matches && !location.hash
      && window.scrollY === 0 && window.scrollX === 0
      && image.complete && image.naturalWidth > 0 && decodedSource === image.currentSrc
      && box.top < window.innerHeight && box.bottom > 0
      && typeof image.animate === 'function'
      && typeof CSS !== 'undefined' && CSS.supports('clip-path', HERO_APERTURE[0].clipPath);
  }
  function listen(target, event, handler) {
    target.addEventListener(event, handler, { capture: true, passive: true });
    removers.push(() => target.removeEventListener(event, handler, { capture: true }));
  }
  function pause(element, frames, options) {
    const animation = element.animate(frames, { ...options, fill: 'both' });
    animations.add(animation);
    // Cancellation before play must not create an unhandled rejection.
    animation.finished.catch(() => {});
    animation.pause();
    animation.currentTime = 0;
  }
  function prepare() {
    if (stopped || prepared) return false;
    if (!eligible()) { dispose('ineligible'); return false; }
    prepared = true;
    try {
      // Install paused first frames while the welcome is STILL opaque, before
      // its exit fades. This prevents full-photo → collapsed-photo flashing.
      pause(image, HERO_APERTURE, { duration: HERO_DURATION, easing: HERO_EASE });
      pause(heading, [{ transform: 'translateY(8px)' }, { transform: 'translateY(0)' }], { duration: 560, easing: 'cubic-bezier(0.215, 0.61, 0.355, 1)' });
      pause(copy, [{ transform: 'translateY(4px)' }, { transform: 'translateY(0)' }], { duration: 480, delay: 80, easing: 'cubic-bezier(0.215, 0.61, 0.355, 1)' });
      // Unlike the welcome, the hero never consumes input. Native actions win.
      for (const event of ['keydown', 'pointerdown', 'wheel', 'touchstart', 'touchmove']) listen(document, event, () => dispose('input'));
      for (const event of ['scroll', 'resize', 'hashchange', 'popstate', 'pagehide']) listen(window, event, () => dispose(event));
      listen(document, 'visibilitychange', () => { if (document.hidden) dispose('hidden'); });
      listen(reduced, 'change', () => { if (reduced.matches) dispose('reduced-motion'); });
      deadline = setTimeout(() => dispose('safety-timeout'), HERO_SAFETY);
      root.dataset.heroReveal = 'prepared';
      return true;
    } catch { dispose('failure'); return false; }
  }
  function play() {
    if (stopped || playing) return false;
    if (!prepared || !eligible()) { dispose('ineligible'); return false; }
    try {
      playing = true;
      root.dataset.heroReveal = 'playing';
      for (const animation of animations) animation.play();
      Promise.all([...animations].map(animation => animation.finished)).then(() => dispose('complete'), () => dispose('failure'));
      return true;
    } catch { dispose('failure'); return false; }
  }
  return { prepare, play, dispose };
}
