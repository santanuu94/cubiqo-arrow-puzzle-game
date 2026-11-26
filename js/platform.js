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

  function DevAdapter() { this.name = 'dev'; this.ready = true; this.environment = 'local'; }
  DevAdapter.prototype = {
    initialize: function () { this.ready = true; return Promise.resolve(true); },
    getEnvironment: function () { return this.environment; },
    isAvailable: function () { return false; },
    showRewardedHint: function () { return Promise.resolve(false); },
    showInterstitial: function () { return Promise.resolve(false); },
    pauseGame: function () {},
    resumeGame: function () {},
    gameLoadingStart: function () {},
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
    isRewardedAvailable: function () { return MONETIZATION.rewardedAdsEnabled && this.isAvailable() && !!this.sdk && !!this.sdk.rewardedBreak; },
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

  function CrazyGamesAdapter() {
    this.name = 'crazygames';
    this.sdk = null;
    this.ready = false;
    this.environment = 'disabled';
    this.loadingStarted = false;
    this.loadingStopped = false;
    this.gameplayActive = false;
    this._lastGameplayCallAt = 0;
    this._gameplayTimer = null;
    this._adPending = null;
    this._settingsListener = null;
  }
  CrazyGamesAdapter.prototype = {
    initialize: function () {
      var self = this;
      this.sdk = (global.CrazyGames && global.CrazyGames.SDK) || null;
      if (!this.sdk || typeof this.sdk.init !== 'function') {
        self.ready = false;
        self.environment = 'disabled';
        return Promise.resolve(false);
      }
      return this.sdk.init().then(function () {
        var env = self.sdk.environment || 'disabled';
        self.environment = env;
        if (env === 'disabled') {
          self.ready = false;
          return false;
        }
        self.ready = true;

        var gameMod = self.sdk.game;
        if (gameMod) {
          if (gameMod.settings && Cubiqo.Audio && Cubiqo.Audio.setPlatformMute) {
            Cubiqo.Audio.setPlatformMute(!!gameMod.settings.muteAudio);
          }
          if (typeof gameMod.addSettingsChangeListener === 'function' && !self._settingsListener) {
            self._settingsListener = function (newSettings) {
              if (Cubiqo.Audio && Cubiqo.Audio.setPlatformMute) {
                Cubiqo.Audio.setPlatformMute(!!(newSettings && newSettings.muteAudio));
              }
            };
            try { gameMod.addSettingsChangeListener(self._settingsListener); } catch (e) {}
          }
        }
        return true;
      }).catch(function () {
        self.ready = false;
        self.environment = 'disabled';
        return false;
      });
    },
    getEnvironment: function () { return this.environment; },
    isAvailable: function () {
      return MONETIZATION.enabled && MONETIZATION.adRequestsEnabled && this.ready &&
        this.environment !== 'disabled' && !!this.sdk && onlineOk();
    },
    isRewardedAvailable: function () {
      return MONETIZATION.rewardedAdsEnabled && this.isAvailable() && !!this.sdk && !!this.sdk.ad && typeof this.sdk.ad.requestAd === 'function';
    },
    getRewardedCooldownRemaining: function () {
      var last = Cubiqo.Storage && Cubiqo.Storage.getLastRewardedAdAt ? Cubiqo.Storage.getLastRewardedAdAt() : 0;
      if (!last) return 0;
      var cd = MONETIZATION.rewardedCooldownMs || 90000;
      var rem = last + cd - Date.now();
      return rem > 0 ? Math.ceil(rem / 1000) : 0;
    },
    showRewardedAd: function () {
      var self = this;
      var sdk = this.sdk;
      if (!this.isRewardedAvailable() || this.getRewardedCooldownRemaining() > 0) {
        return Promise.resolve(false);
      }
      if (this._adPending) return this._adPending;

      this._adPending = new Promise(function (resolve) {
        var settled = false;
        function done(ok) {
          if (settled) return;
          settled = true;
          self._adPending = null;
          if (ok && Cubiqo.Storage && Cubiqo.Storage.setLastRewardedAdAt) {
            Cubiqo.Storage.setLastRewardedAdAt(Date.now());
          }
          if (Cubiqo.Audio && Cubiqo.Audio.setAdMute) Cubiqo.Audio.setAdMute(false);
          if (Cubiqo.UI && Cubiqo.UI.setAdActive) Cubiqo.UI.setAdActive(false);
          resolve(ok);
        }

        try {
          sdk.ad.requestAd('rewarded', {
            adStarted: function () {
              self.gameplayStop();
              if (Cubiqo.Audio && Cubiqo.Audio.setAdMute) Cubiqo.Audio.setAdMute(true);
              if (Cubiqo.UI && Cubiqo.UI.setAdActive) Cubiqo.UI.setAdActive(true);
            },
            adFinished: function () {
              done(true);
            },
            adError: function () {
              done(false);
            }
          });
        } catch (e) {
          done(false);
        }
      });

      return this._adPending;
    },
    showRewardedHint: function () {
      return this.showRewardedAd();
    },
    showInterstitial: function () {
      var self = this;
      var sdk = this.sdk;
      if (!MONETIZATION.midgameAdsEnabled || !this.isAvailable() || !sdk.ad || typeof sdk.ad.requestAd !== 'function') {
        return Promise.resolve(false);
      }
      if (this._adPending) return this._adPending;

      this._adPending = new Promise(function (resolve) {
        var settled = false;
        function done(ok) {
          if (settled) return;
          settled = true;
          self._adPending = null;
          if (Cubiqo.Audio && Cubiqo.Audio.setAdMute) Cubiqo.Audio.setAdMute(false);
          if (Cubiqo.UI && Cubiqo.UI.setAdActive) Cubiqo.UI.setAdActive(false);
          resolve(ok);
        }

        try {
          sdk.ad.requestAd('midgame', {
            adStarted: function () {
              self.gameplayStop();
              if (Cubiqo.Audio && Cubiqo.Audio.setAdMute) Cubiqo.Audio.setAdMute(true);
              if (Cubiqo.UI && Cubiqo.UI.setAdActive) Cubiqo.UI.setAdActive(true);
            },
            adFinished: function () {
              done(true);
            },
            adError: function () {
              done(false);
            }
          });
        } catch (e) {
          done(false);
        }
      });

      return this._adPending;
    },
    pauseGame: function () { this.gameplayStop(); },
    resumeGame: function () { this.gameplayStart(); },
    gameLoadingStart: function () {
      if (!this.ready || this.environment === 'disabled' || this.loadingStarted || this.loadingStopped) return;
      this.loadingStarted = true;
      try { if (this.sdk && this.sdk.game && this.sdk.game.loadingStart) this.sdk.game.loadingStart(); } catch (e) {}
    },
    gameLoadingFinished: function () {
      if (!this.ready || this.environment === 'disabled' || this.loadingStopped) return;
      if (!this.loadingStarted) this.gameLoadingStart();
      this.loadingStopped = true;
      try { if (this.sdk && this.sdk.game && this.sdk.game.loadingStop) this.sdk.game.loadingStop(); } catch (e) {}
    },
    _emitGameplay: function (targetActive) {
      var self = this;
      if (!this.ready || this.environment === 'disabled') return;
      if (this._gameplayTimer) {
        clearTimeout(this._gameplayTimer);
        this._gameplayTimer = null;
      }
      var send = function () {
        self._lastGameplayCallAt = Date.now();
        try {
          if (!self.sdk || !self.sdk.game) return;
          if (targetActive && self.sdk.game.gameplayStart) self.sdk.game.gameplayStart();
          else if (!targetActive && self.sdk.game.gameplayStop) self.sdk.game.gameplayStop();
        } catch (e) {}
      };
      var elapsed = Date.now() - this._lastGameplayCallAt;
      if (this._lastGameplayCallAt === 0 || elapsed >= 1050) {
        send();
      } else {
        this._gameplayTimer = setTimeout(function () {
          self._gameplayTimer = null;
          if (self.gameplayActive === targetActive) send();
        }, 1050 - elapsed);
      }
    },
    gameplayStart: function () {
      if (!this.ready || this.environment === 'disabled' || this.gameplayActive) return;
      this.gameplayActive = true;
      this._emitGameplay(true);
    },
    gameplayStop: function () {
      if (!this.ready || this.environment === 'disabled' || !this.gameplayActive) return;
      this.gameplayActive = false;
      this._emitGameplay(false);
    },
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
    isRewardedAvailable: function () { return MONETIZATION.rewardedAdsEnabled && this.isAvailable() && !!this.sdk && !!this.sdk.rewardedBreak; },
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
  var initPromise = null;

  Cubiqo.Platform = {
    detectPortal: detectPortal,
    createAdapter: createAdapter,
    getEnvironment: function () { return active.getEnvironment ? active.getEnvironment() : 'local'; },
    getStatus: function () {
      return {
        portal: active.name,
        environment: active.getEnvironment ? active.getEnvironment() : 'local',
        status: sdkStatus,
        available: active.isAvailable()
      };
    },
    initialize: function (portal) {
      active = createAdapter(portal);
      initPromise = active.initialize().then(function (ok) {
        sdkStatus = ok ? 'ready' : 'failed';
        if (ok && active.gameLoadingStart) active.gameLoadingStart();
        return !!ok;
      }).catch(function () {
        sdkStatus = 'failed';
        active = new DevAdapter();
        return false;
      });
      return initPromise;
    },
    whenReady: function () { return initPromise || Promise.resolve(false); },
    current: function () { return active; },
    isAvailable: function () { return active.isAvailable(); },
    isRewardedAvailable: function () { return active.isRewardedAvailable ? active.isRewardedAvailable() : false; },
    getRewardedCooldownRemaining: function () { return active.getRewardedCooldownRemaining ? active.getRewardedCooldownRemaining() : 0; },
    showRewardedAd: function () { return active.showRewardedAd ? active.showRewardedAd() : active.showRewardedHint(); },
    showRewardedHint: function () { return active.showRewardedHint(); },
    showInterstitial: function () { return active.showInterstitial(); },
    pauseGame: function () { active.pauseGame(); },
    resumeGame: function () { active.resumeGame(); },
    gameLoadingStart: function () { if (active.gameLoadingStart) active.gameLoadingStart(); },
    gameLoadingFinished: function () { active.gameLoadingFinished(); },
    gameplayStart: function () { active.gameplayStart(); },
    gameplayStop: function () { active.gameplayStop(); },
    saveCloud: function (data) { return active.saveCloud(data); },
    loadCloud: function () { return active.loadCloud(); }
  };
})(typeof window !== 'undefined' ? window : globalThis);
