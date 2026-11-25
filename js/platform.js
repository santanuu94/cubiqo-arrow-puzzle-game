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

  function onlineOk() {
    return !Cubiqo.Network || Cubiqo.Network.isOnline();
  }

  function DevAdapter() { this.name = 'dev'; this.ready = true; }
  DevAdapter.prototype = {
    initialize: function () { this.ready = true; return Promise.resolve(true); },
    isAvailable: function () { return false; },
    showRewardedHint: function () { return Promise.resolve(false); },
    showInterstitial: function () { return Promise.resolve(false); },
    pauseGame: function () {},
    resumeGame: function () {},
    gameLoadingFinished: function () {},
    gameplayStart: function () {},
    gameplayStop: function () {},
    saveCloud: function () { return Promise.resolve(false); },
    loadCloud: function () { return Promise.resolve(null); }
  };

  function PokiAdapter() { this.name = 'poki'; this.sdk = null; this.ready = false; }
  PokiAdapter.prototype = {
    initialize: function () {
      var self = this;
      this.sdk = global.PokiSDK || null;
      if (!this.sdk || !this.sdk.init) { self.ready = false; return Promise.resolve(false); }
      return this.sdk.init().then(function () {
        self.ready = true;
        return true;
      }).catch(function () {
        self.ready = false;
        return false;
      });
    },
    isAvailable: function () { return MONETIZATION.enabled && MONETIZATION.adRequestsEnabled && this.ready && !!this.sdk && onlineOk(); },
    showRewardedHint: function () {
      if (!this.isAvailable() || !this.sdk.rewardedBreak) return Promise.resolve(false);
      return this.sdk.rewardedBreak().then(function (ok) { return ok === true; }).catch(function () { return false; });
    },
    showInterstitial: function () {
      if (!this.isAvailable() || !this.sdk.commercialBreak) return Promise.resolve(false);
      return this.sdk.commercialBreak().then(function () { return true; }).catch(function () { return false; });
    },
    pauseGame: function () { if (this.sdk && this.sdk.gameplayStop) this.sdk.gameplayStop(); },
    resumeGame: function () { if (this.sdk && this.sdk.gameplayStart) this.sdk.gameplayStart(); },
    gameLoadingFinished: function () { if (this.sdk && this.sdk.gameLoadingFinished) this.sdk.gameLoadingFinished(); },
    gameplayStart: function () { if (this.sdk && this.sdk.gameplayStart) this.sdk.gameplayStart(); },
    gameplayStop: function () { if (this.sdk && this.sdk.gameplayStop) this.sdk.gameplayStop(); },
    saveCloud: function () { return Promise.resolve(false); },
    loadCloud: function () { return Promise.resolve(null); }
  };

  function CrazyGamesAdapter() { this.name = 'crazygames'; this.sdk = null; this.ready = false; }
  CrazyGamesAdapter.prototype = {
    initialize: function () {
      var self = this;
      this.sdk = (global.CrazyGames && global.CrazyGames.SDK) || null;
      if (!this.sdk || !this.sdk.init) { self.ready = false; return Promise.resolve(false); }
      return this.sdk.init().then(function () {
        self.ready = true;
        return true;
      }).catch(function () {
        self.ready = false;
        return false;
      });
    },
    isAvailable: function () { return MONETIZATION.enabled && MONETIZATION.adRequestsEnabled && this.ready && !!this.sdk && onlineOk(); },
    showRewardedHint: function () {
      var sdk = this.sdk;
      if (!this.isAvailable() || !sdk.ad || !sdk.ad.requestAd) return Promise.resolve(false);
      return new Promise(function (resolve) {
        try {
          sdk.ad.requestAd('rewarded', {
            adFinished: function () { resolve(true); },
            adError: function () { resolve(false); }
          });
        } catch (e) { resolve(false); }
      });
    },
    showInterstitial: function () {
      var sdk = this.sdk;
      if (!this.isAvailable() || !sdk.ad || !sdk.ad.requestAd) return Promise.resolve(false);
      return new Promise(function (resolve) {
        try {
          sdk.ad.requestAd('midgame', {
            adFinished: function () { resolve(true); },
            adError: function () { resolve(false); }
          });
        } catch (e) { resolve(false); }
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

  function GameDistributionAdapter() { this.name = 'gamedistribution'; this.sdk = null; this.ready = false; }
  GameDistributionAdapter.prototype = {
    initialize: function () {
      this.sdk = global.gdsdk || null;
      this.ready = !!this.sdk;
      return Promise.resolve(this.ready);
    },
    isAvailable: function () { return MONETIZATION.enabled && MONETIZATION.adRequestsEnabled && this.ready && !!this.sdk && onlineOk(); },
    showRewardedHint: function () {
      if (!this.isAvailable() || !this.sdk.showAd) return Promise.resolve(false);
      return Promise.resolve(this.sdk.showAd('rewarded'))
        .then(function (res) { return res !== false; })
        .catch(function () { return false; });
    },
    showInterstitial: function () {
      if (!this.isAvailable() || !this.sdk.showAd) return Promise.resolve(false);
      return Promise.resolve(this.sdk.showAd())
        .then(function () { return true; })
        .catch(function () { return false; });
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
  var sdkStatus = 'uninitialized';

  Cubiqo.Platform = {
    detectPortal: detectPortal,
    createAdapter: createAdapter,
    getStatus: function () { return { portal: active.name, status: sdkStatus, available: active.isAvailable() }; },
    initialize: function (portal) {
      active = createAdapter(portal);
      return active.initialize().then(function (ok) {
        sdkStatus = ok ? 'ready' : 'failed';
        return !!ok;
      }).catch(function () {
        sdkStatus = 'failed';
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
