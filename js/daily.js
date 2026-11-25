/* =========================================================================
   CUBIQO: ARROW ESCAPE — daily.js
   Date-based deterministic Daily Challenge manager (PRD §5 Screen 8).
   Kept separate from the 100-level campaign unlocking system.
   ========================================================================= */
(function (global) {
  'use strict';

  var Cubiqo = global.Cubiqo = global.Cubiqo || {};
  var Utils = Cubiqo.Utils;
  var Gen = Cubiqo.LevelGenerator;
  var DailyStore = Cubiqo.DailyStore;

  function today() {
    return Utils.todayKey();
  }

  function getPuzzleForDate(dateKey) {
    return Gen.generateDaily(dateKey || today());
  }

  function getStatus(dateKey) {
    var d = dateKey || today();
    var store = DailyStore.get();
    var rec = store.completions[d] || null;
    var gap = store.lastDate ? Utils.daysBetween(store.lastDate, d) : Infinity;
    var effectiveStreak = (gap === 0 || gap === 1) ? (store.streak || 0) : 0;
    return {
      date: d,
      completed: !!rec,
      rewardClaimed: !!(rec && rec.rewardClaimed !== false),
      record: rec,
      streak: effectiveStreak,
      bestStreak: store.bestStreak || 0,
      totalCompleted: Object.keys(store.completions).length
    };
  }

  function completeToday(moves, stars, dateKey) {
    var d = dateKey || today();
    var res = DailyStore.markComplete(d, moves, stars);
    Cubiqo.Analytics.track('daily_completed', {
      date: d,
      moves: moves,
      stars: stars,
      streak: res.streak,
      firstClaim: !!res.isFirstClaim
    });
    return res;
  }

  Cubiqo.Daily = {
    today: today,
    getPuzzleForDate: getPuzzleForDate,
    getStatus: getStatus,
    completeToday: completeToday
  };
})(typeof window !== 'undefined' ? window : globalThis);
