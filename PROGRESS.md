# CUBIQO: ARROW ESCAPE — Implementation Progress

Status legend: `[ ]` todo · `[~]` in progress · `[x]` done & verified · `[!]` blocked

Last updated: 2026-11-23
Source of truth: `PRD.txt`

---

## Phase 0 — Foundations

| # | Task | Status | Notes |
|---|------|--------|-------|
| 0.1 | Read and analyse full PRD | `[x]` | PRD read end-to-end (file itself is truncated at §13 "Interface tests") |
| 0.2 | Inspect pre-existing project code | `[x]` | 4 pre-existing modules found & reviewed (see "Inherited code" below) |
| 0.3 | Implementation roadmap (GSD phases) | `[x]` | This document |
| 0.4 | `package.json`, `vite.config.js`, npm scripts | `[x]` | Vite for build; zero runtime dependencies |
| 0.5 | `index.html` shell + all screen markup | `[ ]` | |
| 0.6 | CSS design system (base / ui / game) | `[ ]` | Palette from PRD §4 |
| 0.7 | Loading screen animation | `[ ]` | PRD Screen 1 |

## Phase 1 — Data & Engine

| # | Task | Status | Notes |
|---|------|--------|-------|
| 1.1 | `js/config.js` — constants, palette, timing | `[x]` | Pre-existing, reviewed & adequate |
| 1.2 | `js/utils.js` — DOM/date/storage helpers | `[x]` | Pre-existing, reviewed & adequate |
| 1.3 | `js/storage.js` — versioned save, localStorage + memory fallback | `[x]` | Pre-existing, reviewed & adequate |
| 1.4 | `js/puzzle.js` — board model, rules, solver, analyser | `[x]` | Pre-existing, reviewed & adequate |
| 1.5 | `js/level-generator.js` — deterministic generator (shared by tool + daily) | `[ ]` | |
| 1.6 | `tools/generate-levels.mjs` → `js/levels.js` (100 levels) | `[ ]` | |
| 1.7 | `tools/validate-levels.mjs` — full validation report | `[ ]` | |
| 1.8 | All 100 levels solvable & difficulty-banded | `[ ]` | |

## Phase 2 — Platform Services

| # | Task | Status | Notes |
|---|------|--------|-------|
| 2.1 | `js/audio.js` — WebAudio SFX (no binary assets) | `[ ]` | |
| 2.2 | `js/haptics.js` — vibration wrapper w/ capability check | `[ ]` | |
| 2.3 | `js/platform.js` — adapter interface + detection | `[ ]` | PRD §9 |
| 2.4 | Adapters: Poki / CrazyGames / GameDistribution / Debug / None | `[ ]` | |
| 2.5 | `js/analytics.js` — event interface, no-op default | `[ ]` | PRD §12 |

## Phase 3 — Screens & UI

| # | Task | Status | Notes |
|---|------|--------|-------|
| 3.1 | `js/ui.js` — modals, toasts, star render, confirm dialog | `[ ]` | |
| 3.2 | Home screen | `[ ]` | PRD Screen 2 |
| 3.3 | Level select screen (100 tiles, 5 states) | `[ ]` | PRD Screen 3 |
| 3.4 | Gameplay screen — board, arrows, animations, counters | `[ ]` | PRD Screen 4 (highest priority) |
| 3.5 | Blocked-path feedback | `[ ]` | |
| 3.6 | Hint system | `[ ]` | PRD Screen 5 |
| 3.7 | Pause menu | `[ ]` | PRD Screen 6 |
| 3.8 | Level complete + star rating | `[ ]` | PRD Screen 7 |
| 3.9 | Daily challenge | `[ ]` | PRD Screen 8 |
| 3.10 | Settings screen | `[ ]` | PRD Screen 9 |
| 3.11 | Final victory (level 100) | `[ ]` | PRD Screen 10 |
| 3.12 | Milestone celebrations (10/25/50/75/100) | `[ ]` | PRD §7E |
| 3.13 | `js/main.js` — bootstrap, screen router, loading | `[ ]` | |
| 3.14 | Keyboard + touch accessibility, no scroll on play | `[ ]` | |

## Phase 4 — QA & Delivery

| # | Task | Status | Notes |
|---|------|--------|-------|
| 4.1 | Node test runner + unit tests (engine, levels, storage, daily) | `[ ]` | |
| 4.2 | Browser QA: desktop viewport, full playthrough | `[ ]` | Playwright |
| 4.3 | Browser QA: mobile viewport, touch targets | `[ ]` | Playwright |
| 4.4 | Edge cases: rapid tap, restricted storage, focus loss, reload | `[ ]` | |
| 4.5 | Production build verification (`npm run build`) | `[ ]` | |
| 4.6 | `README.md` — run, build, publish instructions | `[ ]` | |

---

## Inherited code (pre-existing, already reviewed)

| File | Verdict |
|------|---------|
| `js/config.js` | Keep. Palette, direction metadata, timing, monetization flags. |
| `js/utils.js` | Keep. Pure helpers + screen manager. |
| `js/storage.js` | Keep. Versioned save, migration hook, in-memory fallback, scoped reset. |
| `js/puzzle.js` | Keep. Greedy-peel solver — correct because removal only ever empties cells. |

> **Note on the solver:** `peel()` is a complete decision procedure for this rule set, not a heuristic. Removing an arrow can never *create* a new block, so if any solution exists the greedy peel finds one. `peel()` is therefore used as the authoritative solvability oracle for all 100 levels.

---

## Architecture

```
cubiqo/
├── PRD.txt                     source of truth
├── PROGRESS.md                 this file
├── README.md                   run / build / publish
├── package.json                zero runtime deps; vite is dev-only
├── vite.config.js              base './' for portal hosting
├── index.html                  all screens, classic script graph
├── css/
│   ├── base.css                tokens, reset, typography, backgrounds
│   ├── ui.css                  buttons, cards, modals, screens, toasts
│   └── game.css                board, cubical arrows, animations, particles
├── js/
│   ├── config.js  utils.js  storage.js  puzzle.js       (inherited)
│   ├── levels.js              100 validated level configurations
│   ├── level-generator.js      deterministic generator
│   ├── audio.js  haptics.js  analytics.js
│   ├── platform.js             adapter interface + detection
│   ├── adapters/{poki,crazygames,gamedistribution,debug,none}.js
│   ├── ui.js                  shared widgets
│   ├── screens/{home,levelselect,game,daily,settings,victory}.js
│   └── main.js                bootstrap + router
├── tools/
│   ├── generate-levels.mjs     authoring tool → js/levels.js
│   ├── validate-levels.mjs     validation + difficulty report
│   └── static-server.mjs       dependency-free static server
└── tests/
    ├── run.mjs                 unit test runner
    ├── browser.mjs             Playwright end-to-end QA
    └── *.test.mjs
```

**Module pattern:** classic IIFE scripts attaching to `window.Cubiqo`. Chosen because it
(1) matches the inherited code, (2) runs identically from `file://`, a static host, or a
Vite build — which matters for gaming portals, and (3) adds no bundler requirement.

---

## Key design decisions

1. **Levels are static data, not runtime-random.** `js/levels.js` holds 100 compact,
   pre-validated configurations. Generation happens offline in `tools/generate-levels.mjs`
   and every result is checked by the same solver the game uses.
2. **Greedy peel is used as the solvability oracle** — it is complete for this rule set.
3. **The generator constructs dependencies explicitly** (an arrow is placed only where it
   blocks an existing arrow), so dependency depth — not arrow count — drives difficulty.
4. **Monetization stays off.** `platform.js` exposes the full adapter contract
   (`initialize`, `isAvailable`, `showRewardedHint`, `showInterstitial`, `pauseGame`,
   `resumeGame`) with a null adapter as the default. Hints are free.
5. **No binary assets.** All sound is synthesized with the Web Audio API; all visuals are
   CSS. Keeps the build tiny and portal-friendly.
