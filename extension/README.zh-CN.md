# X 互关与关注助手 — Chrome 扩展

独立的 Manifest V3 线路，无需 Tampermonkey。工具的功能、使用方法和安全说明见
[项目根 README](../README.zh-CN.md)。

[English](README.md) | 简体中文

## 安装（加载已解压）

1. 下载或克隆本仓库。
2. 打开 `chrome://extensions`，开启右上角的**开发者模式**。
3. 点击**加载已解压的扩展程序**，选择本 `extension/` 目录。
4. 打开任意 X 页面，右上角会出现面板。

## 文件

| 文件 | 用途 |
|---|---|
| `manifest.json` | MV3 清单（匹配 x.com / twitter.com，无额外权限） |
| `content.js` | 工具本体——**自动生成**，请勿直接编辑 |
| `build.mjs` | 从 `../userscript/x-follow-cleaner.user.js` 重新生成 `content.js` |
| `icons/` | 16 / 48 / 128 px 图标 |

## 更新

逻辑都在 userscript 里。修改 `../userscript/x-follow-cleaner.user.js` 后，重新同步扩展：

```
node extension/build.mjs
```
