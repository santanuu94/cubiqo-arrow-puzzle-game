import type { LevelConfig, Direction, ArrowColor } from '../src/engine/types';
import { validateLevel } from '../src/engine/puzzle';

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

export function generateSolvableLevel(
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

  // Try up to 50 times to generate a layout
  for (let attempt = 0; attempt < 50; attempt++) {
    // Pick random distinct cells
    const allCells: { r: number; c: number }[] = [];
    for (let r = 0; r < gridSize; r++) {
      for (let c = 0; c < gridSize; c++) {
        allCells.push({ r, c });
      }
    }

    // Shuffle cells
    for (let i = allCells.length - 1; i > 0; i--) {
      const j = Math.floor(rand() * (i + 1));
      [allCells[i], allCells[j]] = [allCells[j], allCells[i]];
    }

    const chosenCells = allCells.slice(0, arrowCount);

    // chosenCells[0] exits 1st, chosenCells[1] exits 2nd, ..., chosenCells[k-1] exits last
    // For pos[i], its ray cannot contain any pos[j] where j > i.
    const arrows: { row: number; col: number; direction: Direction; color: ArrowColor }[] = [];
    let possible = true;

    for (let i = 0; i < arrowCount; i++) {
      const curr = chosenCells[i];
      const laterCells = new Set(chosenCells.slice(i + 1).map(c => `${c.r},${c.c}`));

      // Find valid directions for curr where ray has no cells from laterCells
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

      // Pick one valid direction (preferring directions that pass through earlier cells to create dependencies!)
      // Score directions: higher score if ray passes through cells in chosenCells.slice(0, i)
      const earlierCells = new Set(chosenCells.slice(0, i).map(c => `${c.r},${c.c}`));
      validDirs.sort((a, b) => {
        const rayA = getRayCells(curr.r, curr.c, a, gridSize).filter(c => earlierCells.has(`${c.r},${c.c}`)).length;
        const rayB = getRayCells(curr.r, curr.c, b, gridSize).filter(c => earlierCells.has(`${c.r},${c.c}`)).length;
        return (rayB + rand() * 0.5) - (rayA + rand() * 0.5);
      });

      const chosenDir = validDirs[0];
      arrows.push({
        row: curr.r,
        col: curr.c,
        direction: chosenDir,
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

      // Double check with validator
      const val = validateLevel(config);
      if (val.solvable && val.solution.length === arrowCount) {
        return config;
      }
    }
  }

  throw new Error(`Failed to generate solvable level ${id}`);
}
