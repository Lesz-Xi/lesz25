// Maintain English fallbacks and the root homepage from the same Quiet source.
// Usage: node scripts/sync-quiet.mjs [--check]
import { readFile, writeFile } from 'node:fs/promises';

Object.defineProperty(globalThis, 'navigator', {
  value: { languages: ['en'], language: 'en' }, configurable: true,
});
const { renderHero, renderSections, renderNote, renderLightbox, renderApproach, renderEntryIntro } = await import('../templates/quiet/render.js');
const { renderPreferences, renderDevMode, renderNavigation } = await import('../templates/quiet/controls.js');
const pages = [
  ['index.html', [['navigation', renderNavigation], ['entry', renderEntryIntro], ['preferences', (locale) => renderPreferences(locale, true)], ['hero', renderHero], ['sections', renderSections], ['lightbox', renderLightbox], ['dev', renderDevMode]]],
  ['notes.html', [['preferences', renderPreferences], ['note', renderNote]]],
  ['approach.html', [['preferences', renderPreferences], ['approach', renderApproach]]],
];
for (const [page, blocks] of pages) {
  const file = new URL(`../templates/quiet/${page}`, import.meta.url);
  const before = await readFile(file, 'utf8');
  let after = before;
  for (const [name, render] of blocks) {
    const start = `<!-- quiet:${name}:start -->`;
    const end = `<!-- quiet:${name}:end -->`;
    if (before.split(start).length !== 2 || before.split(end).length !== 2) {
      throw new Error(`Expected one pair of ${name} snapshot markers`);
    }
    const from = after.indexOf(start) + start.length;
    const to = after.indexOf(end);
    if (to <= from) throw new Error(`Invalid ${name} snapshot marker order`);
    after = after.slice(0, from) + `\n${render('en')}\n        ` + after.slice(to);
  }
  if (process.argv.includes('--check')) {
    if (before !== after) {
      console.error(`Quiet ${page} snapshot is stale. Run node scripts/sync-quiet.mjs`);
      process.exitCode = 1;
    } else console.log(`Quiet ${page} snapshot matches its renderer.`);
  } else if (before !== after) {
    await writeFile(file, after);
    console.log(`Updated the Quiet ${page} English fallback.`);
  }
}

// Keep one authoring entry; root only changes the two relative module/stylesheet URLs.
const template = await readFile(new URL('../templates/quiet/index.html', import.meta.url), 'utf8');
for (const reference of ['href="./styles.css"', 'src="./main.js"']) {
  if (template.split(reference).length !== 2) throw new Error(`Expected one homepage reference: ${reference}`);
}
const home = template.replace('href="./styles.css"', 'href="/templates/quiet/styles.css"')
  .replace('src="./main.js"', 'src="/templates/quiet/main.js"');
const homeFile = new URL('../index.html', import.meta.url);
if (await readFile(homeFile, 'utf8') !== home) {
  if (process.argv.includes('--check')) {
    console.error('Root homepage is stale. Run node scripts/sync-quiet.mjs');
    process.exitCode = 1;
  } else {
    await writeFile(homeFile, home);
    console.log('Updated the root Quiet homepage.');
  }
} else console.log('Root homepage matches the Quiet entry.');
