// Shared static and enhanced chrome; the ocean entry never imports this module.
import { LANGUAGES } from '../../src/i18n.js';
import { copyFor } from './copy.js';
import { escapeHtml } from './render.js';
import { DEV_SHORTCUTS } from './dev-labels.js';

// Phosphor Light "sun-horizon" (MIT, @phosphor-icons/core 2.1.1), redrawn in parts for
// XI Pro Motion Lab so the sun can set: one sun group clipped at the horizon.
const sunHorizon = '<svg viewBox="0 0 256 256" width="20" height="20" fill="none" stroke="currentColor" stroke-width="12" stroke-linecap="round" aria-hidden="true" focusable="false"><defs><clipPath id="quiet-theme-sky"><rect width="256" height="156"/></clipPath></defs><g clip-path="url(#quiet-theme-sky)"><g class="theme-sun"><circle cx="128" cy="144" r="64"/><g class="theme-rays"><path d="M80,40l8,16"/><path d="M24,96l16,8"/><path d="M232,96l-16,8"/><path d="M176,40l-8,16"/></g></g></g><path d="M16,160H240"/><path d="M48,200H208"/></svg>';

export function renderNavigation(locale) {
  const c = copyFor(locale);
  const links = [['about', c.about], ['work', c.work], ['photography', c.photography], ['research', c.research], ['notes', c.notesHeading], ['contact', c.contact]];
  return `<button type="button" id="quiet-menu" class="menu-control" aria-expanded="false" aria-controls="quiet-navigation" hidden><svg class="menu-icon" viewBox="0 0 18 18" width="18" height="18" fill="none" aria-hidden="true"><path d="M3 6h12M3 12h12" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/></svg><svg class="menu-close-icon" viewBox="0 0 18 18" width="18" height="18" fill="none" aria-hidden="true"><path d="m4 4 10 10M14 4 4 14" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/></svg><span data-menu-label>${escapeHtml(c.menu)}</span></button>
      <div id="quiet-navigation" class="navigation-panel">
        <nav class="section-nav" aria-label="Portfolio">${links.map(([id, label]) => `<a href="#${id}"><span class="link-label" data-copy="${id === 'notes' ? 'notesHeading' : id}">${escapeHtml(label)}</span></a>`).join('')}</nav>
        <div class="mobile-view" hidden><span data-copy="menuView">${escapeHtml(c.menuView)}</span></div>
      </div>`;
}

export function renderPreferences(locale, dev = false) {
  const c = copyFor(locale);
  return `<label class="language-control"><span class="sr-only" data-language-label>Language</span><select id="language" name="language" aria-label="Language">
    ${LANGUAGES.map(({ code, label, short }) => `<option value="${escapeHtml(code)}" lang="${escapeHtml(code)}">${escapeHtml(code === 'zh' || code === 'ja' ? label : short)}</option>`).join('')}
  </select></label>
${dev ? `<div class="mode-controls" role="group" aria-label="${escapeHtml(c.viewLabel)}"><button type="button" class="view-control" id="quiet-gui-control" aria-pressed="true" aria-controls="quiet-gui" aria-label="${escapeHtml(c.guiLabel)}"><span class="bracket-label link-label">GUI</span></button><button type="button" class="view-control" id="quiet-mode" aria-pressed="false" aria-controls="quiet-dev" aria-label="${escapeHtml(c.devLabel)}"><span class="bracket-label link-label">Dev Mode</span></button></div>` : ''}
  <button type="button" class="theme-control" id="quiet-theme" aria-pressed="false" aria-label="${escapeHtml(c.theme)}: ${escapeHtml(c.dark)}"><span class="theme-icon" aria-hidden="true">${sunHorizon}</span><span class="sr-only" data-theme-label>${escapeHtml(c.light)}</span></button>`;
}

export function renderDevMode(locale) {
  const c = copyFor(locale);
  return `<section id="quiet-dev" class="dev-surface" aria-labelledby="dev-title" hidden>
    <header class="dev-heading"><h1 id="dev-title">${escapeHtml(c.devTitle)}</h1><button type="button" class="text-control hairline-control" data-dev-exit data-copy="devBack">${escapeHtml(c.devBack)}</button></header>
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
