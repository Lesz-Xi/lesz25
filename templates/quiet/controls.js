// Shared static and enhanced chrome; the ocean entry never imports this module.
import { LANGUAGES } from '../../src/i18n.js';
import { copyFor } from './copy.js';
import { escapeHtml } from './render.js';
import { DEV_SHORTCUTS } from './dev-labels.js';

const sun = '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" aria-hidden="true"><circle cx="12" cy="12" r="4" stroke="currentColor" stroke-width="1.4"/><path d="M12 2v3m0 14v3M2 12h3m14 0h3M5 5l2 2m10 10 2 2M5 19l2-2M17 7l2-2" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>';
const moon = '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" aria-hidden="true"><path d="M20 15.5A8.5 8.5 0 0 1 8.5 4 8.5 8.5 0 1 0 20 15.5Z" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/></svg>';

export function renderNavigation(locale) {
  const c = copyFor(locale);
  const links = [['about', c.about], ['work', c.work], ['photography', c.photography], ['research', c.research], ['notes', c.notesHeading], ['contact', c.contact]];
  return `<button type="button" id="quiet-menu" class="menu-control" aria-expanded="false" aria-controls="quiet-navigation" hidden><svg class="menu-icon" viewBox="0 0 18 18" width="18" height="18" fill="none" aria-hidden="true"><path d="M3 6h12M3 12h12" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/></svg><svg class="menu-close-icon" viewBox="0 0 18 18" width="18" height="18" fill="none" aria-hidden="true"><path d="m4 4 10 10M14 4 4 14" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/></svg><span data-menu-label>${escapeHtml(c.menu)}</span></button>
      <div id="quiet-navigation" class="navigation-panel">
        <nav class="section-nav" aria-label="Portfolio">${links.map(([id, label]) => `<a href="#${id}"><span class="bracket-label" data-copy="${id === 'notes' ? 'notesHeading' : id}">${escapeHtml(label)}</span></a>`).join('')}</nav>
        <div class="mobile-view" hidden><span data-copy="menuView">${escapeHtml(c.menuView)}</span></div>
      </div>`;
}

export function renderPreferences(locale, dev = false) {
  const c = copyFor(locale);
  return `<label class="language-control"><span class="sr-only" data-language-label>Language</span><select id="language" name="language" aria-label="Language">
    ${LANGUAGES.map(({ code, label, short }) => `<option value="${escapeHtml(code)}" lang="${escapeHtml(code)}">${escapeHtml(code === 'zh' || code === 'ja' ? label : short)}</option>`).join('')}
  </select></label>
${dev ? `<div class="mode-controls" role="group" aria-label="${escapeHtml(c.viewLabel)}"><button type="button" class="view-control" id="quiet-gui-control" aria-pressed="true" aria-controls="quiet-gui" aria-label="${escapeHtml(c.guiLabel)}"><span class="bracket-label">GUI</span></button><button type="button" class="view-control" id="quiet-mode" aria-pressed="false" aria-controls="quiet-dev" aria-label="${escapeHtml(c.devLabel)}"><span class="bracket-label">Dev Mode</span></button></div>` : ''}
  <button type="button" class="theme-control" id="quiet-theme" aria-pressed="false" aria-label="${escapeHtml(c.theme)}: ${escapeHtml(c.dark)}"><span class="theme-icon-light" aria-hidden="true">${sun}</span><span class="theme-icon-dark" aria-hidden="true">${moon}</span><span class="sr-only" data-theme-label>${escapeHtml(c.light)}</span></button>`;
}

export function renderDevMode(locale) {
  const c = copyFor(locale);
  return `<section id="quiet-dev" class="dev-surface" aria-labelledby="dev-title" hidden>
    <header class="dev-heading"><h1 id="dev-title">${escapeHtml(c.devTitle)}</h1><button type="button" class="text-control" data-dev-exit data-copy="devBack">${escapeHtml(c.devBack)}</button></header>
    <p class="dev-boundary" data-copy="devBoundary">${escapeHtml(c.devBoundary)}</p>
    <div class="dev-terminal">
      <p class="dev-intro" data-copy="devIntro">${escapeHtml(c.devIntro)}</p>
      <div class="dev-shortcuts" aria-label="${escapeHtml(c.devInput)}">${DEV_SHORTCUTS.map(({ command, label }) => `<button type="button" class="text-control dev-path" data-command="${escapeHtml(command)}" aria-label="${escapeHtml(`${label} (${command})`)}" title="${escapeHtml(command)}">${escapeHtml(label)}</button>`).join('')}</div>
      <div id="dev-output" class="dev-output" role="log" tabindex="0" aria-live="polite" aria-relevant="additions" aria-label="${escapeHtml(c.devResults)}"></div>
      <form id="dev-form" class="dev-form"><label for="dev-input" class="dev-prompt"><span aria-hidden="true">rhine /</span><span class="sr-only" data-copy="devInput">${escapeHtml(c.devInput)}</span></label><input id="dev-input" name="command" type="text" maxlength="256" autocomplete="off" autocapitalize="none" spellcheck="false" aria-describedby="dev-hint"><button type="submit" class="text-control" data-copy="devRun">${escapeHtml(c.devRun)}</button></form>
      <p id="dev-hint" class="dev-hint" data-copy="devHint">${escapeHtml(c.devHint)}</p>
    </div>
  </section>`;
}
