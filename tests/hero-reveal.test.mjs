import test from 'node:test';
import assert from 'node:assert/strict';
import { createHeroReveal, HERO_APERTURE, HERO_DURATION, HERO_SAFETY } from '../templates/quiet/hero-reveal.js';

async function fixture(exercise, { decode = true, supported = true, throwAt = 0 } = {}) {
  const names = ['document', 'window', 'matchMedia', 'CSS', 'location'];
  const originals = new Map(names.map(name => [name, Object.getOwnPropertyDescriptor(globalThis, name)]));
  const document = new EventTarget();
  document.hidden = false;
  document.documentElement = { dataset: {} };
  const window = Object.assign(new EventTarget(), { scrollX: 0, scrollY: 0, innerHeight: 900 });
  const reduced = Object.assign(new EventTarget(), { matches: false });
  const motions = [];
  const node = () => ({
    isConnected: true,
    animate(frames, options) {
      if (throwAt && motions.length + 1 === throwAt) throw new Error('Unsupported animation');
      let finish, reject;
      const motion = {
        frames, options, paused: false, played: false, canceled: false, currentTime: null,
        finished: new Promise((resolve, no) => { finish = resolve; reject = no; }),
        pause() { this.paused = true; }, play() { this.played = true; },
        cancel() { this.canceled = true; reject(new Error('Canceled')); }, finish() { finish(); },
      };
      motions.push(motion);
      return motion;
    },
  });
  const image = Object.assign(node(), {
    currentSrc: 'photo.webp', complete: true, naturalWidth: 1440,
    decode: () => decode ? Promise.resolve() : new Promise(() => {}),
    getBoundingClientRect: () => ({ top: 400, bottom: 800 }),
  });
  const heading = node(), copy = node();
  const host = { isConnected: true, querySelector: selector => ({ '.cinematic img': image, '.intro h1': heading, '.intro > p': copy })[selector] };
  const gui = { hidden: false };
  document.querySelector = selector => ({ '#quiet-hero': host, '#quiet-gui': gui })[selector];
  for (const [name, value] of Object.entries({ document, window, matchMedia: () => reduced, CSS: { supports: () => supported }, location: { hash: '' } })) {
    Object.defineProperty(globalThis, name, { configurable: true, writable: true, value });
  }
  const reveal = createHeroReveal();
  try {
    await Promise.resolve(); // Current responsive source has decoded, unless deliberately pending.
    await exercise({ reveal, motions, image, host, gui, document, window, reduced });
  } finally {
    reveal.dispose('test-cleanup');
    for (const [name, descriptor] of originals) {
      if (descriptor) Object.defineProperty(globalThis, name, descriptor); else delete globalThis[name];
    }
  }
}

test('the adaptation is a bounded horizontal aperture, not the Lab full-screen zoom', () => {
  assert.ok(Object.isFrozen(HERO_APERTURE) && HERO_APERTURE.every(Object.isFrozen));
  assert.equal(HERO_APERTURE[0].clipPath, 'inset(48% 44% 48% 44%)');
  assert.equal(HERO_APERTURE[1].clipPath, 'inset(44% 0% 44% 0%)');
  assert.equal(HERO_APERTURE[2].clipPath, 'inset(0% 0% 0% 0%)');
  assert.equal(HERO_DURATION, 1100);
  assert.ok(HERO_SAFETY > HERO_DURATION + 150 && HERO_SAFETY < 2000);
  assert.ok(!HERO_APERTURE.some(frame => 'transform' in frame || 'opacity' in frame));
});

test('prepare pauses first frames under the opaque welcome; play runs once and retires everything', async () => {
  await fixture(async ({ reveal, motions, document }) => {
    assert.equal(reveal.prepare(), true);
    assert.equal(reveal.prepare(), false);
    assert.equal(document.documentElement.dataset.heroReveal, 'prepared');
    assert.equal(motions.length, 3);
    assert.ok(motions.every(motion => motion.paused && !motion.played && motion.currentTime === 0));
    assert.equal(reveal.play(), true);
    assert.equal(reveal.play(), false, 'Only one play owns the entrance');
    assert.equal(document.documentElement.dataset.heroReveal, 'playing');
    motions.forEach(motion => motion.finish());
    await Promise.resolve(); await Promise.resolve();
    assert.equal(document.documentElement.dataset.heroReveal, 'done');
    assert.equal(document.documentElement.dataset.heroReason, 'complete');
    assert.ok(motions.every(motion => motion.canceled));
    assert.equal(reveal.play(), false);
  });
});

test('slow/unavailable/changed responsive images and unsupported masks remain visible by default', async () => {
  for (const options of [{ decode: false }, { supported: false }]) await fixture(({ reveal, motions }) => {
    assert.equal(reveal.prepare(), false);
    assert.equal(motions.length, 0);
  }, options);
  for (const mutate of [image => { image.naturalWidth = 0; }, image => { image.currentSrc = 'new-source.webp'; }, image => { image.isConnected = false; }]) {
    await fixture(({ reveal, motions, image }) => { mutate(image); assert.equal(reveal.prepare(), false); assert.equal(motions.length, 0); });
  }
});

test('deep links, reduced motion, hidden/scrolled pages and Dev Mode do not prepare an entrance', async () => {
  for (const mutate of [env => { location.hash = '#work'; }, env => { env.reduced.matches = true; }, env => { env.document.hidden = true; }, env => { env.window.scrollY = 80; }, env => { env.gui.hidden = true; }]) {
    await fixture(env => { mutate(env); assert.equal(env.reveal.prepare(), false); assert.equal(env.motions.length, 0); });
  }
});

test('native input settles immediately without preventing or replaying the event; disposal is idempotent', async () => {
  await fixture(({ reveal, motions, document }) => {
    reveal.prepare(); reveal.play();
    const event = new Event('keydown', { cancelable: true });
    assert.equal(document.dispatchEvent(event), true);
    assert.equal(event.defaultPrevented, false);
    assert.ok(motions.every(motion => motion.canceled));
    assert.equal(document.documentElement.dataset.heroReason, 'input');
    reveal.dispose('again');
    assert.equal(document.documentElement.dataset.heroReason, 'input');
    document.dispatchEvent(new Event('wheel', { cancelable: true }));
    assert.equal(document.documentElement.dataset.heroReason, 'input');
  });
});

test('resize/route/visibility/reduced-motion changes and partial animation failure restore native rest', async () => {
  for (const event of ['resize', 'hashchange', 'popstate', 'pagehide', 'scroll']) {
    await fixture(({ reveal, motions, window }) => { reveal.prepare(); window.dispatchEvent(new Event(event)); assert.ok(motions.every(motion => motion.canceled)); });
  }
  await fixture(({ reveal, motions, document }) => { reveal.prepare(); document.hidden = true; document.dispatchEvent(new Event('visibilitychange')); assert.ok(motions.every(motion => motion.canceled)); });
  await fixture(({ reveal, motions, reduced }) => { reveal.prepare(); reduced.matches = true; reduced.dispatchEvent(new Event('change')); assert.ok(motions.every(motion => motion.canceled)); });
  await fixture(({ reveal, motions, document }) => { assert.equal(reveal.prepare(), false); assert.equal(document.documentElement.dataset.heroReason, 'failure'); assert.ok(motions.every(motion => motion.canceled)); }, { throwAt: 2 });
});

test('the independent bounded watchdog retires a stalled prepared reveal', async () => {
  await fixture(async ({ reveal, motions, document }) => {
    reveal.prepare(); reveal.play();
    await new Promise(resolve => setTimeout(resolve, HERO_SAFETY + 40));
    assert.equal(document.documentElement.dataset.heroReason, 'safety-timeout');
    assert.ok(motions.every(motion => motion.canceled));
  });
});
