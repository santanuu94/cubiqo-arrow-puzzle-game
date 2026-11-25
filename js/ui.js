/* =========================================================================
   CUBIQO: ARROW ESCAPE — ui.js
   Renders all 10 PRD screens, 3D cubical arrow board, animations & modals.
   ========================================================================= */
(function (global) {
  'use strict';

  var Cubiqo = global.Cubiqo = global.Cubiqo || {};
  var Config = Cubiqo.Config;
  var Utils = Cubiqo.Utils;
  var Storage = Cubiqo.Storage;
  var Puzzle = Cubiqo.Puzzle;
  var Audio = Cubiqo.Audio;
  var Hints = Cubiqo.Hints;
  var Daily = Cubiqo.Daily;
  var Platform = Cubiqo.Platform;
  var Analytics = Cubiqo.Analytics;

  var state = {
    screen: 'loading',
    levelId: 1,
    levelConfig: null,
    board: null,
    moves: 0,
    lives: 3,
    maxLives: 3,
    gameOver: false,
    paused: false,
    isDaily: false,
    hintArrowId: null,
    animating: false,
    completedOnce: false,
    toastTimer: null
  };

  function rootEl() {
    return document.getElementById('app');
  }

  function arrowSvg(dir) {
    var rot = Config.DIRECTIONS[dir] ? Config.DIRECTIONS[dir].rotation : 0;
    return '<svg class="arrow-svg" viewBox="0 0 24 24" style="transform:rotate(' + rot + 'deg)" aria-hidden="true">' +
      '<path fill="currentColor" d="M12 3.5l7.5 8.5h-4.5v8.5h-6V12H4.5z"/>' +
      '</svg>';
  }

  function render() {
    var root = rootEl();
    if (!root) return;
    switch (state.screen) {
      case 'loading': renderLoading(root); break;
      case 'home': renderHome(root); break;
      case 'levelSelect': renderLevelSelect(root); break;
      case 'daily': renderDailyHub(root); break;
      case 'gameplay': renderGameplay(root); break;
      case 'levelComplete': renderLevelComplete(root); break;
      case 'settings': renderSettings(root); break;
      case 'victory': renderVictory(root); break;
    }
  }

  function navigate(screen) {
    state.screen = screen;
    render();
  }

  /* ------------------------------------------------------------------
     Screen 1: Loading Screen
     ------------------------------------------------------------------ */
  function renderLoading(root) {
    root.innerHTML =
      '<div class="screen screen--visible loading-screen">' +
        '<div class="loading-card">' +
          '<div class="cube-logo"><div class="cube-logo__top"></div><div class="cube-logo__front"></div><div class="cube-logo__side"></div></div>' +
          '<h1 class="brand-title">CUBIQO</h1>' +
          '<p class="brand-sub">ARROW ESCAPE</p>' +
          '<div class="loading-track"><div class="loading-fill" id="loadingFill"></div></div>' +
          '<p class="loading-caption">Preparing puzzles...</p>' +
        '</div>' +
      '</div>';

    var fill = document.getElementById('loadingFill');
    var pct = 0;
    var timer = setInterval(function () {
      pct = Math.min(100, pct + 18 + Math.random() * 14);
      if (fill) fill.style.width = pct + '%';
      if (pct >= 100) {
        clearInterval(timer);
        setTimeout(function () {
          Platform.gameLoadingFinished();
          Analytics.track('game_loaded');
          navigate('home');
        }, 180);
      }
    }, 60);
  }

  /* ------------------------------------------------------------------
     Screen 2: Home Screen
     ------------------------------------------------------------------ */
  function renderHome(root) {
    var save = Storage.load();
    var completed = Object.keys(save.levels).length;
    var dailyStatus = Daily.getStatus();

    root.innerHTML =
      '<div class="screen screen--visible home-screen">' +
        '<div class="home-inner">' +
          '<div class="home-brand">' +
            '<div class="cube-logo cube-logo--sm"><div class="cube-logo__top"></div><div class="cube-logo__front"></div><div class="cube-logo__side"></div></div>' +
            '<h1 class="brand-title">CUBIQO</h1>' +
            '<p class="brand-sub">ARROW ESCAPE</p>' +
            '<p class="brand-tagline">Find the clear path. Free every arrow.</p>' +
          '</div>' +

          '<div class="stats-strip">' +
            '<div class="stat-pill"><span class="stat-pill__label">Unlocked</span><span class="stat-pill__val">Lv ' + save.highestUnlocked + '</span></div>' +
            '<div class="stat-pill"><span class="stat-pill__label">Cleared</span><span class="stat-pill__val">' + completed + '/100</span></div>' +
            '<div class="stat-pill"><span class="stat-pill__label">Stars</span><span class="stat-pill__val">★ ' + save.totalStars + '/300</span></div>' +
          '</div>' +

          '<div class="overall-progress" aria-label="Overall progress ' + completed + ' percent">' +
            '<div class="overall-progress__fill" style="width:' + completed + '%"></div>' +
          '</div>' +

          '<div class="home-actions">' +
            '<button class="btn btn-primary btn-xl" id="btnHomePlay">▶ PLAY LEVEL ' + save.highestUnlocked + '</button>' +
            '<button class="btn btn-secondary" id="btnHomeLevels">☷ LEVEL SELECT</button>' +
            '<button class="btn btn-daily" id="btnHomeDaily">' +
              (dailyStatus.completed ? '✓ ' : '★ ') + 'DAILY CHALLENGE' +
              (dailyStatus.streak > 0 ? '<span class="streak-chip">🔥 ' + dailyStatus.streak + '</span>' : '') +
            '</button>' +
            '<button class="btn btn-ghost" id="btnHomeSettings">⚙ SETTINGS</button>' +
          '</div>' +
        '</div>' +
      '</div>';

    document.getElementById('btnHomePlay').addEventListener('click', function () {
      Audio.playClick();
      startMainLevel(save.highestUnlocked);
    });
    document.getElementById('btnHomeLevels').addEventListener('click', function () {
      Audio.playClick();
      navigate('levelSelect');
    });
    document.getElementById('btnHomeDaily').addEventListener('click', function () {
      Audio.playClick();
      navigate('daily');
    });
    document.getElementById('btnHomeSettings').addEventListener('click', function () {
      Audio.playClick();
      navigate('settings');
    });
  }

  /* ------------------------------------------------------------------
     Screen 3: Level Selection
     ------------------------------------------------------------------ */
  function renderLevelSelect(root) {
    var save = Storage.load();
    var completedCount = Object.keys(save.levels).length;
    var tilesHtml = '';

    for (var i = 1; i <= Config.TOTAL_LEVELS; i++) {
      var rec = save.levels[i];
      var unlocked = i <= save.highestUnlocked;
      var isCurrent = i === save.highestUnlocked && !rec;
      var cls = 'lvl-tile';
      if (!unlocked) cls += ' is-locked';
      else if (rec) cls += ' is-done';
      else cls += ' is-open';
      if (isCurrent) cls += ' is-current';

      var sub = '';
      if (!unlocked) sub = '<span class="lvl-tile__lock" aria-hidden="true">🔒</span>';
      else if (rec) sub = '<span class="lvl-tile__stars">' + '★'.repeat(rec.stars) + '☆'.repeat(3 - rec.stars) + '</span>';
      else if (isCurrent) sub = '<span class="lvl-tile__now">NEXT</span>';

      tilesHtml +=
        '<button class="' + cls + '" data-level="' + i + '" id="lvlTile-' + i + '" ' + (!unlocked ? 'disabled' : '') + '>' +
          '<span class="lvl-tile__num">' + i + '</span>' + sub +
        '</button>';
    }

    root.innerHTML =
      '<div class="screen screen--visible levels-screen">' +
        '<header class="top-bar">' +
          '<button class="icon-btn" id="btnLevelsBack" aria-label="Back to home">←</button>' +
          '<h2 class="top-bar__title">SELECT LEVEL</h2>' +
          '<span class="top-bar__meta">' + completedCount + '/100</span>' +
        '</header>' +
        '<div class="levels-grid" id="levelsGrid">' + tilesHtml + '</div>' +
      '</div>';

    document.getElementById('btnLevelsBack').addEventListener('click', function () {
      Audio.playClick();
      navigate('home');
    });

    Utils.$$('.lvl-tile:not(.is-locked)').forEach(function (btn) {
      btn.addEventListener('click', function () {
        Audio.playClick();
        startMainLevel(parseInt(btn.getAttribute('data-level'), 10));
      });
    });

    requestAnimationFrame(function () {
      var cur = document.getElementById('lvlTile-' + save.highestUnlocked);
      if (cur && cur.scrollIntoView) cur.scrollIntoView({ block: 'center', behavior: 'smooth' });
    });
  }

  /* ------------------------------------------------------------------
     Screen 8: Daily Challenge Hub
     ------------------------------------------------------------------ */
  function renderDailyHub(root) {
    var status = Daily.getStatus();
    var rec = status.record;

    root.innerHTML =
      '<div class="screen screen--visible daily-screen">' +
        '<header class="top-bar">' +
          '<button class="icon-btn" id="btnDailyBack" aria-label="Back to home">←</button>' +
          '<h2 class="top-bar__title">DAILY CHALLENGE</h2>' +
          '<span class="top-bar__meta">' + status.date + '</span>' +
        '</header>' +
        '<div class="daily-body">' +
          '<div class="daily-card">' +
            '<div class="daily-badge">' + (status.completed ? '✓ COMPLETED TODAY' : '★ TODAY\'S PUZZLE') + '</div>' +
            '<h3 class="daily-card__title">Fresh Daily Logic Board</h3>' +
            '<p class="daily-card__desc">Everyone gets the same deterministic puzzle today. Daily puzzles do not affect your 100-level campaign.</p>' +
            '<div class="daily-metrics">' +
              '<div class="daily-metric"><span>Current Streak</span><strong>🔥 ' + status.streak + '</strong></div>' +
              '<div class="daily-metric"><span>Best Streak</span><strong>🏆 ' + status.bestStreak + '</strong></div>' +
              '<div class="daily-metric"><span>Today\'s Best</span><strong>' + (rec ? rec.moves + ' moves' : '—') + '</strong></div>' +
            '</div>' +
            '<button class="btn btn-primary btn-xl" id="btnDailyPlay">' + (status.completed ? '↻ REPLAY DAILY' : '▶ PLAY DAILY PUZZLE') + '</button>' +
          '</div>' +
        '</div>' +
      '</div>';

    document.getElementById('btnDailyBack').addEventListener('click', function () {
      Audio.playClick();
      navigate('home');
    });
    document.getElementById('btnDailyPlay').addEventListener('click', function () {
      Audio.playClick();
      startDailyLevel();
    });
  }

  function renderHeartsHtml(lives, maxLives) {
    var html = '';
    for (var h = 0; h < maxLives; h++) {
      html += '<span class="heart ' + (h < lives ? 'is-full' : 'is-lost') + '" data-heart-idx="' + h + '">♥</span>';
    }
    return html;
  }

  /* ------------------------------------------------------------------
     Screen 4 & 5 & 6: Main Gameplay + Hint + Pause Modal
     ------------------------------------------------------------------ */
  function renderGameplay(root) {
    var board = state.board;
    var size = board.size;
    var total = board.arrows.length;
    var remaining = Puzzle.countRemaining(board);
    var clearedPct = total ? Math.round(((total - remaining) / total) * 100) : 0;
    var title = state.isDaily ? 'Daily Challenge' : 'Level ' + state.levelId;

    var occ = Puzzle.occupancy(board);
    var cellsHtml = '';
    for (var y = 0; y < size; y++) {
      for (var x = 0; x < size; x++) {
        var aid = occ[x + ',' + y];
        if (aid != null) {
          var arrow = Puzzle.getArrow(board, aid);
          var c = Config.DIRECTION_COLORS[arrow.dir];
          var isHint = state.hintArrowId === arrow.id;
          cellsHtml +=
            '<button class="cell arrow-tile' + (isHint ? ' is-hint' : '') + '" ' +
              'data-arrow-id="' + arrow.id + '" ' +
              'aria-label="Arrow ' + arrow.dir + ' at column ' + (x + 1) + ' row ' + (y + 1) + '" ' +
              'style="--c-top:' + c.top + ';--c-top2:' + c.top2 + ';--c-side:' + c.side + ';--c-glow:' + c.glow + '">' +
              '<span class="cube-3d">' +
                '<span class="cube-3d__shadow"></span>' +
                '<span class="cube-3d__side"></span>' +
                '<span class="cube-3d__front"></span>' +
                '<span class="cube-3d__top">' + arrowSvg(arrow.dir) + '</span>' +
              '</span>' +
            '</button>';
        } else {
          cellsHtml += '<div class="cell empty-cell" aria-hidden="true"></div>';
        }
      }
    }

    var heartsHtml = renderHeartsHtml(state.lives, state.maxLives);

    var gameOverHtml =
      '<div class="modal-backdrop" id="gameOverModal" style="display:' + (state.gameOver ? 'flex' : 'none') + '" role="dialog" aria-modal="true">' +
        '<div class="modal-card">' +
          '<div class="gameover-hearts">💔</div>' +
          '<h2>OUT OF HEARTS!</h2>' +
          '<p class="modal-sub">' + title + ' • No lifelines remaining.</p>' +
          '<div class="modal-actions">' +
            '<button class="btn btn-primary btn-xl" id="btnRetryGameOver">↻ Replay Level</button>' +
            '<button class="btn btn-ghost" id="btnGameOverHome">🏠 Home</button>' +
          '</div>' +
        '</div>' +
      '</div>';

    var pauseHtml =
      '<div class="modal-backdrop" id="pauseModal" style="display:' + (state.paused && !state.gameOver ? 'flex' : 'none') + '" role="dialog" aria-modal="true">' +
        '<div class="modal-card">' +
          '<h2>PAUSED</h2>' +
          '<p class="modal-sub" id="pauseModalSub">' + title + ' • ' + state.moves + ' moves</p>' +
          '<div class="modal-actions">' +
            '<button class="btn btn-primary btn-xl" id="btnResume">▶ Resume</button>' +
            '<button class="btn btn-secondary" id="btnPauseRestart">↻ Restart Level</button>' +
            '<button class="btn btn-ghost" id="btnPauseHome">🏠 Home</button>' +
          '</div>' +
        '</div>' +
      '</div>';

    root.innerHTML =
      '<div class="screen screen--visible play-screen">' +
        '<header class="play-header">' +
          '<button class="icon-btn" id="btnPause" aria-label="Pause game">⏸</button>' +
          '<div class="play-title-group">' +
            '<span class="play-title">' + title + '</span>' +
            '<span class="play-par">3★ Target: ≤ ' + state.levelConfig.stars.three + ' moves</span>' +
          '</div>' +
          '<button class="icon-btn" id="btnRestart" aria-label="Restart level">↻</button>' +
        '</header>' +

        '<div class="level-bar"><div class="level-bar__fill" id="levelBarFill" style="width:' + clearedPct + '%"></div></div>' +

        '<div class="hud-row">' +
          '<div class="hud-box"><span class="hud-box__label">ARROWS</span><span class="hud-box__val" id="hudArrows">' + remaining + '</span></div>' +
          '<div class="hud-box hud-box--lives"><span class="hud-box__label">LIVES</span><span class="hud-lives" id="hudLives">' + heartsHtml + '</span></div>' +
          '<div class="hud-box"><span class="hud-box__label">MOVES</span><span class="hud-box__val" id="hudMoves">' + state.moves + '</span></div>' +
          '<button class="btn btn-hint" id="btnHint">💡 Hint</button>' +
        '</div>' +

        '<div class="board-stage">' +
          '<div class="puzzle-board size-' + size + '" id="puzzleBoard" style="grid-template-columns:repeat(' + size + ',1fr);grid-template-rows:repeat(' + size + ',1fr)">' +
            cellsHtml +
          '</div>' +
        '</div>' +

        '<div class="toast-slot" id="toastSlot" aria-live="polite"></div>' +
        pauseHtml +
        gameOverHtml +
      '</div>';

    document.getElementById('btnPause').addEventListener('click', function () {
      Audio.playClick();
      pauseGame();
    });
    document.getElementById('btnRestart').addEventListener('click', function () {
      Audio.playClick();
      restartCurrent();
    });
    document.getElementById('btnHint').addEventListener('click', function () {
      Audio.playClick();
      triggerHint();
    });

    var boardEl = document.getElementById('puzzleBoard');
    if (boardEl) {
      boardEl.addEventListener('click', function (e) {
        if (state.paused || state.gameOver || state.animating || state.completedOnce) return;
        var tile = e.target.closest('.arrow-tile');
        if (!tile) return;
        var aid = parseInt(tile.getAttribute('data-arrow-id'), 10);
        if (!isNaN(aid)) {
          handleArrowTap(aid);
        }
      });
    }

    var btnRetryGo = document.getElementById('btnRetryGameOver');
    if (btnRetryGo) {
      btnRetryGo.addEventListener('click', function () {
        Audio.playClick();
        restartCurrent();
      });
    }
    var btnGoHome = document.getElementById('btnGameOverHome');
    if (btnGoHome) {
      btnGoHome.addEventListener('click', function () {
        Audio.playClick();
        state.gameOver = false;
        Platform.gameplayStop();
        navigate('home');
      });
    }

    var btnRes = document.getElementById('btnResume');
    if (btnRes) {
      btnRes.addEventListener('click', function () {
        Audio.playClick();
        resumeGame();
      });
    }
    var btnPRestart = document.getElementById('btnPauseRestart');
    if (btnPRestart) {
      btnPRestart.addEventListener('click', function () {
        Audio.playClick();
        restartCurrent();
      });
    }
    var btnPHome = document.getElementById('btnPauseHome');
    if (btnPHome) {
      btnPHome.addEventListener('click', function () {
        Audio.playClick();
        state.paused = false;
        Platform.gameplayStop();
        Analytics.track('level_abandoned', { level: state.levelId, isDaily: state.isDaily, moves: state.moves });
        navigate('home');
      });
    }
  }

  /* ------------------------------------------------------------------
     Screen 7: Level Completed
     ------------------------------------------------------------------ */
  function renderLevelComplete(root) {
    var lv = state.levelConfig;
    var stars = Cubiqo.LevelGenerator.starsForMoves(state.moves, lv.stars);
    var rec = !state.isDaily ? Storage.levelRecord(state.levelId) : null;
    var milestoneTitle = !state.isDaily ? Config.MILESTONES[state.levelId] : null;

    var starsHtml = '';
    for (var i = 1; i <= 3; i++) {
      starsHtml += '<span class="complete-star ' + (i <= stars ? 'is-earned' : 'is-empty') + '" style="animation-delay:' + (i * 0.16) + 's">★</span>';
    }

    setTimeout(function () { Audio.playComplete(); }, 80);
    for (var s = 0; s < stars; s++) {
      (function (idx) { setTimeout(function () { Audio.playStar(idx); }, 350 + idx * 200); })(s);
    }
    if (milestoneTitle) {
      setTimeout(function () { Audio.playMilestone(); }, 900);
    }

    root.innerHTML =
      '<div class="screen screen--visible complete-screen">' +
        '<div class="particles" id="particles"></div>' +
        '<div class="complete-card">' +
          (milestoneTitle ? '<div class="milestone-pill">🏆 Milestone Unlocked: ' + milestoneTitle + ' (Level ' + state.levelId + ')</div>' : '') +
          '<h2 class="complete-heading">' + (state.isDaily ? 'DAILY COMPLETED!' : 'LEVEL COMPLETED!') + '</h2>' +
          '<div class="complete-stars">' + starsHtml + '</div>' +
          '<div class="complete-stats">' +
            '<div class="c-stat"><span>Moves Used</span><strong>' + state.moves + '</strong></div>' +
            (rec ? '<div class="c-stat"><span>Best Moves</span><strong>' + rec.bestMoves + '</strong></div>' : '') +
            '<div class="c-stat"><span>3-Star Target</span><strong>≤ ' + lv.stars.three + '</strong></div>' +
          '</div>' +
          '<div class="complete-actions">' +
            (!state.isDaily && state.levelId < Config.TOTAL_LEVELS ? '<button class="btn btn-primary btn-xl" id="btnNextLevel">Next Level ▶</button>' : '') +
            (!state.isDaily && state.levelId === Config.TOTAL_LEVELS ? '<button class="btn btn-primary btn-xl" id="btnToVictory">🏆 Final Victory</button>' : '') +
            '<button class="btn btn-secondary" id="btnReplay">↻ Replay</button>' +
            '<button class="btn btn-ghost" id="btnCompleteHome">🏠 Home</button>' +
          '</div>' +
        '</div>' +
      '</div>';

    spawnParticles();

    var nextBtn = document.getElementById('btnNextLevel');
    if (nextBtn) nextBtn.addEventListener('click', function () {
      Audio.playClick();
      startMainLevel(state.levelId + 1);
    });
    var vicBtn = document.getElementById('btnToVictory');
    if (vicBtn) vicBtn.addEventListener('click', function () {
      Audio.playClick();
      navigate('victory');
    });
    document.getElementById('btnReplay').addEventListener('click', function () {
      Audio.playClick();
      restartCurrent();
    });
    document.getElementById('btnCompleteHome').addEventListener('click', function () {
      Audio.playClick();
      navigate('home');
    });
  }

  /* ------------------------------------------------------------------
     Screen 9: Settings
     ------------------------------------------------------------------ */
  function renderSettings(root) {
    var settings = Storage.getSettings();

    root.innerHTML =
      '<div class="screen screen--visible settings-screen">' +
        '<header class="top-bar">' +
          '<button class="icon-btn" id="btnSettingsBack" aria-label="Back to home">←</button>' +
          '<h2 class="top-bar__title">SETTINGS</h2>' +
          '<span class="top-bar__meta">v' + Config.VERSION + '</span>' +
        '</header>' +
        '<div class="settings-body">' +
          '<label class="setting-row"><span>🔊 Sound Effects</span><input type="checkbox" class="switch" id="setSound" ' + (settings.sound ? 'checked' : '') + '></label>' +
          '<label class="setting-row"><span>🎵 Ambient Music</span><input type="checkbox" class="switch" id="setMusic" ' + (settings.music ? 'checked' : '') + '></label>' +
          '<label class="setting-row"><span>📳 Haptic Feedback</span><input type="checkbox" class="switch" id="setHaptics" ' + (settings.haptics ? 'checked' : '') + '></label>' +
          '<div class="settings-sep"></div>' +
          '<button class="btn btn-secondary" id="btnPrivacy">ℹ Privacy Policy</button>' +
          '<button class="btn btn-danger" id="btnResetProgress">⚠ Reset All Progress</button>' +
        '</div>' +
        '<div class="modal-backdrop" id="confirmModal" style="display:none" role="dialog" aria-modal="true">' +
          '<div class="modal-card">' +
            '<h3 id="modalTitle">Confirm</h3>' +
            '<p class="modal-sub" id="modalMsg"></p>' +
            '<div class="modal-actions">' +
              '<button class="btn btn-danger" id="modalConfirm">Confirm</button>' +
              '<button class="btn btn-ghost" id="modalCancel">Cancel</button>' +
            '</div>' +
          '</div>' +
        '</div>' +
      '</div>';

    document.getElementById('btnSettingsBack').addEventListener('click', function () {
      Audio.playClick();
      navigate('home');
    });
    document.getElementById('setSound').addEventListener('change', function (e) {
      Storage.setSettings({ sound: e.target.checked });
    });
    document.getElementById('setMusic').addEventListener('change', function (e) {
      Storage.setSettings({ music: e.target.checked });
      Audio.syncMusic();
    });
    document.getElementById('setHaptics').addEventListener('change', function (e) {
      Storage.setSettings({ haptics: e.target.checked });
    });

    var modal = document.getElementById('confirmModal');
    var modalTitle = document.getElementById('modalTitle');
    var modalMsg = document.getElementById('modalMsg');
    var modalConfirm = document.getElementById('modalConfirm');
    var modalCancel = document.getElementById('modalCancel');

    document.getElementById('btnPrivacy').addEventListener('click', function () {
      Audio.playClick();
      modalTitle.textContent = 'Privacy Policy';
      modalMsg.textContent = 'CUBIQO: Arrow Escape stores your level progress, star records, and preferences locally in your browser via localStorage. No personal data is collected or transmitted.';
      modalConfirm.style.display = 'none';
      modalCancel.textContent = 'Close';
      modal.style.display = 'flex';
    });

    document.getElementById('btnResetProgress').addEventListener('click', function () {
      Audio.playClick();
      modalTitle.textContent = 'Reset All Progress?';
      modalMsg.textContent = 'This will erase all saved levels, stars, and daily streaks. Unrelated browser data is untouched.';
      modalConfirm.style.display = '';
      modalCancel.textContent = 'Cancel';
      modal.style.display = 'flex';
      modalConfirm.onclick = function () {
        Storage.resetProgress();
        modal.style.display = 'none';
        navigate('home');
      };
    });

    modalCancel.addEventListener('click', function () {
      modal.style.display = 'none';
    });
  }

  /* ------------------------------------------------------------------
     Screen 10: Final Victory
     ------------------------------------------------------------------ */
  function renderVictory(root) {
    var save = Storage.load();
    var completed = Object.keys(save.levels).length;
    Audio.playVictory();

    root.innerHTML =
      '<div class="screen screen--visible victory-screen">' +
        '<div class="particles" id="particles"></div>' +
        '<div class="victory-card">' +
          '<div class="victory-trophy">🏆</div>' +
          '<h1 class="victory-title">YOU CLEARED ALL 100 LEVELS!</h1>' +
          '<p class="victory-sub">Every arrow escaped. True logic mastery.</p>' +
          '<div class="victory-stats">' +
            '<div class="v-stat"><span>Completed</span><strong>' + completed + '/100</strong></div>' +
            '<div class="v-stat"><span>Total Moves</span><strong>' + save.totalMoves + '</strong></div>' +
            '<div class="v-stat"><span>Total Stars</span><strong>★ ' + save.totalStars + '/300</strong></div>' +
          '</div>' +
          '<div class="complete-actions">' +
            '<button class="btn btn-primary btn-xl" id="btnPlayAgain">↻ PLAY AGAIN</button>' +
            '<button class="btn btn-ghost" id="btnVictoryHome">🏠 HOME</button>' +
          '</div>' +
        '</div>' +
        '<div class="modal-backdrop" id="victoryResetModal" style="display:none" role="dialog" aria-modal="true">' +
          '<div class="modal-card">' +
            '<h3>Start a New Campaign?</h3>' +
            '<p class="modal-sub">This will reset your 100-level campaign progress so you can play from Level 1.</p>' +
            '<div class="modal-actions">' +
              '<button class="btn btn-danger" id="btnConfirmPlayAgain">Yes, Restart Campaign</button>' +
              '<button class="btn btn-ghost" id="btnCancelPlayAgain">Cancel</button>' +
            '</div>' +
          '</div>' +
        '</div>' +
      '</div>';

    spawnParticles();

    var modal = document.getElementById('victoryResetModal');
    document.getElementById('btnPlayAgain').addEventListener('click', function () {
      Audio.playClick();
      modal.style.display = 'flex';
    });
    document.getElementById('btnConfirmPlayAgain').addEventListener('click', function () {
      Storage.resetProgress();
      startMainLevel(1);
    });
    document.getElementById('btnCancelPlayAgain').addEventListener('click', function () {
      modal.style.display = 'none';
    });
    document.getElementById('btnVictoryHome').addEventListener('click', function () {
      Audio.playClick();
      navigate('home');
    });
  }

  /* ------------------------------------------------------------------
     Gameplay Actions
     ------------------------------------------------------------------ */
  function startMainLevel(id) {
    var lv = Cubiqo.Levels.byId(id);
    if (!lv) return;
    state.isDaily = false;
    state.levelId = lv.id;
    state.levelConfig = lv;
    state.board = Puzzle.createBoard(lv);
    state.moves = 0;
    state.lives = 3;
    state.maxLives = 3;
    state.gameOver = false;
    state.paused = false;
    state.hintArrowId = null;
    state.animating = false;
    state.completedOnce = false;
    Platform.gameplayStart();
    Analytics.track('level_started', { level: lv.id, isDaily: false });
    navigate('gameplay');
  }

  function startDailyLevel() {
    var lv = Daily.getPuzzleForDate();
    if (!lv) return;
    state.isDaily = true;
    state.levelId = 0;
    state.levelConfig = lv;
    state.board = Puzzle.createBoard(lv);
    state.moves = 0;
    state.lives = 3;
    state.maxLives = 3;
    state.gameOver = false;
    state.paused = false;
    state.hintArrowId = null;
    state.animating = false;
    state.completedOnce = false;
    Platform.gameplayStart();
    Analytics.track('level_started', { level: lv.id, isDaily: true });
    navigate('gameplay');
  }

  function restartCurrent() {
    Analytics.track('replay_started', { level: state.levelId, isDaily: state.isDaily });
    if (state.isDaily) startDailyLevel();
    else startMainLevel(state.levelId);
  }

  function pauseGame() {
    if (state.screen !== 'gameplay' || state.paused || state.gameOver) return;
    state.paused = true;
    Platform.pauseGame();
    var modal = document.getElementById('pauseModal');
    var sub = document.getElementById('pauseModalSub');
    if (sub) {
      var title = state.isDaily ? 'Daily Challenge' : 'Level ' + state.levelId;
      sub.textContent = title + ' • ' + state.moves + ' moves';
    }
    if (modal) modal.style.display = 'flex';
  }

  function resumeGame() {
    if (state.screen !== 'gameplay' || !state.paused) return;
    state.paused = false;
    Platform.resumeGame();
    var modal = document.getElementById('pauseModal');
    if (modal) modal.style.display = 'none';
  }

  function handleArrowTap(arrowId) {
    if (state.paused || state.gameOver || state.animating || state.completedOnce) return;

    var res = Puzzle.tryRemove(state.board, arrowId);
    state.moves += 1;

    var movesEl = document.getElementById('hudMoves');
    if (movesEl) movesEl.textContent = String(state.moves);

    if (state.hintArrowId === arrowId) state.hintArrowId = null;

    var tile = document.querySelector('[data-arrow-id="' + arrowId + '"]');

    if (!res.ok) {
      Audio.playBlocked();
      Audio.haptic([18, 40, 18]);

      // Deduct a heart
      state.lives = Math.max(0, state.lives - 1);
      var livesEl = document.getElementById('hudLives');
      if (livesEl) {
        livesEl.innerHTML = renderHeartsHtml(state.lives, state.maxLives);
        var hitHeart = livesEl.querySelector('[data-heart-idx="' + state.lives + '"]');
        if (hitHeart) hitHeart.classList.add('is-hit');
      }

      if (tile) {
        tile.classList.remove('is-blocked');
        void tile.offsetWidth;
        tile.classList.add('is-blocked');
      }

      if (state.lives <= 0) {
        state.gameOver = true;
        Platform.gameplayStop();
        Audio.playBlocked();
        showToast('Out of hearts! Level failed.', 'error');
        var goModal = document.getElementById('gameOverModal');
        if (goModal) goModal.style.display = 'flex';
        return;
      }

      showToast('Blocked! Lost 1 heart (' + state.lives + ' left)', 'error');
      return;
    }

    state.animating = true;
    Audio.playClear();
    Audio.haptic(10);

    if (tile) {
      tile.classList.remove('is-hint');
      tile.classList.add('exit-' + res.arrow.dir);
    }

    setTimeout(function () {
      state.animating = false;
      // In-place replacement: keep grid layout stable without re-rendering the whole screen
      if (tile && tile.parentNode) {
        var empty = document.createElement('div');
        empty.className = 'cell empty-cell';
        empty.setAttribute('aria-hidden', 'true');
        tile.parentNode.replaceChild(empty, tile);
      }

      var remaining = Puzzle.countRemaining(state.board);
      var arrowsEl = document.getElementById('hudArrows');
      if (arrowsEl) arrowsEl.textContent = String(remaining);

      var total = state.board.arrows.length;
      var pct = total ? Math.round(((total - remaining) / total) * 100) : 0;
      var fillEl = document.getElementById('levelBarFill');
      if (fillEl) fillEl.style.width = pct + '%';

      if (Puzzle.isComplete(state.board)) {
        finishLevel();
      }
    }, Config.TIMING.exitAnimation);
  }

  function finishLevel() {
    if (state.completedOnce) return;
    state.completedOnce = true;

    var lv = state.levelConfig;
    var stars = Cubiqo.LevelGenerator.starsForMoves(state.moves, lv.stars);
    if (state.isDaily) {
      Daily.completeToday(state.moves, stars);
    } else {
      Storage.completeLevel(state.levelId, state.moves, stars);
      Analytics.track('level_completed', { level: state.levelId, moves: state.moves, stars: stars });
    }
    Platform.gameplayStop();

    setTimeout(function () {
      if (!state.isDaily && state.levelId === Config.TOTAL_LEVELS) {
        navigate('victory');
      } else {
        navigate('levelComplete');
      }
    }, Config.TIMING.completionDelay);
  }

  function triggerHint() {
    if (state.paused || state.gameOver || state.animating) return;
    Hints.requestHint(state.board).then(function (res) {
      if (res.ok && res.arrow) {
        state.hintArrowId = res.arrow.id;
        Audio.playHint();
        Utils.$$('.arrow-tile.is-hint').forEach(function (el) {
          el.classList.remove('is-hint');
        });
        var target = document.querySelector('[data-arrow-id="' + res.arrow.id + '"]');
        if (target) target.classList.add('is-hint');
        showToast('Tap the highlighted arrow to clear it!', 'hint');
      } else {
        showToast('No removable arrows available.', 'error');
      }
    });
  }

  function showToast(msg, kind) {
    if (state.toastTimer) clearTimeout(state.toastTimer);
    requestAnimationFrame(function () {
      var slot = document.getElementById('toastSlot');
      if (!slot) return;
      slot.innerHTML = '<div class="toast toast--' + (kind || 'info') + '">' + msg + '</div>';
      state.toastTimer = setTimeout(function () {
        if (slot) slot.innerHTML = '';
      }, 2200);
    });
  }

  function spawnParticles() {
    var box = document.getElementById('particles');
    if (!box) return;
    var colors = ['#7c3aed', '#3b82f6', '#fb7185', '#34d399', '#fbbf24'];
    for (var i = 0; i < 36; i++) {
      var p = document.createElement('span');
      p.className = 'particle';
      p.style.left = (Math.random() * 100) + '%';
      p.style.background = colors[i % colors.length];
      p.style.animationDelay = (Math.random() * 1.4) + 's';
      p.style.animationDuration = (1.3 + Math.random() * 1.4) + 's';
      box.appendChild(p);
    }
  }

  Cubiqo.UI = {
    render: render,
    navigate: navigate,
    startMainLevel: startMainLevel,
    startDailyLevel: startDailyLevel,
    restartCurrent: restartCurrent,
    pauseGame: pauseGame,
    resumeGame: resumeGame,
    triggerHint: triggerHint,
    getState: function () { return state; }
  };
})(typeof window !== 'undefined' ? window : globalThis);
