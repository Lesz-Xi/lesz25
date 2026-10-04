import { defineConfig } from 'vite';
import { fileURLToPath } from 'node:url';

// Quiet is the homepage; preserve its template alias, readers and the ocean edition.
export default defineConfig({
  root: '.',
  server: { open: false },
  build: {
    target: 'es2020',
    outDir: 'dist',
    rollupOptions: {
      input: {
        home: fileURLToPath(new URL('./index.html', import.meta.url)),
        ocean: fileURLToPath(new URL('./templates/ocean/index.html', import.meta.url)),
        quiet: fileURLToPath(new URL('./templates/quiet/index.html', import.meta.url)),
        quietNotes: fileURLToPath(new URL('./templates/quiet/notes.html', import.meta.url)),
        quietApproach: fileURLToPath(new URL('./templates/quiet/approach.html', import.meta.url)),
      },
    },
  },
});
