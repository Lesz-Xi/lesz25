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
  const { setup, url = '/', enhanced = true, ...contextOptions } = options;
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
    if (enhanced) await page.locator('.preferences:not([hidden])').waitFor();
    await exercise(page, context);
    assert.deepEqual(errors, []);
    pass(label);
  } finally { await context.close(); }
}
const playing = async page => {
  try { await page.waitForFunction(() => !document.querySelector('#entry-intro').hidden, undefined, { timeout: 6000 }); }
  catch (error) {
    const state = await page.evaluate(() => ({ url: location.href, scroll: scrollY, navigation: performance.getEntriesByType('navigation')[0]?.type, entry: { ...document.querySelector('#entry-intro').dataset }, phases: window.__entryPhases, focus: document.activeElement?.id }));
    throw new Error(`Expected welcome to play: ${JSON.stringify(state)}`, { cause: error });
  }
};
const retired = page => page.waitForFunction(() => document.querySelector('#entry-intro').hidden && document.querySelector('#entry-intro').dataset.state === 'done');
try {
  for (const width of [1440, 390]) for (const theme of ['light', 'dark']) {
    await scenario(`Prepaint ground hides hero through delayed-module handoff at ${width}px/${theme}`, {
      viewport: { width, height: width === 390 ? 844 : 900 }, colorScheme: theme,
      setup: async context => {
        await context.addInitScript(() => {
          window.__entryFrames = [];
          const sample = time => {
            const root = document.documentElement;
            const cover = document.querySelector('#entry-intro');
            if (root && cover) {
              const ground = getComputedStyle(root, '::before');
              const covered = !cover.hidden && getComputedStyle(cover).visibility !== 'hidden';
              const pending = ground.content !== 'none' && ground.visibility !== 'hidden' && ground.position === 'fixed';
              window.__entryFrames.push({ time, boot: root.dataset.entryBoot, covered, pending });
              if (covered || root.dataset.entryBoot === 'bypassed' || root.dataset.entryBoot === 'done') return;
            }
            if (time < 1800) requestAnimationFrame(sample);
          };
          requestAnimationFrame(sample);
        });
        await context.route('**/templates/quiet/entry-intro.js*', async route => {
          await new Promise(resolve => setTimeout(resolve, 450)); await route.fallback().catch(() => {});
        });
      },
    }, async page => {
      await page.waitForFunction(() => document.documentElement.dataset.entryBoot === 'pending');
      const early = await page.evaluate(() => {
        const style = getComputedStyle(document.documentElement, '::before');
        return { background: style.backgroundColor, position: style.position, top: style.top, left: style.left, right: style.right, bottom: style.bottom, visible: style.visibility, caption: document.querySelector('#entry-intro').hidden };
      });
      assert.equal(early.position, 'fixed'); assert.equal(early.visible, 'visible'); assert.equal(early.caption, true);
      for (const edge of ['top', 'left', 'right', 'bottom']) assert.equal(early[edge], '0px');
      assert.equal(early.background, theme === 'dark' ? 'rgb(33, 31, 28)' : 'rgb(244, 244, 245)');
      if (process.env.ENTRY_CAPTURE === '1') {
        const name = `prepaint-${width}-${theme}.png`; await page.screenshot({ path: new URL(name, output).pathname }); report.screenshots.push(name);
      }
      await playing(page);
      await page.waitForFunction(() => window.__entryFrames.some(frame => frame.covered));
      const frames = await page.evaluate(() => window.__entryFrames);
      assert.ok(frames.some(frame => frame.pending && !frame.covered));
      assert.ok(frames.every(frame => frame.covered || frame.pending), `Exposed hero before handoff: ${JSON.stringify(frames)}`);
      assert.equal(await page.evaluate(() => document.documentElement.dataset.entryBoot), 'playing');
      await retired(page);
      assert.equal(await page.evaluate(() => document.documentElement.dataset.entryBoot), 'done');
      await page.reload();
      await playing(page);
      await page.waitForFunction(() => window.__entryFrames.some(frame => frame.covered));
      const reloadFrames = await page.evaluate(() => window.__entryFrames);
      assert.ok(reloadFrames.some(frame => frame.pending && !frame.covered));
      assert.ok(reloadFrames.every(frame => frame.covered || frame.pending), `Reload exposed hero before handoff: ${JSON.stringify(reloadFrames)}`);
      await retired(page);
    });
  }
  await scenario('Pending ground timeout prevents a late module from covering an already revealed page', {
    setup: context => context.route('**/templates/quiet/entry-intro.js*', async route => {
      await new Promise(resolve => setTimeout(resolve, 1450)); await route.fallback().catch(() => {});
    }),
  }, async page => {
    await page.waitForFunction(() => document.documentElement.dataset.entryBoot === 'bypassed');
    await page.waitForTimeout(400);
    assert.equal(await page.locator('#entry-intro').isVisible(), false);
    assert.equal(await page.evaluate(() => getComputedStyle(document.documentElement, '::before').content), 'none');
    await page.locator('#quiet-theme').click();
  });
  await scenario('Critical CSS releases a pending ground even if the bootstrap timer fails', {
    setup: async context => {
      await context.addInitScript(() => {
        const timeout = window.setTimeout.bind(window);
        window.setTimeout = (callback, delay, ...args) => delay === 1200 ? 0 : timeout(callback, delay, ...args);
      });
      await context.route('**/templates/quiet/entry-intro.js*', async route => {
        await new Promise(resolve => setTimeout(resolve, 1650)); await route.fallback().catch(() => {});
      });
    },
  }, async page => {
    await page.waitForFunction(() => document.documentElement.dataset.entryBoot === 'pending');
    await page.waitForFunction(() => getComputedStyle(document.documentElement, '::before').visibility === 'hidden');
    assert.equal(await page.evaluate(() => getComputedStyle(document.documentElement, '::before').pointerEvents), 'none');
    await page.keyboard.press('Tab');
    await page.waitForTimeout(500);
    assert.equal(await page.locator('#entry-intro').isVisible(), false);
  });
  await scenario('Missing main module releases the ground and preserves static English navigation', {
    enhanced: false,
    setup: context => context.route('**/templates/quiet/main.js*', route => route.abort()),
  }, async page => {
    await page.waitForFunction(() => document.documentElement.dataset.entryBoot === 'bypassed');
    assert.equal(await page.locator('#entry-intro').isVisible(), false);
    await page.locator('.hero-work-link[href="#work"]').click();
    await page.waitForURL('**/#work');
    assert.equal(await page.locator('#work').isVisible(), true);
  });
  await scenario('Keys, pointer, touch, wheel and focused activation during preparation do not skip or navigate', {
    setup: context => context.route('**/templates/quiet/entry-intro.js*', async route => {
      await new Promise(resolve => setTimeout(resolve, 800)); await route.fallback().catch(() => {});
    }),
  }, async page => {
    await page.waitForFunction(() => document.documentElement.dataset.entryBoot === 'pending');
    await page.keyboard.press('Tab');
    await page.mouse.click(10, 10);
    await page.mouse.wheel(0, 200);
    await page.locator('body').dispatchEvent('touchstart');
    await page.locator('body').dispatchEvent('touchmove');
    await page.locator('.hero-work-link').focus();
    await page.keyboard.press('Enter');
    await page.locator('.hero-work-link').dispatchEvent('click');
    assert.equal(await page.evaluate(() => document.documentElement.dataset.entryBoot), 'pending');
    assert.equal(await page.evaluate(() => location.hash), '');
    assert.equal(await page.evaluate(() => scrollY), 0);
    await playing(page);
    await retired(page);
    assert.equal(await page.locator('#entry-intro').getAttribute('data-reason'), 'complete');
  });
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
        const buttons = entry.querySelectorAll('button').length;
        return { fidelity: JSON.stringify(nodes(actual)) === JSON.stringify(nodes(expected)), greeting: entry.querySelector('.entry-greeting').textContent, below: greeting.top > art.bottom, center: Math.abs(greeting.x + greeting.width / 2 - art.x - art.width / 2), buttons, overflow: document.documentElement.scrollWidth > innerWidth, locked: Boolean(document.querySelector('[inert]')), opacity: getComputedStyle(entry.querySelector('.entry-caption')).opacity };
      }, source);
      assert.equal(state.fidelity, true, 'Completed SVG has original paths, colors, transforms, gradients and pole stroke');
      assert.equal(state.greeting, 'Magandang araw!');
      assert.equal(state.below, true); assert.ok(state.center < 0.5);
      assert.equal(state.buttons, 0); assert.equal(state.overflow, false); assert.equal(state.locked, false); assert.equal(state.opacity, '1');
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
      await playing(page);
      assert.equal(await page.evaluate(() => performance.getEntriesByType('navigation')[0].type), 'reload');
      assert.equal(await page.evaluate(() => scrollY), 0);
      await retired(page);
      assert.equal(await page.locator('#entry-intro').getAttribute('data-reason'), 'complete');
    });
  }
  await scenario('Tab, typing, activation and scroll keys preserve the full welcome; controls resume after completion', {}, async page => {
    await playing(page);
    assert.equal(await page.locator('#entry-intro button, .entry-skip').count(), 0);
    for (const key of ['Tab', 'Shift+Tab', 'Enter', 'Space', 'a', 'Escape', 'ArrowDown', 'PageDown']) await page.keyboard.press(key);
    assert.equal(await page.locator('#entry-intro').isVisible(), true);
    assert.equal(await page.evaluate(() => document.activeElement === document.body), true);
    await page.locator('.hero-work-link').focus(); // AT/programmatic focus must not shorten the sequence.
    await page.keyboard.press('Enter');
    await page.locator('.hero-work-link').dispatchEvent('click');
    await page.locator('.hero-work-link').evaluate(element => element.blur());
    assert.equal(await page.evaluate(() => location.hash), '');
    assert.equal(await page.evaluate(() => scrollY), 0);
    await retired(page);
    assert.equal(await page.locator('#entry-intro').getAttribute('data-reason'), 'complete');
    assert.deepEqual(await page.evaluate(() => window.__entryPhases), [...FLAG_STEPS.map(step => step.name), 'greeting', 'complete', 'exit']);
    await page.keyboard.press('Tab');
    assert.equal(await page.locator('.cinematic [data-album]').evaluate(element => element === document.activeElement), true, 'Native Tab continues after the programmatically focused hero link');
    await page.locator('#quiet-theme').click();
    assert.equal(await page.locator('html').getAttribute('data-theme'), 'dark');
    await page.locator('.hero-work-link[href="#work"]').click();
    await page.waitForURL('**/#work');
  });
  for (const [width, url] of [[1440, '/?arrival=reload'], [390, '/templates/quiet/?arrival=reload']]) {
    await scenario(`Repeated reload from a section, album or hashless scroll resets hero; Back stays native at ${width}px`, {
      url, viewport: { width, height: width === 390 ? 844 : 900 },
    }, async page => {
      await playing(page);
      await page.mouse.click(10, 10); await retired(page);
      for (const hash of ['#contact', '#album-paris', '']) {
        await page.evaluate(fragment => {
          if (fragment) location.hash = fragment;
          else { history.replaceState(history.state, '', location.pathname + location.search); window.scrollTo(0, document.documentElement.scrollHeight); }
        }, hash);
        if (hash === '#album-paris') await page.locator('#album-viewer:not([hidden])').waitFor();
        await page.waitForFunction(() => scrollY > 200);
        await page.reload();
        await page.locator('.preferences:not([hidden])').waitFor();
        await playing(page);
        assert.equal(await page.evaluate(() => location.hash), '');
        assert.equal(await page.evaluate(() => location.search), '?arrival=reload');
        assert.equal(await page.evaluate(() => scrollY), 0);
        assert.equal(await page.locator('#album-viewer').isVisible(), false);
        await retired(page);
        assert.equal(await page.locator('#entry-intro').getAttribute('data-reason'), 'complete');
        assert.equal(await page.evaluate(() => scrollY), 0);
        assert.equal(await page.evaluate(() => history.scrollRestoration), 'auto');
        assert.equal(await page.locator('#quiet-hero').isVisible(), true);
      }
      await page.locator('.section-nav a[href="#contact"]').click();
      await page.waitForFunction(() => scrollY > 200);
      const before = await page.evaluate(() => scrollY);
      await page.goto(new URL('/templates/quiet/notes.html', origin).href);
      await page.locator('.preferences:not([hidden])').waitFor();
      await page.goBack();
      await page.locator('.preferences:not([hidden])').waitFor();
      assert.equal(await page.evaluate(() => location.hash), '#contact');
      await page.waitForFunction(y => Math.abs(scrollY - y) <= 2, before);
      assert.equal(await page.locator('#entry-intro').isVisible(), false);
      await page.goto(new URL(url, origin).href);
      await page.locator('.preferences:not([hidden])').waitFor();
      await page.waitForTimeout(200);
      assert.equal(await page.locator('#entry-intro').isVisible(), false, 'Normal seen arrivals do not replay');
    });
  }
  for (const [label, options] of [
    ['Reduced motion', { reducedMotion: 'reduce' }],
    ['Missing optional module', { setup: context => context.route('**/templates/quiet/entry-intro.js*', route => route.abort()) }],
    ['Blocked session storage', { setup: context => context.addInitScript(() => { const read = Storage.prototype.getItem; Storage.prototype.getItem = function(key) { if (this === sessionStorage) throw new Error('Denied'); return read.call(this, key); }; }) }],
  ]) await scenario(`${label} still reloads to hero without an animation gate`, { url: '/#contact', ...options }, async page => {
    await page.waitForFunction(() => scrollY > 200);
    await page.reload();
    await page.locator('.preferences:not([hidden])').waitFor();
    await page.waitForTimeout(450);
    assert.equal(await page.evaluate(() => location.hash), '');
    assert.equal(await page.evaluate(() => scrollY), 0);
    assert.equal(await page.locator('#entry-intro').isVisible(), false);
    await page.locator('#quiet-theme').click();
  });
  for (const input of ['click', 'wheel', 'touch']) await scenario(`${input} input does not skip the welcome; complete artwork and greeting hold survive`, {
    hasTouch: input === 'touch',
  }, async page => {
    await playing(page);
    if (input === 'click') {
      await page.mouse.click(10, 10);
      await page.locator('.hero-work-link').dispatchEvent('click'); // Covered AT activation cannot navigate.
    } else if (input === 'wheel') await page.mouse.wheel(0, 200);
    else {
      await page.touchscreen.tap(10, 10);
      await page.locator('#entry-intro').dispatchEvent('touchmove');
    }
    assert.equal(await page.locator('#entry-intro').isVisible(), true);
    assert.equal(await page.evaluate(() => scrollY), 0);
    assert.equal(await page.evaluate(() => location.hash), '');
    await page.waitForFunction(() => document.querySelector('#entry-intro').dataset.phase === 'complete');
    // Interaction during the fully visible hold must not shorten it either.
    await page.mouse.click(10, 10);
    await page.keyboard.press('Enter');
    await retired(page);
    assert.equal(await page.locator('#entry-intro').getAttribute('data-reason'), 'complete');
    assert.deepEqual(await page.evaluate(() => window.__entryPhases), [...FLAG_STEPS.map(step => step.name), 'greeting', 'complete', 'exit']);
    const held = await page.evaluate(() => window.__entryPhaseTimes.find(item => item.phase === 'exit').time - window.__entryPhaseTimes.find(item => item.phase === 'complete').time);
    assert.ok(held >= ENTRY_HOLD - 20, `${input} shortened the greeting hold to ${held}ms`);
    await page.locator('#quiet-theme').click(); // Input listeners must be gone after completion.
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
  await scenario('JS watchdog retires stalled motion and restores keyboard/pointer input', {
    setup: context => context.addInitScript(() => { Element.prototype.animate = () => ({ finished: new Promise(() => {}), cancel() {} }); }),
  }, async page => {
    await playing(page);
    await page.keyboard.press('Tab');
    await page.mouse.click(10, 10);
    assert.equal(await page.locator('#entry-intro').isVisible(), true);
    await retired(page);
    assert.equal(await page.locator('#entry-intro').getAttribute('data-reason'), 'safety-timeout');
    await page.keyboard.press('Tab');
    assert.equal(await page.locator('.skip-link').evaluate(element => element === document.activeElement), true);
    await page.locator('#quiet-theme').click();
  });
  await scenario('Hidden-page interruption still releases the cover and input listeners', {}, async page => {
    await playing(page);
    await page.evaluate(() => {
      Object.defineProperty(document, 'hidden', { configurable: true, get: () => true });
      document.dispatchEvent(new Event('visibilitychange'));
    });
    await retired(page);
    assert.equal(await page.locator('#entry-intro').getAttribute('data-reason'), 'hidden');
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
  for (const locale of Object.keys(COPY).filter(code => code !== 'en')) await scenario(`Localized welcome description without Skip: ${locale}`, {
    setup: context => context.addInitScript(value => localStorage.setItem('rhine-lang', value), locale),
  }, async page => {
    await playing(page);
    assert.equal(await page.locator('.entry-description').textContent(), COPY[locale].entryDescription);
    assert.equal(await page.locator('#entry-intro button, .entry-skip').count(), 0);
    assert.equal(await page.locator('.entry-greeting').getAttribute('lang'), 'fil');
    await page.mouse.click(10, 10); await retired(page);
  });
} finally {
  await browser.close();
  await writeFile(new URL('entry-checks.json', output), JSON.stringify(report, null, 2) + '\n');
}
