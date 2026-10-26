// Nav hairline and view-bracket response/geometry on an existing preview. No install/build/server.
import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';
import { COPY } from '../templates/quiet/copy.js';
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE ? pathToFileURL(process.env.PLAYWRIGHT_MODULE).href : 'playwright');
const browser = await chromium.launch({ headless: true, ...(process.env.BROWSER_PATH ? { executablePath: process.env.BROWSER_PATH } : {}) });
const origin = process.env.QUIET_BASE_URL || 'http://localhost:5174';
const output = new URL('../.impeccable/review/', import.meta.url);
await mkdir(output, { recursive: true });
const report = { boundary: 'Local existing-preview Chromium/CSS transitions and emulated touch; not physical-device/Safari/screen-reader/performance or hosted certification.', checks: [], screenshots: [] };
const pass = text => { report.checks.push(text); console.log(`PASS ${text}`); };
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
const openMenu = async page => {
  await page.waitForFunction(() => document.querySelector('#quiet-menu').hidden === !matchMedia('(max-width: 700px)').matches);
  if (await page.locator('#quiet-menu').isVisible() && await page.locator('#quiet-menu').getAttribute('aria-expanded') === 'false') await page.locator('#quiet-menu').click();
};
const clearInput = async page => { await page.mouse.move(1, 1); await page.evaluate(() => document.activeElement.blur()); };
const state = locator => locator.evaluate(el => {
  const label = el.querySelector('.bracket-label');
  const before = getComputedStyle(label, '::before'), after = getComputedStyle(label, '::after');
  const box = label.getBoundingClientRect();
  return { opacity: [before.opacity, after.opacity].map(Number), x: [before.transform, after.transform].map(value => new DOMMatrixReadOnly(value).m41), size: [before.width, before.height, after.width, after.height], strokes: [before.borderLeftWidth, before.borderTopWidth, before.borderBottomWidth, after.borderRightWidth, after.borderTopWidth, after.borderBottomWidth], position: [before.left, after.right], duration: before.transitionDuration, ease: before.transitionTimingFunction, bracketColor: before.borderTopColor, decorative: before.content === '""' && after.content === '""' && before.pointerEvents === 'none' && after.pointerEvents === 'none', box: [box.x, box.y, box.width, box.height], hit: el.getBoundingClientRect().height, center: box.y + box.height / 2 - (el.getBoundingClientRect().y + el.getBoundingClientRect().height / 2), text: el.textContent, underline: getComputedStyle(el).textDecorationLine, color: getComputedStyle(el).color };
});
const line = locator => locator.evaluate(el => {
  const label = el.matches('.link-label, .note-title, .hairline-control') ? el : el.querySelector('.link-label');
  const style = getComputedStyle(label);
  const [width, thickness] = style.backgroundSize.split(',')[0].trim().split(' ');
  const box = label.getBoundingClientRect();
  return { scale: parseFloat(width) / 100, thickness, lineColor: style.backgroundImage.match(/rgb\([^)]+\)/)?.[0], layers: style.backgroundImage.split('linear-gradient').length - 1, origin: style.backgroundPosition.split(',')[0].trim(), duration: style.transitionDuration, ease: style.transitionTimingFunction, box: [box.x, box.y, box.width, box.height], hit: el.getBoundingClientRect().height, center: box.y + (box.height - parseFloat(style.paddingBottom)) / 2 - (el.getBoundingClientRect().y + el.getBoundingClientRect().height / 2), text: el.textContent, underline: getComputedStyle(el).textDecorationLine, color: getComputedStyle(el).color, noBrackets: el.querySelector('.bracket-label') === null };
});
const settled = locator => locator.evaluate(async el => {
  const animations = el.getAnimations({ subtree: true });
  await Promise.all(animations.map(animation => animation.finished.catch(() => {})));
});
try {
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto(origin);
  await page.locator('.menu-ready').waitFor();
  await page.waitForFunction(() => ['done', 'bypassed'].includes(document.documentElement.dataset.entryBoot));
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  for (const width of [320, 390, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await openMenu(page);
    for (const locale of Object.keys(COPY)) {
      await page.selectOption('#language', locale);
      for (const theme of ['light', 'dark']) {
        if (await page.locator('html').getAttribute('data-theme') !== theme) await page.locator('#quiet-theme').click();
        await clearInput(page);
        const link = page.locator('.section-nav a[href="#work"]');
        const rest = await line(link);
        assert.equal(rest.scale, 0);
        assert.equal(rest.noBrackets, true, 'Section links no longer carry brackets');
        assert.equal(rest.thickness, '2px');
        assert.equal(rest.lineColor, 'rgb(245, 200, 87)', 'Hover line uses the yellow token');
        assert.equal(parseFloat(rest.origin.split(' ')[0]), 0, 'Hairline draws and retracts at the label start');
        assert.equal(rest.text, COPY[locale].work);
        assert.ok(rest.hit >= 44 && rest.box[3] < rest.hit);
        assert.ok(Math.abs(rest.center) < 0.05, 'Intrinsic label stays vertically centered in the original 44px target');
        assert.equal(rest.underline, 'none');
        await link.hover();
        await settled(link);
        const hover = await line(link);
        assert.equal(hover.scale, 1);
        assert.deepEqual(hover.box, rest.box, 'Text and target do not move during hairline response');
        assert.equal(hover.duration, '0.24s');
        assert.equal(hover.ease, 'cubic-bezier(0.215, 0.61, 0.355, 1)');
        assert.equal(hover.color, theme === 'dark' ? 'rgb(244, 243, 240)' : 'rgb(36, 36, 36)', 'Hover text turns ink, not orange');
        await clearInput(page);
        await settled(link);
        const exit = await line(link);
        assert.equal(exit.scale, 0);
        assert.equal(exit.duration, '0.16s');
        const active = await state(page.locator('#quiet-gui-control'));
        const inactive = await state(page.locator('#quiet-mode'));
        assert.deepEqual(active.opacity, [1, 1]);
        assert.deepEqual(active.x, [0, 0]);
        assert.deepEqual(inactive.opacity, [0, 0]);
        assert.equal(await page.locator('#quiet-gui-control').getAttribute('aria-pressed'), 'true');
        assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
      }
    }
    pass(`${width}px × six locales/two themes: 2px yellow hairline spans the label, ink hover text, 240ms draw/160ms retract; view brackets keep selection; no text shift, selected-state loss or overflow`);
  }
  await page.selectOption('#language', 'en');
  for (const width of [1440, 390]) {
    await page.setViewportSize({ width, height: 900 });
    await openMenu(page);
    for (const selector of ['.section-nav a', '.view-control']) {
      const controls = await page.locator(selector).all();
      for (const control of controls) {
        await clearInput(page);
        await control.focus();
        await page.keyboard.press('Tab');
        await page.keyboard.press('Shift+Tab');
        await settled(control);
        assert.equal(await control.evaluate(el => el === document.activeElement && el.matches(':focus-visible') && getComputedStyle(el).outlineStyle === 'solid'), true, `${width}px keyboard ${await control.textContent()}`);
        assert.equal((await line(control)).scale, 1);
        if (selector === '.view-control') assert.deepEqual((await state(control)).opacity, await control.getAttribute('aria-pressed') === 'true' ? [1, 1] : [0, 0], 'Focus never adds brackets to an unselected view');
      }
    }
  }
  pass('All six links and both view buttons draw the hairline on keyboard focus at desktop/mobile; brackets stay on the selected view only; global outline retained');
  await page.setViewportSize({ width: 1440, height: 900 });
  await clearInput(page);
  const link = page.locator('.section-nav a[href="#research"]');
  await link.hover();
  await page.waitForTimeout(50);
  const mid = await line(link);
  assert.ok(mid.scale > 0 && mid.scale < 1);
  await page.mouse.move(1, 1);
  const reversed = await line(link);
  assert.ok(reversed.scale > 0 && reversed.scale < 1 && Math.abs(reversed.scale - mid.scale) < 0.35, 'Reversal continues from current progress');
  await settled(link);
  assert.equal((await line(link)).scale, 0);
  for (let i = 0; i < 3; i++) { await link.hover(); await page.waitForTimeout(20); await page.mouse.move(1, 1); }
  await settled(link);
  assert.equal((await line(link)).scale, 0);
  assert.equal(await link.evaluate(el => el.getAnimations({ subtree: true }).length), 0);
  const actions = ['.hero-work-link', '.work-row .text-link', '.paper-link', '.album-card', '.about-copy .text-link', '.note-title', '.note-read-link', '.email-link', '.social-links a'];
  for (const width of [1440, 390]) {
    await page.setViewportSize({ width, height: 900 });
    for (const selector of actions) {
      const action = page.locator(selector).first();
      await action.scrollIntoViewIfNeeded();
      await clearInput(page);
      await settled(action);
      const before = await line(action);
      assert.equal(before.scale, 0, selector);
      assert.equal(before.underline, 'none', `${selector} uses the hairline, not text-decoration`);
      assert.equal(before.layers, ['.hero-work-link', '.note-read-link', '.email-link'].includes(selector) ? 2 : 1, `${selector} resting underline layer`);
      await action.hover();
      await settled(action);
      const after = await line(action);
      assert.equal(after.scale, 1, selector);
      assert.deepEqual(after.box, before.box, `${selector} text does not move`);
      assert.equal(after.duration, '0.24s', selector);
    }
  }
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.evaluate(() => scrollTo(0, 0));
  for (const theme of ['light', 'dark']) {
    if (await page.locator('html').getAttribute('data-theme') !== theme) await page.locator('#quiet-theme').click();
    const ink = await page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue('--ink').trim());
    const inkRgb = await page.evaluate(value => { const probe = document.createElement('span'); probe.style.color = value; document.body.append(probe); const rgb = getComputedStyle(probe).color; probe.remove(); return rgb; }, ink);
    for (const id of ['#quiet-mode', '#quiet-gui-control']) {
      const control = page.locator(id);
      await clearInput(page);
      await settled(control);
      const selected = await control.getAttribute('aria-pressed') === 'true';
      await control.hover();
      await settled(control);
      const hovered = await state(control);
      assert.equal((await line(control)).scale, 1, `${id} hover draws the hairline`);
      assert.deepEqual(hovered.opacity, selected ? [1, 1] : [0, 0], `${id} hover does not add or remove brackets`);
      assert.equal(hovered.color, theme === 'dark' ? 'rgb(244, 243, 240)' : 'rgb(36, 36, 36)');
      if (selected) assert.equal(hovered.bracketColor, inkRgb, 'Selected brackets stay neutral ink on hover');
    }
  }
  await clearInput(page);
  pass('GUI/Dev hover turns the label ink and draws the yellow hairline; brackets neither appear on the unselected view nor recolour on the selected one, in both themes');
  pass('Section actions (hero, work, papers, albums, about, note, email, socials) draw the same hairline at desktop/mobile; resting underlines stay muted beneath');
  pass('Measured intermediate hairline scale reverses from current progress under rapid pointer changes and retires at rest; no CSS animation remains');
  await page.locator('#quiet-mode').click();
  await clearInput(page);
  await settled(page.locator('#quiet-mode'));
  assert.deepEqual((await state(page.locator('#quiet-mode'))).opacity, [1, 1]);
  assert.deepEqual((await state(page.locator('#quiet-gui-control'))).opacity, [0, 0]);
  await page.locator('#quiet-gui-control').click();
  await clearInput(page);
  await settled(page.locator('#quiet-gui-control'));
  assert.deepEqual((await state(page.locator('#quiet-gui-control'))).opacity, [1, 1]);
  pass('Selected GUI/Dev brackets transfer with the existing complementary pressed states and persist without hover');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await link.focus();
  await page.keyboard.press('Tab');
  await page.keyboard.press('Shift+Tab');
  assert.equal(await link.evaluate(el => el.matches(':focus-visible')), true);
  assert.equal((await line(link)).scale, 1);
  assert.equal((await line(link)).duration, '0s');
  assert.equal((await state(page.locator('#quiet-gui-control'))).duration, '0s');
  pass('Live reduced motion keeps the focused hairline and selected brackets with immediate response and no transition');
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  if (process.env.BRACKET_CAPTURE === '1') {
    for (const width of [1440, 390]) {
      await page.setViewportSize({ width, height: width === 390 ? 844 : 900 });
      await openMenu(page);
      for (const theme of ['light', 'dark']) {
        if (await page.locator('html').getAttribute('data-theme') !== theme) await page.locator('#quiet-theme').click();
        await clearInput(page);
        const target = page.locator('.section-nav a[href="#research"]');
        await target.hover();
        await settled(target);
        await page.waitForTimeout(160);
        const nav = `nav-hairline-${width}-${theme}.png`;
        await page.screenshot({ path: new URL(nav, output).pathname });
        report.screenshots.push(nav);
        await page.locator('#contact').scrollIntoViewIfNeeded();
        await page.mouse.move(1, 1);
        const contact = `email-${width}-${theme}.png`;
        await page.locator('#contact').screenshot({ path: new URL(contact, output).pathname });
        report.screenshots.push(contact);
      }
    }
  }
  assert.deepEqual(errors, []);
  const touch = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, reducedMotion: 'reduce' });
  try {
    const p = await touch.newPage();
    await p.goto(origin);
    await p.locator('.menu-ready').waitFor();
    await p.emulateMedia({ reducedMotion: 'no-preference' });
    await p.locator('#quiet-menu').tap();
    assert.equal(await p.evaluate(() => matchMedia('(hover: none)').matches), true);
    assert.deepEqual((await state(p.locator('#quiet-gui-control'))).opacity, [1, 1]);
    assert.equal((await state(p.locator('#quiet-gui-control'))).duration, '0s, 0s');
    await p.locator('#quiet-mode').tap();
    await p.locator('#quiet-menu').tap();
    assert.deepEqual((await state(p.locator('#quiet-mode'))).opacity, [1, 1]);
    assert.deepEqual((await state(p.locator('#quiet-gui-control'))).opacity, [0, 0]);
    await p.locator('.section-nav a[href="#work"]').tap();
    await p.waitForFunction(() => location.hash === '#work' && document.activeElement.id === 'work-heading');
    assert.equal(await p.locator('#quiet-navigation').isVisible(), false);
    pass('Touch requires no hover: selection brackets respond instantly, inactive view has no sticky frame, and native section activation closes the menu');
  } finally { await touch.close(); }
} finally {
  await ctx.close();
  await browser.close();
  await writeFile(new URL('bracket-feedback-checks.json', output), JSON.stringify(report, null, 2) + '\n');
}
