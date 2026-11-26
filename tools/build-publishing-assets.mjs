import fs from 'node:fs';
import path from 'node:path';
import { spawn, execFileSync } from 'node:child_process';
import { chromium } from 'playwright';

const FFMPEG = 'C:\\Users\\HP\\AppData\\Local\\Microsoft\\WinGet\\Packages\\Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe\\ffmpeg-9.1-full_build\\bin\\ffmpeg.exe';
fs.mkdirSync('publishing', { recursive: true });

const makeHtml = (w, h, mode) => {
  const isLand = mode === 'landscape';
  const titleSize = isLand ? 124 : (mode === 'portrait' ? 88 : 78);
  const subSize = isLand ? 32 : 24;
  const tileSize = isLand ? 118 : (mode === 'portrait' ? 104 : 86);
  const dirs = [
    { rot: 0,   c1: '#a78bfa', c2: '#8b5cf6', side: '#6d28d9' },
    { rot: 90,  c1: '#60a5fa', c2: '#3b82f6', side: '#1d4ed8' },
    { rot: 180, c1: '#fb7185', c2: '#f43f5e', side: '#be123c' },
    { rot: 270, c1: '#34d399', c2: '#10b981', side: '#047857' }
  ];
  const grid = [1, 2, 3, 0, 1, 2, 3, 0, 1];
  const tiles = grid.map((i) => {
    const d = dirs[i];
    return `<div class="tile" style="width:${tileSize}px;height:${tileSize}px;--c1:${d.c1};--c2:${d.c2};--side:${d.side}">
      <div class="side"></div><div class="front"></div>
      <div class="top"><svg viewBox="0 0 24 24" style="transform:rotate(${d.rot}deg)"><path fill="#fff" d="M12 3.5l7.5 8.5h-4.5v8.5h-6V12H4.5z"/></svg></div>
    </div>`;
  }).join('');

  return `<!doctype html><html><head><style>
    *{box-sizing:border-box;margin:0;padding:0}
    body{width:${w}px;height:${h}px;overflow:hidden;display:flex;align-items:center;justify-content:center;background:radial-gradient(circle at 20% 20%, rgba(167,139,250,.28), transparent 45%),linear-gradient(155deg,#2e1065 0%,#1e1b4b 55%,#172554 100%);font-family:ui-rounded,'SF Pro Rounded','Segoe UI',system-ui,sans-serif;color:#fff}
    .wrap{display:flex;flex-direction:${isLand ? 'row' : 'column'};align-items:center;justify-content:center;gap:${isLand ? '110px' : '48px'};text-align:${isLand ? 'left' : 'center'}}
    .badge{display:inline-block;background:rgba(255,255,255,.14);border:1px solid rgba(255,255,255,.22);padding:8px 18px;border-radius:99px;font-size:18px;font-weight:700;letter-spacing:3px;color:#c4b5fd;margin-bottom:18px}
    h1{font-size:${titleSize}px;font-weight:900;letter-spacing:6px;line-height:1;text-shadow:0 12px 32px rgba(0,0,0,.4)}
    .sub{font-size:${subSize}px;font-weight:800;letter-spacing:8px;color:#a78bfa;margin-top:10px}
    .tag{font-size:${isLand ? 26 : 20}px;color:rgba(255,255,255,.82);margin-top:18px}
    .board{background:#fff;padding:${isLand ? 28 : 22}px;border-radius:32px;display:grid;grid-template-columns:repeat(3,1fr);gap:${isLand ? 20 : 16}px;box-shadow:0 30px 70px rgba(0,0,0,.48)}
    .tile{position:relative}
    .top{position:absolute;inset:0;background:linear-gradient(145deg,var(--c1),var(--c2));border-radius:18px;display:flex;align-items:center;justify-content:center;z-index:3;box-shadow:inset 0 2px 0 rgba(255,255,255,.4)}
    .front{position:absolute;left:0;right:0;bottom:-8px;height:14px;background:var(--side);border-radius:0 0 18px 18px;z-index:2}
    .side{position:absolute;top:5px;right:-6px;bottom:-8px;width:12px;background:var(--side);filter:brightness(.82);border-radius:0 18px 18px 0;z-index:1}
    .top svg{width:56%;height:56%;filter:drop-shadow(0 2px 4px rgba(0,0,0,.28))}
  </style></head><body><div class="wrap">
    <div><div class="badge">100 LOGIC LEVELS</div><h1>CUBIQO</h1><div class="sub">ARROW ESCAPE</div><div class="tag">Find the clear path. Free every arrow.</div></div>
    <div class="board">${tiles}</div>
  </div></body></html>`;
};

const server = spawn(process.execPath, ['tools/static-server.mjs'], { env: { ...process.env, PORT: '4193' }, stdio: 'ignore' });
await new Promise((r) => setTimeout(r, 600));
const browser = await chromium.launch();

try {
  // 1. Cover Artworks
  for (const spec of [
    { file: 'publishing/cover-landscape-1920x1080.png', w: 1920, h: 1080, mode: 'landscape' },
    { file: 'publishing/cover-portrait-800x1200.png', w: 800, h: 1200, mode: 'portrait' },
    { file: 'publishing/cover-square-800x800.png', w: 800, h: 800, mode: 'square' }
  ]) {
    const p = await browser.newPage({ viewport: { width: spec.w, height: spec.h } });
    await p.setContent(makeHtml(spec.w, spec.h, spec.mode));
    await p.screenshot({ path: spec.file });
    await p.close();
    console.log('Cover:', spec.file, fs.statSync(spec.file).size, 'bytes');
  }

  // 2. Preview Videos (record live gameplay on Levels 1 -> 4 -> 5, <= 15s, transcode to 1080p MP4)
  const tmpVidDir = path.join('publishing', '_tmp_vid');
  fs.mkdirSync(tmpVidDir, { recursive: true });

  for (const vid of [
    { out: 'publishing/preview-landscape-1920x1080.mp4', w: 1280, h: 720, outW: 1920, outH: 1080 },
    { out: 'publishing/preview-portrait-1080x1620.mp4', w: 540, h: 810, outW: 1080, outH: 1620 }
  ]) {
    const ctx = await browser.newContext({
      viewport: { width: vid.w, height: vid.h },
      recordVideo: { dir: tmpVidDir, size: { width: vid.w, height: vid.h } }
    });
    const page = await ctx.newPage();
    await page.goto('http://localhost:4193/', { waitUntil: 'networkidle' });
    await page.waitForSelector('#btnHomePlay');
    await page.waitForTimeout(700);
    await page.click('#btnHomePlay');
    await page.waitForSelector('#puzzleBoard');
    await page.waitForTimeout(450);

    // Clear Level 1, then jump to Level 5 and clear it cleanly for rich visual action
    for (const lvId of [1, 5]) {
      if (lvId === 5) {
        await page.evaluate(() => window.Cubiqo.UI.startMainLevel(5));
        await page.waitForSelector('#puzzleBoard');
        await page.waitForTimeout(450);
      }
      while (true) {
        await page.waitForFunction(() => document.querySelectorAll('[class*="exit-"]').length === 0);
        const rem = await page.locator('.arrow-tile').count();
        if (rem === 0) break;
        await page.evaluate(async () => {
          const res = await window.Cubiqo.Hints.requestHint(window.Cubiqo.UI.getState().board);
          if (res.ok && res.arrow) {
            document.querySelector('[data-arrow-id="' + res.arrow.id + '"]')?.click();
          }
        });
        await page.waitForTimeout(420);
      }
      await page.waitForSelector('#btnNextLevel', { timeout: 3000 });
      await page.waitForTimeout(900);
    }

    const v = page.video();
    await ctx.close();
    const rawPath = await v.path();
    execFileSync(FFMPEG, [
      '-y', '-i', rawPath,
      '-t', '18',
      '-vf', `scale=${vid.outW}:${vid.outH}:flags=lanczos`,
      '-c:v', 'libx264', '-preset', 'medium', '-crf', '22', '-pix_fmt', 'yuv420p',
      '-movflags', '+faststart', '-an', vid.out
    ], { stdio: 'ignore' });
    console.log('Video:', vid.out, fs.statSync(vid.out).size, 'bytes');
  }

  fs.rmSync(tmpVidDir, { recursive: true, force: true });
} finally {
  await browser.close();
  server.kill();
}
