/* =========================================================================
   CUBIQO: ARROW ESCAPE — analytics.js
   Lightweight, privacy-respecting analytics queue (PRD §12).
   ========================================================================= */
(function (global) {
  'use strict';

  var Cubiqo = global.Cubiqo = global.Cubiqo || {};
  var queue = [];
  var provider = null;

  function track(eventName, payload) {
    var entry = {
      event: eventName,
      data: payload || {},
      ts: Date.now()
    };
    queue.push(entry);
    if (queue.length > 200) queue.shift();
    if (provider && typeof provider.track === 'function') {
      try { provider.track(entry.event, entry.data); } catch (e) {}
    }
  }

  function setProvider(p) { provider = p; }
  function getQueue() { return queue.slice(); }

  Cubiqo.Analytics = {
    track: track,
    setProvider: setProvider,
    getQueue: getQueue
  };
})(typeof window !== 'undefined' ? window : globalThis);
