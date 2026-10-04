// Uses an existing Vite server only. Never starts one, installs packages or builds.
import assert from 'node:assert/strict';
import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';
import { COPY } from '../templates/quiet/copy.js';
import { FLAG_STEPS, ENTRY_HOLD, ENTRY_SAFETY } from '../templates/quiet/entry-intro.js';
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE ? pathToFileURL(process.env.PLAYWRIGHT_MODULE).href : 'playwright');
const origin = process.env.QUIET_BASE_URL || 'http://localhost:5174';
const output = new URL('../.impeccable/review/', import.meta.url);
await mkdir(output, { recursive: true });
const source = await readFile(new URL('../public/quiet/philippines-flag.svg', import.meta.url), 'utf8');
const browser = await chromium.launch({ headless: true });
const report = { boundary: 'Existing live-Vite Chromium, including emulated mobile and injected failure cases; not production, physical-device, other-engine or independent review.', checks: [], screenshots: [], greetingHolds: [] };
const pass = label => { report.checks.push(label); console.log(`PASS ${label}`); };
async function scenario(label, options, exercise) {
  const { setup, url = '/', ...contextOptions } = options;
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, ...contextOptions });
  const errors = [];
  try {
    await context.addInitScript(() => {
      window.__entryPhases = [];
      window.__entryPhaseTimes = [];
      addEventListener('DOMContentLoaded', () => {
        const entry = document.querySelector('#entry-intro');
        if (entry) new MutationObserver(records => {
          if (records.some(record => record.attributeName === 'data-phase')) {
            window.__entryPhases.push(entry.dataset.phase);
            window.__entryPhaseTimes.push({ phase: entry.dataset.phase, time: performance.now() });
          }
        }).observe(entry, { attributes: true });
      });
    });
    if (setup) await setup(context);
    const page = await context.newPage();
    page.on('pageerror', error => errors.push(error.message));
    await page.goto(new URL(url, origin).href);
    await page.locator('.preferences:not([hidden])').waitFor();
    await exercise(page, context);
    assert.deepEqual(errors, []);
    pass(label);
  } finally { await context.close(); }
}
const playing = page => page.waitForFunction(() => !document.querySelector('#entry-intro').hidden);
const retired = page => page.waitForFunction(() => document.querySelector('#entry-intro').hidden && document.querySelector('#entry-intro').dataset.state === 'done');
try {
  for (const width of [1440, 390]) for (const theme of ['light', 'dark']) {
    await scenario(`Sequential SVG → sun → three stars → greeting → clean exit at ${width}px/${theme}`, {
      viewport: { width, height: width === 390 ? 844 : 900 }, colorScheme: theme,
      setup: context => context.addInitScript(value => localStorage.setItem('rhine-quiet-theme', value), theme),
    }, async page => {
      await page.waitForFunction(() => document.querySelector('#entry-intro').dataset.phase === 'complete' && !document.querySelector('#entry-intro').hidden);
      const state = await page.evaluate(text => {
        const entry = document.querySelector('#entry-intro');
        const actual = entry.querySelector('svg');
        const expected = new DOMParser().parseFromString(text, 'image/svg+xml').documentElement;
        // Chromium may retain an empty style attribute on an animated SVG group;
        // it has no declarations and is not an artwork/geometry change.
        const nodes = svg => [...svg.querySelectorAll('*')].map(node => [node.localName, [...node.attributes].filter(attr => !(attr.name === 'style' && !attr.value.trim())).map(attr => [attr.name, attr.value]).sort()]);
        const art = entry.querySelector('.entry-artwork').getBoundingClientRect();
        const greeting = entry.querySelector('.entry-greeting').getBoundingClientRect();
        const skip = entry.querySelector('.entry-skip').getBoundingClientRect();
        return { fidelity: JSON.stringify(nodes(actual)) === JSON.stringify(nodes(expected)), greeting: entry.querySelector('.entry-greeting').textContent, below: greeting.top > art.bottom, center: Math.abs(greeting.x + greeting.width / 2 - art.x - art.width / 2), skipHeight: skip.height, overflow: document.documentElement.scrollWidth > innerWidth, locked: Boolean(document.querySelector('[inert]')), opacity: getComputedStyle(entry.querySelector('.entry-caption')).opacity };
      }, source);
      assert.equal(state.fidelity, true, 'Completed SVG has original paths, colors, transforms, gradients and pole stroke');
      assert.equal(state.greeting, 'Magandang araw!');
      assert.equal(state.below, true); assert.ok(state.center < 0.5);
      assert.ok(state.skipHeight >= 44); assert.equal(state.overflow, false); assert.equal(state.locked, false); assert.equal(state.opacity, '1');
      if (process.env.ENTRY_CAPTURE === '1') {
        const name = `entry-${width}-${theme}.png`;
        await page.screenshot({ path: new URL(name, output).pathname, animations: 'allow' });
        report.screenshots.push(name);
      }
      const remaining = await page.evaluate(() => {
        const complete = window.__entryPhaseTimes.find(item => item.phase === 'complete');
        return Math.max(0, complete.time + 1300 - performance.now());
      });
      await page.waitForTimeout(remaining);
      assert.equal(await page.locator('#entry-intro').isVisible(), true, 'Complete greeting remains visible beyond the old three-second fallback');
      assert.equal(await page.locator('#entry-intro').getAttribute('data-phase'), 'complete');
      await retired(page);
      const held = await page.evaluate(() => {
        const complete = window.__entryPhaseTimes.find(item => item.phase === 'complete');
        const exit = window.__entryPhaseTimes.find(item => item.phase === 'exit');
        return exit.time - complete.time;
      });
      report.greetingHolds.push({ width, theme, milliseconds: held });
      assert.ok(held >= ENTRY_HOLD - 20, `Greeting held ${held}ms, expected at least ${ENTRY_HOLD}ms within observer tolerance`);
      assert.equal(await page.locator('#entry-intro').getAttribute('data-reason'), 'complete');
      assert.deepEqual(await page.evaluate(() => window.__entryPhases), [...FLAG_STEPS.map(step => step.name), 'greeting', 'complete', 'exit']);
      assert.equal(await page.locator('.entry-artwork svg, .location-flag').count(), 0);
      await page.reload();
      await page.locator('.preferences:not([hidden])').waitFor();
      assert.equal(await page.locator('#entry-intro').isVisible(), false);
    });
  }
  await scenario('Skip and keyboard focus retire the SVG and preserve native page controls', {}, async page => {
    await playing(page);
    await page.locator('.entry-skip').focus();
    await page.keyboard.press('Enter');
    await retired(page);
    assert.equal(await page.locator('#main').evaluate(element => element === document.activeElement), true);
    assert.equal(await page.evaluate(() => scrollY), 0);
    await page.locator('#quiet-theme').click();
    assert.equal(await page.locator('html').getAttribute('data-theme'), 'dark');
    await page.locator('.button[href="#work"]').click();
    await page.waitForURL('**/#work');
  });
  await scenario('Denied session-storage writes bypass entry rather than replaying on every arrival', {
    setup: context => context.addInitScript(() => {
      const write = Storage.prototype.setItem;
      Storage.prototype.setItem = function(key, value) {
        if (this === sessionStorage) throw new Error('Injected session write denial');
        return write.call(this, key, value);
      };
    }),
  }, async page => {
    await retired(page);
    assert.equal(await page.locator('#entry-intro').getAttribute('data-reason'), 'storage');
    await page.locator('#quiet-theme').click();
  });
  await scenario('Reduced motion bypasses both veil and SVG request', { reducedMotion: 'reduce' }, async page => {
    assert.equal(await page.locator('#entry-intro').isVisible(), false);
    await page.waitForTimeout(150);
    assert.equal(await page.evaluate(() => performance.getEntriesByType('resource').some(entry => entry.name.endsWith('/quiet/philippines-flag.svg'))), false);
  });
  await scenario('Live reduced-motion changes cancel active motion immediately', {}, async page => {
    await playing(page); await page.emulateMedia({ reducedMotion: 'reduce' }); await retired(page);
    assert.equal(await page.locator('#entry-intro').getAttribute('data-reason'), 'reduced-motion');
  });
  await scenario('Deep-linked albums bypass entry and preserve their focus/state', { url: '/#album-paris' }, async page => {
    await page.locator('#album-viewer:not([hidden])').waitFor();
    assert.equal(await page.locator('#entry-intro').isVisible(), false);
    assert.equal(await page.locator('#album-heading').evaluate(element => element === document.activeElement), true);
  });
  await scenario('404 artwork fails open without trapping input', { setup: context => context.route('**/quiet/philippines-flag.svg', route => route.fulfill({ status: 404, body: '' })) }, async page => {
    await retired(page); assert.equal(await page.locator('#entry-intro').getAttribute('data-reason'), 'failure');
    await page.locator('#quiet-mode').click(); assert.equal(await page.locator('#quiet-dev').isVisible(), true);
  });
  await scenario('Delayed artwork is abandoned rather than hiding a ready page', { setup: context => context.route('**/quiet/philippines-flag.svg', async route => {
    await new Promise(resolve => setTimeout(resolve, 650)); await route.fallback().catch(() => {});
  }) }, async page => {
    await retired(page); assert.equal(await page.locator('#entry-intro').getAttribute('data-reason'), 'asset-timeout');
    await page.locator('#quiet-theme').click();
  });
  await scenario('Missing optional motion module does not disable portfolio enhancement', { setup: context => context.route('**/templates/quiet/entry-intro.js*', route => route.abort()) }, async page => {
    assert.equal(await page.locator('#entry-intro').isVisible(), false);
    await page.locator('#quiet-mode').click(); assert.equal(await page.locator('#quiet-dev').isVisible(), true);
  });
  await scenario('Thrown animation failure releases cover without uncaught errors', { setup: context => context.addInitScript(() => { Element.prototype.animate = () => { throw new Error('Injected animation failure'); }; }) }, async page => {
    await retired(page); assert.equal(await page.locator('#entry-intro').getAttribute('data-reason'), 'failure');
    await page.locator('#quiet-theme').click();
  });
  await scenario('CSS independently removes a stalled cover even if the JS watchdog fails', { setup: context => context.addInitScript(safety => {
    Element.prototype.animate = () => ({ finished: new Promise(() => {}), cancel() {} });
    const timeout = window.setTimeout.bind(window);
    window.setTimeout = (callback, delay, ...args) => delay === safety ? 0 : timeout(callback, delay, ...args);
  }, ENTRY_SAFETY) }, async page => {
    await playing(page);
    await page.waitForFunction(() => getComputedStyle(document.querySelector('#entry-intro')).visibility === 'hidden', undefined, { timeout: 5000 });
    assert.equal(await page.locator('#entry-intro').evaluate(element => getComputedStyle(element).pointerEvents), 'none');
    await page.locator('#quiet-theme').click(); await retired(page);
  });
  await scenario('Hash interruption retires finite motion without changing the destination', {}, async page => {
    await playing(page); await page.evaluate(() => { location.hash = 'about'; }); await retired(page);
    assert.equal(await page.locator('#entry-intro').getAttribute('data-reason'), 'route');
    assert.ok(page.url().endsWith('#about'));
  });
  await scenario('Native navigation away and Back do not strand or replay the welcome', {}, async page => {
    await playing(page);
    await page.goto(new URL('/templates/quiet/notes.html', origin).href);
    await page.locator('.preferences:not([hidden])').waitFor();
    await page.goBack();
    await page.locator('.preferences:not([hidden])').waitFor();
    assert.equal(await page.locator('#entry-intro').isVisible(), false);
    assert.equal(await page.locator('.entry-artwork svg').count(), 0);
    await page.locator('#quiet-theme').click();
  });
  for (const locale of ['de', 'fr', 'it', 'zh']) await scenario(`Localized welcome description and Skip: ${locale}`, {
    setup: context => context.addInitScript(value => localStorage.setItem('rhine-lang', value), locale),
  }, async page => {
    await playing(page);
    assert.equal(await page.locator('.entry-description').textContent(), COPY[locale].entryDescription);
    assert.equal(await page.locator('.entry-skip').textContent(), COPY[locale].entrySkip);
    assert.equal(await page.locator('.entry-greeting').getAttribute('lang'), 'fil');
    await page.locator('.entry-skip').click(); await retired(page);
  });
} finally {
  await browser.close();
  await writeFile(new URL('entry-checks.json', output), JSON.stringify(report, null, 2) + '\n');
}
