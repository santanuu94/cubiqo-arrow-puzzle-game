/* =========================================================================
   tools/fetch-fonts.mjs
   Downloads the latin subset of the Fredoka typeface and stores it locally so
   the shipped game makes zero network requests (PRD §11 "Bundle essential
   fonts and assets locally" / "Avoid unnecessary network requests").

   This is a BUILD-TIME authoring script. It is not part of the game bundle.
   The downloaded files are committed to assets/fonts/ and referenced from
   css/fonts.css.
   ========================================================================= */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const OUT_DIR = path.join(ROOT, 'assets', 'fonts');

const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

const FAMILY = 'Fredoka';
const WEIGHTS = [500, 600, 700];

async function get(url, asBuffer = false) {
  const res = await fetch(url, { headers: { 'User-Agent': UA } });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText} for ${url}`);
  return asBuffer ? Buffer.from(await res.arrayBuffer()) : res.text();
}

/** Parse the @font-face blocks that only cover the basic latin range. */
function latinFaces(css) {
  const faces = [];
  const blocks = css.split('@font-face').slice(1);
  for (const block of blocks) {
    const range = /unicode-range:\s*([^;]+);/.exec(block);
    if (!range) continue;
    /* The "latin" subset is the one that includes U+0000-00FF and is not
       latin-ext (which starts at U+0100). */
    if (!/U\+0000-00FF/.test(range[1])) continue;
    if (/U\+0100/.test(range[1])) continue;
    const weight = /font-weight:\s*(\d+)/.exec(block);
    const url = /url\((https:[^)]+)\)/.exec(block);
    if (!weight || !url) continue;
    faces.push({ weight: Number(weight[1]), url: url[1] });
  }
  return faces;
}

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });

  const cssUrl = `https://fonts.googleapis.com/css2?family=${FAMILY}:wght@${WEIGHTS.join(';')}&display=swap`;
  const css = await get(cssUrl);
  const faces = latinFaces(css);

  if (!faces.length) {
    console.error('No latin font faces found — aborting.');
    process.exit(1);
  }

  const entries = [];
  for (const face of faces) {
    const file = `${FAMILY.toLowerCase()}-${face.weight}.woff2`;
    const target = path.join(OUT_DIR, file);
    const buf = await get(face.url, true);
    fs.writeFileSync(target, buf);
    console.log(`  ${file}  ${(buf.length / 1024).toFixed(1)} KB`);
    entries.push({ weight: face.weight, file });
  }

  const out = `/* =========================================================================
   CUBIQO: ARROW ESCAPE — fonts.css
   Locally bundled typeface. No runtime network requests.

   Fredoka is licensed under the SIL Open Font License 1.1.
   Regenerate with: node tools/fetch-fonts.mjs
   ========================================================================= */
${entries
  .map(
    (e) => `@font-face {
  font-family: '${FAMILY}';
  font-style: normal;
  font-weight: ${e.weight};
  font-display: swap;
  src: url('../assets/fonts/${e.file}') format('woff2');
}`
  )
  .join('\n\n')}
`;
  fs.writeFileSync(path.join(ROOT, 'css', 'fonts.css'), out, 'utf8');
  console.log(`Wrote css/fonts.css (${entries.length} faces).`);
}

main().catch((err) => {
  console.error('Font fetch failed:', err.message);
  console.error('The game falls back to system fonts; this is not fatal.');
  process.exit(1);
});
