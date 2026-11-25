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

  function getStatus() {
    var d = today();
    var store = DailyStore.get();
    var rec = store.completions[d] || null;
    return {
      date: d,
      completed: !!rec,
      record: rec,
      streak: store.streak || 0,
      bestStreak: store.bestStreak || 0
    };
  }

  function completeToday(moves, stars) {
    var d = today();
    var res = DailyStore.markComplete(d, moves, stars);
    Cubiqo.Analytics.track('daily_completed', { date: d, moves: moves, stars: stars, streak: res.streak });
    return res;
  }

  Cubiqo.Daily = {
    today: today,
    getPuzzleForDate: getPuzzleForDate,
    getStatus: getStatus,
    completeToday: completeToday
  };
})(typeof window !== 'undefined' ? window : globalThis);
