// Shared by the Quiet portfolio and reading pages. Never writes the ocean theme.
import { LANGUAGES, getLang, setLang, onLangChange, applyLang, t } from '../../src/i18n.js';
import { copyFor } from './copy.js';

export function initPreferences() {
  const root = document.documentElement;
  const language = document.querySelector('#language');
  const themeButton = document.querySelector('#quiet-theme');
  const systemTheme = matchMedia('(prefers-color-scheme: dark)');
  const themeKey = 'rhine-quiet-theme';
  let explicitTheme = null;
  try {
    const saved = localStorage.getItem(themeKey);
    if (saved === 'light' || saved === 'dark') explicitTheme = saved;
  } catch { /* A blocked store must not prevent controls from working. */ }

  function refresh() {
    const locale = getLang();
    const c = copyFor(locale);
    const theme = explicitTheme || (systemTheme.matches ? 'dark' : 'light');
    root.dataset.theme = theme;
    themeButton.querySelector('[data-theme-label]').textContent = c[theme];
    themeButton.setAttribute('aria-label', `${c.theme}: ${c.dark}`);
    themeButton.setAttribute('aria-pressed', String(theme === 'dark'));
    themeButton.title = `${c.theme}: ${c[theme === 'dark' ? 'light' : 'dark']}`;
    language.value = locale;
    language.setAttribute('aria-label', t('ui.language'));
    document.querySelector('[data-language-label]').textContent = t('ui.language');
    document.querySelectorAll('[data-copy]').forEach((element) => {
      element.textContent = c[element.dataset.copy];
      element.lang = locale;
    });
    applyLang();
  }

  function setTheme(theme) {
    if (theme !== 'light' && theme !== 'dark') return;
    explicitTheme = theme;
    try { localStorage.setItem(themeKey, explicitTheme); } catch { /* Use the choice for this visit. */ }
    refresh();
  }
  themeButton.addEventListener('click', () => setTheme(root.dataset.theme === 'dark' ? 'light' : 'dark'));
  systemTheme.addEventListener('change', () => { if (!explicitTheme) refresh(); });
  function restorePreferences() {
    try {
      const saved = localStorage.getItem(themeKey);
      explicitTheme = saved === 'light' || saved === 'dark' ? saved : null;
      const savedLanguage = localStorage.getItem('rhine-lang');
      if (savedLanguage !== getLang() && LANGUAGES.some(({ code }) => code === savedLanguage)) setLang(savedLanguage);
    } catch { /* Keep this visit's explicit choice when storage is unavailable. */ }
    refresh();
  }
  window.addEventListener('storage', (event) => {
    if (event.key !== themeKey && event.key !== 'rhine-lang' && event.key !== null) return;
    try { if (event.storageArea !== localStorage) return; } catch { return; }
    restorePreferences();
  });
  // Restore preferences after native browser Back, including a cached document.
  window.addEventListener('pageshow', restorePreferences);
  language.addEventListener('change', () => setLang(language.value));
  onLangChange(refresh);
  refresh();
  document.querySelector('.preferences').hidden = false;
  return { refresh, setTheme };
}
