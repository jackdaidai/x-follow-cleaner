# X Follow Cleaner Local

English | [简体中文](README.zh-CN.md)

A local-first Tampermonkey userscript for cleaning up and managing your X / Twitter
following and follower lists. It runs entirely in your browser — no backend, no
account login, and no data leaves your machine.

## What it does

A panel appears on x.com / twitter.com with two workflows:

### 1. Clean non-mutual follows
- Scans your **Following** page (auto-scrolls to load everyone).
- Detects mutual accounts from the `Follows you` label X shows.
- Lists only the accounts that **don't follow you back** (未互关).
- Whitelist anyone you want to keep — whitelisted accounts are never unfollowed.
- Select accounts, set a batch size and delay, then batch-unfollow.

### 2. Follow back
- Scans your **Followers** or **Verified followers** page.
- Lists accounts you can **follow back** (可回关).
- Select accounts and batch follow-back with the same batch size / delay controls.

### Whitelist & export
- Import / export your whitelist as JSON or one `@handle` per line.
- Export the non-mutual list as JSON.

## Install

1. Install [Tampermonkey](https://www.tampermonkey.net/).
2. Open the script:
   https://raw.githubusercontent.com/jackdaidai/x-follow-cleaner/main/x-follow-cleaner.user.js
3. Click **Install** in Tampermonkey.
4. Open any X page — the **X 互关清理助手** panel appears at the top-right.

## Usage

1. Enter your handle (or open it from your own profile) and click
   **打开正在关注 / 打开所有关注者 / 打开认证关注者** to go to the right page.
2. Click **扫描** (Scan) and let it scroll to the bottom.
3. Switch lists with **查看未互关 / 查看认证回关 / 查看全部回关**.
4. Pick accounts (or **全选**), set **本次数量** (batch size) and **间隔毫秒** (delay),
   then **开始取关 / 开始回关**. **停止** aborts a running batch.

Tips:
- **本次数量** caps how many accounts each run processes; **间隔毫秒** is the wait
  between actions — keep it generous (default 4500 ms) to avoid rate limits.
- The result list takes up about half the panel and scrolls on its own; the panel
  body scrolls to reach the controls above it.

## Safety

- Unfollow and follow-back only run after you select accounts and click
  **开始取关 / 开始回关**.
- Start with a batch size of **1** to confirm it behaves correctly on your account.
- All state (whitelist, selections, progress) lives in your browser's `localStorage`
  only.
