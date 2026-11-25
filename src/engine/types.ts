// ─── Core Game Types ───────────────────────────────────────────

export type Direction = 'up' | 'down' | 'left' | 'right';

export type ArrowColor = 'red' | 'blue' | 'green' | 'orange' | 'purple' | 'pink' | 'teal' | 'yellow';

export interface Arrow {
  id: number;
  row: number;
  col: number;
  direction: Direction;
  color: ArrowColor;
  active: boolean;
}

export interface LevelConfig {
  id: number;
  gridSize: number;
  arrows: ArrowDef[];
  par: number;        // 3-star move count
  twoStar: number;    // 2-star threshold
}

export interface ArrowDef {
  row: number;
  col: number;
  direction: Direction;
  color: ArrowColor;
}

export interface LevelProgress {
  completed: boolean;
  stars: number;
  bestMoves: number;
}

export interface DailyProgress {
  date: string;
  completed: boolean;
  moves: number;
  streak: number;
}

export interface SaveData {
  version: number;
  highestUnlocked: number;
  levels: Record<number, LevelProgress>;
  totalMoves: number;
  daily: DailyProgress;
  settings: GameSettings;
  milestones: number[];
}

export interface GameSettings {
  soundEnabled: boolean;
  musicEnabled: boolean;
  hapticEnabled: boolean;
}

export type Screen = 'loading' | 'home' | 'levelSelect' | 'gameplay' | 'pause' | 'levelComplete' | 'daily' | 'settings' | 'victory';

export interface GameState {
  currentScreen: Screen;
  currentLevel: number;
  grid: (Arrow | null)[][];
  gridSize: number;
  arrows: Arrow[];
  movesUsed: number;
  arrowsRemaining: number;
  totalArrows: number;
  isPaused: boolean;
  isDaily: boolean;
  hintArrowId: number | null;
  animating: boolean;
}

export interface PlatformAdapter {
  initialize(): Promise<void>;
  isAvailable(): boolean;
  showRewardedHint(): Promise<boolean>;
  showInterstitial(): Promise<void>;
  pauseGame(): void;
  resumeGame(): void;
  gameLoadingFinished?(): void;
  gameplayStart?(): void;
  gameplayStop?(): void;
}

export interface AnalyticsEvent {
  type: string;
  data?: Record<string, unknown>;
}
