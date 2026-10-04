// Existing live Vite + installed Playwright only; no server start, install or build.
import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';
import { COPY } from '../templates/quiet/copy.js';
const { chromium } = await import(pathToFileURL(process.env.PLAYWRIGHT_MODULE).href);
const origin = process.env.QUIET_BASE_URL || 'http://localhost:5174';
const output = new URL('../.impeccable/review/', import.meta.url);
await mkdir(output, { recursive: true });
const browser = await chromium.launch({ headless: true });
const report = { boundary: 'Local live-Vite Chromium with emulated ja-JP locale, mobile widths and colour schemes. Not hosted deployment, physical-device, other-engine or native-speaker translation verification.', checks: [], screenshots: [] };
const pass = text => { report.checks.push(text); console.log(`PASS ${text}`); };
try {
  const context = await browser.newContext({ locale: 'ja-JP', reducedMotion: 'reduce', viewport: { width: 1440, height: 900 } });
  try {
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto(`${origin}/`);
    await page.locator('.preferences:not([hidden])').waitFor();
    assert.equal(await page.locator('html').getAttribute('lang'), 'ja');
    assert.equal(await page.locator('#language').inputValue(), 'ja');
    assert.equal(await page.locator('#language option').count(), 6);
    assert.equal(await page.locator('#language option[value="ja"]').textContent(), '日本語');
    assert.equal(await page.locator('.hero h1').textContent(), COPY.ja.title);
    assert.equal(await page.locator('#language').getAttribute('aria-label'), '言語');
    pass('ja-JP auto-detection selects 日本語, Japanese hero and language ARIA without a saved preference');

    // A real select operation persists the choice; reload and all shared routes use it.
    await page.selectOption('#language', 'en');
    await page.selectOption('#language', 'ja');
    assert.equal(await page.evaluate(() => localStorage.getItem('rhine-lang')), 'ja');
    await page.reload();
    await page.locator('.preferences:not([hidden])').waitFor();
    assert.equal(await page.locator('#language').inputValue(), 'ja');
    for (const route of ['/templates/quiet/', '/templates/quiet/notes.html', '/templates/quiet/approach.html']) {
      await page.goto(`${origin}${route}`);
      await page.locator('.preferences:not([hidden])').waitFor();
      assert.equal(await page.locator('html').getAttribute('lang'), 'ja');
      assert.equal(await page.locator('#language').inputValue(), 'ja');
      if (route.endsWith('notes.html')) {
        assert.equal(await page.locator('.reading-article').getAttribute('lang'), 'en');
        assert.equal(await page.locator('.note-body > p').count(), 18);
        assert.equal(await page.locator('.reading-end a').textContent(), COPY.ja.backPortfolio);
      }
      if (route.endsWith('approach.html')) {
        assert.equal(await page.locator('.approach-body > p').count(), 3);
        assert.equal(await page.locator('.approach-principles li').count(), 6);
        assert.ok((await page.locator('.approach-body').textContent()).includes('情報の出所'));
      }
    }
    pass('Explicit Japanese persists through reload, the Quiet alias, Notes and Approach; the English essay remains intact');
    await page.goto(`${origin}/templates/ocean/`);
    await page.locator('[data-lang="ja"]').waitFor({ state: 'attached' });
    await page.locator('.lang-trigger').click();
    await page.locator('[data-lang="ja"]').waitFor();
    assert.equal(await page.locator('html').getAttribute('lang'), 'ja');
    assert.equal(await page.locator('.lang-current').textContent(), 'JA');
    assert.equal(await page.locator('[data-lang="ja"] .lang-name').textContent(), '日本語');
    assert.equal(await page.locator('[data-lang="ja"]').getAttribute('aria-selected'), 'true');
    pass('The independent ocean edition shares the Japanese registry and saved choice');

    await page.goto(`${origin}/`);
    await page.locator('.preferences:not([hidden])').waitFor();
    for (const width of [1440, 390]) {
      await page.setViewportSize({ width, height: width === 390 ? 844 : 900 });
      for (const theme of ['light', 'dark']) {
        if (await page.locator('html').getAttribute('data-theme') !== theme) await page.locator('#quiet-theme').click();
        await page.evaluate(() => scrollTo(0, 0));
        const select = await page.locator('#language').boundingBox();
        assert.ok(select.height >= 44 && select.width >= 52);
        assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
        if (process.env.JAPANESE_CAPTURE === '1') {
          const name = `japanese-${width}-${theme}.png`;
          await page.screenshot({ path: new URL(name, output).pathname });
          report.screenshots.push(name);
        }
      }
    }
    assert.deepEqual(errors, []);
    pass('Japanese desktop/mobile light/dark composition preserves native targets and has no page errors or overflow');
  } finally { await context.close(); }
  const savedContext = await browser.newContext({ locale: 'ja-JP', reducedMotion: 'reduce' });
  try {
    await savedContext.addInitScript(() => localStorage.setItem('rhine-lang', 'de'));
    const page = await savedContext.newPage();
    await page.goto(`${origin}/`);
    await page.locator('.preferences:not([hidden])').waitFor();
    assert.equal(await page.locator('html').getAttribute('lang'), 'de');
    assert.equal(await page.locator('#language').inputValue(), 'de');
    pass('An explicit saved language still outranks automatic Japanese browser detection');
  } finally { await savedContext.close(); }
} finally {
  await browser.close();
  await writeFile(new URL('japanese-checks.json', output), JSON.stringify(report, null, 2) + '\n');
}
