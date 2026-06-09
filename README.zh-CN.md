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

[English](README.md) · **简体中文**

<br/>

<img src="https://cdn.jsdelivr.net/gh/AmoryMing/deep-decode@deploy/output/2026-04-29-skill-graphs-2/00_cover.png" width="780" alt="Deep-Decode 内容工厂" />

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

直接来自流水线的真实产物（点图看成品）。

<table>
<tr>
<td width="33%"><a href="output/2026-04-29-skill-graphs-2/article.md"><img src="https://cdn.jsdelivr.net/gh/AmoryMing/deep-decode@deploy/output/2026-04-29-skill-graphs-2/00_cover.png" alt="封面"/></a><br/><b>系列封面</b><br/><i>每篇都有一张为社交流设计的封面。</i></td>
<td width="33%"><a href="output/2026-04-17-letta-context-constitution/article.md"><img src="https://cdn.jsdelivr.net/gh/AmoryMing/deep-decode@deploy/output/2026-04-17-letta-context-constitution/00_cover.png" alt="封面"/></a><br/><b>概念封面</b><br/><i>一个钩子，一个关键词，一个承诺。</i></td>
<td width="33%"><a href="output/2026-04-27-anthropic-product-launchroom/article.md"><img src="https://cdn.jsdelivr.net/gh/AmoryMing/deep-decode@deploy/output/2026-04-27-anthropic-product-launchroom/00_cover.png" alt="封面"/></a><br/><b>选题封面</b><br/><i>从单一 URL 拆解而来。</i></td>
</tr>
<tr>
<td><a href="output/2026-04-29-skill-graphs-2/article.md"><img src="https://cdn.jsdelivr.net/gh/AmoryMing/deep-decode@deploy/output/2026-04-29-skill-graphs-2/02_three_layers.png" alt="架构图"/></a><br/><b>架构信息图</b><br/><i>把复杂逻辑压进一张图。</i></td>
<td><a href="output/2026-04-17-letta-context-constitution/article.md"><img src="https://cdn.jsdelivr.net/gh/AmoryMing/deep-decode@deploy/output/2026-04-17-letta-context-constitution/02_three_piece_timeline.png" alt="时间线"/></a><br/><b>时间线信息图</b><br/><i>叙事用画的，不用 bullet 堆。</i></td>
<td><a href="output/2026-04-27-anthropic-product-launchroom/article.md"><img src="https://cdn.jsdelivr.net/gh/AmoryMing/deep-decode@deploy/output/2026-04-27-anthropic-product-launchroom/03_eval_loop.png" alt="流程图"/></a><br/><b>流程信息图</b><br/><i>SVG 代码绘制，再 2× 转 PNG。</i></td>
</tr>
</table>

除信息图外，每次深拆还可产出一套 **GPT-Image** 配图、**播客**（`podcast.mp3`）、**视频**（`video.mp4`）、**图文 Word 文档**（`.docx`）、**小红书卡片**——全部由同一个 `output/<slug>/` 契约寻址。

<div align="center">
<img src="https://cdn.jsdelivr.net/gh/AmoryMing/deep-decode@deploy/output/2026-05-08-codex-pets-state-personification/00_gpt_image_hero.png" width="600" alt="GPT-Image 后端示例"/>
<br/><i>GPT-Image 后端——每个项目可通过 <code>image_backend: gpt-image</code> 切换。</i>
</div>

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
| [Skill Graph 1.0 必塌：人为什么不该在原子层驾驶 Agent](output/2026-04-29-skill-graphs-2/article.md) | 一条推文长 thread |
| [Karpathy 加入 Anthropic：明星个体迁徙作为路线信号](output/2026-05-20-karpathy-joins-anthropic/article.md) | TechCrunch |
| [0.2 个百分点和 7 倍价差——DeepSeek V4 把范式之争压成一道数学题](output/2026-04-25-deepseek-v4-paradigm-shift/article.md) | 官方 + 第三方评测 |
| [17 分 5 秒——菲尔兹奖得主把数学博士论文的下限交给了 GPT-5.5 Pro](output/2026-05-10-gowers-gpt-5-5-math-research/article.md) | 研究纪要 |
| [给 AI 写一份宪法](output/2026-04-17-letta-context-constitution/article.md) | Letta 博客 |
| [Claude Code 上瘾：反馈循环的老虎机效应](output/2026-04-15-claude-code-addiction/article.md) | 博客 |

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

暂无 license 文件——若想使用或改造这套流水线，开个 issue，我们谈。

---

<div align="center">
<sub>用 <a href="https://claude.com/claude-code">Claude Code</a> 构建。如果这套架构对你有用，点个 ⭐ 是最好的鼓励。</sub>
</div>
