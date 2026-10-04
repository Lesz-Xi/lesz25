// Existing local preview and installed browser only; no server/build/install.
import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';
import { COPY } from '../templates/quiet/copy.js';
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE ? pathToFileURL(process.env.PLAYWRIGHT_MODULE).href : 'playwright');
const origin = process.env.QUIET_BASE_URL || 'http://localhost:5174';
const output = new URL('../.impeccable/review/', import.meta.url);
await mkdir(output, { recursive: true });
const browser = await chromium.launch({ headless: true, ...(process.env.BROWSER_PATH ? { executablePath: process.env.BROWSER_PATH } : {}) });
const report = { boundary: 'Existing live-Vite Chromium, emulated mobile, implementation review; not hosted/physical-device/other-engine/accessibility certification.', checks: [], screenshots: [] };
const pass = text => { report.checks.push(text); console.log(`PASS ${text}`); };
const errors = [];
const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' });
try {
  const page = await ctx.newPage();
  page.on('pageerror', error => errors.push(error.message));
  await page.goto(origin);
  await page.locator('.menu-ready').waitFor();
  await page.waitForFunction(() => ['done', 'bypassed'].includes(document.documentElement.dataset.entryBoot));
  const menu = page.locator('#quiet-menu');
  const panel = page.locator('#quiet-navigation');
  const open = async () => { if (await menu.getAttribute('aria-expanded') === 'false') await menu.click(); };
  const closed = async () => { if (await menu.getAttribute('aria-expanded') === 'true') await menu.click(); };
  await page.evaluate(() => { window.__originalMode = document.querySelector('#quiet-mode'); window.__originalNav = document.querySelector('.section-nav'); });
  for (const width of [320, 390, 430, 700]) {
    await page.setViewportSize({ width, height: 844 });
    for (const locale of Object.keys(COPY)) {
      await page.selectOption('#language', locale);
      for (const theme of ['light', 'dark']) {
        await closed();
        if (await page.locator('html').getAttribute('data-theme') !== theme) await page.locator('#quiet-theme').click();
        assert.equal(await menu.textContent(), COPY[locale].menu);
        assert.equal(await panel.isVisible(), false);
        assert.equal(await page.locator('#quiet-mode').isVisible(), false);
        assert.equal(await page.locator('#quiet-gui-control').getAttribute('aria-pressed'), 'true');
        const geometry = await page.evaluate(() => {
          const rect = id => document.getElementById(id).getBoundingClientRect();
          const button = rect('quiet-menu'), lang = rect('language'), theme = rect('quiet-theme');
          return { row: Math.abs(button.top - lang.top) < 1 && Math.abs(button.top - theme.top) < 1, targets: [button, lang, theme].every(r => r.width >= 44 && r.height >= 44), overflow: document.documentElement.scrollWidth > innerWidth, headerHeight: document.querySelector('.topbar').getBoundingClientRect().height };
        });
        assert.deepEqual({ row: geometry.row, targets: geometry.targets, overflow: geometry.overflow }, { row: true, targets: true, overflow: false });
        assert.ok(geometry.headerHeight <= 80);
        await open();
        assert.equal(await menu.textContent(), COPY[locale].menuClose);
        assert.equal(await panel.isVisible(), true);
        assert.equal(await page.locator('.mobile-view [data-copy]').textContent(), COPY[locale].menuView);
        const rows = await page.locator('.section-nav a').evaluateAll(nodes => nodes.map(node => ({ left: node.getBoundingClientRect().left, top: node.getBoundingClientRect().top, height: node.getBoundingClientRect().height, href: node.getAttribute('href') })));
        assert.deepEqual(rows.map(row => row.href), ['#about', '#work', '#photography', '#research', '#notes', '#contact']);
        assert.ok(rows.every((row, i) => row.height >= 44 && row.left === rows[0].left && (!i || row.top >= rows[i - 1].top + rows[i - 1].height)));
        assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth && document.querySelector('#quiet-mode') === window.__originalMode && document.querySelector('.section-nav') === window.__originalNav), true);
        assert.equal(await page.locator('#quiet-mode').isVisible(), true);
        assert.equal(await page.locator('#quiet-gui-control').isVisible(), true);
        assert.equal(await page.locator('[role="dialog"]:visible, [role="menu"]').count(), 0);
      }
    }
    pass(`Six locales × two themes at ${width}px: one compact row, 44px targets, localized single-column index and one shared view group`);
  }
  await page.setViewportSize({ width: 390, height: 844 });
  await page.selectOption('#language', 'en');
  await closed();
  await menu.focus();
  await page.keyboard.press('Enter');
  await page.keyboard.press('Tab');
  assert.equal(await page.locator('#language').evaluate(el => el === document.activeElement), true);
  await page.keyboard.press('Tab');
  assert.equal(await page.locator('#quiet-theme').evaluate(el => el === document.activeElement), true);
  await page.keyboard.press('Tab');
  assert.equal(await page.locator('.section-nav a').first().evaluate(el => el === document.activeElement && el.matches(':focus-visible')), true);
  await page.keyboard.press('Escape');
  assert.equal(await menu.evaluate(el => el === document.activeElement), true);
  assert.equal(await panel.isVisible(), false);
  pass('Enter/Space disclosure, natural row-to-index Tab order, Escape closes and restores Menu focus without a focus trap');
  await menu.press('Space');
  await page.selectOption('#language', 'de');
  assert.equal(await menu.textContent(), COPY.de.menuClose);
  assert.equal(await panel.isVisible(), true);
  const hero = await page.locator('#quiet-hero').evaluate(el => { window.__hero = el.firstElementChild; return el.textContent; });
  await page.locator('#quiet-theme').click();
  assert.equal(await page.locator('#quiet-hero').evaluate(el => el.firstElementChild === window.__hero), true);
  assert.equal(await page.locator('#quiet-hero').textContent(), hero);
  assert.equal(await panel.isVisible(), true);
  pass('Open menu survives translation/theme changes; theme does not rewrite hero or reset disclosure');
  await page.selectOption('#language', 'en');
  for (const id of ['about', 'work', 'photography', 'research', 'notes', 'contact']) {
    await open();
    await page.locator(`.section-nav a[href="#${id}"]`).click();
    await page.waitForFunction(id => location.hash === `#${id}` && document.activeElement.id === `${id}-heading`, id);
    assert.equal(await panel.isVisible(), false);
  }
  await open();
  await page.locator('.section-nav a[href="#contact"]').click();
  await page.waitForFunction(() => document.activeElement.id === 'contact-heading');
  assert.equal(await panel.isVisible(), false);
  pass('All six native hashes close the menu and focus their real headings, including the current hash');
  await open();
  await page.locator('#quiet-mode').click();
  assert.equal(await page.locator('#quiet-dev').isVisible(), true);
  assert.equal(await panel.isVisible(), false);
  assert.equal(await page.locator('#dev-input').evaluate(el => el === document.activeElement), true);
  await open();
  await page.locator('#quiet-mode').click();
  assert.equal(await panel.isVisible(), false);
  assert.equal(await page.locator('#dev-input').evaluate(el => el === document.activeElement), true);
  await page.locator('#dev-input').fill('ls work');
  await page.locator('#dev-input').press('Enter');
  const transcript = await page.locator('#dev-output').textContent();
  await open();
  await page.keyboard.press('Escape');
  assert.equal(await page.locator('#quiet-dev').isVisible(), true);
  assert.equal(await menu.evaluate(el => el === document.activeElement), true);
  await page.locator('#dev-input').focus();
  await page.keyboard.press('Escape');
  assert.equal(await page.locator('#quiet-gui').isVisible(), true);
  assert.equal(await menu.evaluate(el => el === document.activeElement), true);
  await open();
  await page.locator('#quiet-mode').click();
  assert.equal(await page.locator('#dev-output').textContent(), transcript);
  await open();
  await page.locator('.section-nav a[href="#contact"]').click();
  assert.equal(await page.locator('#quiet-gui').isVisible(), true);
  assert.equal(await panel.isVisible(), false);
  pass('Dev selection closes to the command input, preserves transcript, and Escape first closes the menu; native section links exit Dev even at the same hash');
  await open();
  await page.locator('#quiet-mode').click();
  await open();
  await page.locator('#quiet-gui-control').click();
  assert.equal(await page.locator('#quiet-gui').isVisible(), true);
  assert.equal(await panel.isVisible(), false);
  assert.equal(await menu.evaluate(el => el === document.activeElement), true);
  await open();
  await page.locator('#intro-heading').click();
  assert.equal(await panel.isVisible(), false);
  await open();
  await page.evaluate(() => { location.hash = '#work'; });
  await panel.waitFor({ state: 'hidden' });
  await page.goBack();
  assert.equal(await panel.isVisible(), false);
  pass('GUI selection and outside clicks close safely; route changes and native Back do not reopen stale menu state');
  for (const width of [701, 768, 1440, 390, 1440, 320]) {
    await page.setViewportSize({ width, height: 900 });
    await page.waitForFunction(mobile => document.querySelector('#quiet-menu').hidden === !mobile && document.querySelector('#quiet-navigation').hidden === mobile, width <= 700);
    assert.equal(await page.evaluate(mobile => document.querySelector('#quiet-mode').closest(mobile ? '.mobile-view' : '.preferences') !== null && document.querySelectorAll('#quiet-mode').length === 1 && document.querySelector('#quiet-mode') === window.__originalMode, width <= 700), true);
    if (width > 700) {
      assert.equal(await page.locator('.navigation-panel').evaluate(el => getComputedStyle(el).display), 'contents');
      assert.equal(await page.locator('.section-nav').isVisible(), true);
    }
  }
  await open();
  await page.locator('#quiet-mode').focus();
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.waitForFunction(() => document.querySelector('#quiet-mode').closest('.preferences') && document.activeElement.id === 'quiet-mode');
  await page.setViewportSize({ width: 390, height: 844 });
  await page.waitForFunction(() => document.querySelector('#quiet-navigation').hidden && document.activeElement.id === 'quiet-menu');
  pass('700/701px boundary and repeated desktop/mobile changes move, never duplicate, the same controls; focus remains on a visible control');
  await page.evaluate(() => { document.documentElement.style.zoom = '2'; });
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
  await page.evaluate(() => { document.documentElement.style.zoom = ''; });
  if (process.env.MOBILE_MENU_CAPTURE === '1') {
    await page.selectOption('#language', 'en');
    for (const width of [1440, 390]) {
      await page.setViewportSize({ width, height: width === 390 ? 844 : 900 });
      for (const theme of ['light', 'dark']) {
        await closed();
        if (await page.locator('html').getAttribute('data-theme') !== theme) await page.locator('#quiet-theme').click();
        await page.evaluate(() => scrollTo(0, 0));
        await page.waitForTimeout(180);
        const name = `menu-${width}-${theme}-closed.png`;
        await page.screenshot({ path: new URL(name, output).pathname });
        report.screenshots.push(name);
        if (width === 390) {
          await open();
          const name = `menu-${width}-${theme}-open.png`;
          await page.screenshot({ path: new URL(name, output).pathname });
          report.screenshots.push(name);
        }
      }
    }
  }
  assert.deepEqual(errors, []);
  pass('Native 200% zoom has no horizontal overflow; browser reports no page errors');
  for (const options of [{ javaScriptEnabled: false }, { reducedMotion: 'reduce' }]) {
    const fallback = await browser.newContext({ viewport: { width: 320, height: 844 }, ...options });
    if (options.javaScriptEnabled !== false) await fallback.route('**/mobile-menu.js*', route => route.abort());
    try {
      const p = await fallback.newPage();
      await p.goto(origin);
      assert.equal(await p.locator('#quiet-menu').isVisible(), false);
      assert.equal(await p.locator('.section-nav a:visible').count(), 6);
      await p.locator('.section-nav a[href="#work"]').click();
      assert.equal(new URL(p.url()).hash, '#work');
      assert.equal(await p.locator('#work').isVisible(), true);
    } finally { await fallback.close(); }
  }
  pass('No-JavaScript and missing enhancement module keep all six static native links usable');
} finally {
  await ctx.close();
  await browser.close();
  await writeFile(new URL('mobile-menu-checks.json', output), JSON.stringify(report, null, 2) + '\n');
}
