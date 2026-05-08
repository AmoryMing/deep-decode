---
name: hot-history
description: "热点 × 历史 配对深度文章生成器 v1（输入=当代热点话题）。用百年时间差套利法把当代 AI 热点拉回历史根源，找出被遗忘的先驱、断裂期与重连拐点，产出 8000-12000 字深度长文 + 漫画风信息图 + 图文 Word 文档 + 可选播客。适合写「LLM Wiki 和 Vannevar Bush 1945 Memex 的关系」「Anthropic Skill 系统怎么呼应 Minsky 1974 Frames」这类话题。当用户给出热点话题（不是 URL，不是实体名）并说'写一篇'、'热点配历史'、'XX 的来龙去脉'、'XX 是谁先想过'时触发。Also triggers on: hot history, historical pair, deep article on hot topic. 不触发的输入：博客/推文 URL（走 /deep-decode）、产品/公司/人物名（走 /decode-entity）。"
argument-hint: "[热点话题或 pair-id] [--quick 速拆|--deep 深拆(默认)|--md-only 不出文档|--podcast 含播客]"
user_invocable: true
---

# /hot-history -- 热点 × 历史 配对深度文章生成器 v1

不是科普，不是历史回顾，是**用百年时间差套利法把当代热点拉回历史根源 + 找出被遗忘的先驱 + 推出断裂-重连拐点判断**。

**四件套产出** -- vault 知识节点（.md 8000-12000 字）+ 漫画风信息图（SVG，含血缘时间线 + 拐点对比）+ 图文文档（.docx）+ 可选播客音频（.mp3）。

---

## v1 架构（2026-04-21）

**和 deep-decode / decode-entity 同构**：Skill 只存执行步骤，Phase 3+ 的写作/画图/润色/事实核查/打包/分发规范全部复用 Wiki。

| 执行阶段 | 读取的 Wiki 文件 |
|---------|-----------------|
| **配对挖掘 / 血缘链构建（Phase 1）** | `WIKI_ROOT/knowledge/hot-history-pairs.md` |
| 调研深挖 | `WIKI_ROOT/studio/pipelines/hot-history/<slug>/research-report.md` 模式 |
| 写作 | `WIKI_ROOT/knowledge/writing-style.md` |
| **散文润色（Phase 3.5 Evaluator）** | `WIKI_ROOT/knowledge/polish-7steps.md` + `skill-references/evaluator-prompt.md` |
| SVG 画图 | `WIKI_ROOT/knowledge/svg-design.md` |
| 播客 | `WIKI_ROOT/knowledge/podcast-aesthetics.md` + `skill-references/podcast-pipeline.md` |
| HTML / 分发 | `WIKI_ROOT/knowledge/html-template.md` + `WIKI_ROOT/knowledge/channel-specs.md` |
| 执行避坑 | `skill-references/gotchas-exec.md` |

**路径常量（在这个 repo 中）**：

```
WIKI_ROOT = ./                       # repo 根
HOT_HISTORY_ROOT = ./studio/pipelines/hot-history/   # 已完成产出 + seeds
PAIRS_INDEX = ./knowledge/hot-history-pairs.md       # 配对索引（5 个种子 pair）
```

---

## 触发判断

- 用户给的是**当代话题**（不是 URL、不是实体名），且能挂上"历史先驱"的钩子
- "写一篇 X 的来龙去脉"、"X 跟 Y（历史）有什么关系"、"X 是谁先想过的"
- 隐含触发："这事儿其实老早有人做过吧"、"我想找 X 的祖宗"

**不适用本 skill 的输入（路由到兄弟 skill）**：
- 输入是**博客/推文 URL** → 用 `/deep-decode`
- 输入是**纯实体名**（产品/公司/人物） → 用 `/decode-entity`（横纵分析法）
- 判断要点：话题包含"对比/对照/呼应/血缘"维度 → hot-history；只问 X 是什么 → decode-entity

---

## 铁律（速查，详细定义在 Wiki）

1. **不是科普是配对** -- 必须把当代热点和被遗忘的历史先驱配成一对，单点不成立
2. **血缘链 ≥ 3 节点** -- 起点（历史源头）→ 中间继承人 → 断裂期 → 重连（今天）。少于 3 节点等于讲故事不是论证
3. **断裂-重连必须精确到模块** -- 不能笼统"算力够了"。要精确到：哪个模块是卡点，哪个具体发明解除了卡点（例：LLM 的抽取归档能力 = Memex 缺的那个模块）
4. **冷门度优先** -- 大家都讲过的 pair 不写。时间差套利的价值在"别人没读过 → 你抢到角度"
5. **观点密度** -- 详见 `knowledge/writing-style.md` §观点密度标准（每 500 字至少 1 判断 + 1 信号 + 1 推论）
6. **造概念 + 起名** -- 给"为什么当年没成、今天能成"的拐点起一个有冲击力的名字（参考 memex-llm-wiki 篇的"Bush 命中与落空"、skills-frames 篇的"专家系统冬天"）
7. **图文一体** -- 必须有：(a) 血缘时间线图 (b) 拐点对比图（当年 vs 今天）

---

## 产出形态

| 产出 | 位置 | 用途 | 模式 |
|------|------|------|------|
| 调研报告 | `{HOT_HISTORY_ROOT}{slug}/research-report.md` | 一手论文/档案的引用清单 | 所有 |
| 草稿 v1 → v2 | `{HOT_HISTORY_ROOT}{slug}/draft_v1.md` → `draft_v2.md` | 迭代痕迹 | 所有 |
| vault 知识节点（终稿） | `{HOT_HISTORY_ROOT}{slug}/{slug}.md` | 知识库双链、/emerge /challenge | 所有 |
| 概念可视化图 | `{slug}/00_系列封面.svg` + 5-6 张概念图 | 独立传播 | --deep |
| 邮件预览 | `{slug}/email_preview.html` | 内部分享 | --deep |
| 润色报告 | `{slug}/polish_report.json` | 7 步精修评分 | --deep |
| 小红书分发 | `{slug}/distribute/xiaohongshu/content.md` | 小红书改写版 | --deep |
| 图文 Word 文档 | `{slug}/【AI笔记MMDD】{标题}.docx` | 团队分享、论坛发布 | --deep |
| 播客音频 | `{slug}/podcast.mp3` | 通勤/碎片时间听 | --podcast |

`{slug}` = `YYYY-MM-DD-英文短名`（例：`2026-04-21-memex-llm-wiki`、`2026-04-21-skills-frames`）

---

## 工作流

### Phase 1: 配对挖掘 + 血缘链构建

1. **读 PAIRS_INDEX**（`knowledge/hot-history-pairs.md`），看是否已有种子 pair
2. **如果用户给的话题已有种子** → 直接进 Phase 2
3. **如果是新话题** → 走"配对挖掘"子流程：
   - 用 tavily / WebFetch 搜当代热点 5+ 信号源
   - 构建血缘链候选（≥ 3 时间节点，跨度 ≥ 30 年）
   - 评估冷门度（搜中英文 → 已有的深度文章数）
   - 按 5 维度打分（冷门 / 拐点锋利 / 自指 / 一手材料 / 综合推荐）
   - 综合推荐 ≥ 7 才进 Phase 2，否则告诉用户"这个 pair 不够锋利"

### Phase 2: 一手调研 → research-report.md

- 历史起点：找原始论文 / 档案 / 当事人回忆录（不是 Wikipedia 二手）
- 中间继承人：找他们引用过谁、谁引用过他们
- 断裂期：当时为什么没成？技术 / 经济 / 社会拐点是什么
- 重连：今天的 X 解除了哪个具体卡点
- 写 `research-report.md` 含全部一手引用 + 链接

### Phase 3: 写作 draft_v1

按 `knowledge/writing-style.md` 铁律。结构建议：
1. 开场：今天的热点（让读者有共鸣）
2. 时光机：把热点拉回到 1945 / 1965 / 1974（吓读者一跳）
3. 血缘链路：从起点走到今天，每个节点说"做对了什么、留下了什么坑"
4. 断裂期诊断：精确定位卡点
5. 重连判断：今天为什么能兑现（具体到模块）
6. 余响：今天还有什么没解决的（不收口太满）

### Phase 3.5: 7 步精修

按 `knowledge/polish-7steps.md` + `skill-references/evaluator-prompt.md` 跑 evaluator → 输出 `polish_report.json` → 改出 `draft_v2.md`

### Phase 4: 起终稿 + SVG

- 终稿命名 `{slug}.md`，定锚
- SVG 画图（按 `knowledge/svg-design.md`）：
  - 00_系列封面.svg（Pair 名 + 日期）
  - 01_血缘时间线.svg（核心图，必须有）
  - 02_拐点对比图（当年卡点 vs 今天解除）
  - 03-06 概念图（每个核心论点配 1 张）

### Phase 5: 打包分发

- HTML 邮件预览（`html-template.md`）
- Word 文档（含 SVG inline）
- 小红书改写（`distribute/xiaohongshu/content.md`）
- 公众号 / 飞书（按 `channel-specs.md`）
- 可选：播客音频

---

## 范例参考（看完整四件套）

- **`studio/pipelines/hot-history/2026-04-21-memex-llm-wiki/`** — Karpathy LLM Wiki × Vannevar Bush Memex（1945-2026 跨 80 年）
  - `2026-04-21-memex-llm-wiki.md` 终稿 + 6 SVG + research-report + draft v1/v2 + email_preview + polish_report + 小红书改写
- **`studio/pipelines/hot-history/2026-04-21-skills-frames/`** — Anthropic Skill 系统 × Minsky Frames（1974-2026 跨 50 年）
  - 同上结构，含"专家系统冬天" 的拐点定位

种子 pair 还有 3 个待挖（见 `knowledge/hot-history-pairs.md`）：
- Long context windows × Bush 关联轨迹
- Agent 工作流 × Engelbart NLS 增强人类智能
- Multi-modal × McCulloch-Pitts 神经元模型

---

## ⚠️ 已知限制（开源版）

- 这份 SKILL.md 是 **基于历史产出反推重写的开源版**，原 SKILL.md 在 placeholder 目录里没保留。如果你跑出来的效果跟 `studio/pipelines/hot-history/2026-04-21-*` 的标杆质量有差距，**优先以标杆产出为准**，反推这份 Skill 哪步缺了。
- Phase 1 的"配对挖掘"在原 vault 里依赖 subagent dispatch（`oh-my-claudecode:swarm` 之类）。开源版可以用 LLM 单实例多轮搜索代替，但效率低。
