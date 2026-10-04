// Focused Reveal Hero adaptation checks on an existing Vite server only.
import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';
import { HERO_DURATION, HERO_SAFETY } from '../templates/quiet/hero-reveal.js';
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE ? pathToFileURL(process.env.PLAYWRIGHT_MODULE).href : 'playwright');
const origin = process.env.QUIET_BASE_URL || 'http://localhost:5174';
const output = new URL('../.impeccable/review/', import.meta.url);
await mkdir(output, { recursive: true });
const browser = await chromium.launch({ headless: true });
const report = { boundary: 'Existing live-Vite Chromium/emulated mobile and injected failure cases. Not hosted, independent, physical-device or performance certification.', checks: [], screenshots: [] };
const pass = label => { report.checks.push(label); console.log(`PASS ${label}`); };
async function scenario(label, options, exercise) {
  const { setup, url = '/', ...settings } = options;
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, ...settings });
  try {
    await context.addInitScript(() => {
      window.__heroTrace = [];
      addEventListener('DOMContentLoaded', () => {
        new MutationObserver(records => {
          if (!records.some(record => record.attributeName === 'data-hero-reveal')) return;
          const cover = document.querySelector('#entry-intro');
          const image = document.querySelector('.cinematic img');
          window.__heroTrace.push({ state: document.documentElement.dataset.heroReveal, reason: document.documentElement.dataset.heroReason, entry: document.documentElement.dataset.entryBoot, phase: cover?.dataset.phase, hidden: cover?.hidden, opacity: cover ? getComputedStyle(cover).opacity : null, clip: image ? getComputedStyle(image).clipPath : null, time: performance.now() });
        }).observe(document.documentElement, { attributes: true, attributeFilter: ['data-hero-reveal'] });
      }, { once: true });
    });
    if (setup) await setup(context);
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto(new URL(url, origin).href);
    await page.locator('.preferences:not([hidden])').waitFor();
    await exercise(page, context);
    assert.deepEqual(errors, []);
    pass(label);
  } finally { await context.close(); }
}
const playing = page => page.waitForFunction(() => document.documentElement.dataset.heroReveal === 'playing', undefined, { timeout: 8000 });
const settled = page => page.waitForFunction(() => ['done', 'bypassed'].includes(document.documentElement.dataset.heroReveal), undefined, { timeout: 8000 });
const welcomeDone = page => page.waitForFunction(() => ['done', 'bypassed'].includes(document.documentElement.dataset.entryBoot), undefined, { timeout: 8000 });
const inset = value => {
  const values = value.match(/^inset\(([\d.% ]+)\)$/)?.[1].trim().split(/\s+/).map(Number.parseFloat);
  assert.ok(values?.length, `Expected a percentage inset: ${value}`);
  const [top, right = top, bottom = top, left = right] = values;
  return [top, right, bottom, left];
};
async function nativeRest(page) {
  assert.deepEqual(await page.locator('.cinematic img').evaluate(image => ({ clip: getComputedStyle(image).clipPath, transform: getComputedStyle(image).transform, style: image.getAttribute('style'), active: image.getAnimations().length })), { clip: 'none', transform: 'none', style: null, active: 0 });
  assert.equal(await page.locator('.intro h1').evaluate(el => getComputedStyle(el).transform), 'none');
  assert.equal(await page.locator('.intro > p').evaluate(el => getComputedStyle(el).transform), 'none');
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
}
try {
  for (const locale of ['en', 'de', 'fr', 'it', 'zh', 'ja']) {
    for (const width of [1440, 390]) for (const theme of ['light', 'dark']) {
      await scenario(`Welcome → horizon reveal → native rest: ${locale}/${width}/${theme}`, {
        viewport: { width, height: width === 390 ? 844 : 900 }, colorScheme: theme,
        setup: context => context.addInitScript(({ locale, theme }) => { localStorage.setItem('rhine-lang', locale); localStorage.setItem('rhine-quiet-theme', theme); }, { locale, theme }),
      }, async page => {
        await playing(page);
        assert.equal(await page.locator('#entry-intro').isHidden(), true);
        const motion = await page.locator('.cinematic img').evaluate(image => ({ clip: getComputedStyle(image).clipPath, transform: getComputedStyle(image).transform, animations: image.getAnimations().map(a => ({ duration: a.effect.getTiming().duration, frames: a.effect.getKeyframes().map(f => f.clipPath) })) }));
        assert.notEqual(motion.clip, 'none');
        assert.equal(motion.transform, 'none'); // No Lab image zoom or new crop at rest.
        assert.equal(motion.animations[0].duration, HERO_DURATION);
        assert.deepEqual(motion.animations[0].frames.map(inset), [[48, 44, 48, 44], [44, 0, 44, 0], [0, 0, 0, 0]]);
        if (process.env.HERO_CAPTURE === '1' && locale === 'en') {
          await page.locator('.cinematic img').evaluate((image, duration) => { const animation = image.getAnimations()[0]; animation.pause(); animation.currentTime = duration * .58; }, HERO_DURATION);
          const name = `hero-horizon-${width}-${theme}-opening.png`;
          await page.screenshot({ path: new URL(name, output).pathname });
          report.screenshots.push(name);
          await page.locator('.cinematic img').evaluate(image => image.getAnimations()[0].play());
        }
        await settled(page);
        assert.equal(await page.locator('html').getAttribute('data-hero-reason'), 'complete');
        await nativeRest(page);
        const trace = await page.evaluate(() => window.__heroTrace);
        const prepared = trace.find(t => t.state === 'prepared');
        assert.equal(prepared.entry, 'playing');
        assert.equal(prepared.phase, 'exit');
        assert.equal(prepared.hidden, false);
        assert.equal(prepared.opacity, '1');
        assert.deepEqual(inset(prepared.clip), [48, 44, 48, 44]);
        const started = trace.find(t => t.state === 'playing');
        assert.equal(started.entry, 'done');
        assert.equal(started.hidden, true);
        assert.equal(trace.filter(t => t.state === 'playing').length, 1);
        if (process.env.HERO_CAPTURE === '1' && locale === 'en') {
          const name = `hero-horizon-${width}-${theme}-rest.png`;
          await page.screenshot({ path: new URL(name, output).pathname, animations: 'disabled' });
          report.screenshots.push(name);
        }
      });
    }
  }
  for (const gesture of ['wheel', 'keyboard', 'click', 'touch', 'resize']) {
    await scenario(`Hero yields immediately to ${gesture}; native input remains usable`, { ...(gesture === 'touch' ? { hasTouch: true, isMobile: true, viewport: { width: 390, height: 844 } } : {}) }, async page => {
      await playing(page);
      if (gesture === 'wheel') await page.mouse.wheel(0, 500);
      if (gesture === 'keyboard') await page.keyboard.press('Tab');
      if (gesture === 'click') await page.locator('.hero-work-link').click();
      if (gesture === 'touch') await page.locator('#quiet-theme').tap();
      if (gesture === 'resize') await page.setViewportSize({ width: 768, height: 900 });
      await settled(page);
      assert.notEqual(await page.locator('html').getAttribute('data-hero-reason'), 'complete');
      await nativeRest(page);
      if (gesture === 'wheel') { await page.waitForTimeout(150); assert.ok(await page.evaluate(() => scrollY > 0)); }
      if (gesture === 'keyboard') assert.notEqual(await page.evaluate(() => document.activeElement.tagName), 'BODY');
      if (gesture === 'click') assert.equal(await page.evaluate(() => location.hash === '#work' && document.activeElement.id === 'work-heading'), true);
      if (gesture === 'touch') assert.equal(await page.locator('html').getAttribute('data-theme'), 'dark');
    });
  }
  await scenario('Live reduced motion settles the active mask without hiding content', {}, async page => {
    await playing(page); await page.emulateMedia({ reducedMotion: 'reduce' }); await settled(page);
    assert.equal(await page.locator('html').getAttribute('data-hero-reason'), 'reduced-motion'); await nativeRest(page);
  });
  await scenario('Language repaint settles the old hero and never animates detached or translated nodes', {}, async page => {
    await playing(page); await page.selectOption('#language', 'ja'); await settled(page);
    assert.equal(await page.locator('html').getAttribute('lang'), 'ja'); await nativeRest(page);
    assert.equal(await page.locator('html').getAttribute('data-hero-reason'), 'language');
  });
  await scenario('Programmatic Dev entry retires the hero before hiding the GUI', {}, async page => {
    await playing(page); await page.locator('#quiet-mode').evaluate(button => button.click()); await settled(page);
    assert.equal(await page.locator('#quiet-gui').isHidden(), true);
    assert.equal(await page.locator('html').getAttribute('data-hero-reason'), 'mode');
    await page.locator('#quiet-gui-control').click(); await nativeRest(page);
  });
  await scenario('Theme token changes during the reveal preserve its ownership and resting frame', {}, async page => {
    await playing(page);
    await page.evaluate(() => { document.documentElement.dataset.theme = 'dark'; });
    await settled(page); await nativeRest(page);
    assert.equal(await page.locator('html').getAttribute('data-hero-reason'), 'complete');
    assert.equal(await page.locator('body').evaluate(el => getComputedStyle(el).backgroundColor), 'rgb(33, 31, 28)');
  });
  for (const mode of ['missing', 'late', 'slow-image', 'failed-image', 'entry-failure']) {
    await scenario(`${mode} optional readiness never collapses a visible page`, { setup: async context => {
      if (mode === 'missing') await context.route('**/hero-reveal.js', route => route.abort());
      if (mode === 'late') await context.route('**/hero-reveal.js', async route => { await new Promise(r => setTimeout(r, 4300)); await route.continue(); });
      if (mode === 'slow-image') await context.route('**/quiet/switzerland-wide*.webp', async route => { await new Promise(r => setTimeout(r, 4300)); await route.continue(); });
      if (mode === 'failed-image') await context.route('**/quiet/switzerland-wide*.webp', route => route.abort());
      if (mode === 'entry-failure') await context.route('**/quiet/philippines-flag.svg', route => route.abort());
    } }, async page => {
      await welcomeDone(page);
      if (mode === 'late' || mode === 'slow-image') await page.waitForTimeout(4500);
      assert.equal((await page.evaluate(() => window.__heroTrace)).some(t => t.state === 'playing' || t.state === 'prepared'), false);
      await nativeRest(page);
    });
  }
  await scenario('A partially thrown hero animation restores the photograph and healthy welcome', { setup: context => context.addInitScript(() => {
    const animate = Element.prototype.animate;
    Element.prototype.animate = function(...args) { if (this.matches('.intro h1')) throw new Error('Injected hero failure'); return animate.apply(this, args); };
  }) }, async page => {
    await welcomeDone(page); await settled(page); await nativeRest(page);
    assert.equal(await page.locator('#entry-intro').getAttribute('data-reason'), 'complete');
    assert.equal(await page.locator('html').getAttribute('data-hero-reason'), 'failure');
  });
  await scenario('The hero watchdog releases a deliberately stalled animation', { setup: context => context.addInitScript(() => {
    const animate = Element.prototype.animate;
    Element.prototype.animate = function(...args) { const animation = animate.apply(this, args); if (this.matches('.cinematic img')) animation.play = () => {}; return animation; };
  }) }, async page => {
    await playing(page); await settled(page); await nativeRest(page);
    assert.equal(await page.locator('html').getAttribute('data-hero-reason'), 'safety-timeout');
  });
  for (const options of [{ reducedMotion: 'reduce' }, { url: '/#work' }, { setup: context => context.addInitScript(() => sessionStorage.setItem('rhine-quiet-welcome-v1', 'seen')) }]) {
    await scenario('Reduced motion, deep links and seen arrivals do not replay a reveal', options, async page => {
      await welcomeDone(page); await nativeRest(page);
      assert.equal((await page.evaluate(() => window.__heroTrace)).some(t => t.state === 'prepared' || t.state === 'playing'), false);
    });
  }
  await scenario('Explicit reload replays the welcome/reveal pair; ordinary return remains native', {}, async page => {
    await settled(page); await nativeRest(page);
    await page.goto(new URL('/#work', origin).href); await page.reload(); await playing(page); await settled(page);
    assert.equal(await page.evaluate(() => location.hash), '');
    assert.equal(await page.locator('html').getAttribute('data-hero-reason'), 'complete');
    await page.goto(new URL('/templates/quiet/notes.html', origin).href);
    await page.goBack(); await welcomeDone(page); await nativeRest(page);
    assert.equal((await page.evaluate(() => window.__heroTrace)).some(t => t.state === 'playing'), false);
  });
} finally {
  await browser.close();
  await writeFile(new URL('hero-reveal-checks.json', output), JSON.stringify(report, null, 2));
}
