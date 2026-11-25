import type { Arrow, Direction } from '../src/engine/types.ts';
import { canArrowExit, buildGrid, removeArrow, calculateStars, getHint, validateLevel } from '../src/engine/puzzle.ts';
import { levels, getDailyLevel } from '../src/data/levels.ts';

let passed = 0;
let failed = 0;

function assert(condition: boolean, msg: string): void {
  if (condition) {
    passed++;
  } else {
    failed++;
    console.error(`❌ Assertion failed: ${msg}`);
  }
}

console.log('🧪 Running CUBIQO Comprehensive Test Suite...\n');

// ── Test 1: Directional exit checks ──────────────────────────
{
  const testArrows: Arrow[] = [
    { id: 1, row: 0, col: 1, direction: 'up', color: 'blue', active: true },
    { id: 2, row: 1, col: 1, direction: 'up', color: 'red', active: true },
    { id: 3, row: 2, col: 0, direction: 'left', color: 'green', active: true },
    { id: 4, row: 2, col: 2, direction: 'right', color: 'yellow', active: true },
  ];
  const grid = buildGrid(testArrows, 3);

  // Arrow 1 (0,1) pointing up: exit is row -1, path is clear!
  assert(canArrowExit(testArrows[0], grid, 3) === true, 'Arrow 1 (0,1) pointing up should exit freely');

  // Arrow 2 (1,1) pointing up: blocked by Arrow 1 at (0,1)!
  assert(canArrowExit(testArrows[1], grid, 3) === false, 'Arrow 2 (1,1) pointing up should be blocked by (0,1)');

  // Arrow 3 (2,0) pointing left: exit is col -1, path is clear!
  assert(canArrowExit(testArrows[2], grid, 3) === true, 'Arrow 3 (2,0) pointing left should exit freely');

  // Arrow 4 (2,2) pointing right: exit is col 3, path is clear!
  assert(canArrowExit(testArrows[3], grid, 3) === true, 'Arrow 4 (2,2) pointing right should exit freely');

  // Remove Arrow 1 and re-check Arrow 2
  const { arrows: afterRemoval, grid: newGrid } = removeArrow(testArrows, 1, 3);
  const arrow2After = afterRemoval.find(a => a.id === 2)!;
  assert(canArrowExit(arrow2After, newGrid, 3) === true, 'Arrow 2 should now exit freely after Arrow 1 is removed');
}

// ── Test 2: Star rating logic ─────────────────────────────────
{
  assert(calculateStars(10, 10, 13) === 3, 'Moves <= par should give 3 stars');
  assert(calculateStars(8, 10, 13) === 3, 'Moves < par should give 3 stars');
  assert(calculateStars(12, 10, 13) === 2, 'Moves <= twoStar should give 2 stars');
  assert(calculateStars(13, 10, 13) === 2, 'Moves == twoStar should give 2 stars');
  assert(calculateStars(14, 10, 13) === 1, 'Moves > twoStar should give 1 star');
  assert(calculateStars(50, 10, 13) === 1, 'High moves should give 1 star');
}

// ── Test 3: Hint engine ───────────────────────────────────────
{
  const testArrows: Arrow[] = [
    { id: 1, row: 1, col: 1, direction: 'down', color: 'purple', active: true },
    { id: 2, row: 2, col: 1, direction: 'down', color: 'orange', active: true },
  ];
  const grid = buildGrid(testArrows, 3);

  // Arrow 2 can exit down, Arrow 1 is blocked by Arrow 2
  const hint = getHint(testArrows, grid, 3);
  assert(hint !== null, 'Hint must be found when moves exist');
  assert(hint?.id === 2, 'Hint must suggest Arrow 2 which has a clear exit');
}

// ── Test 4: All 100 campaign levels are solvable ──────────────
{
  assert(levels.length === 100, `Expected 100 levels, found ${levels.length}`);

  let allSolvable = true;
  for (let i = 0; i < levels.length; i++) {
    const lvl = levels[i];
    const val = validateLevel(lvl);
    if (!val.solvable || val.solution.length !== lvl.arrows.length) {
      allSolvable = false;
      console.error(`Level ${lvl.id} failed validation!`);
    }
  }
  assert(allSolvable, 'All 100 levels must be 100% solvable');
}

// ── Test 5: Deterministic Daily Challenges ────────────────────
{
  const date1 = '2026-11-23';
  const date2 = '2026-11-24';

  const daily1 = getDailyLevel(date1);
  const daily1Again = getDailyLevel(date1);
  const daily2 = getDailyLevel(date2);

  // Determinism check: same date produces exact same puzzle
  assert(daily1.gridSize === daily1Again.gridSize, 'Daily level on same date must have same gridSize');
  assert(daily1.arrows.length === daily1Again.arrows.length, 'Daily level on same date must have same arrow count');
  assert(daily1.arrows[0].direction === daily1Again.arrows[0].direction, 'Daily level on same date must be identical');

  // Solvability check for daily levels
  const val1 = validateLevel(daily1);
  const val2 = validateLevel(daily2);
  assert(val1.solvable, 'Daily challenge 1 must be solvable');
  assert(val2.solvable, 'Daily challenge 2 must be solvable');
}

console.log(`\n========================================`);
console.log(`Test Results: ${passed} passed, ${failed} failed`);
console.log(`========================================\n`);

if (failed > 0) {
  process.exit(1);
}
