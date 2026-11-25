/* =========================================================================
   CUBIQO: ARROW ESCAPE — app.js
   Application bootstrap, keyboard shortcuts, scroll-lock & lifecycle hooks.
   ========================================================================= */
(function (global) {
  'use strict';

  var Cubiqo = global.Cubiqo = global.Cubiqo || {};

  function bootstrap() {
    Cubiqo.Audio.init();
    Cubiqo.Storage.load();
    if (Cubiqo.Themes) Cubiqo.Themes.applyActive();
    Cubiqo.UI.render();
    Cubiqo.Platform.initialize().catch(function () {});

    /* Keyboard shortcuts (PRD §5 Screen 4) */
    document.addEventListener('keydown', function (e) {
      var st = Cubiqo.UI.getState();
      if (e.key === 'Escape') {
        if (st.screen === 'gameplay') {
          if (st.gameOver || st.completedOnce) return;
          if (st.paused) Cubiqo.UI.resumeGame();
          else Cubiqo.UI.pauseGame();
        } else {
          Cubiqo.UI.closeActiveModal();
        }
      } else if ((e.key === 'r' || e.key === 'R') && st.screen === 'gameplay' && !st.paused && !st.completedOnce) {
        Cubiqo.UI.restartCurrent();
      } else if ((e.key === 'h' || e.key === 'H') && st.screen === 'gameplay' && !st.paused && !st.gameOver && !st.completedOnce) {
        Cubiqo.UI.triggerHint();
      }
    });

    /* Prevent accidental page scroll while playing on touch devices (PRD §11) */
    document.addEventListener('touchmove', function (e) {
      var st = Cubiqo.UI.getState();
      if (st.screen === 'gameplay') e.preventDefault();
    }, { passive: false });

    /* Auto-pause on tab switch / lost focus (PRD §11) */
    document.addEventListener('visibilitychange', function () {
      var st = Cubiqo.UI.getState();
      if (document.hidden) {
        Cubiqo.Audio.stopMusic();
        if (st.screen === 'gameplay' && !st.paused) Cubiqo.UI.pauseGame();
      } else {
        Cubiqo.Audio.syncMusic();
      }
    });

    global.addEventListener('beforeunload', function () {
      Cubiqo.Analytics.track('session_ended');
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bootstrap);
  } else {
    bootstrap();
  }
})(typeof window !== 'undefined' ? window : globalThis);
