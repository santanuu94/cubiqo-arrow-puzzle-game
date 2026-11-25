/* =========================================================================
   CUBIQO: ARROW ESCAPE — themes.js
   Unlockable visual themes, milestone rewards & live CSS theme switching.
   ========================================================================= */
(function (global) {
  'use strict';

  var Cubiqo = global.Cubiqo = global.Cubiqo || {};
  var Storage = Cubiqo.Storage;
  var DailyStore = Cubiqo.DailyStore;

  var LIST = [
    {
      id: 'classic',
      name: 'CUBIQO Classic',
      desc: 'Signature deep indigo & electric violet.',
      unlockText: 'Unlocked by default',
      swatches: ['#2e1065', '#7c3aed', '#3b82f6', '#fb7185'],
      milestoneLevel: null,
      checkUnlock: function () { return true; }
    },
    {
      id: 'ocean',
      name: 'Ocean Breeze',
      desc: 'Crisp abyssal teal & aqua board.',
      unlockText: 'Clear Level 10 (Rising Star)',
      swatches: ['#0c4a6e', '#0284c7', '#14b8a6', '#38bdf8'],
      milestoneLevel: 10,
      checkUnlock: function (save) { return !!(save.levels && save.levels[10]); }
    },
    {
      id: 'sunset',
      name: 'Sunset Neon',
      desc: 'Warm twilight plum & glowing amber.',
      unlockText: 'Clear Level 25 (Puzzle Pro)',
      swatches: ['#4c0519', '#e11d48', '#f97316', '#fbbf24'],
      milestoneLevel: 25,
      checkUnlock: function (save) { return !!(save.levels && save.levels[25]); }
    },
    {
      id: 'emerald',
      name: 'Emerald Forest',
      desc: 'Lush botanical jade & mint accents.',
      unlockText: 'Clear Level 50 (Halfway Hero)',
      swatches: ['#064e3b', '#059669', '#10b981', '#a7f3d0'],
      milestoneLevel: 50,
      checkUnlock: function (save) { return !!(save.levels && save.levels[50]); }
    },
    {
      id: 'midnight',
      name: 'Midnight Cyber',
      desc: 'Sleek obsidian slate & electric cyan.',
      unlockText: 'Clear Level 75 (Logic Master)',
      swatches: ['#090d16', '#334155', '#06b6d4', '#818cf8'],
      milestoneLevel: 75,
      checkUnlock: function (save) { return !!(save.levels && save.levels[75]); }
    },
    {
      id: 'royal',
      name: 'Royal Gold',
      desc: 'Regal obsidian & gilded championship gold.',
      unlockText: 'Clear Level 100 (Grand Champion)',
      swatches: ['#1c1917', '#b45309', '#f59e0b', '#fde68a'],
      milestoneLevel: 100,
      checkUnlock: function (save) { return !!(save.levels && save.levels[100]); }
    },
    {
      id: 'aurora',
      name: 'Daily Aurora',
      desc: 'Northern lights & shimmering violet-teal.',
      unlockText: '3-Day Daily Challenge Streak',
      swatches: ['#0f172a', '#6366f1', '#2dd4bf', '#f472b6'],
      milestoneLevel: null,
      checkUnlock: function (save, daily) {
        return Math.max(daily.bestStreak || 0, save.dailyBestStreak || 0) >= 3;
      }
    }
  ];

  function byId(id) {
    for (var i = 0; i < LIST.length; i++) {
      if (LIST[i].id === id) return LIST[i];
    }
    return LIST[0];
  }

  function rewardForLevel(levelId) {
    for (var i = 0; i < LIST.length; i++) {
      if (LIST[i].milestoneLevel === levelId) return LIST[i];
    }
    return null;
  }

  function syncUnlocks() {
    var save = Storage.load();
    var daily = DailyStore.get();
    var newlyUnlocked = [];
    var unlockedList = save.unlockedThemes || ['classic'];

    for (var i = 0; i < LIST.length; i++) {
      var t = LIST[i];
      if (unlockedList.indexOf(t.id) !== -1) continue;
      if (t.checkUnlock(save, daily)) {
        Storage.unlockTheme(t.id);
        newlyUnlocked.push(t);
      }
    }
    return newlyUnlocked;
  }

  function isUnlocked(id) {
    if (id === 'classic') return true;
    var list = Storage.getUnlockedThemes();
    return list.indexOf(id) !== -1;
  }

  function apply(id) {
    var theme = byId(id);
    if (typeof document !== 'undefined' && document.documentElement) {
      if (theme.id === 'classic') {
        document.documentElement.removeAttribute('data-theme');
      } else {
        document.documentElement.setAttribute('data-theme', theme.id);
      }
    }
    return theme.id;
  }

  function equip(id) {
    if (!isUnlocked(id)) return false;
    Storage.setActiveTheme(id);
    apply(id);
    return true;
  }

  function applyActive() {
    syncUnlocks();
    var active = Storage.getActiveTheme();
    if (!isUnlocked(active)) active = 'classic';
    return apply(active);
  }

  function getAll() {
    var active = Storage.getActiveTheme();
    var unlocked = Storage.getUnlockedThemes();
    return LIST.map(function (t) {
      return {
        id: t.id,
        name: t.name,
        desc: t.desc,
        unlockText: t.unlockText,
        swatches: t.swatches,
        milestoneLevel: t.milestoneLevel,
        unlocked: t.id === 'classic' || unlocked.indexOf(t.id) !== -1,
        active: active === t.id
      };
    });
  }

  Cubiqo.Themes = {
    LIST: LIST,
    byId: byId,
    rewardForLevel: rewardForLevel,
    syncUnlocks: syncUnlocks,
    isUnlocked: isUnlocked,
    equip: equip,
    applyActive: applyActive,
    getAll: getAll
  };
})(typeof window !== 'undefined' ? window : globalThis);
