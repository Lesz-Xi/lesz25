// Letter overlays (hash-routed), chevron nav, and photography lightbox.
// Mirrors earendil's :target letter mechanism with is-open/is-closing classes,
// so the ocean canvas is never re-mounted.

import { LETTERS, albums, albumTitle, albumPlace } from './data.js';
import { t } from './i18n.js';

const REDUCED_MOTION = window.matchMedia
  && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const OPEN_KEYS = Object.keys(LETTERS);
let activeKey = null;
let closingTimer = null;

function buildLetters() {
  const frag = document.createDocumentFragment();
  for (const key of OPEN_KEYS) {
    const cfg = LETTERS[key];
    const overlay = document.createElement('div');
    overlay.className = 'letter-overlay';
    overlay.id = `letter-${key}`;
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-label', cfg.title());
    overlay.hidden = false;
    overlay.innerHTML = `
      <div class="letter-card">
        <button class="letter-dismiss" type="button" data-close aria-label="${t('ui.close')}"><svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" aria-hidden="true"><path d="M5 12.5v-1h14v1z"/></svg></button>
        ${cfg.kicker() ? `<div class="letter-kicker">${cfg.kicker()}</div>` : ''}
        <h2 class="letter-title">${cfg.title()}</h2>
        <div class="letter-scroll">
          <div class="letter-body">${cfg.render()}</div>
        </div>
      </div>`;
    // Click on the backdrop (not the card) closes.
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) closeLetter();
    });
    frag.appendChild(overlay);
  }
  document.body.appendChild(frag);
  for (const key of OPEN_KEYS) wireLetterScroll(key);
}

// A letter is a short ledger you read by scrolling. The bottom fade is the whole
// signal: it says "there is more below" and nothing it cannot back up.
function wireLetterScroll(key) {
  const overlay = document.getElementById(`letter-${key}`);
  if (!overlay) return;
  const scroll = overlay.querySelector('.letter-scroll');
  if (scroll) wireOverflowFade(scroll);
}

function wireOverflowFade(scroll) {
  const update = () => {
    const more = scroll.scrollHeight - scroll.clientHeight - scroll.scrollTop > 4;
    scroll.classList.toggle('has-more', more);
  };
  scroll.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
  // initial state once the letter first opens (layout settled)
  setTimeout(update, 50);
  new MutationObserver(update).observe(scroll, { childList: true, subtree: true });
}

// --- Photography: album grid → single-album image viewer ---

let albumIndex = 0;   // which album is open in the detail view
let imgIndex = 0;     // which image within that album

function pad2(n) { return String(n).padStart(2, '0'); }

// The viewer opens on the album's cover — the image the card was clicked by —
// then pages through the gallery. The cover is already cached from the grid,
// so the detail view appears instantly.
function albumGallery(album) {
  return [album.cover, ...album.images];
}

// Return to the grid of albums (also the state each time the letter opens).
function showAlbumGrid() {
  const grid = document.querySelector('[data-photo-albums]');
  const detail = document.querySelector('[data-photo-detail]');
  if (!grid || !detail) return;
  detail.hidden = true;
  grid.hidden = false;
  // Grid mode shows the "Photography" title + intro; detail mode is image-first.
  const letter = document.getElementById('letter-photography');
  if (letter) letter.classList.remove('is-album-detail');
}

function openAlbum(ai) {
  const grid = document.querySelector('[data-photo-albums]');
  const detail = document.querySelector('[data-photo-detail]');
  if (!grid || !detail) return;
  albumIndex = ((ai % albums.length) + albums.length) % albums.length;
  grid.hidden = true;
  detail.hidden = false;
  const letter = document.getElementById('letter-photography');
  if (letter) {
    letter.classList.add('is-album-detail');
    const sc = letter.querySelector('.letter-scroll');
    if (sc) sc.scrollTop = 0;
  }
  setImage(0);
  const back = detail.querySelector('[data-album-back]');
  if (back) back.focus({ preventScroll: true });
}

function setImage(i) {
  const detail = document.querySelector('[data-photo-detail]');
  if (!detail) return;
  const album = albums[albumIndex];
  const imgs = albumGallery(album);
  imgIndex = ((i % imgs.length) + imgs.length) % imgs.length;
  const src = imgs[imgIndex];
  const stage = detail.querySelector('[data-photo-stage]');
  const img = detail.querySelector('[data-photo-img]');
  const thumb = stage.querySelector('.photo-thumb');
  const controls = detail.querySelector('[data-photo-controls]');
  // A lone cover has nothing to page — hide the ‹ › toggle for single-image albums.
  if (controls) controls.hidden = imgs.length <= 1;

  const apply = () => {
    img.src = src;
    img.alt = `${albumTitle(album)} — ${imgIndex + 1} of ${imgs.length}`;
    thumb.dataset.full = src;
    thumb.setAttribute('aria-label', `${albumTitle(album)} — ${albumPlace(album)}, ${album.year}`);
    const counter = detail.querySelector('[data-photo-counter]');
    if (counter) counter.textContent = `${pad2(imgIndex + 1)} / ${pad2(imgs.length)}`;
  };

  if (REDUCED_MOTION) {
    apply();
  } else {
    stage.classList.add('is-switching');
    setTimeout(() => {
      apply();
      const settle = () => { stage.classList.remove('is-switching'); img.removeEventListener('load', settle); };
      if (img.complete) settle(); else img.addEventListener('load', settle);
    }, 240);
  }
  // Preload the next image in this album for a seamless step.
  if (imgs.length > 1) {
    const pre = new Image();
    pre.src = imgs[(imgIndex + 1) % imgs.length];
  }
}

function wirePhotoViewer() {
  document.body.addEventListener('click', (e) => {
    const openBtn = e.target.closest('[data-album-open]');
    if (openBtn) { openAlbum(parseInt(openBtn.dataset.albumOpen, 10)); return; }
    if (e.target.closest('[data-album-back]')) { showAlbumGrid(); return; }
    if (e.target.closest('[data-photo-prev]')) { setImage(imgIndex - 1); return; }
    if (e.target.closest('[data-photo-next]')) { setImage(imgIndex + 1); return; }
  });
  document.addEventListener('keydown', (e) => {
    const open = document.getElementById('letter-photography');
    if (!open || !open.classList.contains('is-open')) return;
    const detail = open.querySelector('[data-photo-detail]');
    if (!detail || detail.hidden) return;   // arrows page only inside an open album
    if (e.key === 'ArrowLeft') { e.preventDefault(); setImage(imgIndex - 1); }
    if (e.key === 'ArrowRight') { e.preventDefault(); setImage(imgIndex + 1); }
  });
}

function openLetter(key) {
  if (!LETTERS[key]) return;
  if (closingTimer) { clearTimeout(closingTimer); closingTimer = null; }
  // Close any currently-open different letter immediately (swap).
  if (activeKey && activeKey !== key) {
    const prev = document.getElementById(`letter-${activeKey}`);
    if (prev) prev.classList.remove('is-open', 'is-closing');
  }
  const el = document.getElementById(`letter-${key}`);
  if (!el) return;
  el.classList.remove('is-closing');
  // fresh read: a letter always opens at its top
  const sc = el.querySelector('.letter-scroll');
  if (sc) sc.scrollTop = 0;
  // force reflow so the transition runs from opacity 0
  void el.offsetWidth;
  el.classList.add('is-open');
  activeKey = key;
  document.body.classList.add('has-letter');
  // Photography always opens on the album grid, never a stale detail view.
  if (key === 'photography') showAlbumGrid();
  // move focus to the dismiss button for a11y
  const dismiss = el.querySelector('[data-close]');
  if (dismiss) dismiss.focus({ preventScroll: true });
}

function closeLetter() {
  if (!activeKey) return;
  const el = document.getElementById(`letter-${activeKey}`);
  const key = activeKey;
  activeKey = null;
  document.body.classList.remove('has-letter');
  if (el) {
    el.classList.remove('is-open');
    el.classList.add('is-closing');
    closingTimer = setTimeout(() => {
      el.classList.remove('is-closing');
      closingTimer = null;
    }, 360);
  }
  // clear the hash without adding history noise
  if (location.hash === `#${key}`) {
    history.replaceState(null, '', location.pathname + location.search);
  }
}

function syncFromHash() {
  const key = location.hash.replace(/^#/, '');
  if (OPEN_KEYS.includes(key)) {
    openLetter(key);
  } else {
    // #top or empty → close
    if (activeKey) closeLetter();
  }
}

function wireChevronNav() {
  const nav = document.querySelector('[data-chevron-menu]');
  if (!nav) return;
  const toggle = nav.querySelector('.menu-trigger-toggle');
  const links = nav.querySelector('.menu-links');

  function setOpen(open) {
    nav.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    if (open) { links.hidden = false; }
    else { links.hidden = true; }
  }

  toggle.addEventListener('click', (e) => {
    e.stopPropagation();
    setOpen(!nav.classList.contains('is-open'));
  });

  // Clicking a section link closes the menu; hashchange opens the letter.
  links.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', () => setOpen(false));
  });

  // Click outside closes the menu.
  document.addEventListener('click', (e) => {
    if (!nav.contains(e.target)) setOpen(false);
  });

  // Escape closes menu, then letter.
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    if (nav.classList.contains('is-open')) { setOpen(false); return; }
    if (activeKey) closeLetter();
  });
}

function wireLightbox() {
  const lb = document.getElementById('lightbox');
  const lbImg = document.getElementById('lightbox-img');
  if (!lb || !lbImg) return;

  function open(src, alt) {
    lbImg.src = src;
    lbImg.alt = alt || '';
    lb.classList.add('is-open');
    lb.setAttribute('aria-hidden', 'false');
  }
  function close() {
    lb.classList.remove('is-open');
    lb.setAttribute('aria-hidden', 'true');
    lbImg.src = '';
  }

  // Delegate: photo thumbs live inside letters.
  document.body.addEventListener('click', (e) => {
    const thumb = e.target.closest('.photo-thumb');
    if (thumb) { open(thumb.dataset.full, thumb.getAttribute('aria-label')); }
  });
  document.body.addEventListener('keydown', (e) => {
    const thumb = e.target.closest && e.target.closest('.photo-thumb');
    if (thumb && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      open(thumb.dataset.full, thumb.getAttribute('aria-label'));
    }
  });
  lb.addEventListener('click', close);
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && lb.classList.contains('is-open')) close(); });
}

// Re-render the letters in a new language. The photo viewer, lightbox and
// dismiss handlers are delegated on document/body, so they survive this; only
// the per-overlay listeners are re-created by buildLetters().
export function rebuildLetters() {
  const wasOpen = activeKey;
  clearTimeout(closingTimer);
  activeKey = null;
  document.querySelectorAll('.letter-overlay').forEach((el) => el.remove());
  buildLetters();
  if (wasOpen) syncFromHash(); // re-open whatever the hash still points at
}

export function initOverlays() {
  buildLetters();
  wireChevronNav();
  wireLightbox();
  wirePhotoViewer();
  // dismiss buttons
  document.body.addEventListener('click', (e) => {
    if (e.target.closest('[data-close]')) closeLetter();
  });
  window.addEventListener('hashchange', syncFromHash);
  syncFromHash(); // deep-link support (e.g. loading /#work)
}
