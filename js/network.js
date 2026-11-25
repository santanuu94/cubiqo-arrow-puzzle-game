/* =========================================================================
   CUBIQO: ARROW ESCAPE — network.js
   Online connectivity verifier & listener.
   CUBIQO is a fully online game: an active internet connection is required
   to launch and play. No offline mode or offline fallback.
   ========================================================================= */
(function (global) {
  'use strict';

  var Cubiqo = global.Cubiqo = global.Cubiqo || {};

  var online = typeof navigator !== 'undefined' ? navigator.onLine !== false : true;
  var listeners = [];
  var customProbe = null;
  var checking = false;

  function notify(state) {
    for (var i = 0; i < listeners.length; i++) {
      try { listeners[i](state); } catch (e) {}
    }
  }

  function setOnline(next) {
    var val = !!next;
    var changed = val !== online;
    online = val;
    if (changed) notify(online);
    return online;
  }

  function defaultProbe() {
    if (typeof navigator !== 'undefined' && navigator.onLine === false) {
      return Promise.resolve(false);
    }
    if (typeof fetch !== 'function' || typeof location === 'undefined' || location.protocol === 'file:') {
      return Promise.resolve(typeof navigator !== 'undefined' ? navigator.onLine !== false : true);
    }

    var ctrl = typeof AbortController === 'function' ? new AbortController() : null;
    var timer = ctrl ? setTimeout(function () { ctrl.abort(); }, 4000) : null;
    var url = './favicon.svg?_ping=' + Date.now();

    return fetch(url, {
      method: 'HEAD',
      cache: 'no-store',
      signal: ctrl ? ctrl.signal : undefined
    }).then(function (res) {
      if (timer) clearTimeout(timer);
      return !!res && (res.ok || res.status === 304);
    }).catch(function () {
      if (timer) clearTimeout(timer);
      return false;
    });
  }

  function check() {
    if (checking) return Promise.resolve(online);
    checking = true;
    var fn = customProbe || defaultProbe;
    return Promise.resolve().then(fn).then(function (ok) {
      checking = false;
      return setOnline(ok);
    }).catch(function () {
      checking = false;
      return setOnline(false);
    });
  }

  function init(onChange) {
    if (typeof onChange === 'function' && listeners.indexOf(onChange) === -1) {
      listeners.push(onChange);
    }
    if (typeof global.addEventListener === 'function') {
      global.addEventListener('offline', function () {
        setOnline(false);
      });
      global.addEventListener('online', function () {
        check();
      });
    }
  }

  function subscribe(fn) {
    if (typeof fn === 'function' && listeners.indexOf(fn) === -1) {
      listeners.push(fn);
    }
  }

  function setProbe(fn) {
    customProbe = typeof fn === 'function' ? fn : null;
  }

  Cubiqo.Network = {
    isOnline: function () { return online; },
    check: check,
    init: init,
    subscribe: subscribe,
    setProbe: setProbe
  };
})(typeof window !== 'undefined' ? window : globalThis);
