import { levels } from '../src/data/levels.ts';
import { validateLevel } from '../src/engine/puzzle.ts';

console.log(`Starting validation of ${levels.length} levels...`);

let failed = 0;
let passed = 0;

for (const level of levels) {
  const result = validateLevel(level);
  if (!result.solvable || result.solution.length !== level.arrows.length) {
    console.error(`❌ Level ${level.id} FAILED! Solvable: ${result.solvable}, cleared: ${result.solution.length}/${level.arrows.length}`);
    failed++;
  } else {
    passed++;
  }
}

console.log(`\n========================================`);
console.log(`Validation finished: ${passed} passed, ${failed} failed out of ${levels.length} levels.`);
console.log(`========================================`);

if (failed > 0) {
  process.exit(1);
}
