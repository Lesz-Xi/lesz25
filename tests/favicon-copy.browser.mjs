// Installed Playwright only; default local source interception, or an existing
// Vite server via QUIET_BASE_URL. Never starts a server, installs or builds.
import assert from 'node:assert/strict';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { resolve, extname, sep } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { COPY } from '../templates/quiet/copy.js';
const { chromium } = await import(pathToFileURL(process.env.PLAYWRIGHT_MODULE).href);
const root = fileURLToPath(new URL('../', import.meta.url));
const live = Boolean(process.env.QUIET_BASE_URL);
const origin = live ? new URL(process.env.QUIET_BASE_URL).origin : 'http://rhine.test';
const svgPath = '/quiet/philippines-flag.svg?v=1';
const pngPath = '/quiet/philippines-flag-icon.png?v=1';
const source = await readFile(resolve(root, 'public/quiet/philippines-flag.svg'), 'utf8');
const output = new URL('../.impeccable/review/', import.meta.url);
await mkdir(output, { recursive: true });
const browser = await chromium.launch({ headless: true, ...(process.env.BROWSER_PATH ? { executablePath: process.env.BROWSER_PATH } : {}) });
const report = { boundary: `Local ${live ? 'live-Vite' : 'source-intercepted'} Chromium, emulated browser appearance and SVG rasterization; not native tab-chrome, other-engine or hosted deployment verification.`, checks: [], screenshots: [] };
const pass = text => { report.checks.push(text); console.log(`PASS ${text}`); };
async function context(options = {}) {
  const ctx = await browser.newContext(options);
  if (live) return ctx;
  const mime = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.png': 'image/png', '.webp': 'image/webp' };
  await ctx.route('**/*', async route => {
    const url = new URL(route.request().url());
    if (url.origin !== origin) return route.abort();
    const relative = decodeURIComponent(url.pathname).replace(/^\//, '') + (url.pathname.endsWith('/') ? 'index.html' : '');
    for (const base of [root, resolve(root, 'public')]) {
      const path = resolve(base, relative);
      if (!path.startsWith(base.endsWith(sep) ? base : base + sep)) continue;
      try {
        const body = await readFile(path);
        if (extname(path) === '.css' && route.request().resourceType() === 'script') {
          return route.fulfill({ contentType: 'text/javascript', body: `const s = document.createElement('style'); s.textContent = ${JSON.stringify(body.toString())}; document.head.append(s);` });
        }
        return route.fulfill({ contentType: mime[extname(path)] || 'application/octet-stream', body });
      } catch { /* Try the public asset root. */ }
    }
    return route.fulfill({ status: 404, body: 'Not found' });
  });
  return ctx;
}
try {
  for (const theme of ['light', 'dark']) {
    const ctx = await context({ colorScheme: theme });
    try {
      const svg = await ctx.newPage();
      const response = await svg.goto(`${origin}${svgPath}`);
      assert.equal(response.status(), 200);
      assert.ok(response.headers()['content-type'].includes('image/svg+xml'));
      assert.equal(await response.text(), source);
      assert.equal(await svg.locator('svg').getAttribute('viewBox'), '41 151 946 685');
      pass(`Flag SVG under ${theme} preference: exact unchanged welcome artwork, including the complete pole`);
      const page = await ctx.newPage();
      await page.goto(`${origin}/#work`);
      await page.locator('.preferences:not([hidden])').waitFor();
      for (const [locale, copy] of Object.entries(COPY)) {
        await page.locator('#language').selectOption(locale);
        const row = page.locator('.work-row').filter({ has: page.locator('h3', { hasText: /^2041$/ }) });
        assert.equal(await row.locator('p').textContent(), copy.projects[2]);
        assert.equal(await row.locator('.status').count(), 1);
        assert.equal(await row.locator('a').count(), 0);
      }
      pass(`Companion-assisted 2041 description and development status remain unchanged in all locales under ${theme} preference`);
      const pixels = await page.evaluate(async ({ svgUrl, pngUrl, theme }) => {
        const host = document.createElement('div'); host.id = 'favicon-samples';
        Object.assign(host.style, { position: 'fixed', top: '16px', left: '16px', zIndex: '50', display: 'flex', gap: '24px', alignItems: 'center', padding: '24px', background: theme === 'dark' ? '#38383a' : '#f4f4f5' });
        const samples = [];
        for (const size of [16, 32]) {
          for (const url of [svgUrl, pngUrl]) {
            const image = new Image(); image.src = url; image.width = image.height = size;
            image.style.objectFit = 'contain'; await image.decode(); host.append(image);
            const canvas = document.createElement('canvas'); canvas.width = canvas.height = size;
            const scale = Math.min(size / image.naturalWidth, size / image.naturalHeight);
            const width = image.naturalWidth * scale, height = image.naturalHeight * scale;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(image, (size - width) / 2, (size - height) / 2, width, height);
            samples.push({ size, url, pixels: [...ctx.getImageData(0, 0, size, size).data] });
          }
        }
        document.body.append(host);
        return samples;
      }, { svgUrl: `${origin}${svgPath}`, pngUrl: `${origin}${pngPath}`, theme });
      for (const sample of pixels) {
        const rgba = sample.pixels;
        const color = predicate => rgba.some((value, index) => index % 4 === 0 && rgba[index + 3] > 100 && predicate(value, rgba[index + 1], rgba[index + 2]));
        assert.ok(color((r, g, b) => b > r + 50 && b > g + 30), `Blue visible at ${sample.size}px`);
        assert.ok(color((r, g, b) => r > g + 70 && r > b + 70), `Red visible at ${sample.size}px`);
        assert.ok(color((r, g, b) => r > 120 && g > 90 && b < 100), `Gold visible at ${sample.size}px`);
        assert.equal(rgba[3], 0, 'Transparent surrounding area');
      }
      assert.deepEqual(pixels[2].pixels, pixels[3].pixels, '32px PNG matches the contained SVG raster exactly');
      pass(`SVG and PNG decode at 16/32px in ${theme}: blue/red/gold visible, transparent ground, exact 32px fallback pixels`);
      if (process.env.FAVICON_CAPTURE === '1') {
        const name = `flag-favicon-${theme}-16-32.png`;
        await page.locator('#favicon-samples').screenshot({ path: new URL(name, output).pathname }); report.screenshots.push(name);
      }
    } finally { await ctx.close(); }
  }
  const ctx = await context();
  try {
    const page = await ctx.newPage();
    for (const route of ['/', '/templates/quiet/', '/templates/quiet/notes.html', '/templates/quiet/approach.html', '/templates/ocean/']) {
      await page.goto(`${origin}${route}`);
      assert.equal(await page.locator('link[rel="icon"]').count(), 2);
      assert.equal(await page.locator('link[rel="icon"][type="image/svg+xml"]').getAttribute('href'), svgPath);
      assert.equal(await page.locator('link[rel="icon"][type="image/png"]').getAttribute('href'), pngPath);
    }
    const response = await page.goto(`${origin}${pngPath}`);
    assert.equal(response.status(), 200);
    assert.ok(response.headers()['content-type'].includes('image/png'));
    assert.deepEqual(await response.body(), await readFile(resolve(root, 'public/quiet/philippines-flag-icon.png')));
    pass('All five entries share the cache-busted flag SVG and byte-verified matching PNG fallback');
  } finally { await ctx.close(); }
} finally {
  await browser.close();
  await writeFile(new URL('favicon-copy-checks.json', output), JSON.stringify(report, null, 2) + '\n');
}
