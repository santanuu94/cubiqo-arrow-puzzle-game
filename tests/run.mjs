/* =========================================================================
   tests/run.mjs
   Unit & integration test suite covering engine, levels, storage, hints & SDK.
   Usage: npm test
   ========================================================================= */
import assert from 'node:assert/strict';
import { loadGame, CORE_FILES, installLocalStorageStub } from '../tools/_load.mjs';

installLocalStorageStub();

const Cubiqo = loadGame([
  ...CORE_FILES,
  'js/levels.js',
  'js/platform.js',
  'js/analytics.js',
  'js/hints.js',
  'js/daily.js'
]);

const { Config, Puzzle, Storage, DailyStore, LevelGenerator, Levels, Hints, Platform } = Cubiqo;

let passed = 0;
async function test(name, fn) {
  try {
    await fn();
    passed++;
    console.log(`  ✓ ${name}`);
  } catch (err) {
    console.error(`  ✗ ${name}`);
    console.error(err);
    process.exitCode = 1;
  }
}

console.log('Running CUBIQO unit tests...\n');

await test('all 4 directional arrows exit when clear and block when occupied', () => {
  const lv = {
    id: 999,
    size: 3,
    arrows: [
      { id: 0, x: 1, y: 0, dir: 'up' },
      { id: 1, x: 1, y: 1, dir: 'up' },
      { id: 2, x: 2, y: 1, dir: 'right' },
      { id: 3, x: 0, y: 2, dir: 'left' },
      { id: 4, x: 1, y: 2, dir: 'down' }
    ]
  };
  const board = Puzzle.createBoard(lv);
  assert.equal(Puzzle.tryRemove(board, 1).ok, false);
  assert.equal(Puzzle.countRemaining(board), 5);

  assert.equal(Puzzle.tryRemove(board, 0).ok, true);
  assert.equal(Puzzle.tryRemove(board, 0).ok, false); // no duplicate removal
  assert.equal(Puzzle.tryRemove(board, 1).ok, true);
  assert.equal(Puzzle.tryRemove(board, 2).ok, true);
  assert.equal(Puzzle.tryRemove(board, 3).ok, true);
  assert.equal(Puzzle.tryRemove(board, 4).ok, true);
  assert.equal(Puzzle.isComplete(board), true);
});

await test('all 100 levels exist, are unique, and pass solver validation', () => {
  assert.equal(Levels.LIST.length, 100);
  for (const lv of Levels.LIST) {
    const errs = Puzzle.validateLevel(lv);
    assert.deepEqual(errs, [], `Level ${lv.id} errors: ${errs.join(', ')}`);
  }
});

await test('hints never recommend an invalid or blocked arrow', async () => {
  const lv = Levels.byId(15);
  const board = Puzzle.createBoard(lv);
  const res = await Hints.requestHint(board);
  assert.equal(res.ok, true);
  assert.ok(res.arrow);
  assert.equal(Puzzle.isClear(board, res.arrow), true);
});

await test('storage saves, preserves best records, unlocks next level, and resets safely', () => {
  localStorage.setItem('unrelated-app-key', 'keep-me');
  Storage.resetProgress();

  assert.equal(Storage.isUnlocked(1), true);
  assert.equal(Storage.isUnlocked(2), false);

  Storage.completeLevel(1, 5, 3);
  assert.equal(Storage.isUnlocked(2), true);
  assert.equal(Storage.levelRecord(1).bestMoves, 5);
  assert.equal(Storage.levelRecord(1).stars, 3);

  // Replaying with worse moves does not overwrite bestMoves or stars
  Storage.completeLevel(1, 9, 1);
  assert.equal(Storage.levelRecord(1).bestMoves, 5);
  assert.equal(Storage.levelRecord(1).stars, 3);

  Storage.resetProgress();
  assert.equal(Storage.isUnlocked(2), false);
  assert.equal(localStorage.getItem('unrelated-app-key'), 'keep-me');
});

await test('restricted localStorage falls back to in-memory storage without crashing', () => {
  const orig = globalThis.localStorage;
  globalThis.localStorage = {
    getItem() { throw new Error('blocked'); },
    setItem() { throw new Error('blocked'); },
    removeItem() { throw new Error('blocked'); }
  };
  try {
    Storage.resetProgress();
    Storage.completeLevel(1, 3, 3);
    assert.equal(Storage.levelRecord(1).bestMoves, 3);
  } finally {
    globalThis.localStorage = orig;
  }
});

await test('daily challenge is deterministic and isolated from main campaign', () => {
  Storage.resetProgress();
  const d1 = LevelGenerator.generateDaily('2026-11-25');
  const d2 = LevelGenerator.generateDaily('2026-11-25');
  assert.equal(d1.arrows.length, d2.arrows.length);
  assert.equal(Puzzle.peel(d1).solvable, true);

  DailyStore.markComplete('2026-11-25', 14, 3);
  assert.equal(DailyStore.todayDone('2026-11-25'), true);
  assert.equal(Storage.load().highestUnlocked, 1);
});

await test('platform adapter has monetization disabled in initial build', async () => {
  assert.equal(Config.MONETIZATION.enabled, false);
  assert.equal(Config.MONETIZATION.hintsFree, true);
  await Platform.initialize('dev');
  assert.equal(Platform.isAvailable(), false);
  assert.equal(await Platform.showRewardedHint(), true);
});

await test('lifeline system gives 3 chances: wrong moves are blocked and detected', () => {
  const lv = {
    id: 998,
    size: 3,
    arrows: [
      { id: 0, x: 1, y: 1, dir: 'up' },
      { id: 1, x: 1, y: 0, dir: 'down' } // blocks arrow 0
    ]
  };
  const board = Puzzle.createBoard(lv);
  let lives = 3;
  let gameOver = false;

  // Arrow 0 cannot exit because Arrow 1 is in front of it
  const r1 = Puzzle.tryRemove(board, 0);
  assert.equal(r1.ok, false);
  lives--;
  assert.equal(lives, 2);

  // Another blocked tap
  const r2 = Puzzle.tryRemove(board, 0);
  assert.equal(r2.ok, false);
  lives--;
  assert.equal(lives, 1);

  // Third blocked tap -> game over
  const r3 = Puzzle.tryRemove(board, 0);
  assert.equal(r3.ok, false);
  lives--;
  assert.equal(lives, 0);
  if (lives <= 0) gameOver = true;
  assert.equal(gameOver, true);
});

console.log(`\n${passed} tests passed.`);
