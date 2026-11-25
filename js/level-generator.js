/* =========================================================================
   CUBIQO: ARROW ESCAPE — level-generator.js
   Deterministic level construction engine.

   Design notes
   ------------
   Levels are NOT created by scattering random arrows and hoping. Instead the
   generator CONSTRUCTS the dependency graph explicitly:

     * A "chain" placement puts a new arrow directly in the forward path of an
       already-placed arrow, so the new arrow blocks the old one. This is what
       creates depth (forced ordering) rather than raw arrow count.
     * A "free" placement adds an arrow with no immediate dependency.

   Solvability guarantee
   ---------------------
   Invariant maintained during construction: an arrow's forward path never
   contains an arrow that was placed EARLIER. Therefore every blocking pair
   (X sits in Y's path) satisfies "X placed after Y", so removing arrows in
   strict reverse placement order is always a complete valid solution.

   A relaxed second pass may add extra arrows (only when the strict pass
   stalls), so every finished candidate is additionally verified with
   Cubiqo.Puzzle.peel() — the same oracle the game and the validator use.
   Candidates that fail are discarded.

   This module is shared by tools/generate-levels.mjs (main campaign) and
   js/daily.js (daily challenge). It has no DOM dependencies.
   ========================================================================= */
(function (global) {
  'use strict';

  var Cubiqo = global.Cubiqo = global.Cubiqo || {};
  var DIRS = Cubiqo.Config.DIRECTIONS;
  var DIR_LIST = Cubiqo.Config.DIRECTION_LIST; /* up, right, down, left */

  /* ---------------------------------------------------------------------
     Deterministic RNG
     --------------------------------------------------------------------- */

  function hashSeed(str) {
    var h = 2166136261 >>> 0;
    for (var i = 0; i < str.length; i++) {
      h ^= str.charCodeAt(i);
      h = Math.imul(h, 16777619) >>> 0;
    }
    return h >>> 0;
  }

  function mulberry32(seed) {
    var a = seed >>> 0;
    return function () {
      a = (a + 0x6D2B79F5) | 0;
      var t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function makeRng(seedString) {
    var rng = mulberry32(hashSeed(String(seedString)));
    rng.int = function (lo, hi) { return lo + Math.floor(rng() * (hi - lo + 1)); };
    rng.pick = function (arr) { return arr[Math.floor(rng() * arr.length)]; };
    rng.chance = function (p) { return rng() < p; };
    rng.shuffle = function (arr) {
      var a = arr.slice();
      for (var i = a.length - 1; i > 0; i--) {
        var j = Math.floor(rng() * (i + 1));
        var t = a[i]; a[i] = a[j]; a[j] = t;
      }
      return a;
    };
    return rng;
  }

  /* ---------------------------------------------------------------------
     Grid helpers
     --------------------------------------------------------------------- */

  function cellKey(x, y) { return x * 128 + y; }

  function pathCells(x, y, dir, size) {
    var d = DIRS[dir];
    var out = [];
    var nx = x + d.dx, ny = y + d.dy;
    while (nx >= 0 && nx < size && ny >= 0 && ny < size) {
      out.push([nx, ny]);
      nx += d.dx;
      ny += d.dy;
    }
    return out;
  }

  /* ---------------------------------------------------------------------
     Candidate construction
     --------------------------------------------------------------------- */

  /**
   * Builds one candidate board.
   *
   * opts:
   *   size       board edge length (square)
   *   count      target arrow count
   *   chainBias  0..1 — how often to extend an existing dependency chain
   *   spiral     true to seed the board with a spiral chain motif
   *   rng        seeded random source
   */
  function buildCandidate(opts) {
    var rng = opts.rng;
    var size = opts.size;
    var count = opts.count;
    var chainBias = opts.chainBias == null ? 0.68 : opts.chainBias;

    var grid = {};          /* cellKey -> arrow {x,y,dir} */
    var placed = [];        /* placement-ordered list of arrows */
    var freeCells = [];

    function occupied(x, y) { return !!grid[cellKey(x, y)]; }

    function refreshFreeCells() {
      freeCells = [];
      for (var x = 0; x < size; x++) {
        for (var y = 0; y < size; y++) {
          if (!occupied(x, y)) freeCells.push([x, y]);
        }
      }
    }

    function put(x, y, dir) {
      var a = { x: x, y: y, dir: dir };
      grid[cellKey(x, y)] = a;
      placed.push(a);
      return a;
    }

    /* Directions whose forward path contains no already-placed arrow.
       `allowZero` permits arrows that already sit on the exit edge (they can
       never be blocked, so they are only used as a last resort). */
    function eligibleDirs(x, y, allowZero) {
      var out = [];
      for (var i = 0; i < DIR_LIST.length; i++) {
        var dir = DIR_LIST[i];
        var cells = pathCells(x, y, dir, size);
        if (!cells.length && !allowZero) continue;
        var clean = true;
        for (var j = 0; j < cells.length; j++) {
          if (occupied(cells[j][0], cells[j][1])) { clean = false; break; }
        }
        if (clean) out.push({ dir: dir, len: cells.length });
      }
      return out;
    }

    function chooseDir(x, y, allowZero, preferAwayFrom) {
      var opts2 = eligibleDirs(x, y, allowZero);
      if (!opts2.length) return null;
      /* Prefer directions with a long open path: those arrows can later be
         blocked, which is what deepens the dependency chain. */
      var maxLen = 0;
      for (var i = 0; i < opts2.length; i++) {
        if (opts2[i].len > maxLen) maxLen = opts2[i].len;
      }
      /* Keep only the longest ones (plus one shorter for variety). */
      var best = [];
      for (var j = 0; j < opts2.length; j++) {
        if (opts2[j].len === maxLen) best.push(opts2[j]);
        else if (opts2[j].len === maxLen - 1) best.push(opts2[j]);
      }
      /* Avoid repeating the direction the arrow is blocking (visual clarity). */
      var filtered = best.filter(function (o) { return o.dir !== preferAwayFrom; });
      var pool = filtered.length ? filtered : best;
      return rng.pick(pool).dir;
    }

    /* --- Spiral motif (seeded chain around the board) --- */
    function seedSpiral() {
      var cells = [];
      var top = 0, bottom = size - 1, left = 0, right = size - 1;
      var goRight = true, goDown = true;
      while (top <= bottom && left <= right) {
        var i;
        if (goRight) { for (i = left; i <= right; i++) cells.push([i, top]); }
        top++;
        if (goDown) { for (i = top; i <= bottom; i++) cells.push([right, i]); }
        right--;
        if (top <= bottom) { for (i = right; i >= left; i--) cells.push([i, bottom]); }
        bottom--;
        if (left <= right) { for (i = bottom; i >= top; i--) cells.push([left, i]); }
        left++;
        goRight = !goRight; goDown = !goDown;
        if (cells.length >= size * size) break;
      }
      /* Lay a chain along the spiral: each arrow points at the next cell and
         is blocked by it. */
      var placedCount = Math.min(cells.length, Math.max(3, Math.round(size * 2)));
      for (var s = 0; s < placedCount; s++) {
        var cur = cells[s];
        var nxt = cells[s + 1] || cells[s];
        var dir = dirBetween(cur, nxt);
        if (dir == null) continue;
        var d2 = chooseDir(cur[0], cur[1], false, dir);
        if (d2 == null) continue;
        /* The arrow must actually point along the spiral to block its
           neighbour, so force the spiral direction when it is legal. */
        var legal = eligibleDirs(cur[0], cur[1], false).some(function (o) { return o.dir === dir; });
        put(cur[0], cur[1], legal ? dir : d2);
      }
    }

    function dirBetween(a, b) {
      for (var i = 0; i < DIR_LIST.length; i++) {
        var d = DIRS[DIR_LIST[i]];
        if (a[0] + d.dx === b[0] && a[1] + d.dy === b[1]) return DIR_LIST[i];
      }
      return null;
    }

    /* --- Main construction loop --- */
    refreshFreeCells();

    if (opts.spiral) seedSpiral();

    var attempts = 0;
    var maxAttempts = Math.max(400, count * 260);

    while (placed.length < count && attempts < maxAttempts) {
      attempts++;
      refreshFreeCells();
      if (!freeCells.length) break;

      var didPlace = false;

      /* Strategy A — extend a dependency chain.
         Place a new arrow inside an existing arrow's forward path so the new
         arrow becomes that arrow's blocker.

         The anchor is biased towards recently placed arrows: extending the
         newest chain is what produces long, serial dependencies (and hence
         depth) instead of a web of shallow two-way dependencies. */
      if (placed.length && rng.chance(chainBias)) {
        var anchor;
        if (rng.chance(0.55)) {
          var recentFrom = Math.floor(placed.length * 0.7);
          anchor = placed[rng.int(recentFrom, placed.length - 1)];
        } else {
          anchor = placed[rng.int(0, placed.length - 1)];
        }
        var pCells = pathCells(anchor.x, anchor.y, anchor.dir, size);
        var freeOnPath = pCells.filter(function (c) { return !occupied(c[0], c[1]); });
        if (freeOnPath.length) {
          /* Bias toward the far end of the path: visually clearer chains and
             they tend to organise the board rather than bunch up. */
          var idx = rng.chance(0.55) ? freeOnPath.length - 1 : rng.int(0, freeOnPath.length - 1);
          var cell = freeOnPath[idx];
          var d = chooseDir(cell[0], cell[1], false, anchor.dir);
          if (d) { put(cell[0], cell[1], d); didPlace = true; }
        }
      }

      /* Strategy B — free placement (no immediate dependency). */
      if (!didPlace) {
        var c2 = freeCells[rng.int(0, freeCells.length - 1)];
        var d2 = chooseDir(c2[0], c2[1], false, null);
        if (d2) { put(c2[0], c2[1], d2); didPlace = true; }
      }
    }

    /* Relaxed pass: fill remaining target count even if the strict invariant
       would be broken. Every candidate is validated afterwards, so this can
       never produce an unsolvable level — it only risks being rejected. */
    if (placed.length < count) {
      var extra = 0;
      while (placed.length < count && extra < count * 40) {
        extra++;
        refreshFreeCells();
        if (!freeCells.length) break;
        var c3 = freeCells[rng.int(0, freeCells.length - 1)];
        var d3 = chooseDir(c3[0], c3[1], true, null);
        if (!d3) continue;
        put(c3[0], c3[1], d3);
      }
    }

    return {
      size: size,
      arrows: placed.map(function (a, i) {
        return { id: i, x: a.x, y: a.y, dir: a.dir };
      })
    };
  }

  /* ---------------------------------------------------------------------
     Difficulty scoring
     --------------------------------------------------------------------- */

  /**
   * Matches a candidate against a target profile.
   * Higher is better. The terms mirror the PRD §6 difficulty metrics:
   * minimum solution length, initially removable arrows, blocking
   * relationships, plausible wrong moves, density and dependency depth.
   */
  function scoreCandidate(level, target) {
    var a = Cubiqo.Puzzle.analyze(level);
    var penalty = 0;

    penalty += Math.abs(a.dependencyDepth - target.depth) * target.depthWeight;
    penalty += Math.abs(a.total - target.arrows) * target.arrowWeight;
    penalty += Math.abs(a.initialMovable - target.initialMovable) * target.branchWeight;
    penalty += Math.abs(a.density - target.density) * 60;

    /* Reward a healthy number of choices per step — a pure forced chain is
       tedious to play, so we prefer a little branching. */
    var branch = a.avgBranch || 1;
    if (branch < target.minBranch) penalty += (target.minBranch - branch) * 2.5;

    /* Reward authentic blocking structure. */
    penalty -= a.blockingPairs * 0.12;

    return -penalty;
  }

  /* ---------------------------------------------------------------------
     Level profiles (PRD §6 difficulty bands)
     --------------------------------------------------------------------- */

  /* Board sizes follow the PRD §6 bands exactly:
       3×3 for the learning phase, 4×4 for beginner/intermediate,
       5×5 for advanced-intermediate/advanced, 6×6 for expert,
       7×7 for the master challenge. */
  var PROFILES = [
    {
      name: 'learning', from: 1, to: 10,
      size: [3, 3], arrows: [2, 6], depth: [1, 3],
      initialMovable: [2, 4], density: [0.22, 0.67], minBranch: 1.4,
      chainBias: [0.42, 0.60], spiral: false, maxDensity: 0.70,
      depthWeight: 2.4, arrowWeight: 1.8, branchWeight: 1.0,
      starSlack: { three: 2, two: 0.40, one: 0.80 }
    },
    {
      name: 'beginner', from: 11, to: 20,
      size: [4, 4], arrows: [5, 10], depth: [3, 5],
      initialMovable: [2, 4], density: [0.31, 0.63], minBranch: 1.5,
      chainBias: [0.55, 0.70], spiral: false, maxDensity: 0.68,
      depthWeight: 2.2, arrowWeight: 1.6, branchWeight: 1.2,
      starSlack: { three: 1, two: 0.35, one: 0.75 }
    },
    {
      name: 'intermediate', from: 21, to: 35,
      size: [4, 4], arrows: [9, 12], depth: [5, 7],
      initialMovable: [1, 3], density: [0.50, 0.75], minBranch: 1.4,
      chainBias: [0.60, 0.74], spiral: false, maxDensity: 0.76,
      depthWeight: 2.2, arrowWeight: 1.5, branchWeight: 1.4,
      starSlack: { three: 1, two: 0.35, one: 0.75 }
    },
    {
      name: 'advanced-intermediate', from: 36, to: 50,
      size: [5, 5], arrows: [12, 16], depth: [7, 9],
      initialMovable: [1, 3], density: [0.48, 0.64], minBranch: 1.3,
      chainBias: [0.62, 0.76], spiral: false, maxDensity: 0.66,
      depthWeight: 2.0, arrowWeight: 1.4, branchWeight: 1.6,
      starSlack: { three: 1, two: 0.35, one: 0.80 }
    },
    {
      name: 'advanced', from: 51, to: 70,
      size: [5, 5], arrows: [15, 18], depth: [9, 11],
      initialMovable: [1, 3], density: [0.60, 0.72], minBranch: 1.3,
      chainBias: [0.64, 0.78], spiral: false, maxDensity: 0.72,
      depthWeight: 1.8, arrowWeight: 1.3, branchWeight: 1.8,
      starSlack: { three: 1, two: 0.35, one: 0.85 }
    },
    {
      name: 'expert', from: 71, to: 90,
      size: [6, 6], arrows: [16, 23], depth: [11, 14],
      initialMovable: [1, 3], density: [0.44, 0.64], minBranch: 1.2,
      chainBias: [0.62, 0.78], spiral: false, maxDensity: 0.64,
      depthWeight: 1.6, arrowWeight: 1.2, branchWeight: 2.0,
      starSlack: { three: 1, two: 0.40, one: 0.90 }
    },
    {
      name: 'master', from: 91, to: 100,
      size: [7, 7], arrows: [19, 28], depth: [14, 18],
      initialMovable: [1, 3], density: [0.39, 0.58], minBranch: 1.2,
      chainBias: [0.60, 0.80], spiral: true, maxDensity: 0.60,
      depthWeight: 1.5, arrowWeight: 1.1, branchWeight: 2.2,
      starSlack: { three: 1, two: 0.45, one: 0.95 }
    }
  ];

  function profileForLevel(id) {
    for (var i = 0; i < PROFILES.length; i++) {
      if (id >= PROFILES[i].from && id <= PROFILES[i].to) return PROFILES[i];
    }
    return PROFILES[PROFILES.length - 1];
  }

  function lerp(a, b, t) { return a + (b - a) * t; }

  /* Interpolate the profile band for a specific id so difficulty ramps
     smoothly inside each phase instead of jumping. */
  function targetFor(id) {
    var p = profileForLevel(id);
    var span = p.to - p.from;
    var t = span > 0 ? (id - p.from) / span : 0;
    return {
      size: Math.round(lerp(p.size[0], p.size[1], t)),
      arrows: Math.round(lerp(p.arrows[0], p.arrows[1], t)),
      depth: Math.round(lerp(p.depth[0], p.depth[1], t)),
      initialMovable: Math.round(lerp(p.initialMovable[0], p.initialMovable[1], t)),
      density: lerp(p.density[0], p.density[1], t),
      minBranch: p.minBranch,
      chainBias: lerp(p.chainBias[0], p.chainBias[1], t),
      spiral: p.spiral && t > 0.30,
      maxDensity: p.maxDensity,
      depthWeight: p.depthWeight,
      arrowWeight: p.arrowWeight,
      branchWeight: p.branchWeight,
      starSlack: p.starSlack
    };
  }

  /* ---------------------------------------------------------------------
     Star targets
     --------------------------------------------------------------------- */

  /* Star thresholds are absolute move counts (the number of taps the player
     makes, including taps that were blocked). The perfect run costs exactly
     `arrowCount` moves, so the three-star target sits just above it and the
     lower tiers widen out. */
  function starTargets(arrowCount, slack) {
    var three = arrowCount + Math.max(1, Math.round(slack.three));
    var two = Math.max(arrowCount + Math.ceil(arrowCount * slack.two), three + 1);
    var one = Math.max(arrowCount + Math.ceil(arrowCount * slack.one), two + 1);
    return { three: three, two: two, one: one };
  }

  function starsForMoves(moves, targets) {
    if (moves <= targets.three) return 3;
    if (moves <= targets.two) return 2;
    if (moves <= targets.one) return 1;
    return 1; /* still a completion, just no bonus */
  }

  /* ---------------------------------------------------------------------
     Public generation API
     --------------------------------------------------------------------- */

  /**
   * Generates one validated level for a given id.
   *
   * options:
   *   tries        candidate attempts (default 300)
   *   seed         seed string; override for a different candidate stream
   *   constraints  { size, minArrows, maxArrows, minDepth, maxDepth,
   *                  minInitialMovable } — hard bounds used by the campaign
   *                  builder to keep difficulty monotonic across levels.
   */
  function generateLevel(id, options) {
    options = options || {};
    var target = targetFor(id);
    var constraints = options.constraints || {};
    var tries = options.tries || 300;
    var seed = options.seed || ('cubiqo-lv-' + id);

    var size = constraints.size || target.size;
    var capacity = size * size;
    var maxArrows = Math.max(2, Math.min(
      constraints.maxArrows != null ? constraints.maxArrows : target.arrows + 1,
      Math.floor(capacity * target.maxDensity)
    ));
    var minArrows = Math.max(2, Math.min(
      constraints.minArrows != null ? constraints.minArrows : target.arrows - 1,
      maxArrows
    ));
    var minDepth = constraints.minDepth != null ? constraints.minDepth : null;
    var maxDepth = constraints.maxDepth != null ? constraints.maxDepth : null;
    var minMovable = constraints.minInitialMovable != null ? constraints.minInitialMovable : null;
    var maxMovable = constraints.maxInitialMovable != null ? constraints.maxInitialMovable : null;

    var best = null;
    var bestScore = -Infinity;
    var bestRelaxed = null;
    var bestRelaxedScore = -Infinity;
    /* The relaxed fallback is ranked against the profile ideal, so the
       fallback still prefers a well-shaped board. */
    var relaxedTarget = {
      size: size, arrows: target.arrows, depth: target.depth,
      initialMovable: target.initialMovable, density: target.arrows / capacity,
      minBranch: target.minBranch, depthWeight: target.depthWeight,
      arrowWeight: target.arrowWeight, branchWeight: target.branchWeight
    };

    for (var t = 0; t < tries; t++) {
      var rng = makeRng(seed + '|' + t);
      var count = rng.int(minArrows, maxArrows);

      var cand = buildCandidate({
        rng: rng,
        size: size,
        count: count,
        chainBias: target.chainBias + (t % 5 === 0 ? 0.08 : 0),
        spiral: target.spiral && (t % 3 !== 0)
      });

      if (!cand.arrows.length) continue;

      /* Authoritative solvability check with the game's own solver. */
      var sol = Cubiqo.Puzzle.peel(cand);
      if (!sol.solvable) continue;

      var stats = Cubiqo.Puzzle.analyze(cand);
      /* Anchor the count/density terms to the MIDPOINT of the feasible band.
         Anchoring them to the candidate's own numbers would make those
         penalties identically zero and steer nothing. */
      var idealArrows = (minArrows + maxArrows) / 2;
      var adjTarget = {
        size: size, arrows: idealArrows, depth: target.depth,
        initialMovable: target.initialMovable, density: idealArrows / capacity,
        minBranch: target.minBranch, depthWeight: target.depthWeight,
        arrowWeight: target.arrowWeight, branchWeight: target.branchWeight
      };
      var sc = scoreCandidate(cand, adjTarget);

      /* Keep an unconstrained fallback so a level is never lost purely
         because the hard bounds were too tight. */
      var relaxedScore = scoreCandidate(cand, relaxedTarget);
      if (relaxedScore > bestRelaxedScore) {
        bestRelaxedScore = relaxedScore;
        bestRelaxed = { cand: cand, sol: sol, stats: stats };
      }

      if (minDepth != null && stats.dependencyDepth < minDepth) continue;
      if (maxDepth != null && stats.dependencyDepth > maxDepth) continue;
      if (minMovable != null && stats.initialMovable < minMovable) continue;
      if (maxMovable != null && stats.initialMovable > maxMovable) continue;

      if (sc > bestScore) {
        bestScore = sc;
        best = { cand: cand, sol: sol, stats: stats };
      }
    }

    var chosen = best || bestRelaxed;
    if (!chosen) return null;

    var lv = chosen.cand;
    var stars = starTargets(lv.arrows.length, target.starSlack);
    lv.id = id;
    lv.stars = stars;
    lv.profile = profileForLevel(id).name;
    lv.solution = chosen.sol.order.slice();
    lv.stats = {
      depth: chosen.stats.dependencyDepth,
      initialMovable: chosen.stats.initialMovable,
      avgBranch: Number(chosen.stats.avgBranch.toFixed(2)),
      density: Number(chosen.stats.density.toFixed(3)),
      blockingPairs: chosen.stats.blockingPairs
    };
    lv.constrained = !!best;
    return lv;
  }

  /**
   * Deterministic daily puzzle for a given date key (YYYY-MM-DD).
   * Uses the same generator with a date-derived seed, so every player sees
   * the same puzzle on the same day.
   */
  function generateDaily(dateKey) {
    var seed = 'cubiqo-daily-' + dateKey;
    var target = {
      size: 5, arrows: 14, depth: 5, initialMovable: 2, density: 14 / 25,
      minBranch: 1.3, depthWeight: 2, arrowWeight: 1.2, branchWeight: 1.8,
      chainBias: 0.68, spiral: false
    };
    var best = null, bestScore = -Infinity;
    for (var t = 0; t < 200; t++) {
      var rng = makeRng(seed + '|' + t);
      var size = target.size;
      var count = Math.max(10, Math.min(19, target.arrows + rng.int(-2, 2)));
      var cand = buildCandidate({
        rng: rng, size: size, count: count,
        chainBias: target.chainBias, spiral: t % 5 === 0
      });
      if (!cand.arrows.length) continue;
      var sol = Cubiqo.Puzzle.peel(cand);
      if (!sol.solvable) continue;
      var adj = {
        size: size, arrows: count, depth: target.depth,
        initialMovable: target.initialMovable, density: count / (size * size),
        minBranch: target.minBranch, depthWeight: target.depthWeight,
        arrowWeight: target.arrowWeight, branchWeight: target.branchWeight
      };
      var sc = scoreCandidate(cand, adj);
      if (sc > bestScore) { bestScore = sc; best = cand; best._sol = sol; }
    }
    if (!best) return null;
    var stars = starTargets(best.arrows.length, { three: 2, two: 0.45, one: 1.0 });
    best.id = 'daily-' + dateKey;
    best.stars = stars;
    best.profile = 'daily';
    best.solution = best._sol.order.slice();
    delete best._sol;
    return best;
  }

  Cubiqo.LevelGenerator = {
    makeRng: makeRng,
    hashSeed: hashSeed,
    pathCells: pathCells,
    buildCandidate: buildCandidate,
    scoreCandidate: scoreCandidate,
    starTargets: starTargets,
    starsForMoves: starsForMoves,
    profileForLevel: profileForLevel,
    targetFor: targetFor,
    generateLevel: generateLevel,
    generateDaily: generateDaily,
    PROFILES: PROFILES
  };
})(typeof window !== 'undefined' ? window : globalThis);
