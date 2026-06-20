# Privacy Policy — Follow Cleaner for X

_Last updated: 2026-06-20_

This Chrome extension ("the extension") is a local-first tool that helps you review and
manage your own X / Twitter following and follower lists. This policy explains exactly what
it does and does not do with your data.

## Summary

**The extension does not collect, transmit, sell, or share any of your data.** Everything it
does happens locally inside your own browser. There is no backend server, no analytics, no
tracking, and no account or login.

## What the extension accesses

To do its job, the extension runs only on `x.com` and `twitter.com` pages and reads
information that is **already visible to you on the page you opened**, such as:

- The account names and `@handles` shown on a Following / Followers / Verified followers list.
- The "Follows you" label that X displays, used to detect mutual relationships.

This information is read in your browser to build the on-screen list. It is **never sent
anywhere**.

## What the extension stores

The extension saves a small amount of state in your browser's local `localStorage`, on your
device only:

- Your whitelist (accounts you choose to keep).
- Your current selections and batch progress.
- Your batch-size and delay settings.

This data never leaves your browser. You can clear it at any time from your browser settings,
or by clearing the site's local storage.

## What the extension does NOT do

- It does **not** send any data to the developer or any third party.
- It does **not** use remote servers, analytics, advertising, or tracking.
- It does **not** read or store your password, DMs, payment info, or any data outside the
  Following/Followers lists you open.
- It does **not** run in the background or on any site other than X / Twitter.

## Actions you trigger

Following and unfollowing only happen after you select accounts and explicitly click the
Start button. The extension automates clicks you could perform yourself, at a rate you
control. You are responsible for using it within X's Terms of Service and rate limits.

## Permissions

- **Host access to `x.com` / `twitter.com`** — required to inject the panel and read the
  visible lists on those pages. No other host or permission is requested.

## Affiliation

This is an independent, open-source project. It is **not affiliated with, endorsed by, or
sponsored by X Corp. or Twitter**. "X" and "Twitter" are trademarks of their respective
owners and are used only to describe what the extension works with.

## Contact

Source code and issues: https://github.com/jackdaidai/x-follow-cleaner
