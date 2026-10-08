// Existing Vite + installed Playwright only; no server start, install or build.
import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';
import { COPY } from '../templates/quiet/copy.js';
const { chromium } = await import(pathToFileURL(process.env.PLAYWRIGHT_MODULE).href);
const origin = process.env.QUIET_BASE_URL || 'http://localhost:5174';
const output = new URL('../.impeccable/review/', import.meta.url);
await mkdir(output, { recursive: true });
const browser = await chromium.launch({ headless: true });
const report = { boundary: 'Local live-Vite Chromium, emulated browser colour preference and SVG rasterization; not native Brave tab-chrome or hosted deployment verification.', checks: [], screenshots: [] };
const pass = text => { report.checks.push(text); console.log(`PASS ${text}`); };
try {
  for (const theme of ['light', 'dark']) {
    const context = await browser.newContext({ colorScheme: theme });
    try {
      const svg = await context.newPage();
      const response = await svg.goto(`${origin}/web_profile_code.svg?v=3`);
      assert.equal(response.status(), 200);
      const colors = await svg.evaluate(() => ({
        dark: matchMedia('(prefers-color-scheme: dark)').matches,
        arrows: [...document.querySelectorAll('#_kuqd084 circle')].map(node => ({ fill: getComputedStyle(node).fill, stroke: getComputedStyle(node).stroke })),
        orange: [...document.querySelectorAll('#_kuqd088 circle')].map(node => ({ fill: getComputedStyle(node).fill, stroke: getComputedStyle(node).stroke })),
      }));
      assert.equal(colors.dark, theme === 'dark');
      assert.ok(colors.arrows.length > 0 && colors.orange.length > 0);
      for (const circle of colors.arrows) {
        assert.ok(theme === 'dark' ? circle.fill === 'rgb(255, 255, 255)' : circle.fill.includes('#_kuqd081'));
        assert.equal(circle.stroke, theme === 'dark' ? 'rgb(255, 255, 255)' : 'rgb(0, 0, 0)');
      }
      for (const circle of colors.orange) {
        assert.ok(circle.fill.includes('#_kuqd082'));
        assert.equal(circle.stroke, 'rgb(250, 119, 27)');
      }
      pass(`SVG browser preference ${theme}: only the chevron changes; original orange gradient/geometry remain`);
      const page = await context.newPage();
      await page.goto(`${origin}/#work`);
      await page.locator('.preferences:not([hidden])').waitFor();
      for (const [locale, copy] of Object.entries(COPY)) {
        await page.locator('#language').selectOption(locale);
        const row = page.locator('.work-row').filter({ has: page.locator('h3', { hasText: /^2041$/ }) });
        assert.equal(await row.locator('p').textContent(), copy.projects[2]);
        assert.equal(await row.locator('.status').count(), 1);
        assert.equal(await row.locator('a').count(), 0, 'In-development status does not gain a invented public link');
      }
      pass(`Companion-assisted 2041 description renders in all ${Object.keys(COPY).length} locales under ${theme} preference, with status unchanged`);
      // Render the actual SVG image at native favicon sizes on a browser-like ground.
      // The sample inherits browser colour preference, not Quiet's independently saved theme.
      await page.evaluate(async ({ url, theme }) => {
        const host = document.createElement('div'); host.id = 'favicon-samples';
        Object.assign(host.style, { position: 'fixed', top: '16px', left: '16px', zIndex: '50', display: 'flex', gap: '24px', alignItems: 'center', padding: '24px', background: theme === 'dark' ? '#38383a' : '#f4f4f5', colorScheme: 'light dark' });
        for (const size of [16, 32]) { const image = new Image(); image.src = url; image.width = size; image.height = size; await image.decode(); host.append(image); }
        document.body.append(host);
      }, { url: `${origin}/web_profile_code.svg?v=3`, theme });
      if (process.env.FAVICON_CAPTURE === '1') {
        const name = `favicon-${theme}-16-32.png`;
        await page.locator('#favicon-samples').screenshot({ path: new URL(name, output).pathname }); report.screenshots.push(name);
      }
    } finally { await context.close(); }
  }
  const context = await browser.newContext();
  try {
    const page = await context.newPage();
    for (const route of ['/', '/templates/quiet/', '/templates/quiet/notes.html', '/templates/quiet/approach.html', '/templates/ocean/']) {
      await page.goto(`${origin}${route}`);
      assert.equal(await page.locator('link[rel="icon"][type="image/svg+xml"]').getAttribute('href'), '/web_profile_code.svg?v=3');
      assert.equal(await page.locator('link[rel="icon"][type="image/png"]').getAttribute('href'), '/web_profile_code.png?v=2');
    }
    pass('All five entries share the cache-busted adaptive SVG and unchanged PNG fallback');
  } finally { await context.close(); }
} finally {
  await browser.close();
  await writeFile(new URL('favicon-copy-checks.json', output), JSON.stringify(report, null, 2) + '\n');
}
