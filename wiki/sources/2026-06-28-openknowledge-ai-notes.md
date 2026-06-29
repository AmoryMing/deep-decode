---
title: OpenKnowledge——为 agent 重做的开源 markdown 知识库（inkeep/open-knowledge）
type: source
created: 2026-06-28
updated: 2026-06-28
tags: [openknowledge, inkeep, ai-first, markdown, obsidian, notion, mcp, knowledge-base, local-first, open-source]
---

## 核心论点

OpenKnowledge（`inkeep/open-knowledge`，官网 openknowledge.ai）是 Inkeep 在 2026 年 6 月开源的"AI-native markdown editor and LLM Wiki"。它和"给 Obsidian/Notion 加个 AI 插件"的根本区别在架构层：

- **数据层**：纯 markdown / mdx 文件，git 版本管理，作为唯一真相（source of truth）。
- **编辑层**：真·所见即所得（WYSIWYG），改 markdown 像改 Google Doc/Notion；支持 interactive HTML/JS、Mermaid、LaTeX、视频、PDF；带 file navigator、search、tabs、graph wiki link viewer。
- **Agent 工具层**：开箱即用的 MCP + skills，专门让 agent 能搜索、吸收、组织、维护这套知识库。

关键事实：**它自己不带模型**。官网原话 "The platform does not bundle its own model—it relies on external agents you already use."（Claude / Cursor / Codex / OpenCode，走 MCP/CLI）。所以"AI-first"不是内置一个 AI，而是把笔记重做成 agent 可读可写的对象。一句话定位："Think of it as Notion meets VSCode."

## 关键事实（带出处）

- GitHub：1,382 stars / 57 forks / 7 open issues（2026-06-28 API 快照）；许可 GPL-3.0；主语言 TypeScript（约 97.8%）；仓库建于 2026-06-03，仍高频 push。[GitHub API]
- 安装：`npm install -g @inkeep/open-knowledge` → `ok init`（脚手架并接好 Claude Code/Cursor/Codex）→ `ok start --open`。[README]
- 平台：macOS 有原生 app（DMG，含 TUI）；Linux/Windows/Intel Mac 只有 web app + CLI（Node.js 24+）。全平台桌面"在路上"。[README + HN]
- 兼容 Obsidian：作者 HN 原话"Obsidian 本质就是 markdown，可以直接用 OpenKnowledge 打开一个 Obsidian vault"；但 dataview/插件生态不支持。[HN]
- 同步：git/GitHub auto-sync；中心化 CRDT server 选项在路上。[README + HN]
- 母公司 Inkeep：YC 出身，融 $13M 种子轮（Khosla Ventures / GreatPoint Ventures / Y Combinator 领投），主业给团队建客服/运营 AI agent，客户含 Anthropic、Midjourney、PostHog、Postman、Clay；创始人 CEO Nick Gomez（HN id engomez）、CTO Robert Tran，均 MIT。[Inkeep blog + YC]
- Show HN：2026-06-25 由 engomez 发布，372 分。[HN Algolia]

## 金句（英文附译）

- "A beautiful markdown editor with integrations with Claude, Codex, and other harnesses. ... Private, local, and free." —— 一个漂亮的 markdown 编辑器，原生接好 Claude、Codex 等各种 agent……私有、本地、免费。
- "The platform does not bundle its own model—it relies on external agents you already use." —— 它不自带模型，靠你本来就在用的外部 agent。
- "there genuinely ought to be consequences for using 'open source' in the context of something like this tied to proprietary AI services." —— 把"开源"用在一个绑死专有 AI 服务的东西上，真该付出点代价。（HN 批评）
- "I just open the Obsidian folder in VS Code and BOOM, it is AI friendly." —— 我直接拿 VS Code 打开 Obsidian 文件夹，BOOM，它就对 AI 友好了。（HN 质疑差异化）

## 可写角度

1. **AI-first 在架构层而非功能层**：插件式 AI = 把 AI 嫁接在面向人的数据结构上；OpenKnowledge = 数据结构本身（纯 md + MCP 工具层）为 agent 设计。这是主角度。
2. **"开源外壳 + 专有大脑"的悖论**：开源的是编辑器，干活的智能仍是闭源模型；本地优先只对文件成立，对 AI 能力不成立。
3. **Inkeep 的算盘**：一家做团队 AI agent 的 YC 公司，开源一个"喂给 agent 的知识库前端"，是分发渠道还是战略护城河。

## 信源

1. [inkeep/open-knowledge (GitHub)](https://github.com/inkeep/open-knowledge) — 一手
2. [OpenKnowledge Docs · Overview](https://openknowledge.ai/docs/get-started/overview) — 一手
3. [Show HN: OpenKnowledge (Hacker News)](https://news.ycombinator.com/item?id=48675435) — 一手（作者本人发言）
4. [GitHub REST API: repos/inkeep/open-knowledge](https://api.github.com/repos/inkeep/open-knowledge) — 一手（star/license/语言数据）
5. [Inkeep $13M 种子轮博客](https://inkeep.com/blog/inkeep-funding-announcement) — 一手（母公司背景）
6. [Inkeep · Y Combinator](https://www.ycombinator.com/companies/inkeep) — 二手
7. [PromptZone: OpenKnowledge 文](https://www.promptzone.com/elena_rodriguez_f2229f9e/openknowledge-open-source-ai-note-taking-tool-5gal) — 二手，**与一手矛盾，仅作反面参照，架构描述未采用**
