// One native dialog, independent of the album's hash/index and language re-render.
import { getLang, t } from '../../src/i18n.js';
import { copyFor } from './copy.js';

export function initPhotoPreview({ navigate }) {
  const dialog = document.querySelector('#photo-preview');
  const image = document.querySelector('#preview-image');
  const dismiss = document.querySelector('#preview-dismiss');
  const original = document.querySelector('#preview-original');
  const stage = document.querySelector('.lightbox-stage');
  const status = document.querySelector('#preview-status');
  let trigger = null;
  let scrollPosition = { x: 0, y: 0 };
  let overflow = '';
  let request = 0;
  let failed = false;
  let needsSync = false;
  let restoreFocus = true;
  let closing = false;
  let closeTimer = null;
  let sessionOpen = false;
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');

  function loadPhoto(photo) {
    failed = false;
    needsSync = false;
    status.hidden = false;
    status.textContent = copyFor(getLang()).imageLoading;
    stage.setAttribute('aria-busy', 'true');
    image.alt = photo.alt;
    original.href = photo.src;
    original.hidden = false;
    const current = ++request;
    image.onload = () => {
      if (current !== request || !dialog.open || closing) return;
      image.hidden = false;
      dismiss.hidden = false;
      status.hidden = true;
      stage.setAttribute('aria-busy', 'false');
    };
    image.onerror = () => {
      if (current !== request || !dialog.open || closing) return;
      failed = true;
      const lostFocus = document.activeElement === dismiss;
      image.hidden = true;
      dismiss.hidden = true;
      if (lostFocus) dialog.querySelector('[data-preview-next]').focus({ preventScroll: true });
      status.hidden = false;
      status.textContent = copyFor(getLang()).imageError;
      stage.setAttribute('aria-busy', 'false');
    };
    image.src = photo.src;
  }

  function refresh() {
    if (!dialog.open || closing) return;
    const photo = document.querySelector('#album-image');
    const c = copyFor(getLang());
    document.querySelector('#preview-title').textContent = document.querySelector('#album-heading').textContent;
    document.querySelector('#preview-count').textContent = document.querySelector('#photo-count').textContent;
    dismiss.setAttribute('aria-label', t('ui.close'));
    dismiss.title = t('ui.close');
    dialog.querySelector('[data-preview-prev]').setAttribute('aria-label', t('ui.prev'));
    dialog.querySelector('[data-preview-next]').setAttribute('aria-label', t('ui.next'));
    const pending = document.querySelector('.viewer-stage').getAttribute('aria-busy') === 'true';
    if (pending || photo.hidden) {
      ++request;
      image.onload = null;
      image.onerror = null;
      needsSync = true;
      failed = !pending;
      status.hidden = false;
      status.textContent = c[failed ? 'imageError' : 'imageLoading'];
      stage.setAttribute('aria-busy', String(pending));
      if (failed) {
        const lostFocus = document.activeElement === dismiss || document.activeElement === original;
        image.hidden = true;
        dismiss.hidden = true;
        original.hidden = true;
        if (lostFocus) dialog.querySelector('[data-preview-next]').focus({ preventScroll: true });
      }
      return;
    }
    if (needsSync || image.getAttribute('src') !== photo.src) loadPhoto(photo);
    else { image.alt = photo.alt; if (!status.hidden) status.textContent = c[failed ? 'imageError' : 'imageLoading']; }
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
    needsSync = true;
    clearTimeout(closeTimer);
    closeTimer = null;
    dialog.classList.remove('is-closing');
    scrollPosition = { x: scrollX, y: scrollY };
    overflow = document.documentElement.style.overflow;
    image.hidden = true;
    dismiss.hidden = true;
    dialog.showModal();
    document.documentElement.style.overflow = 'hidden';
    refresh();
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
  dismiss.addEventListener('click', () => close());
  function step(offset) { if (dialog.open && !closing) navigate(offset); }
  dialog.querySelector('[data-preview-prev]').addEventListener('click', () => step(-1));
  dialog.querySelector('[data-preview-next]').addEventListener('click', () => step(1));
  dialog.addEventListener('click', (event) => {
    if (event.target !== dialog) return;
    const box = dialog.getBoundingClientRect();
    if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) close();
  });
  // Keep only visible controls in the native modal's explicit keyboard cycle.
  dialog.addEventListener('keydown', (event) => {
    if (!event.altKey && !event.ctrlKey && !event.metaKey && !event.isComposing && (event.key === 'ArrowLeft' || event.key === 'ArrowRight')) {
      event.preventDefault();
      step(event.key === 'ArrowRight' ? 1 : -1);
      return;
    }
    if (event.key !== 'Tab') return;
    const controls = [...dialog.querySelectorAll('button:not([disabled]), a[href]')].filter(control => control.getClientRects().length);
    const first = controls[0];
    const last = controls[controls.length - 1];
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
    dismiss.hidden = true;
    stage.setAttribute('aria-busy', 'false');
    document.documentElement.style.overflow = overflow;
    if (restoreFocus) {
      const candidate = trigger?.isConnected ? trigger : document.querySelector('[data-photo-preview]');
      const target = candidate?.getClientRects().length ? candidate : document.querySelector('[data-photo-next]');
      target?.focus({ preventScroll: true });
      if (scrollX !== scrollPosition.x || scrollY !== scrollPosition.y) scrollTo(scrollPosition.x, scrollPosition.y);
    }
  }
  // A queued native close event must not clean up a newly reopened preview.
  dialog.addEventListener('close', () => { if (!dialog.open) cleanup(); });
  // Native dialog owns Escape and background inertness; the cycle above handles Tab edges.
  return { open, close, refresh, isOpen: () => dialog.open };
}
