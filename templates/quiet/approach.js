// Unlike the English-authored essay, the approach uses the shared translations.
import { getLang, onLangChange } from '../../src/i18n.js';
import { copyFor } from './copy.js';
import { renderApproach } from './render.js';
import { initPreferences } from './preferences.js';

const { refresh } = initPreferences();
function paint() {
  const locale = getLang();
  const c = copyFor(locale);
  document.querySelector('#main').innerHTML = renderApproach(locale);
  document.title = `${c.approachHeading} — Rhine Tague`;
  document.querySelector('meta[property="og:title"]').content = document.title;
  document.querySelector('meta[name="description"]').content = c.purpose;
  document.querySelector('meta[property="og:description"]').content = c.purpose;
  refresh();
}
onLangChange(paint);
paint();
