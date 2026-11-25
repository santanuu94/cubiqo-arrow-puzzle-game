# CUBIQO: ARROW ESCAPE — Phase 3 Plan (Save System, Performance & Technical Readiness)

**Date:** 2026-11-25  
**Methodology:** GSD (inspect → checkpoint → task-by-task implementation → verify each task)

## Tasks
1. **P3-1 — Save System Hardening & Cloud-Save Readiness (`js/storage.js`, `js/platform.js`):**
   - Strict schema sanitization inside `migrate(raw)` and `DailyStore.get()` for corrupted/out-of-range/malformed data.
   - Expose `saveCloud()` / `loadCloud()` on `Cubiqo.Platform` and add `Storage.exportSave()` / `Storage.importSave(raw)` (non-destructive merge for future cloud sync).
   - Track `Storage.isPersistent()` so restricted/read-only storage is handled gracefully.
2. **P3-2 — Performance Optimization (`js/levels.js`, `js/ui.js`, `js/audio.js`, `css/style.css`):**
   - Lazy-expand `Cubiqo.Levels.LIST` on demand instead of allocating all 100 expanded boards at startup.
   - Clean up `.particle` nodes after completion animation; disconnect WebAudio pad nodes on `onended`.
   - Reduce artificial loading screen delay (`renderLoading`) for faster startup.
   - Add CSS `contain: layout style` on `.puzzle-board`/`.cell` and `will-change` only on exiting tiles.
3. **P3-3 — Responsiveness, Compatibility & Error Handling (`css/style.css`, `js/app.js`, `js/ui.js`):**
   - Add `100dvh` viewport height support and `-webkit-backdrop-filter` for mobile Safari/Chrome.
   - Add friendly global error fallback in `js/app.js` and safe fallback if `startMainLevel(id)` receives an invalid level ID.
   - Show subtle session-only notice when `localStorage` is unavailable.
4. **P3-4 — Final Technical QA & Benchmarks (`tests/run.mjs`, `tests/browser.mjs`):**
   - Unit tests for corrupted saves, out-of-range fields, `exportSave`/`importSave` merge, `Platform.saveCloud`/`loadCloud`, and `DailyStore` sanitization.
   - Playwright E2E tests for multi-session reload persistence, `visibilitychange` auto-pause, dynamic viewport resize, and load-time/bundle measurement.
