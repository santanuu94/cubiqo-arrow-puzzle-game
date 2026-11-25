/* =========================================================================
   CUBIQO: ARROW ESCAPE — storage.js
   Versioned, defensive localStorage persistence with in-memory fallback.
   Only touches our own keys — never clears unrelated browser data.
   ========================================================================= */
(function (global) {
  'use strict';

  var Cubiqo = global.Cubiqo = global.Cubiqo || {};
  var Config = Cubiqo.Config;
  var Utils = Cubiqo.Utils;

  var MEMORY = null; /* fallback when localStorage is unavailable */
  var DAILY_MEMORY = null; /* fallback for daily store when localStorage is unavailable */

  function defaultSave() {
    return {
      version: Config.SAVE_VERSION,
      createdAt: new Date().toISOString(),
      updatedAt: null,
      highestUnlocked: 1,
      levels: {},        /* id -> { stars, bestMoves, completedAt } */
      totalMoves: 0,
      totalStars: 0,
      settings: { sound: true, haptics: true, music: false },
      stats: { gamesPlayed: 0, lastPlayed: null },
      lastDailyDate: null,
      dailyStreak: 0,
      dailyBestStreak: 0,
      dailyCompletions: {},  /* 'YYYY-MM-DD' -> { moves, stars } */
      achievements: {},       /* milestone/achievement id -> true */
      activeTheme: 'classic',
      unlockedThemes: ['classic']
    };
  }

  function migrate(raw) {
    var out = defaultSave();
    if (!raw || typeof raw !== 'object') return out;
    /* Future migrations hook in here. v1 is the first version. */
    if (raw.levels && typeof raw.levels === 'object') out.levels = raw.levels;
    if (typeof raw.highestUnlocked === 'number') out.highestUnlocked = raw.highestUnlocked;
    if (typeof raw.totalMoves === 'number') out.totalMoves = raw.totalMoves;
    if (typeof raw.totalStars === 'number') out.totalStars = raw.totalStars;
    if (raw.settings && typeof raw.settings === 'object') {
      out.settings.sound = raw.settings.sound !== false;
      out.settings.haptics = raw.settings.haptics !== false;
      out.settings.music = raw.settings.music === true;
    }
    if (raw.stats && typeof raw.stats === 'object') {
      out.stats.gamesPlayed = raw.stats.gamesPlayed || 0;
      out.stats.lastPlayed = raw.stats.lastPlayed || null;
    }
    if (typeof raw.lastDailyDate === 'string') out.lastDailyDate = raw.lastDailyDate;
    if (typeof raw.dailyStreak === 'number') out.dailyStreak = raw.dailyStreak;
    if (typeof raw.dailyBestStreak === 'number') out.dailyBestStreak = raw.dailyBestStreak;
    if (raw.dailyCompletions && typeof raw.dailyCompletions === 'object') out.dailyCompletions = raw.dailyCompletions;
    if (raw.achievements && typeof raw.achievements === 'object') out.achievements = raw.achievements;
    if (typeof raw.activeTheme === 'string') out.activeTheme = raw.activeTheme;
    if (Array.isArray(raw.unlockedThemes)) out.unlockedThemes = raw.unlockedThemes.slice();
    if (out.unlockedThemes.indexOf('classic') === -1) out.unlockedThemes.unshift('classic');
    if (raw.createdAt) out.createdAt = raw.createdAt;
    return out;
  }

  function load() {
    if (MEMORY) return clone(MEMORY);
    var raw = Utils.storage.get(Config.SAVE_KEY);
    var data = migrate(raw);
    MEMORY = data;
    return clone(data);
  }

  function save(data) {
    MEMORY = data;
    data.updatedAt = new Date().toISOString();
    Utils.storage.set(Config.SAVE_KEY, data);
    return data;
  }

  function update(fn) {
    var data = load();
    fn(data);
    save(data);
    return data;
  }

  function clone(o) { return JSON.parse(JSON.stringify(o)); }

  var Storage = {
    defaultSave: defaultSave,
    load: load,
    save: save,
    update: update,
    available: function () { return Utils.storage.available(); },
    inMemory: function () { return MEMORY !== null; },

    levelRecord: function (levelId) {
      var d = load();
      return d.levels[levelId] || null;
    },

    isUnlocked: function (levelId) {
      return levelId <= load().highestUnlocked;
    },

    /* Record a completion. Returns info about the result. */
    completeLevel: function (levelId, moves, stars) {
      var result = { newStars: 0, improved: false, prevBest: null, unlockedNext: false, firstClear: false };
      var data = update(function (d) {
        var rec = d.levels[levelId];
        if (!rec) {
          rec = { stars: 0, bestMoves: 0, completedAt: null };
          d.levels[levelId] = rec;
        }
        result.firstClear = rec.completedAt === null;
        result.prevBest = rec.bestMoves || null;
        if (!rec.bestMoves || moves < rec.bestMoves) {
          rec.bestMoves = moves;
          result.improved = true;
        }
        if (stars > rec.stars) rec.stars = stars;
        rec.completedAt = new Date().toISOString();

        d.totalMoves += moves;
        d.stats.gamesPlayed += 1;
        d.stats.lastPlayed = new Date().toISOString();

        /* total stars recalculation from records */
        var total = 0, keys = Object.keys(d.levels);
        for (var i = 0; i < keys.length; i++) {
          total += d.levels[keys[i]].stars || 0;
        }
        d.totalStars = total;

        /* unlock next level */
        if (levelId === d.highestUnlocked && levelId < Config.TOTAL_LEVELS) {
          d.highestUnlocked = levelId + 1;
          result.unlockedNext = true;
        }
      });
      result.newStars = data.levels[levelId].stars;
      return result;
    },

    recordDailyCompletion: function (dateKey, moves, stars) {
      return update(function (d) {
        var today = dateKey;
        d.dailyCompletions[today] = { moves: moves, stars: stars, at: new Date().toISOString() };
        if (d.lastDailyDate === today) {
          /* already counted today */
        } else {
          var gap = d.lastDailyDate ? Utils.daysBetween(d.lastDailyDate, today) : Infinity;
          d.dailyStreak = (gap === 1) ? d.dailyStreak + 1 : 1;
          d.lastDailyDate = today;
          if (d.dailyStreak > d.dailyBestStreak) d.dailyBestStreak = d.dailyStreak;
        }
      });
    },

    dailyDone: function (dateKey) {
      return !!load().dailyCompletions[dateKey];
    },

    getSettings: function () { return load().settings; },

    setSettings: function (partial) {
      return update(function (d) {
        if (partial.sound != null) d.settings.sound = !!partial.sound;
        if (partial.haptics != null) d.settings.haptics = !!partial.haptics;
        if (partial.music != null) d.settings.music = !!partial.music;
      });
    },

    /* Reset only our own data — never touches other localStorage entries. */
    resetProgress: function () {
      MEMORY = null;
      DAILY_MEMORY = null;
      Utils.storage.remove(Config.SAVE_KEY);
      Utils.storage.remove(Config.DAILY_KEY);
      MEMORY = defaultSave();
      save(MEMORY);
      return clone(MEMORY);
    },

    markAchievement: function (id) {
      update(function (d) { d.achievements[id] = true; });
    },

    hasAchievement: function (id) {
      return !!load().achievements[id];
    },

    getActiveTheme: function () {
      return load().activeTheme || 'classic';
    },

    setActiveTheme: function (id) {
      update(function (d) { d.activeTheme = id || 'classic'; });
    },

    getUnlockedThemes: function () {
      return (load().unlockedThemes || ['classic']).slice();
    },

    unlockTheme: function (id) {
      update(function (d) {
        if (!Array.isArray(d.unlockedThemes)) d.unlockedThemes = ['classic'];
        if (d.unlockedThemes.indexOf(id) === -1) d.unlockedThemes.push(id);
      });
    }
  };

  /* Daily challenge progress (kept under its own key so main progress is untouched) */
  var DailyStore = {
    get: function () {
      if (DAILY_MEMORY) return clone(DAILY_MEMORY);
      var raw = Utils.storage.get(Config.DAILY_KEY);
      if (!raw || typeof raw !== 'object') raw = { completions: {}, streak: 0, bestStreak: 0, lastDate: null };
      if (!raw.completions) raw.completions = {};
      DAILY_MEMORY = raw;
      return clone(raw);
    },
    set: function (v) {
      DAILY_MEMORY = clone(v);
      Utils.storage.set(Config.DAILY_KEY, v);
    },
    markComplete: function (dateKey, moves, stars) {
      var d = this.get();
      var existing = d.completions[dateKey];
      var isFirstClaim = !existing;
      var bestMoves = existing && existing.moves ? Math.min(existing.moves, moves) : moves;
      var bestStars = existing && existing.stars ? Math.max(existing.stars, stars) : stars;
      var nowIso = new Date().toISOString();

      d.completions[dateKey] = {
        moves: bestMoves,
        stars: bestStars,
        rewardClaimed: true,
        claimedAt: existing && existing.claimedAt ? existing.claimedAt : nowIso,
        at: nowIso
      };

      if (isFirstClaim) {
        d.totalCompleted = Object.keys(d.completions).length;
        if (d.lastDate !== dateKey) {
          var gap = d.lastDate ? Utils.daysBetween(d.lastDate, dateKey) : Infinity;
          if (!d.lastDate || gap >= 1) {
            d.streak = gap === 1 ? (d.streak || 0) + 1 : 1;
            d.lastDate = dateKey;
            if (d.streak > (d.bestStreak || 0)) d.bestStreak = d.streak;
          }
        }
      }

      this.set(d);
      /* mirror into main save so home screen can read daily info in one place */
      update(function (save) {
        save.dailyCompletions[dateKey] = { moves: bestMoves, stars: bestStars, rewardClaimed: true };
        save.dailyStreak = d.streak;
        save.dailyBestStreak = d.bestStreak;
        save.lastDailyDate = d.lastDate;
      });
      d.isFirstClaim = isFirstClaim;
      d.bestMoves = bestMoves;
      d.bestStars = bestStars;
      return d;
    },
    todayDone: function (dateKey) {
      return !!this.get().completions[dateKey];
    }
  };

  Cubiqo.Storage = Storage;
  Cubiqo.DailyStore = DailyStore;
})(typeof window !== 'undefined' ? window : globalThis);