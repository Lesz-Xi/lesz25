import { research, albums, socials, renderArchive } from '../../src/data.js';
import { t } from '../../src/i18n.js';
import { copyFor } from './copy.js';
import { workFor } from './work.js';
import { entryGreeting } from './entry-greeting.js';

export const escapeHtml = (value) => String(value).replace(/[&<>"']/g, (character) => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
}[character]));

export const ARROW = '<svg viewBox="0 0 16 16" width="16" height="16" fill="none" aria-hidden="true"><path d="M4 12 12 4M4 4h8v8" stroke="currentColor" stroke-width="1.2"/></svg>';
const chevron = (previous) => `<svg viewBox="0 0 16 16" width="16" height="16" fill="none" aria-hidden="true"><path d="${previous ? 'M10 3 5 8l5 5' : 'm6 3 5 5-5 5'}" stroke="currentColor" stroke-width="1.2"/></svg>`;
const external = (url, label, className = 'text-link') => `<a class="${className}" href="${escapeHtml(url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(label)}${ARROW}</a>`;
const section = (id, heading, body) => `<section class="section-grid" id="${id}" aria-labelledby="${id}-heading"><h2 id="${id}-heading" class="section-label">${escapeHtml(heading)}</h2><div class="section-content">${body}</div></section>`;

export function renderEntryIntro(locale) {
  const c = copyFor(locale);
  const greeting = entryGreeting(locale, NaN); // Deterministic static fallback, never the build machine's time.
  return `<div id="entry-intro" class="entry-intro" role="region" aria-label="${escapeHtml(c.entryWelcome)}" hidden data-state="idle">
    <div class="entry-composition"><div class="entry-artwork" aria-hidden="true"></div><div class="entry-caption"><p class="entry-greeting" lang="fil">${escapeHtml(greeting.text)}</p><p class="entry-description" lang="${escapeHtml(locale)}">${escapeHtml(greeting.description)}</p></div></div>
  </div>`;
}

export function renderHero(locale) {
  const c = copyFor(locale);
  return `<section class="hero section-grid" aria-labelledby="intro-heading">
    <div class="identity"><img class="identity-portrait" src="/quiet/xi-profile.webp" width="160" height="160" alt="" decoding="async"><a class="name" href="/">Rhine Tague</a><p>${escapeHtml(c.role)}</p><span>${escapeHtml(t('contact.locationVal'))}</span></div>
    <div class="intro"><h1 id="intro-heading"><span class="hero-title-line">${escapeHtml(c.title)}</span> <span class="hero-title-line">${escapeHtml(c.curiosity)}</span> <span class="hero-title-line">${escapeHtml(c.concurrence)}</span></h1><p>${escapeHtml(c.intro)}</p><a class="text-link hero-work-link" href="#work">${escapeHtml(c.viewWork)}${ARROW}</a></div>
  </section>
  <figure class="cinematic">
    <div class="cinematic-frame"><img src="/quiet/switzerland-wide.webp" srcset="/quiet/switzerland-wide-small.webp 768w, /quiet/switzerland-wide.webp 1440w" sizes="(max-width: 700px) calc(100vw - 40px), (max-width: 1040px) calc(100vw - 212px), (max-width: 1280px) calc(100vw - 292px), 988px" width="1440" height="720" alt="${escapeHtml(c.heroAlt)}" fetchpriority="high" decoding="async"></div>
    <figcaption><span>${escapeHtml(t('album.switzerland.place'))}<span class="caption-separator" aria-hidden="true"> / </span>2022</span><a class="text-link" href="/#photography" data-album="switzerland">${escapeHtml(c.viewAlbum)}${ARROW}</a></figcaption>
  </figure>`;
}

export function renderSections(locale) {
  const c = copyFor(locale);
  const work = workFor(locale).map((project) => `<li class="work-row" data-work-id="${escapeHtml(project.id)}">
    <div class="work-title"><h3>${escapeHtml(project.name)}</h3><span class="meta">${escapeHtml(project.principle)}</span></div>
    <p>${escapeHtml(project.description)}</p>
    <div class="row-action">${project.url ? external(project.url, t('ui.visit').replace(' →', ''), project.id === 'relics' ? 'text-link relics-link' : 'text-link') : `<span class="status">${escapeHtml(t(project.statusKey))}</span>`}</div>
  </li>`).join('');
  const papers = research.filter((paper) => paper.url).map((paper, index) => `<li class="paper-row">
    <div><h3>${external(paper.url, paper.name, 'paper-link')}</h3><span class="meta">${escapeHtml(t(`res.${index}.kind`))}</span><p>${escapeHtml(c.papers[index])}</p></div>
  </li>`).join('');
  const albumOrder = ['switzerland', 'paris', 'philippines', 'nature', 'sunset', 'flowers'];
  const photos = albumOrder.map((id) => albums.find((album) => album.id === id)).map((album) => `<li><a class="album-card" href="/#photography" data-album="${album.id}">
    <img src="/quiet/${album.id}-thumb.webp" alt="${escapeHtml(t(`album.${album.id}.title`))}" sizes="(max-width: 700px) calc(100vw - 40px), (max-width: 1040px) calc((100vw - 236px) / 2), (max-width: 1280px) calc((100vw - 340px) / 3), 314px" width="600" height="450" loading="lazy" decoding="async">
    <span class="album-name">${escapeHtml(t(`album.${album.id}.title`))}${ARROW}</span><span class="meta">${escapeHtml(t(`album.${album.id}.place`))} / ${album.year}</span>
  </a></li>`).join('');
  const contacts = socials.filter((social) => social.url && !social.url.startsWith('mailto:')).map((social) => `<li>${external(social.url, social.key)}</li>`).join('');
  return section('about', c.about, `<div class="about-copy"><p>${escapeHtml(c.aboutBody)}</p><p>${escapeHtml(c.designBody)}</p><p>${escapeHtml(c.purpose)}</p><a class="text-link" href="/templates/quiet/approach.html" data-read-approach>${escapeHtml(c.fullPurpose)}${ARROW}</a></div>`)
    + section('work', c.work, `<p class="section-intro">${escapeHtml(c.workIntro)}</p><ul class="work-list">${work}</ul>`)
    + section('photography', c.photography, `<p class="section-intro">${escapeHtml(c.photoIntro)}</p><ul class="album-grid" aria-label="${escapeHtml(c.allAlbums)}">${photos}</ul>
      <div class="album-viewer" id="album-viewer" hidden>
        <div class="viewer-heading"><h3 id="album-heading" tabindex="-1"></h3><button type="button" class="text-control" data-album-close>${escapeHtml(t('ui.close'))}</button></div>
        <figure><div class="viewer-stage"><a class="photo-preview-trigger" href="/img/switzerland.webp" target="_blank" rel="noopener noreferrer" data-photo-preview aria-haspopup="dialog" aria-label="${escapeHtml(c.previewImage)}"><img id="album-image" alt="" width="1600" height="1200"></a><p id="image-loading" role="status" hidden>${escapeHtml(c.imageLoading)}</p><p id="image-error" role="status" hidden>${escapeHtml(c.imageError)}</p></div>
          <figcaption class="viewer-controls"><button type="button" class="icon-control" data-photo-prev aria-label="${escapeHtml(t('ui.prev'))}">${chevron(true)}</button><span id="photo-count" role="status" aria-live="polite"></span><button type="button" class="icon-control" data-photo-next aria-label="${escapeHtml(t('ui.next'))}">${chevron(false)}</button><a id="full-image" class="text-link" target="_blank" rel="noopener noreferrer">${escapeHtml(c.openImage)}${ARROW}</a></figcaption>
        </figure>
      </div>`)
    + section('research', c.research, `<p class="section-intro">${escapeHtml(c.researchIntro)}</p><ul class="paper-list">${papers}</ul><p class="research-boundary">${escapeHtml(c.claim)}</p>`)
    + section('notes', c.notesHeading, `<article class="note-entry"><h3 lang="en"><a class="note-title" href="/templates/quiet/notes.html">What My Hands Knew First</a></h3><p class="meta">${escapeHtml(c.notes)}</p><p class="note-preview" lang="en">I only discover what I believe after I build it.</p><div class="note-actions"><a class="text-link note-read-link" href="/templates/quiet/notes.html" data-read-note>${escapeHtml(c.readNote)}${ARROW}</a><span class="meta" lang="en">Jul 2026</span></div></article>`)
    + section('contact', c.contact, `<p class="contact-intro">${escapeHtml(c.contactBody)}</p><a class="text-link email-link" href="${escapeHtml(socials[0].url)}">${escapeHtml(c.email)}${ARROW}</a><ul class="social-links">${contacts}</ul>`);
}

export function renderLightbox(locale) {
  const c = copyFor(locale);
  return `<dialog id="photo-preview" class="photo-lightbox" aria-labelledby="preview-title">
    <header class="lightbox-header"><h2 id="preview-title">${escapeHtml(c.previewImage)}</h2><button type="button" class="text-control" id="preview-close" data-i18n="ui.close" autofocus>${escapeHtml(t('ui.close'))}</button></header>
    <div class="lightbox-stage" aria-busy="false"><button type="button" id="preview-dismiss" class="preview-photo" aria-label="${escapeHtml(t('ui.close'))}" title="${escapeHtml(t('ui.close'))}" hidden><img id="preview-image" alt="" hidden></button><p id="preview-status" role="status" data-copy="imageLoading">${escapeHtml(c.imageLoading)}</p></div>
    <footer class="lightbox-footer"><span id="preview-count" role="status" aria-live="polite"></span><div class="preview-navigation"><button type="button" class="icon-control" data-preview-prev aria-label="${escapeHtml(t('ui.prev'))}">${chevron(true)}</button><button type="button" class="icon-control" data-preview-next aria-label="${escapeHtml(t('ui.next'))}">${chevron(false)}</button></div><div class="preview-source"><a id="preview-original" class="text-link" href="/img/switzerland.webp" target="_blank" rel="noopener noreferrer"><span data-copy="openImage">${escapeHtml(c.openImage)}</span>${ARROW}</a></div></footer>
  </dialog>`;
}

// Reuse the existing localized purpose paragraphs and principles, not new claims.
export function renderApproach(locale) {
  const c = copyFor(locale);
  const paragraphs = [1, 2, 3].map((index) => `<p>${escapeHtml(t(`purpose.p${index}`))}</p>`).join('\n');
  const principles = [0, 1, 2, 3, 4, 5].map((index) => `<li>${escapeHtml(t(`purpose.pr${index}`))}</li>`).join('');
  return `<div class="reading-layout">
    <aside class="reading-rail"><a class="text-link" href="/#about">${escapeHtml(c.about)}</a></aside>
    <article class="reading-article" aria-labelledby="approach-title">
      <header class="reading-header"><h1 id="approach-title">${escapeHtml(c.approachHeading)}</h1></header>
      <div class="note-body approach-body">${paragraphs}<h2>${escapeHtml(c.principles)}</h2><ul class="approach-principles">${principles}</ul></div>
      <footer class="reading-end"><a class="text-link" href="/#about">${escapeHtml(c.backPortfolio)}</a>${ARROW}</footer>
    </article>
  </div>`;
}

// Reframe the existing authored essay, never rewrite or translate its body.
// The same function generates the complete no-JavaScript reading page.
export function renderNote(locale) {
  const c = copyFor(locale);
  const source = renderArchive();
  const title = source.match(/<h3 class="archive-title">([^<]+)<\/h3>/)?.[1];
  const date = source.match(/<div class="archive-eyebrow">([^<]+)<\/div>/)?.[1];
  const paragraphs = [...source.matchAll(/<p class="letter-body(?: ([^"]+))?">([\s\S]*?)<\/p>/g)];
  if (!title || !date || paragraphs.length === 0) throw new Error('Archive source structure changed; inspect before publishing.');
  const body = paragraphs.map(([, role, html]) => `<p${role === 'archive-lede' ? ' class="note-lede"' : role === 'archive-close' ? ' class="note-ending"' : ''}>${html}</p>`).join('\n');
  return `<div class="reading-layout">
    <aside class="reading-rail"><a class="text-link" href="/#notes" data-copy="notesHeading">${escapeHtml(c.notesHeading)}</a></aside>
    <article class="reading-article" lang="en" aria-labelledby="note-title">
      <header class="reading-header"><h1 id="note-title">${title}</h1><div class="reading-meta"><span>Rhine Tague</span><span>${date}</span><span data-copy="noteLanguage" lang="${escapeHtml(locale)}">${escapeHtml(c.noteLanguage)}</span></div></header>
      <div class="note-body">${body}</div>
      <footer class="reading-end"><a class="text-link" href="/#notes" data-copy="backPortfolio" lang="${escapeHtml(locale)}">${escapeHtml(c.backPortfolio)}</a>${ARROW}</footer>
    </article>
  </div>`;
}
