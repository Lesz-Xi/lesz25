import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import { runInNewContext } from 'node:vm';
import { COPY, copyFor } from '../templates/quiet/copy.js';
import { DEV_SHORTCUTS, devPathLabel } from '../templates/quiet/dev-labels.js';
import { albumFromHash, galleryImages, wrapIndex } from '../templates/quiet/gallery.js';

const root = fileURLToPath(new URL('../', import.meta.url));
const storage = new Map();
Object.defineProperty(globalThis, 'navigator', { value: { languages: ['en'], language: 'en' }, configurable: true });
globalThis.localStorage = { getItem: (key) => storage.get(key) || null, setItem: (key, value) => storage.set(key, value) };
globalThis.document = { documentElement: {}, querySelector: () => null, querySelectorAll: () => [] };
const { projects, research, albums, socials, renderArchive, renderPurpose, renderContact } = await import('../src/data.js');
const { catalogFor, runCommand } = await import('../templates/quiet/commands.js');
const { workFor } = await import('../templates/quiet/work.js');
const { renderPreferences, renderDevMode, renderNavigation } = await import('../templates/quiet/controls.js');
const { LANGUAGES, setLang, t } = await import('../src/i18n.js');
const { renderHero, renderSections, renderNote, renderLightbox, renderApproach, renderEntryIntro, escapeHtml, ARROW } = await import('../templates/quiet/render.js');
const { default: config } = await import('../vite.config.js');

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');

test('all six locales have complete new copy and all current project descriptions', () => {
  const keys = Object.keys(COPY.en).sort();
  assert.deepEqual(Object.keys(COPY).sort(), LANGUAGES.map(({ code }) => code).sort());
  for (const [locale, copy] of Object.entries(COPY)) {
    assert.deepEqual(Object.keys(copy).sort(), keys, locale);
    assert.equal(copy.projects.length, projects.length);
    assert.equal(copy.papers.length, research.filter(({ url }) => url).length);
    for (const value of Object.values(copy)) {
      assert.ok(typeof value === 'string' ? value.length > 0 : value.every((entry) => entry.length > 0));
    }
  }
  assert.equal(copyFor('unknown'), COPY.en);
});

test('hero keeps only the approved localized making statement inside one heading', () => {
  const expected = {
    en: 'I learn through making.',
    de: 'Ich lerne durch Gestalten.',
    fr: 'J’apprends en créant.',
    it: 'Imparo creando.',
    zh: '我在创造中学习。',
    ja: '作ることで学ぶ。',
  };
  for (const { code } of LANGUAGES) {
    setLang(code);
    const title = expected[code];
    assert.equal(COPY[code].title, title);
    assert.equal(Object.hasOwn(COPY[code], 'curiosity'), false);
    assert.equal(Object.hasOwn(COPY[code], 'concurrence'), false);
    const hero = renderHero(code);
    assert.equal((hero.match(/<h1\b/g) || []).length, 1);
    assert.equal((hero.match(/class="hero-title-line"/g) || []).length, 1);
    assert.ok(hero.includes(`<h1 id="intro-heading"><span class="hero-title-line">${escapeHtml(title)}</span></h1>`));
    assert.ok(hero.includes(`<p>${escapeHtml(COPY[code].intro)}</p>`));
  }
  assert.ok(read('templates/quiet/styles.css').includes('.hero-title-line { display: block; }'));
  for (const path of ['index.html', 'templates/quiet/index.html']) {
    const html = read(path);
    assert.ok(html.includes('<h1 id="intro-heading"><span class="hero-title-line">I learn through making.</span></h1>'), path);
    assert.ok(!html.includes('I let curiosity lead.'), path);
    assert.ok(!html.includes('I live to concur.'), path);
    assert.ok(html.includes('property="og:title" content="Rhine Tague — I learn through making."'), path);
  }
  setLang('en');
});

test('Japanese covers the full shared table and all preference pickers without English fallback', () => {
  const source = read('src/i18n.js');
  // Inspect the leaf translation literal without exporting a test-only production API.
  const literal = source.split('const STRINGS = ')[1].split('\n\nconst SUPPORTED')[0];
  const tables = runInNewContext(`const table = ${literal}\n table;`, {}, { timeout: 1000 });
  assert.deepEqual(Object.keys(tables.ja).sort(), Object.keys(tables.en).sort());
  assert.deepEqual(LANGUAGES.find(({ code }) => code === 'ja'), { code: 'ja', label: '日本語', short: 'JA' });
  setLang('ja');
  for (const [key, value] of Object.entries(tables.ja)) {
    assert.equal(typeof value, 'string', key);
    assert.ok(value.length > 0, key);
    assert.equal(t(key), value, key);
    if (key !== 'hero') assert.notEqual(value, tables.en[key], key);
  }
  assert.equal(storage.get('rhine-lang'), 'ja');
  for (const code of LANGUAGES.map(({ code }) => code)) {
    const markup = renderPreferences(code);
    assert.ok(markup.includes('<option value="ja" lang="ja">日本語</option>'));
    assert.equal((markup.match(/<option /g) || []).length, LANGUAGES.length);
  }
  setLang('en');
});

test('Japanese browser language is detected, but an explicit saved choice wins', () => {
  const moduleUrl = new URL('../src/i18n.js', import.meta.url).href;
  for (const saved of [null, 'de']) {
    const result = execFileSync(process.execPath, ['--input-type=module', '-e', `
      Object.defineProperty(globalThis, 'navigator', { value: { languages: ['ja-JP', 'en-US'] }, configurable: true });
      globalThis.localStorage = { getItem: () => ${JSON.stringify(saved)} };
      const { getLang } = await import(${JSON.stringify(moduleUrl)});
      console.log(getLang());
    `], { encoding: 'utf8' }).trim();
    assert.equal(result, saved || 'ja');
  }
});

test('2041 uses companion-assisted wording in every Quiet locale and command catalog', () => {
  const expected = {
    en: 'A terminal workspace for companion-assisted software work.',
    de: 'Ein Terminal-Arbeitsbereich für Softwareentwicklung mit Begleitagenten.',
    fr: 'Un espace de travail en terminal pour le développement assisté par des agents compagnons.',
    it: 'Uno spazio di lavoro nel terminale per lo sviluppo assistito da agenti compagni.',
    zh: '由陪伴智能体辅助软件开发的终端工作空间。',
    ja: 'コンパニオンとソフトウェア開発を行うためのターミナル型ワークスペース。',
  };
  for (const { code } of LANGUAGES) {
    setLang(code);
    assert.equal(COPY[code].projects[2], expected[code]);
    assert.ok(renderSections(code).includes(escapeHtml(expected[code])));
    const record = catalogFor(code).find(item => item.name === '2041');
    assert.equal(record?.description, expected[code], 'Dev Mode reads the same description');
  }
  setLang('en');
});

test('localized renderers keep every source URL and in-development status', () => {
  for (const { code } of LANGUAGES) {
    setLang(code);
    const content = renderHero(code) + renderSections(code);
    assert.ok(content.includes(escapeHtml(COPY[code].title)));
    assert.ok(!content.includes('undefined'));
    assert.ok(!content.includes('href=""'));
    for (const record of [...projects, ...research].filter(({ url }) => url)) assert.ok(content.includes(record.url));
    assert.equal((content.match(/class="status"/g) || []).length, 2);
    for (const id of ['work', 'research', 'photography', 'about', 'notes', 'contact']) assert.ok(content.includes(`id="${id}"`));
    for (const album of albums) assert.ok(content.includes(`data-album="${album.id}"`));
    assert.ok(content.includes('href="https://substack.com/@les1587833"'));
    assert.ok(renderContact().includes('href="https://substack.com/@les1587833"'));
    assert.ok(content.includes('href="https://x.com/leszxix"'));
    assert.ok(renderContact().includes('href="https://x.com/leszxix"'));
    assert.ok(renderContact().includes('@leszxix'));
    assert.ok(!content.includes('https://x.com/codefar1'));
    assert.ok(!renderContact().includes('@codefar1'));
  }
  assert.equal(socials.find(({ key }) => key === 'X')?.url, 'https://x.com/leszxix');
  setLang('en');
});

test('About-first order agrees across renderers, static pages, navigation and command catalog', () => {
  const order = ['about', 'work', 'photography', 'research', 'notes', 'contact'];
  const sectionIds = (html) => [...html.matchAll(/<section\b[^>]*\bid="([^"]+)"/g)].map(([, id]) => id);
  for (const { code } of LANGUAGES) {
    assert.deepEqual(sectionIds(renderSections(code)), order, code);
    assert.deepEqual(catalogFor(code).filter(({ kind }) => kind === 'section').map(({ id }) => id), order, code);
  }
  for (const path of ['index.html', 'templates/quiet/index.html']) {
    const html = read(path);
    // Dev Mode is a separate section outside the GUI content sequence.
    const content = html.match(/<!-- quiet:sections:start -->([\s\S]*?)<!-- quiet:sections:end -->/)?.[1];
    assert.ok(content, path);
    assert.deepEqual(sectionIds(content), order, path);
    const nav = html.match(/<nav class="section-nav"[^>]*>([\s\S]*?)<\/nav>/)?.[1];
    assert.ok(nav, path);
    assert.deepEqual([...nav.matchAll(/href="#([^"]+)"/g)].map(([, id]) => id), order, path);
    assert.ok(html.includes('class="text-link hero-work-link" href="#work"'), path);
  }
});

test('About carries the LinkedIn voice and design foundation as three localized paragraphs', () => {
  assert.ok(COPY.en.designBody.startsWith('Design is the foundation of my work.'));
  assert.ok(COPY.en.designBody.includes('imagination'));
  assert.ok(COPY.en.purpose.startsWith('I’m building toward'));
  assert.ok(COPY.en.purpose.includes('human judgment'));
  for (const { code } of LANGUAGES) {
    const c = COPY[code];
    const about = renderSections(code).match(/<div class="about-copy">([\s\S]*?)<\/div>/)?.[1];
    assert.ok(about, code);
    assert.deepEqual([...about.matchAll(/<p>([\s\S]*?)<\/p>/g)].map(([, text]) => text), [c.aboutBody, c.designBody, c.purpose].map(escapeHtml), code);
    assert.ok(about.includes('href="/templates/quiet/approach.html"'), code);
  }
  for (const path of ['index.html', 'templates/quiet/index.html']) {
    const html = read(path);
    for (const value of [COPY.en.aboutBody, COPY.en.designBody, COPY.en.purpose]) assert.ok(html.includes(escapeHtml(value)), path);
  }
});

test('hero work and email actions are cardless native links in every locale', () => {
  for (const { code } of LANGUAGES) {
    const hero = renderHero(code);
    assert.ok(hero.includes(`<a class="text-link hero-work-link" href="#work">${escapeHtml(COPY[code].viewWork)}${ARROW}</a>`), code);
    assert.ok(!hero.includes('class="button"'), code);
    assert.ok(renderSections(code).includes(`<a class="text-link email-link" href="${escapeHtml(socials[0].url)}">${escapeHtml(COPY[code].email)}${ARROW}</a>`), code);
  }
  const css = read('templates/quiet/styles.css');
  assert.ok(!css.includes('.intro .button'));
  assert.ok(css.includes('.intro .hero-work-link { margin-top: 8px; font-size: 12px; text-decoration: underline;'));
});

test('Quiet portrait precedes the name in every locale and has local provenance', () => {
  for (const { code } of LANGUAGES) {
    const hero = renderHero(code);
    assert.equal((hero.match(/class="identity-portrait"/g) || []).length, 1);
    assert.ok(hero.includes('src="/quiet/xi-profile.webp" width="160" height="160" alt="" decoding="async"'));
    assert.ok(hero.indexOf('class="identity-portrait"') < hero.indexOf('class="name"'));
  }
  assert.ok(existsSync(`${root}public/quiet/xi-profile.webp`));
  const provenance = JSON.parse(read('public/quiet/xi-profile.webp.json'));
  assert.equal(provenance.source, 'xi_profile.png');
  assert.equal(provenance.width, 160);
  assert.equal(provenance.height, 160);
  assert.ok(provenance.prompt.includes('Not AI-generated'));
  assert.ok(read('index.html').includes('identity-portrait'));
  assert.ok(!read('templates/ocean/index.html').includes('identity-portrait'));
});

test('Paper pole flag is reserved for the hidden welcome sequence, never the country label', () => {
  for (const { code } of LANGUAGES) {
    setLang(code);
    const hero = renderHero(code);
    assert.ok(hero.includes(`<span>${escapeHtml(t('contact.locationVal'))}</span>`));
    assert.ok(!hero.includes('location-flag'));
    assert.ok(!renderSections(code).includes('location-flag'));
    const entry = renderEntryIntro(code);
    assert.ok(entry.includes('hidden data-state="idle"'));
    assert.ok(entry.includes('lang="fil">Magandang araw!</p>'));
    assert.ok(entry.includes(escapeHtml(COPY[code].entryDescription)));
    assert.ok(!entry.includes('entry-skip') && !entry.includes('<button'));
    assert.ok(!Object.hasOwn(COPY[code], 'entrySkip'));
    assert.ok(entry.includes('class="entry-artwork" aria-hidden="true"'));
  }
  setLang('en');
  const original = read('templates/quiet/assets/philippines-flag-source.svg');
  const served = read('public/quiet/philippines-flag.svg');
  const provenance = JSON.parse(read('public/quiet/philippines-flag.svg.json'));
  const expected = original.replace('width="1024" height="876" viewBox="0 0 1024 876"', `width="${provenance.width}" height="${provenance.height}" viewBox="${provenance.viewBox}"`);
  assert.equal(served, expected, 'Only the empty viewport changes; all artwork and supplied colors stay intact');
  assert.ok(served.includes('<g id="_c1u96v6">'), 'The complete pole group remains');
  assert.ok(served.includes('stroke="#5C5D5B" stroke-width="1.6"'));
  assert.deepEqual([...served.matchAll(/stop-color="(#[a-f0-9]+)"/gi)].map(match => match[1]), ['#626361', '#696a68', '#60615f', '#0052bf', '#0050bb', '#e50920', '#e6091e', '#ffc92a', '#ffc218']);
  assert.equal(provenance.sourceSha256, createHash('sha256').update(original).digest('hex'));
  assert.equal(provenance.servedSha256, createHash('sha256').update(served).digest('hex'));
  assert.ok(provenance.sourceUrl.endsWith('/p-1-0/7M-0'));
  assert.ok(!served.includes('<script'));
  for (const path of ['templates/ocean/index.html', 'templates/quiet/notes.html', 'templates/quiet/approach.html']) assert.ok(!read(path).includes('entry-intro'));
  assert.ok(!read('templates/quiet/styles.css').includes('.location-flag'));
});

test('Quiet footer is author-only, with no old-portfolio link or unused localized copy', () => {
  const page = read('templates/quiet/index.html');
  assert.ok(page.includes('<footer class="footer"><span>Rhine Tague</span></footer>'));
  assert.ok(!page.includes('data-copy="original"'));
  assert.ok(!page.includes('Original portfolio'));
  for (const { code } of LANGUAGES) assert.ok(!Object.hasOwn(COPY[code], 'original'), code);
});

test('readers have one article-end return and an author-only page footer', () => {
  for (const name of ['notes', 'approach']) {
    const page = read(`templates/quiet/${name}.html`);
    assert.equal((page.match(/>Back to portfolio<\/a>/g) || []).length, 1, name);
    assert.ok(page.includes('<footer class="footer reader-footer"><span>Rhine Tague</span></footer>'), name);
    assert.equal((page.match(/class="reading-end"/g) || []).length, 1, name);
  }
});

test('all portfolio entries use the supplied SVG icon and matching PNG fallback', () => {
  for (const path of ['index.html', 'templates/ocean/index.html', 'templates/quiet/index.html', 'templates/quiet/notes.html', 'templates/quiet/approach.html']) {
    const html = read(path);
    const icons = [...html.matchAll(/<link\b[^>]*\brel="icon"[^>]*>/g)].map(([tag]) => tag);
    assert.equal(icons.length, 2, path);
    assert.ok(icons.some((tag) => tag.includes('type="image/svg+xml"') && tag.includes('sizes="any"') && tag.includes('href="/web_profile_code.svg?v=3"')), path);
    assert.ok(icons.some((tag) => tag.includes('type="image/png"') && tag.includes('sizes="32x32"') && tag.includes('href="/web_profile_code.png?v=2"')), path);
    assert.ok(!icons.some((tag) => tag.includes('cartoon-power-up-star')), path);
  }
  const svg = read('public/web_profile_code.svg');
  assert.ok(svg.includes('viewBox="126 128 752 752"'));
  assert.ok(svg.includes('@media (prefers-color-scheme: dark) { #_kuqd084 circle { fill: #ffffff; stroke: #ffffff; } }'));
  assert.ok(svg.includes('stop-color="#24303e"') && svg.includes('stop-color="#ff801a"'), 'Light arrow and orange dots keep their original gradients');
  const png = readFileSync(new URL('../public/web_profile_code.png', import.meta.url));
  assert.equal(png.subarray(0, 8).toString('hex'), '89504e470d0a1a0a');
  assert.equal(png.readUInt32BE(16), 32);
  assert.equal(png.readUInt32BE(20), 32);
});

test('HTML escaping protects names, text, and attribute values', () => {
  assert.equal(escapeHtml('<a title="&\'">'), '&lt;a title=&quot;&amp;&#39;&quot;&gt;');
});

test('album hashes resolve only known albums and navigation wraps', () => {
  assert.equal(albumFromHash('#album-switzerland', albums)?.id, 'switzerland');
  assert.equal(albumFromHash('#album-unknown', albums), null);
  assert.equal(albumFromHash('#work', albums), null);
  assert.equal(albumFromHash('#album-%3Cscript%3E', albums), null);
  assert.equal(wrapIndex(-1, 13), 12);
  assert.equal(wrapIndex(13, 13), 0);
  assert.equal(wrapIndex(4, 0), 0);
  for (const album of albums) {
    const images = galleryImages(album);
    assert.equal(images[0], album.cover);
    assert.deepEqual(images.slice(1), album.images);
    for (const image of images) assert.ok(existsSync(`${root}public${image}`), `Missing ${image}`);
  }
});

test('Vite declares the Quiet homepage, template alias, readers and preserved ocean', () => {
  assert.equal(config.build.rollupOptions.input.home, `${root}index.html`);
  assert.equal(config.build.rollupOptions.input.ocean, `${root}templates/ocean/index.html`);
  assert.equal(config.build.rollupOptions.input.quiet, `${root}templates/quiet/index.html`);
  assert.equal(config.build.rollupOptions.input.quietNotes, `${root}templates/quiet/notes.html`);
  assert.equal(config.build.rollupOptions.input.quietApproach, `${root}templates/quiet/approach.html`);
  for (const file of Object.values(config.build.rollupOptions.input)) assert.ok(existsSync(file));
  assert.ok(read('templates/ocean/index.html').includes('src="/src/main.js"'));
  assert.ok(read('templates/ocean/index.html').includes('<canvas id="canvas">'));
  assert.ok(read('index.html').includes('src="/templates/quiet/main.js"'));
  assert.ok(!read('index.html').includes('<canvas'));
});

test('root homepage mirrors Quiet with valid asset paths and canonical reader returns', () => {
  const template = read('templates/quiet/index.html');
  assert.equal(read('index.html'), template.replace('href="./styles.css"', 'href="/templates/quiet/styles.css"')
    .replace('src="./main.js"', 'src="/templates/quiet/main.js"'));
  for (const { code } of LANGUAGES) {
    assert.ok(renderHero(code).includes('class="name" href="/"'));
    assert.ok(renderNote(code).includes('href="/#notes"'));
    assert.ok(renderApproach(code).includes('href="/#about"'));
  }
  for (const name of ['notes', 'approach']) {
    assert.ok(read(`templates/quiet/${name}.html`).includes('class="name" href="/"'));
    assert.ok(!read(`templates/quiet/${name}.html`).includes('href="/templates/quiet/#'));
  }
});

test('Quiet import graph cannot load the ocean, overlays, or old CSS', () => {
  const seen = new Set();
  function visit(file) {
    if (seen.has(file)) return;
    seen.add(file);
    assert.doesNotMatch(file, /\/(ocean|overlays|nav-popover)\.js$|\/src\/styles\.css$/);
    const source = readFileSync(file, 'utf8');
    for (const [, specifier] of source.matchAll(/(?:from\s*|import\s*)['"]([^'"]+)['"]/g)) {
      assert.ok(specifier.startsWith('.'), `Unexpected runtime dependency ${specifier}`);
      visit(fileURLToPath(new URL(specifier, `file://${file}`)));
    }
  }
  visit(`${root}templates/quiet/main.js`);
  visit(`${root}templates/quiet/notes.js`);
  visit(`${root}templates/quiet/approach.js`);
  assert.ok(seen.has(`${root}src/data.js`));
  assert.ok(seen.has(`${root}src/i18n.js`));
  assert.ok(!read('templates/quiet/main.js').includes('rhine-theme-mode'));
});

test('English fallback is complete, accessible without scripts, and synchronized', () => {
  execFileSync(process.execPath, ['scripts/sync-quiet.mjs', '--check'], { cwd: root });
  const html = read('templates/quiet/index.html');
  assert.equal((html.match(/<h1\b/g) || []).length, 2);
  assert.ok(html.includes('id="quiet-dev" class="dev-surface" aria-labelledby="dev-title" hidden'));
  for (const id of ['work', 'research', 'photography', 'about', 'notes', 'contact']) assert.ok(html.includes(`id="${id}"`));
  assert.ok(html.includes('class="preferences" hidden'));
  assert.ok(html.includes('href="/#photography"'));
  assert.ok(html.includes('href="/templates/quiet/notes.html"'));
  assert.ok(html.includes('href="/templates/quiet/approach.html"'));
  assert.ok(!html.includes('href="/#purpose"'));
  for (const [, source] of html.matchAll(/\bsrc="(\/(?:quiet|img)\/[^"\s]+)"/g)) assert.ok(existsSync(`${root}public${source}`));
});

test('all six albums have image previews and local provenance; Notes has its own entry', () => {
  setLang('en');
  const content = renderSections('en');
  assert.equal((content.match(/class="album-card"/g) || []).length, 6);
  assert.ok(!content.includes('album-links'));
  for (const album of albums) {
    const source = `/quiet/${album.id}-thumb.webp`;
    assert.ok(content.includes(`src="${source}"`));
    assert.ok(existsSync(`${root}public${source}`));
    const provenance = JSON.parse(read(`public${source}.json`));
    assert.ok(provenance.prompt.includes(`public/img/${album.id}.webp`));
  }
  assert.ok(content.includes('id="notes"'));
  assert.ok(!content.includes('href="/#archive"'));
  assert.ok(renderHero('en').includes('cinematic-frame'));
  assert.ok(!read('templates/quiet/styles.css').includes('cinematic-mat'));
});

test('Notes reframes every authored paragraph and source link without changing the essay', () => {
  const source = renderArchive();
  const original = [...source.matchAll(/<p class="letter-body[^"]*">([\s\S]*?)<\/p>/g)].map(([, html]) => html);
  assert.equal(original.length, 18);
  for (const { code } of LANGUAGES) {
    const note = renderNote(code);
    const actual = [...note.matchAll(/<p(?: class="[^"]*")?>([\s\S]*?)<\/p>/g)].map(([, html]) => html);
    assert.deepEqual(actual, original);
    assert.ok(note.includes('<article class="reading-article" lang="en"'));
    assert.ok(note.includes('What My Hands Knew First'));
    assert.ok(note.includes('Field Note — Jul 2026'));
    assert.ok(note.includes(escapeHtml(COPY[code].backPortfolio)));
    assert.ok(!note.includes('undefined'));
  }
  const page = read('templates/quiet/notes.html');
  assert.equal((page.match(/<h1\b/g) || []).length, 1);
  assert.ok(page.includes('class="preferences" hidden'));
  assert.ok(page.includes('href="/#notes"'));
});

test('the photo preview is a labelled native dialog and Read the note stays cardless', () => {
  for (const { code } of LANGUAGES) {
    setLang(code);
    const dialog = renderLightbox(code);
    const sections = renderSections(code);
    assert.ok(dialog.includes('<dialog id="photo-preview"'));
    assert.ok(dialog.includes('aria-labelledby="preview-title"'));
    assert.ok(dialog.includes('id="preview-close"'));
    assert.ok(dialog.includes('id="preview-dismiss"'));
    assert.ok(dialog.includes(`data-preview-prev aria-label="${t('ui.prev')}"`));
    assert.ok(dialog.includes(`data-preview-next aria-label="${t('ui.next')}"`));
    assert.ok(dialog.includes('class="preview-navigation"'));
    assert.ok(dialog.includes('id="preview-count" role="status" aria-live="polite"'));
    assert.ok(!dialog.includes('<dialog open'));
    assert.ok(sections.includes('data-photo-preview aria-haspopup="dialog"'));
    assert.ok(sections.includes('class="text-link note-read-link"'));
    assert.ok(sections.includes('data-read-note'));
    assert.ok(!sections.includes('class="button" href="/templates/quiet/notes.html"'));
  }
  setLang('en');
});

function luminance(hex) {
  const channels = [1, 3, 5].map((offset) => parseInt(hex.slice(offset, offset + 2), 16) / 255)
    .map((value) => value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4);
  return channels.reduce((sum, value, index) => sum + value * [0.2126, 0.7152, 0.0722][index], 0);
}
function contrast(a, b) {
  const [low, high] = [luminance(a), luminance(b)].sort((x, y) => x - y);
  return (high + 0.05) / (low + 0.05);
}

test('cardless view buttons and single theme icon have native pressed-state semantics', () => {
  for (const { code } of LANGUAGES) {
    const controls = renderPreferences(code, true);
    assert.equal((controls.match(/aria-pressed="/g) || []).length, 3);
    assert.ok(!controls.includes('role="switch"'));
    assert.ok(!controls.includes('switch-track'));
    assert.ok(!controls.includes('switch-thumb'));
    assert.ok(controls.includes('id="quiet-gui-control" aria-pressed="true"'));
    assert.ok(controls.includes('role="group" aria-label="' + escapeHtml(COPY[code].viewLabel) + '"'));
    assert.ok(controls.includes('aria-label="' + escapeHtml(COPY[code].devLabel) + '"'));
    assert.ok(controls.includes('aria-controls="quiet-dev"'));
    assert.ok(controls.includes('theme-icon-light'));
    assert.ok(controls.includes('theme-icon-dark'));
    assert.ok(!renderPreferences(code).includes('id="quiet-mode"'));
    const mode = renderDevMode(code);
    assert.ok(mode.includes('role="log"'));
    assert.ok(mode.includes('maxlength="256"'));
    assert.ok(!mode.includes('undefined'));
  }
});

test('approach preserves all three original paragraphs and six localized principles', () => {
  for (const { code } of LANGUAGES) {
    setLang(code);
    const original = [...renderPurpose().matchAll(/<p class="letter-body">([\s\S]*?)<\/p>/g)].map(([, text]) => text);
    const actual = [...renderApproach(code).matchAll(/<p>([\s\S]*?)<\/p>/g)].map(([, text]) => text);
    assert.deepEqual(actual, original);
    assert.equal(actual.length, 3);
    assert.equal((renderApproach(code).match(/<li>/g) || []).length, 6);
    assert.ok(renderApproach(code).includes('href="/#about"'));
  }
  setLang('en');
});

test('Relics belongs once in Selected work and Dev Mode, never in Approach or ocean', () => {
  const href = 'https://relics.quest/#top';
  const ids = ['wuweism', 'twin-sparrow', '2041', 'relics', 'odysxi', 'tsra', 'thesislens'];
  for (const { code } of LANGUAGES) {
    setLang(code);
    const records = workFor(code);
    assert.deepEqual(records.map(({ id }) => id), ids);
    const relics = records.find(({ id }) => id === 'relics');
    assert.equal(relics.description, COPY[code].relicsBody);
    assert.equal(relics.principle, 'Ex-formation');
    assert.ok(!('relicsKind' in COPY[code]));
    assert.ok(!('relicsLink' in COPY[code]));
    assert.equal(relics.url, href);
    const markup = renderSections(code);
    const row = markup.match(/<li class="work-row" data-work-id="relics">[\s\S]*?<\/li>/)?.[0];
    assert.ok(row, code);
    assert.equal((markup.match(/data-work-id="relics"/g) || []).length, 1);
    assert.ok(row.includes(escapeHtml(COPY[code].relicsBody)));
    assert.ok(row.includes('<span class="meta">Ex-formation</span>'));
    assert.ok(row.includes(`href="${href}" target="_blank" rel="noopener noreferrer"`));
    assert.ok(row.includes(`${escapeHtml(t('ui.visit').replace(' →', ''))}${ARROW}</a>`));
    for (const name of ['Twin-Sparrow', '2041', 'Aurelian']) assert.ok(relics.description.includes(name));
    const catalog = catalogFor(code).filter(({ category }) => category === 'work');
    assert.deepEqual(catalog.map(({ id }) => id), ids);
    assert.equal(catalog.find(({ id }) => id === 'relics').description, relics.description);
    assert.equal(runCommand('open relics', code).records[0].href, href);
    assert.ok(!renderApproach(code).includes('Relics'));
    assert.ok(!renderApproach(code).includes('approach-direction'));
  }
  setLang('en');
  assert.ok(COPY.en.relicsBody.includes('A developing reference'));
  assert.ok(COPY.en.relicsBody.includes('planned manuscript-based podcast'));
  assert.ok(COPY.en.relicsBody.includes('brittle AI and self-correcting intelligence'));
  assert.ok(COPY.en.relicsBody.length < 240);
  for (const path of ['index.html', 'templates/quiet/index.html']) assert.ok(read(path).includes('data-work-id="relics"'));
  for (const path of ['templates/quiet/approach.html', 'templates/quiet/notes.html', 'templates/ocean/index.html']) assert.ok(!read(path).includes('relics.quest'));
});

test('ThesisLens is localized once in Selected work and shared Dev records without changing ocean', () => {
  const href = 'https://thesislens.space/';
  for (const { code } of LANGUAGES) {
    setLang(code);
    const records = workFor(code);
    assert.equal(records.length, 7);
    assert.equal(records.at(-1).id, 'thesislens');
    const project = records.find(({ id }) => id === 'thesislens');
    assert.equal(project.name, 'ThesisLens');
    assert.equal(project.url, href);
    assert.equal(project.principle, COPY[code].thesislensKind);
    assert.equal(project.description, COPY[code].thesislensBody);
    assert.equal(project.statusKey, '');
    const markup = renderSections(code);
    const row = markup.match(/<li class="work-row" data-work-id="thesislens">[\s\S]*?<\/li>/)?.[0];
    assert.ok(row?.includes('<h3>ThesisLens</h3>'));
    assert.ok(row.includes(escapeHtml(project.description)));
    assert.ok(row.includes(escapeHtml(project.principle)));
    assert.ok(row.includes(`href="${href}" target="_blank" rel="noopener noreferrer"`));
    assert.ok(row.includes(`${escapeHtml(t('ui.visit').replace(' →', ''))}${ARROW}</a>`));
    assert.equal((markup.match(/data-work-id="thesislens"/g) || []).length, 1);
    assert.equal(catalogFor(code).filter(({ id }) => id === 'thesislens').length, 1);
    assert.equal(runCommand('find thesislens', code).records[0].href, href);
    assert.equal(runCommand('open thesislens', code).records[0].href, href);
    assert.equal(runCommand('open ThesisLens', code).records[0].description, project.description);
    assert.ok(!renderApproach(code).includes(href));
  }
  setLang('en');
  assert.ok(!projects.some(({ url }) => url === href));
  for (const path of ['index.html', 'templates/quiet/index.html']) assert.ok(read(path).includes('data-work-id="thesislens"'));
  for (const path of ['templates/quiet/notes.html', 'templates/quiet/approach.html', 'templates/ocean/index.html']) assert.ok(!read(path).includes(href));
});

test('command catalog preserves source links, statuses, publication kinds and album destinations', () => {
  for (const { code } of LANGUAGES) {
    setLang(code);
    const records = catalogFor(code);
    assert.equal(new Set(records.map(({ id }) => id)).size, records.length);
    assert.equal(records.filter(({ category }) => category === 'work').length, projects.length + 2);
    for (const record of [...projects, ...research].filter(({ url }) => url)) assert.ok(records.some(({ href }) => href === record.url));
    for (const album of albums) assert.equal(records.find(({ id }) => id === album.id).href, `#album-${album.id}`);
    assert.equal(records.find(({ id }) => id === 'twin-sparrow').href, '');
    assert.ok(records.find(({ id }) => id === 'twin-sparrow').status);
    assert.ok(records.find(({ id }) => id === 'hoegs').status);
    assert.equal(records.find(({ id }) => id === 'hoegs').description, COPY[code].papers[0]);
  }
  setLang('en');
});

test('Dev paths are display-only labels over the existing commands and record identifiers', () => {
  assert.deepEqual(DEV_SHORTCUTS.map(({ command, label }) => [command, label]), [['help', '~/help'], ['ls work', '~/ls --work'], ['ls research', '~/ls --research'], ['ls albums', '~/ls --albums']]);
  assert.equal(devPathLabel('relics', 'open'), '~/relics --open');
  assert.equal(devPathLabel('twin-sparrow'), '~/twin-sparrow');
  for (const { code } of LANGUAGES) {
    const markup = renderDevMode(code);
    for (const { command, label } of DEV_SHORTCUTS) {
      assert.ok(markup.includes(`data-command="${command}"`));
      assert.ok(markup.includes(`title="${command}">${label}</button>`));
      assert.ok(['help', 'records'].includes(runCommand(command, code).kind));
      assert.equal(runCommand(label, code).kind, 'message');
    }
    for (const record of catalogFor(code)) assert.equal(devPathLabel(record.id, record.href ? 'open' : ''), `~/${record.id}${record.href ? ' --open' : ''}`);
  }
  const css = read('templates/quiet/styles.css');
  assert.ok(css.includes('.dev-path { text-decoration: none; }'));
  assert.ok(css.includes('.dev-records a.dev-path { display: inline-flex; align-items: center; min-height: 44px; }'));
});

test('finite command grammar navigates only known content and never interprets shell or URLs', () => {
  assert.equal(runCommand(' help ', 'en').kind, 'help');
  assert.equal(runCommand('ls work', 'en').records.length, 7);
  assert.equal(runCommand('ls albums', 'en').records.length, 6);
  assert.equal(runCommand('find Twin', 'en').records[0].id, 'twin-sparrow');
  assert.equal(runCommand('open twin-sparrow', 'en').records[0].href, '');
  assert.equal(runCommand('open switzerland', 'en').record.href, '#album-switzerland');
  assert.equal(runCommand('OPEN "My approach"', 'en').record.href, '/templates/quiet/approach.html');
  assert.equal(runCommand('open hoegs', 'en').records[0].href, research[0].url);
  assert.deepEqual(runCommand('theme DARK', 'en'), { kind: 'theme', theme: 'dark' });
  for (const input of ['rm -rf /', 'curl https://example.com', 'open javascript:alert(1)', 'open https://example.com', '<img src=x onerror=alert(1)>', 'theme dark; exit', 'open switzerland && exit', 'ls __proto__', 'open __proto__', 'find', 'x'.repeat(257)]) {
    assert.equal(runCommand(input, 'en').kind, 'message', input);
  }
  assert.equal(runCommand('', 'en').kind, 'noop');
  assert.equal(runCommand('clear', 'en').kind, 'clear');
  assert.equal(runCommand('exit', 'en').kind, 'exit');
});

test('section navigation shares the existing accent on hover and keyboard focus', () => {
  const css = read('templates/quiet/styles.css');
  const rest = css.match(/\.section-nav a \{([^}]+)\}/)?.[1];
  assert.ok(rest?.includes('color: var(--muted)'));
  assert.ok(rest?.includes('min-height: 44px'));
  const feedback = css.match(/\.section-nav a:hover, \.section-nav a:focus-visible \{([^}]+)\}/)?.[1];
  assert.ok(feedback?.includes('color: var(--accent)'));
  assert.ok(feedback?.includes('text-decoration: none'));
  assert.ok(css.includes(':focus-visible { outline: 2px solid var(--accent); outline-offset: 5px; }'));
});

test('navigation/view bracket motion is label-bound, reversible, decorative and has reduced/touch fallbacks', () => {
  for (const { code } of LANGUAGES) {
    const nav = renderNavigation(code);
    assert.equal((nav.match(/class="bracket-label"/g) || []).length, 6);
    assert.equal((renderPreferences(code, true).match(/class="bracket-label"/g) || []).length, 2);
    assert.ok(nav.includes(`<span class="bracket-label" data-copy="work">${escapeHtml(COPY[code].work)}</span>`));
  }
  const css = read('templates/quiet/styles.css');
  assert.ok(css.includes('--bracket-offset: 2px; --bracket-opacity: 0; --bracket-time: 160ms;'));
  assert.ok(css.includes('--bracket-offset: 0px; --bracket-opacity: 1; --bracket-time: 240ms;'));
  assert.ok(css.includes('--bracket-ease: cubic-bezier(0.215, 0.61, 0.355, 1)'));
  assert.ok(css.includes("content: ''; position: absolute; top: 50%; width: 3px; height: 16px;"));
  assert.ok(css.includes('pointer-events: none'));
  assert.ok(css.includes('.view-control[aria-pressed=\'true\'] .bracket-label'));
  assert.ok(!css.includes('.view-control::after'));
  assert.ok(css.includes('--bracket-time: 0ms !important'));
  assert.ok(css.includes('transition: none !important; animation: none !important'));
  assert.ok(css.includes('.note-read-link, .email-link { font-size: 13px; text-decoration: underline;'));
  assert.ok(!css.includes('.button {'));
});

test('mobile disclosure preserves one native section index and localized controls with a visible static fallback', () => {
  for (const { code } of LANGUAGES) {
    const html = renderNavigation(code);
    assert.ok(html.includes('aria-expanded="false" aria-controls="quiet-navigation" hidden'));
    assert.ok(html.includes(`<span data-menu-label>${COPY[code].menu}</span>`));
    assert.ok(COPY[code].menuClose && COPY[code].menuView);
    assert.deepEqual([...html.matchAll(/href="(#[^"]+)"/g)].map(match => match[1]), ['#about', '#work', '#photography', '#research', '#notes', '#contact']);
    assert.ok(html.includes('id="quiet-navigation" class="navigation-panel">'));
    assert.ok(!html.includes('role="menu"') && !html.includes('role="dialog"'));
  }
  const css = read('templates/quiet/styles.css');
  assert.ok(css.includes('.navigation-panel { display: contents; }'));
  assert.ok(css.includes('.topbar.menu-ready .navigation-panel'));
});

test('Dev command focus is a tight hairline without changing the global focus indicator', () => {
  const css = read('templates/quiet/styles.css');
  const focus = css.match(/#dev-input:focus-visible \{([^}]+)\}/)?.[1];
  assert.ok(focus?.includes('outline-width: 1px'));
  assert.ok(focus?.includes('outline-offset: 2px'));
  assert.ok(css.includes(':focus-visible { outline: 2px solid var(--accent); outline-offset: 5px; }'));
  const input = css.match(/#dev-input \{([^}]+)\}/)?.[1];
  assert.ok(input?.includes('min-height: 44px'));
  assert.ok(input?.includes('caret-color: var(--accent)'));
});

test('language selector replaces its focus frame with an underline while preserving native and high-contrast focus', () => {
  const css = read('templates/quiet/styles.css');
  assert.ok(css.includes('.language-control select:focus-visible { outline: none; box-shadow: inset 0 -2px 0 var(--accent); }'));
  assert.ok(css.includes('@media (forced-colors: active) {\n  .language-control select:focus-visible { outline: 2px solid Highlight; box-shadow: none; }'));
  assert.ok(css.includes(':focus-visible { outline: 2px solid var(--accent); outline-offset: 5px; }'));
  const select = css.match(/\.language-control select \{([^}]+)\}/)?.[1];
  assert.ok(select?.includes('min-height: 44px'));
  assert.ok(select?.includes('border: 0'));
  assert.ok(!select?.includes('appearance: none'));
});

test('Quiet hides scrollbars without disabling native scrolling or retaining slider geometry', () => {
  const css = read('templates/quiet/styles.css');
  assert.ok(css.includes('scrollbar-width: none'));
  assert.ok(css.includes('*::-webkit-scrollbar { display: none; width: 0; height: 0; }'));
  assert.ok(css.includes('overflow-y: auto'));
  assert.ok(!css.includes('switch-track'));
  assert.ok(!css.includes('switch-thumb'));
  assert.ok(!css.includes('scroll-behavior: smooth'));
});

test('actual stylesheet text and button tokens meet AA in both themes', () => {
  const css = read('templates/quiet/styles.css');
  const lightBlock = css.match(/:root \{([^}]+)\}/)[1];
  const darkBlock = css.match(/:root\[data-theme='dark'\] \{([^}]+)\}/)[1];
  const tokens = (block) => Object.fromEntries([...block.matchAll(/--([\w-]+):\s*(#[\da-f]{6})/g)].map(([, key, value]) => [key, value]));
  const light = tokens(lightBlock);
  const dark = { ...light, ...tokens(darkBlock) };
  for (const theme of [light, dark]) {
    for (const ink of ['ink', 'muted', 'accent']) {
      assert.ok(contrast(theme[ink], theme.page) >= 4.5, `${ink} on page`);
    }
    for (const ink of ['ink', 'muted', 'surface-accent']) assert.ok(contrast(theme[ink], theme.surface) >= 4.5, `${ink} on command surface`);
    assert.ok(contrast(theme.muted, theme.page) >= 3, 'Switch track/thumb affordance');
    assert.ok(contrast(theme['button-ink'], theme.button) >= 4.5);
    assert.ok(contrast(theme['orange-ink'], theme.orange) >= 4.5);
  }
  assert.ok(css.includes('@media (prefers-reduced-motion: reduce)'));
});
