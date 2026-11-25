/* =========================================================================
   CUBIQO: ARROW ESCAPE — hints.js
   Smart hint solver & future rewarded-ad flow (PRD §5 Screen 5).
   Always recommends a genuinely removable arrow — never an invalid move.
   ========================================================================= */
(function (global) {
  'use strict';

  var Cubiqo = global.Cubiqo = global.Cubiqo || {};
  var Puzzle = Cubiqo.Puzzle;
  var Config = Cubiqo.Config;

  /**
   * Pick the best currently removable arrow.
   * Prefers an arrow that unblocks the most other arrows when removed.
   */
  function pickValidHint(board) {
    var movable = Puzzle.removableArrows(board);
    if (!movable.length) return null;
    if (movable.length === 1) return movable[0];

    var bestArrow = movable[0];
    var bestScore = -1;
    var occ = Puzzle.occupancy(board);

    for (var i = 0; i < movable.length; i++) {
      var cand = movable[i];
      /* Count how many other active arrows are currently blocked by `cand` */
      var unblockedCount = 0;
      for (var j = 0; j < board.arrows.length; j++) {
        var other = board.arrows[j];
        if (other.id === cand.id || board.removed[other.id]) continue;
        var blockers = Puzzle.blockersFor(board, other, occ);
        for (var b = 0; b < blockers.length; b++) {
          if (blockers[b].id === cand.id) {
            unblockedCount++;
            break;
          }
        }
      }
      if (unblockedCount > bestScore) {
        bestScore = unblockedCount;
        bestArrow = cand;
      }
    }
    return bestArrow;
  }

  /**
   * Request a hint. In development mode (or when ads are disabled),
   * hints are immediately granted without advertising.
   */
  function requestHint(board) {
    if (Cubiqo.Network && !Cubiqo.Network.isOnline()) {
      return Promise.resolve({ ok: false, reason: 'offline' });
    }
    var arrow = pickValidHint(board);
    if (!arrow) return Promise.resolve({ ok: false, reason: 'none' });

    if (Cubiqo.Platform.isAvailable()) {
      Cubiqo.Analytics.track('hint_requested', { mode: 'rewarded' });
      return Cubiqo.Platform.showRewardedHint().then(function (rewarded) {
        if (rewarded !== true) return { ok: false, reason: 'ad-unavailable' };
        Cubiqo.Analytics.track('hint_rewarded');
        return { ok: true, arrow: arrow };
      });
    }

    if (Config.MONETIZATION.hintsFree && !Config.MONETIZATION.enabled) {
      Cubiqo.Analytics.track('hint_requested', { mode: 'free' });
      return Promise.resolve({ ok: true, arrow: arrow });
    }

    return Promise.resolve({ ok: false, reason: 'ad-unavailable' });
  }

  Cubiqo.Hints = {
    pickValidHint: pickValidHint,
    requestHint: requestHint
  };
})(typeof window !== 'undefined' ? window : globalThis);
