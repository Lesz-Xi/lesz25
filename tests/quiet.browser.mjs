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
import { DEV_SHORTCUTS } from '../templates/quiet/dev-labels.js';

const modulePath = process.env.PLAYWRIGHT_MODULE;
const { chromium } = await import(modulePath ? pathToFileURL(modulePath).href : 'playwright');
const root = fileURLToPath(new URL('../', import.meta.url));
const groundworkUrl = 'https://groundwork-six-ruddy.vercel.app/#top';
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
const curiosityCapture = process.env.QUIET_CAPTURE === 'curiosity';
const aboutCapture = process.env.QUIET_CAPTURE === 'about';
const navCapture = process.env.QUIET_CAPTURE === 'nav';
const relicsCapture = ['relics', 'relics-copy'].includes(process.env.QUIET_CAPTURE);
const thesislensCapture = process.env.QUIET_CAPTURE === 'thesislens';
const groundworkCapture = process.env.QUIET_CAPTURE === 'groundwork';
const relicsUrl = 'https://relics.quest/#top';
const built = Boolean(process.env.QUIET_DIST);
const assetRoot = built ? resolve(root, process.env.QUIET_DIST) : root;
const live = Boolean(process.env.QUIET_BASE_URL);
assert.ok(!(built && live), 'Choose built output or a live server, not both.');
const origin = live ? new URL(process.env.QUIET_BASE_URL).origin : 'http://rhine.test';
const browser = await chromium.launch({ headless: true, ...(process.env.BROWSER_PATH ? { executablePath: process.env.BROWSER_PATH } : {}) });
const report = { boundary: built ? 'Chromium on compiled dist assets via local request interception; not hosted deployment verification.' : live ? `Chromium on existing live Vite server ${origin}; not a production build/deployment test.` : 'Chromium source-level browser tests via local request interception; not a Vite build/deployment test.', checks: [], screenshots: [] };
const mime = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.webp': 'image/webp', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.svg': 'image/svg+xml' };

async function revealMobileNavigation(page) {
  // setViewportSize resolves before the matchMedia change handler necessarily paints.
  // Wait for the existing responsive owner before deciding whether Menu is needed.
  await page.waitForFunction(() => {
    const toggle = document.querySelector('#quiet-menu');
    return document.querySelector('.topbar')?.classList.contains('menu-ready') && toggle?.hidden === !matchMedia('(max-width: 700px)').matches;
  });
  if (await page.locator('#quiet-menu').isVisible() && await page.locator('#quiet-menu').getAttribute('aria-expanded') === 'false') await page.locator('#quiet-menu').click();
}

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

async function assertFooterLink(page, selector = '.page-shell > .footer') {
  const footer = page.locator(selector);
  assert.equal(await footer.textContent(), 'Rhine Tague');
  assert.equal(await footer.locator('a').count(), 1);
  const link = footer.getByRole('link', { name: 'Rhine Tague', exact: true });
  assert.equal(await link.count(), 1);
  const reader = await footer.evaluate(node => node.classList.contains('reader-footer'));
  assert.equal(await link.getAttribute('href'), reader ? '/#quiet-hero' : '#quiet-hero');
  assert.equal(await link.getAttribute('target'), null, 'Native same-tab hero return');
  assert.equal(await link.getAttribute('rel'), null);
  const box = await link.boundingBox();
  assert.ok(box.height >= 44 && box.width >= 44, 'Footer link remains a usable pointer/touch target');
}

try {
  if (previewCapture || controlsCapture || profileCapture || heroCapture || curiosityCapture || aboutCapture || relicsCapture || thesislensCapture || groundworkCapture || navCapture) await mkdir(output, { recursive: true });
  const greetingCases = [
    ...[1440, 390].flatMap(width => ['light', 'dark'].map(theme => ({ width, theme, clock: '2026-10-08T20:51:00Z', hour: 4, minute: 51, period: 'morning', reported: true }))),
    { clock: '2026-10-08T15:59:59Z', hour: 23, minute: 59, period: 'evening', crossMidnight: true },
    { clock: '2026-10-08T16:00:00Z', hour: 0, minute: 0, period: 'morning' },
    { clock: '2026-10-09T03:59:59Z', hour: 11, minute: 59, period: 'morning' },
    { clock: '2026-10-09T04:00:00Z', hour: 12, minute: 0, period: 'afternoon' },
    { clock: '2026-10-09T09:59:59Z', hour: 17, minute: 59, period: 'afternoon' },
    { clock: '2026-10-09T10:00:00Z', hour: 18, minute: 0, period: 'evening' },
    { clock: '2026-10-08T20:51:00Z', hour: 22, minute: 51, period: 'evening', timezoneId: 'Europe/Zurich' },
    { clock: '2026-10-08T20:51:00Z', hour: 16, minute: 51, period: 'afternoon', timezoneId: 'America/New_York' },
  ];
  const greetingText = { morning: 'Magandang umaga!', afternoon: 'Magandang hapon!', evening: 'Magandang gabi!' };
  const greetingDescription = { morning: COPY.en.entryMorning, afternoon: COPY.en.entryAfternoon, evening: COPY.en.entryEvening };
  for (const sample of greetingCases) {
    const width = sample.width || 1440;
    const theme = sample.theme || 'light';
    const clockContext = await context({ viewport: { width, height: width === 390 ? 844 : 900 }, colorScheme: theme, locale: 'en-US', timezoneId: sample.timezoneId || 'Asia/Manila' });
    try {
      await clockContext.addInitScript(instant => {
        // Only Date is mocked; native animations, performance and watchdogs stay real.
        const NativeDate = Date;
        const key = 'quiet-test-morning-clock';
        let fixed = NativeDate.parse(sessionStorage.getItem(key) || instant);
        window.Date = new Proxy(NativeDate, {
          construct(target, args) { return Reflect.construct(target, args.length ? args : [fixed]); },
          apply() { return new NativeDate(fixed).toString(); },
          get(target, property) { return property === 'now' ? () => fixed : Reflect.get(target, property); },
        });
        window.__setMorningClock = value => { fixed = NativeDate.parse(value); sessionStorage.setItem(key, value); };
      }, sample.clock);
      const clockPage = await clockContext.newPage();
      const clockErrors = [];
      clockPage.on('pageerror', error => clockErrors.push(error.message));
      await clockPage.goto(`${origin}/`);
      await clockPage.waitForFunction(() => document.querySelector('#entry-intro')?.dataset.state === 'playing');
      assert.deepEqual(await clockPage.evaluate(() => [new Date().getHours(), new Date().getMinutes()]), [sample.hour, sample.minute]);
      assert.equal(await clockPage.locator('#entry-intro').getAttribute('data-greeting'), sample.period);
      assert.equal(await clockPage.locator('.entry-greeting').textContent(), greetingText[sample.period]);
      assert.equal(await clockPage.locator('.entry-description').textContent(), greetingDescription[sample.period]);
      if (sample.reported) {
        await clockPage.waitForFunction(() => document.querySelector('#entry-intro').dataset.phase === 'complete');
        if (process.env.QUIET_CAPTURE === 'greeting-time') {
          await mkdir(output, { recursive: true });
          const name = `greeting-0451-${width}-${theme}.png`;
          // Disabling CSS animations fast-forwards the welcome's fail-open timer.
          // Capture native playback instead, while its completed caption is visible.
          assert.equal(await clockPage.locator('#entry-intro').isVisible(), true);
          await clockPage.screenshot({ path: resolve(output, name), fullPage: false, animations: 'allow' });
          report.screenshots.push(name);
        }
        await clockPage.waitForFunction(() => document.querySelector('#entry-intro').dataset.state === 'done');
        assert.equal(await clockPage.locator('#entry-intro').getAttribute('data-reason'), 'complete');
      } else {
        if (sample.crossMidnight) {
          await clockPage.evaluate(() => window.__setMorningClock('2026-10-08T16:00:00Z'));
          assert.equal(await clockPage.evaluate(() => new Date().getHours()), 0);
          assert.equal(await clockPage.locator('#entry-intro').getAttribute('data-greeting'), 'evening', 'Playing greeting remains a one-shot snapshot');
        }
        await clockPage.emulateMedia({ reducedMotion: 'reduce' });
        await clockPage.waitForFunction(() => document.querySelector('#entry-intro').dataset.state === 'done');
        if (sample.crossMidnight) {
          await clockPage.emulateMedia({ reducedMotion: 'no-preference' });
          await clockPage.reload();
          await clockPage.waitForFunction(() => document.querySelector('#entry-intro').dataset.state === 'playing');
          assert.equal(await clockPage.locator('#entry-intro').getAttribute('data-greeting'), 'morning', 'Reload samples the new local day');
          assert.equal(await clockPage.locator('.entry-greeting').textContent(), 'Magandang umaga!');
          assert.equal(await clockPage.locator('.entry-description').textContent(), COPY.en.entryMorning);
          await clockPage.emulateMedia({ reducedMotion: 'reduce' });
          await clockPage.waitForFunction(() => document.querySelector('#entry-intro').dataset.state === 'done');
        }
      }
      assert.deepEqual(clockErrors, []);
    } finally { await clockContext.close(); }
  }
  check('Reported 04:51 welcome is morning on desktop/mobile in both themes; midnight/noon/18:00 boundaries, device-local time zones, stable playing snapshot and reload resampling work');

  const ctx = await context({ colorScheme: 'light' });
  const page = await ctx.newPage();
  const errors = [];
  const requests = [];
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('request', (request) => requests.push(request.url()));
  await page.goto(`${origin}/`);
  await page.locator('.preferences:not([hidden])').waitFor();
  await waitImage(page, '.cinematic img');
  assert.equal(await page.locator('#intro-heading').textContent(), COPY.en.title);
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
  if (profileCapture || heroCapture || curiosityCapture) {
    for (const width of [1440, 390]) {
      await page.setViewportSize({ width, height: width === 390 ? 844 : 900 });
      for (const theme of ['light', 'dark']) {
        if (await page.locator('html').getAttribute('data-theme') !== theme) await page.locator('#quiet-theme').click();
        await page.evaluate(() => scrollTo(0, 0));
        await page.mouse.move(0, 0);
        await screenshot(page, `${curiosityCapture ? 'hero-curiosity' : heroCapture ? 'hero-link' : 'profile'}-${width}-${theme}.png`, false);
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
  // Native selects can match :focus-visible after a mouse choice. Do not
  // replace the native picker or blur it to hide the enclosing focus frame.
  const languageCue = async (targetPage) => targetPage.locator('#language').evaluate(element => {
    const style = getComputedStyle(element);
    return { focused: element === document.activeElement, visible: element.matches(':focus-visible'), outline: style.outlineStyle, shadow: style.boxShadow, accent: getComputedStyle(document.documentElement).getPropertyValue('--accent').trim(), height: element.getBoundingClientRect().height, tag: element.tagName };
  });
  for (const width of [1440, 390]) {
    await page.setViewportSize({ width, height: 900 });
    for (const view of ['dev', 'gui']) {
      await revealMobileNavigation(page);
      await page.locator(view === 'dev' ? '#quiet-mode' : '#quiet-gui-control').click();
      for (const theme of ['light', 'dark']) {
        if (await page.locator('html').getAttribute('data-theme') !== theme) await page.locator('#quiet-theme').click();
        const before = await page.locator('#language').boundingBox();
        await page.locator('#language').click();
        // Confirm the native choice, not Escape (which intentionally exits Dev).
        await page.keyboard.press('Enter');
        const pointerCue = await languageCue(page);
        assert.equal(pointerCue.focused, true);
        assert.equal(pointerCue.outline, 'none');
        assert.equal(pointerCue.tag, 'SELECT');
        assert.ok(pointerCue.height >= 44);
        assert.deepEqual(await page.locator('#language').boundingBox(), before);
        await page.keyboard.press('Tab');
        await page.keyboard.press('Shift+Tab');
        const keyboardCue = await languageCue(page);
        assert.equal(keyboardCue.visible && keyboardCue.focused, true);
        assert.equal(keyboardCue.outline, 'none');
        assert.equal(keyboardCue.shadow, `${theme === 'dark' ? 'rgb(251, 146, 60)' : 'rgb(185, 71, 8)'} 0px -2px 0px 0px inset`);
        // Exercise native select change dispatch separately from keyboard focus;
        // headless macOS Chromium does not drive the OS picker with ArrowDown.
        await page.selectOption('#language', 'de');
        await page.waitForFunction(() => document.documentElement.lang === 'de');
        assert.equal(await page.evaluate(() => localStorage.getItem('rhine-lang')), 'de');
        assert.equal(await page.locator('#quiet-dev').isVisible(), view === 'dev');
        await page.selectOption('#language', 'en');
        if (process.env.LANGUAGE_FOCUS_CAPTURE === '1' && view === 'dev') {
          await mkdir(output, { recursive: true });
          await page.locator('.topbar').screenshot({ path: resolve(output, `language-focus-${width}-${theme}.png`) });
          report.screenshots.push(`language-focus-${width}-${theme}.png`);
        }
      }
    }
  }
  await page.emulateMedia({ forcedColors: 'active' });
  await page.locator('#language').focus();
  await page.keyboard.press('Tab');
  await page.keyboard.press('Shift+Tab');
  const systemCue = await languageCue(page);
  assert.equal(systemCue.outline, 'solid');
  assert.equal(systemCue.shadow, 'none');
  await page.emulateMedia({ forcedColors: 'none' });
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.selectOption('#language', 'en');
  if (await page.locator('html').getAttribute('data-theme') !== 'light') await page.locator('#quiet-theme').click();
  check('Language picker has no enclosing pointer/keyboard frame in GUI/Dev across desktop/mobile and both themes; native select changes, saved locale, 44px geometry, underline cue and forced-colors focus work');
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
        const expectedHeading = COPY[lang].title;
        const heroHeading = page.locator('#intro-heading');
        assert.equal(await heroHeading.textContent(), expectedHeading);
        assert.deepEqual(await heroHeading.locator('.hero-title-line').allTextContents(), [expectedHeading]);
        assert.equal(await page.getByRole('heading', { level: 1, name: expectedHeading, exact: true }).count(), 1);
        assert.equal(await heroHeading.locator('.hero-title-line').evaluate(node => getComputedStyle(node).display), 'block');
        const heroLink = await page.locator('.hero-work-link').evaluate(element => {
          const style = getComputedStyle(element);
          const rect = element.getBoundingClientRect();
          return { fill: style.backgroundColor, border: style.borderWidth, shadow: style.boxShadow, padding: [style.paddingLeft, style.paddingRight], underline: style.textDecorationLine, height: rect.height, offset: rect.left - element.parentElement.querySelector('h1').getBoundingClientRect().left, href: element.getAttribute('href'), arrow: element.querySelector('svg')?.getAttribute('aria-hidden') };
        });
        assert.deepEqual({ ...heroLink, height: 44 }, { fill: 'rgba(0, 0, 0, 0)', border: '0px', shadow: 'none', padding: ['0px', '0px'], underline: 'underline', height: 44, offset: 0, href: '#work', arrow: 'true' });
        assert.ok(heroLink.height >= 44, `${lang} ${width} ${theme}: hero link target`);
        assert.deepEqual(await page.locator('#quiet-sections > section').evaluateAll(nodes => nodes.map(node => node.id)), ['about', 'work', 'photography', 'research', 'notes', 'contact']);
        assert.deepEqual(await page.locator('.section-nav a').evaluateAll(nodes => nodes.map(node => node.getAttribute('href'))), ['#about', '#work', '#photography', '#research', '#notes', '#contact']);
        await revealMobileNavigation(page);
        // Theme changes retain the existing 150ms color transition; inspect its settled state.
        await page.waitForTimeout(180);
        assert.equal(await page.locator('.section-nav a').evaluateAll((nodes, muted) => nodes.every(node => {
          const style = getComputedStyle(node);
          return style.color === muted && style.textDecorationLine === 'none' && node.getBoundingClientRect().height >= 44;
        }), theme === 'dark' ? 'rgb(170, 166, 160)' : 'rgb(101, 100, 97)'), true, `${lang} ${width} ${theme}: neutral nav and 44px targets`);
        await page.locator('#language').focus();
        const pickerCue = await languageCue(page);
        assert.equal(pickerCue.outline, 'none', `${lang} ${width} ${theme}: no language focus frame`);
        assert.ok(pickerCue.height >= 44);
        assert.equal(pickerCue.shadow, `${theme === 'dark' ? 'rgb(251, 146, 60)' : 'rgb(185, 71, 8)'} 0px -2px 0px 0px inset`);
        const c = COPY[lang];
        assert.equal(await page.locator('.email-link').textContent(), c.email);
        assert.equal(await page.locator('.email-link').getAttribute('href'), 'mailto:rhinelesther@gmail.com');
        assert.deepEqual(await page.locator('.email-link, .note-read-link').evaluateAll(nodes => nodes.map(node => {
          const style = getComputedStyle(node);
          return [style.backgroundColor, style.fontSize, style.textDecorationLine, style.textDecorationThickness, style.textUnderlineOffset, style.paddingLeft, style.paddingRight, style.borderWidth, style.boxShadow, node.getBoundingClientRect().height >= 44];
        })), [['rgba(0, 0, 0, 0)', '13px', 'underline', 'auto', '5px', '0px', '0px', '0px', 'none', true], ['rgba(0, 0, 0, 0)', '13px', 'underline', 'auto', '5px', '0px', '0px', '0px', 'none', true]], `${lang} ${width} ${theme}: email/read parity`);
        assert.deepEqual(await page.locator('#about .about-copy > p').allTextContents(), [c.aboutBody, c.designBody, c.purpose]);
        assert.equal(await page.locator('#about [data-read-approach]').getAttribute('href'), '/templates/quiet/approach.html');
        assert.equal(await page.locator('.work-row').count(), 8);
        assert.deepEqual(await page.locator('.work-row').evaluateAll(rows => rows.map(row => row.dataset.workId)), ['groundwork', 'odysxi', 'twin-sparrow', '2041', 'relics', 'wuweism', 'tsra', 'thesislens']);
        const groundworkRow = page.locator('[data-work-id="groundwork"]');
        assert.equal(await groundworkRow.locator('h3').textContent(), 'Groundwork');
        assert.equal(await groundworkRow.locator('p').textContent(), c.groundworkBody);
        assert.equal(await groundworkRow.locator('.meta').textContent(), c.groundworkKind);
        assert.equal(await groundworkRow.locator('a').getAttribute('href'), groundworkUrl);
        assert.equal(await groundworkRow.locator('a').getAttribute('target'), '_blank');
        assert.equal(await groundworkRow.locator('a').getAttribute('rel'), 'noopener noreferrer');
        const groundworkTarget = await groundworkRow.locator('a').boundingBox();
        assert.ok(groundworkTarget.height >= 44, `${lang} ${width} ${theme}: Groundwork target ${JSON.stringify(groundworkTarget)}; CSS minimum ${await groundworkRow.locator('a').evaluate(node => getComputedStyle(node).minHeight)}`);
        const thesisRow = page.locator('[data-work-id="thesislens"]');
        assert.equal(await thesisRow.locator('h3').textContent(), 'ThesisLens');
        assert.equal(await thesisRow.locator('p').textContent(), c.thesislensBody);
        assert.equal(await thesisRow.locator('.meta').textContent(), c.thesislensKind);
        assert.equal(await thesisRow.locator('a').getAttribute('href'), 'https://thesislens.space/');
        assert.equal(await thesisRow.locator('a').getAttribute('target'), '_blank');
        assert.equal(await thesisRow.locator('a').getAttribute('rel'), 'noopener noreferrer');
        assert.ok((await thesisRow.locator('a').boundingBox()).height >= 44);
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
        await assertFooterLink(page);
        assert.equal(await page.locator('.identity .name').textContent(), 'Rhine Tague');
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
  if (relicsCapture || thesislensCapture || groundworkCapture) {
    for (const width of [1440, 390]) {
      await page.setViewportSize({ width, height: width === 390 ? 844 : 900 });
      for (const theme of ['light', 'dark']) {
        if (await page.locator('html').getAttribute('data-theme') !== theme) await page.locator('#quiet-theme').click();
        const captureName = groundworkCapture ? 'groundwork-work' : thesislensCapture ? 'thesislens-work' : process.env.QUIET_CAPTURE === 'relics-copy' ? 'relics-copy' : 'relics-work';
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
  await relicsPage.waitForURL(relicsUrl, { waitUntil: 'domcontentloaded' });
  assert.equal(await relicsPage.title(), 'Relics destination');
  assert.equal(relicsPage.url(), relicsUrl);
  await relicsPage.close();
  await page.locator('.relics-link').hover();
  await page.waitForTimeout(180);
  assert.equal(await page.locator('.relics-link').evaluate((element) => getComputedStyle(element).textDecorationLine), 'underline');
  assert.equal(await page.locator('.relics-link').evaluate((element) => getComputedStyle(element).color), 'rgb(251, 146, 60)');
  check('Relics appears once in Selected work across six locales/four widths/both themes; 44px target, visible focus and native external activation work');
  const thesisLink = page.locator('[data-work-id="thesislens"] a');
  await ctx.route('https://thesislens.space/**', route => route.fulfill({ contentType: 'text/html', body: '<title>ThesisLens destination fixture</title>' }));
  const thesisPopup = page.waitForEvent('popup');
  await thesisLink.focus();
  await page.keyboard.press('Tab');
  await page.keyboard.press('Shift+Tab');
  assert.equal(await thesisLink.evaluate(e => e.matches(':focus-visible') && getComputedStyle(e).outlineStyle === 'solid'), true);
  await page.keyboard.press('Enter');
  const thesisPage = await thesisPopup;
  await thesisPage.waitForURL('https://thesislens.space/', { waitUntil: 'domcontentloaded' });
  assert.equal(await thesisPage.title(), 'ThesisLens destination fixture');
  assert.equal(thesisPage.url(), 'https://thesislens.space/');
  assert.equal(await thesisPage.evaluate(() => window.opener), null);
  await thesisPage.close();
  check('ThesisLens appears last across six locales/four widths/both themes; native keyboard Visit opens its exact URL safely in a new tab');
  await ctx.route('https://groundwork-six-ruddy.vercel.app/**', route => route.fulfill({ contentType: 'text/html', body: '<title>Groundwork destination fixture</title>' }));
  const groundworkLink = page.locator('[data-work-id="groundwork"] a');
  const originalWorkUrl = page.url();
  for (const activation of ['pointer', 'keyboard']) {
    const popup = page.waitForEvent('popup');
    if (activation === 'keyboard') {
      await groundworkLink.focus();
      await page.keyboard.press('Tab');
      await page.keyboard.press('Shift+Tab');
      assert.equal(await groundworkLink.evaluate(e => e.matches(':focus-visible') && getComputedStyle(e).outlineStyle === 'solid'), true);
      await groundworkLink.press('Enter');
    } else await groundworkLink.click();
    const destination = await popup;
    await destination.waitForURL(groundworkUrl, { waitUntil: 'domcontentloaded' });
    assert.equal(await destination.title(), 'Groundwork destination fixture');
    assert.equal(await destination.evaluate(() => window.opener), null);
    assert.equal(page.url(), originalWorkUrl);
    await destination.close();
  }
  check('Groundwork leads Selected work in six locales/four widths/both themes; pointer and keyboard Visit open the exact URL safely without replacing the portfolio');
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
  assert.equal(await page.locator('#contact .email-link').evaluate((element) => getComputedStyle(element).transitionDuration), '0s');
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
  for (const theme of ['light', 'dark']) {
    if (await page.locator('html').getAttribute('data-theme') !== theme) await page.locator('#quiet-theme').click();
    await page.waitForTimeout(180);
    const email = await page.locator('#contact .email-link').evaluate(element => {
      const style = getComputedStyle(element);
      return { fill: style.backgroundColor, ink: style.color, underline: style.textDecorationLine, border: style.borderWidth, padding: [style.paddingLeft, style.paddingRight], size: style.fontSize, height: element.getBoundingClientRect().height, href: element.getAttribute('href'), arrow: element.querySelector('svg')?.getAttribute('aria-hidden') };
    });
    assert.deepEqual({ ...email, height: 44 }, { fill: 'rgba(0, 0, 0, 0)', ink: theme === 'dark' ? 'rgb(244, 243, 240)' : 'rgb(36, 36, 36)', underline: 'underline', border: '0px', padding: ['0px', '0px'], size: '13px', height: 44, href: 'mailto:rhinelesther@gmail.com', arrow: 'true' });
    assert.ok(email.height >= 44);
  }
  check('Email me matches the cardless underlined reading action in both themes, retaining its native mailto, arrow and 44px target');
  await page.locator('#contact .email-link').hover();
  await page.waitForTimeout(180);
  const hoverColors = await page.locator('#contact .email-link').evaluate(element => ({ fill: getComputedStyle(element).backgroundColor, ink: getComputedStyle(element).color, underline: getComputedStyle(element).textDecorationLine, line: getComputedStyle(element).textDecorationColor }));
  assert.deepEqual(hoverColors, { fill: 'rgba(0, 0, 0, 0)', ink: 'rgb(251, 146, 60)', underline: 'underline', line: 'rgb(251, 146, 60)' });
  check('Email hover accents text and underline without adding a filled button');
  for (const width of [1440, 390]) {
    await page.setViewportSize({ width, height: width === 390 ? 844 : 900 });
    for (const theme of ['light', 'dark']) {
      if (await page.locator('html').getAttribute('data-theme') !== theme) await page.locator('#quiet-theme').click();
      await revealMobileNavigation(page);
      await page.locator('#quiet-mode').hover();
      await page.waitForTimeout(180);
      const accent = await page.locator('#quiet-mode').evaluate(el => getComputedStyle(el).color);
      assert.equal(accent, theme === 'dark' ? 'rgb(251, 146, 60)' : 'rgb(185, 71, 8)');
      for (const id of ['about', 'work', 'photography', 'research', 'notes', 'contact']) {
        await revealMobileNavigation(page);
        const link = page.locator(`.section-nav a[href="#${id}"]`);
        await link.hover();
        await page.waitForTimeout(180);
        assert.deepEqual(await link.evaluate(el => ({ color: getComputedStyle(el).color, underline: getComputedStyle(el).textDecorationLine, fill: getComputedStyle(el).backgroundColor })), { color: accent, underline: 'none', fill: 'rgba(0, 0, 0, 0)' });
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
        assert.deepEqual(await link.evaluate(el => ({ focused: el === document.activeElement && el.matches(':focus-visible'), color: getComputedStyle(el).color, underline: getComputedStyle(el).textDecorationLine, outline: getComputedStyle(el).outlineStyle, outlineColor: getComputedStyle(el).outlineColor })), { focused: true, color: accent, underline: 'none', outline: 'solid', outlineColor: accent });
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
  check('All six nav links match Dev Mode accent on hover and keyboard focus, replace underline with brackets, preserve global focus and native Enter destinations');
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
        await assertFooterLink(page, '.reader-footer');
        assert.equal(await page.locator('.topbar .name').textContent(), 'Rhine Tague');
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
  assert.equal(await page.locator('.dev-records a[href="/templates/quiet/notes.html"]').getAttribute('lang'), 'en');
  assert.equal(await page.locator('#dev-output').evaluate((element) => getComputedStyle(element).scrollbarWidth), 'none');
  await page.locator('#dev-output').evaluate((element) => { element.scrollTop = 0; element.focus(); });
  await page.keyboard.press('PageDown');
  await page.waitForFunction(() => document.querySelector('#dev-output').scrollTop > 0);
  await command('clear');
  await command('ls work');
  assert.equal(await page.locator('.dev-records > li').count(), 8);
  assert.equal(await page.locator('.dev-records a[href="https://relics.quest/#top"]').count(), 1);
  assert.equal(await page.locator('.dev-records a[href=""]').count(), 0);
  assert.ok((await page.locator('.dev-records').textContent()).includes('In development'));
  await page.locator('#dev-input').fill('find draft');
  await page.locator('#dev-input').press('ArrowUp');
  assert.equal(await page.locator('#dev-input').inputValue(), 'ls work');
  await page.locator('#dev-input').press('ArrowDown');
  assert.equal(await page.locator('#dev-input').inputValue(), 'find draft');
  await page.locator('#dev-input').press('Tab');
  assert.deepEqual(await page.locator('#dev-form button').evaluate(element => ({ focused: element === document.activeElement && element.matches(':focus-visible'), width: getComputedStyle(element).outlineWidth, offset: getComputedStyle(element).outlineOffset })), { focused: true, width: '2px', offset: '5px' });
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

  // Keep locale repaint coverage outside the exact original-node restoration scenario.
  await page.locator('#quiet-mode').evaluate((button) => button.click());
  for (const width of [320, 390, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    for (const { code: locale } of LANGUAGES) {
      await page.selectOption('#language', locale);
      for (const theme of ['light', 'dark']) {
        if (await page.locator('html').getAttribute('data-theme') !== theme) await page.locator('#quiet-theme').click();
        for (const { command: payload, label } of DEV_SHORTCUTS) {
          const shortcut = page.locator(`[data-command="${payload}"]`);
          assert.equal(await shortcut.textContent(), label);
          assert.equal(await shortcut.getAttribute('title'), payload);
          await shortcut.hover();
          assert.equal(await shortcut.evaluate(e => getComputedStyle(e).textDecorationLine), 'none');
        }
        await page.locator('[data-command="ls work"]').click();
        assert.equal(await page.locator('.dev-command').last().textContent(), 'rhine / ls work');
        const rows = page.locator('.dev-entry').last().locator('.dev-records > li');
        assert.equal(await rows.count(), 8);
        const paths = await rows.evaluateAll(nodes => nodes.map(row => {
          const path = row.querySelector('.dev-path'), title = row.querySelector('.dev-record-name');
          return { label: path.textContent, href: path.getAttribute('href'), name: title.textContent, linked: path.tagName === 'A', target: path.getAttribute('target'), rel: path.getAttribute('rel'), underline: getComputedStyle(path).textDecorationLine, height: path.getBoundingClientRect().height, kind: path.dataset.portfolioTarget };
        }));
        assert.deepEqual(paths.map(({ label }) => label), ['~/groundwork --open', '~/odysxi --open', '~/twin-sparrow', '~/2041', '~/relics --open', '~/wuweism --open', '~/tsra --open', '~/thesislens --open']);
        for (const path of paths) {
          assert.equal(path.underline, 'none');
          if (path.linked) { assert.ok(path.height >= 44); assert.equal(path.kind, 'source'); assert.equal(path.target, '_blank'); assert.equal(path.rel, 'noopener noreferrer'); }
          else assert.equal(path.href, null);
        }
        assert.equal(paths[4].name, 'Relics');
        assert.equal(paths[4].href, relicsUrl);
        assert.equal(paths[1].name, 'Odysxi');
        assert.equal(paths[1].href, 'https://www.odysxi.com/');
        assert.equal(paths[7].name, 'ThesisLens');
        assert.equal(paths[7].href, 'https://thesislens.space/');
        assert.equal(paths[0].name, 'Groundwork');
        assert.equal(paths[0].href, groundworkUrl);
        assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
        if (process.env.DEV_PATH_CAPTURE === '1' && locale === 'en' && [1440, 390].includes(width)) {
          await mkdir(output, { recursive: true });
          await page.locator('#dev-output').evaluate(e => { e.scrollTop = 0; });
          await page.mouse.move(0, 0);
          const name = `dev-path-${width}-${theme}.png`;
          await page.locator('.dev-surface').screenshot({ path: resolve(output, name) });
          report.screenshots.push(name);
        }
      }
    }
  }
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.selectOption('#language', 'en');
  await command('clear');
  await command('ls work');
  const relicsPath = page.locator('.dev-records a[href="https://relics.quest/#top"]');
  await relicsPath.focus();
  await page.keyboard.press('Tab');
  await page.keyboard.press('Shift+Tab');
  assert.equal(await relicsPath.evaluate(e => e.matches(':focus-visible') && getComputedStyle(e).outlineWidth === '2px' && getComputedStyle(e).textDecorationLine === 'none'), true);
  check('Dev path labels preserve shortcut payloads, record names, truthful unavailable state, source URLs and native keyboard targets across six locales/four widths/both themes without underline or overflow');
  await command('clear');
  await command('find thesislens');
  assert.equal(await page.locator('.dev-records > li').count(), 1);
  assert.equal(await page.locator('.dev-record-name').textContent(), 'ThesisLens');
  await command('open thesislens');
  const thesisResult = page.locator('.dev-entry').last();
  assert.equal(await thesisResult.locator('a').textContent(), '~/thesislens --open');
  assert.equal(await thesisResult.locator('a').getAttribute('href'), 'https://thesislens.space/');
  assert.equal(await page.locator('#quiet-dev').isVisible(), true);
  check('Dev find/open ThesisLens use the shared work record and explicit native source link without automatic external navigation');
  await command('clear');
  await command('find groundwork');
  assert.equal(await page.locator('.dev-records > li').count(), 1);
  assert.equal(await page.locator('.dev-record-name').textContent(), 'Groundwork');
  await command('open groundwork');
  const groundworkResult = page.locator('.dev-entry').last();
  assert.equal(await groundworkResult.locator('a').textContent(), '~/groundwork --open');
  assert.equal(await groundworkResult.locator('a').getAttribute('href'), groundworkUrl);
  assert.equal(await groundworkResult.locator('.dev-record-description').textContent(), COPY.en.groundworkBody);
  assert.equal(await page.locator('#quiet-dev').isVisible(), true);
  check('Dev find/open Groundwork use one shared localized work record and an explicit source link');
  // Restore ThesisLens output for its optional legacy capture.
  if (thesislensCapture) await command('open thesislens');
  if (thesislensCapture) {
    for (const width of [1440, 390]) {
      await page.setViewportSize({ width, height: 900 });
      for (const theme of ['light', 'dark']) {
        if (await page.locator('html').getAttribute('data-theme') !== theme) await page.locator('#quiet-theme').click();
        const name = `thesislens-dev-${width}-${theme}.png`;
        await thesisResult.screenshot({ path: resolve(output, name) });
        report.screenshots.push(name);
      }
    }
    await page.setViewportSize({ width: 1440, height: 900 });
  }
  await command('clear');
  await command('exit');

  const pathTouch = await context({ reducedMotion: 'reduce', hasTouch: true, isMobile: true, viewport: { width: 390, height: 844 } });
  try {
    const touchPage = await pathTouch.newPage();
    for (const [id, href] of [['about', '#about'], ['approach', '/templates/quiet/approach.html'], ['note', '/templates/quiet/notes.html'], ['switzerland', '#album-switzerland']]) {
      await touchPage.goto(`${origin}/`);
      await touchPage.locator('.menu-ready').waitFor();
      await touchPage.locator('#quiet-menu').tap();
      await touchPage.locator('#quiet-mode').tap();
      await touchPage.locator('#dev-input').fill('ls');
      await touchPage.locator('#dev-input').press('Enter');
      const path = touchPage.locator(`a.dev-path[href="${href}"]`);
      assert.equal(await path.textContent(), `~/${id} --open`);
      await path.tap();
      await touchPage.waitForURL(`${origin}${href.startsWith('#') ? '/' : ''}${href}`);
      if (href.startsWith('#')) assert.equal(await touchPage.locator('#quiet-dev').isVisible(), false);
    }
    for (const route of ['/', '/templates/quiet/', '/templates/quiet/notes.html', '/templates/quiet/approach.html']) {
      await touchPage.goto(`${origin}${route}`);
      await touchPage.locator('.preferences:not([hidden])').waitFor();
      await touchPage.locator('#language').tap();
      await touchPage.selectOption('#language', 'ja');
      const cue = await languageCue(touchPage);
      assert.equal(cue.outline, 'none');
      assert.ok(cue.height >= 44);
      assert.equal(await touchPage.locator('html').getAttribute('lang'), 'ja');
    }
  } finally { await pathTouch.close(); }
  check('Emulated touch path links activate native sections, readers and album; shared language picker changes locale without a frame at root, alias and both readers');

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
        await page.locator('#dev-input').focus();
        assert.deepEqual(await page.locator('#dev-input').evaluate(element => {
          const style = getComputedStyle(element);
          const accent = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim();
          const swatch = document.createElement('span');
          swatch.style.color = accent;
          document.body.append(swatch);
          const color = getComputedStyle(swatch).color;
          swatch.remove();
          return { focused: element === document.activeElement && element.matches(':focus-visible'), width: style.outlineWidth, offset: style.outlineOffset, solid: style.outlineStyle === 'solid', accent: style.outlineColor === color && style.caretColor === color, target: element.getBoundingClientRect().height >= 44 };
        }), { focused: true, width: '1px', offset: '2px', solid: true, accent: true, target: true }, `Dev focus ${lang} ${width} ${theme}`);
        assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true, `Dev ${lang} ${width} ${theme} overflow`);
        assert.equal(await page.locator('#photo-count').textContent(), savedGui.count);
        assert.ok(!(await page.locator('#dev-output').textContent()).includes('undefined'));
      }
    }
  }
  check('Dev input keeps a 1px/2px accent focus hairline and 44px target across six locales/four widths/both themes; other controls retain 2px/5px focus, without overflow or album resets');
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
        await page.locator('#dev-input').focus();
        await page.waitForTimeout(180);
        await screenshot(page, `dev-focus-${width}-${theme}.png`, false);
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
        await assertFooterLink(page, '.reader-footer');
        assert.equal(await page.locator('.topbar .name').textContent(), 'Rhine Tague');
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
  assert.equal(await nojsPage.locator('#intro-heading').textContent(), COPY.en.title);
  assert.equal(await nojsPage.locator('.work-row').count(), 8);
  assert.equal(await nojsPage.locator('[data-work-id="groundwork"] > p').textContent(), COPY.en.groundworkBody);
  assert.equal(await nojsPage.locator('[data-work-id="groundwork"] a').getAttribute('href'), groundworkUrl);
  assert.equal(await nojsPage.locator('[data-work-id="thesislens"] > p').textContent(), COPY.en.thesislensBody);
  assert.equal(await nojsPage.locator('[data-work-id="thesislens"] a').getAttribute('href'), 'https://thesislens.space/');
  assert.equal(await nojsPage.locator('[data-work-id="relics"] > p').textContent(), COPY.en.relicsBody);
  assert.equal(await nojsPage.locator('.relics-link').getAttribute('href'), relicsUrl);
  await waitImage(nojsPage, '.identity-portrait');
  assert.deepEqual(await nojsPage.locator('#quiet-sections > section').evaluateAll(nodes => nodes.map(node => node.id)), ['about', 'work', 'photography', 'research', 'notes', 'contact']);
  assert.equal(await nojsPage.locator('.identity-portrait').count(), 1);
  assert.equal(await nojsPage.locator('.location-flag').count(), 0);
  assert.equal(await nojsPage.locator('#entry-intro').isVisible(), false);
  await assertFooterLink(nojsPage);
  assert.equal(await nojsPage.locator('.preferences').isVisible(), false);
  assert.equal(await nojsPage.locator('body').evaluate((element) => getComputedStyle(element).backgroundColor), 'rgb(33, 31, 28)');
  assert.equal(await nojsPage.locator('.cinematic [data-album]').getAttribute('href'), '/#photography');
  await nojsPage.locator('[data-read-note]').click();
  await nojsPage.waitForURL('**/notes.html');
  assert.equal(await nojsPage.locator('.note-body > p').count(), 18);
  assert.equal(await nojsPage.locator('.preferences').isVisible(), false);
  assert.equal(await nojsPage.locator('body').evaluate((element) => getComputedStyle(element).backgroundColor), 'rgb(33, 31, 28)');
  await assertFooterLink(nojsPage, '.reader-footer');
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
  await assertFooterLink(nojsPage, '.reader-footer');
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
  assert.equal(await aliasPage.locator('#intro-heading').textContent(), COPY.en.title);
  await assertFooterLink(aliasPage);
  await aliasPage.locator('.identity .name').click();
  await aliasPage.waitForURL(`${origin}/`);
  await aliasPage.locator('.preferences:not([hidden])').waitFor();
  assert.equal(await aliasPage.locator('canvas').count(), 0);
  check('Existing Quiet template URL remains usable; identity returns to the canonical root homepage');
  await alias.close();

  // Real same-tab hero navigation, including the static no-JavaScript fallback.
  for (const width of [1440, 390]) {
    for (const javaScriptEnabled of [true, false]) {
      const mobile = width === 390;
      const theme = mobile ? 'dark' : 'light';
      const footerContext = await context({ javaScriptEnabled, colorScheme: theme, reducedMotion: 'reduce', viewport: { width, height: mobile ? 844 : 900 }, isMobile: mobile, hasTouch: mobile });
      try {
        const footerPage = await footerContext.newPage();
        for (const route of ['/', '/templates/quiet/', '/templates/quiet/notes.html', '/templates/quiet/approach.html']) {
          const reader = route.endsWith('.html');
          const destination = `${origin}${reader ? '/' : route}#quiet-hero`;
          for (const activation of ['pointer', 'keyboard']) {
            await footerPage.goto(`${origin}${route}${reader ? '' : '#contact'}`);
            if (javaScriptEnabled) await footerPage.locator('.preferences:not([hidden])').waitFor();
            await assertFooterLink(footerPage);
            const link = footerPage.locator('.page-shell > .footer').getByRole('link', { name: 'Rhine Tague', exact: true });
            if ((groundworkCapture || process.env.QUIET_CAPTURE === 'footer') && javaScriptEnabled && route === '/' && activation === 'pointer') {
              await mkdir(output, { recursive: true });
              await link.scrollIntoViewIfNeeded();
              await screenshot(footerPage, `rhine-footer-${width}-${theme}.png`, false);
            }
            if (activation === 'keyboard') {
              await footerPage.keyboard.press('Tab');
              await link.focus();
              assert.equal(await link.evaluate(node => node === document.activeElement && getComputedStyle(node).outlineStyle === 'solid'), true, 'Visible native keyboard focus');
              await link.press('Enter');
            } else if (mobile) await link.tap();
            else await link.click();
            await footerPage.waitForURL(destination);
            await footerPage.waitForFunction(() => Math.abs(document.querySelector('#quiet-hero')?.getBoundingClientRect().top) <= 1);
            assert.equal(await footerPage.locator('#quiet-hero').isVisible(), true);
            assert.equal(footerContext.pages().length, 1, 'Hero return never opens another tab');
            if (javaScriptEnabled && !reader) assert.equal(await footerPage.locator('#intro-heading').evaluate(node => node === document.activeElement), true);
            await assertFooterLink(footerPage);
          }
          if (javaScriptEnabled && !reader) {
            // The hash is already the hero. Repeat clicks and Dev entry must still work.
            for (const fromDev of [false, true, true]) {
              if (fromDev) {
                await revealMobileNavigation(footerPage);
                await footerPage.locator('#quiet-mode').click();
                assert.equal(await footerPage.locator('#quiet-dev').isVisible(), true);
              }
              await footerPage.locator('[data-hero-return]').click();
              assert.equal(footerPage.url(), destination);
              assert.equal(await footerPage.locator('#quiet-gui').isVisible(), true);
              assert.equal(await footerPage.locator('#quiet-dev').isVisible(), false);
              assert.equal(await footerPage.locator('#intro-heading').evaluate(node => node === document.activeElement), true);
              assert.ok(Math.abs(await footerPage.locator('#quiet-hero').evaluate(node => node.getBoundingClientRect().top)) <= 1);
              assert.equal(footerContext.pages().length, 1);
            }
          }
        }
      } finally { await footerContext.close(); }
    }
  }
  check('Rhine Tague footer returns to the hero in the same tab across click/touch/Enter and all four Quiet entries, with/without JavaScript; repeated same-fragment and Dev returns preserve visible hero focus');

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
  await writeFile(resolve(output, ['curiosity', 'curiosity-check'].includes(process.env.QUIET_CAPTURE) ? 'hero-curiosity-browser-checks.json' : 'browser-checks.json'), JSON.stringify(report, null, 2));
}
