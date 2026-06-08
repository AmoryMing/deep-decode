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
