import { defineConfig } from 'vite';

export default defineConfig({
  // Use relative base so game works in any portal subdirectory, iframe, or static host
  base: './',
  build: {
    target: 'es2020',
    assetsInlineLimit: 4096,
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
  },
  server: {
    port: 5173,
    host: true,
  },
});
