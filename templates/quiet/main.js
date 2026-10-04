import { getLang, onLangChange, t } from '../../src/i18n.js';
import { albums } from '../../src/data.js';
import { copyFor } from './copy.js';
import { renderHero, renderSections } from './render.js';
import { albumFromHash, galleryImages, wrapIndex } from './gallery.js';
import { initPreferences } from './preferences.js';
import { initPhotoPreview } from './lightbox.js';
import { initDevMode } from './dev-mode.js';

const { refresh: refreshPreferences, setTheme } = initPreferences();
const preview = initPhotoPreview();
let activeAlbum = null;
let photoIndex = 0;
let lastAlbumTrigger = null;
let devMode = null;

function paintPhoto() {
  if (!activeAlbum) return;
  const images = galleryImages(activeAlbum);
  photoIndex = wrapIndex(photoIndex, images.length);
  const photo = document.querySelector('#album-image');
  const error = document.querySelector('#image-error');
  const trigger = document.querySelector('[data-photo-preview]');
  const title = t(`album.${activeAlbum.id}.title`);
  const c = copyFor(getLang());
  photo.hidden = false;
  trigger.hidden = false;
  error.hidden = true;
  photo.alt = `${title} — ${c.photoNumber} ${photoIndex + 1} / ${images.length}`;
  trigger.href = images[photoIndex];
  trigger.setAttribute('aria-label', c.previewImage);
  trigger.title = c.previewImage;
  photo.onerror = () => { photo.hidden = true; trigger.hidden = true; error.hidden = false; };
  photo.onload = () => { photo.hidden = false; trigger.hidden = false; error.hidden = true; };
  photo.src = images[photoIndex];
  document.querySelector('#full-image').href = images[photoIndex];
  document.querySelector('#photo-count').textContent = `${String(photoIndex + 1).padStart(2, '0')} / ${String(images.length).padStart(2, '0')}`;
  document.querySelector('#album-heading').textContent = `${title} / ${activeAlbum.year}`;
  preview.refresh();
}

function syncAlbum({ focus = false } = {}) {
  const album = albumFromHash(location.hash, albums);
  if (album?.id !== activeAlbum?.id) photoIndex = 0;
  activeAlbum = album;
  const viewer = document.querySelector('#album-viewer');
  viewer.hidden = !album;
  if (!album) return;
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
    preview.open(previewTrigger);
  } else if (albumLink && !event.ctrlKey && !event.metaKey && !event.shiftKey && !event.altKey && event.button === 0) {
    event.preventDefault();
    lastAlbumTrigger = albumLink;
    const hash = `#album-${albumLink.dataset.album}`;
    if (location.hash !== hash) history.pushState(null, '', hash);
    syncAlbum({ focus: true });
  } else if (event.target.closest('[data-album-close]')) {
    closeAlbum();
  } else if (event.target.closest('[data-photo-prev]')) {
    photoIndex -= 1;
    paintPhoto();
  } else if (event.target.closest('[data-photo-next]')) {
    photoIndex += 1;
    paintPhoto();
  }
});
document.addEventListener('keydown', (event) => {
  if (preview.isOpen()) return;
  const viewer = document.querySelector('#album-viewer');
  if (!activeAlbum || !viewer.contains(document.activeElement)) return;
  if (event.key === 'Escape') { event.preventDefault(); closeAlbum(); }
  if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
    event.preventDefault();
    photoIndex += event.key === 'ArrowRight' ? 1 : -1;
    paintPhoto();
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
