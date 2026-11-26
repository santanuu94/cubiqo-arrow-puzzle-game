# CUBIQO: Arrow Escape

A modern HTML5 directional arrow puzzle game built with modular JavaScript (ESM), Vite, and CSS 3D transforms. Designed for desktop, tablet, and mobile browsers with full CrazyGames HTML5 SDK v3 integration.

---

## Game Overview

In **CUBIQO: Arrow Escape**, the player clears arrow blocks from a grid by finding unobstructed escape routes.
- **Escape Mechanic**: An arrow can leave the grid only when no other arrow blocks its exit path toward the board perimeter.
- **Collisions & Lifelines**: Tapping a blocked arrow triggers a shake animation and costs one heart from the 3-heart lifeline system.
- **Move Counter & Stars**: Levels reward 1 to 3 stars based on move par thresholds.
- **Solvable Levels**: Includes 100 mathematically validated, guaranteed-solvable levels spanning 7 difficulty tiers.

---

## Features

- **100 Playable Levels**: From gentle 3x3 grids up to intricate 6x6 puzzle grids.
- **Three-Heart Lifelines**: Provides suspenseful risk-reward gameplay with game-over states and level restarts.
- **CrazyGames SDK v3 Integration**:
  - Asynchronous SDK initialization with environment detection.
  - Gameplay start and stop lifecycle events tied to interactive state.
  - Global audio mute synchronization across tab focus and ad states.
  - Midgame interstitial advertisements during level transitions.
  - Rewarded video ads for continuing with an extra heart or receiving free hints.
  - Responsive banner ads on the Level Select screen, safely cleared during gameplay.
- **Player Retention & Engagement**:
  - **Daily Challenge**: Deterministic date-based puzzles with streak tracking.
  - **Achievements System**: Unlockable badges for progression, star collection, and daily wins.
  - **Milestone Rewards**: Special celebration effects and coin bonuses every 10 levels.
  - **Unlockable Themes**: Vibrant color palettes unlocked through player progression.
  - **Local Persistence**: Versioned storage adapter preserving scores, stars, streaks, and settings.
- **Web Audio Engine**: Zero external audio dependencies; pure procedural sounds and soothing ambient music via the Web Audio API.
- **Fully Online HTML5 Architecture**: Detects connection state and displays a clean modal if connection drops.

---

## Project Structure

```text
cubiqo-arrow/
├── assets/          # Static assets, fonts, icons, and audio synthesis
├── css/             # Responsive stylesheets and 3D visual styles
├── js/              # Modular game architecture (ESM)
│   ├── achievements.js   # Achievement tracking and badges
│   ├── analytics.js      # Player event telemetry
│   ├── app.js            # Main controller and screen router
│   ├── audio.js          # Web Audio procedural synthesis
│   ├── config.js         # Game balancing and constants
│   ├── daily.js          # Daily challenge and streak manager
│   ├── entry.js          # Application entrypoint
│   ├── hints.js          # Solver engine and hint generator
│   ├── level-generator.js # Deterministic puzzle layout builder
│   ├── levels.js         # 100 verified level definitions
│   ├── network.js        # Online connectivity monitoring
│   ├── platform.js       # CrazyGames SDK v3 adapter
│   ├── puzzle.js         # Core grid simulation and collision logic
│   ├── storage.js        # Versioned local state persistence
│   ├── themes.js         # Color theme manager
│   ├── ui.js             # DOM renderer and animated transitions
│   └── utils.js          # Math and helper utilities
├── publishing/      # High-resolution store banners, previews, and listing copy
├── release/         # Distribution archive (cubiqo-arrow-escape-crazygames.zip)
├── tests/           # Unit test suite and Playwright browser tests
├── tools/           # Validation scripts, level generator, asset tools
├── index.html       # HTML5 game container and CrazyGames SDK loader
├── package.json     # Project configuration and script commands
└── vite.config.js   # Vite production build pipeline
```

---

## Getting Started

### Prerequisites
- Node.js (v18+)
- npm

### Installation
```bash
npm install
```

### Development Server
```bash
npm run dev
```

### Validation & Automated Tests
```bash
npm run verify
```
Runs:
- Level solver verification (`tools/validate-levels.mjs`) ensuring all 100 levels can be completed.
- Unit test runner (`tests/run.mjs`) checking collision physics, par thresholds, persistence, and SDK hooks.

### Production Build
```bash
npm run build
```
Generates a deployable production bundle in the `dist/` directory with relative asset paths.

---

## Deployment & Submission

A production-ready CrazyGames submission package is generated in:
```text
release/cubiqo-arrow-escape-crazygames.zip
```
Store visual assets and metadata descriptions are provided in `publishing/` for developer portal uploads.
