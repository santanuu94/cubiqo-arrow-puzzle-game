/* =========================================================================
   tools/validate-levels.mjs
   Validates all 100 levels in js/levels.js against PRD §6 and §13.
   Usage: npm run validate
   ========================================================================= */
import { loadGame, CORE_FILES } from './_load.mjs';

const Cubiqo = loadGame([...CORE_FILES, 'js/levels.js']);
const { Config, Puzzle, Levels } = Cubiqo;

const list = Levels.LIST;
let failed = 0;

if (list.length !== Config.TOTAL_LEVELS) {
  console.error(`Expected ${Config.TOTAL_LEVELS} levels, found ${list.length}`);
  process.exit(1);
}

const seenIds = new Set();
for (const lv of list) {
  if (seenIds.has(lv.id)) {
    console.error(`Duplicate level id: ${lv.id}`);
    failed++;
    continue;
  }
  seenIds.add(lv.id);

  const errors = Puzzle.validateLevel(lv);
  if (errors.length) {
    console.error(`Level ${lv.id} failed: ${errors.join('; ')}`);
    failed++;
  }
}

console.log(`Validated ${list.length} levels: ${list.length - failed} passed, ${failed} failed.`);
process.exit(failed ? 1 : 0);
