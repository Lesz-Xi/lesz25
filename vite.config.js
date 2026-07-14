import { defineConfig } from 'vite';

// Vanilla, single-page. No framework. Static assets live in /public.
export default defineConfig({
  root: '.',
  server: { open: false },
  build: {
    target: 'es2020',
    outDir: 'dist',
  },
});
