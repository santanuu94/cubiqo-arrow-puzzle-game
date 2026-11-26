/* =========================================================================
   tests/run.mjs
   Unit & integration test suite covering engine, levels, storage, hints & SDK.
   Usage: npm test
   ========================================================================= */
import assert from 'node:assert/strict';
import { loadGame, CORE_FILES, installLocalStorageStub } from '../tools/_load.mjs';

installLocalStorageStub();

const Cubiqo = loadGame([
  'js/config.js',
  'js/utils.js',
  'js/network.js',
  'js/storage.js',
  'js/puzzle.js',
  'js/level-generator.js',
  'js/levels.js',
  'js/audio.js',
  'js/platform.js',
  'js/analytics.js',
  'js/hints.js',
  'js/daily.js',
  'js/achievements.js',
  'js/themes.js'
]);

const { Config, Network, Puzzle, Storage, DailyStore, Daily, LevelGenerator, Levels, Hints, Platform, Achievements, Themes } = Cubiqo;

let passed = 0;
async function test(name, fn) {
  try {
    await fn();
    passed++;
    console.log(`  ✓ ${name}`);
  } catch (err) {
    console.error(`  ✗ ${name}`);
    console.error(err);
    process.exitCode = 1;
  }
}

console.log('Running CUBIQO unit tests...\n');

await test('all 4 directional arrows exit when clear and block when occupied', () => {
  const lv = {
    id: 999,
    size: 3,
    arrows: [
      { id: 0, x: 1, y: 0, dir: 'up' },
      { id: 1, x: 1, y: 1, dir: 'up' },
      { id: 2, x: 2, y: 1, dir: 'right' },
      { id: 3, x: 0, y: 2, dir: 'left' },
      { id: 4, x: 1, y: 2, dir: 'down' }
    ]
  };
  const board = Puzzle.createBoard(lv);
  assert.equal(Puzzle.tryRemove(board, 1).ok, false);
  assert.equal(Puzzle.countRemaining(board), 5);

  assert.equal(Puzzle.tryRemove(board, 0).ok, true);
  assert.equal(Puzzle.tryRemove(board, 0).ok, false); // no duplicate removal
  assert.equal(Puzzle.tryRemove(board, 1).ok, true);
  assert.equal(Puzzle.tryRemove(board, 2).ok, true);
  assert.equal(Puzzle.tryRemove(board, 3).ok, true);
  assert.equal(Puzzle.tryRemove(board, 4).ok, true);
  assert.equal(Puzzle.isComplete(board), true);
});

await test('all 100 levels exist, are unique, and pass solver validation', () => {
  assert.equal(Levels.LIST.length, 100);
  for (const lv of Levels.LIST) {
    const errs = Puzzle.validateLevel(lv);
    assert.deepEqual(errs, [], `Level ${lv.id} errors: ${errs.join(', ')}`);
  }
});

await test('hints never recommend an invalid or blocked arrow', async () => {
  const lv = Levels.byId(15);
  const board = Puzzle.createBoard(lv);
  const res = await Hints.requestHint(board);
  assert.equal(res.ok, true);
  assert.ok(res.arrow);
  assert.equal(Puzzle.isClear(board, res.arrow), true);
});

await test('storage saves, preserves best records, unlocks next level, and resets safely', () => {
  localStorage.setItem('unrelated-app-key', 'keep-me');
  Storage.resetProgress();

  assert.equal(Storage.isUnlocked(1), true);
  assert.equal(Storage.isUnlocked(2), false);

  Storage.completeLevel(1, 5, 3);
  assert.equal(Storage.isUnlocked(2), true);
  assert.equal(Storage.levelRecord(1).bestMoves, 5);
  assert.equal(Storage.levelRecord(1).stars, 3);

  // Replaying with worse moves does not overwrite bestMoves or stars
  Storage.completeLevel(1, 9, 1);
  assert.equal(Storage.levelRecord(1).bestMoves, 5);
  assert.equal(Storage.levelRecord(1).stars, 3);

  Storage.resetProgress();
  assert.equal(Storage.isUnlocked(2), false);
  assert.equal(localStorage.getItem('unrelated-app-key'), 'keep-me');
});

await test('restricted localStorage falls back to in-memory storage without crashing', () => {
  const orig = globalThis.localStorage;
  globalThis.localStorage = {
    getItem() { throw new Error('blocked'); },
    setItem() { throw new Error('blocked'); },
    removeItem() { throw new Error('blocked'); }
  };
  try {
    Storage.resetProgress();
    Storage.completeLevel(1, 3, 3);
    assert.equal(Storage.levelRecord(1).bestMoves, 3);
    DailyStore.markComplete('2026-11-25', 14, 3);
    assert.equal(DailyStore.todayDone('2026-11-25'), true);
  } finally {
    globalThis.localStorage = orig;
  }
});

await test('daily challenge is deterministic and isolated from main campaign', () => {
  Storage.resetProgress();
  const d1 = LevelGenerator.generateDaily('2026-11-25');
  const d2 = LevelGenerator.generateDaily('2026-11-25');
  assert.equal(d1.arrows.length, d2.arrows.length);
  assert.equal(Puzzle.peel(d1).solvable, true);

  DailyStore.markComplete('2026-11-25', 14, 3);
  assert.equal(DailyStore.todayDone('2026-11-25'), true);
  assert.equal(Storage.load().highestUnlocked, 1);
});

await test('platform adapter keeps hints free and DevAdapter unavailable in Stage 3', async () => {
  assert.equal(Config.MONETIZATION.midgameAdsEnabled, true);
  assert.equal(Config.MONETIZATION.rewardedAdsEnabled, true);
  assert.equal(Config.MONETIZATION.hintsFree, true);
  await Platform.initialize('dev');
  assert.equal(Platform.isAvailable(), false);
  assert.equal(Platform.isRewardedAvailable(), false);
  assert.equal(await Platform.showRewardedHint(), false);
});

await test('lifeline system gives 3 chances: wrong moves are blocked and detected', () => {
  const lv = {
    id: 998,
    size: 3,
    arrows: [
      { id: 0, x: 1, y: 1, dir: 'up' },
      { id: 1, x: 1, y: 0, dir: 'down' } // blocks arrow 0
    ]
  };
  const board = Puzzle.createBoard(lv);
  let lives = 3;
  let gameOver = false;

  // Arrow 0 cannot exit because Arrow 1 is in front of it
  const r1 = Puzzle.tryRemove(board, 0);
  assert.equal(r1.ok, false);
  lives--;
  assert.equal(lives, 2);

  // Another blocked tap
  const r2 = Puzzle.tryRemove(board, 0);
  assert.equal(r2.ok, false);
  lives--;
  assert.equal(lives, 1);

  // Third blocked tap -> game over
  const r3 = Puzzle.tryRemove(board, 0);
  assert.equal(r3.ok, false);
  lives--;
  assert.equal(lives, 0);
  if (lives <= 0) gameOver = true;
  assert.equal(gameOver, true);
});

await test('all 100 levels have 1-star, 2-star, and 3-star targets reachable under 3-heart rule', () => {
  for (const lv of Levels.LIST) {
    const k = lv.arrows.length;
    assert.equal(LevelGenerator.starsForMoves(k, lv.stars), 3, `Level ${lv.id} 3-star`);
    assert.equal(LevelGenerator.starsForMoves(k + 1, lv.stars), 2, `Level ${lv.id} 2-star`);
    assert.equal(LevelGenerator.starsForMoves(k + 2, lv.stars), 1, `Level ${lv.id} 1-star`);
  }
});

await test('daily challenge handles date changes, streaks, broken streaks & duplicate reward prevention', () => {
  Storage.resetProgress();

  // Day 1 completion -> first claim, streak = 1
  const r1 = Daily.completeToday(14, 3, '2026-11-20');
  assert.equal(r1.isFirstClaim, true);
  assert.equal(r1.streak, 1);

  // Same-day replay with worse moves -> duplicate reward prevented, best record preserved
  const r1Dup = Daily.completeToday(18, 1, '2026-11-20');
  assert.equal(r1Dup.isFirstClaim, false);
  assert.equal(r1Dup.bestMoves, 14);
  assert.equal(r1Dup.bestStars, 3);
  assert.equal(r1Dup.streak, 1);

  // Consecutive Day 2 -> streak = 2
  const r2 = Daily.completeToday(15, 2, '2026-11-21');
  assert.equal(r2.isFirstClaim, true);
  assert.equal(r2.streak, 2);
  assert.equal(Daily.getStatus('2026-11-21').streak, 2);
  assert.equal(Daily.getStatus('2026-11-22').streak, 2); // still valid next day

  // Skipped Day 22 -> on Day 23 effective streak resets to 0, bestStreak stays 2
  assert.equal(Daily.getStatus('2026-11-23').streak, 0);
  assert.equal(Daily.getStatus('2026-11-23').bestStreak, 2);
  const r3 = Daily.completeToday(14, 3, '2026-11-23');
  assert.equal(r3.streak, 1);
  assert.equal(r3.bestStreak, 2);
});

await test('achievement system unlocks, persists, and avoids duplicate unlocks', () => {
  Storage.resetProgress();
  assert.equal(Achievements.evaluate().length, 0);

  Storage.completeLevel(1, 2, 3);
  const unlocked1 = Achievements.evaluate().map((a) => a.id);
  assert.ok(unlocked1.includes('first-clear'));
  assert.ok(unlocked1.includes('perfect-1'));

  // Re-evaluating does not re-unlock already earned achievements
  assert.equal(Achievements.evaluate().length, 0);
  assert.equal(Storage.hasAchievement('first-clear'), true);
});

await test('unlockable themes enforce locks, unlock at milestones & daily streak, and equip safely', () => {
  Storage.resetProgress();
  assert.equal(Storage.getActiveTheme(), 'classic');
  assert.equal(Themes.isUnlocked('classic'), true);
  assert.equal(Themes.isUnlocked('ocean'), false);
  assert.equal(Themes.equip('ocean'), false); // cannot equip locked theme

  // Clearing Level 10 unlocks Ocean Breeze
  Storage.completeLevel(10, 6, 3);
  const mThemes = Themes.syncUnlocks().map((t) => t.id);
  assert.ok(mThemes.includes('ocean'));
  assert.equal(Themes.equip('ocean'), true);
  assert.equal(Storage.getActiveTheme(), 'ocean');

  // 3-day daily streak unlocks Daily Aurora
  Daily.completeToday(14, 3, '2026-11-01');
  Daily.completeToday(14, 3, '2026-11-02');
  Daily.completeToday(14, 3, '2026-11-03');
  const dThemes = Themes.syncUnlocks().map((t) => t.id);
  assert.ok(dThemes.includes('aurora'));
  assert.equal(Themes.isUnlocked('aurora'), true);
});

await test('corrupted save data, invalid JSON, and out-of-range fields recover gracefully', () => {
  Storage.resetProgress();
  const corruptedMain = {
    highestUnlocked: 9999,
    levels: { '1': { stars: 3, bestMoves: 2 }, bad: 'corrupt', '999': { stars: 99 } },
    totalStars: 999,
    dailyStreak: -5,
    activeTheme: 'nonexistent-theme',
    unlockedThemes: [123, null]
  };
  const imported = Storage.importSave({
    main: corruptedMain,
    daily: { completions: { '2026-11-25': { moves: 14, stars: 3 } }, bestStreak: 4 }
  });
  assert.equal(imported, true);
  const loaded = Storage.load();
  assert.equal(loaded.highestUnlocked, 100); // clamped to TOTAL_LEVELS
  assert.equal(loaded.totalStars, 3); // recomputed from valid level 1 only
  assert.equal(loaded.activeTheme, 'classic'); // fallback when invalid
  assert.ok(loaded.unlockedThemes.includes('classic'));
  assert.equal(DailyStore.get().bestStreak, 4);

  // Invalid JSON in localStorage never crashes Utils.storage.get
  localStorage.setItem(Config.SAVE_KEY, '{not-valid-json');
  assert.equal(Cubiqo.Utils.storage.get(Config.SAVE_KEY), null);
});

await test('platform adapter exposes cloud-save hooks without requiring backend', async () => {
  assert.equal(typeof Platform.saveCloud, 'function');
  assert.equal(typeof Platform.loadCloud, 'function');
  assert.equal(await Platform.saveCloud(Storage.exportSave()), false);
  assert.equal(await Platform.loadCloud(), null);
});

await test('online network check blocks offline state and restores on reconnect', async () => {
  const events = [];
  Network.subscribe((s) => events.push(s));

  Network.setProbe(() => false);
  assert.equal(await Network.check(), false);
  assert.equal(Network.isOnline(), false);

  const lv = Levels.byId(1);
  const board = Puzzle.createBoard(lv);
  const offlineHint = await Hints.requestHint(board);
  assert.equal(offlineHint.ok, false);
  assert.equal(offlineHint.reason, 'offline');

  Network.setProbe(() => true);
  assert.equal(await Network.check(), true);
  assert.equal(Network.isOnline(), true);
  assert.deepEqual(events.slice(-2), [false, true]);
  Network.setProbe(null);
});

await test('portal SDK failures are handled gracefully and never fake rewarded ads', async () => {
  const prevEnabled = Config.MONETIZATION.enabled;
  const prevAdReq = Config.MONETIZATION.adRequestsEnabled;
  const prevRew = Config.MONETIZATION.rewardedAdsEnabled;
  const prevPoki = globalThis.PokiSDK;

  try {
    // 1. SDK init failure does not crash and marks status failed
    globalThis.PokiSDK = { init: () => Promise.reject(new Error('SDK down')) };
    const initOk = await Platform.initialize('poki');
    assert.equal(initOk, false);
    assert.equal(Platform.getStatus().status, 'failed');
    assert.equal(Platform.isAvailable(), false);

    // 2. Active portal SDK with rewarded ads enabled: ad declined/failed NEVER grants rewarded benefit
    Config.MONETIZATION.enabled = true;
    Config.MONETIZATION.adRequestsEnabled = true;
    Config.MONETIZATION.rewardedAdsEnabled = true;
    globalThis.PokiSDK = {
      init: () => Promise.resolve(),
      rewardedBreak: () => Promise.resolve(false)
    };
    assert.equal(await Platform.initialize('poki'), true);
    assert.equal(Platform.isAvailable(), true);

    const board = Puzzle.createBoard(Levels.byId(1));
    const denied = await Hints.requestHint(board, { useAd: true });
    assert.equal(denied.ok, false);
    assert.equal(denied.reason, 'ad-unavailable');

    // 3. Only confirmed rewardedBreak === true grants the hint
    globalThis.PokiSDK.rewardedBreak = () => Promise.resolve(true);
    const granted = await Hints.requestHint(board, { useAd: true });
    assert.equal(granted.ok, true);
    assert.ok(granted.arrow);
  } finally {
    Config.MONETIZATION.enabled = prevEnabled;
    Config.MONETIZATION.adRequestsEnabled = prevAdReq;
    Config.MONETIZATION.rewardedAdsEnabled = prevRew;
    if (prevPoki === undefined) delete globalThis.PokiSDK;
    else globalThis.PokiSDK = prevPoki;
    await Platform.initialize('dev');
  }
});

await test('CrazyGames SDK v3 handles init, environments, lifecycle, and muteAudio', async () => {
  const prevCG = globalThis.CrazyGames;
  try {
    // 1. Disabled environment safely blocks all SDK calls
    let calls = [];
    globalThis.CrazyGames = {
      SDK: {
        environment: 'disabled',
        init: async () => {},
        game: {
          loadingStart: () => calls.push('loadingStart'),
          loadingStop: () => calls.push('loadingStop'),
          gameplayStart: () => calls.push('gameplayStart'),
          gameplayStop: () => calls.push('gameplayStop')
        }
      }
    };
    assert.equal(await Platform.initialize('crazygames'), false);
    assert.equal(Platform.getEnvironment(), 'disabled');
    Platform.gameLoadingFinished();
    Platform.gameplayStart();
    Platform.gameplayStop();
    assert.deepEqual(calls, []);

    // 2. Local / CrazyGames environment: loading, lifecycle deduplication, and muteAudio
    calls = [];
    let settingsCb = null;
    globalThis.CrazyGames = {
      SDK: {
        environment: 'local',
        init: async () => {},
        game: {
          settings: { muteAudio: true },
          addSettingsChangeListener: (cb) => { settingsCb = cb; },
          loadingStart: () => calls.push('loadingStart'),
          loadingStop: () => calls.push('loadingStop'),
          gameplayStart: () => calls.push('gameplayStart'),
          gameplayStop: () => calls.push('gameplayStop')
        }
      }
    };
    assert.equal(await Platform.initialize('crazygames'), true);
    assert.equal(Platform.getEnvironment(), 'local');
    assert.equal(Cubiqo.Audio.isPlatformMuted(), true);
    assert.equal(Platform.isAvailable(), true); // ready for midgame ads in Stage 2

    // Settings change listener updates muteAudio dynamically
    assert.ok(settingsCb);
    settingsCb({ muteAudio: false });
    assert.equal(Cubiqo.Audio.isPlatformMuted(), false);
    settingsCb({ muteAudio: true });
    assert.equal(Cubiqo.Audio.isPlatformMuted(), true);
    settingsCb({ muteAudio: false });

    // Loading & gameplay lifecycle events never duplicate and respect 1s SDK throttle
    Platform.gameLoadingStart(); // already called by initialize()
    Platform.gameLoadingFinished();
    Platform.gameLoadingFinished();
    Platform.gameplayStart();
    Platform.gameplayStart(); // duplicate ignored
    assert.deepEqual(calls, ['loadingStart', 'loadingStop', 'gameplayStart']);
    Platform.pauseGame();
    Platform.resumeGame();
    Platform.gameplayStop();
    // Rapid pause/resume/stop within 1000ms is throttled rather than spamming CrazyGames SDK
    assert.equal(calls.length, 3);
  } finally {
    Cubiqo.Audio.setPlatformMute(false);
    if (prevCG === undefined) delete globalThis.CrazyGames;
    else globalThis.CrazyGames = prevCG;
    await Platform.initialize('dev');
  }
});

await test('CrazyGames Stage 2 midgame ads handle adStarted/adFinished/adError, audio restore & deduplication', async () => {
  const prevCG = globalThis.CrazyGames;
  try {
    let adRequests = 0;
    let lastCallbacks = null;
    globalThis.CrazyGames = {
      SDK: {
        environment: 'crazygames',
        init: async () => {},
        game: { settings: { muteAudio: false } },
        ad: {
          requestAd: (type, cb) => {
            assert.equal(type, 'midgame');
            adRequests++;
            lastCallbacks = cb;
          }
        }
      }
    };

    assert.equal(await Platform.initialize('crazygames'), true);

    // 1. adStarted mutes audio (NOT before!), adFinished restores audio; duplicate calls coalesce
    const p1 = Platform.showInterstitial();
    const p2 = Platform.showInterstitial();
    assert.equal(adRequests, 1); // no duplicate ad requests
    assert.equal(Cubiqo.Audio.isAdMuted(), false); // never muted before adStarted
    lastCallbacks.adStarted();
    assert.equal(Cubiqo.Audio.isAdMuted(), true);
    lastCallbacks.adFinished();
    assert.equal(await p1, true);
    assert.equal(await p2, true);
    assert.equal(Cubiqo.Audio.isAdMuted(), false);

    // 2. adError (unfilled / adblocker / Basic Launch) restores audio & resolves false without freezing
    const p3 = Platform.showInterstitial();
    assert.equal(adRequests, 2);
    lastCallbacks.adStarted();
    assert.equal(Cubiqo.Audio.isAdMuted(), true);
    lastCallbacks.adError({ code: 'adblock' });
    assert.equal(await p3, false);
    assert.equal(Cubiqo.Audio.isAdMuted(), false);

    // 3. Normal free hints remain available without ads
    const hintRes = await Hints.requestHint(Puzzle.createBoard(Levels.byId(1)));
    assert.equal(hintRes.ok, true);
    assert.equal(adRequests, 2);
  } finally {
    Cubiqo.Audio.setAdMute(false);
    Cubiqo.Audio.setPlatformMute(false);
    if (prevCG === undefined) delete globalThis.CrazyGames;
    else globalThis.CrazyGames = prevCG;
    await Platform.initialize('dev');
  }
});

await test('CrazyGames Stage 3 rewarded ads enforce lifecycle, cooldown, single-reward & coin economy', async () => {
  const prevCG = globalThis.CrazyGames;
  try {
    Storage.resetProgress();

    // 1. Coin economy: first clear + 3-star bonus + milestone bonus, no duplicate claims, no negative balance
    assert.equal(Storage.getCoins(), 0);
    const c1 = Storage.completeLevel(1, 2, 3);
    assert.equal(c1.coinsEarned, 15);
    assert.equal(Storage.getCoins(), 15);
    const c1Dup = Storage.completeLevel(1, 2, 3);
    assert.equal(c1Dup.coinsEarned, 0);
    assert.equal(Storage.getCoins(), 15);

    const c10 = Storage.completeLevel(10, 6, 3);
    assert.equal(c10.coinsEarned, 65); // 10 + 5 + 50 milestone
    assert.equal(Storage.getCoins(), 80);

    assert.equal(Storage.spendCoins(30), true);
    assert.equal(Storage.getCoins(), 50);
    assert.equal(Storage.spendCoins(999), false); // cannot go negative
    assert.equal(Storage.getCoins(), 50);

    // 2. CrazyGames rewarded ad lifecycle + double-callback + cooldown + adError
    let reqCount = 0;
    let lastCb = null;
    globalThis.CrazyGames = {
      SDK: {
        environment: 'crazygames',
        init: async () => {},
        game: { settings: { muteAudio: false } },
        ad: {
          requestAd: (type, cb) => {
            assert.equal(type, 'rewarded');
            reqCount++;
            lastCb = cb;
          }
        }
      }
    };

    assert.equal(await Platform.initialize('crazygames'), true);
    assert.equal(Platform.isRewardedAvailable(), true);
    assert.equal(Platform.getRewardedCooldownRemaining(), 0);

    // adError grants no reward and restores audio
    const pErr = Platform.showRewardedAd();
    assert.equal(reqCount, 1);
    lastCb.adStarted();
    assert.equal(Cubiqo.Audio.isAdMuted(), true);
    lastCb.adError({ code: 'adblock' });
    assert.equal(await pErr, false);
    assert.equal(Cubiqo.Audio.isAdMuted(), false);
    assert.equal(Platform.getRewardedCooldownRemaining(), 0); // failed ad does not lock cooldown

    // adFinished grants once, deduplicates concurrent calls, and activates cooldown
    const pA = Platform.showRewardedAd();
    const pB = Platform.showRewardedAd();
    assert.equal(reqCount, 2);
    lastCb.adStarted();
    assert.equal(Cubiqo.Audio.isAdMuted(), true);
    lastCb.adFinished();
    lastCb.adFinished(); // duplicate callback ignored
    assert.equal(await pA, true);
    assert.equal(await pB, true);
    assert.equal(Cubiqo.Audio.isAdMuted(), false);
    assert.ok(Platform.getRewardedCooldownRemaining() > 0);

    // During cooldown, new rewarded ad request is blocked
    assert.equal(await Platform.showRewardedAd(), false);
    assert.equal(reqCount, 2);

    // Reset cooldown -> rewarded hint only granted after adFinished
    Storage.setLastRewardedAdAt(0);
    const pHint = Hints.requestHint(Puzzle.createBoard(Levels.byId(1)), { useAd: true });
    assert.equal(reqCount, 3);
    lastCb.adStarted();
    lastCb.adFinished();
    const hintRes = await pHint;
    assert.equal(hintRes.ok, true);
    assert.ok(hintRes.arrow);

    // 3. Basic Launch / missing ad object -> isRewardedAvailable() is false
    globalThis.CrazyGames = {
      SDK: { environment: 'crazygames', init: async () => {}, game: {} }
    };
    await Platform.initialize('crazygames');
    assert.equal(Platform.isRewardedAvailable(), false);
  } finally {
    Storage.resetProgress();
    Cubiqo.Audio.setAdMute(false);
    Cubiqo.Audio.setPlatformMute(false);
    if (prevCG === undefined) delete globalThis.CrazyGames;
    else globalThis.CrazyGames = prevCG;
    await Platform.initialize('dev');
  }
});

await test('CrazyGames Stage 4 banners enforce 20s cooldown, clearAllBanners, and error handling', async () => {
  const prevCG = globalThis.CrazyGames;
  try {
    let bannerCalls = 0;
    let cleared = 0;
    let nextErr = null;
    globalThis.CrazyGames = {
      SDK: {
        environment: 'crazygames',
        init: async () => {},
        game: { settings: { muteAudio: false } },
        banner: {
          requestResponsiveBanner: async (id) => {
            bannerCalls++;
            assert.ok(id);
            if (nextErr) throw { code: nextErr };
          },
          clearAllBanners: () => { cleared++; }
        }
      }
    };

    assert.equal(await Platform.initialize('crazygames'), true);
    assert.equal(Platform.isBannerAvailable(), true);

    // 1. First request succeeds; immediate repeat hits 20s cooldown
    const b1 = await Platform.requestResponsiveBanner('responsive-banner-container');
    assert.equal(b1.ok, true);
    assert.equal(bannerCalls, 1);

    const bCooldown = await Platform.requestResponsiveBanner('responsive-banner-container');
    assert.equal(bCooldown.ok, false);
    assert.equal(bCooldown.code, 'bannerCooldown');
    assert.equal(bannerCalls, 1);

    Platform.clearAllBanners();
    assert.equal(cleared, 1);

    // 2. Transient errors (unfilled, adblock/other, notVisible, etc.) do not crash
    for (const code of ['unfilled', 'missingId', 'notVisible', 'noAvailableSizes', 'notCreated', 'videoAdPlaying', 'other']) {
      nextErr = code;
      const res = await Platform.requestResponsiveBanner('banner-' + code);
      assert.equal(res.ok, false);
      assert.equal(res.code, code);
    }

    // 3. bannersDisabled (Basic Launch) disables banners for the session
    nextErr = 'bannersDisabled';
    const bDis = await Platform.requestResponsiveBanner('banner-basic');
    assert.equal(bDis.ok, false);
    assert.equal(bDis.code, 'bannersDisabled');
    assert.equal(Platform.isBannerAvailable(), false);
  } finally {
    if (prevCG === undefined) delete globalThis.CrazyGames;
    else globalThis.CrazyGames = prevCG;
    await Platform.initialize('dev');
  }
});

console.log(`\n${passed} tests passed.`);
