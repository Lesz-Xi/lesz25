import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import { FLAG_STEPS, ENTRY_HOLD, ENTRY_DURATION, ENTRY_SAFETY, ENTRY_KEY, shouldPlayEntry } from '../templates/quiet/entry-intro.js';

test('entry is finite, sequential, and ends with the greeting after all artwork', () => {
  assert.deepEqual(FLAG_STEPS.map(step => step.name), ['pole', 'stripe-1', 'stripe-2', 'stripe-3', 'stripe-4', 'stripe-5', 'stripe-6', 'sun', 'star-1', 'star-2', 'star-3']);
  assert.equal(FLAG_STEPS.filter(step => step.draw).length, 7);
  assert.deepEqual(FLAG_STEPS.map(step => step.duration), [160, 140, 140, 140, 140, 140, 140, 120, 120, 120, 120], 'SVG drawing/appearance pace stays unchanged');
  assert.equal(ENTRY_HOLD, 1500);
  assert.equal(ENTRY_DURATION, 3350);
  assert.equal(ENTRY_SAFETY, 3700);
  assert.ok(ENTRY_DURATION < ENTRY_SAFETY && ENTRY_SAFETY < 4000);
  assert.ok(Object.isFrozen(FLAG_STEPS) && FLAG_STEPS.every(Object.isFrozen));
  assert.equal(ENTRY_KEY, 'rhine-quiet-welcome-v1');
});

test('explicit reload replays a seen welcome without bypassing reduced motion or other safeguards', () => {
  assert.equal(shouldPlayEntry({}), true);
  assert.equal(shouldPlayEntry({ seen: true, reload: true }), true);
  for (const input of [{ hash: '#about' }, { hash: '#album-paris' }, { reduced: true }, { hidden: true }, { returning: true }]) {
    assert.equal(shouldPlayEntry(input), false);
    assert.equal(shouldPlayEntry({ ...input, seen: true, reload: true }), false);
  }
  assert.equal(shouldPlayEntry({ seen: true }), false, 'Normal reader returns still bypass the welcome');
});

test('early reload policy clears only the fragment and suppresses restoration only during this arrival', () => {
  const html = readFileSync(new URL('../templates/quiet/index.html', import.meta.url), 'utf8');
  const script = html.match(/<script>([\s\S]*?)<\/script>/)[1];
  assert.ok(html.indexOf('<script>') < html.indexOf('<link rel="stylesheet"'));
  for (const type of ['reload', 'navigate', 'back_forward', undefined]) {
    const calls = [];
    const events = new Map();
    const state = { retained: true };
    const history = { state, scrollRestoration: 'auto', replaceState: (...args) => calls.push(args) };
    const scrolls = [];
    const frames = [];
    runInNewContext(script, {
      requestAnimationFrame: callback => frames.push(callback),
      performance: { getEntriesByType: () => type ? [{ type }] : [] }, history,
      location: { hash: '#album-paris', pathname: '/templates/quiet/', search: '?lang=de' },
      window: { scrollTo: value => scrolls.push(value), addEventListener: (name, handler, options) => events.set(name, { handler, options }) },
      localStorage: { getItem: () => null }, document: { documentElement: { dataset: {} }, addEventListener: (name, handler, options) => events.set(name, { handler, options }) }, matchMedia: () => ({ matches: false }),
    });
    if (type === 'reload') {
      assert.deepEqual(calls, [[state, '', '/templates/quiet/?lang=de']]);
      assert.equal(history.scrollRestoration, 'manual');
      assert.equal(scrolls.length, 0, 'Do not attempt a scroll reset before a body exists');
      assert.equal(events.get('DOMContentLoaded').options.once, true);
      events.get('DOMContentLoaded').handler();
      assert.equal(scrolls.length, 1);
      assert.equal(scrolls[0].top, 0); assert.equal(scrolls[0].left, 0); assert.equal(scrolls[0].behavior, 'instant');
      assert.equal(events.get('load').options.once, true);
      events.get('load').handler();
      assert.equal(history.scrollRestoration, 'manual', 'Hold restoration through the first settled layout frame');
      assert.equal(frames.length, 1);
      frames[0]();
      assert.equal(history.scrollRestoration, 'auto');
    } else {
      assert.deepEqual(calls, []); assert.deepEqual(scrolls, []);
      assert.equal(history.scrollRestoration, 'auto'); assert.equal(events.size, 0);
    }
  }
});

test('prepaint guards ordinary input without skipping; browser shortcuts and fail-open remain native', () => {
  const html = readFileSync(new URL('../templates/quiet/index.html', import.meta.url), 'utf8');
  const scripts = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)];
  const bootstrap = scripts[1][1];
  assert.ok(html.indexOf('html[data-entry-boot="pending"]::before') < html.indexOf('<body>'));
  assert.ok(html.includes('entry-boot-fail-open 1200ms step-end forwards'));
  for (const options of [{}, { reload: true, seen: true }, { seen: true }, { reduced: true }, { hidden: true }, { hash: '#work' }, { returning: true }, { denied: true, reload: true }]) {
    const root = { dataset: {} };
    const events = new Map();
    const timers = [];
    const listenerOptions = new Map();
    let now = 100;
    let observerCallback;
    let disconnected = false;
    const media = { matches: Boolean(options.reduced), addEventListener: (name, handler) => events.set(`media:${name}`, handler) };
    const add = (name, handler, config) => { events.set(name, handler); listenerOptions.set(name, config); };
    runInNewContext(bootstrap, {
      document: { documentElement: root, hidden: Boolean(options.hidden), addEventListener: add },
      window: { addEventListener: add }, location: { hash: options.hash || '' },
      performance: { now: () => now, getEntriesByType: () => [{ type: options.returning ? 'back_forward' : options.reload ? 'reload' : 'navigate' }] },
      Element: { prototype: { animate() {} } }, matchMedia: () => media,
      sessionStorage: { getItem: () => { if (options.denied) throw new Error('Denied'); return options.seen ? 'seen' : null; } },
      AbortController, MutationObserver: class { constructor(callback) { observerCallback = callback; } observe() {} disconnect() { disconnected = true; } },
      setTimeout: (handler, delay) => { timers.push({ handler, delay }); return 1; }, clearTimeout() {},
    });
    const allowed = !options.denied && !options.reduced && !options.hidden && !options.hash && !options.returning && (!options.seen || options.reload);
    assert.equal(root.dataset.entryBoot, allowed ? 'pending' : 'bypassed');
    if (allowed) {
      assert.equal(timers[0].delay, 1200);
      for (const type of ['keydown', 'pointerdown', 'click', 'touchstart', 'touchmove', 'wheel']) {
        let prevented = false; let stopped = false;
        events.get(type)({ type, key: 'Tab', preventDefault() { prevented = true; }, stopImmediatePropagation() { stopped = true; } });
        assert.equal(root.dataset.entryBoot, 'pending', `${type} must not skip preparation`);
        assert.ok(prevented && stopped);
        assert.equal(listenerOptions.get(type).passive, false);
      }
      assert.ok(!events.has('focusin'), 'Focus itself no longer dismisses the welcome');
      for (const shortcut of [{ ctrlKey: true, key: 'r' }, { metaKey: true, key: 'l' }, { altKey: true, key: 'ArrowLeft' }, { key: 'F5' }]) {
        events.get('keydown')({ type: 'keydown', ...shortcut, preventDefault() { assert.fail('Browser shortcut consumed'); }, stopImmediatePropagation() { assert.fail('Browser shortcut consumed'); } });
      }
      now = 1200;
      events.get('keydown')({ type: 'keydown', key: 'Tab', preventDefault() { assert.fail('Late input consumed'); }, stopImmediatePropagation() { assert.fail('Late input consumed'); } });
      assert.equal(root.dataset.entryBoot, 'bypassed');
      root.dataset.entryBoot = 'pending'; timers[0].handler(); assert.equal(root.dataset.entryBoot, 'bypassed');
      root.dataset.entryBoot = 'playing'; timers[0].handler(); assert.equal(root.dataset.entryBoot, 'playing', 'Startup timeout must not cut the real greeting hold short');
      observerCallback();
      assert.ok(listenerOptions.get('keydown').signal.aborted && disconnected, 'Bootstrap input listeners retire atomically at handoff');
    }
  }
});

test('no-script and CSS failure paths preserve page input without a modal or inert trap', () => {
  const css = readFileSync(new URL('../templates/quiet/styles.css', import.meta.url), 'utf8');
  const main = readFileSync(new URL('../templates/quiet/main.js', import.meta.url), 'utf8');
  const motion = readFileSync(new URL('../templates/quiet/entry-intro.js', import.meta.url), 'utf8');
  assert.ok(css.includes('animation: entry-fail-open 4s step-end forwards'));
  assert.ok(css.includes('visibility: hidden; pointer-events: none;'));
  assert.ok(css.includes('.entry-intro { display: none !important; }'));
  assert.ok(main.includes('initEntryIntro({ locale: getLang() })'));
  assert.ok(main.includes('requestAnimationFrame(start)'));
  assert.ok(!motion.includes('requestAnimationFrame') && !motion.includes('setInterval') && !motion.includes('showModal'));
  assert.ok(!motion.includes("setAttribute('inert'"));
});
