/* =========================================================================
   tools/generate-levels.mjs
   Authors the 100 main-campaign levels and writes them to js/levels.js.

   Usage:
     npm run levels            # regenerate js/levels.js
     npm run levels -- --report
   ========================================================================= */
import fs from 'node:fs';
import path from 'node:path';
import { loadGame, ROOT } from './_load.mjs';

const Cubiqo = loadGame();
const Config = Cubiqo.Config;
const Puzzle = Cubiqo.Puzzle;
const Gen = Cubiqo.LevelGenerator;
const DIR_LIST = Config.DIRECTION_LIST;

const args = process.argv.slice(2);
const REPORT_ONLY = args.includes('--report');

/* ------------------------------------------------------------------ */

/* ------------------------------------------------------------------ */

/* Normalised signature of a board, used to reject duplicate levels. */
function signature(lv) {
  const cells = lv.arrows
    .map((a) => `${a.x},${a.y},${a.dir}`)
    .sort()
    .join('|');
  return `${lv.size}#${cells}`;
}

function build() {
  const levels = [];
  const problems = [];
  const warnings = [];
  const seen = new Map();

  /* Running floors keep the campaign monotonic: neither the arrow count nor
     the dependency depth is allowed to drop as the player advances. */
  let floorArrows = 2;
  let floorDepth = 1;

  for (let id = 1; id <= Config.TOTAL_LEVELS; id++) {
    const target = Gen.targetFor(id);
    const profile = Gen.profileForLevel(id);

    let level = null;
    let attempts = 0;
    let usedLadder = -1;

    /* Tight bounds first; loosen them only if nothing satisfies the ideal
       progression, so the final campaign never has an impossible step. */
    const looseFree = Math.max(profile.initialMovable[1], 3);
    const ladders = [
      {
        minArrows: Math.max(floorArrows, target.arrows - 1),
        maxArrows: Math.max(target.arrows + 1, floorArrows),
        minDepth: floorDepth,
        maxDepth: target.depth + 2,
        minInitialMovable: profile.name === 'learning' ? 2 : 1,
        maxInitialMovable: looseFree
      },
      {
        minArrows: Math.max(floorArrows, target.arrows - 2),
        maxArrows: Math.max(target.arrows + 2, floorArrows + 1),
        minDepth: Math.max(1, floorDepth - 1),
        maxDepth: target.depth + 3,
        minInitialMovable: 1,
        maxInitialMovable: looseFree + 1
      },
      {
        minArrows: floorArrows,
        maxArrows: Math.max(target.arrows + 3, floorArrows + 2),
        minDepth: 1,
        maxDepth: target.depth + 4,
        minInitialMovable: null,
        maxInitialMovable: looseFree + 2
      }
    ];

    for (let li = 0; li < ladders.length && !level; li++) {
      const lad = ladders[li];
      for (let a = 0; a < 3 && !level; a++) {
        attempts++;
        const candidate = Gen.generateLevel(id, {
          tries: 320,
          seed: `cubiqo-lv-${id}-${attempts}`,
          constraints: {
            size: target.size,
            minArrows: lad.minArrows,
            maxArrows: lad.maxArrows,
            minDepth: lad.minDepth,
            maxDepth: lad.maxDepth,
            minInitialMovable: lad.minInitialMovable,
            maxInitialMovable: lad.maxInitialMovable
          }
        });
        if (!candidate) continue;
        if (!candidate.constrained) continue; /* did not satisfy this ladder */
        const sig = signature(candidate);
        if (seen.has(sig)) continue; /* duplicate board */
        level = candidate;
        usedLadder = li;
        seen.set(sig, id);
      }
    }

    if (usedLadder > 0) {
      warnings.push(
        `Level ${id}: needed relaxed ladder ${usedLadder + 1} ` +
        `(depth ${level && level.stats ? level.stats.depth : '?'} vs floor ${floorDepth})`
      );
    }

    if (!level) {
      /* Last resort: unconstrained generation so the campaign always has 100
         levels. Warning is recorded so it can be tuned. */
      level = Gen.generateLevel(id, { tries: 400, seed: `cubiqo-lv-${id}-fallback` });
      if (level) warnings.push(`Level ${id}: fell back to an unconstrained board`);
    }
    if (!level) {
      problems.push(`Level ${id}: generation failed`);
      continue;
    }

    const errors = Puzzle.validateLevel(level);
    if (errors.length) {
      problems.push(`Level ${id}: ${errors.join('; ')}`);
      continue;
    }

    /* Independent re-verification of the stored solution sequence. */
    const check = Puzzle.verifySequence(level, level.solution);
    if (!check.ok) {
      problems.push(`Level ${id}: stored solution failed verification (${check.reason} @ step ${check.step})`);
      continue;
    }

    levels.push(level);
    floorArrows = Math.max(floorArrows, level.arrows.length);
    floorDepth = Math.max(floorDepth, level.stats.depth);
  }

  return { levels, problems, warnings };
}

/* ------------------------------------------------------------------ */

function serialize(levels) {
  const rows = levels.map((lv) => {
    const arrows = lv.arrows
      .map((a) => `[${a.x},${a.y},${DIR_LIST.indexOf(a.dir)}]`)
      .join(',');
    const s = lv.stars;
    return `  { id: ${lv.id}, size: ${lv.size}, stars: [${s.one},${s.two},${s.three}], arrows: [${arrows}] }`;
  });

  return `/* =========================================================================
   CUBIQO: ARROW ESCAPE — levels.js
   GENERATED FILE — regenerate with:  npm run levels
   Validate with:                   npm run validate

   100 hand-tuned, solver-verified puzzle configurations (PRD §6).

   arrow tuple = [x, y, directionIndex]
     x = column (0 .. size-1)
     y = row    (0 .. size-1)
     directionIndex: 0 = up, 1 = right, 2 = down, 3 = left

   stars = [oneStarMaxMoves, twoStarMaxMoves, threeStarMaxMoves]
     A level is complete when every arrow has exited; extra moves are the
     blocked taps the player made along the way.
   ========================================================================= */
(function (global) {
  'use strict';
  var Cubiqo = global.Cubiqo = global.Cubiqo || {};

  var DATA = [
${rows.join(',\n')}
  ];

  var DIRECTIONS = ['up', 'right', 'down', 'left'];

  /* Expand the compact tuples into full arrow records with stable ids. */
  function expand(raw) {
    return raw.map(function (lv) {
      return {
        id: lv.id,
        size: lv.size,
        stars: { one: lv.stars[0], two: lv.stars[1], three: lv.stars[2] },
        arrows: lv.arrows.map(function (t, i) {
          return { id: i, x: t[0], y: t[1], dir: DIRECTIONS[t[2]] };
        })
      };
    });
  }

  Cubiqo.Levels = {
    TOTAL: DATA.length,
    RAW: DATA,
    LIST: expand(DATA),
    byId: function (id) {
      for (var i = 0; i < DATA.length; i++) if (DATA[i].id === id) return expand([DATA[i]])[0];
      return null;
    }
  };
})(typeof window !== 'undefined' ? window : globalThis);
`;
}

function report(levels) {
  const rows = [];
  rows.push('lvl  prof                  size arrows depth init branch density  stars(1/2/3)');
  rows.push('---  --------------------  ---- ------ ----- ---- ------ -------  ------------');
  for (const lv of levels) {
    const a = Puzzle.analyze(lv);
    rows.push(
      String(lv.id).padStart(3) + '  ' +
      (lv.profile || '').padEnd(22) + ' ' +
      String(lv.size).padStart(4) + ' ' +
      String(a.total).padStart(6) + ' ' +
      String(a.dependencyDepth).padStart(5) + ' ' +
      String(a.initialMovable).padStart(4) + ' ' +
      a.avgBranch.toFixed(2).padStart(6) + ' ' +
      a.density.toFixed(2).padStart(7) + '  ' +
      `${lv.stars.one}/${lv.stars.two}/${lv.stars.three}`
    );
  }
  console.log(rows.join('\n'));
}

/* ------------------------------------------------------------------ */

const { levels, problems, warnings } = build();

console.log(`Generated ${levels.length}/${Config.TOTAL_LEVELS} levels.`);
if (warnings.length) {
  console.warn('\nWARNINGS:');
  warnings.forEach((p) => console.warn('  ~ ' + p));
}
if (problems.length) {
  console.error('\nPROBLEMS:');
  problems.forEach((p) => console.error('  ! ' + p));
}

if (levels.length && !REPORT_ONLY) {
  const out = path.join(ROOT, 'js', 'levels.js');
  fs.writeFileSync(out, serialize(levels), 'utf8');
  console.log(`Wrote ${path.relative(ROOT, out)} (${fs.statSync(out).size} bytes).`);
}

if (levels.length) report(levels);

process.exit(problems.length || levels.length !== Config.TOTAL_LEVELS ? 1 : 0);
