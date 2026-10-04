import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
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

test('deep links, reduced motion, hidden pages, repeat visits and Back bypass entry', () => {
  assert.equal(shouldPlayEntry({}), true);
  for (const input of [{ hash: '#about' }, { hash: '#album-paris' }, { reduced: true }, { hidden: true }, { seen: true }, { returning: true }]) assert.equal(shouldPlayEntry(input), false);
});

test('no-script and CSS failure paths preserve page input without a modal or inert trap', () => {
  const css = readFileSync(new URL('../templates/quiet/styles.css', import.meta.url), 'utf8');
  const main = readFileSync(new URL('../templates/quiet/main.js', import.meta.url), 'utf8');
  const motion = readFileSync(new URL('../templates/quiet/entry-intro.js', import.meta.url), 'utf8');
  assert.ok(css.includes('animation: entry-fail-open 4s step-end forwards'));
  assert.ok(css.includes('visibility: hidden; pointer-events: none;'));
  assert.ok(css.includes('.entry-intro { display: none !important; }'));
  assert.ok(main.includes('initEntryIntro({ locale: getLang() })'));
  assert.ok(!motion.includes('requestAnimationFrame') && !motion.includes('setInterval') && !motion.includes('showModal'));
  assert.ok(!motion.includes("setAttribute('inert'"));
});
