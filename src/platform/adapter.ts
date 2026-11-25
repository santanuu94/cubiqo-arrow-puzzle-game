// ─── Platform Adapter Interface ───────────────────────────────
// Monetization is DISABLED in the initial build.
// This architecture allows future portal SDK integration.

import type { PlatformAdapter, AnalyticsEvent } from '../engine/types';

// ── Development / No-SDK Adapter ──────────────────────────────
class DevAdapter implements PlatformAdapter {
  async initialize(): Promise<void> {
    console.log('[Platform] Dev adapter initialized — monetization disabled');
  }
  isAvailable(): boolean { return false; }
  async showRewardedHint(): Promise<boolean> {
    // In dev mode, hints are free
    return true;
  }
  async showInterstitial(): Promise<void> { /* no-op in dev */ }
  pauseGame(): void { /* no-op */ }
  resumeGame(): void { /* no-op */ }
  gameLoadingFinished(): void { console.log('[Platform] Loading finished'); }
  gameplayStart(): void { console.log('[Platform] Gameplay start'); }
  gameplayStop(): void { console.log('[Platform] Gameplay stop'); }
}

// ── Poki Adapter (Ready for PokiSDK v2) ────────────────────────
class PokiAdapter implements PlatformAdapter {
  private sdk: any = null;

  async initialize(): Promise<void> {
    this.sdk = (window as any).PokiSDK;
    if (this.sdk) {
      try {
        await this.sdk.init();
        console.log('[Platform] PokiSDK initialized successfully');
      } catch {
        console.warn('[Platform] PokiSDK init failed or ad-blocker detected');
      }
    }
  }
  isAvailable(): boolean {
    return PLATFORM_CONFIG.monetizationEnabled && !!this.sdk;
  }
  async showRewardedHint(): Promise<boolean> {
    if (!this.isAvailable()) return true; // Fallback to free hint if ads disabled
    return new Promise((resolve) => {
      this.sdk.rewardedBreak(() => {
        resolve(true);
      });
    });
  }
  async showInterstitial(): Promise<void> {
    if (!this.isAvailable()) return;
    await this.sdk.commercialBreak();
  }
  pauseGame(): void {
    if (this.sdk?.gameplayStop) this.sdk.gameplayStop();
  }
  resumeGame(): void {
    if (this.sdk?.gameplayStart) this.sdk.gameplayStart();
  }
  gameLoadingFinished(): void {
    if (this.sdk?.gameLoadingFinished) this.sdk.gameLoadingFinished();
  }
  gameplayStart(): void {
    if (this.sdk?.gameplayStart) this.sdk.gameplayStart();
  }
  gameplayStop(): void {
    if (this.sdk?.gameplayStop) this.sdk.gameplayStop();
  }
}

// ── CrazyGames Adapter (Ready for CrazyGames SDK v2/v3) ───────
class CrazyGamesAdapter implements PlatformAdapter {
  private sdk: any = null;

  async initialize(): Promise<void> {
    this.sdk = (window as any).CrazyGames?.SDK;
    if (this.sdk?.init) {
      try {
        await this.sdk.init();
        console.log('[Platform] CrazyGames SDK initialized');
      } catch (e) {
        console.warn('[Platform] CrazyGames SDK init error', e);
      }
    }
  }
  isAvailable(): boolean {
    return PLATFORM_CONFIG.monetizationEnabled && !!this.sdk;
  }
  async showRewardedHint(): Promise<boolean> {
    if (!this.isAvailable()) return true;
    return new Promise((resolve) => {
      const callbacks = {
        adFinished: () => resolve(true),
        adError: () => resolve(false),
      };
      if (this.sdk.ad?.requestAd) {
        this.sdk.ad.requestAd('rewarded', callbacks);
      } else {
        resolve(true);
      }
    });
  }
  async showInterstitial(): Promise<void> {
    if (!this.isAvailable()) return;
    return new Promise((resolve) => {
      if (this.sdk.ad?.requestAd) {
        this.sdk.ad.requestAd('midgame', {
          adFinished: () => resolve(),
          adError: () => resolve(),
        });
      } else {
        resolve();
      }
    });
  }
  pauseGame(): void {
    this.sdk?.gameplay?.stop?.();
  }
  resumeGame(): void {
    this.sdk?.gameplay?.start?.();
  }
  gameLoadingFinished(): void {
    this.sdk?.game?.loadingStop?.();
  }
  gameplayStart(): void {
    this.sdk?.gameplay?.start?.();
  }
  gameplayStop(): void {
    this.sdk?.gameplay?.stop?.();
  }
}

// ── GameDistribution Adapter ──────────────────────────────────
class GameDistributionAdapter implements PlatformAdapter {
  private sdk: any = null;

  async initialize(): Promise<void> {
    this.sdk = (window as any).gdsdk;
    console.log('[Platform] GameDistribution adapter initialized');
  }
  isAvailable(): boolean {
    return PLATFORM_CONFIG.monetizationEnabled && !!this.sdk;
  }
  async showRewardedHint(): Promise<boolean> {
    if (!this.isAvailable()) return true;
    return new Promise((resolve) => {
      if (this.sdk?.showAd) {
        this.sdk.showAd('rewarded')
          .then(() => resolve(true))
          .catch(() => resolve(false));
      } else {
        resolve(true);
      }
    });
  }
  async showInterstitial(): Promise<void> {
    if (!this.isAvailable()) return;
    if (this.sdk?.showAd) {
      await this.sdk.showAd();
    }
  }
  pauseGame(): void { /* Handled via portal event listeners */ }
  resumeGame(): void { /* Handled via portal event listeners */ }
  gameLoadingFinished(): void { /* Handled via portal event listeners */ }
  gameplayStart(): void { /* Handled via portal event listeners */ }
  gameplayStop(): void { /* Handled via portal event listeners */ }
}

// ── Platform Detection & Factory ──────────────────────────────
let currentAdapter: PlatformAdapter | null = null;

export function detectPlatform(): string {
  if (typeof (window as any).PokiSDK !== 'undefined') return 'poki';
  if (typeof (window as any).CrazyGames !== 'undefined') return 'crazygames';
  if (typeof (window as any).gdsdk !== 'undefined') return 'gamedistribution';
  return 'dev';
}

export function createAdapter(platform?: string): PlatformAdapter {
  const p = platform || detectPlatform();
  switch (p) {
    case 'poki': return new PokiAdapter();
    case 'crazygames': return new CrazyGamesAdapter();
    case 'gamedistribution': return new GameDistributionAdapter();
    default: return new DevAdapter();
  }
}

export async function initPlatform(): Promise<PlatformAdapter> {
  const adapter = createAdapter();
  try {
    await adapter.initialize();
  } catch (e) {
    console.warn('[Platform] Initialization failed, continuing with dev adapter', e);
  }
  currentAdapter = adapter;
  return adapter;
}

export function getPlatformAdapter(): PlatformAdapter {
  if (!currentAdapter) currentAdapter = new DevAdapter();
  return currentAdapter;
}

// ── Analytics Interface ───────────────────────────────────────
const analyticsQueue: AnalyticsEvent[] = [];

export function trackEvent(type: string, data?: Record<string, unknown>): void {
  const event: AnalyticsEvent = { type, data };
  analyticsQueue.push(event);
  if (import.meta.env.DEV) {
    console.log('[Analytics]', type, data || '');
  }
}

// ── Configuration ─────────────────────────────────────────────
export const PLATFORM_CONFIG = {
  monetizationEnabled: false, // Disabled for initial release
  developmentHints: true,     // Hints are free in dev/initial release
  advertisingRequests: false,
  debugAdvertisingInterface: true,
  portalDetection: true,
};
