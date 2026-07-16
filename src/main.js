// Rhine — Waves. Entry point.
import './styles.css';
import { heroHtml } from './data.js';
import { initOverlays, rebuildLetters } from './overlays.js';
import { initOcean } from './ocean.js';
import { initLangPicker, onLangChange } from './i18n.js';

function paintHero() {
  const hero = document.querySelector('.home-hero-text');
  if (hero) hero.innerHTML = heroHtml();
}

function boot() {
  // Language first — everything below renders through it.
  initLangPicker();

  paintHero();

  // Build letters + wire nav/lightbox/hash routing.
  initOverlays();

  // Boot the WebGL ocean + sky + day/night theme system (grabs #canvas, #theme-toggle).
  initOcean();

  // Switching language re-renders text only: the ocean never re-mounts.
  onLangChange(() => {
    paintHero();
    rebuildLetters();
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot);
} else {
  boot();
}
