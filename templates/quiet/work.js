// Quiet's GUI and command view share one work list. Ocean keeps its original records.
import { projects } from '../../src/data.js';
import { copyFor } from './copy.js';

const PROJECT_IDS = ['wuweism', 'twin-sparrow', '2041', 'odysxi', 'tsra'];
// Chief's explicit portfolio order, not an inferred release-date ranking.
const FEATURED_ORDER = Object.freeze([
  'groundwork', 'odysxi', 'twin-sparrow', '2041', 'relics', 'wuweism', 'tsra', 'thesislens',
]);
const FEATURED_PRIORITY = new Map(FEATURED_ORDER.map((id, index) => [id, index]));

export function workFor(locale) {
  const c = copyFor(locale);
  const original = projects.map((project, index) => ({
    ...project, id: PROJECT_IDS[index] || `project-${index + 1}`, description: c.projects[index],
  }));
  const relics = {
    // Relics' DESIGN-Hera-Doctrine.md names ex-formation as its core method.
    id: 'relics', name: 'Relics', principle: 'Ex-formation', description: c.relicsBody,
    url: 'https://relics.quest/#top', statusKey: '',
  };
  const thesislens = {
    // Public site presents drafting, revision and writing-process records;
    // its authorship-proof claims are not independently validated here.
    id: 'thesislens', name: 'ThesisLens', principle: c.thesislensKind, description: c.thesislensBody,
    url: 'https://thesislens.space/', statusKey: '',
  };
  const groundwork = {
    // Public guide describes source-linked explanations, method distinctions and templates.
    id: 'groundwork', name: 'Groundwork', principle: c.groundworkKind, description: c.groundworkBody,
    url: 'https://groundwork-six-ruddy.vercel.app/#top', statusKey: '',
  };
  // Sort a new array, never the shared ocean records. Unranked future work stays present at the end.
  return [...original, relics, thesislens, groundwork].sort((a, b) =>
    (FEATURED_PRIORITY.get(a.id) ?? FEATURED_ORDER.length)
      - (FEATURED_PRIORITY.get(b.id) ?? FEATURED_ORDER.length));
}
