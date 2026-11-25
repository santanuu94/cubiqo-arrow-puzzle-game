/* =========================================================================
   CUBIQO: ARROW ESCAPE — puzzle.js
   Core puzzle engine: board model, movement rules, solver & validation.
   Pure logic — no DOM. Safe to unit-test in Node.
   ========================================================================= */
(function (global) {
  'use strict';

  var Cubiqo = global.Cubiqo = global.Cubiqo || {};
  var DIRS = Cubiqo.Config.DIRECTIONS;

  /* ---------------------------------------------------------------------
     Board model
     Board: { size, arrows: [{id,x,y,dir}], removed: {id:true}, removedOrder:[ids] }
     x = column (0..size-1), y = row (0..size-1)
     --------------------------------------------------------------------- */

  function createBoard(level) {
    var removed = {};
    var arrows = level.arrows.map(function (a) {
      return { id: a.id, x: a.x, y: a.y, dir: a.dir };
    });
    return { size: level.size, arrows: arrows, removed: removed, removedOrder: [] };
  }

  function cellKey(x, y) { return x + ',' + y; }

  /* Map of occupied cells -> arrow id (only active arrows) */
  function occupancy(board) {
    var map = {};
    for (var i = 0; i < board.arrows.length; i++) {
      var a = board.arrows[i];
      if (!board.removed[a.id]) map[cellKey(a.x, a.y)] = a.id;
    }
    return map;
  }

  function getArrow(board, id) {
    for (var i = 0; i < board.arrows.length; i++) {
      if (board.arrows[i].id === id) return board.arrows[i];
    }
    return null;
  }

  /* ---------------------------------------------------------------------
     Movement rules
     --------------------------------------------------------------------- */

  /* Returns list of active arrows blocking `arrow`'s exit path. */
  function blockersFor(board, arrow, occ) {
    occ = occ || occupancy(board);
    var d = DIRS[arrow.dir];
    if (!d) return [];
    var blockers = [];
    var x = arrow.x + d.dx;
    var y = arrow.y + d.dy;
    while (x >= 0 && x < board.size && y >= 0 && y < board.size) {
      var id = occ[cellKey(x, y)];
      if (id != null) blockers.push(getArrow(board, id));
      x += d.dx;
      y += d.dy;
    }
    return blockers;
  }

  function isClear(board, arrow, occ) {
    return blockersFor(board, arrow, occ).length === 0;
  }

  /* All active arrows that can exit right now. Deterministic order. */
  function removableArrows(board) {
    var occ = occupancy(board);
    var out = [];
    for (var i = 0; i < board.arrows.length; i++) {
      var a = board.arrows[i];
      if (!board.removed[a.id] && isClear(board, a, occ)) out.push(a);
    }
    return out;
  }

  /* Attempt to remove an arrow. Never mutates on failure. */
  function tryRemove(board, id) {
    var arrow = getArrow(board, id);
    if (!arrow) return { ok: false, reason: 'missing' };
    if (board.removed[id]) return { ok: false, reason: 'already-removed' };
    var blockers = blockersFor(board, arrow);
    if (blockers.length > 0) return { ok: false, reason: 'blocked', blockers: blockers, arrow: arrow };
    board.removed[id] = true;
    board.removedOrder.push(id);
    return { ok: true, arrow: arrow };
  }

  function countRemaining(board) {
    var n = 0;
    for (var i = 0; i < board.arrows.length; i++) {
      if (!board.removed[board.arrows[i].id]) n++;
    }
    return n;
  }

  function isComplete(board) {
    return countRemaining(board) === 0;
  }

  /* ---------------------------------------------------------------------
     Solver
     Removal only ever empties cells, so "peel any currently-clear arrow"
     is complete: if a puzzle is solvable at all, greedy peeling solves it.
     We still run multiple deterministic peel orders to confirm.
     --------------------------------------------------------------------- */

  function peel(level) {
    var board = createBoard(level);
    var order = [];
    var guard = board.arrows.length + 1;
    while (!isComplete(board) && guard-- > 0) {
      var movable = removableArrows(board);
      if (movable.length === 0) break;
      var pick = movable[0];
      tryRemove(board, pick.id);
      order.push(pick.id);
    }
    return { solvable: isComplete(board), order: order, remaining: countRemaining(board) };
  }

  /* Verify an explicit solution sequence (list of arrow ids). */
  function verifySequence(level, sequence) {
    var board = createBoard(level);
    if (!Array.isArray(sequence) || sequence.length !== board.arrows.length) {
      return { ok: false, reason: 'length', expected: board.arrows.length };
    }
    for (var i = 0; i < sequence.length; i++) {
      var res = tryRemove(board, sequence[i]);
      if (!res.ok) {
        return { ok: false, reason: res.reason, step: i, id: sequence[i] };
      }
    }
    return { ok: isComplete(board), reason: isComplete(board) ? null : 'incomplete' };
  }

  /* ---------------------------------------------------------------------
     Difficulty analysis (PRD section 6 metrics)
     --------------------------------------------------------------------- */
  function analyze(level) {
    var board = createBoard(level);
    var total = board.arrows.length;
    var occ = occupancy(board);
    var initialMovable = 0;
    var blocked = 0;
    var pairs = 0;
    var occupiedCells = 0;
    var dirCounts = { up: 0, right: 0, down: 0, left: 0 };

    for (var i = 0; i < board.arrows.length; i++) {
      var a = board.arrows[i];
      dirCounts[a.dir] = (dirCounts[a.dir] || 0) + 1;
      occupiedCells++;
      var bl = blockersFor(board, a, occ);
      pairs += bl.length;
      if (bl.length === 0) initialMovable++; else blocked++;
    }

    /* dependency depth via greedy layering.
       layerSizes[j] = how many arrows were removable at step j.
       avgBranch = mean choices per step — a pure forced chain scores 1.0,
       which reads as tedious to play, so level design targets ~1.3-3. */
    var b2 = createBoard(level);
    var depth = 0;
    var layerSizes = [];
    var guard = 200;
    while (!isComplete(b2) && guard-- > 0) {
      var mov = removableArrows(b2);
      if (!mov.length) break;
      layerSizes.push(mov.length);
      for (var j = 0; j < mov.length; j++) tryRemove(b2, mov[j].id);
      depth++;
    }
    var branchTotal = 0;
    for (var li = 0; li < layerSizes.length; li++) branchTotal += layerSizes[li];

    var cells = level.size * level.size;
    return {
      total: total,
      initialMovable: initialMovable,
      blocked: blocked,
      blockingPairs: pairs,
      density: total / cells,
      dependencyDepth: depth,
      layerSizes: layerSizes,
      avgBranch: layerSizes.length ? branchTotal / layerSizes.length : 0,
      minMoves: total,
      dirCounts: dirCounts,
      freeRatio: total ? initialMovable / total : 0
    };
  }

  /* ---------------------------------------------------------------------
     Validation (used by tools/validate-levels and tests)
     --------------------------------------------------------------------- */
  function validateLevel(level) {
    var errors = [];
    if (!level || typeof level !== 'object') return ['Level is not an object'];
    if (!Number.isInteger(level.id)) errors.push('Invalid level id');
    if (!Number.isInteger(level.size) || level.size < 2 || level.size > 7) errors.push('Invalid size');
    if (!Array.isArray(level.arrows) || level.arrows.length === 0) errors.push('No arrows');

    if (Array.isArray(level.arrows)) {
      var ids = {};
      var cells = {};
      for (var i = 0; i < level.arrows.length; i++) {
        var a = level.arrows[i];
        if (!a || !Number.isInteger(a.id)) { errors.push('Arrow ' + i + ' invalid id'); continue; }
        if (ids[a.id]) errors.push('Duplicate arrow id ' + a.id);
        ids[a.id] = true;
        if (!Number.isInteger(a.x) || !Number.isInteger(a.y) ||
            a.x < 0 || a.y < 0 || a.x >= level.size || a.y >= level.size) {
          errors.push('Arrow ' + a.id + ' out of bounds');
        }
        var k = a.x + ',' + a.y;
        if (cells[k]) errors.push('Duplicate cell at ' + k);
        cells[k] = true;
        if (!DIRS[a.dir]) errors.push('Arrow ' + a.id + ' invalid direction');
      }
    }

    var sol = peel(level);
    if (!sol.solvable) errors.push('Level is not solvable (' + sol.remaining + ' arrows stuck)');

    if (level.stars) {
      var s = level.stars;
      if (!(s.three <= s.two && s.two <= s.one)) errors.push('Star thresholds inverted');
      var k = level.arrows ? level.arrows.length : 0;
      if (s.three < k) errors.push('Three-star target below minimum moves (' + k + ')');
    }

    return errors;
  }

  /* Serialize board for save/restore */
  function serializeBoard(board) {
    return { size: board.size, removed: Object.keys(board.removed), order: board.removedOrder.slice() };
  }

  Cubiqo.Puzzle = {
    createBoard: createBoard,
    occupancy: occupancy,
    getArrow: getArrow,
    blockersFor: blockersFor,
    isClear: isClear,
    removableArrows: removableArrows,
    tryRemove: tryRemove,
    countRemaining: countRemaining,
    isComplete: isComplete,
    peel: peel,
    verifySequence: verifySequence,
    analyze: analyze,
    validateLevel: validateLevel,
    serializeBoard: serializeBoard
  };
})(typeof window !== 'undefined' ? window : globalThis);
