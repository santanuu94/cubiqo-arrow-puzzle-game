// ─── Save/Load System with localStorage ───────────────────────

import type { SaveData, LevelProgress, GameSettings, DailyProgress } from './types';

const SAVE_KEY = 'cubiqo_arrow_save';
const SAVE_VERSION = 1;

function getDefaultSave(): SaveData {
  return {
    version: SAVE_VERSION,
    highestUnlocked: 1,
    levels: {},
    totalMoves: 0,
    daily: {
      date: '',
      completed: false,
      moves: 0,
      streak: 0,
    },
    settings: {
      soundEnabled: true,
      musicEnabled: true,
      hapticEnabled: true,
    },
    milestones: [],
  };
}

function isStorageAvailable(): boolean {
  try {
    const test = '__cubiqo_test__';
    localStorage.setItem(test, '1');
    localStorage.removeItem(test);
    return true;
  } catch {
    return false;
  }
}

let cachedSave: SaveData | null = null;

export function loadSave(): SaveData {
  if (cachedSave) return cachedSave;

  if (!isStorageAvailable()) {
    cachedSave = getDefaultSave();
    return cachedSave;
  }

  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) {
      cachedSave = getDefaultSave();
      return cachedSave;
    }
    const data = JSON.parse(raw) as SaveData;
    // Version migration
    if (!data.version || data.version < SAVE_VERSION) {
      // Future: handle migrations
    }
    data.version = SAVE_VERSION;
    cachedSave = data;
    return cachedSave;
  } catch {
    cachedSave = getDefaultSave();
    return cachedSave;
  }
}

export function writeSave(data: SaveData): void {
  cachedSave = data;
  if (!isStorageAvailable()) return;
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify(data));
  } catch {
    // Storage full or restricted — silently continue
  }
}

export function saveLevelProgress(levelId: number, moves: number, stars: number): void {
  const save = loadSave();
  const existing = save.levels[levelId];

  if (!existing || !existing.completed) {
    save.levels[levelId] = { completed: true, stars, bestMoves: moves };
  } else {
    // Only improve, never worsen
    save.levels[levelId] = {
      completed: true,
      stars: Math.max(existing.stars, stars),
      bestMoves: Math.min(existing.bestMoves, moves),
    };
  }

  save.totalMoves += moves;

  // Unlock next level
  if (levelId >= save.highestUnlocked && levelId < 100) {
    save.highestUnlocked = levelId + 1;
  }

  // Track milestones
  const milestoneThresholds = [10, 25, 50, 75, 100];
  for (const m of milestoneThresholds) {
    if (levelId === m && !save.milestones.includes(m)) {
      save.milestones.push(m);
    }
  }

  writeSave(save);
}

export function getLevelProgress(levelId: number): LevelProgress | null {
  const save = loadSave();
  return save.levels[levelId] || null;
}

export function getHighestUnlocked(): number {
  return loadSave().highestUnlocked;
}

export function getCompletedCount(): number {
  const save = loadSave();
  return Object.values(save.levels).filter(l => l.completed).length;
}

export function getTotalStars(): number {
  const save = loadSave();
  return Object.values(save.levels).reduce((sum, l) => sum + (l.stars || 0), 0);
}

export function getSettings(): GameSettings {
  return loadSave().settings;
}

export function updateSettings(settings: Partial<GameSettings>): void {
  const save = loadSave();
  save.settings = { ...save.settings, ...settings };
  writeSave(save);
}

export function getDailyProgress(): DailyProgress {
  return loadSave().daily;
}

export function saveDailyProgress(date: string, moves: number): void {
  const save = loadSave();
  const prevDate = save.daily.date;
  const isSameDay = prevDate === date;
  const isConsecutive = isNextDay(prevDate, date);

  let streak = save.daily.streak || 0;
  if (isSameDay) {
    // Replaying today: keep current streak
    streak = Math.max(1, streak);
  } else if (isConsecutive) {
    streak += 1;
  } else {
    streak = 1;
  }

  save.daily = {
    date,
    completed: true,
    moves: isSameDay ? Math.min(save.daily.moves || moves, moves) : moves,
    streak,
  };
  writeSave(save);
}

function isNextDay(prev: string, current: string): boolean {
  if (!prev) return false;
  const prevD = new Date(prev);
  const currD = new Date(current);
  const diff = currD.getTime() - prevD.getTime();
  return diff > 0 && diff <= 86400000 * 1.5; // Allow some timezone flex
}

export function resetAllProgress(): void {
  cachedSave = null;
  if (isStorageAvailable()) {
    try {
      localStorage.removeItem(SAVE_KEY);
    } catch { /* ignore */ }
  }
}

export function isMilestoneReached(levelId: number): boolean {
  return [10, 25, 50, 75, 100].includes(levelId);
}
