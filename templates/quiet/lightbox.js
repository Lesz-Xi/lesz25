// One native dialog, independent of the album's hash/index and language re-render.
import { getLang } from '../../src/i18n.js';
import { copyFor } from './copy.js';

export function initPhotoPreview() {
  const dialog = document.querySelector('#photo-preview');
  const image = document.querySelector('#preview-image');
  const stage = document.querySelector('.lightbox-stage');
  const status = document.querySelector('#preview-status');
  let trigger = null;
  let scrollPosition = { x: 0, y: 0 };
  let overflow = '';
  let request = 0;
  let failed = false;
  let restoreFocus = true;

  function refresh() {
    if (!dialog.open) return;
    const photo = document.querySelector('#album-image');
    image.alt = photo.alt;
    document.querySelector('#preview-title').textContent = document.querySelector('#album-heading').textContent;
    document.querySelector('#preview-count').textContent = document.querySelector('#photo-count').textContent;
    if (!status.hidden) status.textContent = copyFor(getLang())[failed ? 'imageError' : 'imageLoading'];
  }

  function open(sourceTrigger) {
    const photo = sourceTrigger.querySelector('img');
    if (!photo || !photo.getAttribute('src') || photo.hidden || dialog.open) return;
    // A regular image link remains available if native dialogs are unsupported.
    if (typeof dialog.showModal !== 'function') {
      window.open(sourceTrigger.href, '_blank', 'noopener,noreferrer');
      return;
    }
    trigger = sourceTrigger;
    restoreFocus = true;
    scrollPosition = { x: scrollX, y: scrollY };
    overflow = document.documentElement.style.overflow;
    failed = false;
    image.hidden = true;
    status.hidden = false;
    status.textContent = copyFor(getLang()).imageLoading;
    stage.setAttribute('aria-busy', 'true');
    const current = ++request;
    image.onload = () => {
      if (current !== request || !dialog.open) return;
      image.hidden = false;
      status.hidden = true;
      stage.setAttribute('aria-busy', 'false');
    };
    image.onerror = () => {
      if (current !== request || !dialog.open) return;
      failed = true;
      image.hidden = true;
      status.hidden = false;
      status.textContent = copyFor(getLang()).imageError;
      stage.setAttribute('aria-busy', 'false');
    };
    document.querySelector('#preview-original').href = photo.src;
    dialog.showModal();
    document.documentElement.style.overflow = 'hidden';
    refresh();
    image.src = photo.src;
  }

  function close({ restoreFocus: shouldRestore = true } = {}) {
    if (!dialog.open) return;
    restoreFocus = shouldRestore;
    dialog.close();
  }
  document.querySelector('#preview-close').addEventListener('click', () => close());
  dialog.addEventListener('click', (event) => {
    if (event.target !== dialog) return;
    const box = dialog.getBoundingClientRect();
    if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) close();
  });
  // Chromium can pass the final Tab to BODY/browser chrome even in a native
  // modal. Keep this component's two controls in an explicit keyboard cycle.
  dialog.addEventListener('keydown', (event) => {
    if (event.key !== 'Tab') return;
    const first = document.querySelector('#preview-close');
    const last = document.querySelector('#preview-original');
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });
  dialog.addEventListener('close', () => {
    ++request; // Late load/error events cannot resurrect a closed preview.
    image.onload = null;
    image.onerror = null;
    image.removeAttribute('src');
    image.hidden = true;
    stage.setAttribute('aria-busy', 'false');
    document.documentElement.style.overflow = overflow;
    if (restoreFocus) {
      const target = trigger?.isConnected ? trigger : document.querySelector('[data-photo-preview]');
      target?.focus({ preventScroll: true });
      scrollTo(scrollPosition.x, scrollPosition.y);
    }
  });
  // Native dialog owns Escape and background inertness; the cycle above handles Tab edges.
  return { open, close, refresh, isOpen: () => dialog.open };
}
