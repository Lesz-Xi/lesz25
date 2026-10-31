// Source-served Chromium verification; no server, build, install or external fetch.
import assert from 'node:assert/strict';
import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { resolve, extname, sep } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE ? pathToFileURL(process.env.PLAYWRIGHT_MODULE).href : 'playwright');
const root = resolve(fileURLToPath(new URL('../', import.meta.url)));
const output = resolve(root, '.impeccable/review');
await mkdir(output, { recursive: true });
const origin = 'http://rhine.test';
const mime = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.webp': 'image/webp', '.png': 'image/png', '.svg': 'image/svg+xml' };
const browser = await chromium.launch({ headless: true });
const checks = [];
async function scenario(name, exercise, { setup, delay = 0, missing = '', url = '/', ...settings } = {}) {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, ...settings });
  try {
    await ctx.route('**/*', async route => {
      const url = new URL(route.request().url());
      if (url.origin !== origin) return route.abort();
      const pathname = decodeURIComponent(url.pathname).replace(/\/$/, '/index.html');
      if (missing && pathname.endsWith(missing)) return route.abort();
      if (delay && pathname.endsWith('/hero-reveal.js')) await new Promise(resolve => setTimeout(resolve, delay));
      for (const base of [root, resolve(root, 'public')]) {
        const path = resolve(base, pathname.slice(1));
        if (!path.startsWith(base + sep)) continue;
        try {
          return await route.fulfill({ contentType: mime[extname(path)] || 'application/octet-stream', body: await readFile(path) });
        } catch { /* Try the public root. */ }
      }
      return route.fulfill({ status: 404, body: 'Not found' });
    });
    await ctx.addInitScript(() => {
      window.__heroFrames = [];
      function sample() {
        const image = document.querySelector('#quiet-hero .cinematic img');
        const boot = document.documentElement?.dataset.heroBoot;
        if (image) window.__heroFrames.push({ boot, state: document.documentElement.dataset.heroReveal, clip: getComputedStyle(image).clipPath, time: performance.now() });
        if (performance.now() < 3200) requestAnimationFrame(sample);
      }
      requestAnimationFrame(sample);
    });
    if (setup) await setup(ctx);
    const page = await ctx.newPage();
    const errors = [], requests = [];
    page.on('pageerror', error => errors.push(error.message));
    page.on('request', request => requests.push(request.url()));
    await page.goto(new URL(url, origin).href, { waitUntil: 'domcontentloaded' });
    try { await exercise(page, ctx); } catch (error) {
      console.error(name, await page.evaluate(() => ({ state: { ...document.documentElement.dataset }, time: performance.now(), frames: window.__heroFrames, image: { complete: document.querySelector('.cinematic img')?.complete, src: document.querySelector('.cinematic img')?.currentSrc } })), errors);
      throw error;
    }
    assert.equal(await page.locator('#entry-intro').count(), 0);
    assert.ok(!requests.some(url => /entry-intro|entry-greeting|philippines-flag/.test(url)));
    assert.deepEqual(errors, []);
    checks.push(name);
    console.log(`PASS ${name}`);
  } finally { await ctx.close(); }
}
const inset = value => {
  const [top, right = top, bottom = top, left = right] = value.match(/[\d.]+%/g).map(Number.parseFloat);
  return [top, right, bottom, left];
};
const playing = page => page.waitForFunction(() => document.documentElement.dataset.heroReveal === 'playing');
const settled = page => page.waitForFunction(() => !document.documentElement.dataset.heroBoot);
async function rest(page) {
  await settled(page);
  assert.deepEqual(await page.locator('#quiet-hero .cinematic img').evaluate(image => ({ clip: getComputedStyle(image).clipPath, transform: getComputedStyle(image).transform, animations: image.getAnimations().length, style: image.getAttribute('style') })), { clip: 'none', transform: 'none', animations: 0, style: null });
  for (const selector of ['.intro h1', '.intro > p']) assert.equal(await page.locator(selector).evaluate(node => getComputedStyle(node).transform), 'none');
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
}
try {
  for (const width of [1440, 390]) for (const theme of ['light', 'dark']) {
    await scenario(`Standalone horizon reveal, completion and reload: ${width}/${theme}`, async page => {
      await playing(page);
      const image = page.locator('#quiet-hero .cinematic img');
      const motion = await image.evaluate(image => image.getAnimations().find(animation => animation.effect.getKeyframes().length === 3)?.effect.getKeyframes().map(frame => frame.clipPath));
      assert.deepEqual(motion?.map(inset), [[48, 44, 48, 44], [44, 0, 44, 0], [0, 0, 0, 0]]);
      assert.equal(await page.locator('#intro-heading').isVisible(), true);
      if (process.env.HERO_CAPTURE === '1') await page.screenshot({ path: resolve(output, `hero-standalone-${width}-${theme}-motion.png`), animations: 'allow' });
      await rest(page);
      assert.equal(await page.locator('html').getAttribute('data-hero-reason'), 'complete');
      const frames = await page.evaluate(() => window.__heroFrames);
      assert.ok(frames.some(frame => frame.boot === 'pending' || frame.state === 'playing'));
      assert.ok(new Set(frames.filter(frame => frame.state === 'playing').map(frame => frame.clip)).size > 3, 'Native frames actually progress through the aperture');
      assert.ok(frames.filter(frame => frame.boot === 'pending').every(frame => JSON.stringify(inset(frame.clip)) === '[48,44,48,44]'), 'No full-photo flash during first-frame preparation');
      if (process.env.HERO_CAPTURE === '1') await page.screenshot({ path: resolve(output, `hero-standalone-${width}-${theme}-rest.png`), animations: 'allow' });
      await page.reload({ waitUntil: 'domcontentloaded' });
      await playing(page);
      await rest(page);
      assert.equal(await page.locator('html').getAttribute('data-hero-reason'), 'complete');
    }, { viewport: { width, height: width === 390 ? 664 : 900 }, colorScheme: theme, hasTouch: width === 390 });
  }
  for (const locale of ['en', 'de', 'fr', 'it', 'zh', 'ja']) {
    await scenario(`Localized entrance and language replacement: ${locale}`, async page => {
      await playing(page);
      await page.selectOption('#language', locale === 'en' ? 'de' : 'en');
      await rest(page);
    }, { setup: ctx => ctx.addInitScript(locale => localStorage.setItem('rhine-lang', locale), locale) });
  }
  for (const gesture of ['keyboard', 'pointer', 'wheel', 'touch', 'click', 'resize', 'route', 'reduced', 'dev']) {
    await scenario(`Immediate native interruption: ${gesture}`, async page => {
      await playing(page);
      if (gesture === 'keyboard') await page.keyboard.press('Tab');
      if (gesture === 'pointer') await page.mouse.click(10, 10);
      if (gesture === 'wheel') await page.mouse.wheel(0, 400);
      if (gesture === 'touch') await page.touchscreen.tap(10, 10);
      if (gesture === 'click') await page.locator('.hero-work-link').evaluate(node => node.click());
      if (gesture === 'resize') await page.setViewportSize({ width: 1000, height: 700 });
      if (gesture === 'route') await page.evaluate(() => { location.hash = 'about'; });
      if (gesture === 'reduced') await page.emulateMedia({ reducedMotion: 'reduce' });
      if (gesture === 'dev') await page.locator('#quiet-mode').click();
      await rest(page);
      assert.equal(await page.locator('html').getAttribute('data-hero-reveal'), 'bypassed');
      if (gesture === 'keyboard') assert.notEqual(await page.evaluate(() => document.activeElement.tagName), 'BODY');
      if (gesture === 'click') assert.equal(new URL(page.url()).hash, '#work');
      if (gesture === 'dev') assert.equal(await page.locator('#quiet-gui').isVisible(), false);
    }, { hasTouch: true });
  }
  for (const options of [{ reducedMotion: 'reduce' }, { javaScriptEnabled: false }, { url: '/#work' }, { url: '/templates/quiet/index.html#about' }, { missing: '/hero-reveal.js' }, { missing: '/main.js' }, { delay: 1500 }]) {
    await scenario(`Static fallback: ${JSON.stringify(options)}`, async page => {
      await rest(page);
      await page.waitForTimeout(1600);
      await rest(page);
      assert.notEqual(await page.locator('html').getAttribute('data-hero-reveal'), 'playing');
    }, options);
  }
  await scenario('Slow image decode expires without late re-collapse', async page => {
    await rest(page);
    await page.waitForTimeout(1800);
    await rest(page);
    assert.notEqual(await page.locator('html').getAttribute('data-hero-reason'), 'complete');
  }, { setup: ctx => ctx.addInitScript(() => {
    const decode = HTMLImageElement.prototype.decode;
    HTMLImageElement.prototype.decode = function () { return new Promise(resolve => setTimeout(resolve, 1500)).then(() => decode.call(this)); };
  }) });
  await scenario('Input during delayed preparation wins and does not replay', async page => {
    await page.keyboard.press('Tab');
    await rest(page);
    await page.waitForTimeout(1600);
    await rest(page);
  }, { delay: 1200 });
  await scenario('CSS independently releases the mask if main and JS watchdog are unavailable', async page => {
    await page.waitForTimeout(2400);
    assert.equal(await page.locator('#quiet-hero .cinematic img').evaluate(node => getComputedStyle(node).clipPath), 'none');
    assert.ok(['none', 'matrix(1, 0, 0, 1, 0, 0)'].includes(await page.locator('.intro h1').evaluate(node => getComputedStyle(node).transform)));
    await page.getByRole('link', { name: 'Selected work', exact: true }).click();
    assert.equal(new URL(page.url()).hash, '#work');
  }, { missing: '/main.js', setup: ctx => ctx.addInitScript(() => {
    const timeout = window.setTimeout;
    window.setTimeout = (callback, delay, ...args) => delay === 900 ? 0 : timeout(callback, delay, ...args);
  }) });
  await scenario('Late enhancement cannot re-collapse content even if the startup watchdog is disabled', async page => {
    await page.waitForTimeout(2500);
    await rest(page);
    assert.notEqual(await page.locator('html').getAttribute('data-hero-reason'), 'complete');
    assert.ok(!(await page.evaluate(() => window.__heroFrames)).some(frame => frame.state === 'playing'));
  }, { delay: 2400, setup: ctx => ctx.addInitScript(() => {
    const timeout = window.setTimeout;
    window.setTimeout = (callback, delay, ...args) => delay === 900 ? 0 : timeout(callback, delay, ...args);
  }) });
  await scenario('Native Back does not replay the reveal', async page => {
    await rest(page);
    await page.goto(`${origin}/templates/quiet/notes.html`);
    await page.goBack();
    await rest(page);
    assert.notEqual(await page.locator('html').getAttribute('data-hero-reveal'), 'playing');
  });
  await writeFile(resolve(output, 'hero-standalone-checks.json'), JSON.stringify({ boundary: 'Local source-intercepted Chromium, emulated touch; no build, hosted, other-engine, physical-device or performance certification.', checks }, null, 2));
} finally { await browser.close(); }
