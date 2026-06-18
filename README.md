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
- Lists only the accounts that **don't follow you back**.
- Whitelist anyone you want to keep — whitelisted accounts are never unfollowed.
- Select accounts, set a batch size and delay, then batch-unfollow.

### 2. Follow / follow back
- Scans any account's **Followers** or **Verified followers** page — your own (follow back) or another user's (plain follow).
- Lists accounts you can follow.
- Select accounts and batch-follow with the same batch size / delay controls.

### Whitelist & export
- Import / export your whitelist as JSON or one `@handle` per line.
- Export the non-mutual list as JSON.

## Install

1. Install [Tampermonkey](https://www.tampermonkey.net/).
2. Open the script:
   https://raw.githubusercontent.com/jackdaidai/x-follow-cleaner/main/x-follow-cleaner.user.js
3. Click **Install** in Tampermonkey.
4. Open any X page — the panel appears at the top-right.

## Usage

1. Enter a handle (yours or anyone's) and open the **Following**, **All followers**,
   or **Verified followers** page.
2. Click **Scan** and let it scroll to the bottom.
3. Switch views: **non-mutual** / **verified follow** / **all follow**.
4. Pick accounts (or **Select all**), set **batch size** and **delay (ms)**,
   then **Start unfollow** or **Start follow**. **Stop** aborts a running batch.

Tips:
- **batch size** caps how many accounts each run processes; **delay (ms)** is the wait
  between actions — keep it generous (default 4500 ms) to avoid rate limits.
- The result list takes up about half the panel and scrolls on its own; the panel
  body scrolls to reach the controls above it.

## Safety

- Unfollow and follow only run after you select accounts and click
  **Start unfollow** or **Start follow**.
- Start with a batch size of **1** to confirm it behaves correctly on your account.
- All state (whitelist, selections, progress) lives in your browser's `localStorage`
  only.
