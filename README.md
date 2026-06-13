# X Follow Cleaner Local

A local-first Tampermonkey userscript for organizing X/Twitter following lists.

## Features

- Runs directly in your browser on x.com / twitter.com.
- Scans your following page by scrolling.
- Detects mutual accounts by reading the `Follows you` / Chinese `follows you` label shown by X.
- Shows only non-mutual accounts.
- Supports a local whitelist.
- Whitelist import and export are supported.
- Exports the non-mutual list as JSON.
- Optional limited batch unfollow: you select accounts, set batch size and delay, then click start.
- No backend. Data stays in browser localStorage.

## Install

1. Install Tampermonkey.
2. Open this script URL:

https://raw.githubusercontent.com/baor87492-star/x-follow-cleaner/main/x-follow-cleaner.user.js

3. Click Install in Tampermonkey.
4. Open any X page. The panel appears on the page.
5. If you are not on a following page, enter your handle and click Open.
6. Click Scan on the following page.

## Safety

This script can perform real unfollow actions only after you select accounts and click `Start unfollow`.
Start with batch size 1 to verify behavior on your own account.
