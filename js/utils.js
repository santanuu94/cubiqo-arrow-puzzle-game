/* =========================================================================
   CUBIQO: ARROW ESCAPE — utils.js
   Pure helper functions. No DOM, no side effects.
   ========================================================================= */
(function (global) {
  'use strict';

  var Cubiqo = global.Cubiqo = global.Cubiqo || {};

  Cubiqo.Utils = {
    /* ---- DOM helpers ---- */
    $: function (sel, root) { return (root || document).querySelector(sel); },
    $$: function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); },
    el: function (tag, cls, html) {
      var e = document.createElement(tag);
      if (cls) e.className = cls;
      if (html != null) e.innerHTML = html;
      return e;
    },
    show: function (el, display) { if (el) el.style.display = display || ''; },
    hide: function (el) { if (el) el.style.display = 'none'; },
    add: function (el, cls) { if (el) el.classList.add(cls); },
    rem: function (el, cls) { if (el) el.classList.remove(cls); },
    toggle: function (el, cls, on) { if (el) el.classList.toggle(cls, on); },
    setHtml: function (el, html) { if (el) el.innerHTML = html; },

    /* ---- Screen manager ---- */
    Screens: (function () {
      var current = null;
      function show(id) {
        var target = document.getElementById(id);
        if (!target) return;
        if (current) Cubiqo.Utils.rem(current, 'screen--visible');
        Cubiqo.Utils.rem(target, 'screen--hidden');
        Cubiqo.Utils.add(target, 'screen--visible');
        current = target;
        window.scrollTo(0, 0);
      }
      return { show: show, current: function () { return current; } };
    })(),

    /* ---- Number helpers ---- */
    clamp: function (v, lo, hi) { return v < lo ? lo : (v > hi ? hi : v); },
    randInt: function (lo, hi) { return lo + Math.floor(Math.random() * (hi - lo + 1)); },
    randItem: function (arr) { return arr.length ? arr[Math.floor(Math.random() * arr.length)] : null; },
    shuffle: function (arr) {
      var a = arr.slice();
      for (var i = a.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var t = a[i]; a[i] = a[j]; a[j] = t;
      }
      return a;
    },
    sum: function (arr) { return arr.reduce(function (s, v) { return s + v; }, 0); },

    /* ---- Date helpers ---- */
    todayKey: function () {
      var d = new Date();
      return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
    },
    daysBetween: function (a, b) {
      var ms = 24 * 3600 * 1000;
      var x = new Date(a + 'T00:00:00').getTime();
      var y = new Date(b + 'T00:00:00').getTime();
      return Math.round((y - x) / ms);
    },
    isSameDay: function (a, b) { return a === b; },

    /* ---- Storage helpers ---- */
    storage: {
      get: function (key) {
        try {
          var raw = localStorage.getItem(key);
          return raw ? JSON.parse(raw) : null;
        } catch (e) { return null; }
      },
      set: function (key, value) {
        try { localStorage.setItem(key, JSON.stringify(value)); return true; }
        catch (e) { return false; }
      },
      remove: function (key) {
        try { localStorage.removeItem(key); return true; } catch (e) { return false; }
      },
      available: function () {
        try { var t = 'cubiqo-probe'; localStorage.setItem(t, t); localStorage.removeItem(t); return true; }
        catch (e) { return false; }
      }
    },

    /* ---- Debounce ---- */
    debounce: function (fn, wait) {
      var t = null;
      return function () {
        var ctx = this, args = arguments;
        if (t) clearTimeout(t);
        t = setTimeout(function () { fn.apply(ctx, args); }, wait);
      };
    },

    /* ---- Geometry helpers ---- */
    pointInRect: function (x, y, r) { return x >= r.left && x <= r.right && y >= r.top && y <= r.bottom; },
    distance: function (ax, ay, bx, by) {
      var dx = ax - bx, dy = ay - by;
      return Math.sqrt(dx * dx + dy * dy);
    }
  };
})(typeof window !== 'undefined' ? window : globalThis);