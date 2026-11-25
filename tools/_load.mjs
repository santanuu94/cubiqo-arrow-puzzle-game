/* =========================================================================
   tools/_load.mjs
   Loads the browser-style IIFE modules (js/*.js) into the Node global scope
   so the tools and the test suite exercise the exact same code the game
   ships. No transpiling, no separate implementation.
   ========================================================================= */
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const ROOT = path.resolve(__dirname, '..');

export const CORE_FILES = [
  'js/config.js',
  'js/utils.js',
  'js/storage.js',
  'js/puzzle.js',
  'js/level-generator.js'
];

export function loadGame(files = CORE_FILES) {
  for (const f of files) {
    const abs = path.join(ROOT, f);
    const code = fs.readFileSync(abs, 'utf8');
    vm.runInThisContext(code, { filename: abs });
  }
  if (!globalThis.Cubiqo) throw new Error('Cubiqo namespace was not created');
  return globalThis.Cubiqo;
}

/** Minimal DOM stub so storage.js can be exercised in Node without a browser. */
export function installLocalStorageStub(initial = {}) {
  const map = new Map(Object.entries(initial));
  const stub = {
    getItem: (k) => (map.has(k) ? map.get(k) : null),
    setItem: (k, v) => { map.set(k, String(v)); },
    removeItem: (k) => { map.delete(k); },
    clear: () => { map.clear(); },
    key: (i) => Array.from(map.keys())[i] ?? null,
    get length() { return map.size; }
  };
  globalThis.localStorage = stub;
  return stub;
}
