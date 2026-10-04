// A finite portfolio grammar, not a shell. Input never becomes code or a URL.
import { projects, research, albums } from '../../src/data.js';
import { t } from '../../src/i18n.js';
import { copyFor } from './copy.js';

export function catalogFor(locale) {
  const c = copyFor(locale);
  const projectIds = ['wuweism', 'twin-sparrow', '2041', 'odysxi', 'tsra'];
  const paperIds = ['hoegs', 'valence', 'masa', 'beyond-blame'];
  return [
    ...['work', 'research', 'photography', 'about', 'notes', 'contact'].map((id) => ({
      id, name: c[id === 'notes' ? 'notesHeading' : id], description: '', category: 'pages', kind: 'section', href: `#${id}`,
    })),
    { id: 'approach', name: c.approachHeading, description: c.purpose, category: 'pages', kind: 'page', href: '/templates/quiet/approach.html' },
    { id: 'note', name: 'What My Hands Knew First', description: c.noteLanguage, category: 'pages', kind: 'page', href: '/templates/quiet/notes.html', lang: 'en' },
    ...projects.map((project, index) => ({
      id: projectIds[index] || `project-${index + 1}`, name: project.name, description: c.projects[index], category: 'work', kind: 'source',
      href: project.url || '', status: project.statusKey ? t(project.statusKey) : '',
    })),
    ...research.filter(({ url }) => url).map((paper, index) => ({
      id: paperIds[index] || `paper-${index + 1}`, name: paper.name, description: c.papers[index], category: 'research', kind: 'source', href: paper.url, status: t(`res.${index}.kind`),
    })),
    ...albums.map((album) => ({
      id: album.id, name: t(`album.${album.id}.title`), description: `${t(`album.${album.id}.place`)} / ${album.year}`, category: 'albums', kind: 'album', href: `#album-${album.id}`,
    })),
  ];
}

const normalized = (text) => text.normalize('NFKC').toLocaleLowerCase().trim();

export function runCommand(raw, locale) {
  const c = copyFor(locale);
  if (typeof raw !== 'string' || raw.length > 256) return { kind: 'message', text: c.devUsage };
  const input = raw.trim();
  if (!input) return { kind: 'noop' };
  const match = input.match(/^(\S+)(?:\s+([\s\S]*))?$/);
  const verb = normalized(match[1]);
  const argument = (match[2] || '').trim();
  const key = normalized(argument);
  const records = catalogFor(locale);
  const result = (items) => items.length ? { kind: 'records', records: items } : { kind: 'message', text: c.devEmpty };
  if (verb === 'help' && !argument) return { kind: 'help', lines: c.devHelp };
  if (verb === 'clear' && !argument) return { kind: 'clear' };
  if (['exit', 'gui'].includes(verb) && !argument) return { kind: 'exit' };
  if (verb === 'theme') return ['light', 'dark'].includes(key) ? { kind: 'theme', theme: key } : { kind: 'message', text: c.devUsage };
  if (verb === 'ls') {
    if (!argument) return result(records);
    if (!['work', 'research', 'albums'].includes(key)) return { kind: 'message', text: c.devUsage };
    return result(records.filter(({ category }) => category === key));
  }
  if (verb === 'find' && argument) return result(records.filter((record) => normalized(`${record.id} ${record.name} ${record.description} ${record.status || ''}`).includes(key)));
  if (verb === 'open' && argument) {
    const target = key.replace(/^"(.*)"$|^'(.*)'$/, (_, double, single) => double ?? single);
    const record = records.find(({ id, name }) => target === normalized(id) || target === normalized(name));
    if (!record) return { kind: 'message', text: c.devEmpty };
    // External sources stay explicit links, never popups or automatic navigation.
    if (record.kind === 'source') return result([record]);
    return { kind: 'navigate', record };
  }
  return { kind: 'message', text: ['ls', 'find', 'open'].includes(verb) ? c.devUsage : c.devUnknown };
}
