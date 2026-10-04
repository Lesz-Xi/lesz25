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
  let closing = false;
  let closeTimer = null;
  let sessionOpen = false;
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');

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
    if (!photo || !photo.getAttribute('src') || photo.hidden || dialog.open || sourceTrigger.getAttribute('aria-disabled') === 'true') return;
    // A regular image link remains available if native dialogs are unsupported.
    if (typeof dialog.showModal !== 'function') {
      window.open(sourceTrigger.href, '_blank', 'noopener,noreferrer');
      return;
    }
    trigger = sourceTrigger;
    restoreFocus = true;
    sessionOpen = true;
    closing = false;
    clearTimeout(closeTimer);
    closeTimer = null;
    dialog.classList.remove('is-closing');
    scrollPosition = { x: scrollX, y: scrollY };
    overflow = document.documentElement.style.overflow;
    failed = false;
    image.hidden = true;
    status.hidden = false;
    status.textContent = copyFor(getLang()).imageLoading;
    stage.setAttribute('aria-busy', 'true');
    const current = ++request;
    image.onload = () => {
      if (current !== request || !dialog.open || closing) return;
      image.hidden = false;
      status.hidden = true;
      stage.setAttribute('aria-busy', 'false');
    };
    image.onerror = () => {
      if (current !== request || !dialog.open || closing) return;
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

  function finishClose() {
    clearTimeout(closeTimer);
    closeTimer = null;
    // Restore the document before native focus returns; finish within one task
    // rather than leaving scroll-lock cleanup to a later close event.
    document.documentElement.style.overflow = overflow;
    dialog.close();
    cleanup();
  }
  function close({ restoreFocus: shouldRestore = true } = {}) {
    if (!dialog.open) return;
    restoreFocus = shouldRestore;
    if (!shouldRestore || reducedMotion.matches) { finishClose(); return; }
    if (closing) return;
    closing = true;
    dialog.classList.add('is-closing');
    // Fallback covers missing animationend, background tabs and interrupted CSS.
    closeTimer = setTimeout(finishClose, 160);
  }
  dialog.addEventListener('animationend', (event) => {
    if (closing && event.target === dialog && event.animationName === 'quiet-preview-exit') finishClose();
  });
  dialog.addEventListener('cancel', (event) => { event.preventDefault(); close(); });
  reducedMotion.addEventListener('change', () => { if (closing && reducedMotion.matches) finishClose(); });
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
  function cleanup() {
    if (!sessionOpen) return;
    sessionOpen = false;
    closing = false;
    clearTimeout(closeTimer);
    closeTimer = null;
    dialog.classList.remove('is-closing');
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
      if (scrollX !== scrollPosition.x || scrollY !== scrollPosition.y) scrollTo(scrollPosition.x, scrollPosition.y);
    }
  }
  // A queued native close event must not clean up a newly reopened preview.
  dialog.addEventListener('close', () => { if (!dialog.open) cleanup(); });
  // Native dialog owns Escape and background inertness; the cycle above handles Tab edges.
  return { open, close, refresh, isOpen: () => dialog.open };
}
