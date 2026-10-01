import { defineConfig } from 'vite';

export default defineConfig({
  base: '/',
  publicDir: 'public_html',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
});