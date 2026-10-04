// Display labels only. The finite command grammar and destinations stay separate.
export function devPathLabel(id, qualifier = '') {
  return `~/${id}${qualifier ? ` --${qualifier}` : ''}`;
}

export const DEV_SHORTCUTS = Object.freeze([
  Object.freeze({ command: 'help', label: devPathLabel('help') }),
  ...['work', 'research', 'albums'].map(category => Object.freeze({
    command: `ls ${category}`, label: devPathLabel('ls', category),
  })),
]);
