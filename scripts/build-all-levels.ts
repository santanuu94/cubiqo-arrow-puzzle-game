import type { LevelConfig, Direction, ArrowColor } from '../src/engine/types.ts';
import { validateLevel } from '../src/engine/puzzle.ts';
import * as fs from 'fs';
import * as path from 'path';

const COLORS: ArrowColor[] = ['red', 'blue', 'green', 'orange', 'purple', 'pink', 'teal', 'yellow'];
const DIRS: Direction[] = ['up', 'down', 'left', 'right'];

function getRayCells(row: number, col: number, dir: Direction, gridSize: number): { r: number; c: number }[] {
  const cells: { r: number; c: number }[] = [];
  switch (dir) {
    case 'up':
      for (let r = row - 1; r >= 0; r--) cells.push({ r, c: col });
      break;
    case 'down':
      for (let r = row + 1; r < gridSize; r++) cells.push({ r, c: col });
      break;
    case 'left':
      for (let c = col - 1; c >= 0; c--) cells.push({ r: row, c });
      break;
    case 'right':
      for (let c = col + 1; c < gridSize; c++) cells.push({ r: row, c });
      break;
  }
  return cells;
}

function generateSolvableLevel(
  id: number,
  gridSize: number,
  arrowCount: number,
  seed: number
): LevelConfig {
  let s = seed;
  function rand(): number {
    s = (s * 1103515245 + 12345) & 0x7fffffff;
    return (s >> 16) / 32768;
  }

  for (let attempt = 0; attempt < 200; attempt++) {
    const allCells: { r: number; c: number }[] = [];
    for (let r = 0; r < gridSize; r++) {
      for (let c = 0; c < gridSize; c++) {
        allCells.push({ r, c });
      }
    }

    // Shuffle
    for (let i = allCells.length - 1; i > 0; i--) {
      const j = Math.floor(rand() * (i + 1));
      [allCells[i], allCells[j]] = [allCells[j], allCells[i]];
    }

    const chosenCells = allCells.slice(0, arrowCount);
    const arrows: { row: number; col: number; direction: Direction; color: ArrowColor }[] = [];
    let possible = true;

    for (let i = 0; i < arrowCount; i++) {
      const curr = chosenCells[i];
      const laterCells = new Set(chosenCells.slice(i + 1).map(c => `${c.r},${c.c}`));

      const validDirs: Direction[] = [];
      for (const dir of DIRS) {
        const ray = getRayCells(curr.r, curr.c, dir, gridSize);
        const blocked = ray.some(c => laterCells.has(`${c.r},${c.c}`));
        if (!blocked) {
          validDirs.push(dir);
        }
      }

      if (validDirs.length === 0) {
        possible = false;
        break;
      }

      // Bias towards directions that pass through earlier cells to create rich blocking dependencies
      const earlierCells = new Set(chosenCells.slice(0, i).map(c => `${c.r},${c.c}`));
      validDirs.sort((a, b) => {
        const rayA = getRayCells(curr.r, curr.c, a, gridSize).filter(c => earlierCells.has(`${c.r},${c.c}`)).length;
        const rayB = getRayCells(curr.r, curr.c, b, gridSize).filter(c => earlierCells.has(`${c.r},${c.c}`)).length;
        return (rayB + rand() * 0.4) - (rayA + rand() * 0.4);
      });

      arrows.push({
        row: curr.r,
        col: curr.c,
        direction: validDirs[0],
        color: COLORS[arrows.length % COLORS.length],
      });
    }

    if (possible && arrows.length === arrowCount) {
      const config: LevelConfig = {
        id,
        gridSize,
        par: arrowCount,
        twoStar: arrowCount + Math.max(2, Math.floor(arrowCount * 0.25)),
        arrows,
      };

      const val = validateLevel(config);
      if (val.solvable && val.solution.length === arrowCount) {
        return config;
      }
    }
  }

  throw new Error(`Failed to generate level ${id}`);
}

// Generate all 100 levels following PRD difficulty tiers
const allLevels: LevelConfig[] = [];

for (let id = 1; id <= 100; id++) {
  let gridSize = 3;
  let count = 1;

  if (id <= 5) {
    gridSize = 3;
    count = id; // 1, 2, 3, 4, 5
  } else if (id <= 10) {
    gridSize = 3;
    count = Math.min(8, 5 + (id - 6)); // 5 to 8 arrows
  } else if (id <= 20) {
    gridSize = 3;
    count = Math.min(8, 6 + Math.floor((id - 11) / 3)); // 6 to 8 arrows
  } else if (id <= 35) {
    gridSize = 4;
    count = Math.min(13, 6 + Math.floor((id - 21) / 2)); // 6 to 13 arrows
  } else if (id <= 50) {
    gridSize = 4;
    count = Math.min(14, 10 + Math.floor((id - 36) / 3)); // 10 to 14 arrows
  } else if (id <= 70) {
    gridSize = 5;
    count = Math.min(19, 11 + Math.floor((id - 51) / 2.5)); // 11 to 18 arrows
  } else if (id <= 85) {
    gridSize = 5;
    count = Math.min(21, 16 + Math.floor((id - 71) / 2.5)); // 16 to 21 arrows
  } else if (id <= 93) {
    gridSize = 5;
    count = Math.min(22, 19 + Math.floor((id - 86) / 2)); // 19 to 22 arrows
  } else {
    // 94-100: Grand Master on 6x6 board
    gridSize = 6;
    count = Math.min(26, 20 + (id - 94)); // 20 to 26 arrows on 6x6
  }
  count = Math.min(count, gridSize * gridSize - 1);

  const level = generateSolvableLevel(id, gridSize, count, id * 1337 + 42);
  const val = validateLevel(level);
  if (!val.solvable || val.solution.length !== level.arrows.length) {
    throw new Error(`Level ${id} validation failed!`);
  }
  allLevels.push(level);
}

console.log(`Generated and validated all ${allLevels.length} levels!`);

// Create content for src/data/levels.ts
const fileContent = `// ─── 100 Puzzle Levels for CUBIQO: Arrow Escape ───────────────
// Every level is mathematically verified solvable with rich dependency chains.
// Difficulty tiers:
//   Levels 1-10:   Learning phase (3×3 grids, 1-9 arrows)
//   Levels 11-20:  Beginner challenge (3×3 grids, 5-8 arrows)
//   Levels 21-35:  Intermediate (4×4 grids, 6-13 arrows)
//   Levels 36-50:  Advanced Intermediate (4×4 grids, 10-16 arrows)
//   Levels 51-70:  Advanced (5×5 grids, 10-21 arrows)
//   Levels 71-90:  Expert (5×5 grids, 16-24 arrows)
//   Levels 91-100: Master Challenge (5×5 and 6×6 grids, 21-25 arrows)

import type { LevelConfig, Direction, ArrowColor } from '../engine/types';

export const levels: LevelConfig[] = ${JSON.stringify(allLevels, null, 2)};

/**
 * Deterministic, guaranteed-solvable daily challenge generator
 */
export function getDailyLevel(dateStr: string): LevelConfig {
  let hash = 0;
  for (let i = 0; i < dateStr.length; i++) {
    hash = ((hash << 5) - hash + dateStr.charCodeAt(i)) | 0;
  }
  hash = Math.abs(hash);

  const gridSize = 4 + (hash % 2); // 4 or 5
  const arrowCount = 8 + (hash % 6); // 8-13 arrows
  const COLORS: ArrowColor[] = ['red', 'blue', 'green', 'orange', 'purple', 'pink', 'teal', 'yellow'];
  const DIRS: Direction[] = ['up', 'down', 'left', 'right'];

  let s = hash;
  function rand(): number {
    s = (s * 1103515245 + 12345) & 0x7fffffff;
    return (s >> 16) / 32768;
  }

  function getRayCells(row: number, col: number, dir: Direction, gSize: number): { r: number; c: number }[] {
    const cells: { r: number; c: number }[] = [];
    switch (dir) {
      case 'up':
        for (let r = row - 1; r >= 0; r--) cells.push({ r, c: col });
        break;
      case 'down':
        for (let r = row + 1; r < gSize; r++) cells.push({ r, c: col });
        break;
      case 'left':
        for (let c = col - 1; c >= 0; c--) cells.push({ r: row, c });
        break;
      case 'right':
        for (let c = col + 1; c < gSize; c++) cells.push({ r: row, c });
        break;
    }
    return cells;
  }

  for (let attempt = 0; attempt < 50; attempt++) {
    const allCells: { r: number; c: number }[] = [];
    for (let r = 0; r < gridSize; r++) {
      for (let c = 0; c < gridSize; c++) {
        allCells.push({ r, c });
      }
    }

    for (let i = allCells.length - 1; i > 0; i--) {
      const j = Math.floor(rand() * (i + 1));
      [allCells[i], allCells[j]] = [allCells[j], allCells[i]];
    }

    const chosenCells = allCells.slice(0, arrowCount);
    const arrows: { row: number; col: number; direction: Direction; color: ArrowColor }[] = [];
    let possible = true;

    for (let i = 0; i < arrowCount; i++) {
      const curr = chosenCells[i];
      const laterCells = new Set(chosenCells.slice(i + 1).map(c => \`\${c.r},\${c.c}\`));

      const validDirs: Direction[] = [];
      for (const dir of DIRS) {
        const ray = getRayCells(curr.r, curr.c, dir, gridSize);
        const blocked = ray.some(c => laterCells.has(\`\${c.r},\${c.c}\`));
        if (!blocked) validDirs.push(dir);
      }

      if (validDirs.length === 0) {
        possible = false;
        break;
      }

      arrows.push({
        row: curr.r,
        col: curr.c,
        direction: validDirs[Math.floor(rand() * validDirs.length)],
        color: COLORS[arrows.length % COLORS.length],
      });
    }

    if (possible && arrows.length === arrowCount) {
      return {
        id: 0,
        gridSize,
        par: arrowCount,
        twoStar: arrowCount + 3,
        arrows,
      };
    }
  }

  // Fallback simple daily level
  return {
    id: 0,
    gridSize: 3,
    par: 3,
    twoStar: 5,
    arrows: [
      { row: 0, col: 0, direction: 'up', color: 'red' },
      { row: 1, col: 1, direction: 'right', color: 'blue' },
      { row: 2, col: 2, direction: 'down', color: 'green' },
    ],
  };
}
`;

fs.writeFileSync(path.resolve(process.cwd(), 'src/data/levels.ts'), fileContent, 'utf-8');
console.log('Successfully wrote src/data/levels.ts!');
