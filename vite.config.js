import { defineConfig } from 'vite';

/**
 * CUBIQO: ARROW ESCAPE — build configuration.
 *
 * `base: './'` keeps every emitted asset reference relative, so the built
 * `dist/` folder can be dropped into any static host or gaming portal
 * (Poki, CrazyGames, GameDistribution) without path rewriting.
 */
export default defineConfig({
  base: './',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    target: 'es2019',
    sourcemap: false,
    chunkSizeWarningLimit: 800,
    rollupOptions: {
      output: {
        // Keep the classic IIFE script graph as one predictable bundle.
        format: 'iife',
        inlineDynamicImports: true,
        entryFileNames: 'assets/cubiqo.[hash].js',
        assetFileNames: 'assets/[name].[hash][extname]'
      }
    }
  },
  server: {
    host: true,
    port: 5201,
    strictPort: false,
    open: true,
    headers: {
      'Cache-Control': 'no-store, no-cache, must-revalidate'
    }
  },
  preview: {
    host: true,
    port: 4173
  }
});
