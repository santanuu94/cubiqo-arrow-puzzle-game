// ─── CUBIQO: Arrow Escape — Main Game Controller ──────────────

import type { GameState, Screen, LevelConfig, Direction } from './engine/types';
import { initLevel, canArrowExit, removeArrow, calculateStars, getHint as getHintArrow } from './engine/puzzle';
import { loadSave, saveLevelProgress, getHighestUnlocked, getCompletedCount, getTotalStars, getLevelProgress, getSettings, updateSettings, getDailyProgress, saveDailyProgress, resetAllProgress, isMilestoneReached } from './engine/save';
import { levels, getDailyLevel } from './data/levels';
import { initAudio, playArrowClear, playArrowBlocked, playLevelComplete, playButtonClick, playStarEarned, playHint, playVictory, playMilestone, triggerHaptic, updateMusicState } from './audio/sound';
import { initPlatform, getPlatformAdapter, trackEvent } from './platform/adapter';

// ─── State ────────────────────────────────────────────────────
let state: GameState = {
  currentScreen: 'loading',
  currentLevel: 1,
  grid: [],
  gridSize: 3,
  arrows: [],
  movesUsed: 0,
  arrowsRemaining: 0,
  totalArrows: 0,
  isPaused: false,
  isDaily: false,
  hintArrowId: null,
  animating: false,
};

let originalLevelConfig: LevelConfig | null = null;
let messageTimeout: ReturnType<typeof setTimeout> | null = null;
let showPrivacyModal = false;

const app = document.getElementById('app')!;

// ─── Color Map (Vibrant Casual Palette) ─────────────────────────
const ARROW_COLORS: Record<string, { bg: string; side: string; top: string; shadow: string }> = {
  red:    { bg: '#ef4444', side: '#b91c1c', top: '#f87171', shadow: 'rgba(239, 68, 68, 0.4)' },
  blue:   { bg: '#3b82f6', side: '#1d4ed8', top: '#60a5fa', shadow: 'rgba(59, 130, 246, 0.4)' },
  green:  { bg: '#22c55e', side: '#15803d', top: '#4ade80', shadow: 'rgba(34, 197, 94, 0.4)' },
  orange: { bg: '#f97316', side: '#c2410c', top: '#fb923c', shadow: 'rgba(249, 115, 22, 0.4)' },
  purple: { bg: '#a855f7', side: '#7e22ce', top: '#c084fc', shadow: 'rgba(168, 85, 247, 0.4)' },
  pink:   { bg: '#ec4899', side: '#be185d', top: '#f472b6', shadow: 'rgba(236, 72, 153, 0.4)' },
  teal:   { bg: '#14b8a6', side: '#0f766e', top: '#2dd4bf', shadow: 'rgba(20, 184, 166, 0.4)' },
  yellow: { bg: '#eab308', side: '#a16207', top: '#facc15', shadow: 'rgba(234, 179, 8, 0.4)' },
};

// ─── Directional SVG Arrow Icons ──────────────────────────────
function getArrowSvg(dir: Direction): string {
  switch (dir) {
    case 'up':
      return `<svg viewBox="0 0 24 24" class="arrow-svg" fill="currentColor"><path d="M12 3l-8 9h5v9h6v-9h5z"/></svg>`;
    case 'down':
      return `<svg viewBox="0 0 24 24" class="arrow-svg" fill="currentColor"><path d="M12 21l8-9h-5V3h-6v9H4z"/></svg>`;
    case 'left':
      return `<svg viewBox="0 0 24 24" class="arrow-svg" fill="currentColor"><path d="M3 12l9-8v5h9v6h-9v5z"/></svg>`;
    case 'right':
      return `<svg viewBox="0 0 24 24" class="arrow-svg" fill="currentColor"><path d="M21 12l-9 8v-5H3v-6h9V4z"/></svg>`;
  }
}

// ─── Render Routing ───────────────────────────────────────────
function render(): void {
  switch (state.currentScreen) {
    case 'loading': renderLoading(); break;
    case 'home': renderHome(); break;
    case 'levelSelect': renderLevelSelect(); break;
    case 'gameplay': renderGameplay(); break;
    case 'pause': renderPause(); break;
    case 'levelComplete': renderLevelComplete(); break;
    case 'daily': renderGameplay(); break;
    case 'settings': renderSettings(); break;
    case 'victory': renderVictory(); break;
  }
}

// ─── Screen 1: Loading Screen ─────────────────────────────────
function renderLoading(): void {
  app.innerHTML = `
    <div class="screen loading-screen">
      <div class="loading-content">
        <div class="logo-cube">
          <div class="cube-face cube-top"></div>
          <div class="cube-face cube-front"></div>
          <div class="cube-face cube-right"></div>
        </div>
        <h1 class="logo-text">CUBIQO</h1>
        <p class="logo-subtitle">ARROW ESCAPE</p>
        <div class="loading-bar-container">
          <div class="loading-bar" id="loadingBar"></div>
        </div>
        <p class="loading-text">Loading puzzles...</p>
      </div>
    </div>
  `;

  let progress = 0;
  const bar = document.getElementById('loadingBar');
  const interval = setInterval(() => {
    progress += Math.random() * 20 + 10;
    if (progress >= 100) {
      progress = 100;
      clearInterval(interval);
      setTimeout(() => {
        navigateTo('home');
        getPlatformAdapter().gameLoadingFinished?.();
        trackEvent('game_loaded');
        updateMusicState();
      }, 300);
    }
    if (bar) bar.style.width = `${progress}%`;
  }, 80);
}

// ─── Screen 2: Home Screen ────────────────────────────────────
function renderHome(): void {
  const unlocked = getHighestUnlocked();
  const completed = getCompletedCount();
  const stars = getTotalStars();
  const dailyP = getDailyProgress();
  const today = new Date().toISOString().slice(0, 10);
  const dailyDone = dailyP.date === today && dailyP.completed;

  app.innerHTML = `
    <div class="screen home-screen">
      <div class="home-content">
        <div class="logo-section">
          <div class="logo-cube small">
            <div class="cube-face cube-top"></div>
            <div class="cube-face cube-front"></div>
            <div class="cube-face cube-right"></div>
          </div>
          <h1 class="logo-text">CUBIQO</h1>
          <p class="logo-subtitle">ARROW ESCAPE</p>
          <p class="tagline">Clear unobstructed arrows. Master all 100 levels.</p>
        </div>

        <div class="stats-row">
          <div class="stat-badge">
            <span class="stat-icon">🎯</span>
            <span class="stat-value">Level ${unlocked}</span>
          </div>
          <div class="stat-badge">
            <span class="stat-icon">✅</span>
            <span class="stat-value">${completed}/100</span>
          </div>
          <div class="stat-badge">
            <span class="stat-icon">⭐</span>
            <span class="stat-value">${stars}/300</span>
          </div>
        </div>

        <div class="progress-bar-container" title="${completed}% completed">
          <div class="progress-bar" style="width:${completed}%"></div>
        </div>

        <div class="home-buttons">
          <button class="btn btn-primary btn-large" id="btnPlay">
            <span class="btn-icon">▶</span> PLAY LEVEL ${unlocked}
          </button>
          <button class="btn btn-secondary" id="btnLevelSelect">
            <span class="btn-icon">📋</span> LEVEL SELECT
          </button>
          <button class="btn btn-accent" id="btnDaily">
            <span class="btn-icon">${dailyDone ? '✅' : '📅'}</span> DAILY CHALLENGE
            ${dailyP.streak > 0 ? `<span class="streak-badge">🔥 ${dailyP.streak}</span>` : ''}
          </button>
          <button class="btn btn-ghost" id="btnSettings">
            <span class="btn-icon">⚙️</span> SETTINGS
          </button>
        </div>
      </div>
    </div>
  `;

  document.getElementById('btnPlay')!.addEventListener('click', () => {
    playButtonClick();
    startLevel(unlocked);
  });
  document.getElementById('btnLevelSelect')!.addEventListener('click', () => {
    playButtonClick();
    navigateTo('levelSelect');
  });
  document.getElementById('btnDaily')!.addEventListener('click', () => {
    playButtonClick();
    startDailyChallenge();
  });
  document.getElementById('btnSettings')!.addEventListener('click', () => {
    playButtonClick();
    navigateTo('settings');
  });
}

// ─── Screen 3: Level Selection ────────────────────────────────
function renderLevelSelect(): void {
  const unlocked = getHighestUnlocked();
  const completed = getCompletedCount();

  let grid = '';
  for (let i = 1; i <= 100; i++) {
    const prog = getLevelProgress(i);
    const isUnlocked = i <= unlocked;
    const isCompleted = prog?.completed;
    const isCurrent = i === unlocked && !isCompleted;
    const starCount = prog?.stars || 0;

    let cls = 'level-tile';
    if (!isUnlocked) cls += ' locked';
    else if (isCompleted) cls += ' completed';
    else cls += ' unlocked';
    if (isCurrent) cls += ' current';

    const starStr = isCompleted
      ? '<span class="tile-stars">' + '★'.repeat(starCount) + '☆'.repeat(3 - starCount) + '</span>'
      : (isCurrent ? '<span class="tile-current-tag">NOW</span>' : '');

    grid += `
      <button class="${cls}" data-level="${i}" id="levelTile-${i}" ${!isUnlocked ? 'disabled' : ''}>
        <span class="tile-num">${i}</span>
        ${!isUnlocked ? '<span class="tile-lock">🔒</span>' : ''}
        ${starStr}
      </button>
    `;
  }

  app.innerHTML = `
    <div class="screen level-select-screen">
      <div class="screen-header">
        <button class="btn btn-icon-only" id="btnBack" title="Back to home">←</button>
        <h2>SELECT LEVEL</h2>
        <span class="header-stat">${completed}/100</span>
      </div>
      <div class="level-grid" id="levelGrid">
        ${grid}
      </div>
    </div>
  `;

  document.getElementById('btnBack')!.addEventListener('click', () => {
    playButtonClick();
    navigateTo('home');
  });

  document.querySelectorAll('.level-tile:not(.locked)').forEach(btn => {
    btn.addEventListener('click', () => {
      playButtonClick();
      const lvl = parseInt((btn as HTMLElement).dataset.level!);
      startLevel(lvl);
    });
  });

  // Auto-scroll to current unlocked level
  requestAnimationFrame(() => {
    const currentEl = document.getElementById(`levelTile-${unlocked}`);
    if (currentEl) {
      currentEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  });
}

// ─── Screen 4 & 8: Main Gameplay & Daily Challenge ────────────
function renderGameplay(): void {
  const isDaily = state.isDaily;
  const levelLabel = isDaily ? 'Daily Challenge' : `Level ${state.currentLevel}`;

  let gridHtml = '';
  for (let r = 0; r < state.gridSize; r++) {
    for (let c = 0; c < state.gridSize; c++) {
      const arrow = state.grid[r]?.[c];
      if (arrow && arrow.active) {
        const colors = ARROW_COLORS[arrow.color];
        const isHint = state.hintArrowId === arrow.id;
        gridHtml += `
          <div class="grid-cell arrow-cell ${isHint ? 'hint-pulse' : ''}"
               data-arrow-id="${arrow.id}"
               data-row="${r}" data-col="${c}"
               style="grid-row:${r + 1}; grid-column:${c + 1};">
            <div class="arrow-block" style="--arrow-bg:${colors.bg}; --arrow-side:${colors.side}; --arrow-top:${colors.top}; --arrow-shadow:${colors.shadow};">
              <div class="arrow-shadow"></div>
              <div class="arrow-front-face"></div>
              <div class="arrow-right-face"></div>
              <div class="arrow-top-face">
                ${getArrowSvg(arrow.direction)}
              </div>
            </div>
          </div>
        `;
      } else {
        gridHtml += `
          <div class="grid-cell empty-cell" style="grid-row:${r + 1}; grid-column:${c + 1};"></div>
        `;
      }
    }
  }

  const progressPct = state.totalArrows > 0
    ? ((state.totalArrows - state.arrowsRemaining) / state.totalArrows) * 100
    : 0;

  app.innerHTML = `
    <div class="screen gameplay-screen">
      <div class="gameplay-header">
        <button class="btn btn-icon-only" id="btnPause" title="Pause (ESC)">⏸</button>
        <div class="level-header-title">
          <span class="level-label">${levelLabel}</span>
          ${!isDaily && originalLevelConfig ? `<span class="par-badge">Par: ${originalLevelConfig.par}</span>` : ''}
        </div>
        <button class="btn btn-icon-only" id="btnRestart" title="Restart Level (R)">↻</button>
      </div>

      <div class="level-progress-bar">
        <div class="level-progress-fill" style="width:${progressPct}%"></div>
      </div>

      <div class="gameplay-info">
        <div class="info-item">
          <span class="info-label">Arrows</span>
          <span class="info-value" id="arrowsLeft">${state.arrowsRemaining}</span>
        </div>
        <div class="info-item">
          <span class="info-label">Moves</span>
          <span class="info-value" id="movesCount">${state.movesUsed}</span>
        </div>
        <button class="btn btn-hint" id="btnHint" title="Show Hint (H)">
          <span>💡</span> Hint
        </button>
      </div>

      <div class="puzzle-container">
        <div class="puzzle-grid grid-size-${state.gridSize}" id="puzzleGrid"
             style="grid-template-columns:repeat(${state.gridSize},1fr);
                    grid-template-rows:repeat(${state.gridSize},1fr);">
          ${gridHtml}
        </div>
      </div>

      <div class="message-area" id="messageArea"></div>
    </div>
  `;

  // Event listeners
  document.getElementById('btnPause')!.addEventListener('click', () => {
    playButtonClick();
    state.isPaused = true;
    navigateTo('pause');
  });

  document.getElementById('btnRestart')!.addEventListener('click', () => {
    playButtonClick();
    restartLevel();
  });

  document.getElementById('btnHint')!.addEventListener('click', () => {
    playButtonClick();
    useHint();
  });

  // Arrow click handlers
  document.querySelectorAll('.arrow-cell').forEach(cell => {
    cell.addEventListener('click', () => {
      if (state.animating) return;
      const arrowId = parseInt((cell as HTMLElement).dataset.arrowId!);
      handleArrowClick(arrowId);
    });
  });
}

// ─── Screen 6: Pause Menu ─────────────────────────────────────
function renderPause(): void {
  app.innerHTML = `
    <div class="screen pause-screen">
      <div class="modal-overlay">
        <div class="modal">
          <h2>GAME PAUSED</h2>
          <p class="pause-subtitle">Level ${state.isDaily ? 'Daily Challenge' : state.currentLevel} • ${state.movesUsed} moves taken</p>
          <div class="modal-buttons">
            <button class="btn btn-primary btn-large" id="btnResume">▶ Resume</button>
            <button class="btn btn-secondary" id="btnPauseRestart">↻ Restart Level</button>
            <button class="btn btn-ghost" id="btnPauseHome">🏠 Home</button>
          </div>
        </div>
      </div>
    </div>
  `;

  document.getElementById('btnResume')!.addEventListener('click', () => {
    playButtonClick();
    state.isPaused = false;
    navigateTo('gameplay');
  });
  document.getElementById('btnPauseRestart')!.addEventListener('click', () => {
    playButtonClick();
    restartLevel();
  });
  document.getElementById('btnPauseHome')!.addEventListener('click', () => {
    playButtonClick();
    navigateTo('home');
  });
}

// ─── Screen 7: Level Completed ────────────────────────────────
function renderLevelComplete(): void {
  if (!originalLevelConfig) return;

  const stars = calculateStars(state.movesUsed, originalLevelConfig.par, originalLevelConfig.twoStar);
  const best = getLevelProgress(state.currentLevel);
  const isDaily = state.isDaily;

  let starsHtml = '';
  for (let i = 1; i <= 3; i++) {
    starsHtml += `<span class="star ${i <= stars ? 'earned' : 'empty'}" style="animation-delay:${i * 0.25}s">★</span>`;
  }

  // Audio feedback
  setTimeout(() => playLevelComplete(), 100);
  for (let i = 0; i < stars; i++) {
    setTimeout(() => playStarEarned(), 500 + i * 280);
  }

  if (!isDaily && isMilestoneReached(state.currentLevel)) {
    setTimeout(() => playMilestone(), 1100);
  }

  const milestoneHtml = !isDaily && isMilestoneReached(state.currentLevel)
    ? `<div class="milestone-banner">🎉 Milestone Reached: Level ${state.currentLevel}! 🎉</div>`
    : '';

  app.innerHTML = `
    <div class="screen complete-screen">
      <div class="complete-content">
        ${milestoneHtml}
        <h2>${isDaily ? 'DAILY COMPLETE!' : 'LEVEL COMPLETED!'}</h2>
        <div class="stars-display">${starsHtml}</div>
        <div class="complete-stats">
          <div class="stat-row">
            <span>Moves Used</span>
            <span class="stat-val ${state.movesUsed <= originalLevelConfig.par ? 'perfect' : ''}">${state.movesUsed}</span>
          </div>
          ${!isDaily && best ? `
          <div class="stat-row">
            <span>Personal Best</span>
            <span class="stat-val">${best.bestMoves} moves</span>
          </div>
          ` : ''}
          <div class="stat-row">
            <span>3-Star Par</span>
            <span class="stat-val">${originalLevelConfig.par} moves</span>
          </div>
        </div>
        <div class="complete-buttons">
          ${!isDaily && state.currentLevel < 100 ? `
            <button class="btn btn-primary btn-large" id="btnNext">Next Level ▶</button>
          ` : ''}
          ${!isDaily && state.currentLevel === 100 ? `
            <button class="btn btn-primary btn-large" id="btnVictory">🏆 View Grand Victory</button>
          ` : ''}
          <button class="btn btn-secondary" id="btnReplay">↻ Replay Level</button>
          <button class="btn btn-ghost" id="btnCompleteHome">🏠 Home</button>
        </div>
      </div>
      <div class="particles" id="particles"></div>
    </div>
  `;

  createParticles();

  document.getElementById('btnNext')?.addEventListener('click', () => {
    playButtonClick();
    startLevel(state.currentLevel + 1);
  });
  document.getElementById('btnVictory')?.addEventListener('click', () => {
    playButtonClick();
    navigateTo('victory');
  });
  document.getElementById('btnReplay')!.addEventListener('click', () => {
    playButtonClick();
    startLevel(state.currentLevel, state.isDaily);
  });
  document.getElementById('btnCompleteHome')!.addEventListener('click', () => {
    playButtonClick();
    navigateTo('home');
  });
}

// ─── Screen 9: Settings Screen & Privacy Modal ────────────────
function renderSettings(): void {
  const settings = getSettings();

  const privacyModalHtml = showPrivacyModal ? `
    <div class="modal-overlay" id="privacyModalOverlay">
      <div class="modal privacy-modal">
        <h3>Privacy & Info</h3>
        <div class="privacy-body">
          <p><strong>CUBIQO: Arrow Escape</strong> is a browser casual puzzle game designed for portals and mobile web.</p>
          <p><strong>Local Storage:</strong> Gameplay progression, star ratings, and sound preferences are stored purely on your local browser using HTML5 LocalStorage. No personal data or tracking cookies are collected.</p>
          <p><strong>Monetization Architecture:</strong> Portal SDK integrations (Poki, CrazyGames, GameDistribution) support platform-standard rewarded video ads without external tracking.</p>
          <p><strong>Version:</strong> 1.0.0 (Production Release)</p>
        </div>
        <button class="btn btn-primary" id="btnClosePrivacy">Close</button>
      </div>
    </div>
  ` : '';

  app.innerHTML = `
    <div class="screen settings-screen">
      <div class="screen-header">
        <button class="btn btn-icon-only" id="btnSettingsBack" title="Back">←</button>
        <h2>SETTINGS</h2>
        <span></span>
      </div>
      <div class="settings-list">
        <div class="setting-item">
          <span>🔊 Sound Effects</span>
          <label class="toggle">
            <input type="checkbox" id="toggleSound" ${settings.soundEnabled ? 'checked' : ''}>
            <span class="toggle-slider"></span>
          </label>
        </div>
        <div class="setting-item">
          <span>🎵 Ambient Music</span>
          <label class="toggle">
            <input type="checkbox" id="toggleMusic" ${settings.musicEnabled ? 'checked' : ''}>
            <span class="toggle-slider"></span>
          </label>
        </div>
        <div class="setting-item">
          <span>📳 Haptic Feedback</span>
          <label class="toggle">
            <input type="checkbox" id="toggleHaptic" ${settings.hapticEnabled ? 'checked' : ''}>
            <span class="toggle-slider"></span>
          </label>
        </div>
        <div class="setting-divider"></div>
        <button class="btn btn-secondary" id="btnPrivacy">
          ℹ️ Privacy Policy & Info
        </button>
        <button class="btn btn-danger" id="btnReset">
          ⚠️ Reset All Progress
        </button>
        <p class="setting-note">Resetting erases all 100 level stars and high scores.</p>
      </div>
      ${privacyModalHtml}
    </div>
  `;

  document.getElementById('btnSettingsBack')!.addEventListener('click', () => {
    playButtonClick();
    navigateTo('home');
  });
  document.getElementById('toggleSound')!.addEventListener('change', (e) => {
    updateSettings({ soundEnabled: (e.target as HTMLInputElement).checked });
  });
  document.getElementById('toggleMusic')!.addEventListener('change', (e) => {
    updateSettings({ musicEnabled: (e.target as HTMLInputElement).checked });
    updateMusicState();
  });
  document.getElementById('toggleHaptic')!.addEventListener('change', (e) => {
    updateSettings({ hapticEnabled: (e.target as HTMLInputElement).checked });
  });
  document.getElementById('btnPrivacy')!.addEventListener('click', () => {
    playButtonClick();
    showPrivacyModal = true;
    render();
  });
  document.getElementById('btnClosePrivacy')?.addEventListener('click', () => {
    playButtonClick();
    showPrivacyModal = false;
    render();
  });
  document.getElementById('btnReset')!.addEventListener('click', () => {
    if (confirm('Are you sure you want to reset ALL progress? This cannot be undone!')) {
      resetAllProgress();
      navigateTo('home');
    }
  });
}

// ─── Screen 10: Final Victory Screen ──────────────────────────
function renderVictory(): void {
  const save = loadSave();
  const totalStars = getTotalStars();
  const totalCompleted = getCompletedCount();

  playVictory();

  app.innerHTML = `
    <div class="screen victory-screen">
      <div class="victory-content">
        <div class="victory-trophy">🏆</div>
        <h1 class="victory-title">YOU CLEARED ALL 100 LEVELS!</h1>
        <p class="victory-subtitle">Congratulations! You are the ultimate CUBIQO Master!</p>

        <div class="victory-stats">
          <div class="v-stat">
            <span class="v-stat-num">${totalCompleted}</span>
            <span class="v-stat-label">Levels Cleared</span>
          </div>
          <div class="v-stat">
            <span class="v-stat-num">${save.totalMoves}</span>
            <span class="v-stat-label">Total Moves</span>
          </div>
          <div class="v-stat">
            <span class="v-stat-num">${totalStars}/300</span>
            <span class="v-stat-label">Total Stars</span>
          </div>
        </div>

        <div class="victory-buttons">
          <button class="btn btn-primary btn-large" id="btnPlayAgain">🔄 Play Again</button>
          <button class="btn btn-secondary" id="btnVictoryHome">🏠 Home</button>
        </div>
      </div>
      <div class="particles" id="particles"></div>
    </div>
  `;

  createParticles();

  document.getElementById('btnPlayAgain')!.addEventListener('click', () => {
    playButtonClick();
    if (confirm('Start a new campaign? Your current progress will be reset.')) {
      resetAllProgress();
      navigateTo('home');
    }
  });
  document.getElementById('btnVictoryHome')!.addEventListener('click', () => {
    playButtonClick();
    navigateTo('home');
  });
}

// ─── Game Logic & Interactions ────────────────────────────────
function navigateTo(screen: Screen): void {
  state.currentScreen = screen;
  render();
}

function startLevel(levelId: number, isDaily = false): void {
  let config: LevelConfig;

  if (isDaily) {
    const today = new Date().toISOString().slice(0, 10);
    config = getDailyLevel(today);
    state.isDaily = true;
  } else {
    if (levelId < 1 || levelId > 100) return;
    config = levels[levelId - 1];
    state.isDaily = false;
  }

  originalLevelConfig = config;
  const { arrows, grid, gridSize } = initLevel(config);

  state.currentLevel = levelId;
  state.arrows = arrows;
  state.grid = grid;
  state.gridSize = gridSize;
  state.movesUsed = 0;
  state.arrowsRemaining = arrows.length;
  state.totalArrows = arrows.length;
  state.isPaused = false;
  state.hintArrowId = null;
  state.animating = false;

  navigateTo('gameplay');
  trackEvent('level_started', { level: levelId, isDaily });
  getPlatformAdapter().gameplayStart?.();
}

function startDailyChallenge(): void {
  startLevel(0, true);
}

function restartLevel(): void {
  if (state.isDaily) {
    startLevel(0, true);
  } else {
    startLevel(state.currentLevel);
  }
  trackEvent('replay_started', { level: state.currentLevel });
}

function handleArrowClick(arrowId: number): void {
  if (state.animating) return;

  const arrow = state.arrows.find(a => a.id === arrowId);
  if (!arrow || !arrow.active) return;

  const canExit = canArrowExit(arrow, state.grid, state.gridSize);
  state.movesUsed++;

  if (state.hintArrowId === arrowId) {
    state.hintArrowId = null;
  }

  if (!canExit) {
    // Blocked! Visual & haptic feedback
    playArrowBlocked();
    triggerHaptic([20, 50, 20]);
    showMessage('Path blocked by another arrow!', 'error');
    trackEvent('move_blocked', { level: state.currentLevel, arrowId });

    const cell = document.querySelector(`[data-arrow-id="${arrowId}"]`);
    if (cell) {
      cell.classList.add('shake', 'blocked-flash');
      setTimeout(() => cell.classList.remove('shake', 'blocked-flash'), 450);
    }

    const movesEl = document.getElementById('movesCount');
    if (movesEl) movesEl.textContent = String(state.movesUsed);
    return;
  }

  // Clear path: animate escape outside the board
  state.animating = true;
  playArrowClear();
  triggerHaptic([12]);

  const cell = document.querySelector(`[data-arrow-id="${arrowId}"]`) as HTMLElement;
  if (cell) {
    const exitClass = `exit-${arrow.direction}`;
    cell.classList.add(exitClass);

    setTimeout(() => {
      const result = removeArrow(state.arrows, arrowId, state.gridSize);
      state.arrows = result.arrows;
      state.grid = result.grid;
      state.arrowsRemaining = state.arrows.filter(a => a.active).length;
      state.animating = false;

      if (state.arrowsRemaining === 0) {
        handleLevelComplete();
      } else {
        render();
      }
    }, 380);
  } else {
    const result = removeArrow(state.arrows, arrowId, state.gridSize);
    state.arrows = result.arrows;
    state.grid = result.grid;
    state.arrowsRemaining = state.arrows.filter(a => a.active).length;
    state.animating = false;

    if (state.arrowsRemaining === 0) {
      handleLevelComplete();
    } else {
      render();
    }
  }

  trackEvent('arrow_cleared', { level: state.currentLevel, arrowId });
}

function handleLevelComplete(): void {
  if (!originalLevelConfig) return;

  const stars = calculateStars(state.movesUsed, originalLevelConfig.par, originalLevelConfig.twoStar);

  if (state.isDaily) {
    const today = new Date().toISOString().slice(0, 10);
    saveDailyProgress(today, state.movesUsed);
    trackEvent('daily_completed', { moves: state.movesUsed });
  } else {
    saveLevelProgress(state.currentLevel, state.movesUsed, stars);
    trackEvent('level_completed', { level: state.currentLevel, moves: state.movesUsed, stars });
  }

  getPlatformAdapter().gameplayStop?.();

  if (!state.isDaily && state.currentLevel === 100) {
    setTimeout(() => navigateTo('victory'), 450);
  } else {
    setTimeout(() => navigateTo('levelComplete'), 450);
  }
}

function useHint(): void {
  if (state.animating) return;

  const hintArrow = getHintArrow(state.arrows, state.grid, state.gridSize);
  if (hintArrow) {
    state.hintArrowId = hintArrow.id;
    playHint();
    showMessage('Tap the highlighted arrow to clear it!', 'hint');
    render();
    trackEvent('hint_requested', { level: state.currentLevel });
  } else {
    showMessage('No moves available — restart to try again!', 'error');
  }
}

function showMessage(text: string, type: 'error' | 'hint' | 'info'): void {
  if (messageTimeout) clearTimeout(messageTimeout);

  requestAnimationFrame(() => {
    const area = document.getElementById('messageArea');
    if (area) {
      area.innerHTML = `<div class="game-message ${type}">${text}</div>`;
      area.classList.add('visible');

      messageTimeout = setTimeout(() => {
        area.classList.remove('visible');
        area.innerHTML = '';
      }, 2400);
    }
  });
}

function createParticles(): void {
  const container = document.getElementById('particles');
  if (!container) return;

  const colors = ['#a855f7', '#3b82f6', '#ec4899', '#22c55e', '#eab308', '#f97316'];
  for (let i = 0; i < 45; i++) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    particle.style.left = `${Math.random() * 100}%`;
    particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    particle.style.animationDelay = `${Math.random() * 2}s`;
    particle.style.animationDuration = `${1.2 + Math.random() * 2}s`;
    container.appendChild(particle);
  }
}

// ─── Keyboard Accessibility & Shortcuts ───────────────────────
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    if (state.currentScreen === 'gameplay') {
      state.isPaused = true;
      navigateTo('pause');
    } else if (state.currentScreen === 'pause') {
      state.isPaused = false;
      navigateTo('gameplay');
    }
  } else if ((e.key === 'r' || e.key === 'R') && state.currentScreen === 'gameplay') {
    playButtonClick();
    restartLevel();
  } else if ((e.key === 'h' || e.key === 'H') && state.currentScreen === 'gameplay') {
    playButtonClick();
    useHint();
  }
});

// ─── Prevent Accidental Page Scrolling on Mobile ──────────────
document.addEventListener('touchmove', (e) => {
  if (state.currentScreen === 'gameplay' || state.currentScreen === 'daily') {
    e.preventDefault();
  }
}, { passive: false });

// ─── Tab Visibility & Lifecycle ───────────────────────────────
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    if (state.currentScreen === 'gameplay' || state.currentScreen === 'daily') {
      state.isPaused = true;
      getPlatformAdapter().pauseGame();
    }
  }
});

// ─── Bootstrap ────────────────────────────────────────────────
async function init(): Promise<void> {
  initAudio();
  await initPlatform();
  loadSave();
  render();
}

init();
