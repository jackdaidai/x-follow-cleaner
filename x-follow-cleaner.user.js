// ==UserScript==
// @name         X Follow Cleaner Local
// @namespace    local.x.follow.cleaner
// @version      0.3.0
// @description  Local-first X following cleaner with whitelist import/export and limited unfollow batches.
// @author       baor87492-star
// @match        https://x.com/*
// @match        https://twitter.com/*
// @downloadURL  https://raw.githubusercontent.com/baor87492-star/x-follow-cleaner/main/x-follow-cleaner.user.js
// @updateURL    https://raw.githubusercontent.com/baor87492-star/x-follow-cleaner/main/x-follow-cleaner.user.js
// @grant        none
// @run-at       document-idle
// ==/UserScript==

(function () {
  'use strict';

  const STORAGE_KEY = 'x-follow-cleaner-state-v1';
  const UI_ID = 'xfc-panel';
  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  let scanMap = new Map();
  let scanning = false;
  let unfollowing = false;

  const zh = {
    followsYou: '\u5173\u6ce8\u4e86\u4f60',
    following: '\u6b63\u5728\u5173\u6ce8',
    unfollow: '\u53d6\u5173',
    verified: '\u8ba4\u8bc1\u8d26\u53f7',
  };

  function normalizeHandle(value) {
    if (!value) return '';
    const raw = String(value).trim();
    const urlMatch = raw.match(/(?:x|twitter)\.com\/([A-Za-z0-9_]+)/i);
    const handle = urlMatch ? urlMatch[1] : raw.replace(/^@/, '').split(/[,\s]/)[0];
    return handle.replace(/[^A-Za-z0-9_]/g, '').toLowerCase();
  }

  function isFollowingPage(url = location.href) {
    try {
      const parsed = new URL(url);
      return /^(x|twitter)\.com$/i.test(parsed.hostname) && /^\/[A-Za-z0-9_]+\/following\/?$/.test(parsed.pathname);
    } catch {
      return false;
    }
  }

  function getFollowingUrl(handle) {
    const clean = normalizeHandle(handle);
    return clean ? `https://x.com/${clean}/following` : '';
  }

  function inferHandleFromPage() {
    const pathMatch = location.pathname.match(/^\/([A-Za-z0-9_]+)/);
    const reserved = new Set(['home', 'explore', 'notifications', 'messages', 'i', 'settings', 'compose', 'search']);
    if (pathMatch && !reserved.has(pathMatch[1])) return pathMatch[1];
    return '';
  }

  function loadState() {
    try {
      const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY));
      return {
        keep: parsed?.keep || [],
        selected: parsed?.selected || [],
        done: parsed?.done || [],
        batchSize: parsed?.batchSize || 10,
        delayMs: parsed?.delayMs || 4500,
      };
    } catch {
      return { keep: [], selected: [], done: [], batchSize: 10, delayMs: 4500 };
    }
  }

  function saveState(state) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }

  function stateSets() {
    const state = loadState();
    return {
      state,
      keep: new Set(state.keep.map(normalizeHandle)),
      selected: new Set(state.selected.map(normalizeHandle)),
      done: new Set(state.done.map(normalizeHandle)),
    };
  }

  function persistSets({ keep, selected, done, batchSize, delayMs }) {
    const old = loadState();
    saveState({
      keep: [...keep].filter(Boolean).sort(),
      selected: [...selected].filter(Boolean).sort(),
      done: [...done].filter(Boolean).sort(),
      batchSize: Number(batchSize || old.batchSize || 10),
      delayMs: Number(delayMs || old.delayMs || 4500),
    });
  }

  function parseVisibleAccounts() {
    const accounts = [];
    document.querySelectorAll('[data-testid="UserCell"]').forEach((cell) => {
      const text = cell.innerText || '';
      const link = [...cell.querySelectorAll('a[href^="/"]')].find((anchor) => /^\/[A-Za-z0-9_]+$/.test(anchor.getAttribute('href') || ''));
      if (!link) return;
      const handle = normalizeHandle(link.getAttribute('href'));
      if (!handle) return;
      const lines = text.split('\n').map((line) => line.trim()).filter(Boolean);
      const handleIndex = lines.findIndex((line) => normalizeHandle(line) === handle || line.toLowerCase() === `@${handle}`);
      const name = handleIndex > 0 ? lines[handleIndex - 1] : lines[0] || '';
      accounts.push({
        handle,
        name: name.replace(new RegExp(zh.verified, 'g'), '').trim(),
        followsYou: text.includes(zh.followsYou) || /follows you/i.test(text),
      });
    });
    return accounts;
  }

  function mergeAccounts(accounts) {
    accounts.forEach((account) => {
      const handle = normalizeHandle(account.handle);
      if (!handle) return;
      const old = scanMap.get(handle) || { handle, name: '', followsYou: false };
      if (account.name && !old.name) old.name = account.name;
      old.followsYou = old.followsYou || Boolean(account.followsYou);
      scanMap.set(handle, old);
    });
  }

  function getNonMutual() {
    const { keep, done } = stateSets();
    return [...scanMap.values()]
      .filter((account) => !account.followsYou)
      .filter((account) => !keep.has(account.handle))
      .filter((account) => !done.has(account.handle))
      .sort((a, b) => a.handle.localeCompare(b.handle));
  }

  function injectStyles() {
    if (document.querySelector('#xfc-style')) return;
    const style = document.createElement('style');
    style.id = 'xfc-style';
    style.textContent = `
      #${UI_ID}{position:fixed;right:16px;top:78px;z-index:2147483647;width:380px;max-height:82vh;color:#172033;background:#fff;border:1px solid #d8dee8;border-radius:8px;box-shadow:0 12px 36px rgba(15,23,42,.18);font:13px/1.45 Arial,sans-serif;overflow:hidden}
      #${UI_ID}.minimized .xfc-body{display:none} #${UI_ID} *{box-sizing:border-box}
      .xfc-head{display:flex;justify-content:space-between;align-items:center;padding:10px 12px;background:#172033;color:#fff}.xfc-title{font-weight:700}
      .xfc-head button,.xfc-actions button,.xfc-row button{border:0;border-radius:6px;padding:6px 9px;cursor:pointer;font-weight:700}.xfc-head button{background:#2a3448;color:#fff}
      .xfc-body{padding:12px;display:grid;gap:10px}.xfc-route{display:grid;gap:8px;padding:8px;border:1px solid #f0d58b;background:#fff8e6;border-radius:6px}.xfc-open-row{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:8px}.xfc-open-row input,.xfc-controls input{min-width:0;border:1px solid #d8dee8;border-radius:6px;padding:7px}.xfc-open-row button{border:0;border-radius:6px;padding:7px 10px;background:#1264d8;color:#fff;font-weight:700;cursor:pointer}
      .xfc-stats{display:grid;grid-template-columns:repeat(3,1fr);gap:6px}.xfc-stat{background:#f5f7fb;border:1px solid #e4e8f0;border-radius:6px;padding:7px}.xfc-stat strong{display:block;font-size:17px}
      .xfc-controls{display:grid;grid-template-columns:1fr 1fr;gap:8px}.xfc-controls label{display:grid;gap:4px;font-weight:700}.xfc-actions{display:flex;flex-wrap:wrap;gap:6px}.xfc-actions button{background:#1264d8;color:#fff}.xfc-actions button:disabled{background:#cbd5e1;color:#64748b;cursor:not-allowed}.xfc-actions button.secondary{background:#e9eef8;color:#18375f}.xfc-actions button.danger{background:#c9342f;color:#fff}
      .xfc-list{border:1px solid #e4e8f0;border-radius:6px;max-height:280px;overflow:auto}.xfc-row{display:grid;grid-template-columns:minmax(0,1fr) auto auto;gap:6px;align-items:center;padding:8px;border-bottom:1px solid #edf1f7}.xfc-row:last-child{border-bottom:0}.xfc-name{overflow-wrap:anywhere}.xfc-name a{color:#1264d8;text-decoration:none;font-weight:700}.xfc-row button.keep{background:#e9eef8;color:#18375f}.xfc-row button.pick{background:#fff0ef;color:#c9342f;border:1px solid #f2b7b4}.xfc-row button.pick.active{background:#c9342f;color:#fff}.xfc-log{color:#667085;min-height:18px}
    `;
    document.head.append(style);
  }

  function render() {
    injectStyles();
    let panel = document.querySelector(`#${UI_ID}`);
    if (!panel) {
      panel = document.createElement('section');
      panel.id = UI_ID;
      document.body.append(panel);
    }
    const { state, keep, selected } = stateSets();
    const all = [...scanMap.values()];
    const nonMutual = getNonMutual();
    const onFollowingPage = isFollowingPage();
    const inferredHandle = inferHandleFromPage();
    const rows = nonMutual.slice(0, 80).map((account) => `
      <div class="xfc-row" data-handle="${account.handle}">
        <div class="xfc-name">${escapeHtml(account.name || '-')}<br><a href="https://x.com/${account.handle}" target="_blank">@${account.handle}</a></div>
        <button class="keep" data-act="keep">Keep</button>
        <button class="pick ${selected.has(account.handle) ? 'active' : ''}" data-act="pick">${selected.has(account.handle) ? 'Picked' : 'Unfollow'}</button>
      </div>`).join('');

    panel.innerHTML = `
      <div class="xfc-head"><span class="xfc-title">X Follow Cleaner</span><button data-act="minimize">Hide</button></div>
      <div class="xfc-body">
        ${onFollowingPage ? '' : `<div class="xfc-route"><div class="xfc-log">Not on a following page. Enter a handle and open it.</div><div class="xfc-open-row"><input id="xfc-handle-input" placeholder="@your_handle" value="${escapeHtml(inferredHandle ? `@${inferredHandle}` : '')}"><button data-act="open-following">Open</button></div></div>`}
        <div class="xfc-stats"><div class="xfc-stat"><strong>${all.length}</strong>Scanned</div><div class="xfc-stat"><strong>${nonMutual.length}</strong>Non-mutual</div><div class="xfc-stat"><strong>${keep.size}</strong>Whitelist</div></div>
        <div class="xfc-controls"><label>Batch size<input id="xfc-batch" type="number" min="1" max="100" value="${state.batchSize}"></label><label>Delay ms<input id="xfc-delay" type="number" min="2000" max="60000" step="500" value="${state.delayMs}"></label></div>
        <div class="xfc-actions"><button data-act="scan" ${onFollowingPage ? '' : 'disabled'}>Scan</button><button class="secondary" data-act="select-all">Pick all</button><button class="secondary" data-act="export-keep">Export whitelist</button><button class="secondary" data-act="import-keep">Import whitelist</button><button class="secondary" data-act="export-nonmutual">Export non-mutual</button><button class="danger" data-act="unfollow" ${onFollowingPage ? '' : 'disabled'}>Start unfollow</button><button class="danger" data-act="stop">Stop</button></div>
        <div class="xfc-list">${rows || '<div class="xfc-row"><div class="xfc-name">No non-mutual accounts scanned yet.</div></div>'}</div>
        <div class="xfc-log" id="xfc-log">${onFollowingPage ? 'All data stays in this browser.' : 'Open a following page to enable scanning.'}</div>
      </div>`;
    bindPanel(panel);
  }

  function bindPanel(panel) {
    panel.querySelectorAll('button[data-act]').forEach((button) => button.addEventListener('click', () => handleAction(button.dataset.act, button.closest('[data-handle]')?.dataset.handle)));
    panel.querySelector('#xfc-batch')?.addEventListener('change', persistControlValues);
    panel.querySelector('#xfc-delay')?.addEventListener('change', persistControlValues);
  }

  function persistControlValues() {
    const { keep, selected, done } = stateSets();
    persistSets({ keep, selected, done, batchSize: document.querySelector('#xfc-batch')?.value, delayMs: document.querySelector('#xfc-delay')?.value });
  }

  async function handleAction(action, handle) {
    if (action === 'minimize') return document.querySelector(`#${UI_ID}`)?.classList.toggle('minimized');
    if (action === 'open-following') return openFollowingPage();
    if (action === 'scan') return scanFollowing();
    if (action === 'stop') { scanning = false; unfollowing = false; return log('Stop requested.'); }
    if (action === 'keep') return keepHandle(handle);
    if (action === 'pick') return togglePick(handle);
    if (action === 'select-all') return selectAllNonMutual();
    if (action === 'export-keep') return downloadJson('x-follow-cleaner-keep.json', stateSets().state.keep);
    if (action === 'import-keep') return importKeepPrompt();
    if (action === 'export-nonmutual') return downloadJson('x-follow-cleaner-non-mutual.json', getNonMutual());
    if (action === 'unfollow') return startUnfollow();
  }

  function openFollowingPage() {
    const input = document.querySelector('#xfc-handle-input')?.value || inferHandleFromPage();
    const url = getFollowingUrl(input);
    if (!url) return log('Enter a handle, for example @Ryan61257127.');
    location.href = url;
  }

  async function scanFollowing() {
    if (scanning) return;
    scanning = true;
    log('Scanning and scrolling...');
    let staleRounds = 0;
    let previousSize = scanMap.size;
    for (let round = 0; round < 240 && scanning; round += 1) {
      mergeAccounts(parseVisibleAccounts());
      staleRounds = scanMap.size === previousSize ? staleRounds + 1 : 0;
      previousSize = scanMap.size;
      render();
      log(`Scanning: ${scanMap.size} accounts, ${getNonMutual().length} non-mutual.`);
      if (staleRounds >= 12 && round > 15) break;
      window.scrollBy(0, Math.floor(window.innerHeight * 0.9));
      await sleep(900);
    }
    mergeAccounts(parseVisibleAccounts());
    scanning = false;
    render();
    log(`Done: ${scanMap.size} accounts, ${getNonMutual().length} non-mutual.`);
  }

  function keepHandle(handle) {
    const { keep, selected, done } = stateSets();
    keep.add(normalizeHandle(handle));
    selected.delete(normalizeHandle(handle));
    persistSets({ keep, selected, done });
    render();
  }

  function togglePick(handle) {
    const { keep, selected, done } = stateSets();
    const clean = normalizeHandle(handle);
    selected.has(clean) ? selected.delete(clean) : selected.add(clean);
    persistSets({ keep, selected, done });
    render();
  }

  function selectAllNonMutual() {
    const { keep, selected, done } = stateSets();
    getNonMutual().forEach((account) => selected.add(account.handle));
    persistSets({ keep, selected, done });
    render();
  }

  function importKeepPrompt() {
    const input = prompt('Paste whitelist JSON array or one @handle per line:');
    if (input == null) return;
    const imported = importKeepList(input);
    const { keep, selected, done } = stateSets();
    imported.forEach((handle) => { keep.add(handle); selected.delete(handle); });
    persistSets({ keep, selected, done });
    render();
    log(`Imported ${imported.length} whitelist handles.`);
  }

  function importKeepList(text) {
    const raw = String(text || '').trim();
    if (!raw) return [];
    let values;
    try {
      const parsed = JSON.parse(raw);
      values = Array.isArray(parsed) ? parsed : parsed.keep || parsed.handles || [];
    } catch {
      values = raw.split(/\r?\n/);
    }
    return [...new Set(values.map(normalizeHandle).filter(Boolean))].sort();
  }

  async function startUnfollow() {
    if (unfollowing) return;
    persistControlValues();
    const { state, selected, done, keep } = stateSets();
    const queue = getNonMutual().filter((account) => selected.has(account.handle)).filter((account) => !done.has(account.handle)).filter((account) => !keep.has(account.handle)).slice(0, Number(state.batchSize || 10));
    if (!queue.length) return log('No selected accounts. Pick accounts first.');
    unfollowing = true;
    for (const account of queue) {
      if (!unfollowing) break;
      const ok = await unfollowHandle(account.handle);
      const latest = stateSets();
      if (ok) { latest.done.add(account.handle); latest.selected.delete(account.handle); persistSets(latest); }
      render();
      log(`${ok ? 'Processed' : 'Button not found'} @${account.handle}`);
      await sleep(Number(loadState().delayMs || 4500));
    }
    unfollowing = false;
    render();
    log('Batch complete.');
  }

  async function unfollowHandle(handle) {
    const cell = findUserCell(normalizeHandle(handle));
    if (!cell) return false;
    cell.scrollIntoView({ block: 'center' });
    await sleep(600);
    const followButton = [...cell.querySelectorAll('button[role="button"], div[role="button"]')].find((button) => {
      const text = button.innerText || button.getAttribute('aria-label') || '';
      return text.includes(zh.following) || /following/i.test(text);
    });
    if (!followButton) return false;
    followButton.click();
    await sleep(900);
    const confirm = [...document.querySelectorAll('button[role="button"], div[role="button"]')].find((button) => {
      const text = button.innerText || button.getAttribute('aria-label') || '';
      return text.includes(zh.unfollow) || /unfollow/i.test(text);
    });
    if (!confirm) return false;
    confirm.click();
    return true;
  }

  function findUserCell(handle) {
    return [...document.querySelectorAll('[data-testid="UserCell"]')].find((cell) => [...cell.querySelectorAll('a[href^="/"]')].some((anchor) => normalizeHandle(anchor.getAttribute('href')) === handle));
  }

  function downloadJson(filename, value) {
    const url = URL.createObjectURL(new Blob([JSON.stringify(value, null, 2)], { type: 'application/json;charset=utf-8' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  }

  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' })[char]);
  }

  function log(message) {
    const node = document.querySelector('#xfc-log');
    if (node) node.textContent = message;
  }

  render();
})();