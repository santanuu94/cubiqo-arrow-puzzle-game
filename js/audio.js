/* =========================================================================
   CUBIQO: ARROW ESCAPE — audio.js
   Procedural Web Audio API sound effects, ambient music & mobile haptics.
   Zero external audio files; gracefully handles autoplay restrictions.
   ========================================================================= */
(function (global) {
  'use strict';

  var Cubiqo = global.Cubiqo = global.Cubiqo || {};
  var Storage = Cubiqo.Storage;

  var ctx = null;
  var musicTimer = null;
  var musicGain = null;
  var musicActive = false;
  var chordIdx = 0;
  var platformMuted = false;

  var CHORDS = [
    [261.63, 329.63, 392.00], /* Cmaj */
    [220.00, 261.63, 329.63], /* Amin */
    [174.61, 220.00, 261.63], /* Fmaj */
    [196.00, 246.94, 293.66]  /* Gmaj */
  ];

  function getCtx() {
    if (!ctx && typeof window !== 'undefined') {
      var AC = window.AudioContext || window.webkitAudioContext;
      if (AC) {
        try { ctx = new AC(); } catch (e) { ctx = null; }
      }
    }
    return ctx;
  }

  function unlock() {
    var c = getCtx();
    if (c && c.state === 'suspended') {
      c.resume().catch(function () {});
    }
  }

  function init() {
    if (typeof document === 'undefined') return;
    var onGesture = function () {
      unlock();
      syncMusic();
      document.removeEventListener('pointerdown', onGesture);
      document.removeEventListener('keydown', onGesture);
    };
    document.addEventListener('pointerdown', onGesture, { passive: true });
    document.addEventListener('keydown', onGesture, { passive: true });
  }

  function tone(freq, dur, type, vol, delay) {
    if (platformMuted || !Storage.getSettings().sound) return;
    var c = getCtx();
    if (!c) return;
    unlock();

    var start = c.currentTime + (delay || 0);
    var osc = c.createOscillator();
    var gain = c.createGain();
    osc.type = type || 'sine';
    osc.frequency.setValueAtTime(freq, start);
    gain.gain.setValueAtTime(vol || 0.1, start);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + dur);
    osc.connect(gain);
    gain.connect(c.destination);
    osc.start(start);
    osc.stop(start + dur);
  }

  function playClear() {
    tone(523.25, 0.13, 'sine', 0.11, 0);
    tone(659.25, 0.14, 'sine', 0.09, 0.05);
  }

  function playBlocked() {
    tone(185, 0.1, 'triangle', 0.1, 0);
    tone(140, 0.13, 'triangle', 0.08, 0.06);
  }

  function playGameOver() {
    tone(246.94, 0.14, 'triangle', 0.11, 0);
    tone(196.00, 0.16, 'triangle', 0.1, 0.12);
    tone(146.83, 0.28, 'triangle', 0.1, 0.26);
  }

  function playClick() {
    tone(460, 0.045, 'sine', 0.05, 0);
  }

  function playHint() {
    tone(659.25, 0.1, 'sine', 0.08, 0);
    tone(880.00, 0.16, 'sine', 0.08, 0.07);
  }

  function playStar(index) {
    var base = 783.99 + (index || 0) * 110;
    tone(base, 0.2, 'triangle', 0.1, 0);
  }

  function playComplete() {
    var notes = [523.25, 659.25, 783.99, 1046.50];
    for (var i = 0; i < notes.length; i++) {
      tone(notes[i], 0.22, 'sine', 0.1, i * 0.085);
    }
  }

  function playMilestone() {
    var notes = [440, 554.37, 659.25, 880, 1108.73];
    for (var i = 0; i < notes.length; i++) {
      tone(notes[i], 0.24, 'triangle', 0.09, i * 0.1);
    }
  }

  function playVictory() {
    var notes = [523.25, 587.33, 659.25, 783.99, 880, 1046.50, 1318.51];
    for (var i = 0; i < notes.length; i++) {
      tone(notes[i], 0.3, 'triangle', 0.09, i * 0.1);
    }
  }

  function haptic(pattern) {
    if (!Storage.getSettings().haptics) return;
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      try { navigator.vibrate(pattern || 12); } catch (e) {}
    }
  }

  /* ---- Ambient background music ---- */
  function playPad(freqs) {
    var c = getCtx();
    if (!c || !musicGain) return;
    var now = c.currentTime;
    for (var i = 0; i < freqs.length; i++) {
      var osc = c.createOscillator();
      var g = c.createGain();
      var f = c.createBiquadFilter();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freqs[i], now);
      f.type = 'lowpass';
      f.frequency.setValueAtTime(750, now);
      g.gain.setValueAtTime(0.0001, now);
      g.gain.linearRampToValueAtTime(0.014, now + 1.1);
      g.gain.exponentialRampToValueAtTime(0.0001, now + 3.6);
      osc.connect(f);
      f.connect(g);
      g.connect(musicGain);
      (function (o, filt, gainNode) {
        o.onended = function () {
          try { o.disconnect(); filt.disconnect(); gainNode.disconnect(); } catch (e) {}
        };
      })(osc, f, g);
      osc.start(now);
      osc.stop(now + 3.6);
    }
  }

  function startMusic() {
    if (musicActive) return;
    var c = getCtx();
    if (!c) return;
    unlock();
    musicGain = c.createGain();
    musicGain.gain.setValueAtTime(1, c.currentTime);
    musicGain.connect(c.destination);
    musicActive = true;
    playPad(CHORDS[chordIdx % CHORDS.length]);
    chordIdx++;
    musicTimer = setInterval(function () {
      if (!Storage.getSettings().music) { stopMusic(); return; }
      playPad(CHORDS[chordIdx % CHORDS.length]);
      chordIdx++;
    }, 3800);
  }

  function stopMusic() {
    if (musicTimer) { clearInterval(musicTimer); musicTimer = null; }
    if (musicGain) {
      var g = musicGain;
      musicGain = null;
      try {
        var c = getCtx();
        if (c) {
          var now = c.currentTime;
          g.gain.cancelScheduledValues(now);
          g.gain.setValueAtTime(Math.max(0.0001, g.gain.value || 1), now);
          g.gain.exponentialRampToValueAtTime(0.0001, now + 0.35);
          setTimeout(function () { try { g.disconnect(); } catch (e) {} }, 400);
        }
      } catch (e) {}
    }
    musicActive = false;
  }

  function syncMusic() {
    if (!platformMuted && Storage.getSettings().music) startMusic();
    else stopMusic();
  }

  function setPlatformMute(muted) {
    platformMuted = !!muted;
    if (platformMuted) stopMusic();
    else syncMusic();
  }

  Cubiqo.Audio = {
    init: init,
    playClear: playClear,
    playBlocked: playBlocked,
    playGameOver: playGameOver,
    playClick: playClick,
    playHint: playHint,
    playStar: playStar,
    playComplete: playComplete,
    playMilestone: playMilestone,
    playVictory: playVictory,
    haptic: haptic,
    syncMusic: syncMusic,
    stopMusic: stopMusic,
    setPlatformMute: setPlatformMute,
    isPlatformMuted: function () { return platformMuted; }
  };
})(typeof window !== 'undefined' ? window : globalThis);
