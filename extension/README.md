# X Follow Cleaner — Chrome extension

The standalone Manifest V3 track — no Tampermonkey required. See the
[project README](../README.md) for what the tool does, usage, and safety notes.

English | [简体中文](README.zh-CN.md)

## Install (load unpacked)

1. Download or clone this repository.
2. Open `chrome://extensions` and enable **Developer mode** (top-right).
3. Click **Load unpacked** and select this `extension/` folder.
4. Open any X page — the panel appears at the top-right.

## Files

| File | Purpose |
|---|---|
| `manifest.json` | MV3 manifest (matches x.com / twitter.com, no extra permissions) |
| `content.js` | the tool — **generated**, do not edit directly |
| `build.mjs` | regenerates `content.js` from `../userscript/x-follow-cleaner.user.js` |
| `icons/` | 16 / 48 / 128 px icons |

## Updating

The logic lives in the userscript. After editing
`../userscript/x-follow-cleaner.user.js`, re-sync the extension:

```
node extension/build.mjs
```
