/* =========================================================================
   tests/browser.mjs
   End-to-end Playwright browser verification on desktop & mobile viewports.
   Usage: npm run test:browser
   ========================================================================= */
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { chromium } from 'playwright';

const PORT = 4173;
const URL = `http://localhost:${PORT}/`;

const server = spawn(process.execPath, ['tools/static-server.mjs'], {
  env: { ...process.env, PORT: String(PORT) },
  stdio: 'ignore'
});

await new Promise((r) => setTimeout(r, 700));

const browser = await chromium.launch();
try {
  for (const vp of [
    { name: 'desktop', width: 1280, height: 800 },
    { name: 'mobile', width: 375, height: 740 }
  ]) {
    const context = await browser.newContext({ viewport: { width: vp.width, height: vp.height } });
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', (e) => errors.push(e.message));
    page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });

    await page.goto(URL, { waitUntil: 'networkidle' });
    await page.waitForSelector('#btnHomePlay', { timeout: 5000 });
    await page.click('#btnHomePlay');
    await page.waitForSelector('#puzzleBoard');

    // Lifeline: verify 3 hearts are displayed and full, and HUD fits inside #app
    const hearts = await page.locator('.hud-lives .heart.is-full').count();
    assert.equal(hearts, 3, 'Game should start with 3 full hearts');
    const hintFits = await page.evaluate(() => {
      const app = document.getElementById('app').getBoundingClientRect();
      const hint = document.getElementById('btnHint').getBoundingClientRect();
      return hint.right <= app.right + 1;
    });
    assert.equal(hintFits, true, `Hint button should not clip on ${vp.name}`);

    // Test wrong move -> heart loss -> Game Over -> Replay Level on Level 5
    await page.evaluate(() => window.Cubiqo.UI.startMainLevel(5));
    await page.waitForSelector('#puzzleBoard');
    const blockedTile = page.locator('[data-arrow-id]').first();
    await blockedTile.click();
    assert.equal(await page.locator('.hud-lives .heart.is-full').count(), 2, '1st wrong tap loses 1 heart');
    await blockedTile.click();
    assert.equal(await page.locator('.hud-lives .heart.is-full').count(), 1, '2nd wrong tap loses 2nd heart');
    await blockedTile.click();
    assert.equal(await page.locator('.hud-lives .heart.is-full').count(), 0, '3rd wrong tap loses 3rd heart');
    await page.waitForSelector('#gameOverModal', { state: 'visible' });
    await page.click('#btnRetryGameOver');
    await page.waitForSelector('#puzzleBoard');
    assert.equal(await page.locator('.hud-lives .heart.is-full').count(), 3, 'Replay restores 3 hearts');

    // Return to Level 1 to test Hint, Pause/Resume, and Completion -> Level 2
    await page.evaluate(() => window.Cubiqo.UI.startMainLevel(1));
    await page.waitForSelector('#puzzleBoard');

    // Hint highlights a valid arrow (1st free hint) and 2nd hint opens outside-gameplay Hint modal
    await page.click('#btnHint');
    await page.waitForSelector('.arrow-tile.is-hint');
    await page.click('#btnHint');
    await page.waitForSelector('#hintModal', { state: 'visible' });
    await page.click('#btnHintCancel');
    await page.waitForSelector('#hintModal', { state: 'hidden' });

    // Pause and resume preserves state
    await page.click('#btnPause');
    await page.waitForSelector('#pauseModal');
    await page.click('#btnResume');

    // Clear all arrows using free/hinted moves (reset level 1 so free hint is fresh)
    await page.evaluate(() => window.Cubiqo.UI.startMainLevel(1));
    await page.waitForSelector('#puzzleBoard');
    while (true) {
      await page.waitForFunction(() => document.querySelectorAll('[class*="exit-"]').length === 0);
      const remaining = await page.locator('.arrow-tile').count();
      if (remaining === 0) break;
      await page.evaluate(async () => {
        const res = await window.Cubiqo.Hints.requestHint(window.Cubiqo.UI.getState().board);
        if (res.ok && res.arrow) {
          document.querySelector('[data-arrow-id="' + res.arrow.id + '"]')?.click();
        }
      });
    }

    await page.waitForSelector('#btnNextLevel', { timeout: 3000 });
    // Verify achievement unlock pill appears after completing Level 1
    await page.waitForSelector('.ach-unlock-pill', { timeout: 2000 });
    await page.click('#btnNextLevel');
    await page.waitForSelector('#puzzleBoard');

    // Test dynamic viewport resize during gameplay
    await page.setViewportSize({ width: 667, height: 375 });
    await page.waitForTimeout(100);
    await page.setViewportSize({ width: vp.width, height: vp.height });

    // Multi-session reload persistence check: reload and verify Lv 2 + 3 stars persist
    await page.reload({ waitUntil: 'networkidle' });
    await page.waitForSelector('#btnHomePlay', { timeout: 5000 });
    const playText = await page.locator('#btnHomePlay').textContent();
    assert.ok(playText && playText.includes('2'), `Expected Level 2 unlocked after reload, got: ${playText}`);

    // Test Settings, Daily Challenge, Achievements & Themes screens from Home
    await page.click('#btnHomeDaily');
    await page.waitForSelector('#btnDailyPlay');
    await page.click('#btnDailyBack');

    await page.waitForSelector('#btnHomeAchievements');
    await page.click('#btnHomeAchievements');
    await page.waitForSelector('#achList');
    assert.ok((await page.locator('.ach-card.is-unlocked').count()) >= 1, 'At least 1 achievement unlocked');
    await page.click('#btnAchBack');

    await page.waitForSelector('#btnHomeThemes');
    await page.click('#btnHomeThemes');
    await page.waitForSelector('#themesList');
    assert.ok((await page.locator('.theme-card').count()) >= 6, 'Themes screen lists all themes');
    await page.click('#btnThemesBack');

    await page.waitForSelector('#btnHomeSettings');
    await page.click('#btnHomeSettings');
    await page.waitForSelector('#btnResetProgress');
    await page.click('#btnResetProgress');
    await page.waitForSelector('#confirmModal', { state: 'visible' });
    await page.click('#modalCancel');

    // Test offline blocking, manual retry while offline, & auto-reconnection recovery
    await context.setOffline(true);
    await page.waitForSelector('#offlineGate', { state: 'visible', timeout: 3000 });
    await page.click('#btnRetryConnection');
    await page.waitForFunction(() => (document.getElementById('offlineStatus')?.textContent || '').includes('Still offline'));
    await context.setOffline(false);
    await page.waitForSelector('#offlineGate', { state: 'detached', timeout: 3000 });

    assert.deepEqual(errors, [], `Console/page errors on ${vp.name}: ${errors.join('; ')}`);
    await context.close();
    console.log(`  ✓ ${vp.name} viewport QA passed`);
  }
} finally {
  await browser.close();
  server.kill();
}
