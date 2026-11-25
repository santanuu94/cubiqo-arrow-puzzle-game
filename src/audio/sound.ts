// ─── Sound Effects & Ambient Music Engine (Web Audio API) ──────

import { getSettings } from '../engine/save';

let audioCtx: AudioContext | null = null;
let bgMusicGain: GainNode | null = null;
let bgMusicInterval: ReturnType<typeof setInterval> | null = null;
let isMusicRunning = false;

function getAudioContext(): AudioContext | null {
  if (!audioCtx) {
    try {
      audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    } catch {
      return null;
    }
  }
  return audioCtx;
}

function ensureResumed(): void {
  const ctx = getAudioContext();
  if (ctx && ctx.state === 'suspended') {
    ctx.resume().catch(() => {});
  }
}

// Initialize audio on first user interaction
export function initAudio(): void {
  const handler = () => {
    ensureResumed();
    updateMusicState();
    document.removeEventListener('click', handler);
    document.removeEventListener('touchstart', handler);
  };
  document.addEventListener('click', handler);
  document.addEventListener('touchstart', handler);
}

function playTone(frequency: number, duration: number, type: OscillatorType = 'sine', volume: number = 0.15): void {
  if (!getSettings().soundEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;
  ensureResumed();

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(frequency, ctx.currentTime);
  gain.gain.setValueAtTime(volume, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + duration);
}

export function playArrowClear(): void {
  playTone(523.25, 0.15, 'sine', 0.12);
  setTimeout(() => playTone(659.25, 0.12, 'sine', 0.1), 50);
}

export function playArrowBlocked(): void {
  playTone(180, 0.12, 'square', 0.07);
  setTimeout(() => playTone(140, 0.14, 'square', 0.05), 60);
}

export function playLevelComplete(): void {
  const notes = [523.25, 659.25, 783.99, 1046.50];
  notes.forEach((freq, i) => {
    setTimeout(() => playTone(freq, 0.2, 'sine', 0.1), i * 90);
  });
}

export function playButtonClick(): void {
  playTone(440, 0.05, 'sine', 0.05);
}

export function playStarEarned(): void {
  playTone(880, 0.22, 'triangle', 0.12);
}

export function playHint(): void {
  playTone(660, 0.1, 'sine', 0.08);
  setTimeout(() => playTone(880, 0.15, 'sine', 0.08), 70);
}

export function playVictory(): void {
  const notes = [523.25, 587.33, 659.25, 783.99, 880, 1046.50, 1318.51];
  notes.forEach((freq, i) => {
    setTimeout(() => playTone(freq, 0.28, 'triangle', 0.09), i * 110);
  });
}

export function playMilestone(): void {
  const notes = [440, 554.37, 659.25, 880, 1108.73];
  notes.forEach((freq, i) => {
    setTimeout(() => playTone(freq, 0.25, 'sine', 0.1), i * 120);
  });
}

export function triggerHaptic(pattern: number[] = [10]): void {
  if (!getSettings().hapticEnabled) return;
  if (navigator.vibrate) {
    try {
      navigator.vibrate(pattern);
    } catch { /* ignore */ }
  }
}

// ─── Ambient Procedural Background Music ──────────────────────
// Generates a soft, relaxing chord progression via Web Audio API.
// Zero external files, ultra-lightweight, seamless loop.

const CHORD_PROGRESSION = [
  [261.63, 329.63, 392.00], // C major (C4, E4, G4)
  [220.00, 261.63, 329.63], // A minor (A3, C4, E4)
  [174.61, 220.00, 261.63], // F major (F3, A3, C4)
  [196.00, 246.94, 293.66], // G major (G3, B3, D4)
];

let currentChordIdx = 0;

function playAmbientPad(frequencies: number[]): void {
  const ctx = getAudioContext();
  if (!ctx || !bgMusicGain) return;

  const duration = 3.6;
  const now = ctx.currentTime;

  frequencies.forEach(freq => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now);

    // Warm low-pass filter
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(800, now);

    // Soft attack and release envelope
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.linearRampToValueAtTime(0.012, now + 1.2);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(bgMusicGain!);

    osc.start(now);
    osc.stop(now + duration);
  });
}

export function startBackgroundMusic(): void {
  if (isMusicRunning) return;
  const ctx = getAudioContext();
  if (!ctx) return;
  ensureResumed();

  bgMusicGain = ctx.createGain();
  bgMusicGain.gain.setValueAtTime(1.0, ctx.currentTime);
  bgMusicGain.connect(ctx.destination);

  isMusicRunning = true;
  currentChordIdx = 0;

  // Play immediately
  playAmbientPad(CHORD_PROGRESSION[currentChordIdx]);
  currentChordIdx = (currentChordIdx + 1) % CHORD_PROGRESSION.length;

  // Loop chords every 3.8 seconds
  bgMusicInterval = setInterval(() => {
    if (!getSettings().musicEnabled) {
      stopBackgroundMusic();
      return;
    }
    playAmbientPad(CHORD_PROGRESSION[currentChordIdx]);
    currentChordIdx = (currentChordIdx + 1) % CHORD_PROGRESSION.length;
  }, 3800);
}

export function stopBackgroundMusic(): void {
  if (bgMusicInterval) {
    clearInterval(bgMusicInterval);
    bgMusicInterval = null;
  }
  if (bgMusicGain) {
    try {
      const ctx = getAudioContext();
      if (ctx) {
        bgMusicGain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.5);
      }
    } catch { /* ignore */ }
    bgMusicGain = null;
  }
  isMusicRunning = false;
}

export function updateMusicState(): void {
  const enabled = getSettings().musicEnabled;
  if (enabled && !isMusicRunning) {
    startBackgroundMusic();
  } else if (!enabled && isMusicRunning) {
    stopBackgroundMusic();
  }
}
