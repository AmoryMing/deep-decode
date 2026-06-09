<div align="center">

# Deep-Decode · AI 内容工厂

**一个想法或一条 URL 进，一整套多形态内容出。**

深度解读文 · 漫画风信息图 · 图文文档 · 播客 · 视频 —
由确定性的**技能图谱**流水线产出，再一路推到全平台可发布状态。

[![Stars](https://img.shields.io/github/stars/AmoryMing/deep-decode?style=for-the-badge&logo=github&color=da7756)](https://github.com/AmoryMing/deep-decode/stargazers)
[![Last commit](https://img.shields.io/github/last-commit/AmoryMing/deep-decode/deploy?style=for-the-badge&color=2b7489)](https://github.com/AmoryMing/deep-decode/commits/deploy)
![Decoded pieces](https://img.shields.io/badge/已产出-155%2B%20篇-blue?style=for-the-badge)
![Built with Claude Code](https://img.shields.io/badge/built%20with-Claude%20Code-da7756?style=for-the-badge)
![Next.js](https://img.shields.io/badge/web-Next.js%2015-black?style=for-the-badge&logo=next.js)
![License](https://img.shields.io/badge/license-Apache--2.0-green?style=for-the-badge)

[English](README.md) · **简体中文**

<br/>

<a href="output/2026-06-03-dynamic-workflows-harness/article.md"><img src="https://cdn.jsdelivr.net/gh/AmoryMing/deep-decode@deploy/output/2026-06-03-dynamic-workflows-harness/assets/gpt-img/03_six_patterns.png" width="820" alt="Deep-Decode — 配图全部由 GPT-Image（img2）后端生成" /></a>

</div>

---

## 这是什么

**Deep-Decode 是一套有主见的、端到端的 AI 内容工厂。**

给它一篇博客、一条推文、一个产品、一个人物，或一个热点。它会研究原文，写出**观点密度极高的深度解读**（不是翻译，不是摘要），画出**漫画风信息图**，排出**图文文档**，配出**播客**，剪出**视频**，并把每一种形态都推到可发布状态——邮件、公众号、小红书、视频号、抖音。

整条链路由声明式**技能图谱**编排，确定性 runner *在每一步产物通过契约校验之前绝不放行*。不会有被悄悄跳过的步骤。文件即状态，失败可见。

这不是 demo。`output/` 里有 **155+ 篇**真实跑出来的成品。

## 和"让大模型写一篇"有什么不同

| | 通用大模型 prompt | Deep-Decode |
|---|---|---|
| **立场** | 翻译 / 摘要 | 用自己的框架重构原文逻辑；观点密度 > 信息密度 |
| **严谨** | 单一信源，不交叉验证 | 拉 2–3 个外部信号佐证/反驳；遇到没名字的现象就给它造个名字 |
| **产出** | 一坨文字 | 一个事实源 → 5 种形态：文 + 图 + 文档 + 播客 + 视频 |
| **可靠** | "但愿 agent 跑完了" | 声明式图 + 硬产物门；缺一个文件就*卡住* |
| **触达** | 自己复制粘贴 | 自动推到 5 个中文平台的草稿就绪态 |

## 产品速览

下面每一张图都由 **GPT-Image（`img2`）后端**生成——中文渲染准确、配色统一、版式杂志级。全是近期真实成品（2026 年 6 月），直接来自流水线。点图看拆解。

<table>
<tr>
<td width="33%"><a href="output/2026-06-03-dynamic-workflows-harness/article.md"><img src="https://cdn.jsdelivr.net/gh/AmoryMing/deep-decode@deploy/output/2026-06-03-dynamic-workflows-harness/assets/gpt-img/00_cover.png" alt="裁判和球员不能是同一个人"/></a><br/><b>「裁判和球员不能是同一个人」</b><br/><i>为什么 agent 需要一副马具，而不是更乖的模型。</i></td>
<td width="33%"><a href="output/2026-06-03-ai-native-engineering-org/article.md"><img src="https://cdn.jsdelivr.net/gh/AmoryMing/deep-decode@deploy/output/2026-06-03-ai-native-engineering-org/assets/gpt-img/00_cover.png" alt="瓶颈搬家了"/></a><br/><b>「瓶颈搬家了」</b><br/><i>当写代码免费，约束落在哪条线。</i></td>
<td width="33%"><a href="output/2026-06-05-ideogram-v4/article.md"><img src="https://cdn.jsdelivr.net/gh/AmoryMing/deep-decode@deploy/output/2026-06-05-ideogram-v4/assets/gpt-img/00_cover.png" alt="Ideogram v4.0"/></a><br/><b>Ideogram v4.0</b><br/><i>文生图学会「把字写对」和听结构化指令。</i></td>
</tr>
<tr>
<td><a href="output/2026-06-05-feifei-world-models/article.md"><img src="https://cdn.jsdelivr.net/gh/AmoryMing/deep-decode@deploy/output/2026-06-05-feifei-world-models/assets/gpt-img/00_cover.png" alt="李飞飞 世界模型"/></a><br/><b>李飞飞 · 世界模型</b><br/><i>一套概念分类学，画成一张环形图。</i></td>
<td><a href="output/2026-06-03-anthropic-partner-hub/article.md"><img src="https://cdn.jsdelivr.net/gh/AmoryMing/deep-decode@deploy/output/2026-06-03-anthropic-partner-hub/assets/gpt-img/00_cover.png" alt="Anthropic Partner Hub"/></a><br/><b>Anthropic Partner Hub</b><br/><i>分级阶梯 + 核心数字。</i></td>
<td><a href="output/2026-06-04-zhipu-star-market-ipo/article.md"><img src="https://cdn.jsdelivr.net/gh/AmoryMing/deep-decode@deploy/output/2026-06-04-zhipu-star-market-ipo/assets/gpt-img/00_cover.png" alt="智谱 Z.AI vs Anthropic IPO"/></a><br/><b>智谱 Z.AI ⟷ Anthropic</b><br/><i>双栏对照，两条 IPO 路径。</i></td>
</tr>
</table>

每次深拆都产出一整套 **`img2` 配图**（封面 + 每章节配图，就像上面的[主视觉网格](output/2026-06-03-dynamic-workflows-harness/article.md)），外加**播客**（`podcast.mp3`）、**视频**（`video.mp4`）、**图文 Word 文档**（`.docx`）、**杂志风小红书卡片**——全部由同一个 `output/<slug>/` 契约寻址。后端可通过 `image_backend: gpt-image` 按项目切换。

## 它怎么跑——技能图谱

旧版流程是文档里的 ~18 步散文。agent 跑深链路会*悄无声息走丢*——漏步骤、用错模板、停在邮件草稿不到分发。于是流程改成了**声明式图**（`skillgraph.yaml`），由确定性 runner（`tools/pipeline.py`）遍历。

```
            ┌──────────────────────────────────────────────────────────┐
            │  skillgraph.yaml  —  声明式三层图                          │
            │                                                          │
   compounds│  decode · brief · practice · distribute-all   ← 你驾驶    │
            │      ▲  (选 playbook + 确认 Strategy Spec)                │
  molecules │  正文 · 一组信息图 · 播客 · 视频 · 文档                    │
            │      ▲  (每个 = 一个可交付物)                             │
     atoms  │  svg→png · tts · imagegen · 语气 lint · 发送             │
            │      ▲  (单一确定动作)                                    │
            └──────────────────────────────────────────────────────────┘
                         │  拓扑序由它计算
                         ▼
            tools/pipeline.py  —  步骤顺序的唯一权威
                 status · next · gate · verify
```

- **三层。** `atoms`（单一确定动作）→ `molecules`（一个可交付物）→ `compounds`（人驾驶的完整 playbook）。
- **你不再手数步骤。** runner 从 `depends_on` 边算出拓扑序。
- **完成 = 产物存在*且*过契约。** 契约含 `file_exists`、`min_bytes`、`png_for_each_svg`、`audio_visual_sync`、`tone_match`（禁用词 + voice lint）、`channel_draft_ready`。缺产物 = 卡住，runner 不放行。
- **人只在 compound 层驾驶**——选 playbook、确认 Strategy Spec，其余 runner 拉着走。

```bash
cd output/2026-06-08-某-slug
python3 ../../tools/pipeline.py status   # 全图 + ✓/✗ + 下一步
python3 ../../tools/pipeline.py next      # "现在该跑哪个节点？"
python3 ../../tools/pipeline.py gate m.article   # 校验产物契约
```

## 示例

155+ 篇里的几篇（原文均为中文深度拆解）：

| 篇目 | 拆解来源 |
|---|---|
| [裁判和球员不能是同一个人：为什么 Claude 要给自己造一副马具](output/2026-06-03-dynamic-workflows-harness/article.md) | Claude Code 博客 |
| [瓶颈搬家了：当写代码免费，工程组织该按哪条线重排](output/2026-06-03-ai-native-engineering-org/article.md) | 工程长文 |
| [李飞飞给「世界模型」立规矩：它不是文生视频，是一套 POMDP 循环](output/2026-06-05-feifei-world-models/article.md) | 李飞飞 |
| [Ideogram v4.0：当文生图开始「把字写对」和听结构化指令](output/2026-06-05-ideogram-v4/article.md) | 发布 + 评测 |
| [智谱回 A 还要改名 Z.AI：中国大模型走出第二条资本路](output/2026-06-04-zhipu-star-market-ipo/article.md) | 招股 + 报道 |
| [Karpathy 加入 Anthropic：明星个体迁徙作为路线信号](output/2026-05-20-karpathy-joins-anthropic/article.md) | TechCrunch |
| [0.2 个百分点和 7 倍价差——DeepSeek V4 把范式之争压成一道数学题](output/2026-04-25-deepseek-v4-paradigm-shift/article.md) | 官方 + 第三方评测 |

全部成品在 `output/`，或用下面的 web 工作台浏览。

## Web 工作台

一个 Next.js 15 应用（`web/`）把工厂做成三合一站点：

| 板块 | 路由 | 访问 | 内容 |
|---|---|---|---|
| **门户** | `/`、`/post/[slug]` | 公开 | 每篇成品——文章 + 信息图 + 播客 + 视频 |
| **流程** | `/process` | 公开 | 三动词 + 实时技能图谱（读真实 `skillgraph.yaml`）|
| **后台** | `/admin` | 登录 | 排期 / 在写 / 待写 / 营收 Dashboard |

全站 SSG，**媒体零进部署包**——图片/音频在 build 时重写到本仓库支撑的 jsDelivr CDN，视频走 GitHub raw。部署到 Vercel，生产分支为 `deploy`。

```bash
cd web
npm install
cp .env.example .env.local
npm run dev          # http://localhost:3000
```

## 仓库结构

```
deep-decode/
├── .claude/skills/   # 技能：deep-decode、polish、visual、podcast、video、distribute…
├── skillgraph.yaml   # 声明式三层图（步骤顺序的唯一来源）
├── tools/            # pipeline.py runner + 原子（tone_lint、tts_atom、imagegen_relay…）
├── output/           # 155+ 篇成品——一篇一目录（文章 + 媒体）
├── wiki/             # 结构化知识：topics / sources / concepts / published
├── schedule/         # queue · in-progress · published · calendar
├── styles/           # voice + feedback + best，多套风格
├── readers/          # 读者画像（主导语气）
├── templates/        # 内容 + 项目模板
└── web/              # Next.js 15 门户 + 流程视图 + 后台
```

## 快速开始

Deep-Decode 跑在 [Claude Code](https://claude.com/claude-code) 上，是一套技能系统。

1. 克隆仓库，用 Claude Code 打开——技能在 `.claude/skills/` 下。
2. 把素材丢进 `raw/`，或直接给它一条 URL。
3. 说"拆解这篇"（`/deep-decode <url>`），确认 Strategy Spec；剩下交给 runner 跑到可发布。
4. 跑起 web 工作台（`cd web && npm run dev`）浏览你的产出。

> 提示：分发面向中文平台（公众号 / 小红书 / 视频号 / 抖音）和中文 TTS 音色。但**架构本身**——声明式技能图、契约门、一源多形态——完全通用；把这套模式 fork 到任何语言或渠道都行。

## 状态

正在生产中服务一个中文 AI 评论刊物。`deploy` 是内容分支（也是 GitHub 上的默认分支）；为什么内容放在孤儿分支、怎么推送，见 `web/README.md`。

## 许可

[Apache-2.0](LICENSE) © 2026 AmoryMing。流水线、技能与工具可自由使用和改造。`output/` 下的拆解文章与生成媒体是示例，请勿原样转载。

---

<div align="center">
<sub>用 <a href="https://claude.com/claude-code">Claude Code</a> 构建。如果这套架构对你有用，点个 ⭐ 是最好的鼓励。</sub>
</div>
