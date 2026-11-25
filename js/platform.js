/* =========================================================================
   CUBIQO: ARROW ESCAPE — platform.js
   Portal SDK & Monetization Adapter Architecture (PRD §8 & §9).
   Monetization is DISABLED in the initial release; adapters are ready for
   Poki, CrazyGames, and GameDistribution without changing core gameplay.
   ========================================================================= */
(function (global) {
  'use strict';

  var Cubiqo = global.Cubiqo = global.Cubiqo || {};
  var MONETIZATION = Cubiqo.Config.MONETIZATION;

  function DevAdapter() { this.name = 'dev'; }
  DevAdapter.prototype = {
    initialize: function () { return Promise.resolve(true); },
    isAvailable: function () { return false; },
    showRewardedHint: function () { return Promise.resolve(true); },
    showInterstitial: function () { return Promise.resolve(); },
    pauseGame: function () {},
    resumeGame: function () {},
    gameLoadingFinished: function () {},
    gameplayStart: function () {},
    gameplayStop: function () {},
    saveCloud: function () { return Promise.resolve(false); },
    loadCloud: function () { return Promise.resolve(null); }
  };

  function PokiAdapter() { this.name = 'poki'; this.sdk = null; }
  PokiAdapter.prototype = {
    initialize: function () {
      this.sdk = global.PokiSDK || null;
      if (!this.sdk || !this.sdk.init) return Promise.resolve(false);
      return this.sdk.init().then(function () { return true; }).catch(function () { return false; });
    },
    isAvailable: function () { return MONETIZATION.enabled && !!this.sdk; },
    showRewardedHint: function () {
      if (!this.isAvailable() || !this.sdk.rewardedBreak) return Promise.resolve(true);
      return this.sdk.rewardedBreak().then(function (ok) { return !!ok; }).catch(function () { return false; });
    },
    showInterstitial: function () {
      if (!this.isAvailable() || !this.sdk.commercialBreak) return Promise.resolve();
      return this.sdk.commercialBreak().catch(function () {});
    },
    pauseGame: function () { if (this.sdk && this.sdk.gameplayStop) this.sdk.gameplayStop(); },
    resumeGame: function () { if (this.sdk && this.sdk.gameplayStart) this.sdk.gameplayStart(); },
    gameLoadingFinished: function () { if (this.sdk && this.sdk.gameLoadingFinished) this.sdk.gameLoadingFinished(); },
    gameplayStart: function () { if (this.sdk && this.sdk.gameplayStart) this.sdk.gameplayStart(); },
    gameplayStop: function () { if (this.sdk && this.sdk.gameplayStop) this.sdk.gameplayStop(); },
    saveCloud: function () { return Promise.resolve(false); },
    loadCloud: function () { return Promise.resolve(null); }
  };

  function CrazyGamesAdapter() { this.name = 'crazygames'; this.sdk = null; }
  CrazyGamesAdapter.prototype = {
    initialize: function () {
      this.sdk = (global.CrazyGames && global.CrazyGames.SDK) || null;
      if (!this.sdk || !this.sdk.init) return Promise.resolve(false);
      return this.sdk.init().then(function () { return true; }).catch(function () { return false; });
    },
    isAvailable: function () { return MONETIZATION.enabled && !!this.sdk; },
    showRewardedHint: function () {
      var sdk = this.sdk;
      if (!this.isAvailable() || !sdk.ad || !sdk.ad.requestAd) return Promise.resolve(true);
      return new Promise(function (resolve) {
        sdk.ad.requestAd('rewarded', {
          adFinished: function () { resolve(true); },
          adError: function () { resolve(false); }
        });
      });
    },
    showInterstitial: function () {
      var sdk = this.sdk;
      if (!this.isAvailable() || !sdk.ad || !sdk.ad.requestAd) return Promise.resolve();
      return new Promise(function (resolve) {
        sdk.ad.requestAd('midgame', {
          adFinished: function () { resolve(); },
          adError: function () { resolve(); }
        });
      });
    },
    pauseGame: function () { if (this.sdk && this.sdk.gameplay && this.sdk.gameplay.stop) this.sdk.gameplay.stop(); },
    resumeGame: function () { if (this.sdk && this.sdk.gameplay && this.sdk.gameplay.start) this.sdk.gameplay.start(); },
    gameLoadingFinished: function () { if (this.sdk && this.sdk.game && this.sdk.game.loadingStop) this.sdk.game.loadingStop(); },
    gameplayStart: function () { if (this.sdk && this.sdk.gameplay && this.sdk.gameplay.start) this.sdk.gameplay.start(); },
    gameplayStop: function () { if (this.sdk && this.sdk.gameplay && this.sdk.gameplay.stop) this.sdk.gameplay.stop(); },
    saveCloud: function () { return Promise.resolve(false); },
    loadCloud: function () { return Promise.resolve(null); }
  };

  function GameDistributionAdapter() { this.name = 'gamedistribution'; this.sdk = null; }
  GameDistributionAdapter.prototype = {
    initialize: function () {
      this.sdk = global.gdsdk || null;
      return Promise.resolve(!!this.sdk);
    },
    isAvailable: function () { return MONETIZATION.enabled && !!this.sdk; },
    showRewardedHint: function () {
      if (!this.isAvailable() || !this.sdk.showAd) return Promise.resolve(true);
      return this.sdk.showAd('rewarded').then(function () { return true; }).catch(function () { return false; });
    },
    showInterstitial: function () {
      if (!this.isAvailable() || !this.sdk.showAd) return Promise.resolve();
      return this.sdk.showAd().catch(function () {});
    },
    pauseGame: function () {},
    resumeGame: function () {},
    gameLoadingFinished: function () {},
    gameplayStart: function () {},
    gameplayStop: function () {},
    saveCloud: function () { return Promise.resolve(false); },
    loadCloud: function () { return Promise.resolve(null); }
  };

  function detectPortal() {
    if (!MONETIZATION.portalDetection) return 'dev';
    if (typeof global.PokiSDK !== 'undefined') return 'poki';
    if (typeof global.CrazyGames !== 'undefined') return 'crazygames';
    if (typeof global.gdsdk !== 'undefined') return 'gamedistribution';
    return 'dev';
  }

  function createAdapter(portal) {
    switch (portal || detectPortal()) {
      case 'poki': return new PokiAdapter();
      case 'crazygames': return new CrazyGamesAdapter();
      case 'gamedistribution': return new GameDistributionAdapter();
      default: return new DevAdapter();
    }
  }

  var active = new DevAdapter();

  Cubiqo.Platform = {
    detectPortal: detectPortal,
    createAdapter: createAdapter,
    initialize: function (portal) {
      active = createAdapter(portal);
      return active.initialize().catch(function () {
        active = new DevAdapter();
        return false;
      });
    },
    current: function () { return active; },
    isAvailable: function () { return active.isAvailable(); },
    showRewardedHint: function () { return active.showRewardedHint(); },
    showInterstitial: function () { return active.showInterstitial(); },
    pauseGame: function () { active.pauseGame(); },
    resumeGame: function () { active.resumeGame(); },
    gameLoadingFinished: function () { active.gameLoadingFinished(); },
    gameplayStart: function () { active.gameplayStart(); },
    gameplayStop: function () { active.gameplayStop(); },
    saveCloud: function (data) { return active.saveCloud(data); },
    loadCloud: function () { return active.loadCloud(); }
  };
})(typeof window !== 'undefined' ? window : globalThis);
