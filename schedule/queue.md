---
title: 待写队列
type: schedule
updated: 2026-05-11
---

# 待写队列

> 未开工的选题。按优先级排序。从这里挑一条 → 移到 `in-progress.md` → 开写。

## 手动选题

| 优先级 | slug / 选题 | 类型 | 套件 | 计划周 | 来源 | 备注 |
|---|---|---|---|---|---|---|
| 1 | 2026-05-28-opus-4-8-dynamic-workflows | decode | default | 本周 | Anthropic 官方 + YouTube jZgcWCzxh1I | Opus 4.8 + Dynamic Workflows 评估 + agent teams 横向对比。选题页 `wiki/topics/opus-4-8-dynamic-workflows.md`。**写作前先转录 YouTube + 核对官方 blog**。独家角度：本工厂 tools/pipeline.py 确定性 runner vs 模型驱动编排 |
| 2 | 2026-06-01-minimax-m3-ai-native-org | decode | default | 本周 | 机器之心 + 量子位 | MiniMax M3 评估 + AI Native 组织（token 无上限→全员 Agent 化）。选题页 `wiki/topics/minimax-m3-ai-native-org.md`。**重点在组织转型线，不是模型跑分**。强对照 Anthropic CFO 那篇（中国版 AI Native 组织） |
| 3 | mythos-1-zero-day-inflation | Mythos | default | TBD | Anthropic Risk Report | 系列篇一 |
| 4 | mythos-2-not-shipping-is-shipping | Mythos | default | TBD | Anthropic Risk Report | 系列篇二 |
| 5 | mythos-3-experienced-mountain-guide | Mythos | default | TBD | Anthropic Risk Report | 系列篇三 |
| 6 | mythos-4-anthropic-self-trial | Mythos | default | TBD | Anthropic Risk Report | 系列篇四 |

## 2026-06-28 用户批量选题（10 篇 · 独立成篇 · 走 happypath + DeepSeek 语感润色）

> 用户 2026-06-28 指定。每条独立成篇，深检索用 anysearch + firecrawl/web。发布前必过 `m.deepseek_polish`（已入 skillgraph）。选 1~3 篇出 web-video-presentation 动画视频。
>
> **状态：10 篇正文全部成稿 + DeepSeek 语感润色✓（2026-06-28），已移 `schedule/published.md`「当前未完结」。** 余下：出图 / 播客 / 1~3 篇动画视频 / 分发草稿。下表保留作存档。

| slug | 类型 | 套件 | 来源/检索关键词 | 独家角度（待研究后定稿） |
|---|---|---|---|---|
| 2026-06-28-claude-tag | decode | default | Anthropic / claude-tag | 待研究 |
| 2026-06-28-adrafinil-mac-agent-awake | decode | default | Adrafinil 菜单栏 App（仅 AI agent 工作时阻止 Mac 睡眠） | 待研究 |
| 2026-06-28-deepseek-dspark | decode | default | DeepSeek Dspark | 待研究 |
| 2026-06-28-codex-5-6 | decode | default(developer) | OpenAI Codex 5.6 | 待研究 |
| 2026-06-28-fable-gradual-rollout | decode | default | Claude Fable 5 逐步放开 | 待研究 |
| 2026-06-28-meituan-longcat-vitabench-2 | decode | default(developer) | 美团 LongCat 开源 VitaBench 2.0（长期动态智能体基准） | 待研究 |
| 2026-06-28-openknowledge-ai-notes | decode | default | OpenKnowledge（开源 AI-first Obsidian/Notion 替代） | 已转 in-progress（草稿✓） |
| 2026-06-28-figma-config-2026 | decode | creative | Figma Config 2026 大会 | 已转 in-progress（草稿✓） |
| 2026-06-28-doubao-pro-usage-playbook | decode | default | 豆包专业版全网用法大收集 | 已转 in-progress（草稿✓） |
| 2026-06-28-seedance-4k-reception | decode | creative | Seedance 4K 全网评论 + 精彩表现 | article.md 终稿✓（转 published） |

## 雷达入库候选（2026-06-06 · AI 提选，优先级待你定）

> 来自 `tmp/decode-radar-2026-06-06.md`。选题页已写入 `wiki/topics/`，一手信源已核（含口径修正，详见各页「一手信源」节）。挑想写的 → 移到 `in-progress.md` 开写即可。

| slug / 选题 | 类型 | 套件 | 来源 | 独家角度（一句话） |
|---|---|---|---|---|
| 2026-06-06-anthropic-builds-itself | decode | default(developer) | Anthropic 官方 + Fortune/Tom's | 不喊恐慌，拆「80% 口径游戏」+「领先者一边踩油门一边喊刹车＝爬上去后抽梯子」 |
| 2026-06-06-cloudflare-bots-pass-humans | decode | default | Cloudflare + Tom's/SiliconANGLE | 机器人过半的真问题是受众从人变 agent，「为谁写网页」（SEO→AEO），罕见横跨三类读者 |
| 2026-06-06-microsoft-mai-code-reversal | decode | default(developer) | microsoft.ai + Bloomberg | 不是又一次模型发布，是 AI 供应链反噬：平台既当裁判又当运动员，模型层被商品化 |

## Claude Code UX 源码系列（剩余）

铁律：每篇必须逐行读 `.ts/.tsx` 源文件。素材在 `raw/claudecodesources/raw_code/claude-code/src/`。

| 优先级 | slug | 套件 | 文件数 | 备注 |
|---|---|---|---|---|
| 3 | ux-prompt-input | default | 21 | 一个输入框的 21 个文件 |
| 4 | ux-message-rendering | default | 41 | 41 种消息类型 |
| 5 | ux-design-system | default | 16 | 终端主题/颜色/原子组件 |
| 6 | ux-permission-system | default | 51 | 信任界面 6 级实现 |
| 7 | ux-app-screens | default | ~16 | REPL+Doctor+生命周期 |
| 8 | ux-vim-keybindings | default | 19 | 终端 Vim 状态机 |

## 素材薄弱（暂不排产，等补料）

- ToolSearch 与延迟加载
- TeamCreate 与 SendMessage
- 拒绝追踪系统
- AutoDream 记忆巩固
- Bridge 远程会话
- 三大遥测通道

## 已跳过

- 泄露始末：事故还是 PR — 用户 2026-04-16 标记 skip

## 已完成（迁出，留存档案）

- 2026-05-11 ai-finished-but-human-doesnt-know — review-ready，见 wiki/published/2026-05-11-ai-finished-but-human-doesnt-know.md
- 2026-05-26 dont-know-what-claude-code-doing — review-ready（score 27/30，revised: yes），见 wiki/published/2026-05-26-dont-know-what-claude-code-doing.md
