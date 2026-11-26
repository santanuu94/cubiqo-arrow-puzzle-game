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
  var Achievements = Cubiqo.Achievements;
  var Themes = Cubiqo.Themes;
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
    adActive: false,
    adPending: false,
    revivedWithAd: false,
    freeHintUsed: false,
    lastCompleteInfo: null,
    toastTimer: null,
    runToken: 0,
    pendingTimers: []
  };

  function schedule(fn, delay) {
    var id = setTimeout(function () {
      var idx = state.pendingTimers.indexOf(id);
      if (idx !== -1) state.pendingTimers.splice(idx, 1);
      fn();
    }, delay);
    state.pendingTimers.push(id);
    return id;
  }

  function clearPendingTimers() {
    for (var i = 0; i < state.pendingTimers.length; i++) {
      clearTimeout(state.pendingTimers[i]);
    }
    state.pendingTimers.length = 0;
    if (state.toastTimer) {
      clearTimeout(state.toastTimer);
      state.toastTimer = null;
    }
  }

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
      case 'achievements': renderAchievements(root); break;
      case 'themes': renderThemes(root); break;
      case 'gameplay': renderGameplay(root); break;
      case 'levelComplete': renderLevelComplete(root); break;
      case 'settings': renderSettings(root); break;
      case 'victory': renderVictory(root); break;
    }
  }

  function navigate(screen) {
    clearPendingTimers();
    if (Platform.clearAllBanners) Platform.clearAllBanners();
    state.runToken += 1;
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
    requestAnimationFrame(function () {
      if (fill) fill.style.width = '75%';
    });

    var netCheck = (Config.ONLINE_REQUIRED && Cubiqo.Network)
      ? Cubiqo.Network.check()
      : Promise.resolve(true);

    Promise.all([netCheck, Platform.whenReady ? Platform.whenReady() : Promise.resolve(true)]).then(function (results) {
      var isOnline = results[0];
      if (!isOnline) {
        showOfflineGate();
        return;
      }
      if (fill) fill.style.width = '100%';
      schedule(function () {
        if (Config.ONLINE_REQUIRED && Cubiqo.Network && !Cubiqo.Network.isOnline()) {
          showOfflineGate();
          return;
        }
        Platform.gameLoadingFinished();
        Analytics.track('game_loaded');
        navigate('home');
      }, 180);
    });
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
            '<div class="stat-pill"><span class="stat-pill__label">Coins</span><span class="stat-pill__val">🪙 ' + (save.coins || 0) + '</span></div>' +
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
            '<div class="home-sub-actions">' +
              '<button class="btn btn-secondary" id="btnHomeAchievements">🏆 ACHIEVEMENTS</button>' +
              '<button class="btn btn-secondary" id="btnHomeThemes">🎨 THEMES</button>' +
            '</div>' +
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
    document.getElementById('btnHomeAchievements').addEventListener('click', function () {
      Audio.playClick();
      navigate('achievements');
    });
    document.getElementById('btnHomeThemes').addEventListener('click', function () {
      Audio.playClick();
      navigate('themes');
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
        '<div class="banner-slot" id="bannerSlot" aria-label="Advertisement">' +
          '<div class="banner-container" id="responsive-banner-container"></div>' +
        '</div>' +
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

    var token = state.runToken;
    requestAnimationFrame(function () {
      var cur = document.getElementById('lvlTile-' + save.highestUnlocked);
      if (cur && cur.scrollIntoView) cur.scrollIntoView({ block: 'center', behavior: 'smooth' });

      var slot = document.getElementById('bannerSlot');
      if (slot && Platform.isBannerAvailable && Platform.isBannerAvailable()) {
        slot.classList.add('is-active');
        Platform.requestResponsiveBanner('responsive-banner-container').then(function (res) {
          if (token !== state.runToken || state.screen !== 'levelSelect') {
            Platform.clearAllBanners();
            return;
          }
          if (!res || !res.ok) {
            var s = document.getElementById('bannerSlot');
            if (s) s.classList.remove('is-active');
          }
        });
      }
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
            '<div class="daily-badge">' + (status.completed ? '✓ COMPLETED TODAY • REWARD CLAIMED' : '★ TODAY\'S PUZZLE') + '</div>' +
            '<h3 class="daily-card__title">Fresh Daily Logic Board</h3>' +
            '<p class="daily-card__desc">Everyone gets the same deterministic puzzle today. Daily puzzles do not affect your 100-level campaign.</p>' +
            '<div class="daily-metrics">' +
              '<div class="daily-metric"><span>Current Streak</span><strong>🔥 ' + status.streak + '</strong></div>' +
              '<div class="daily-metric"><span>Best Streak</span><strong>🏆 ' + status.bestStreak + '</strong></div>' +
              '<div class="daily-metric"><span>Today\'s Best</span><strong>' + (rec ? rec.moves + ' moves (' + '★'.repeat(rec.stars || 1) + ')' : '—') + '</strong></div>' +
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

  /* ------------------------------------------------------------------
     Screen 8B: Achievements
     ------------------------------------------------------------------ */
  function renderAchievements(root) {
    var list = Achievements ? Achievements.list() : [];
    var unlockedCount = list.filter(function (a) { return a.unlocked; }).length;
    var cardsHtml = list.map(function (a) {
      var pct = a.target ? Math.round((a.current / a.target) * 100) : 0;
      return (
        '<div class="ach-card' + (a.unlocked ? ' is-unlocked' : '') + '">' +
          '<div class="ach-icon">' + a.icon + '</div>' +
          '<div class="ach-info">' +
            '<div class="ach-title">' + a.title + '</div>' +
            '<div class="ach-desc">' + a.desc + '</div>' +
            '<div class="ach-bar"><div class="ach-bar__fill" style="width:' + pct + '%"></div></div>' +
          '</div>' +
          '<div class="ach-status">' + (a.unlocked ? '✓ UNLOCKED' : a.current + '/' + a.target) + '</div>' +
        '</div>'
      );
    }).join('');

    root.innerHTML =
      '<div class="screen screen--visible achievements-screen">' +
        '<header class="top-bar">' +
          '<button class="icon-btn" id="btnAchBack" aria-label="Back to home">←</button>' +
          '<h2 class="top-bar__title">ACHIEVEMENTS</h2>' +
          '<span class="top-bar__meta">' + unlockedCount + '/' + list.length + '</span>' +
        '</header>' +
        '<div class="scroll-body" id="achList">' + cardsHtml + '</div>' +
      '</div>';

    document.getElementById('btnAchBack').addEventListener('click', function () {
      Audio.playClick();
      navigate('home');
    });
  }

  /* ------------------------------------------------------------------
     Screen 8C: Unlockable Themes
     ------------------------------------------------------------------ */
  function renderThemes(root) {
    if (Themes) Themes.syncUnlocks();
    var all = Themes ? Themes.getAll() : [];
    var unlockedCount = all.filter(function (t) { return t.unlocked; }).length;

    var cardsHtml = all.map(function (t) {
      var swHtml = t.swatches.map(function (hex) {
        return '<span class="theme-swatch" style="background:' + hex + '"></span>';
      }).join('');
      var btnHtml = '';
      if (t.active) {
        btnHtml = '<button class="btn btn-secondary theme-btn" disabled>✓ Equipped</button>';
      } else if (t.unlocked) {
        btnHtml = '<button class="btn btn-primary theme-btn" data-equip-theme="' + t.id + '">Equip</button>';
      } else {
        btnHtml = '<button class="btn btn-ghost theme-btn" disabled>🔒 Locked</button>';
      }
      return (
        '<div class="theme-card' + (t.unlocked ? '' : ' is-locked') + (t.active ? ' is-active' : '') + '">' +
          '<div class="ach-info">' +
            '<div class="ach-title">' + t.name + '</div>' +
            '<div class="ach-desc">' + (t.unlocked ? t.desc : 'Unlock: ' + t.unlockText) + '</div>' +
            '<div class="theme-swatches">' + swHtml + '</div>' +
          '</div>' +
          btnHtml +
        '</div>'
      );
    }).join('');

    root.innerHTML =
      '<div class="screen screen--visible themes-screen">' +
        '<header class="top-bar">' +
          '<button class="icon-btn" id="btnThemesBack" aria-label="Back to home">←</button>' +
          '<h2 class="top-bar__title">THEMES</h2>' +
          '<span class="top-bar__meta">' + unlockedCount + '/' + all.length + '</span>' +
        '</header>' +
        '<div class="scroll-body" id="themesList">' + cardsHtml + '</div>' +
      '</div>';

    document.getElementById('btnThemesBack').addEventListener('click', function () {
      Audio.playClick();
      navigate('home');
    });
    Utils.$$('[data-equip-theme]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var id = btn.getAttribute('data-equip-theme');
        Audio.playClick();
        if (Themes && Themes.equip(id)) {
          renderThemes(root);
        }
      });
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
          '<p class="modal-sub">' + title + ' • <strong id="goCoins">🪙 ' + Storage.getCoins() + ' Coins</strong></p>' +
          '<div class="gameover-recover-row" id="goRecoverRow">' +
            '<button class="btn btn-ad" id="btnReviveAd">🎬 +1 Heart<small>Watch Ad</small></button>' +
            '<button class="btn btn-coins" id="btnReviveCoins">🪙 +1 Heart<small>' + ((Config.ECONOMY && Config.ECONOMY.heartCostCoins) || 30) + ' Coins</small></button>' +
          '</div>' +
          '<p class="reward-note" id="goAdMsg"></p>' +
          '<div class="modal-actions">' +
            '<button class="btn btn-primary btn-xl" id="btnRetryGameOver">↻ Replay Level</button>' +
            '<button class="btn btn-ghost" id="btnGameOverHome">🏠 Home</button>' +
          '</div>' +
        '</div>' +
      '</div>';

    var hintModalHtml =
      '<div class="modal-backdrop" id="hintModal" style="display:none" role="dialog" aria-modal="true">' +
        '<div class="modal-card">' +
          '<h2>EXTRA HINT</h2>' +
          '<p class="modal-sub">Free hint used for this level. <strong id="hintCoins">🪙 ' + Storage.getCoins() + ' Coins</strong></p>' +
          '<div class="gameover-recover-row">' +
            '<button class="btn btn-ad" id="btnHintAd">🎬 +1 Hint<small>Watch Ad</small></button>' +
            '<button class="btn btn-coins" id="btnHintCoins">🪙 +1 Hint<small>' + ((Config.ECONOMY && Config.ECONOMY.hintCostCoins) || 20) + ' Coins</small></button>' +
          '</div>' +
          '<p class="reward-note" id="hintAdMsg"></p>' +
          '<div class="modal-actions">' +
            '<button class="btn btn-ghost" id="btnHintCancel">Continue Without Hint</button>' +
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
        hintModalHtml +
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
        if (state.paused || state.gameOver || state.completedOnce) return;
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
        if (state.adPending || state.adActive) return;
        Audio.playClick();
        restartCurrent();
      });
    }
    var btnGoHome = document.getElementById('btnGameOverHome');
    if (btnGoHome) {
      btnGoHome.addEventListener('click', function () {
        if (state.adPending || state.adActive) return;
        Audio.playClick();
        state.gameOver = false;
        Platform.gameplayStop();
        navigate('home');
      });
    }
    var btnReviveAd = document.getElementById('btnReviveAd');
    if (btnReviveAd) {
      btnReviveAd.addEventListener('click', function () {
        if (state.adPending || state.adActive || state.revivedWithAd) return;
        if (!Platform.isRewardedAvailable() || Platform.getRewardedCooldownRemaining() > 0) {
          refreshGameOverModal();
          return;
        }
        Audio.playClick();
        state.adPending = true;
        btnReviveAd.disabled = true;
        var msgEl = document.getElementById('goAdMsg');
        if (msgEl) msgEl.textContent = '';
        Platform.showRewardedAd().then(function (rewarded) {
          state.adPending = false;
          if (rewarded === true) {
            state.revivedWithAd = true;
            reviveWithHeart('ad');
          } else {
            if (msgEl) msgEl.textContent = 'Advertisement unavailable right now. Use coins or replay.';
            refreshGameOverModal();
          }
        }).catch(function () {
          state.adPending = false;
          if (msgEl) msgEl.textContent = 'Advertisement unavailable right now. Use coins or replay.';
          refreshGameOverModal();
        });
      });
    }
    var btnReviveCoins = document.getElementById('btnReviveCoins');
    if (btnReviveCoins) {
      btnReviveCoins.addEventListener('click', function () {
        if (state.adPending || state.adActive) return;
        var cost = (Config.ECONOMY && Config.ECONOMY.heartCostCoins) || 30;
        if (Storage.spendCoins(cost)) {
          Audio.playClick();
          reviveWithHeart('coins');
        } else {
          refreshGameOverModal();
        }
      });
    }

    var btnHintAd = document.getElementById('btnHintAd');
    if (btnHintAd) {
      btnHintAd.addEventListener('click', function () {
        if (state.adPending || state.adActive) return;
        if (!Platform.isRewardedAvailable() || Platform.getRewardedCooldownRemaining() > 0) {
          refreshHintModal();
          return;
        }
        Audio.playClick();
        state.adPending = true;
        btnHintAd.disabled = true;
        var msgEl = document.getElementById('hintAdMsg');
        if (msgEl) msgEl.textContent = '';
        Platform.showRewardedAd().then(function (rewarded) {
          state.adPending = false;
          if (rewarded === true) {
            Storage.addHints(1);
            closeHintModalAndApply();
          } else {
            if (msgEl) msgEl.textContent = 'Advertisement unavailable right now. Use coins or continue.';
            refreshHintModal();
          }
        }).catch(function () {
          state.adPending = false;
          if (msgEl) msgEl.textContent = 'Advertisement unavailable right now. Use coins or continue.';
          refreshHintModal();
        });
      });
    }
    var btnHintCoins = document.getElementById('btnHintCoins');
    if (btnHintCoins) {
      btnHintCoins.addEventListener('click', function () {
        if (state.adPending || state.adActive) return;
        var cost = (Config.ECONOMY && Config.ECONOMY.hintCostCoins) || 20;
        if (Storage.spendCoins(cost)) {
          Audio.playClick();
          Storage.addHints(1);
          closeHintModalAndApply();
        } else {
          refreshHintModal();
        }
      });
    }
    var btnHintCancel = document.getElementById('btnHintCancel');
    if (btnHintCancel) {
      btnHintCancel.addEventListener('click', function () {
        if (state.adPending || state.adActive) return;
        Audio.playClick();
        var hm = document.getElementById('hintModal');
        if (hm) hm.style.display = 'none';
        state.paused = false;
        Platform.gameplayStart();
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
    var info = state.lastCompleteInfo || {};
    var dailyStatus = state.isDaily ? Daily.getStatus() : null;

    var starsHtml = '';
    for (var i = 1; i <= 3; i++) {
      starsHtml += '<span class="complete-star ' + (i <= stars ? 'is-earned' : 'is-empty') + '" style="animation-delay:' + (i * 0.16) + 's">★</span>';
    }

    schedule(function () { Audio.playComplete(); }, 80);
    for (var s = 0; s < stars; s++) {
      (function (idx) { schedule(function () { Audio.playStar(idx); }, 350 + idx * 200); })(s);
    }
    if (milestoneTitle) {
      schedule(function () { Audio.playMilestone(); }, 900);
    }

    var badgeHtml = '';
    if (milestoneTitle) {
      badgeHtml = '<div class="milestone-pill">🏆 Milestone Unlocked: ' + milestoneTitle + ' (Level ' + state.levelId + ')</div>';
    } else if (state.isDaily && dailyStatus) {
      badgeHtml = '<div class="milestone-pill">' +
        (info.isFirstClaim ? '🔥 Day ' + dailyStatus.streak + ' Streak • Daily Reward Claimed!' : '✓ Daily Replay • Reward Already Claimed Today') +
      '</div>';
    } else if (info.improved && !info.firstClear) {
      badgeHtml = '<div class="milestone-pill">✨ NEW PERSONAL BEST!</div>';
    }

    var newlyUnlockedAch = info.unlockedAchievements || [];
    var achHtml = newlyUnlockedAch.length ?
      '<div class="ach-unlock-list">' +
        newlyUnlockedAch.map(function (a) {
          return '<div class="ach-unlock-pill">' + a.icon + ' Achievement Unlocked: ' + a.title + '</div>';
        }).join('') +
      '</div>' : '';

    var rewardTheme = (!state.isDaily && Themes) ? Themes.rewardForLevel(state.levelId) : null;
    var rewardHtml = '';
    if (rewardTheme) {
      var isEquipped = Storage.getActiveTheme() === rewardTheme.id;
      var swHtml = rewardTheme.swatches.map(function (hex) {
        return '<span class="theme-swatch" style="background:' + hex + '"></span>';
      }).join('');
      rewardHtml =
        '<div class="milestone-reward-box">' +
          '<div class="milestone-reward-title">🎨 Milestone Reward: ' + rewardTheme.name + ' Theme</div>' +
          '<div class="theme-swatches">' + swHtml + '</div>' +
          '<button class="btn ' + (isEquipped ? 'btn-secondary' : 'btn-primary') + ' theme-btn" id="btnEquipMilestoneTheme" ' + (isEquipped ? 'disabled' : '') + '>' +
            (isEquipped ? '✓ Equipped' : 'Equip Theme Now') +
          '</button>' +
        '</div>';
    }

    root.innerHTML =
      '<div class="screen screen--visible complete-screen">' +
        '<div class="particles" id="particles"></div>' +
        '<div class="complete-card">' +
          badgeHtml +
          '<h2 class="complete-heading">' + (state.isDaily ? 'DAILY COMPLETED!' : 'LEVEL COMPLETED!') + '</h2>' +
          '<div class="complete-stars">' + starsHtml + '</div>' +
          achHtml +
          rewardHtml +
          '<div class="complete-stats">' +
            '<div class="c-stat"><span>Moves Used</span><strong>' + state.moves + '</strong></div>' +
            (rec ? '<div class="c-stat"><span>Best Moves</span><strong>' + rec.bestMoves + '</strong></div>' : '') +
            (state.isDaily && dailyStatus && dailyStatus.record ? '<div class="c-stat"><span>Today\'s Best</span><strong>' + dailyStatus.record.moves + ' moves</strong></div>' : '') +
            (info.coinsEarned > 0 ? '<div class="c-stat"><span>Coins Earned</span><strong>+' + info.coinsEarned + ' 🪙</strong></div>' : '') +
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

    var equipBtn = document.getElementById('btnEquipMilestoneTheme');
    if (equipBtn && rewardTheme) {
      equipBtn.addEventListener('click', function () {
        Audio.playClick();
        if (Themes && Themes.equip(rewardTheme.id)) {
          equipBtn.textContent = '✓ Equipped';
          equipBtn.className = 'btn btn-secondary theme-btn';
          equipBtn.disabled = true;
        }
      });
    }

    var nextBtn = document.getElementById('btnNextLevel');
    var replayBtn = document.getElementById('btnReplay');
    var homeBtn = document.getElementById('btnCompleteHome');
    if (nextBtn) nextBtn.addEventListener('click', function () {
      if (state.adPending || state.adActive) return;
      Audio.playClick();
      state.adPending = true;
      nextBtn.disabled = true;
      if (replayBtn) replayBtn.disabled = true;
      if (homeBtn) homeBtn.disabled = true;
      var nextLevelId = state.levelId + 1;
      Platform.showInterstitial().catch(function () { return false; }).then(function () {
        state.adPending = false;
        state.adActive = false;
        startMainLevel(nextLevelId);
      });
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
          (!Storage.available() || !Storage.isPersistent() ? '<p class="modal-sub" style="color:#fde68a;margin:4px 0 0">Session-only mode: browser storage is restricted.</p>' : '') +
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
    if (Config.ONLINE_REQUIRED && Cubiqo.Network && !Cubiqo.Network.isOnline()) {
      showOfflineGate();
      return;
    }
    var lv = Cubiqo.Levels.byId(id) || Cubiqo.Levels.byId(1);
    if (!lv) {
      showToast('Unable to load puzzle. Please reload.', 'error');
      return;
    }
    clearPendingTimers();
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
    state.revivedWithAd = false;
    state.freeHintUsed = false;
    state.adPending = false;
    state.adActive = false;
    Platform.gameplayStart();
    Analytics.track('level_started', { level: lv.id, isDaily: false });
    navigate('gameplay');
  }

  function startDailyLevel() {
    if (Config.ONLINE_REQUIRED && Cubiqo.Network && !Cubiqo.Network.isOnline()) {
      showOfflineGate();
      return;
    }
    var lv = Daily.getPuzzleForDate();
    if (!lv) return;
    clearPendingTimers();
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
    state.revivedWithAd = false;
    state.freeHintUsed = false;
    state.adPending = false;
    state.adActive = false;
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
    if (state.screen !== 'gameplay' || state.paused || state.gameOver || state.completedOnce) return;
    state.paused = true;
    Platform.pauseGame();
    var modal = document.getElementById('pauseModal');
    var sub = document.getElementById('pauseModalSub');
    if (sub) {
      var title = state.isDaily ? 'Daily Challenge' : 'Level ' + state.levelId;
      sub.textContent = title + ' • ' + state.moves + ' moves';
    }
    if (modal) {
      modal.style.display = 'flex';
      var resumeBtn = document.getElementById('btnResume');
      if (resumeBtn) resumeBtn.focus();
    }
  }

  function resumeGame() {
    if (state.screen !== 'gameplay' || !state.paused) return;
    state.paused = false;
    Platform.resumeGame();
    var modal = document.getElementById('pauseModal');
    if (modal) modal.style.display = 'none';
    var pauseBtn = document.getElementById('btnPause');
    if (pauseBtn) pauseBtn.focus();
  }

  function closeActiveModal() {
    if (state.screen === 'gameplay' && state.paused) {
      resumeGame();
      return true;
    }
    if (state.screen === 'settings') {
      var cm = document.getElementById('confirmModal');
      if (cm && cm.style.display === 'flex') {
        cm.style.display = 'none';
        return true;
      }
    }
    if (state.screen === 'victory') {
      var vm = document.getElementById('victoryResetModal');
      if (vm && vm.style.display === 'flex') {
        vm.style.display = 'none';
        return true;
      }
    }
    return false;
  }

  function handleArrowTap(arrowId) {
    if (Config.ONLINE_REQUIRED && Cubiqo.Network && !Cubiqo.Network.isOnline()) {
      showOfflineGate();
      return;
    }
    if (state.paused || state.gameOver || state.completedOnce) return;

    var res = Puzzle.tryRemove(state.board, arrowId);
    if (!res.ok && res.reason !== 'blocked') return;

    state.moves += 1;

    var movesEl = document.getElementById('hudMoves');
    if (movesEl) movesEl.textContent = String(state.moves);

    if (state.hintArrowId === arrowId) state.hintArrowId = null;

    var tile = document.querySelector('[data-arrow-id="' + arrowId + '"]');

    if (!res.ok) {
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
        Audio.playGameOver();
        Analytics.track('level_failed', {
          level: state.levelId,
          isDaily: state.isDaily,
          moves: state.moves,
          reason: 'out_of_hearts'
        });
        showToast('Out of hearts! Level failed.', 'error');
        refreshGameOverModal();
        var goModal = document.getElementById('gameOverModal');
        if (goModal) {
          goModal.style.display = 'flex';
          var retryBtn = document.getElementById('btnRetryGameOver');
          if (retryBtn) retryBtn.focus();
        }
        return;
      }

      Audio.playBlocked();
      showToast('Blocked! Lost 1 heart (' + state.lives + ' left)', 'error');
      return;
    }

    var token = state.runToken;
    var boardFinished = Puzzle.isComplete(state.board);
    if (boardFinished) state.completedOnce = true;

    Audio.playClear();
    Audio.haptic(10);

    var remaining = Puzzle.countRemaining(state.board);
    var arrowsEl = document.getElementById('hudArrows');
    if (arrowsEl) arrowsEl.textContent = String(remaining);

    var total = state.board.arrows.length;
    var pct = total ? Math.round(((total - remaining) / total) * 100) : 0;
    var fillEl = document.getElementById('levelBarFill');
    if (fillEl) fillEl.style.width = pct + '%';

    if (tile) {
      tile.classList.remove('is-hint');
      tile.classList.add('exit-' + res.arrow.dir);
    }

    schedule(function () {
      if (token !== state.runToken) return;
      // In-place replacement: keep grid layout stable without re-rendering the whole screen
      if (tile && tile.parentNode) {
        var empty = document.createElement('div');
        empty.className = 'cell empty-cell';
        empty.setAttribute('aria-hidden', 'true');
        tile.parentNode.replaceChild(empty, tile);
      }

      if (boardFinished) {
        finishLevel(token);
      }
    }, Config.TIMING.exitAnimation);
  }

  function finishLevel(token) {
    if (token != null && token !== state.runToken) return;

    var lv = state.levelConfig;
    var stars = Cubiqo.LevelGenerator.starsForMoves(state.moves, lv.stars);
    if (state.isDaily) {
      var dRes = Daily.completeToday(state.moves, stars);
      var dailyCoins = dRes.isFirstClaim ? ((Config.ECONOMY && Config.ECONOMY.dailyClearCoins) || 25) : 0;
      state.lastCompleteInfo = { isFirstClaim: !!dRes.isFirstClaim, streak: dRes.streak, coinsEarned: dailyCoins };
    } else {
      var cRes = Storage.completeLevel(state.levelId, state.moves, stars);
      state.lastCompleteInfo = cRes;
      Analytics.track('level_completed', { level: state.levelId, moves: state.moves, stars: stars });
    }
    if (Themes) state.lastCompleteInfo.unlockedThemes = Themes.syncUnlocks();
    if (Achievements) state.lastCompleteInfo.unlockedAchievements = Achievements.evaluate();
    Platform.gameplayStop();

    var activeToken = state.runToken;
    schedule(function () {
      if (activeToken !== state.runToken) return;
      if (!state.isDaily && state.levelId === Config.TOTAL_LEVELS) {
        navigate('victory');
      } else {
        navigate('levelComplete');
      }
    }, Config.TIMING.completionDelay);
  }

  function refreshGameOverModal() {
    var coinsEl = document.getElementById('goCoins');
    var coins = Storage.getCoins();
    if (coinsEl) coinsEl.textContent = '🪙 ' + coins + ' Coins';

    var cost = (Config.ECONOMY && Config.ECONOMY.heartCostCoins) || 30;
    var btnCoins = document.getElementById('btnReviveCoins');
    if (btnCoins) {
      btnCoins.disabled = coins < cost;
      btnCoins.innerHTML = '🪙 +1 Heart<small>' + (coins >= cost ? cost + ' Coins' : 'Need ' + cost + ' Coins') + '</small>';
    }

    var btnAd = document.getElementById('btnReviveAd');
    var msgEl = document.getElementById('goAdMsg');
    if (btnAd) {
      var canOfferAd = Platform.isRewardedAvailable() && !state.revivedWithAd;
      if (!canOfferAd) {
        btnAd.style.display = 'none';
      } else {
        btnAd.style.display = '';
        var cd = Platform.getRewardedCooldownRemaining();
        btnAd.disabled = cd > 0;
        btnAd.innerHTML = '🎬 +1 Heart<small>' + (cd > 0 ? 'Wait ' + cd + 's' : 'Watch Ad') + '</small>';
        if (cd > 0 && msgEl && !msgEl.textContent) {
          msgEl.textContent = 'Rewarded ad cooldown: ' + cd + 's remaining.';
        }
      }
    }
  }

  function reviveWithHeart(source) {
    state.lives = 1;
    state.gameOver = false;
    var livesEl = document.getElementById('hudLives');
    if (livesEl) {
      livesEl.innerHTML = renderHeartsHtml(state.lives, state.maxLives);
      var restored = livesEl.querySelector('[data-heart-idx="0"]');
      if (restored) restored.classList.add('is-restored');
    }
    var goModal = document.getElementById('gameOverModal');
    if (goModal) goModal.style.display = 'none';
    Audio.playStar(2);
    Platform.gameplayStart();
    Analytics.track('heart_restored', { level: state.levelId, source: source });
    showToast('♥ +1 Heart Restored! Keep going!', 'info');
  }

  function refreshHintModal() {
    var coinsEl = document.getElementById('hintCoins');
    var coins = Storage.getCoins();
    if (coinsEl) coinsEl.textContent = '🪙 ' + coins + ' Coins';

    var cost = (Config.ECONOMY && Config.ECONOMY.hintCostCoins) || 20;
    var btnCoins = document.getElementById('btnHintCoins');
    if (btnCoins) {
      btnCoins.disabled = coins < cost;
      btnCoins.innerHTML = '🪙 +1 Hint<small>' + (coins >= cost ? cost + ' Coins' : 'Need ' + cost + ' Coins') + '</small>';
    }

    var btnAd = document.getElementById('btnHintAd');
    var msgEl = document.getElementById('hintAdMsg');
    if (btnAd) {
      if (!Platform.isRewardedAvailable()) {
        btnAd.style.display = 'none';
      } else {
        btnAd.style.display = '';
        var cd = Platform.getRewardedCooldownRemaining();
        btnAd.disabled = cd > 0;
        btnAd.innerHTML = '🎬 +1 Hint<small>' + (cd > 0 ? 'Wait ' + cd + 's' : 'Watch Ad') + '</small>';
        if (cd > 0 && msgEl && !msgEl.textContent) {
          msgEl.textContent = 'Rewarded ad cooldown: ' + cd + 's remaining.';
        }
      }
    }
  }

  function applyHintOnBoard() {
    var token = state.runToken;
    Hints.requestHint(state.board).then(function (res) {
      if (token !== state.runToken || state.screen !== 'gameplay' || state.paused || state.gameOver || state.completedOnce) return;
      if (res.ok && res.arrow) {
        state.hintArrowId = res.arrow.id;
        Audio.playHint();
        Utils.$$('.arrow-tile.is-hint').forEach(function (el) {
          el.classList.remove('is-hint');
        });
        var target = document.querySelector('[data-arrow-id="' + res.arrow.id + '"]');
        if (target) target.classList.add('is-hint');
        showToast('Tap the highlighted arrow to clear it!', 'hint');
      } else if (res.reason === 'offline') {
        showOfflineGate();
      } else {
        showToast('No removable arrows available.', 'error');
      }
    });
  }

  function closeHintModalAndApply() {
    var hm = document.getElementById('hintModal');
    if (hm) hm.style.display = 'none';
    state.paused = false;
    Platform.gameplayStart();
    if (Storage.consumeHint()) {
      applyHintOnBoard();
    }
  }

  function triggerHint() {
    if (state.screen !== 'gameplay' || state.paused || state.gameOver || state.completedOnce || state.adActive || state.adPending) return;
    if (Config.ONLINE_REQUIRED && Cubiqo.Network && !Cubiqo.Network.isOnline()) {
      showOfflineGate();
      return;
    }
    if (!state.freeHintUsed) {
      state.freeHintUsed = true;
      applyHintOnBoard();
      return;
    }
    if (Storage.consumeHint()) {
      applyHintOnBoard();
      return;
    }
    // Outside active gameplay: pause before showing optional Ad / Coin hint modal
    state.paused = true;
    Platform.gameplayStop();
    refreshHintModal();
    var hm = document.getElementById('hintModal');
    if (hm) hm.style.display = 'flex';
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
    schedule(function () {
      var el = document.getElementById('particles');
      if (el) el.innerHTML = '';
    }, 2800);
  }

  function showOfflineGate() {
    var root = rootEl();
    if (!root) return;
    var gate = document.getElementById('offlineGate');
    if (gate) {
      gate.style.display = 'flex';
      return;
    }
    gate = document.createElement('div');
    gate.className = 'modal-backdrop offline-gate';
    gate.id = 'offlineGate';
    gate.setAttribute('role', 'alertdialog');
    gate.setAttribute('aria-modal', 'true');
    gate.innerHTML =
      '<div class="modal-card">' +
        '<div class="offline-icon">🌐</div>' +
        '<h2>INTERNET CONNECTION REQUIRED</h2>' +
        '<p class="modal-sub">CUBIQO: Arrow Escape is an online game. Connect to the internet to launch and play. Your saved progress is safe.</p>' +
        '<p class="modal-sub" id="offlineStatus" style="margin-bottom:14px;font-weight:700"></p>' +
        '<div class="modal-actions">' +
          '<button class="btn btn-primary btn-xl" id="btnRetryConnection">↻ Retry Connection</button>' +
        '</div>' +
      '</div>';
    root.appendChild(gate);

    var retryBtn = document.getElementById('btnRetryConnection');
    if (retryBtn) {
      retryBtn.addEventListener('click', function () {
        var statusEl = document.getElementById('offlineStatus');
        retryBtn.disabled = true;
        retryBtn.textContent = 'Checking...';
        if (statusEl) statusEl.textContent = '';
        (Cubiqo.Network ? Cubiqo.Network.check() : Promise.resolve(false)).then(function (ok) {
          retryBtn.disabled = false;
          retryBtn.textContent = '↻ Retry Connection';
          if (ok) {
            hideOfflineGate();
          } else if (statusEl) {
            statusEl.textContent = 'Still offline. Please check your connection.';
          }
        });
      });
    }
  }

  function hideOfflineGate() {
    var gate = document.getElementById('offlineGate');
    if (gate && gate.parentNode) gate.parentNode.removeChild(gate);
    if (state.screen === 'loading') {
      Platform.gameLoadingFinished();
      Analytics.track('game_loaded');
      navigate('home');
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
    closeActiveModal: closeActiveModal,
    triggerHint: triggerHint,
    showOfflineGate: showOfflineGate,
    hideOfflineGate: hideOfflineGate,
    setAdActive: function (active) { state.adActive = !!active; },
    getState: function () { return state; }
  };
})(typeof window !== 'undefined' ? window : globalThis);
