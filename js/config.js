/* =========================================================================
   CUBIQO: ARROW ESCAPE — config.js
   Global configuration constants. Loaded first.
   ========================================================================= */
(function (global) {
  'use strict';

  var Cubiqo = global.Cubiqo = global.Cubiqo || {};

  Cubiqo.Config = {
    NAME: 'CUBIQO',
    TITLE: 'ARROW ESCAPE',
    VERSION: '1.0.0',
    TOTAL_LEVELS: 100,
    SAVE_KEY: 'cubiqo.save.v1',
    SAVE_VERSION: 1,
    DAILY_KEY: 'cubiqo.daily.v1',

    /* Direction metadata: unit vector + rotation (deg) used for the arrow glyph */
    DIRECTIONS: {
      up:    { dx: 0,  dy: -1, rotation: 0 },
      right: { dx: 1,  dy: 0,  rotation: 90 },
      down:  { dx: 0,  dy: 1,  rotation: 180 },
      left:  { dx: -1, dy: 0,  rotation: 270 }
    },
    DIRECTION_LIST: ['up', 'right', 'down', 'left'],

    /* Colour assigned to each direction. Colour is decorative AND aids parsing. */
    DIRECTION_COLORS: {
      up:    { name: 'Violet',  top: '#8b5cf6', top2: '#a78bfa', side: '#6d28d9', glow: 'rgba(139,92,246,.45)' },
      right: { name: 'Electric', top: '#3b82f6', top2: '#60a5fa', side: '#1d4ed8', glow: 'rgba(59,130,246,.45)' },
      down:  { name: 'Coral',   top: '#f43f5e', top2: '#fb7185', side: '#be123c', glow: 'rgba(244,63,94,.45)' },
      left:  { name: 'Mint',    top: '#10b981', top2: '#34d399', side: '#047857', glow: 'rgba(16,185,129,.45)' }
    },

    /* Brand palette (PRD section 4) */
    PALETTE: {
      purple: '#7c3aed',
      purpleLight: '#a78bfa',
      blue: '#2563eb',
      coral: '#fb7185',
      mint: '#34d399',
      yellow: '#fbbf24',
      surface: '#ffffff',
      ink: '#1e1b4b',
      inkSoft: '#4c4a72'
    },

    /* Fully online architecture: internet connection required to launch & play */
    ONLINE_REQUIRED: true,

    /* Portal SDK & Monetization config (Stage 3: midgame + rewarded ads via portal SDK) */
    MONETIZATION: {
      enabled: true,
      hintsFree: true,
      adRequestsEnabled: true,
      midgameAdsEnabled: true,
      rewardedAdsEnabled: true,
      rewardedCooldownMs: 90000,
      portalDetection: true
    },

    /* Gameplay-earned economy & non-ad alternatives */
    ECONOMY: {
      levelClearCoins: 10,
      threeStarBonusCoins: 5,
      milestoneBonusCoins: 50,
      dailyClearCoins: 25,
      heartCostCoins: 30,
      hintCostCoins: 20
    },

    /* Milestone celebration levels (PRD section 7E) */
    MILESTONES: { 10: 'Rising Star', 25: 'Puzzle Pro', 50: 'Halfway Hero', 75: 'Logic Master', 100: 'Grand Champion' },

    /* Timing constants (ms) — kept in one place for tuning */
    TIMING: {
      exitAnimation: 340,
      blockedShake: 380,
      screenTransition: 260,
      completionDelay: 620,
      hintPulse: 1600
    }
  };
})(typeof window !== 'undefined' ? window : globalThis);
