# CUBIQO: ARROW ESCAPE — Phase 1 Audit Report & Roadmap

**Audit Date:** 2026-11-25  
**Scope:** Full inspection of all 8 areas across `index.html`, `css/style.css`, `js/*.js`, `tools/*.mjs`, `tests/*.mjs`, `vite.config.js`, `PRD.txt`, and `PROGRESS.md`.

---

## 1. Inspection Summary by Area

| # | Area | Status | Key Findings |
|---|------|--------|--------------|
| 1 | Screens, UI & Navigation | Needs Fixes | Uncancelled `setTimeout` race conditions in `finishLevel()`, `handleArrowTap()`, and `renderLevelComplete()`; unused `Utils.Screens`. |
| 2 | Arrow Logic & Collision | Solid / Tuning | `puzzle.js` collision & greedy-peel logic are sound; board-wide `340ms` `state.animating` lock delays rapid sequential taps of clear arrows. |
| 3 | 100 Levels & Progression | Needs Tuning | 100/100 levels pass solvability & size progression (`3→4→5→6→7`), **but** `stars` thresholds conflict with the 3-heart rule (max 2 survivable mistakes makes 1★ unreachable in 100/100 levels and 2★ unreachable in levels 1–10). |
| 4 | 3-Heart Lifeline System | Mostly Working | Deduction, Game Over modal, and Replay work; lacks `level_failed` analytics, double-fires `playBlocked()` on 3rd error, needs modal entrance animation. |
| 5 | Hint & Interactive Buttons | Needs Guards | `triggerHint()` async callback lacks screen/state guard after navigation; keyboard `Esc`/`R`/`H` and Tab focus leak behind modals / completion delay. |
| 6 | Completion, Stars & Save | Needs Fixes | `DailyStore` lacks in-memory fallback when `localStorage` is restricted; `Storage.markAchievement()` unused; `validateLevel` misses `s.two <= s.one`. |
| 7 | Responsive Layouts | Broken on Small/Landscape | Playwright measured `#btnHint` clipping off-screen on `320×568` (`hintClipped: true`) and tiny `23px` tiles on `667×375` mobile landscape. |
| 8 | Performance & Compatibility | Needs Guard | `index.html` deletes all `window.caches` unconditionally (unsafe on portals); `assets/fonts/` empty; `Audio.stopMusic()` ramp lacks anchor. |

---

## 2. Prioritized Issues

### Critical Priority
- **C1 — Async Timer Race Conditions (`js/ui.js`):**
  - `finishLevel()` schedules `setTimeout(..., 620)` without storing/cancelling the timer ID. Restarting (`R` / `#btnRestart`) during the completion delay causes the stale timer to yank the user to `levelComplete` mid-restart.
  - `handleArrowTap()` schedules `setTimeout(..., 340)` without a board run-ID guard or cancellation on restart/navigation, risking stale `state.animating = false` or `finishLevel()` calls on a new board.
  - `renderLevelComplete()` star/milestone audio timers continue firing if the player quickly clicks Next Level or Home.

### High Priority
- **H1 — Star Thresholds Incompatible with 3-Heart Lifeline System (`js/level-generator.js`, `js/levels.js`, `js/puzzle.js`):**
  - Because the 3rd mistake triggers Game Over, every completed level uses between `N` (`0` mistakes) and `N + 2` (`2` mistakes) moves.
  - Currently `stars.three` is `N + 2` on levels 1–10 (always 3★) and `stars.one` is `N + 40%..95%` on all 100 levels (1★ is mathematically impossible).
  - Fix: Align star targets cleanly with the 3-heart rule (`3★ = N` or `0` mistakes, `2★ = N + 1` or `1` mistake, `1★ = N + 2` or `2` mistakes — and fix `validateLevel` to check `s.two <= s.one`).
- **H2 — Mobile `320px` HUD Clipping & Landscape Board Compression (`css/style.css`):**
  - On `320×568`, `.hud-row` overflows horizontally and clips `#btnHint`.
  - On `667×375` landscape, vertical chrome leaves only `203px` for the board (`23px` tiles on `7×7`).
- **H3 — Keyboard Shortcuts & Focus Leakage (`js/app.js`, `js/ui.js`):**
  - `Esc` / `R` / `H` can trigger during completion delay or on modals (`Settings` confirm, `Victory` reset); Tab focus is not moved into active modals.
- **H4 — `DailyStore` Missing In-Memory Fallback (`js/storage.js`):**
  - Restricted `localStorage` breaks `DailyStore.todayDone()` and streak tracking because `DailyStore` doesn't fall back to memory like `Storage` does.
- **H5 — Board-Wide Input Lock During Arrow Exit (`js/ui.js`):**
  - `state.animating` freezes all arrows for `340ms` even though `board.removed[id]` updates synchronously. Tracking exiting per-tile keeps rapid sequential taps smooth while preventing duplicate removals.
- **H6 — Missing E2E Tests for Lifelines, Game Over, Replay, Daily & Settings (`tests/browser.mjs`, `tests/run.mjs`):**
  - Browser QA does not exercise wrong-move heart loss, Game Over -> Replay, Daily Challenge, or Settings reset.
- **H7 — Unconditional `window.caches` Deletion in `index.html`:**
  - Portal builds must not wipe `window.caches` on non-localhost origins.

### Medium Priority
- **M1:** Double `Audio.playBlocked()` call on Game Over; add distinct `Audio.playGameOver()`.
- **M2:** `Audio.stopMusic()` `exponentialRampToValueAtTime` missing `cancelScheduledValues` + `setValueAtTime` anchor.
- **M3:** Milestone achievement persistence (`Storage.markAchievement`), `level_failed` analytics event, and `"NEW BEST!"` indicator on completion.
- **M4:** Subtle desktop frame polish on `#app` for viewports `>= 520px`.
- **M5:** Clean up unused `Utils.Screens` or stale references; bundle local fonts (`assets/fonts`) if network fetch is desired later.

### Low Priority
- **L1:** Level 82 depth drop (`15 -> 11`) within Expert tier (already 100% solvable and fun).
- **L2:** Update `PROGRESS.md` and add `README.md` at phase end.
- **L3:** Optional arrow-key cell navigation on the board.

---

## 3. Task-by-Task Improvement Roadmap (Phase 1)

| Task | Priority | Target Files | Verification |
|------|----------|--------------|--------------|
| **P1-0** | Setup | `.gitignore`, git init | `git status` clean checkpoint |
| **P1-1** | Critical (C1) + H5 + H3 + M1 | `js/ui.js`, `js/app.js`, `js/audio.js` | Unit tests + Playwright rapid-tap/restart race test + `Esc`/`R` modal checks |
| **P1-2** | High (H1) | `js/level-generator.js`, `js/puzzle.js`, `tools/generate-levels.mjs`, `js/levels.js` | `npm run levels`, `npm run validate`, verify 1★/2★/3★ all reachable across 100 levels |
| **P1-3** | High (H2) + M4 | `css/style.css` | Playwright layout bounds check across 5 viewports (`320px`, `375px`, `667×375`, `768×1024`, `1280×800`) |
| **P1-4** | High (H4) + M3 | `js/storage.js`, `js/ui.js` | Unit test restricted `localStorage` for `DailyStore` + milestone achievements |
| **P1-5** | High (H7) + M2 | `index.html`, `js/audio.js` | Origin guard check + Audio stopMusic safety check + `npm run build` |
| **P1-6** | High (H6) | `tests/run.mjs`, `tests/browser.mjs` | Full `npm run verify && npm run build && npm run test:browser` + sync `..\cubiqo` |
