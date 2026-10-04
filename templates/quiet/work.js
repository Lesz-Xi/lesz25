// Quiet's GUI and command view share one work list. Ocean keeps its original records.
import { projects } from '../../src/data.js';
import { copyFor } from './copy.js';

const PROJECT_IDS = ['wuweism', 'twin-sparrow', '2041', 'odysxi', 'tsra'];

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
  // Keep the template beside the two projects it presents, without changing shared data.
  return [...original.slice(0, 3), relics, ...original.slice(3)];
}
