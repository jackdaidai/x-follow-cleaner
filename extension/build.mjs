// Sync the extension content script from the canonical userscript.
// Run after editing ../userscript/x-follow-cleaner.user.js:  node extension/build.mjs
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const dir = dirname(fileURLToPath(import.meta.url));
const src = readFileSync(join(dir, '..', 'userscript', 'x-follow-cleaner.user.js'), 'utf8');

// Strip the Tampermonkey metadata block; it is meaningless inside an extension.
const body = src.replace(/\/\/ ==UserScript==[\s\S]*?\/\/ ==\/UserScript==\r?\n*/, '');

const header = '// AUTO-GENERATED from ../userscript/x-follow-cleaner.user.js — do not edit directly.\n'
  + '// Edit the userscript, then run: node extension/build.mjs\n\n';

writeFileSync(join(dir, 'content.js'), header + body);
console.log('extension/content.js synced from x-follow-cleaner.user.js');
