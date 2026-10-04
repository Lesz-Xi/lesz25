// Browser verification never starts a server or runs a production build.
// By default, source-level request interception is used. QUIET_BASE_URL=http://localhost:5174
// instead tests an existing Vite server (requires an existing Playwright installation).
// PLAYWRIGHT_MODULE=/absolute/path/to/playwright/index.mjs node tests/quiet.browser.mjs
// QUIET_CAPTURE=1 writes one batched desktop/mobile screenshot round.
import assert from 'node:assert/strict';
import { readFile, stat, mkdir, writeFile } from 'node:fs/promises';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { resolve, extname, sep } from 'node:path';
import { COPY } from '../templates/quiet/copy.js';

const modulePath = process.env.PLAYWRIGHT_MODULE;
const { chromium } = await import(modulePath ? pathToFileURL(modulePath).href : 'playwright');
const root = fileURLToPath(new URL('../', import.meta.url));
// Derive expected reader text in the harness, not by importing source URLs into
// the page: deployed builds correctly omit /src/ modules.
globalThis.document = { documentElement: {}, querySelector: () => null, querySelectorAll: () => [] };
const { LANGUAGES, setLang, t } = await import('../src/i18n.js');
const approachSources = Object.fromEntries(LANGUAGES.map(({ code }) => {
  setLang(code);
  return [code, { paragraphs: [1, 2, 3].map((i) => t(`purpose.p${i}`)), principles: [0, 1, 2, 3, 4, 5].map((i) => t(`purpose.pr${i}`)) }];
}));
const output = resolve(root, '.impeccable/review');
const previewCapture = ['1', 'preview'].includes(process.env.QUIET_CAPTURE);
const controlsCapture = ['controls', 'dev'].includes(process.env.QUIET_CAPTURE);
const devOnlyCapture = process.env.QUIET_CAPTURE === 'dev';
const profileCapture = process.env.QUIET_CAPTURE === 'profile';
const heroCapture = process.env.QUIET_CAPTURE === 'hero';
const aboutCapture = process.env.QUIET_CAPTURE === 'about';
const navCapture = process.env.QUIET_CAPTURE === 'nav';
const relicsCapture = ['relics', 'relics-copy'].includes(process.env.QUIET_CAPTURE);
const relicsUrl = 'https://relics.quest/#top';
const built = Boolean(process.env.QUIET_DIST);
const assetRoot = built ? resolve(root, process.env.QUIET_DIST) : root;
const live = Boolean(process.env.QUIET_BASE_URL);
assert.ok(!(built && live), 'Choose built output or a live server, not both.');
const origin = live ? new URL(process.env.QUIET_BASE_URL).origin : 'http://rhine.test';
const browser = await chromium.launch({ headless: true, ...(process.env.BROWSER_PATH ? { executablePath: process.env.BROWSER_PATH } : {}) });
const report = { boundary: built ? 'Chromium on compiled dist assets via local request interception; not hosted deployment verification.' : live ? `Chromium on existing live Vite server ${origin}; not a production build/deployment test.` : 'Chromium source-level browser tests via local request interception; not a Vite build/deployment test.', checks: [], screenshots: [] };
const mime = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.webp': 'image/webp', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.svg': 'image/svg+xml' };

async function context(options = {}) {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, locale: 'en-US', ...options });
  if (live) return ctx;
  await ctx.route('**/*', async (route) => {
    const request = route.request();
    const url = new URL(request.url());
    if (url.origin !== origin) return route.abort();
    let pathname = decodeURIComponent(url.pathname);
    if (pathname.endsWith('/')) pathname += 'index.html';
    const relative = pathname.replace(/^\//, '');
    for (const base of built ? [assetRoot] : [root, resolve(root, 'public')]) {
      const file = resolve(base, relative);
      if (!file.startsWith(base.endsWith(sep) ? base : base + sep)) continue;
      try {
        if (!(await stat(file)).isFile()) continue;
        const body = await readFile(file);
        // The unchanged ocean source imports CSS through Vite. Emulate only that
        // import during source tests; no transforms are applied to the Quiet entry.
        if (extname(file) === '.css' && request.resourceType() === 'script') {
          return route.fulfill({ contentType: 'text/javascript', body: `const s = document.createElement('style'); s.textContent = ${JSON.stringify(body.toString())}; document.head.append(s);` });
        }
        return route.fulfill({ contentType: mime[extname(file).toLowerCase()] || 'application/octet-stream', body });
      } catch { /* Try the public asset root next. */ }
    }
    return route.fulfill({ status: 404, body: 'Not found' });
  });
  return ctx;
}
const check = (name) => { report.checks.push(name); console.log(`PASS ${name}`); };
const waitImage = async (page, selector) => {
  if (selector === '#album-image') await page.waitForFunction(() => document.querySelector('.viewer-stage')?.getAttribute('aria-busy') === 'false');
  if (selector === '#preview-image') await page.waitForFunction(() => document.querySelector('#photo-preview')?.open && document.querySelector('.lightbox-stage')?.getAttribute('aria-busy') === 'false' && !document.querySelector('#preview-image').hidden);
  return page.locator(selector).evaluate((image) => image.decode());
};
const screenshot = async (page, name, fullPage = true) => {
  await page.mouse.move(0, 0);
  await page.screenshot({ path: resolve(output, name), fullPage, animations: 'disabled' });
  report.screenshots.push(name);
};

try {
  if (previewCapture || controlsCapture || profileCapture || heroCapture || aboutCapture || relicsCapture || navCapture) await mkdir(output, { recursive: true });
  const ctx = await context({ colorScheme: 'light' });
  const page = await ctx.newPage();
  const errors = [];
  const requests = [];
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('request', (request) => requests.push(request.url()));
  await page.goto(`${origin}/`);
  await page.locator('.preferences:not([hidden])').waitFor();
  await waitImage(page, '.cinematic img');
  assert.equal(await page.locator('#intro-heading').textContent(), 'I build to understand.');
  assert.equal(await page.locator('canvas').count(), 0);
  assert.ok(!requests.some((url) => /\/(ocean|overlays|nav-popover)\.js|\/src\/styles\.css/.test(url)));
  assert.ok(requests.every((url) => url.startsWith(origin)));
  check('Quiet loads locally with no canvas, ocean runtime, old CSS, or external requests');
  const frame = await page.locator('.cinematic-frame').evaluate((element) => {
    const host = element.getBoundingClientRect();
    const image = element.querySelector('img').getBoundingClientRect();
    return { x: image.x - host.x, y: image.y - host.y, width: host.width - image.width, height: host.height - image.height };
  });
  assert.ok(Object.values(frame).every((value) => Math.abs(value) < 0.5));
  assert.equal(await page.locator('.album-card img').count(), 6);
  check('Signature photograph fills its frame with no padding; all six albums have image previews');
  await waitImage(page, '.identity-portrait');
  assert.equal(await page.locator('.identity-portrait').count(), 1);
  assert.equal(await page.locator('.identity-portrait').getAttribute('alt'), '');
  const portraitSource = await page.locator('.identity-portrait').evaluate((image) => ({ width: image.naturalWidth, height: image.naturalHeight }));
  assert.deepEqual(portraitSource, { width: 160, height: 160 });
  check('Portrait loads locally above the name, with a reserved square footprint and no added control');
  assert.equal(await page.locator('.location-flag').count(), 0);
  assert.equal(await page.locator('#entry-intro').count(), 1);
  await page.waitForFunction(() => ['done', 'bypassed'].includes(document.documentElement.dataset.entryBoot));
  check('Country has no inline flag; the separate bounded welcome releases the unchanged portfolio');
  if (profileCapture || heroCapture) {
    for (const width of [1440, 390]) {
      await page.setViewportSize({ width, height: width === 390 ? 844 : 900 });
      for (const theme of ['light', 'dark']) {
        if (await page.locator('html').getAttribute('data-theme') !== theme) await page.locator('#quiet-theme').click();
        await page.evaluate(() => scrollTo(0, 0));
        await page.mouse.move(0, 0);
        await screenshot(page, `${heroCapture ? 'hero-link' : 'profile'}-${width}-${theme}.png`, false);
      }
    }
    await page.setViewportSize({ width: 1440, height: 900 });
    if (await page.locator('html').getAttribute('data-theme') !== 'light') await page.locator('#quiet-theme').click();
  }
  assert.equal(await page.locator('.switch-track, .switch-thumb, [role="switch"]').count(), 0);
  assert.equal(await page.locator('#quiet-gui-control').getAttribute('aria-pressed'), 'true');
  assert.equal(await page.locator('#quiet-mode').getAttribute('aria-pressed'), 'false');
  assert.equal(await page.locator('#quiet-theme .theme-icon-light').isVisible(), true);
  assert.equal(await page.locator('#quiet-theme .theme-icon-dark').isVisible(), false);
  for (const selector of ['#quiet-gui-control', '#quiet-mode', '#quiet-theme']) {
    const size = await page.locator(selector).boundingBox();
    assert.ok(size.width >= 44 && size.height >= 44, selector);
  }
  await page.locator('#quiet-theme').focus();
  await page.keyboard.press('Space');
  assert.equal(await page.locator('html').getAttribute('data-theme'), 'dark');
  assert.equal(await page.locator('#quiet-theme .theme-icon-dark').isVisible(), true);
  assert.equal(await page.locator('#quiet-theme .theme-icon-light').isVisible(), false);
  await page.keyboard.press('Space');
  assert.equal(await page.locator('html').getAttribute('data-theme'), 'light');
  check('Cardless GUI/Dev buttons expose selected state; one theme icon is visible; all controls retain 44px targets and Space-key operation');
  assert.equal(await page.locator('html').evaluate((element) => getComputedStyle(element).scrollbarWidth), 'none');
  assert.equal(await page.locator('html').evaluate((element) => getComputedStyle(element, '::-webkit-scrollbar').display), 'none');
  await page.evaluate(() => scrollTo(0, 0));
  await page.mouse.move(720, 600);
  await page.mouse.wheel(0, 500);
  await page.waitForFunction(() => scrollY > 0);
  await page.evaluate(() => { scrollTo(0, 0); document.querySelector('#main').focus({ preventScroll: true }); });
  await page.keyboard.press('PageDown');
  await page.waitForFunction(() => scrollY > 0);
  check('Quiet hides the page scrollbar while native wheel and PageDown scrolling remain available');

  // One capture batch: entry + complete surface in both themes and both device classes.
  if (process.env.QUIET_CAPTURE === '1') {
    await mkdir(output, { recursive: true });
    await page.locator('#photography').scrollIntoViewIfNeeded();
    await page.locator('.album-card img').evaluateAll((images) => Promise.all(images.map((image) => image.decode())));
    await page.evaluate(() => scrollTo(0, 0));
    await screenshot(page, 'desktop-entry.png', false);
    await screenshot(page, 'desktop.png');
    await page.locator('#photography').screenshot({ path: resolve(output, 'photography-desktop.png'), animations: 'disabled' });
    report.screenshots.push('photography-desktop.png');
    await page.locator('#quiet-theme').click();
    await screenshot(page, 'desktop-dark.png');
    await page.setViewportSize({ width: 390, height: 844 });
    await page.evaluate(() => scrollTo(0, 0));
    await screenshot(page, 'mobile-dark.png');
    await page.locator('#quiet-theme').click();
    await screenshot(page, 'mobile.png');
    await screenshot(page, 'mobile-entry.png', false);
    await page.locator('.album-grid').screenshot({ path: resolve(output, 'photography-mobile.png'), animations: 'disabled' });
    report.screenshots.push('photography-mobile.png');
  }

  if (aboutCapture) {
    for (const width of [1440, 390]) {
      await page.setViewportSize({ width, height: width === 390 ? 844 : 900 });
      for (const theme of ['light', 'dark']) {
        if (await page.locator('html').getAttribute('data-theme') !== theme) await page.locator('#quiet-theme').click();
        await page.mouse.move(0, 0);
        const name = `about-copy-${width}-${theme}.png`;
        await page.locator('#about').screenshot({ path: resolve(output, name), animations: 'disabled' });
        report.screenshots.push(name);
      }
    }
    await page.setViewportSize({ width: 1440, height: 900 });
  }
  for (const width of [320, 390, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    for (const { code: lang } of LANGUAGES) {
      await page.selectOption('#language', lang);
      assert.equal(await page.locator('html').getAttribute('lang'), lang);
      for (const theme of ['light', 'dark']) {
        if (await page.locator('html').getAttribute('data-theme') !== theme) await page.locator('#quiet-theme').click();
        assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true, `${lang} ${width} ${theme} overflow`);
        assert.ok(!(await page.locator('body').textContent()).includes('undefined'));
        const heroLink = await page.locator('.hero-work-link').evaluate(element => {
          const style = getComputedStyle(element);
          const rect = element.getBoundingClientRect();
          return { fill: style.backgroundColor, border: style.borderWidth, shadow: style.boxShadow, padding: [style.paddingLeft, style.paddingRight], underline: style.textDecorationLine, height: rect.height, offset: rect.left - element.parentElement.querySelector('h1').getBoundingClientRect().left, href: element.getAttribute('href'), arrow: element.querySelector('svg')?.getAttribute('aria-hidden') };
        });
        assert.deepEqual({ ...heroLink, height: 44 }, { fill: 'rgba(0, 0, 0, 0)', border: '0px', shadow: 'none', padding: ['0px', '0px'], underline: 'underline', height: 44, offset: 0, href: '#work', arrow: 'true' });
        assert.ok(heroLink.height >= 44, `${lang} ${width} ${theme}: hero link target`);
        assert.deepEqual(await page.locator('#quiet-sections > section').evaluateAll(nodes => nodes.map(node => node.id)), ['about', 'work', 'photography', 'research', 'notes', 'contact']);
        assert.deepEqual(await page.locator('.section-nav a').evaluateAll(nodes => nodes.map(node => node.getAttribute('href'))), ['#about', '#work', '#photography', '#research', '#notes', '#contact']);
        // Theme changes retain the existing 150ms color transition; inspect its settled state.
        await page.waitForTimeout(180);
        assert.equal(await page.locator('.section-nav a').evaluateAll((nodes, muted) => nodes.every(node => {
          const style = getComputedStyle(node);
          return style.color === muted && style.textDecorationLine === 'none' && node.getBoundingClientRect().height >= 44;
        }), theme === 'dark' ? 'rgb(170, 166, 160)' : 'rgb(101, 100, 97)'), true, `${lang} ${width} ${theme}: neutral nav and 44px targets`);
        const c = COPY[lang];
        assert.deepEqual(await page.locator('#about .about-copy > p').allTextContents(), [c.aboutBody, c.designBody, c.purpose]);
        assert.equal(await page.locator('#about [data-read-approach]').getAttribute('href'), '/templates/quiet/approach.html');
        assert.equal(await page.locator('.work-row').count(), 6);
        assert.deepEqual(await page.locator('.work-row').evaluateAll(rows => rows.map(row => row.dataset.workId)), ['wuweism', 'twin-sparrow', '2041', 'relics', 'odysxi', 'tsra']);
        assert.equal(await page.locator('[data-work-id="relics"] > p').textContent(), COPY[lang].relicsBody);
        assert.equal(await page.locator('[data-work-id="relics"] .meta').textContent(), 'Ex-formation');
        assert.equal(await page.locator('.relics-link').textContent(), await page.locator('[data-work-id="wuweism"] .text-link').textContent());
        assert.equal(await page.locator('.relics-link').getAttribute('href'), relicsUrl);
        assert.equal(await page.locator('.relics-link').getAttribute('rel'), 'noopener noreferrer');
        assert.ok((await page.locator('.relics-link').boundingBox()).height >= 44);
        await page.locator('.relics-link').focus();
        await page.keyboard.press('Shift+Tab');
        await page.keyboard.press('Tab');
        assert.equal(await page.locator('.relics-link').evaluate(el => el === document.activeElement), true);
        assert.equal(await page.locator('.relics-link').evaluate(el => getComputedStyle(el).outlineStyle), 'solid');
        assert.equal(await page.locator('.paper-row').count(), 4);
        assert.equal(await page.locator('.album-card').count(), 6);
        assert.equal(await page.locator('.page-shell > .footer a').count(), 0);
        assert.equal(await page.locator('.page-shell > .footer').textContent(), 'Rhine Tague');
        assert.equal(await page.locator('[data-copy="original"]').count(), 0);
        await waitImage(page, '.identity-portrait');
        const portrait = await page.locator('.identity-portrait').evaluate((image) => {
          const box = image.getBoundingClientRect();
          const name = image.nextElementSibling.getBoundingClientRect();
          const style = getComputedStyle(image);
          return { width: box.width, height: box.height, x: box.x, nameX: name.x, bottom: box.bottom, nameY: name.y, radius: style.borderRadius, shadow: style.boxShadow };
        });
        assert.equal(portrait.width, width <= 700 ? 64 : 80);
        assert.equal(portrait.height, portrait.width);
        assert.equal(portrait.x, portrait.nameX);
        assert.ok(portrait.bottom < portrait.nameY);
        assert.equal(portrait.radius, '4px');
        assert.equal(portrait.shadow, 'none');
        assert.equal(await page.locator('.location-flag').count(), 0);
        const emptyFrame = await page.locator('.cinematic-frame').evaluate((element) => {
          const host = element.getBoundingClientRect();
          const img = element.querySelector('img').getBoundingClientRect();
          return Math.abs(host.width - img.width) < 0.5 && Math.abs(host.height - img.height) < 0.5;
        });
        assert.ok(emptyFrame, `${width} image frame gap`);
      }
    }
  }
  check('All six languages at 320/390/768/1440px, both themes: no horizontal overflow or missing rows');
  await page.selectOption('#language', 'de');
  await page.reload();
  assert.equal(await page.locator('html').getAttribute('lang'), 'de');
  assert.equal(await page.locator('html').getAttribute('data-theme'), 'dark');
  assert.equal(await page.evaluate(() => localStorage.getItem('rhine-theme-mode')), null);
  check('Language/theme persist; new theme never writes the ocean preference');
  await page.selectOption('#language', 'en');
  if (relicsCapture) {
    for (const width of [1440, 390]) {
      await page.setViewportSize({ width, height: width === 390 ? 844 : 900 });
      for (const theme of ['light', 'dark']) {
        if (await page.locator('html').getAttribute('data-theme') !== theme) await page.locator('#quiet-theme').click();
        const captureName = process.env.QUIET_CAPTURE === 'relics-copy' ? 'relics-copy' : 'relics-work';
        const name = `${captureName}-${width}-${theme}.png`;
        await page.locator('#work').screenshot({ path: resolve(output, name), animations: 'disabled' });
        report.screenshots.push(name);
      }
    }
  }
  // The persistence reload above replays the finite welcome. Wait before activating work.
  await page.waitForFunction(() => ['done', 'bypassed'].includes(document.documentElement.dataset.entryBoot));
  // Native activation uses a bounded fixture; live Relics was inspected separately.
  // URL fragments are not sent in HTTP requests, so route the destination origin.
  await ctx.route('https://relics.quest/**', (route) => route.fulfill({ contentType: 'text/html', body: '<title>Relics destination</title>' }));
  const relicsPopup = page.waitForEvent('popup');
  await page.locator('.relics-link').focus();
  await page.keyboard.press('Enter');
  const relicsPage = await relicsPopup;
  await relicsPage.waitForLoadState('domcontentloaded');
  assert.equal(relicsPage.url(), relicsUrl);
  await relicsPage.close();
  await page.locator('.relics-link').hover();
  await page.waitForTimeout(180);
  assert.equal(await page.locator('.relics-link').evaluate((element) => getComputedStyle(element).textDecorationLine), 'underline');
  assert.equal(await page.locator('.relics-link').evaluate((element) => getComputedStyle(element).color), 'rgb(251, 146, 60)');
  check('Relics appears once in Selected work across six locales/four widths/both themes; 44px target, visible focus and native external activation work');
  await page.selectOption('#language', 'en');
  await page.locator('.cinematic [data-album]').click();
  await page.waitForURL('**/#album-switzerland');
  assert.equal(await page.locator('#album-viewer').isVisible(), true);
  assert.equal(await page.locator('#album-heading').evaluate((element) => element === document.activeElement), true);
  await page.keyboard.press('ArrowLeft');
  assert.equal(await page.locator('#photo-count').textContent(), '13 / 13');
  await page.keyboard.press('ArrowRight');
  assert.equal(await page.locator('#photo-count').textContent(), '01 / 13');
  await page.locator('[data-photo-next]').click();
  await page.selectOption('#language', 'fr');
  assert.equal(await page.locator('#photo-count').textContent(), '02 / 13');
  await page.locator('[data-photo-next]').focus();
  await page.keyboard.press('Escape');
  assert.equal(await page.locator('#album-viewer').isVisible(), false);
  assert.equal(await page.evaluate(() => document.activeElement.dataset.album), 'switzerland');
  for (const id of ['switzerland', 'paris', 'nature', 'sunset', 'philippines', 'flowers']) {
    await page.locator(`[data-album="${id}"]`).first().click();
    await waitImage(page, '#album-image');
    assert.ok(await page.locator('#album-image').getAttribute('alt'));
    if (id === 'switzerland') {
      for (const width of [390, 1440]) {
        await page.setViewportSize({ width, height: width === 390 ? 844 : 900 });
        for (const theme of ['light', 'dark']) {
          if (await page.locator('html').getAttribute('data-theme') !== theme) await page.locator('#quiet-theme').click();
          const frame = await page.locator('.viewer-stage').evaluate((element) => {
            const host = element.getBoundingClientRect();
            const image = element.querySelector('img');
            const box = image.getBoundingClientRect();
            const scale = Math.min(box.width / image.naturalWidth, box.height / image.naturalHeight);
            const imageWidth = image.naturalWidth * scale;
            const imageHeight = image.naturalHeight * scale;
            return { ratio: host.width / host.height, fit: getComputedStyle(image).objectFit, sideSpace: (host.width - imageWidth) / 2, topSpace: (host.height - imageHeight) / 2 };
          });
          assert.equal(frame.fit, 'contain');
          assert.ok(Math.abs(frame.ratio - (width === 390 ? 4 / 3 : 2)) < 0.01);
          assert.ok(frame.sideSpace > frame.topSpace, 'Cinematic side breathing room');
          if (process.env.QUIET_CAPTURE === '1') {
            const name = `album-${width === 390 ? 'mobile' : 'desktop'}-${theme}.png`;
            await page.locator('#album-viewer').screenshot({ path: resolve(output, name), animations: 'disabled' });
            report.screenshots.push(name);
          }
        }
      }
      await page.locator('[data-photo-next]').click();
      await page.locator('[data-photo-next]').click();
      await waitImage(page, '#album-image');
      const portrait = await page.locator('.viewer-stage').evaluate((element) => {
        const image = element.querySelector('img');
        const host = element.getBoundingClientRect();
        return { ratio: image.naturalWidth / image.naturalHeight, stageRatio: host.width / host.height, fit: getComputedStyle(image).objectFit };
      });
      assert.ok(portrait.ratio < 1);
      assert.ok(Math.abs(portrait.stageRatio - 2) < 0.01);
      assert.equal(portrait.fit, 'contain');
    }
    await page.locator('[data-album-close]').click();
  }
  check('All six albums load; keyboard wrap, language-preserved index, Escape and focus restoration work');
  check('Albums use a 2:1 cinematic desktop field with side breathing room; a taller mobile field preserves complete landscape/portrait photos');
  await page.locator('.album-card[data-album="switzerland"]').click();
  await page.locator('[data-photo-next]').click();
  await waitImage(page, '#album-image');
  const currentSource = await page.locator('#album-image').getAttribute('src');
  const currentCount = await page.locator('#photo-count').textContent();
  const albumHash = await page.evaluate(() => location.hash);
  for (const width of [390, 1440]) {
    await page.setViewportSize({ width, height: width === 390 ? 844 : 900 });
    for (const theme of ['light', 'dark']) {
      if (await page.locator('html').getAttribute('data-theme') !== theme) await page.locator('#quiet-theme').click();
      await page.locator('[data-photo-preview]').scrollIntoViewIfNeeded();
      await page.locator('[data-photo-preview]').focus();
      const position = await page.evaluate(() => scrollY);
      await page.locator('#album-image').click();
      await page.locator('#photo-preview[open]').waitFor();
      await waitImage(page, '#preview-image');
      assert.equal(await page.locator('#preview-image').getAttribute('src'), new URL(currentSource, origin).href);
      assert.equal(await page.locator('#preview-count').textContent(), currentCount);
      assert.equal(await page.evaluate(() => location.hash), albumHash);
      assert.equal(await page.locator('#preview-close').evaluate((element) => element === document.activeElement), true);
      assert.equal(await page.locator('#preview-image').evaluate((element) => getComputedStyle(element).objectFit), 'contain');
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
      for (let tab = 0; tab < 4; tab += 1) {
        await page.keyboard.press('Tab');
        const focused = await page.evaluate(() => ({ inside: document.querySelector('#photo-preview').contains(document.activeElement), tag: document.activeElement.tagName, id: document.activeElement.id }));
        assert.equal(focused.inside, true, `Preview Tab ${tab + 1}: ${focused.tag}#${focused.id}`);
      }
      if (previewCapture) await screenshot(page, `preview-${width === 390 ? 'mobile' : 'desktop'}-${theme}.png`, false);
      await page.locator('#preview-close').click();
      await page.waitForFunction(() => !document.querySelector('#photo-preview').open && document.documentElement.style.overflow !== 'hidden');
      assert.equal(await page.locator('#photo-count').textContent(), currentCount);
      assert.equal(await page.locator('#album-viewer').isVisible(), true);
      assert.equal(await page.locator('[data-photo-preview]').evaluate((element) => element === document.activeElement), true);
      assert.ok(Math.abs((await page.evaluate(() => scrollY)) - position) <= 1, 'Preview restores album scroll position');
    }
  }
  await page.locator('[data-photo-preview]').focus();
  await page.keyboard.press('Enter');
  await page.locator('#photo-preview[open]').waitFor();
  await page.keyboard.press('Escape');
  await page.waitForFunction(() => !document.querySelector('#photo-preview').open);
  assert.equal(await page.locator('#album-viewer').isVisible(), true);
  assert.equal(await page.evaluate(() => location.hash), albumHash);
  await page.locator('#album-image').click();
  await page.locator('#photo-preview[open]').waitFor();
  await page.mouse.click(0, 0);
  await page.waitForFunction(() => !document.querySelector('#photo-preview').open);
  await page.locator('#album-image').click();
  await page.locator('#photo-preview[open]').waitFor();
  await page.evaluate(() => { document.querySelector('#preview-image').src = '/quiet/preview-error-test.webp'; });
  await page.waitForFunction(() => document.querySelector('.lightbox-stage').getAttribute('aria-busy') === 'false' && !document.querySelector('#preview-status').hidden);
  assert.equal(await page.locator('#preview-image').isVisible(), false);
  await page.locator('#preview-close').click();
  await page.waitForFunction(() => !document.querySelector('#photo-preview').open && document.documentElement.style.overflow !== 'hidden');
  await page.locator('#album-image').click();
  await waitImage(page, '#preview-image');
  // Cached decode can settle before the image load handler updates the UI.
  await page.locator('#preview-status').waitFor({ state: 'hidden' });
  assert.equal(await page.locator('#preview-status').isVisible(), false);
  await page.evaluate(() => { location.hash = '#album-paris'; });
  await page.waitForFunction(() => !document.querySelector('#photo-preview').open && document.documentElement.style.overflow !== 'hidden');
  check('Album photograph opens a native large preview; Close/Escape/backdrop restore the same image, focus and scroll; errors recover and route changes close it');
  await page.goto(`${origin}/#album-paris`);
  await page.locator('#album-viewer:not([hidden])').waitFor();
  assert.ok((await page.locator('#album-heading').textContent()).includes('2022'));
  await page.locator('[data-album-close]').click();
  await page.locator('[data-album="flowers"]').click();
  await page.goBack();
  assert.equal(await page.locator('#album-viewer').isVisible(), false);
  await page.goForward();
  assert.equal(await page.locator('#album-viewer').isVisible(), true);
  await page.goto(`${origin}/#album-not-real`);
  assert.equal(await page.locator('#album-viewer').isVisible(), false);
  check('Album deep links, back/forward, and unknown-hash recovery work');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  assert.equal(await page.locator('#contact .button').evaluate((element) => getComputedStyle(element).transitionDuration), '0s');
  await page.goto(`${origin}/`);
  await page.locator('.preferences:not([hidden])').waitFor();
  await page.keyboard.press('Tab');
  assert.equal(await page.evaluate(() => document.activeElement.className), 'skip-link');
  await page.keyboard.press('Enter');
  assert.equal(await page.evaluate(() => document.activeElement.id), 'main');
  await page.locator('#quiet-theme').focus();
  await page.keyboard.press('Tab');
  await page.keyboard.press('Shift+Tab');
  assert.equal(await page.locator('#quiet-theme').evaluate((element) => element === document.activeElement && getComputedStyle(element).outlineStyle === 'solid'), true);
  check('Reduced motion, skip link, and visible keyboard focus work');
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.mouse.move(0, 0);
  const restingColors = {};
  for (const theme of ['light', 'dark']) {
    if (await page.locator('html').getAttribute('data-theme') !== theme) await page.locator('#quiet-theme').click();
    await page.waitForTimeout(180);
    restingColors[theme] = await page.locator('#contact .button').evaluate((element) => ({ fill: getComputedStyle(element).backgroundColor, ink: getComputedStyle(element).color }));
  }
  assert.deepEqual(restingColors.light, { fill: 'rgb(75, 85, 99)', ink: 'rgb(255, 255, 255)' });
  assert.deepEqual(restingColors.dark, { fill: 'rgb(216, 200, 180)', ink: 'rgb(33, 31, 28)' });
  check('Light buttons keep slate; dark buttons use warm sand with charcoal labels');
  await page.locator('#contact .button').hover();
  await page.waitForTimeout(180);
  const hoverColors = await page.locator('#contact .button').evaluate((element) => ({
    fill: getComputedStyle(element).backgroundColor, ink: getComputedStyle(element).color,
  }));
  assert.deepEqual(hoverColors, { fill: 'rgb(251, 146, 60)', ink: 'rgb(33, 31, 28)' });
  check('Rendered contact button hover retains Ellipsis orange with the accessible dark label');
  for (const width of [1440, 390]) {
    await page.setViewportSize({ width, height: width === 390 ? 844 : 900 });
    for (const theme of ['light', 'dark']) {
      if (await page.locator('html').getAttribute('data-theme') !== theme) await page.locator('#quiet-theme').click();
      await page.locator('#quiet-mode').hover();
      await page.waitForTimeout(180);
      const accent = await page.locator('#quiet-mode').evaluate(el => getComputedStyle(el).color);
      assert.equal(accent, theme === 'dark' ? 'rgb(251, 146, 60)' : 'rgb(185, 71, 8)');
      for (const id of ['about', 'work', 'photography', 'research', 'notes', 'contact']) {
        const link = page.locator(`.section-nav a[href="#${id}"]`);
        await link.hover();
        await page.waitForTimeout(180);
        assert.deepEqual(await link.evaluate(el => ({ color: getComputedStyle(el).color, underline: getComputedStyle(el).textDecorationLine, fill: getComputedStyle(el).backgroundColor })), { color: accent, underline: 'underline', fill: 'rgba(0, 0, 0, 0)' });
        if (navCapture && id === 'about' && width === 1440) {
          const name = `nav-accent-${width}-${theme}.png`;
          await page.screenshot({ path: resolve(output, name), animations: 'disabled' });
          report.screenshots.push(name);
        }
        await page.mouse.move(0, 0);
        await link.focus();
        await page.keyboard.press('Tab');
        await page.keyboard.press('Shift+Tab');
        await page.waitForTimeout(180);
        assert.deepEqual(await link.evaluate(el => ({ focused: el === document.activeElement && el.matches(':focus-visible'), color: getComputedStyle(el).color, underline: getComputedStyle(el).textDecorationLine, outline: getComputedStyle(el).outlineStyle, outlineColor: getComputedStyle(el).outlineColor })), { focused: true, color: accent, underline: 'underline', outline: 'solid', outlineColor: accent });
        if (navCapture && id === 'about' && width === 390) {
          const name = `nav-accent-${width}-${theme}.png`;
          await page.screenshot({ path: resolve(output, name), animations: 'disabled' });
          report.screenshots.push(name);
        }
        await page.keyboard.press('Enter');
        await page.waitForFunction(id => location.hash === `#${id}` && document.activeElement.id === `${id}-heading`, id);
        await page.waitForTimeout(180);
        assert.equal(await link.evaluate(el => getComputedStyle(el).color), theme === 'dark' ? 'rgb(170, 166, 160)' : 'rgb(101, 100, 97)');
      }
      await page.goto(`${origin}/`);
      await page.locator('.preferences:not([hidden])').waitFor();
      await page.waitForFunction(() => ['done', 'bypassed'].includes(document.documentElement.dataset.entryBoot));
    }
  }
  check('All six nav links match Dev Mode accent on hover and keyboard focus at desktop/mobile in both themes, retain neutral rest/underline/outline, and Enter reaches native headings');
  for (const width of [1440, 390]) {
    await page.setViewportSize({ width, height: 900 });
    for (const theme of ['light', 'dark']) {
      if (await page.locator('html').getAttribute('data-theme') !== theme) await page.locator('#quiet-theme').click();
      const link = page.locator('.hero-work-link');
      await link.hover();
      await page.waitForTimeout(180);
      assert.deepEqual(await link.evaluate(element => ({ fill: getComputedStyle(element).backgroundColor, ink: getComputedStyle(element).color, accent: getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() })), {
        fill: 'rgba(0, 0, 0, 0)', ink: theme === 'dark' ? 'rgb(251, 146, 60)' : 'rgb(185, 71, 8)', accent: theme === 'dark' ? '#fb923c' : '#b94708',
      });
      await link.focus();
      await page.keyboard.press('Tab');
      await page.keyboard.press('Shift+Tab');
      assert.equal(await link.evaluate(element => element === document.activeElement && element.matches(':focus-visible') && getComputedStyle(element).outlineStyle === 'solid'), true);
      assert.equal(await link.evaluate(element => getComputedStyle(element).backgroundColor), 'rgba(0, 0, 0, 0)');
      await page.keyboard.press('Enter');
      await page.waitForFunction(() => location.hash === '#work' && document.activeElement.id === 'work-heading');
      await page.goto(`${origin}/`);
      await page.locator('.preferences:not([hidden])').waitFor();
      await page.waitForFunction(() => ['done', 'bypassed'].includes(document.documentElement.dataset.entryBoot));
    }
  }
  check('Hero work link stays cardless across all six locales/four widths/both themes; desktop/mobile hover and visible keyboard focus retain native Work navigation');
  await page.selectOption('#language', 'en');
  await page.mouse.move(0, 0);
  for (const theme of ['light', 'dark']) {
    if (await page.locator('html').getAttribute('data-theme') !== theme) await page.locator('#quiet-theme').click();
    const linkStyle = await page.locator('[data-read-note]').evaluate((element) => ({ background: getComputedStyle(element).backgroundColor, underline: getComputedStyle(element).textDecorationLine, filled: element.classList.contains('button') }));
    assert.deepEqual(linkStyle, { background: 'rgba(0, 0, 0, 0)', underline: 'underline', filled: false });
    if (previewCapture) {
      const name = `notes-link-${theme}.png`;
      await page.locator('#notes').screenshot({ path: resolve(output, name), animations: 'disabled' });
      report.screenshots.push(name);
    }
  }
  check('Read the note is a transparent underlined text link, never a filled card/button, in both themes');
  await page.locator('[data-read-note]').focus();
  await page.keyboard.press('Enter');
  await page.waitForURL('**/templates/quiet/notes.html');
  await page.locator('.preferences:not([hidden])').waitFor();
  assert.equal(await page.locator('h1').textContent(), 'What My Hands Knew First');
  assert.equal(await page.locator('.note-body > p').count(), 18);
  assert.equal(await page.locator('.reading-article').getAttribute('lang'), 'en');
  const essay = await page.locator('.note-body').textContent();
  const sourceLinks = await page.locator('.note-body a').evaluateAll((links) => links.map((link) => link.href));
  assert.equal(sourceLinks.length, 7);
  for (const width of [320, 390, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    for (const { code: lang } of LANGUAGES) {
      await page.selectOption('#language', lang);
      for (const theme of ['light', 'dark']) {
        if (await page.locator('html').getAttribute('data-theme') !== theme) await page.locator('#quiet-theme').click();
        assert.equal(await page.locator('html').getAttribute('lang'), lang);
        assert.equal(await page.locator('.note-body').textContent(), essay);
        assert.equal(await page.locator('.reading-article').getAttribute('lang'), 'en');
        assert.equal(await page.locator('.reading-end a').count(), 1);
        assert.equal(await page.locator('.reader-footer a').count(), 0);
        assert.equal(await page.locator('[data-copy="backPortfolio"]').count(), 1);
        assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true, `Notes ${lang} ${width} ${theme} overflow`);
      }
    }
  }
  check('Read the note opens a dedicated reading page; all 18 paragraphs and 7 source links survive every language, theme, and width');
  await page.selectOption('#language', 'de');
  await page.reload();
  assert.equal(await page.locator('html').getAttribute('data-theme'), 'dark');
  assert.equal(await page.locator('html').getAttribute('lang'), 'de');
  await page.goBack();
  await page.locator('[data-read-note]').waitFor();
  assert.equal(await page.locator('html').getAttribute('lang'), 'de');
  assert.equal(await page.locator('html').getAttribute('data-theme'), 'dark');
  await page.locator('[data-read-note]').click();
  await page.waitForURL('**/notes.html');
  await page.selectOption('#language', 'en');
  if (process.env.QUIET_CAPTURE === '1') {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.locator('#quiet-theme').click();
    await page.evaluate(() => scrollTo(0, 0));
    await screenshot(page, 'notes-desktop.png', false);
    await page.locator('#quiet-theme').click();
    await screenshot(page, 'notes-desktop-dark.png', false);
    await page.setViewportSize({ width: 390, height: 844 });
    await page.evaluate(() => scrollTo(0, 0));
    await screenshot(page, 'notes-mobile-dark.png', false);
    await page.locator('#quiet-theme').click();
    await screenshot(page, 'notes-mobile.png', false);
  }
  await page.setViewportSize({ width: 780, height: 900 });
  await page.evaluate(() => { document.documentElement.style.zoom = '2'; });
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
  await page.evaluate(() => { document.documentElement.style.zoom = ''; });
  await page.locator('.reading-end .text-link').focus();
  await page.keyboard.press('Enter');
  await page.waitForURL('**/#notes');
  assert.equal(await page.locator('#notes').isVisible(), true);
  check('Notes preserves preferences through reload and Back, works at 200% zoom, and returns to the portfolio Notes section');
  // New controls, finite command view and source-preserving approach reader.
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.selectOption('#language', 'en');
  await page.goto(`${origin}/#album-switzerland`);
  await page.locator('[data-photo-next]').click();
  await waitImage(page, '#album-image');
  await page.locator('[data-photo-preview]').focus();
  const savedGui = await page.evaluate(() => ({ scroll: scrollY, hash: location.hash, count: document.querySelector('#photo-count').textContent, image: document.querySelector('#album-image').getAttribute('src') }));
  await page.locator('#quiet-mode').evaluate((button) => button.click());
  assert.equal(await page.locator('#quiet-mode').getAttribute('aria-pressed'), 'true');
  assert.equal(await page.locator('#quiet-gui').isVisible(), false);
  assert.equal(await page.locator('#quiet-dev').isVisible(), true);
  assert.equal(await page.locator('#dev-input').evaluate((element) => element === document.activeElement), true);
  const command = async (text) => { await page.locator('#dev-input').fill(text); await page.locator('#dev-input').press('Enter'); };
  await command('help');
  assert.ok((await page.locator('#dev-output').textContent()).includes('theme light|dark'));
  await page.locator('#quiet-mode').evaluate((button) => button.click());
  assert.equal(await page.locator('#quiet-dev').isVisible(), true, 'Selecting an already-active view must not toggle it away');
  assert.equal(await page.locator('#quiet-gui-control').getAttribute('aria-pressed'), 'false');
  await page.locator('#quiet-gui-control').evaluate((button) => button.click());
  assert.equal(await page.locator('#quiet-gui').isVisible(), true);
  assert.equal(await page.locator('#quiet-gui-control').getAttribute('aria-pressed'), 'true');
  assert.equal(await page.evaluate(() => scrollY), savedGui.scroll);
  // Restore the original trigger before the second entry so exit still checks exact focus recovery.
  await page.locator('[data-photo-preview]').focus();
  await page.locator('#quiet-mode').evaluate((button) => button.click());
  await command('ls');
  assert.equal(await page.locator('#dev-output').evaluate((element) => getComputedStyle(element).scrollbarWidth), 'none');
  await page.locator('#dev-output').evaluate((element) => { element.scrollTop = 0; element.focus(); });
  await page.keyboard.press('PageDown');
  await page.waitForFunction(() => document.querySelector('#dev-output').scrollTop > 0);
  await command('clear');
  await command('ls work');
  assert.equal(await page.locator('.dev-records > li').count(), 6);
  assert.equal(await page.locator('.dev-records a[href="https://relics.quest/#top"]').count(), 1);
  assert.equal(await page.locator('.dev-records a[href=""]').count(), 0);
  assert.ok((await page.locator('.dev-records').textContent()).includes('In development'));
  await page.locator('#dev-input').fill('find draft');
  await page.locator('#dev-input').press('ArrowUp');
  assert.equal(await page.locator('#dev-input').inputValue(), 'ls work');
  await page.locator('#dev-input').press('ArrowDown');
  assert.equal(await page.locator('#dev-input').inputValue(), 'find draft');
  await page.locator('#dev-input').press('Tab');
  assert.equal(await page.locator('#dev-form button').evaluate((element) => element === document.activeElement), true);
  await page.keyboard.press('Shift+Tab');
  assert.equal(await page.locator('#dev-input').evaluate((element) => element === document.activeElement), true);
  await command('<img src=x onerror=window.__quietInjected=1>');
  assert.equal(await page.locator('#dev-output img').count(), 0);
  assert.equal(await page.evaluate(() => window.__quietInjected), undefined);
  assert.ok((await page.locator('#dev-output').textContent()).includes('<img src=x'));
  await command('clear');
  assert.equal(await page.locator('#dev-output').textContent(), '');
  await command('exit');
  const restoredGui = await page.evaluate(() => ({ scroll: scrollY, hash: location.hash, count: document.querySelector('#photo-count').textContent, image: document.querySelector('#album-image').getAttribute('src') }));
  assert.deepEqual(restoredGui, savedGui);
  assert.equal(await page.locator('[data-photo-preview]').evaluate((element) => element === document.activeElement), true);
  check('Dev Mode has safe literal output, bounded grammar, history, normal Tab navigation, and exact GUI album/focus/scroll restoration');

  await page.locator('#quiet-mode').evaluate((button) => button.click());
  await command('theme dark');
  assert.equal(await page.locator('html').getAttribute('data-theme'), 'dark');
  assert.equal(await page.locator('#quiet-theme').getAttribute('aria-pressed'), 'true');
  assert.equal(await page.evaluate(() => localStorage.getItem('rhine-quiet-theme')), 'dark');
  await command('theme dark'); // Same-state commands are still deliberate persisted choices.
  assert.equal(await page.evaluate(() => localStorage.getItem('rhine-quiet-theme')), 'dark');
  await command('open twin-sparrow');
  assert.equal(await page.locator('#quiet-dev').isVisible(), true);
  assert.equal(await page.locator('.dev-records a').count(), 0);
  await command('open hoegs');
  assert.equal(await page.locator('.dev-records a[href="https://zenodo.org/records/22260729"]').count(), 1);
  for (const width of [320, 390, 768, 1440]) {
    await page.setViewportSize({ width, height: width < 700 ? 844 : 900 });
    for (const { code: lang } of LANGUAGES) {
      await page.selectOption('#language', lang);
      for (const theme of ['light', 'dark']) {
        if (await page.locator('html').getAttribute('data-theme') !== theme) await page.locator('#quiet-theme').click();
        assert.equal(await page.locator('#quiet-theme').getAttribute('aria-pressed'), String(theme === 'dark'));
        assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true, `Dev ${lang} ${width} ${theme} overflow`);
        assert.equal(await page.locator('#photo-count').textContent(), savedGui.count);
        assert.ok(!(await page.locator('#dev-output').textContent()).includes('undefined'));
      }
    }
  }
  check('Minimal view/theme controls and Dev Mode work in all six languages at 320/390/768/1440px without overflow or album resets');
  await page.selectOption('#language', 'en');
  await command('clear');
  await command('help');
  if (controlsCapture) {
    for (const width of [1440, 390]) {
      await page.setViewportSize({ width, height: width === 390 ? 844 : 900 });
      for (const theme of ['light', 'dark']) {
        if (await page.locator('html').getAttribute('data-theme') !== theme) await page.locator('#quiet-theme').click();
        await page.evaluate(() => scrollTo(0, 0));
        if (width === 390) assert.ok(await page.locator('#dev-form').evaluate((element) => element.getBoundingClientRect().bottom <= innerHeight), 'Mobile command prompt stays in the initial viewport');
        await screenshot(page, `dev-${width}-${theme}.png`, false);
      }
    }
  }
  await command('open paris');
  assert.equal(await page.locator('#quiet-mode').getAttribute('aria-pressed'), 'false');
  assert.equal(new URL(page.url()).hash, '#album-paris');
  await waitImage(page, '#album-image');
  assert.equal(await page.locator('#album-heading').textContent(), 'City of Light(s) / 2022');
  await page.locator('#quiet-mode').evaluate((button) => button.click());
  await page.keyboard.press('Escape');
  assert.equal(await page.locator('#quiet-dev').isVisible(), false);
  await page.locator('#quiet-mode').evaluate((button) => button.click());
  await page.evaluate(() => { location.hash = '#work'; });
  await page.locator('#quiet-dev').waitFor({ state: 'hidden' });
  assert.equal(await page.locator('#quiet-gui').isVisible(), true);
  check('Known album commands open the real inline viewer; Escape and hash navigation always return to GUI');

  if (controlsCapture && !devOnlyCapture) {
    await page.goto(`${origin}/`);
    for (const width of [1440, 390]) {
      await page.setViewportSize({ width, height: width === 390 ? 844 : 900 });
      for (const theme of ['light', 'dark']) {
        if (await page.locator('html').getAttribute('data-theme') !== theme) await page.locator('#quiet-theme').click();
        await waitImage(page, '.cinematic img');
        await page.evaluate(() => scrollTo(0, 0));
        await screenshot(page, `controls-${width}-${theme}.png`, false);
      }
    }
  }
  await page.selectOption('#language', 'de');
  await page.reload();
  await page.locator('.preferences:not([hidden])').waitFor();
  assert.equal(await page.locator('#quiet-mode').getAttribute('aria-label'), 'Entwicklermodus');
  assert.equal(await page.locator('#dev-output').getAttribute('aria-label'), 'Befehlsergebnisse');
  assert.equal(await page.locator('.dev-shortcuts').getAttribute('aria-label'), 'Portfolio-Befehl');
  await page.selectOption('#language', 'en');
  await page.locator('[data-read-approach]').click();
  await page.waitForURL('**/templates/quiet/approach.html');
  await page.locator('.preferences:not([hidden])').waitFor();
  assert.equal(await page.locator('#quiet-mode').count(), 0);
  for (const width of [320, 390, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    for (const { code: lang } of LANGUAGES) {
      await page.selectOption('#language', lang);
      for (const theme of ['light', 'dark']) {
        if (await page.locator('html').getAttribute('data-theme') !== theme) await page.locator('#quiet-theme').click();
        assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true, `Approach ${lang} ${width} ${theme} overflow`);
        const source = approachSources[lang];
        assert.deepEqual(await page.locator('.approach-body > p').allTextContents(), source.paragraphs);
        assert.deepEqual(await page.locator('.approach-principles li').allTextContents(), source.principles);
        assert.equal(await page.locator('.approach-direction, .design-colophon').count(), 0);
        assert.equal(await page.locator('a[href="https://relics.quest/#top"]').count(), 0);
        assert.equal(await page.locator('.reading-end a').count(), 1);
        assert.equal(await page.locator('.reader-footer a').count(), 0);
      }
    }
  }
  await page.selectOption('#language', 'en');
  if (controlsCapture && !devOnlyCapture) {
    for (const width of [1440, 390]) {
      await page.setViewportSize({ width, height: width === 390 ? 844 : 900 });
      for (const theme of ['light', 'dark']) {
        if (await page.locator('html').getAttribute('data-theme') !== theme) await page.locator('#quiet-theme').click();
        await page.evaluate(() => scrollTo(0, 0));
        await screenshot(page, `approach-${width}-${theme}.png`);
      }
    }
  }
  await page.setViewportSize({ width: 780, height: 900 });
  await page.evaluate(() => { document.documentElement.style.zoom = '2'; });
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
  await page.evaluate(() => { document.documentElement.style.zoom = ''; });
  await page.reload();
  assert.equal(await page.locator('#quiet-theme').getAttribute('aria-pressed'), 'true');
  await page.locator('.reading-end a').click();
  await page.waitForURL('**/#about');
  await page.locator('#quiet-mode').evaluate((button) => button.click());
  await command('open approach');
  await page.waitForURL('**/templates/quiet/approach.html');
  await page.goBack();
  await page.locator('#quiet-gui').waitFor({ state: 'visible' });
  assert.equal(await page.locator('#quiet-mode').getAttribute('aria-pressed'), 'false');
  check('Approach preserves every source paragraph/principle across languages, themes and widths; direct links, Dev open, reload and native Back work');
  await page.goto(`${origin}/#contact`);
  await page.locator('.preferences:not([hidden])').waitFor();
  assert.equal(await page.locator('#contact a[href="https://x.com/leszxix"]').count(), 1);
  assert.equal(await page.locator('a[href="https://x.com/codefar1"]').count(), 0);
  assert.deepEqual(errors, []);
  check('No uncaught JavaScript errors during portfolio, Dev Mode or reading-page interactions');
  await ctx.close();

  const denied = await context({ colorScheme: 'dark' });
  await denied.addInitScript(() => {
    Storage.prototype.getItem = () => { throw new Error('storage denied'); };
    Storage.prototype.setItem = () => { throw new Error('storage denied'); };
  });
  const deniedPage = await denied.newPage();
  const deniedErrors = [];
  deniedPage.on('pageerror', (error) => deniedErrors.push(error.message));
  await deniedPage.goto(`${origin}/`);
  assert.equal(await deniedPage.locator('html').getAttribute('data-theme'), 'dark');
  await deniedPage.locator('#quiet-theme').click();
  assert.equal(await deniedPage.locator('html').getAttribute('data-theme'), 'light');
  await deniedPage.selectOption('#language', 'it');
  assert.equal(await deniedPage.locator('html').getAttribute('lang'), 'it');
  assert.deepEqual(deniedErrors, []);
  await deniedPage.locator('[data-read-note]').click();
  await deniedPage.waitForURL('**/notes.html');
  await deniedPage.selectOption('#language', 'fr');
  await deniedPage.locator('#quiet-theme').click();
  assert.equal(await deniedPage.locator('html').getAttribute('data-theme'), 'light');
  assert.equal(await deniedPage.locator('.note-body > p').count(), 18);
  assert.deepEqual(deniedErrors, []);
  await deniedPage.goto(`${origin}/`);
  await deniedPage.locator('#quiet-mode').click();
  await deniedPage.locator('#dev-input').fill('theme light');
  await deniedPage.locator('#dev-input').press('Enter');
  assert.equal(await deniedPage.locator('html').getAttribute('data-theme'), 'light');
  await deniedPage.locator('[data-dev-exit]').click();
  await deniedPage.locator('[data-read-approach]').click();
  await deniedPage.waitForURL('**/approach.html');
  await deniedPage.selectOption('#language', 'zh');
  await deniedPage.locator('#quiet-theme').click();
  assert.equal(await deniedPage.locator('html').getAttribute('data-theme'), 'light');
  assert.equal(await deniedPage.locator('.approach-body > p').count(), 3);
  assert.equal(await deniedPage.locator('.approach-principles li').count(), 6);
  assert.equal(await deniedPage.locator('a[href="https://relics.quest/#top"]').count(), 0);
  assert.deepEqual(deniedErrors, []);
  check('Blocked storage falls back to OS theme; portfolio, Dev Mode, Notes and approach controls still work');
  await denied.close();

  const nojs = await context({ javaScriptEnabled: false, colorScheme: 'dark' });
  const nojsPage = await nojs.newPage();
  await nojsPage.goto(`${origin}/`);
  assert.equal(await nojsPage.locator('#intro-heading').textContent(), 'I build to understand.');
  assert.equal(await nojsPage.locator('.work-row').count(), 6);
  assert.equal(await nojsPage.locator('[data-work-id="relics"] > p').textContent(), COPY.en.relicsBody);
  assert.equal(await nojsPage.locator('.relics-link').getAttribute('href'), relicsUrl);
  await waitImage(nojsPage, '.identity-portrait');
  assert.deepEqual(await nojsPage.locator('#quiet-sections > section').evaluateAll(nodes => nodes.map(node => node.id)), ['about', 'work', 'photography', 'research', 'notes', 'contact']);
  assert.equal(await nojsPage.locator('.identity-portrait').count(), 1);
  assert.equal(await nojsPage.locator('.location-flag').count(), 0);
  assert.equal(await nojsPage.locator('#entry-intro').isVisible(), false);
  assert.equal(await nojsPage.locator('.page-shell > .footer a').count(), 0);
  assert.equal(await nojsPage.locator('.page-shell > .footer').textContent(), 'Rhine Tague');
  assert.equal(await nojsPage.locator('.preferences').isVisible(), false);
  assert.equal(await nojsPage.locator('body').evaluate((element) => getComputedStyle(element).backgroundColor), 'rgb(33, 31, 28)');
  assert.equal(await nojsPage.locator('.cinematic [data-album]').getAttribute('href'), '/#photography');
  await nojsPage.locator('[data-read-note]').click();
  await nojsPage.waitForURL('**/notes.html');
  assert.equal(await nojsPage.locator('.note-body > p').count(), 18);
  assert.equal(await nojsPage.locator('.preferences').isVisible(), false);
  assert.equal(await nojsPage.locator('body').evaluate((element) => getComputedStyle(element).backgroundColor), 'rgb(33, 31, 28)');
  assert.equal(await nojsPage.locator('.reader-footer a').count(), 0);
  assert.equal(await nojsPage.locator('.reading-end a').count(), 1);
  await nojsPage.locator('.reading-end .text-link').click();
  await nojsPage.waitForURL('**/#notes');
  assert.equal(await nojsPage.locator('#quiet-dev').isVisible(), false);
  await nojsPage.locator('[data-read-approach]').click();
  await nojsPage.waitForURL('**/approach.html');
  assert.equal(await nojsPage.locator('.approach-body > p').count(), 3);
  assert.equal(await nojsPage.locator('.approach-principles li').count(), 6);
  assert.equal(await nojsPage.locator('a[href="https://relics.quest/#top"]').count(), 0);
  assert.equal(await nojsPage.locator('.preferences').isVisible(), false);
  assert.equal(await nojsPage.locator('body').evaluate((element) => getComputedStyle(element).backgroundColor), 'rgb(33, 31, 28)');
  assert.equal(await nojsPage.locator('.reader-footer a').count(), 0);
  assert.equal(await nojsPage.locator('.reading-end a').count(), 1);
  await nojsPage.locator('.reading-end a').click();
  await nojsPage.waitForURL('**/#about');
  check('No-JavaScript fallback includes six previews and full Notes/approach reading and return paths, following the OS theme');
  await nojs.close();

  const touch = await context({ isMobile: true, hasTouch: true, viewport: { width: 390, height: 844 } });
  const touchPage = await touch.newPage();
  await touchPage.goto(`${origin}/`);
  await touchPage.locator('.preferences:not([hidden])').waitFor();
  await touchPage.waitForFunction(() => ['done', 'bypassed'].includes(document.documentElement.dataset.entryBoot));
  const touchSession = await touch.newCDPSession(touchPage);
  await touchSession.send('Input.synthesizeScrollGesture', { x: 195, y: 580, yDistance: -350, speed: 500, gestureSourceType: 'touch' });
  await touchPage.waitForFunction(() => scrollY > 0);
  assert.equal(await touchPage.locator('html').evaluate((element) => getComputedStyle(element).scrollbarWidth), 'none');
  await touch.close();
  check('Hidden scrollbars preserve native touch scrolling on a mobile Chromium context');

  const failed = await context();
  await failed.route('**/img/switzerland.webp', (route) => route.fulfill({ status: 404, body: '' }));
  const failedPage = await failed.newPage();
  await failedPage.goto(`${origin}/#album-switzerland`);
  await failedPage.locator('#image-error:not([hidden])').waitFor();
  assert.equal(await failedPage.locator('#full-image').isVisible(), false);
  await failedPage.locator('[data-photo-next]').click();
  await waitImage(failedPage, '#album-image');
  assert.equal(await failedPage.locator('#image-error').isVisible(), false);
  assert.equal(await failedPage.locator('#full-image').isVisible(), true);
  check('Album image failure is explained and next-image navigation recovers');
  await failed.close();

  const interactions = await context({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  await interactions.addInitScript(() => Object.defineProperty(navigator, 'connection', { value: { saveData: true, effectiveType: '4g' }, configurable: true }));
  const interactionPage = await interactions.newPage();
  const interactionErrors = [];
  interactionPage.on('pageerror', error => interactionErrors.push(error.message));
  await interactionPage.goto(`${origin}/`);
  await interactionPage.locator('.preferences:not([hidden])').waitFor();
  await interactionPage.waitForFunction(() => ['done', 'bypassed'].includes(document.documentElement.dataset.entryBoot));
  assert.equal(await interactionPage.locator('#contact a[href="https://substack.com/@les1587833"]').count(), 1);
  const themeChanges = await interactionPage.evaluate(async () => {
    let body = 0; let content = 0;
    const a = new MutationObserver(records => { body += records.length; });
    const b = new MutationObserver(records => { content += records.length; });
    const options = { subtree: true, childList: true, characterData: true, attributes: true };
    a.observe(document.body, options); b.observe(document.querySelector('#quiet-sections'), options);
    document.querySelector('#quiet-theme').click();
    await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    a.disconnect(); b.disconnect();
    return { body, content, transition: getComputedStyle(document.querySelector('#quiet-theme')).transitionDuration, touch: getComputedStyle(document.querySelector('#quiet-theme')).touchAction };
  });
  assert.equal(themeChanges.content, 0);
  assert.ok(themeChanges.body <= 8);
  assert.equal(themeChanges.transition, '0s');
  assert.equal(themeChanges.touch, 'manipulation');
  check('Substack contact is explicit; touch-theme changes avoid translated-content rewrites and hover transitions');

  const speculative = [];
  interactionPage.on('request', request => { if (request.url().includes('/img/switzerland/')) speculative.push(request.url()); });
  await interactionPage.locator('[data-album="switzerland"]').first().click();
  await waitImage(interactionPage, '#album-image');
  assert.equal(speculative.length, 0, 'Save-Data disables adjacent-image requests');
  await interactions.route('**/img/switzerland/switz-landsc-1.webp', async route => { await new Promise(resolve => setTimeout(resolve, 350)); await route.fallback(); });
  const retained = await interactionPage.evaluate(() => {
    const image = document.querySelector('#album-image'); const source = image.getAttribute('src');
    const height = document.querySelector('.viewer-stage').getBoundingClientRect().height;
    document.querySelector('[data-photo-next]').click();
    return { retained: source === image.getAttribute('src'), busy: document.querySelector('.viewer-stage').getAttribute('aria-busy'), disabled: document.querySelector('[data-photo-preview]').getAttribute('aria-disabled'), height, nextHeight: document.querySelector('.viewer-stage').getBoundingClientRect().height };
  });
  assert.equal(retained.retained, true); assert.equal(retained.busy, 'true'); assert.equal(retained.disabled, 'true'); assert.equal(retained.height, retained.nextHeight);
  await interactionPage.locator('[data-photo-next]').click();
  await waitImage(interactionPage, '#album-image');
  assert.ok((await interactionPage.locator('#album-image').getAttribute('src')).endsWith('/switz-port-1.webp'));
  await interactionPage.waitForTimeout(400);
  assert.ok((await interactionPage.locator('#album-image').getAttribute('src')).endsWith('/switz-port-1.webp'));
  check('Delayed album loads retain the decoded photo and frame; rapid input rejects stale results; Save-Data prevents speculation');

  await interactionPage.locator('#album-image').click();
  await interactionPage.locator('#photo-preview[open]').waitFor();
  const beforeClose = await interactionPage.evaluate(() => ({ scroll: scrollY, source: document.querySelector('#album-image').getAttribute('src') }));
  const exit = await interactionPage.evaluate(() => { document.querySelector('#preview-close').click(); const dialog = document.querySelector('#photo-preview'); return { open: dialog.open, closing: dialog.classList.contains('is-closing') }; });
  assert.deepEqual(exit, { open: true, closing: true });
  await interactionPage.waitForFunction(() => !document.querySelector('#photo-preview').open);
  assert.equal(await interactionPage.evaluate(() => scrollY), beforeClose.scroll);
  assert.equal(await interactionPage.locator('#album-image').getAttribute('src'), beforeClose.source);
  assert.equal(await interactionPage.evaluate(() => document.activeElement.hasAttribute('data-photo-preview')), true);
  await interactionPage.emulateMedia({ reducedMotion: 'reduce' });
  await interactionPage.locator('#album-image').click();
  await interactionPage.locator('#photo-preview[open]').waitFor();
  assert.equal(await interactionPage.evaluate(() => { document.querySelector('#preview-close').click(); return document.querySelector('#photo-preview').open; }), false);
  await interactionPage.emulateMedia({ reducedMotion: 'no-preference' });
  await interactionPage.locator('#album-image').click();
  await interactionPage.locator('#photo-preview[open]').waitFor();
  await interactionPage.evaluate(() => { document.querySelector('#preview-close').click(); location.hash = '#research'; });
  await interactionPage.waitForFunction(() => !document.querySelector('#photo-preview').open && document.activeElement.id === 'research-heading');
  const routeScroll = await interactionPage.evaluate(() => scrollY);
  await interactionPage.waitForTimeout(200);
  assert.equal(await interactionPage.evaluate(() => scrollY), routeScroll);
  assert.equal(await interactionPage.evaluate(() => document.documentElement.style.overflow === 'hidden'), false);
  assert.deepEqual(interactionErrors, []);
  check('Preview exit fades while retaining native modality, restores state once, skips reduced motion and cannot undo a route change');
  await interactions.close();

  const previewNavigation = await context({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  await previewNavigation.addInitScript(() => Object.defineProperty(navigator, 'connection', { value: { saveData: true }, configurable: true }));
  const navigationPage = await previewNavigation.newPage();
  const navigationErrors = [];
  navigationPage.on('pageerror', error => navigationErrors.push(error.message));
  await navigationPage.goto(`${origin}/#album-switzerland`);
  for (const { code } of LANGUAGES) {
    await navigationPage.selectOption('#language', code);
    await waitImage(navigationPage, '#album-image');
    for (const width of [320, 390, 768, 1440]) {
      await navigationPage.setViewportSize({ width, height: 844 });
      for (const theme of ['light', 'dark']) {
        if (await navigationPage.locator('html').getAttribute('data-theme') !== theme) await navigationPage.locator('#quiet-theme').click();
        await navigationPage.locator('#album-image').click();
        await waitImage(navigationPage, '#preview-image');
        const geometry = await navigationPage.evaluate(() => {
          const dialog = document.querySelector('#photo-preview').getBoundingClientRect();
          const nav = document.querySelector('.preview-navigation').getBoundingClientRect();
          const buttons = [...document.querySelectorAll('.preview-navigation button')].map(button => ({ width: button.getBoundingClientRect().width, height: button.getBoundingClientRect().height, label: button.getAttribute('aria-label') }));
          return { offset: Math.abs(nav.x + nav.width / 2 - dialog.x - dialog.width / 2), overflow: document.querySelector('#photo-preview').scrollWidth > dialog.width + 1, buttons };
        });
        assert.ok(geometry.offset <= 1, `Preview navigation is centered: ${code}/${width}/${theme}`);
        assert.equal(geometry.overflow, false, `Preview has no horizontal overflow: ${code}/${width}/${theme}`);
        assert.ok(geometry.buttons.every(button => button.width >= 44 && button.height >= 44 && button.label));
        await navigationPage.locator('#preview-close').click();
        await navigationPage.waitForFunction(() => !document.querySelector('#photo-preview').open);
      }
    }
  }
  check('Preview previous/next stay centered with 44px localized targets across six languages, four widths and both themes');
  await navigationPage.selectOption('#language', 'en');
  await waitImage(navigationPage, '#album-image');
  await navigationPage.setViewportSize({ width: 390, height: 844 });
  await navigationPage.locator('#album-image').click();
  await waitImage(navigationPage, '#preview-image');
  const navigationHash = await navigationPage.evaluate(() => location.hash);
  await navigationPage.locator('[data-preview-prev]').click();
  await waitImage(navigationPage, '#preview-image');
  assert.equal(await navigationPage.locator('#preview-count').textContent(), '13 / 13');
  await navigationPage.keyboard.press('ArrowRight');
  await waitImage(navigationPage, '#preview-image');
  assert.equal(await navigationPage.locator('#preview-count').textContent(), '01 / 13');
  await navigationPage.locator('[data-preview-next]').click();
  await waitImage(navigationPage, '#preview-image');
  assert.equal(await navigationPage.locator('#preview-count').textContent(), '02 / 13');
  assert.equal(await navigationPage.locator('#preview-original').getAttribute('href'), await navigationPage.locator('#preview-image').getAttribute('src'));
  assert.equal(await navigationPage.evaluate(() => location.hash), navigationHash);
  const navigationScroll = await navigationPage.evaluate(() => scrollY);
  await navigationPage.locator('#preview-image').click();
  await navigationPage.waitForFunction(() => !document.querySelector('#photo-preview').open);
  assert.equal(await navigationPage.locator('#photo-count').textContent(), '02 / 13');
  assert.equal(await navigationPage.evaluate(() => scrollY), navigationScroll);
  assert.equal(await navigationPage.evaluate(() => document.activeElement.hasAttribute('data-photo-preview')), true);
  await navigationPage.locator('#album-image').click();
  await waitImage(navigationPage, '#preview-image');
  await navigationPage.keyboard.press('ArrowRight');
  await waitImage(navigationPage, '#preview-image');
  await navigationPage.locator('#preview-dismiss').focus();
  await navigationPage.keyboard.press('Space');
  await navigationPage.waitForFunction(() => !document.querySelector('#photo-preview').open);
  assert.equal(await navigationPage.locator('#photo-count').textContent(), '03 / 13');
  check('Preview buttons/arrows share album state and wrap; photo click and Space close with the latest photo, hash, focus and scroll intact');

  await previewNavigation.route('**/img/switzerland/switz-port-2.webp', async route => { await new Promise(resolve => setTimeout(resolve, 350)); await route.fallback(); });
  await navigationPage.locator('#album-image').click();
  await waitImage(navigationPage, '#preview-image');
  const pendingPreview = await navigationPage.evaluate(() => { const source = document.querySelector('#preview-image').getAttribute('src'); document.querySelector('[data-preview-next]').click(); return { retained: source === document.querySelector('#preview-image').getAttribute('src'), busy: document.querySelector('.lightbox-stage').getAttribute('aria-busy') }; });
  assert.deepEqual(pendingPreview, { retained: true, busy: 'true' });
  await navigationPage.locator('[data-preview-next]').click();
  await waitImage(navigationPage, '#preview-image');
  await navigationPage.waitForTimeout(400);
  assert.ok((await navigationPage.locator('#preview-image').getAttribute('src')).endsWith('/switz-landsc-2.webp'));
  assert.equal(await navigationPage.locator('#preview-count').textContent(), '05 / 13');
  await previewNavigation.route('**/img/switzerland/switz-port-3.webp', route => route.fulfill({ status: 404, body: '' }));
  await navigationPage.locator('#preview-dismiss').focus();
  await navigationPage.keyboard.press('ArrowRight');
  await navigationPage.waitForFunction(() => document.querySelector('.lightbox-stage').getAttribute('aria-busy') === 'false' && !document.querySelector('#preview-status').hidden);
  assert.equal(await navigationPage.locator('#preview-dismiss').isVisible(), false);
  assert.equal(await navigationPage.locator('#preview-original').isVisible(), false);
  assert.equal(await navigationPage.evaluate(() => document.activeElement.hasAttribute('data-preview-next')), true);
  await navigationPage.keyboard.press('Escape');
  await navigationPage.waitForFunction(() => !document.querySelector('#photo-preview').open);
  assert.equal(await navigationPage.evaluate(() => document.activeElement.hasAttribute('data-photo-next')), true);
  await navigationPage.locator('[data-photo-prev]').click();
  await waitImage(navigationPage, '#album-image');
  await navigationPage.locator('#album-image').click();
  await waitImage(navigationPage, '#preview-image');
  await navigationPage.locator('[data-preview-next]').click();
  await navigationPage.waitForFunction(() => document.querySelector('.lightbox-stage').getAttribute('aria-busy') === 'false' && !document.querySelector('#preview-status').hidden);
  await navigationPage.locator('[data-preview-next]').click();
  await waitImage(navigationPage, '#preview-image');
  assert.equal(await navigationPage.locator('#preview-count').textContent(), '07 / 13');
  await navigationPage.keyboard.press('Escape');
  await navigationPage.waitForFunction(() => !document.querySelector('#photo-preview').open);
  assert.deepEqual(navigationErrors, []);
  check('Preview loading retains the photo; rapid navigation rejects stale results and failed images recover without reopening the dialog');
  await previewNavigation.close();

  const alias = await context();
  const aliasPage = await alias.newPage();
  await aliasPage.goto(`${origin}/templates/quiet/`);
  await aliasPage.locator('.preferences:not([hidden])').waitFor();
  assert.equal(await aliasPage.locator('#intro-heading').textContent(), 'I build to understand.');
  await aliasPage.locator('.identity .name').click();
  await aliasPage.waitForURL(`${origin}/`);
  await aliasPage.locator('.preferences:not([hidden])').waitFor();
  assert.equal(await aliasPage.locator('canvas').count(), 0);
  check('Existing Quiet template URL remains usable; identity returns to the canonical root homepage');
  await alias.close();

  const old = await context();
  const oldPage = await old.newPage();
  const oldRequests = [];
  oldPage.on('request', (request) => oldRequests.push(request.url()));
  await oldPage.goto(`${origin}/templates/ocean/`);
  await oldPage.locator('.home-hero-link').waitFor();
  assert.equal(await oldPage.locator('#canvas').count(), 1);
  await oldPage.goto(`${origin}/templates/ocean/#work`);
  assert.ok((await oldPage.locator('body').textContent()).includes('Wu-Weism'));
  assert.ok(!oldRequests.some((url) => url.includes('/templates/quiet/')));
  await oldPage.goto(`${origin}/templates/ocean/#contact`);
  await oldPage.locator('a[href="https://x.com/leszxix"]').waitFor();
  assert.ok((await oldPage.locator('a[href="https://x.com/leszxix"]').textContent()).includes('@leszxix'));
  check('Preserved ocean route still initializes its hero/canvas and work hash route, without Quiet code; both portfolios use the new X account');
  await old.close();
} finally {
  await browser.close();
  await mkdir(output, { recursive: true });
  await writeFile(resolve(output, 'browser-checks.json'), JSON.stringify(report, null, 2));
}
