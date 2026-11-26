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
  var PERSISTENT = true;

  function isPlainObject(v) {
    return !!v && typeof v === 'object' && !Array.isArray(v);
  }

  function nonNegInt(v, fallback) {
    return (typeof v === 'number' && isFinite(v) && v >= 0) ? Math.floor(v) : (fallback || 0);
  }

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
      unlockedThemes: ['classic'],
      coins: 0,
      hintBank: 0,
      rewardedMilestones: {},
      lastRewardedAdAt: 0
    };
  }

  function migrate(raw) {
    var out = defaultSave();
    if (!isPlainObject(raw)) return out;

    /* Sanitize level records and recompute totalStars safely */
    var maxCleared = 0;
    var starSum = 0;
    if (isPlainObject(raw.levels)) {
      var lKeys = Object.keys(raw.levels);
      for (var i = 0; i < lKeys.length; i++) {
        var idNum = parseInt(lKeys[i], 10);
        if (!Number.isInteger(idNum) || idNum < 1 || idNum > Config.TOTAL_LEVELS) continue;
        var rec = raw.levels[lKeys[i]];
        if (!isPlainObject(rec)) continue;
        var stars = nonNegInt(rec.stars, 0);
        var bestMoves = nonNegInt(rec.bestMoves, 0);
        if (stars < 1 || stars > 3 || bestMoves < 1) continue;
        out.levels[idNum] = {
          stars: stars,
          bestMoves: bestMoves,
          completedAt: typeof rec.completedAt === 'string' ? rec.completedAt : null
        };
        starSum += stars;
        if (idNum > maxCleared) maxCleared = idNum;
      }
    }

    var rawUnlocked = nonNegInt(raw.highestUnlocked, 1);
    var minUnlocked = maxCleared > 0 ? Math.min(Config.TOTAL_LEVELS, maxCleared + 1) : 1;
    out.highestUnlocked = Math.max(1, Math.min(Config.TOTAL_LEVELS, Math.max(rawUnlocked, minUnlocked)));
    out.totalMoves = nonNegInt(raw.totalMoves, 0);
    out.totalStars = starSum;

    if (isPlainObject(raw.settings)) {
      out.settings.sound = raw.settings.sound !== false;
      out.settings.haptics = raw.settings.haptics !== false;
      out.settings.music = raw.settings.music === true;
    }
    if (isPlainObject(raw.stats)) {
      out.stats.gamesPlayed = nonNegInt(raw.stats.gamesPlayed, 0);
      out.stats.lastPlayed = typeof raw.stats.lastPlayed === 'string' ? raw.stats.lastPlayed : null;
    }
    if (typeof raw.lastDailyDate === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(raw.lastDailyDate)) {
      out.lastDailyDate = raw.lastDailyDate;
    }
    out.dailyStreak = nonNegInt(raw.dailyStreak, 0);
    out.dailyBestStreak = Math.max(out.dailyStreak, nonNegInt(raw.dailyBestStreak, 0));

    if (isPlainObject(raw.dailyCompletions)) {
      var dKeys = Object.keys(raw.dailyCompletions);
      for (var d = 0; d < dKeys.length; d++) {
        if (!/^\d{4}-\d{2}-\d{2}$/.test(dKeys[d])) continue;
        var dRec = raw.dailyCompletions[dKeys[d]];
        if (!isPlainObject(dRec)) continue;
        out.dailyCompletions[dKeys[d]] = {
          moves: Math.max(1, nonNegInt(dRec.moves, 1)),
          stars: Math.max(1, Math.min(3, nonNegInt(dRec.stars, 1))),
          rewardClaimed: dRec.rewardClaimed !== false
        };
      }
    }

    if (isPlainObject(raw.achievements)) {
      var aKeys = Object.keys(raw.achievements);
      for (var a = 0; a < aKeys.length; a++) {
        if (raw.achievements[aKeys[a]] === true) out.achievements[aKeys[a]] = true;
      }
    }

    if (Array.isArray(raw.unlockedThemes)) {
      out.unlockedThemes = raw.unlockedThemes.filter(function (t) { return typeof t === 'string' && t.length > 0; });
    }
    if (out.unlockedThemes.indexOf('classic') === -1) out.unlockedThemes.unshift('classic');

    if (typeof raw.activeTheme === 'string' && out.unlockedThemes.indexOf(raw.activeTheme) !== -1) {
      out.activeTheme = raw.activeTheme;
    }
    out.coins = nonNegInt(raw.coins, 0);
    out.hintBank = nonNegInt(raw.hintBank, 0);
    out.lastRewardedAdAt = nonNegInt(raw.lastRewardedAdAt, 0);
    if (isPlainObject(raw.rewardedMilestones)) {
      var mKeys = Object.keys(raw.rewardedMilestones);
      for (var m = 0; m < mKeys.length; m++) {
        if (raw.rewardedMilestones[mKeys[m]] === true) out.rewardedMilestones[mKeys[m]] = true;
      }
    }
    if (typeof raw.createdAt === 'string') out.createdAt = raw.createdAt;
    return out;
  }

  function load() {
    if (MEMORY) return clone(MEMORY);
    var raw = Utils.storage.get(Config.SAVE_KEY);
    var data = migrate(raw);
    MEMORY = data;
    PERSISTENT = Utils.storage.available();
    return clone(data);
  }

  function save(data) {
    MEMORY = data;
    data.updatedAt = new Date().toISOString();
    PERSISTENT = Utils.storage.set(Config.SAVE_KEY, data);
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
    isPersistent: function () { return PERSISTENT; },
    inMemory: function () { return MEMORY !== null; },

    exportSave: function () {
      return { version: Config.SAVE_VERSION, main: load(), daily: DailyStore.get() };
    },

    importSave: function (payload) {
      if (!isPlainObject(payload)) return false;
      var incoming = migrate(payload.main || payload);
      update(function (cur) {
        cur.highestUnlocked = Math.max(cur.highestUnlocked, incoming.highestUnlocked);
        cur.totalMoves = Math.max(cur.totalMoves, incoming.totalMoves);
        var lKeys = Object.keys(incoming.levels);
        for (var i = 0; i < lKeys.length; i++) {
          var id = lKeys[i], incRec = incoming.levels[id], curRec = cur.levels[id];
          if (!curRec) {
            cur.levels[id] = clone(incRec);
          } else {
            curRec.stars = Math.max(curRec.stars, incRec.stars);
            curRec.bestMoves = Math.min(curRec.bestMoves, incRec.bestMoves);
          }
        }
        var sum = 0, allKeys = Object.keys(cur.levels);
        for (var j = 0; j < allKeys.length; j++) sum += cur.levels[allKeys[j]].stars || 0;
        cur.totalStars = sum;

        var aKeys = Object.keys(incoming.achievements);
        for (var a = 0; a < aKeys.length; a++) cur.achievements[aKeys[a]] = true;

        for (var t = 0; t < incoming.unlockedThemes.length; t++) {
          if (cur.unlockedThemes.indexOf(incoming.unlockedThemes[t]) === -1) {
            cur.unlockedThemes.push(incoming.unlockedThemes[t]);
          }
        }
      });
      if (isPlainObject(payload.daily) && isPlainObject(payload.daily.completions)) {
        var dCur = DailyStore.get();
        var dKeys = Object.keys(payload.daily.completions);
        for (var k = 0; k < dKeys.length; k++) {
          if (!dCur.completions[dKeys[k]]) dCur.completions[dKeys[k]] = payload.daily.completions[dKeys[k]];
        }
        dCur.bestStreak = Math.max(dCur.bestStreak || 0, nonNegInt(payload.daily.bestStreak, 0));
        DailyStore.set(dCur);
      }
      return true;
    },

    levelRecord: function (levelId) {
      var d = load();
      return d.levels[levelId] || null;
    },

    isUnlocked: function (levelId) {
      return levelId <= load().highestUnlocked;
    },

    /* Record a completion. Returns info about the result. */
    completeLevel: function (levelId, moves, stars) {
      var result = { newStars: 0, improved: false, prevBest: null, unlockedNext: false, firstClear: false, coinsEarned: 0 };
      var data = update(function (d) {
        var rec = d.levels[levelId];
        if (!rec) {
          rec = { stars: 0, bestMoves: 0, completedAt: null };
          d.levels[levelId] = rec;
        }
        result.firstClear = rec.completedAt === null;
        result.prevBest = rec.bestMoves || null;
        var prevStars = rec.stars || 0;
        if (!rec.bestMoves || moves < rec.bestMoves) {
          rec.bestMoves = moves;
          result.improved = true;
        }
        if (stars > rec.stars) rec.stars = stars;
        rec.completedAt = new Date().toISOString();

        /* Award gameplay coins once per first clear / 3-star upgrade / milestone (no duplicate claims) */
        var econ = Config.ECONOMY || {};
        var earned = 0;
        if (result.firstClear) {
          earned += econ.levelClearCoins || 10;
          if (stars === 3) earned += econ.threeStarBonusCoins || 5;
        } else if (prevStars < 3 && stars === 3) {
          earned += econ.threeStarBonusCoins || 5;
        }
        if (Config.MILESTONES[levelId] && !d.rewardedMilestones[levelId]) {
          d.rewardedMilestones[levelId] = true;
          earned += econ.milestoneBonusCoins || 50;
        }
        if (earned > 0) {
          d.coins = (d.coins || 0) + earned;
          result.coinsEarned = earned;
        }

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
    },

    getCoins: function () { return load().coins || 0; },

    addCoins: function (amount) {
      var n = nonNegInt(amount, 0);
      if (n <= 0) return load().coins || 0;
      return update(function (d) { d.coins = (d.coins || 0) + n; }).coins;
    },

    spendCoins: function (amount) {
      var cost = nonNegInt(amount, 0);
      if (cost <= 0) return false;
      var ok = false;
      update(function (d) {
        if ((d.coins || 0) >= cost) {
          d.coins -= cost;
          ok = true;
        }
      });
      return ok;
    },

    getHintBank: function () { return load().hintBank || 0; },

    addHints: function (n) {
      var count = nonNegInt(n, 0);
      if (count <= 0) return load().hintBank || 0;
      return update(function (d) { d.hintBank = (d.hintBank || 0) + count; }).hintBank;
    },

    consumeHint: function () {
      var ok = false;
      update(function (d) {
        if ((d.hintBank || 0) > 0) {
          d.hintBank -= 1;
          ok = true;
        }
      });
      return ok;
    },

    getLastRewardedAdAt: function () { return load().lastRewardedAdAt || 0; },

    setLastRewardedAdAt: function (ts) {
      update(function (d) { d.lastRewardedAdAt = nonNegInt(ts, 0); });
    }
  };

  function sanitizeDaily(raw) {
    var out = { completions: {}, streak: 0, bestStreak: 0, lastDate: null };
    if (!isPlainObject(raw)) return out;
    if (isPlainObject(raw.completions)) {
      var keys = Object.keys(raw.completions);
      for (var i = 0; i < keys.length; i++) {
        if (!/^\d{4}-\d{2}-\d{2}$/.test(keys[i])) continue;
        var r = raw.completions[keys[i]];
        if (!isPlainObject(r)) continue;
        out.completions[keys[i]] = {
          moves: Math.max(1, nonNegInt(r.moves, 1)),
          stars: Math.max(1, Math.min(3, nonNegInt(r.stars, 1))),
          rewardClaimed: r.rewardClaimed !== false,
          claimedAt: typeof r.claimedAt === 'string' ? r.claimedAt : null,
          at: typeof r.at === 'string' ? r.at : null
        };
      }
    }
    out.streak = nonNegInt(raw.streak, 0);
    out.bestStreak = Math.max(out.streak, nonNegInt(raw.bestStreak, 0));
    if (typeof raw.lastDate === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(raw.lastDate)) {
      out.lastDate = raw.lastDate;
    }
    return out;
  }

  /* Daily challenge progress (kept under its own key so main progress is untouched) */
  var DailyStore = {
    get: function () {
      if (DAILY_MEMORY) return clone(DAILY_MEMORY);
      var raw = Utils.storage.get(Config.DAILY_KEY);
      DAILY_MEMORY = sanitizeDaily(raw);
      return clone(DAILY_MEMORY);
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
        if (isFirstClaim) {
          save.coins = (save.coins || 0) + ((Config.ECONOMY && Config.ECONOMY.dailyClearCoins) || 25);
        }
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