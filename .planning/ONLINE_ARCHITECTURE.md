# CUBIQO: ARROW ESCAPE — Fully Online Architecture

**Updated:** 2026-11-25  
**Model:** Online-only HTML5 browser game (no offline mode or offline gameplay fallback).

## 1. Connectivity Gate (`js/network.js`, `js/app.js`, `js/ui.js`)
- `Config.ONLINE_REQUIRED = true` enforces an active internet connection at startup and throughout gameplay.
- `Network.check()` verifies `navigator.onLine` and performs a no-store `HEAD ./favicon.svg?_ping=...` probe (4s timeout) to detect real connectivity.
- **Startup Gate:** `renderLoading()` awaits `Network.check()`. If offline, `#offlineGate` (`"INTERNET CONNECTION REQUIRED"`) blocks transition to Home until connectivity is restored.
- **Mid-Game Connection Loss:** `window` `'offline'` (or a failed probe during `startMainLevel` / `startDailyLevel` / `handleArrowTap` / `triggerHint`) immediately pauses active gameplay, stops ambient audio, and mounts `#offlineGate`.
- **Reconnection:** `window` `'online'` or clicking **`↻ Retry Connection`** re-runs `Network.check()`, dismisses `#offlineGate` when verified online, and initializes the portal SDK if needed. Local `Storage` progress is preserved across disconnects.

## 2. Portal SDK & Advertising Architecture (`js/platform.js`, `js/hints.js`)
- **Supported Portal Adapters:**
  - `PokiAdapter`: `PokiSDK.init()`, `gameLoadingFinished()`, `gameplayStart()`, `gameplayStop()`, `rewardedBreak()`, `commercialBreak()`.
  - `CrazyGamesAdapter`: `CrazyGames.SDK.init()`, `game.loadingStop()`, `gameplay.start()`, `gameplay.stop()`, `ad.requestAd('rewarded' | 'midgame')`.
  - `GameDistributionAdapter`: `gdsdk`, `gdsdk.showAd('rewarded')`, `gdsdk.showAd()`.
  - `DevAdapter`: Standalone/development fallback (`isAvailable() === false`).
- **Strict No-Fake-Reward Rule:**
  - Every portal adapter's `showRewardedHint()` returns `false` if offline, if the SDK is unavailable/failed, or if `adError` / declined / rejected occurs.
  - `Hints.requestHint()` only grants a rewarded hint when `showRewardedHint()` resolves strictly `true`.
  - Standalone/dev builds keep hints as normal free gameplay assistance (`MONETIZATION.enabled = false`) without simulating ads.
- **Graceful SDK Failure Handling:** `Platform.initialize()` catches SDK initialization errors, sets `status: 'failed'`, and falls back safely without crashing gameplay.
