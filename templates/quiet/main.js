import { getLang, onLangChange, t } from '../../src/i18n.js';
import { albums } from '../../src/data.js';
import { copyFor } from './copy.js';
import { renderHero, renderSections } from './render.js';
import { albumFromHash, galleryImages, wrapIndex } from './gallery.js';
import { initPreferences } from './preferences.js';
import { initPhotoPreview } from './lightbox.js';
import { initDevMode } from './dev-mode.js';
import { createPhotoLoader } from './photo-loader.js';

const { refresh: refreshPreferences, setTheme } = initPreferences();
const preview = initPhotoPreview({ navigate: navigatePhoto });
let activeAlbum = null;
let photoIndex = 0;
let lastAlbumTrigger = null;
let devMode = null;
let photoRequest = 0;
const photoLoader = createPhotoLoader();

async function paintPhoto() {
  if (!activeAlbum) return;
  const images = galleryImages(activeAlbum);
  photoIndex = wrapIndex(photoIndex, images.length);
  const index = photoIndex;
  const albumId = activeAlbum.id;
  const source = images[index];
  const current = ++photoRequest;
  const photo = document.querySelector('#album-image');
  const stage = document.querySelector('.viewer-stage');
  const loading = document.querySelector('#image-loading');
  const error = document.querySelector('#image-error');
  const trigger = document.querySelector('[data-photo-preview]');
  const title = t(`album.${albumId}.title`);
  const c = copyFor(getLang());
  error.hidden = true;
  loading.textContent = c.imageLoading;
  loading.hidden = false;
  stage.setAttribute('aria-busy', 'true');
  trigger.setAttribute('aria-disabled', 'true');
  document.querySelector('#photo-count').textContent = `${String(index + 1).padStart(2, '0')} / ${String(images.length).padStart(2, '0')}`;
  document.querySelector('#album-heading').textContent = `${title} / ${activeAlbum.year}`;
  preview.refresh();
  try {
    const loaded = await photoLoader.load(source);
    if (current !== photoRequest || activeAlbum?.id !== albumId || !photo.isConnected) return;
    // Commit an already-decoded image: the preceding photograph stays intact
    // while loading, and late results cannot overwrite a newer selection.
    loaded.id = 'album-image';
    loaded.width = 1600;
    loaded.height = 1200;
    loaded.alt = `${title} — ${c.photoNumber} ${index + 1} / ${images.length}`;
    loaded.hidden = false;
    if (loaded !== photo) photo.replaceWith(loaded);
    trigger.hidden = false;
    trigger.href = source;
    trigger.setAttribute('aria-disabled', 'false');
    trigger.setAttribute('aria-label', c.previewImage);
    trigger.title = c.previewImage;
    document.querySelector('#full-image').href = source;
    document.querySelector('#full-image').hidden = false;
    loading.hidden = true;
    stage.setAttribute('aria-busy', 'false');
    preview.refresh();
    const connection = navigator.connection;
    if (!connection?.saveData && !['slow-2g', '2g'].includes(connection?.effectiveType)) {
      for (const offset of [1, -1]) photoLoader.load(images[wrapIndex(index + offset, images.length)]).catch(() => {});
    }
  } catch {
    if (current !== photoRequest || activeAlbum?.id !== albumId || !photo.isConnected) return;
    photo.hidden = true;
    trigger.hidden = true;
    loading.hidden = true;
    error.hidden = false;
    document.querySelector('#full-image').hidden = true;
    stage.setAttribute('aria-busy', 'false');
    preview.refresh();
  }
}

function navigatePhoto(offset) {
  if (!activeAlbum) return;
  photoIndex += offset;
  paintPhoto();
}

function syncAlbum({ focus = false } = {}) {
  const album = albumFromHash(location.hash, albums);
  if (album?.id !== activeAlbum?.id) photoIndex = 0;
  activeAlbum = album;
  const viewer = document.querySelector('#album-viewer');
  viewer.hidden = !album;
  if (!album) {
    ++photoRequest;
    photoLoader.clear();
    return;
  }
  paintPhoto();
  if (focus) {
    const heading = document.querySelector('#album-heading');
    heading.focus({ preventScroll: true });
    heading.scrollIntoView({ block: 'start', behavior: 'instant' });
  }
}

function closeAlbum() {
  history.replaceState(null, '', '#photography');
  syncAlbum();
  const target = lastAlbumTrigger?.isConnected ? lastAlbumTrigger : document.querySelector('[data-album="switzerland"]');
  target?.focus();
}

function paintPage() {
  const locale = getLang();
  const c = copyFor(locale);
  const oldAlbum = activeAlbum;
  const oldIndex = photoIndex;
  document.querySelector('#quiet-hero').innerHTML = renderHero(locale);
  document.querySelector('#quiet-sections').innerHTML = renderSections(locale);
  document.querySelector('meta[name="description"]').content = c.intro;
  document.querySelector('meta[property="og:description"]').content = c.intro;
  document.querySelector('meta[property="og:title"]').content = `Rhine Tague — ${c.title}`;
  document.title = `Rhine Tague — ${c.title}`;
  refreshPreferences();
  activeAlbum = oldAlbum;
  photoIndex = oldIndex;
  syncAlbum();
}

// One delegated controller survives language changes without duplicate listeners.
document.querySelector('#main').addEventListener('click', (event) => {
  if (!(event.target instanceof Element)) return;
  const albumLink = event.target.closest('[data-album]');
  const previewTrigger = event.target.closest('[data-photo-preview]');
  if (previewTrigger && !event.ctrlKey && !event.metaKey && !event.shiftKey && !event.altKey && event.button === 0) {
    event.preventDefault();
    if (previewTrigger.getAttribute('aria-disabled') !== 'true') preview.open(previewTrigger);
  } else if (albumLink && !event.ctrlKey && !event.metaKey && !event.shiftKey && !event.altKey && event.button === 0) {
    event.preventDefault();
    lastAlbumTrigger = albumLink;
    const hash = `#album-${albumLink.dataset.album}`;
    if (location.hash !== hash) history.pushState(null, '', hash);
    syncAlbum({ focus: true });
  } else if (event.target.closest('[data-album-close]')) {
    closeAlbum();
  } else if (event.target.closest('[data-photo-prev]')) {
    navigatePhoto(-1);
  } else if (event.target.closest('[data-photo-next]')) {
    navigatePhoto(1);
  }
});
document.addEventListener('keydown', (event) => {
  if (preview.isOpen()) return;
  const viewer = document.querySelector('#album-viewer');
  if (!activeAlbum || !viewer.contains(document.activeElement)) return;
  if (event.key === 'Escape') { event.preventDefault(); closeAlbum(); }
  if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
    event.preventDefault();
    navigatePhoto(event.key === 'ArrowRight' ? 1 : -1);
  }
});
function navigatePortfolio(href) {
  if (!href.startsWith('#')) { location.assign(href); return; }
  if (location.hash !== href) history.pushState(null, '', href);
  preview.close({ restoreFocus: false });
  syncAlbum({ focus: Boolean(albumFromHash(href, albums)) });
  if (!albumFromHash(href, albums)) {
    // A skip-link hash targets MAIN itself, not the first section inside it.
    const section = document.getElementById(href.slice(1));
    const heading = section?.tagName === 'SECTION' ? section.querySelector('h2') : null;
    if (heading) { heading.tabIndex = -1; heading.focus({ preventScroll: true }); heading.scrollIntoView({ block: 'start', behavior: 'instant' }); }
  }
}
window.addEventListener('hashchange', () => {
  devMode?.exit({ restore: false });
  if (location.hash) navigatePortfolio(location.hash);
  else { preview.close({ restoreFocus: false }); syncAlbum(); }
});
onLangChange(paintPage);
paintPage();
devMode = initDevMode({ navigate: navigatePortfolio, setTheme, beforeEnter: () => preview.close({ restoreFocus: false }) });
if (albumFromHash(location.hash, albums)) syncAlbum({ focus: true });
// Optional motion must not gate the portfolio module, rendering or image readiness.
import('./entry-intro.js').then(({ initEntryIntro }) => {
  const start = () => initEntryIntro({ locale: getLang() });
  if (performance.getEntriesByType('navigation')[0]?.type !== 'reload') { start(); return; }
  // Only the optional welcome waits for reload's native restoration/layout frame.
  const afterLoad = () => requestAnimationFrame(start);
  if (document.readyState === 'complete') afterLoad();
  else window.addEventListener('load', afterLoad, { once: true });
}).catch(() => {
  // Optional module failure releases the early ground; normal controls still initialize.
  if (document.documentElement.dataset.entryBoot === 'pending') document.documentElement.dataset.entryBoot = 'bypassed';
});
