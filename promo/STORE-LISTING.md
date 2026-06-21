# Chrome Web Store — submission kit

Everything you need to paste into the Chrome Web Store developer dashboard. Two languages
provided; the dashboard lets you set a default language and add localized listings.

> ⚠️ **Approval is not guaranteed.** See "Rejection risks" at the bottom. The copy below is
> deliberately worded to lower those risks (manual, local-only, rate-limited, non-affiliated).

---

## 0. Before you start

- **One-time US$5 developer registration fee** (Chrome Web Store Developer account).
- Upload the packaged ZIP: `dist/x-follow-cleaner-extension.zip` (build command at the bottom).
- Have the **privacy policy URL** ready:
  `https://github.com/jackdaidai/x-follow-cleaner/blob/main/PRIVACY.md`
- Listing assets (in `promo/`):
  - Screenshots (1280×800): `store-screenshot-1.png`, `store-screenshot-2.png`
  - Small promo tile (440×280, optional): `store-promo-tile-440x280.png`
  - Store icon (128×128) is already inside the extension: `extension/icons/icon128.png`

---

## 1. Item name

Recommended (lower trademark risk than "X 助手"):

- **EN:** `Follow Cleaner for X — local & open source`
- **ZH:** `互关清理助手 for X（本地·开源）`

> Avoid implying you ARE X. "for X" + the non-affiliation note in the description is the
> safer framing.

## 2. Summary (short description, ≤ 132 chars)

- **EN:** `Find who doesn't follow you back on X, then review & batch-unfollow — or batch-follow from any followers list. 100% local.`
- **ZH:** `找出 X 上没回关你的账号，逐个查看并批量取关；也能从任意粉丝列表批量关注。纯本地运行，不登录、不上传。`

## 3. Category

`Social & Communication` (alt: `Workflow & Planning`).

## 4. Detailed description

### English

```
Follow Cleaner for X is a local-first tool for tidying up your X / Twitter follow
relationships. Everything runs in your own browser — no backend, no login, no data leaves
your machine.

WHAT IT DOES
• Clean non-mutual follows — scan your Following list (auto-scrolls to load everyone) and see
  exactly who does NOT follow you back. Detected from the "Follows you" label X already shows.
• Whitelist anyone you want to keep — whitelisted accounts are never unfollowed.
• Batch unfollow — select accounts, set a batch size and delay, then unfollow on your terms.
• Follow / follow-back — scan any account's Followers or Verified followers and batch-follow
  the ones you choose (your own followers to follow back, or anyone else's to discover people).
• Import / export your whitelist (JSON or one @handle per line) and export the non-mutual list.

PRIVACY BY DESIGN
• 100% local — no server, no analytics, no tracking, no account.
• All state (whitelist, selections, progress) lives only in your browser's localStorage.
• Reads only the Following/Followers lists you open, and never sends them anywhere.

YOU ARE IN CONTROL
• Nothing happens automatically. Follow/unfollow only run after you select accounts and click
  Start. Start with a batch size of 1 to confirm behavior on your account.
• Adjustable delay (default 4500 ms) helps you stay within reasonable limits.
• Please use it responsibly and within X's Terms of Service. Aggressive batch actions can get
  any account rate-limited or restricted — go slow.

OPEN SOURCE
Source code: https://github.com/jackdaidai/x-follow-cleaner

Not affiliated with, endorsed by, or sponsored by X Corp. "X" and "Twitter" are trademarks of
their respective owners.
```

### 简体中文

```
互关清理助手 是一个本地优先的 X / Twitter 关注管理工具。所有功能都在你自己的浏览器里运行——
无后端、无需登录、数据不出本机。

功能
• 清理未互关——扫描你的「正在关注」列表（自动下滑加载全部），精确列出没有回关你的账号。
  判断依据是 X 自己显示的「关注了你」标签。
• 白名单保护——把想保留的账号加入白名单，白名单内的账号绝不会被取关。
• 批量取关——勾选账号，设置本次数量与间隔，按你的节奏取关。
• 关注 / 回关——扫描任意账号的「所有关注者」或「认证关注者」，批量关注你选中的账号
  （自己的粉丝用来回关，别人的粉丝用来发现优质账号）。
• 白名单支持 JSON 或每行一个 @用户名 导入 / 导出；未互关列表可导出。

隐私设计
• 纯本地——无服务器、无统计、无追踪、无账号。
• 所有状态（白名单、勾选、进度）只保存在浏览器的 localStorage。
• 只读取你打开的关注/粉丝列表，且绝不上传到任何地方。

完全可控
• 不会自动执行。只有在你勾选账号并点击「开始」后才会关注/取关。建议先用「数量=1」试一次。
• 可调间隔（默认 4500 毫秒），帮助你保持合理频率。
• 请负责任地使用，并遵守 X 的服务条款。频繁的批量操作可能导致任何账号被限流或限制——悠着用。

开源
源代码：https://github.com/jackdaidai/x-follow-cleaner

本扩展与 X Corp. 无任何隶属、背书或赞助关系。「X」「Twitter」为各自所有者的商标。
```

---

## 5. Privacy practices tab (this is where most reviews get stuck — fill carefully)

**Single purpose description:**
```
A local tool that helps the user review and manage their own X / Twitter following and
follower lists — identifying accounts that don't follow back, maintaining a whitelist, and
performing user-initiated batch follow/unfollow actions. All processing is local to the
browser; no data is collected or transmitted.
```

**Permission justification — host access to x.com / twitter.com:**
```
The extension injects its UI panel and reads the already-visible account list on the user's
own Following / Followers / Verified followers pages on x.com and twitter.com. This host
access is the minimum required to function. No other hosts are accessed and no other
permissions are requested.
```

**Are you using remote code?** → **No.** (`content.js` is bundled; nothing is fetched/eval'd remotely.)

**Data usage / certification — declare you collect NONE of these:**
- Personally identifiable information → No
- Health, financial, authentication info → No
- Personal communications → No
- Location → No
- Web history / activity → No
- Website content → No (lists are read transiently in-page and never sent off-device)

Check all three certification boxes:
- ✅ I do not sell or transfer user data to third parties (outside approved use cases)
- ✅ I do not use or transfer user data for purposes unrelated to the item's single purpose
- ✅ I do not use or transfer user data to determine creditworthiness or for lending

**Privacy policy URL:** `https://github.com/jackdaidai/x-follow-cleaner/blob/main/PRIVACY.md`

---

## 6. Rejection risks (read before submitting)

1. **Automation / platform-manipulation policy.** Extensions that automate follow/unfollow on
   a third-party site are sometimes rejected or removed under Chrome's spam/manipulation rules
   and/or because they may violate X's ToS. The copy above stresses *manual selection,
   local-only, rate-limited, user-initiated* — that's your best defense, but it may still be
   flagged. Be ready for a possible rejection and a back-and-forth appeal.
2. **Trademark / impersonation.** Using "X" in the name and an X-like icon can trigger a
   trademark flag. Mitigations applied: "for X" naming, explicit non-affiliation line, and a
   neutral mark. If rejected on this, rename to something generic (e.g. "Mutual Follow Cleaner")
   and replace the icon with a non-logo glyph.
3. **Minimum functionality / quality.** Single-panel tools are fine, but make sure the listing
   screenshots clearly show real functionality (the two provided do).

If it gets rejected: the userscript + "load unpacked" extension tracks already work and need no
review — that's your fallback distribution while you appeal or adjust.
```
