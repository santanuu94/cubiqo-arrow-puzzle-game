# CUBIQO: Arrow Escape 🎯

A premium, commercial-quality HTML5 browser-based directional arrow puzzle game built with TypeScript, Vite, and CSS 3D transforms. Fully responsive across desktop, tablet, and mobile browsers, and platform-adapter ready for HTML5 gaming portals (Poki, CrazyGames, GameDistribution).

---

## 🎮 Game Overview

The objective of **CUBIQO: Arrow Escape** is to clear all colorful directional arrow blocks from the puzzle grid.
- **Core Rule**: An arrow can escape the board **only** when no active arrow occupies any cell in its directional exit path toward the board edge.
- **Blocked Path**: Selecting an obstructed arrow produces immediate visual shake and audio error feedback without removing the block, incrementing the move counter.
- **Clear Path**: Selecting an unobstructed arrow triggers a smooth 3D exit animation flying off the board, decreasing the remaining arrow counter.
- **Stars & Scoring**: Levels reward up to 3 stars based on move par thresholds. Players can replay completed levels to improve their scores.

---

## ✨ Features & Architecture

- **100 Playable Levels**: Progressively designed across 7 difficulty tiers:
  - **Levels 1–10**: Learning phase (3×3 grids, 1–9 arrows, basic directions)
  - **Levels 11–20**: Beginner challenge (3×3 grids, 5–8 arrows, multi-step dependencies)
  - **Levels 21–35**: Intermediate (4×4 grids, 6–13 arrows)
  - **Levels 36–50**: Advanced Intermediate (4×4 grids, 10–14 arrows, deep blocking layers)
  - **Levels 51–70**: Advanced (5×5 grids, 11–18 arrows)
  - **Levels 71–90**: Expert (5×5 grids, 16–21 arrows, complex chains)
  - **Levels 91–100**: Master Challenge (5×5 & 6×6 grids, 20–26 arrows)
  - *All 100 levels are mathematically validated and 100% solvable.*
- **All 10 PRD Application Screens**:
  1. **Loading Screen**: 3D animated floating cube, progress bar, platform initialization.
  2. **Home Screen**: Live stats, level progression bar, instant Play, Daily Challenge with streak badge, Level Select, and Settings.
  3. **Level Select**: 100 numbered tiles with locked/unlocked states, star ratings, current active level badge, and auto-scroll to the current level.
  4. **Main Gameplay**: Header with pause and restart buttons, progress bar, move and arrow counters, hint trigger, and responsive 3D board.
  5. **Hint System**: Real-time solver calculates genuinely valid unobstructed moves, pulses the arrow with a golden glow, and guides the player.
  6. **Pause Menu**: Modal preserving exact puzzle state, move count, and board configuration.
  7. **Level Completed**: Star bounce animations, move stats, personal best records, milestone celebrations (Levels 10, 25, 50, 75, 100), and particle effects.
  8. **Daily Challenge**: Date-based deterministic puzzles with consecutive daily streak tracking.
  9. **Settings Screen**: Toggles for sound effects, procedural ambient music, and haptic feedback, plus confirmation-protected reset and Privacy Policy modal.
  10. **Final Victory Screen**: Trophy animation, career stats summary (levels, moves, stars), and new campaign start.
- **Audio & Haptics Engine**:
  - Built entirely with the Web Audio API — **zero external audio assets** required.
  - Procedural relaxing ambient background chords that loop seamlessly.
  - Sound effects for arrow clears, blocked attempts, button clicks, star awards, level completions, and milestones.
  - Vibration API integration for mobile haptic feedback.
- **Platform Adapter Architecture**:
  - Ready for PokiSDK, CrazyGames SDK, and GameDistribution SDK.
  - Initial release runs in development mode (monetization disabled, hints 100% free, zero unwanted ad requests).
- **Ultra-Lightweight & Performant**:
  - Production bundle is under **96 KB total** (~15 KB gzipped).
  - Smooth 60 FPS CSS 3D transforms.
  - Built with relative assets (`./`) for plug-and-play portal iframe hosting.

---

## 🚀 Quick Start

### Prerequisites
- Node.js (v18+)
- npm

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 3. Run Automated Test Suite
```bash
npm test
```
Runs the 20-test validation suite verifying:
- Directional exit physics and obstacle collision detection
- Par thresholds and star calculation logic
- Hint solver engine
- Solvability of all 100 campaign levels
- Deterministic generation of Daily Challenge puzzles

### 4. Build for Production / Portal Release
```bash
npm run build
```
Creates a standalone, self-contained `dist/` directory ready to be zipped and uploaded to Poki, CrazyGames, or GameDistribution.

---

## ⌨️ Desktop Shortcuts

- **Click / Tap**: Select arrow or button
- **Escape**: Pause / Resume game
- **R**: Restart current level
- **H**: Use hint

---

## 📁 Project Structure

```
cubiqo-arrow/
├── dist/                   # Production build (deployable to gaming portals)
├── public/                 # Favicon and static SVGs
├── scripts/
│   ├── build-all-levels.ts # Deterministic solvable level compiler
│   ├── run-all-tests.ts    # Comprehensive test runner (20 tests)
│   └── validate-levels.ts  # 100-level solvability checker
├── src/
│   ├── audio/
│   │   └── sound.ts        # Web Audio API effects & procedural ambient music
│   ├── data/
│   │   └── levels.ts       # 100 verified puzzle levels + daily challenge generator
│   ├── engine/
│   │   ├── puzzle.ts       # Arrow escape mechanics, grid logic, and hint solver
│   │   ├── save.ts         # LocalStorage persistence, streak tracking, milestones
│   │   └── types.ts        # TypeScript interfaces & types
│   ├── platform/
│   │   └── adapter.ts      # Poki, CrazyGames, GameDistribution portal adapters
│   ├── main.ts             # Main UI controller & screen state machine
│   └── style.css           # Modern 3D casual game stylesheet & animations
├── index.html              # HTML5 entry point
├── package.json
├── tsconfig.json
└── vite.config.ts          # Vite build config with relative base path
```
