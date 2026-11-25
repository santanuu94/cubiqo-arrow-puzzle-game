# CUBIQO: ARROW ESCAPE — Phase 2 Plan (Player Retention & Engagement)

**Date:** 2026-11-25  
**Methodology:** GSD (inspect → plan → execute task-by-task → verify after each task)

## Existing Foundation (Reused, Not Duplicated)
- `js/daily.js` + `DailyStore` in `js/storage.js` + `LevelGenerator.generateDaily()`
- `Config.MILESTONES` (`10, 25, 50, 75, 100`)
- `Storage.markAchievement()` / `hasAchievement()` + `Storage.migrate()`

## Task Breakdown
1. **P2-1 — Daily Challenge Polish & Duplicate Reward Prevention:**
   - Accurate `effectiveStreak` (returns `0` if `lastDate` is >1 day old, without erasing `bestStreak`).
   - Preserve `bestMoves` & `bestStars` on same-day replays; return `{ isFirstClaim }` so rewards cannot be claimed twice on the same date.
   - Dedicated Daily Completion celebration with streak badge & personal best.
2. **P2-2 — Achievement System (`js/achievements.js`):**
   - 12 achievements spanning campaign clears, star milestones, perfect 3-heart solves, level milestones (10/25/50/75/100), and daily challenges/streaks.
   - Dedicated Achievements screen (locked/unlocked states, progress indicators) + animated unlock banner.
3. **P2-3 — Unlockable Themes & Meaningful Milestone Rewards (`js/themes.js`):**
   - 7 themes (`classic` default + 5 milestone themes at 10/25/50/75/100 + `aurora` for 3-day daily streak).
   - Retroactive unlock sync for returning players.
   - Themes selection screen with live swatches & instant CSS theme application (`data-theme`).
   - Milestone celebration card on `levelComplete` showing the unlocked theme + "Equip Now" button.
4. **P2-4 — Verification & Sync:**
   - Unit tests (`tests/run.mjs`) for date rollovers, streaks, duplicate daily prevention, achievements, themes, and save migration.
   - Playwright E2E tests (`tests/browser.mjs`) for Daily Hub, Achievements screen, and Themes screen.
