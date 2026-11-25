// ─── Puzzle Engine: core arrow-clearing logic ──────────────────

import type { Arrow, Direction, LevelConfig, ArrowDef } from './types';

/**
 * Check if an arrow has a clear exit path.
 * An arrow can leave the board only when no other active arrow
 * occupies any cell in its directional exit path toward the board edge.
 */
export function canArrowExit(arrow: Arrow, grid: (Arrow | null)[][], gridSize: number): boolean {
  if (!arrow.active) return false;

  const { row, col, direction } = arrow;

  switch (direction) {
    case 'up':
      for (let r = row - 1; r >= 0; r--) {
        if (grid[r][col] && grid[r][col]!.active) return false;
      }
      return true;

    case 'down':
      for (let r = row + 1; r < gridSize; r++) {
        if (grid[r][col] && grid[r][col]!.active) return false;
      }
      return true;

    case 'left':
      for (let c = col - 1; c >= 0; c--) {
        if (grid[row][c] && grid[row][c]!.active) return false;
      }
      return true;

    case 'right':
      for (let c = col + 1; c < gridSize; c++) {
        if (grid[row][c] && grid[row][c]!.active) return false;
      }
      return true;
  }
}

/**
 * Build grid from arrow list
 */
export function buildGrid(arrows: Arrow[], gridSize: number): (Arrow | null)[][] {
  const grid: (Arrow | null)[][] = [];
  for (let r = 0; r < gridSize; r++) {
    grid[r] = [];
    for (let c = 0; c < gridSize; c++) {
      grid[r][c] = null;
    }
  }
  for (const arrow of arrows) {
    if (arrow.active) {
      grid[arrow.row][arrow.col] = arrow;
    }
  }
  return grid;
}

/**
 * Find all currently removable arrows
 */
export function findRemovableArrows(arrows: Arrow[], grid: (Arrow | null)[][], gridSize: number): Arrow[] {
  return arrows.filter(a => a.active && canArrowExit(a, grid, gridSize));
}

/**
 * Remove an arrow from the board — returns updated arrows and grid
 */
export function removeArrow(arrows: Arrow[], arrowId: number, gridSize: number): { arrows: Arrow[]; grid: (Arrow | null)[][] } {
  const updated = arrows.map(a => a.id === arrowId ? { ...a, active: false } : a);
  return { arrows: updated, grid: buildGrid(updated, gridSize) };
}

/**
 * Initialize a level from config
 */
export function initLevel(config: LevelConfig): { arrows: Arrow[]; grid: (Arrow | null)[][]; gridSize: number } {
  const arrows: Arrow[] = config.arrows.map((def: ArrowDef, i: number) => ({
    id: i + 1,
    row: def.row,
    col: def.col,
    direction: def.direction,
    color: def.color,
    active: true,
  }));
  const grid = buildGrid(arrows, config.gridSize);
  return { arrows, grid, gridSize: config.gridSize };
}

/**
 * Calculate stars based on moves vs par
 */
export function calculateStars(moves: number, par: number, twoStar: number): number {
  if (moves <= par) return 3;
  if (moves <= twoStar) return 2;
  return 1;
}

/**
 * Validate that a level is solvable.
 * In CUBIQO, removing an unobstructed arrow is monotonic (it only frees space,
 * never blocks another path). Thus, iterative greedy reduction terminates
 * in O(N * gridSize) and is complete: if all arrows are cleared, the level is solvable;
 * if arrows remain with none removable, the remaining arrows form a circular dependency deadlock.
 */
export function validateLevel(config: LevelConfig): { solvable: boolean; solution: number[] } {
  let { arrows, grid, gridSize } = initLevel(config);
  const solution: number[] = [];

  while (true) {
    const removable = findRemovableArrows(arrows, grid, gridSize);
    if (removable.length === 0) break;
    const arrow = removable[0];
    solution.push(arrow.id);
    const result = removeArrow(arrows, arrow.id, gridSize);
    arrows = result.arrows;
    grid = result.grid;
  }

  const remaining = arrows.filter(a => a.active);
  return { solvable: remaining.length === 0, solution };
}

/**
 * Get a valid hint (any currently removable arrow)
 */
export function getHint(arrows: Arrow[], grid: (Arrow | null)[][], gridSize: number): Arrow | null {
  const removable = findRemovableArrows(arrows, grid, gridSize);
  return removable.length > 0 ? removable[0] : null;
}

/**
 * Get the direction vector for animation
 */
export function getDirectionVector(direction: Direction): { dx: number; dy: number } {
  switch (direction) {
    case 'up': return { dx: 0, dy: -1 };
    case 'down': return { dx: 0, dy: 1 };
    case 'left': return { dx: -1, dy: 0 };
    case 'right': return { dx: 1, dy: 0 };
  }
}
