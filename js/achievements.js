/* =========================================================================
   CUBIQO: ARROW ESCAPE — achievements.js
   Achievement catalog, progress tracking & unlock evaluation.
   Pure logic — safe to unit-test in Node.
   ========================================================================= */
(function (global) {
  'use strict';

  var Cubiqo = global.Cubiqo = global.Cubiqo || {};
  var Storage = Cubiqo.Storage;
  var DailyStore = Cubiqo.DailyStore;

  var CATALOG = [
    {
      id: 'first-clear',
      icon: '🚀',
      title: 'First Escape',
      desc: 'Complete your first campaign level.',
      category: 'levels',
      target: 1,
      measure: function (m) { return m.completed; }
    },
    {
      id: 'milestone-10',
      icon: '🌟',
      title: 'Rising Star',
      desc: 'Clear Level 10 and unlock Ocean Breeze.',
      category: 'milestones',
      target: 10,
      measure: function (m) { return m.maxCleared; }
    },
    {
      id: 'quarter-master',
      icon: '🧩',
      title: 'Quarter Way',
      desc: 'Complete 25 campaign levels.',
      category: 'levels',
      target: 25,
      measure: function (m) { return m.completed; }
    },
    {
      id: 'milestone-50',
      icon: '⚡',
      title: 'Halfway Hero',
      desc: 'Clear Level 50 and unlock Emerald Forest.',
      category: 'milestones',
      target: 50,
      measure: function (m) { return m.maxCleared; }
    },
    {
      id: 'milestone-75',
      icon: '🧠',
      title: 'Logic Master',
      desc: 'Clear Level 75 and unlock Midnight Cyber.',
      category: 'milestones',
      target: 75,
      measure: function (m) { return m.maxCleared; }
    },
    {
      id: 'all-100',
      icon: '👑',
      title: 'Grand Champion',
      desc: 'Clear all 100 campaign levels.',
      category: 'levels',
      target: 100,
      measure: function (m) { return m.completed; }
    },
    {
      id: 'stars-15',
      icon: '★',
      title: 'Star Collector',
      desc: 'Earn 15 total stars.',
      category: 'stars',
      target: 15,
      measure: function (m) { return m.totalStars; }
    },
    {
      id: 'stars-100',
      icon: '🌠',
      title: 'Constellation',
      desc: 'Earn 100 total stars.',
      category: 'stars',
      target: 100,
      measure: function (m) { return m.totalStars; }
    },
    {
      id: 'stars-300',
      icon: '💎',
      title: 'Perfectionist',
      desc: 'Earn all 300 stars in the campaign.',
      category: 'stars',
      target: 300,
      measure: function (m) { return m.totalStars; }
    },
    {
      id: 'perfect-1',
      icon: '♥',
      title: 'Clean Sweep',
      desc: 'Finish a level with 3 stars and all 3 hearts.',
      category: 'perfect',
      target: 1,
      measure: function (m) { return m.perfectClears; }
    },
    {
      id: 'perfect-10',
      icon: '🎯',
      title: 'Sharp Mind',
      desc: 'Earn 3 stars on 10 different levels.',
      category: 'perfect',
      target: 10,
      measure: function (m) { return m.perfectClears; }
    },
    {
      id: 'daily-1',
      icon: '📅',
      title: 'Daily Solver',
      desc: 'Complete a Daily Challenge puzzle.',
      category: 'daily',
      target: 1,
      measure: function (m) { return m.dailyCount; }
    },
    {
      id: 'daily-streak-3',
      icon: '🔥',
      title: 'On Fire',
      desc: 'Reach a 3-day Daily Challenge streak.',
      category: 'daily',
      target: 3,
      measure: function (m) { return m.dailyBestStreak; }
    }
  ];

  function metrics() {
    var save = Storage.load();
    var daily = DailyStore.get();
    var keys = Object.keys(save.levels || {});
    var perfectClears = 0;
    var maxCleared = 0;
    for (var i = 0; i < keys.length; i++) {
      var idNum = parseInt(keys[i], 10);
      var rec = save.levels[keys[i]];
      if (rec && rec.stars === 3) perfectClears++;
      if (!isNaN(idNum) && idNum > maxCleared) maxCleared = idNum;
    }
    var dailyCount = Object.keys(daily.completions || {}).length;
    return {
      completed: keys.length,
      maxCleared: maxCleared,
      totalStars: save.totalStars || 0,
      perfectClears: perfectClears,
      dailyCount: dailyCount,
      dailyBestStreak: Math.max(daily.bestStreak || 0, save.dailyBestStreak || 0)
    };
  }

  function evaluate() {
    var m = metrics();
    var save = Storage.load();
    var newlyUnlocked = [];
    for (var i = 0; i < CATALOG.length; i++) {
      var ach = CATALOG[i];
      if (save.achievements && save.achievements[ach.id]) continue;
      var val = ach.measure(m);
      if (val >= ach.target) {
        Storage.markAchievement(ach.id);
        newlyUnlocked.push(ach);
        if (Cubiqo.Analytics) {
          Cubiqo.Analytics.track('achievement_unlocked', { id: ach.id });
        }
      }
    }
    return newlyUnlocked;
  }

  function list() {
    var m = metrics();
    var save = Storage.load();
    var out = [];
    for (var i = 0; i < CATALOG.length; i++) {
      var ach = CATALOG[i];
      var unlocked = !!(save.achievements && save.achievements[ach.id]);
      var current = Math.min(ach.target, ach.measure(m));
      out.push({
        id: ach.id,
        icon: ach.icon,
        title: ach.title,
        desc: ach.desc,
        category: ach.category,
        target: ach.target,
        current: unlocked ? ach.target : current,
        unlocked: unlocked
      });
    }
    return out;
  }

  Cubiqo.Achievements = {
    CATALOG: CATALOG,
    evaluate: evaluate,
    list: list,
    metrics: metrics
  };
})(typeof window !== 'undefined' ? window : globalThis);
