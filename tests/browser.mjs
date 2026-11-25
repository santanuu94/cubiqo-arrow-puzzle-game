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

    // Lifeline: verify 3 hearts are displayed and full
    const hearts = await page.locator('.hud-lives .heart.is-full').count();
    assert.equal(hearts, 3, 'Game should start with 3 full hearts');

    // Hint highlights a valid arrow
    await page.click('#btnHint');
    await page.waitForSelector('.arrow-tile.is-hint');

    // Pause and resume preserves state
    await page.click('#btnPause');
    await page.waitForSelector('#pauseModal');
    await page.click('#btnResume');

    // Clear all hinted/clear arrows to complete level 1
    while (true) {
      await page.waitForFunction(() => document.querySelectorAll('[class*="exit-"]').length === 0);
      const remaining = await page.locator('.arrow-tile').count();
      if (remaining === 0) break;
      await page.click('#btnHint');
      const target = page.locator('.arrow-tile.is-hint').first();
      await target.waitFor({ state: 'visible' });
      await target.click();
    }

    await page.waitForSelector('#btnNextLevel', { timeout: 3000 });
    assert.deepEqual(errors, [], `Console/page errors on ${vp.name}: ${errors.join('; ')}`);
    await context.close();
    console.log(`  ✓ ${vp.name} viewport QA passed`);
  }
} finally {
  await browser.close();
  server.kill();
}
