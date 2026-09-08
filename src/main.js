// Rhine — Waves. Entry point.
import './styles.css';
import { heroHtml } from './data.js';
import { initOverlays, rebuildLetters } from './overlays.js';
import { initOcean } from './ocean.js';
import { initLangPicker, onLangChange } from './i18n.js';

function initHeroStar(hero) {
  const link = hero.querySelector('.home-hero-link');
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (!link || !finePointer.matches || reduceMotion.matches) return;

  const moveStarToLetter = (letter) => {
    link.style.setProperty('--hero-star-x', `${letter.offsetLeft + letter.offsetWidth / 2}px`);
  };

  link.addEventListener('pointerover', (event) => {
    const target = event.target;
    if (!(target instanceof Element)) return;
    const letter = target.closest('.home-hero-letter');
    if (letter instanceof HTMLElement) moveStarToLetter(letter);
  });

  link.addEventListener('pointerleave', () => {
    link.style.removeProperty('--hero-star-x');
  });
}

function paintHero() {
  const hero = document.querySelector('.home-hero-text');
  if (!hero) return;
  hero.innerHTML = heroHtml();
  initHeroStar(hero);
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
