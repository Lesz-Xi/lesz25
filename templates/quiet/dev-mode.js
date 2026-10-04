// Alternate view over the same portfolio. No shell, network API, or arbitrary URL execution.
import { getLang, onLangChange } from '../../src/i18n.js';
import { copyFor } from './copy.js';
import { runCommand } from './commands.js';

export function initDevMode({ navigate, beforeEnter, setTheme }) {
  const gui = document.querySelector('#quiet-gui');
  const dev = document.querySelector('#quiet-dev');
  const mode = document.querySelector('#quiet-mode');
  const guiControl = document.querySelector('#quiet-gui-control');
  const modeControls = document.querySelector('.mode-controls');
  const input = document.querySelector('#dev-input');
  const output = document.querySelector('#dev-output');
  let active = false;
  let guiScroll = 0;
  let guiFocus = null;
  let entries = [];
  const history = [];
  let historyIndex = 0;
  let draft = '';

  function setMode(next, { restore = true } = {}) {
    if (active === next) return;
    if (next) {
      guiScroll = window.scrollY;
      guiFocus = gui.contains(document.activeElement) ? document.activeElement : mode;
      beforeEnter();
    }
    active = next;
    gui.hidden = next;
    dev.hidden = !next;
    mode.setAttribute('aria-pressed', String(next));
    guiControl.setAttribute('aria-pressed', String(!next));
    if (next) {
      window.scrollTo({ top: 0, behavior: 'instant' });
      input.focus({ preventScroll: true });
    } else if (restore) {
      const target = guiFocus?.isConnected && guiFocus.getClientRects().length ? guiFocus
        : mode.getClientRects().length ? mode : document.querySelector('#quiet-menu');
      target.focus({ preventScroll: true });
      window.scrollTo({ top: guiScroll, behavior: 'instant' });
    }
  }

  function addText(parent, tag, value, className = '') {
    const node = document.createElement(tag);
    node.textContent = value;
    if (className) node.className = className;
    parent.append(node);
    return node;
  }

  function paintEntry(command) {
    const c = copyFor(getLang());
    const result = runCommand(command, getLang());
    const entry = document.createElement('div');
    entry.className = 'dev-entry';
    addText(entry, 'p', `rhine / ${command}`, 'dev-command');
    if (result.kind === 'help') {
      const list = document.createElement('ul');
      result.lines.forEach((line) => addText(list, 'li', line));
      entry.append(list);
    } else if (result.kind === 'message') {
      addText(entry, 'p', result.text);
    } else if (result.kind === 'theme') {
      addText(entry, 'p', `${c.theme}: ${c[result.theme]}`);
    } else if (result.kind === 'records' || result.kind === 'navigate') {
      const list = document.createElement('ul');
      list.className = 'dev-records';
      for (const record of result.kind === 'records' ? result.records : [result.record]) {
        const row = document.createElement('li');
        addText(row, 'span', record.id, 'dev-id');
        const body = document.createElement('div');
        const name = addText(body, record.href ? 'a' : 'span', record.name, 'dev-record-name');
        if (record.lang) name.lang = record.lang;
        if (record.href) {
          name.href = record.href;
          name.dataset.portfolioTarget = record.kind;
          if (record.kind === 'source') { name.target = '_blank'; name.rel = 'noopener noreferrer'; }
        }
        if (record.status) addText(body, 'span', record.status, 'dev-record-status');
        if (record.description) addText(body, 'p', record.description, 'dev-record-description');
        if (!record.href) addText(body, 'p', c.devUnavailable, 'dev-record-description');
        row.append(body);
        list.append(row);
      }
      entry.append(list);
    }
    output.append(entry);
  }

  function run(raw) {
    const command = raw.trim().slice(0, 256);
    const result = runCommand(command, getLang());
    if (result.kind === 'noop') return;
    history.push(command);
    if (history.length > 50) history.shift();
    historyIndex = history.length;
    draft = '';
    input.value = '';
    if (result.kind === 'clear') { entries = []; output.replaceChildren(); }
    else if (result.kind === 'exit') { setMode(false); return; }
    else {
      entries.push(command);
      if (entries.length > 30) entries.shift();
      output.replaceChildren();
      entries.forEach(paintEntry);
      if (result.kind === 'theme') setTheme(result.theme);
      if (result.kind === 'navigate') {
        setMode(false, { restore: false });
        navigate(result.record.href);
        return;
      }
    }
    output.scrollTop = output.scrollHeight;
    input.focus({ preventScroll: true });
    input.scrollIntoView({ block: 'nearest', behavior: 'instant' });
  }

  mode.addEventListener('click', () => { setMode(true); input.focus({ preventScroll: true }); });
  guiControl.addEventListener('click', () => {
    setMode(false);
    guiControl.focus({ preventScroll: true });
  });
  document.querySelector('#dev-form').addEventListener('submit', (event) => { event.preventDefault(); run(input.value); });
  dev.addEventListener('click', (event) => {
    if (!(event.target instanceof Element)) return;
    const button = event.target.closest('[data-command]');
    if (button) run(button.dataset.command);
    if (event.target.closest('[data-dev-exit]')) setMode(false);
    const link = event.target.closest('a[data-portfolio-target]');
    if (!link || link.dataset.portfolioTarget === 'source' || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || event.button !== 0) return;
    event.preventDefault();
    setMode(false, { restore: false });
    navigate(link.getAttribute('href'));
  });
  input.addEventListener('keydown', (event) => {
    if (event.isComposing || !['ArrowUp', 'ArrowDown'].includes(event.key)) return;
    event.preventDefault();
    if (historyIndex === history.length) draft = input.value;
    historyIndex = Math.min(history.length, Math.max(0, historyIndex + (event.key === 'ArrowUp' ? -1 : 1)));
    input.value = historyIndex === history.length ? draft : history[historyIndex];
    input.setSelectionRange(input.value.length, input.value.length);
  });
  document.addEventListener('keydown', (event) => {
    if (active && event.key === 'Escape' && !event.isComposing) { event.preventDefault(); setMode(false); }
  });
  function refreshMode() {
    const c = copyFor(getLang());
    mode.setAttribute('aria-label', c.devLabel);
    mode.title = c.devLabel;
    guiControl.setAttribute('aria-label', c.guiLabel);
    guiControl.title = c.guiLabel;
    modeControls.setAttribute('aria-label', c.viewLabel);
    output.setAttribute('aria-label', c.devResults);
    dev.querySelector('.dev-shortcuts').setAttribute('aria-label', c.devInput);
    output.replaceChildren();
    entries.forEach(paintEntry); // Repaint text only; never repeat navigation or theme effects.
  }
  onLangChange(refreshMode);
  refreshMode();
  return { exit: (options) => setMode(false, options), isActive: () => active };
}
