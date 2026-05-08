---
name: decode-entity
description: "实体深度拆解器 v1（输入=产品/公司/技术概念/人物名）。用横纵分析法（时间轴 + 同期竞品）产出 10000+ 字深度研究报告 + 漫画风信息图 + 图文 Word 文档 + 可选播客。适合起底 Cursor/Anthropic/MCP 协议/山姆奥特曼这类主体。当用户给出**实体名**（非 URL）并说'拆解 Cursor'、'起底 Anthropic'、'分析 Hermes Agent'、'某公司发展史'、'横纵拆解'、'深度研究 XX'时触发。Also triggers on: decode entity, analyze company, break down product, founder profile. 不触发的输入：文章 URL（走 /deep-decode）、热点话题（走 /hot-history）。"
argument-hint: "[实体名] [--quick 速拆|--deep 深拆(默认)|--md-only 不出文档|--podcast 含播客]"
user_invocable: true
---

# /decode-entity -- 实体横纵分析拆解器 v1

不是词条，不是百科，是**用横纵分析法重构实体的来龙去脉 + 同期竞争格局 + 未来走向判断**。

**四件套产出** -- vault 知识节点（.md 10000+字）+ 漫画风信息图（SVG 含时间线/竞品矩阵）+ 图文文档（.docx）+ 可选播客音频（.mp3）。

---

## v1 架构（2026-04-21）

**和 deep-decode 同构**：Skill 只存执行步骤，Phase 3+ 的写作/画图/润色/事实核查/打包/分发规范全部复用 deep-decode 的 Wiki。

| 执行阶段 | 读取的 Wiki 文件 |
|---------|-----------------|
| **结构解剖（Phase 1，横纵 10 项骨架）** | `WIKI_ROOT/knowledge/horizontal-vertical-analysis-prompt.md` |
| 写作 | `WIKI_ROOT/knowledge/writing-style.md` |
| **散文润色（Phase 3.5 Evaluator）** | `WIKI_ROOT/knowledge/polish-7steps.md` + `references/evaluator-prompt.md` |
| SVG 画图 | `WIKI_ROOT/knowledge/svg-design.md` |
| 播客 | `WIKI_ROOT/knowledge/podcast-aesthetics.md` + `references/podcast-pipeline.md` |
| HTML/分发 | `WIKI_ROOT/knowledge/html-template.md` + `WIKI_ROOT/knowledge/channel-specs.md` |
| 执行避坑 | `.claude/skills/deep-decode/references/gotchas-exec.md`（共用） |

**路径常量**：

```
WIKI_ROOT = vault/1-knowledge/project/content_creation企媒内容生产/
DECODE_ROOT = {WIKI_ROOT}pipelines/decode/
```

---

## 触发判断

**合格输入**：
- 用户给的是一个**实体名**（不是 URL，不是话题），例子：
  - 产品/工具：Cursor / Hermes Agent / Claude Code
  - 公司/组织：Anthropic / 字节跳动 / OpenAI
  - 技术概念：MCP 协议 / RAG / Agent 框架
  - 人物：山姆·奥特曼 / Karpathy
- 关键词："拆解 XX"、"起底 XX"、"分析 XX"、"XX 发展史"、"横纵拆解 XX"、"XX 怎么走到今天"、"XX 和 YY 区别"

**不适用（路由到兄弟 skill）**：
- 输入是博客/推文 URL → 用 `/deep-decode`
- 输入是热点话题+历史追溯（"LLM Wiki 从哪来"、"Agent 热潮根源"）→ 用 `/hot-history`

---

## 铁律（速查）

1. **纵向追时间深度** -- 起源→诞生→演进→决策→叙事弧线，不写流水账，每节点说清因果
2. **横向追同期广度** -- 场景判断 A/B/C 后逐一拆竞品，不罗列参数、讲"活成什么样"
3. **交汇出新判断** -- 结尾段不是前面的缩写，是纵横融合后的独立判断
4. **敢下判断但保持客观** -- 基于证据推导，推测必须明确标注
5. **叙事驱动非罗列驱动** -- 深度报道风格，有节奏有画面感，不是词条
6. **图文一体** -- 时间线/竞品矩阵/生态位必配 SVG，不是装饰是压缩复杂信息
7. **用人话** -- 禁用"赋能""抓手""打造闭环"这类套话

完整标尺 → `{WIKI_ROOT}knowledge/horizontal-vertical-analysis-prompt.md` + `writing-style.md`

---

## 产出形态

| 产出 | 位置 | 用途 | 模式 |
|------|------|------|------|
| vault 知识节点 | `{DECODE_ROOT}{slug}.md` | 知识库双链、/emerge /challenge | 所有 |
| 时间线 + 竞品矩阵 SVG | `{slug}/*.svg` + 原站截图 | 独立传播 | --deep |
| 图文 Word 文档 | `{slug}/【AI研究MMDD】{实体名}.docx` | 团队分享、论坛发布 | --deep |
| 播客音频 | `{slug}/podcast.mp3` | 通勤/碎片时间听 | --podcast |

`{slug}` = `YYYY-MM-DD-entity-{英文短名}`（例：`2026-04-21-entity-cursor`）

---

## 工作流

### Phase 0：素材扫全（10-15 分钟）

```
用户给实体名 →
  1. 判断实体类型（product / company / concept / person），影响后续维度
  2. tavily_research 全量扫：
     - 官方主页 / 产品文档 / 定价页
     - 维基百科 / Crunchbase / 融资新闻
     - 时间线关键节点（首发、融资、转型、危机）
     - 顶级媒体深度报道（晚点/虎嗅/Stratechery/Ars Technica）
  3. tavily_search 补充：
     - HN / Reddit / V2EX / 即刻 真实讨论
     - 用户口碑、使用场景、槽点
     - 竞品候选清单（通过"XX vs"、"XX alternatives"搜）
  4. Playwright 截关键页面（{slug}/screenshots/）：
     - 官网首页、产品截图、定价页
     - 融资报道头图、关键数据图表
  5. vault grep：已有相关拆解？避免重复 + 交叉引用
```

**产出中间文件**：`{slug}/phase0_sources.json`（至少 10 条一手/权威来源 + 时间线原始数据 + 竞品候选名单 + 截图路径）

---

### Phase 1：横纵骨架（15-20 分钟）

**读 Wiki 前置**：必须先读 `{WIKI_ROOT}knowledge/horizontal-vertical-analysis-prompt.md` 获取详细标尺，按下面 10 项填骨架。

**纵向 5 项（沿时间轴）**：

1. **起源追溯**：诞生背景 / 技术理念/需求来源 / 创始团队 / 当时行业环境
2. **诞生节点**：明确首次发布/成立时间，最初形态和定位
3. **演进历程**：关键节点时间线（版本/融资/团队/战略转型/架构变化/用户规模/合作/危机），每个节点一句话说清**因果**
4. **决策逻辑**：关键节点上为什么选 A 不选 B？约束条件是什么？
5. **叙事弧线规划**：把时间线串成有起承转合的故事，标出"铺垫→爆发→转折"

**横向 4 项（当前时间切面）**：

6. **竞品场景判断**：场景 A 无直接竞品 / B 少量 1-2 个 / C 充分 3+。选定进入 7
7. **竞品逐一**：每个竞品展开——技术路线 / 产品形态 / 目标用户 / 优势短板 / 定价规模 / 用户真实口碑
8. **生态位分析**：研究对象在赛道版图占据什么位置？填补什么空白？跟谁正面竞争？
9. **趋势判断**：基于横向对比，走向、机会、风险

**交汇 1 项**：

10. **横纵交汇 & 可视化规划**：纵向脉络 + 横向格局融合成新判断（不是前面的缩写）。配图规划 **6-10 张**：封面 / 时间线 / 竞品矩阵 / 生态位图 / 关键转折 / 趋势预判

**产出中间文件**：`{slug}/phase1_skeleton.md`（10 项齐全，每项至少 3 行内容）

---

### Phase 2：证据补齐（10-15 分钟）

Phase 1 骨架中每个关键主张必须有外部信源佐证。用 tavily_search + tavily_research 补：

| 搜什么 | 为什么 |
|--------|--------|
| 时间线节点的原始报道 | 确认日期、细节、背景 |
| 决策逻辑的当事人原话 | 创始人访谈、博客、发布会原文 |
| 竞品的定价/功能/融资数据 | 横向对比必须数字准确 |
| 用户真实口碑 | HN / Reddit 高赞评论截取 |
| vault 内已有知识 | grep 检查是否有可交叉引用的历史分析 |

**每项主张至少 2 个独立信源**。

**产出中间文件**：`{slug}/phase2_signals.json`（信源 >= 15 条，带 URL + 对应骨架项编号）

---

### Phase 3：写作 + 可视化设计（40-60 分钟）

**文字和图同步产出**。

**先读 Wiki**：
- 写作前：`{WIKI_ROOT}knowledge/writing-style.md`（密度/叙事/AI 味清单）
- 画图前：`{WIKI_ROOT}knowledge/svg-design.md`

**写作结构**（叙事驱动，按横纵分析法章节）：

```
1. 钩子开头（反直觉数据 / 决定性时刻 / 一句被遗忘的预言，任选）

2. 纵向叙事（6000-15000 字）
   - 起源：行业环境 + 创始团队故事
   - 诞生：最初产品形态 + 为什么选这个切入
   - 演进：3-7 个关键节点，每节点一段故事（铺垫→事件→后果）
     * 至少 2-3 处"为什么选 A 不选 B"的决策还原
     * [SVG] 时间线总图配在本段开头或末尾
   - 高潮与转折：识别出的"决定性时刻"单独展开
   
3. 横向对比（3000-10000 字）
   - 竞品场景判断（A/B/C）+ 为什么这样判
   - 竞品逐一：每个主要竞品 1500 字+
     * [SVG] 竞品对比矩阵（技术路线 × 目标用户）
   - 生态位分析：在整个赛道占据什么位置
     * [SVG] 生态位图/版图图
   
4. 横纵交汇（1500-3000 字，整篇精华）
   - 纵向脉络 + 横向格局 → 新判断
   - 对研究对象未来 12-24 个月的具体推测
   - 对读者（AI 从业者）的 actionable insight

5. 本期关键词（3-8 个前沿术语）

6. 原文关键引用 + 引用清单（至少 15 条）
```

**产出中间文件**：`{slug}/draft_v1.md`（字数 >= 10000，图片引用 >= 6）

---

### Phase 3.5：散文润色（Generator-Evaluator，1 轮 hard stop）

**架构、流程、铁律、跳过条件**完全同 deep-decode Phase 3.5。

执行细节 → 读 deep-decode SKILL.md § Phase 3.5 不重复。

**entity 模式差异**：
- 篇幅大（10000+ 字），润色段落数多
- 开头钩子、横纵交汇段**必润**（价值密度最高）
- 纵向叙事中段可容忍更多原样（信息密度为主）
- 超过 100 段时分批次并行（20 段一批）避免 subagent 过载

**产出**：`{slug}/polish_report.json` + `{slug}/draft_v2.md`

---

### Phase 3b：事实核查 + QA（10-15 分钟）

**entity 模式事实密度比 deep-decode 高得多**，事实核查**不可跳过**（除非 --quick）。

**重点核查项**：
- 日期：创立年份、融资日期、产品发布节点
- 数字：融资额、估值、用户规模、员工数、增长率
- 人名-职位：创始人、关键早期员工、现任 CEO/CTO
- 竞品数据：对比表里的所有参数
- 最高级声明：任何"最早/最大/第一"
- 引用：当事人原话必须和原始来源一致

**流程**同 deep-decode Phase 3b，调用 `/fact-checker`。

**产出**：`{slug}/factcheck.json`（无未解决 ERROR）

---

### Phase 4：产出打包

#### 4a. vault 知识节点 .md（所有模式）

保存到 `{DECODE_ROOT}{slug}.md`

```markdown
---
title: {中文标题——实体横纵拆解}
entity: {实体英文名}
entity_cn: {中文名}
entity_type: product | company | concept | person
decoded: {拆解日期}
mode: entity
tags: [AI产品, 横纵分析, ...]
---

{正文按 Phase 3 结构}

---

## 本期关键词
...

## 引用
1. [{信源1}]({URL}) -- {一句话说明关联}
...
```

反向更新：拆解内容与 vault 已有文件强相关 → 在已有文件末尾追加链接。

#### 4b. 可视化 + 图文文档（--deep 模式）

**目录结构**：
```
{DECODE_ROOT}{slug}/
├── screenshots/         ← 官网/定价页/报道截图
├── 00_封面.svg
├── 01_时间线.svg        ← 纵向必备
├── 02_竞品矩阵.svg      ← 横向必备
├── 03_生态位.svg        ← 横向必备
├── 04_关键转折.svg      ← 可选
├── 05_趋势预判.svg      ← 可选
├── material/
│   ├── pngs/            ← SVG→PNG (2x)
│   └── create_doc.py
└── 【AI研究MMDD】{实体名}.docx
```

**执行**按 `svg-design.md` 规范。避坑 → `deep-decode/references/gotchas-exec.md`。

#### 4c. 播客（--podcast 模式）

同 deep-decode Phase 4c，但脚本改写要按"实体故事"结构（开场人物+戏剧性时刻 / 中段演进 / 结尾判断），不是"博客金句"结构。

---

### Phase 5：入库 + 日志

追加到 `.claude/skills/deep-decode/state/decode-log.jsonl`（共用）：

```json
{"date": "2026-04-21", "mode": "entity", "entity": "Cursor", "entity_type": "product", "slug": "...", "tags": ["AI产品","代码工具"], "key_concept": "Fork-IDE 策略", "vault_md": "...", "has_docx": true, "has_podcast": false, "svg_count": 6, "word_count": 12500, "screenshots": 4}
```

`mode: "entity"` 区分文章 vs 实体拆解，便于后续聚合分析。

---

### Phase 6-7：分发（可选）

公众号（6）和小红书（7）脚本、规范**完全复用** deep-decode。不重述。

---

## 模式选择

| 模式 | 耗时 | 产出 | 适用 |
|------|------|------|------|
| `--quick` | ~30min | vault .md（简版 3000 字，跳过 fact-check、只填纵向 3 项 + 横向 2 项） | 快速获知基本面 |
| `--md-only` | ~70min | vault .md（完整 10000+ 字 + fact-check） | 只要知识节点不分享 |
| `--deep`（默认） | ~90min | .md + SVG 6 张 + .docx + 截图（含 fact-check） | 正式研究产出，可分享 |
| `--podcast` | ~110min | --deep 全部 + 单人播客 .mp3 | 想听着学 |

---

## 完成门控（铁律）

| 模式 | 必须产出物 |
|------|-----------|
| `--quick` | `{slug}.md`（>= 3000 字） |
| `--md-only` | `{slug}.md`（>= 10000 字）+ `factcheck.json` |
| `--deep`（默认） | `{slug}.md`（>= 10000 字）+ SVG >= 6 张（含时间线 + 竞品矩阵 + 生态位）+ PNG(2x) + `.docx` + `factcheck.json` |
| `--podcast` | --deep 全部 + `podcast.mp3`（8-15 分钟） |

**执行顺序**：Phase 0 → 1 → 2 → 3 → 3.5 → 3b → 4a → 4b → 4c（可选）→ 5 → 6-7（可选）。不可跳步。

---

## 质量自检

### 横纵分析专属
- [ ] 纵向至少 5 个关键节点 + 至少 2 处决策还原
- [ ] 横向竞品判断明确（A/B/C）+ 每个竞品 >= 1500 字（B/C 场景）
- [ ] 时间线 SVG、竞品矩阵 SVG、生态位 SVG **三图齐全**
- [ ] 横纵交汇段是新判断不是前文缩写
- [ ] 趋势预判具体到 12-24 个月

### 内容质量（通用）
- [ ] 开头钩子（反直觉数据 / 决定性时刻 / 被遗忘预言）
- [ ] 至少 5 处基于证据的明确判断
- [ ] 至少 1 个原创框架/概念/命名
- [ ] 外部信源 >= 15 条交叉验证
- [ ] 盲区/反面论证至少 1 段
- [ ] 对读者 actionable insight
- [ ] frontmatter 含 `mode: entity`，wikilink >= 2

### 事实核查
见 deep-decode Phase 3b QA 清单（entity 模式更严）

### 入库完整性
- [ ] decode-log.jsonl 已更新（mode=entity）

---

## 目标对象优先级

| 优先级 | 类型 | 例子 |
|--------|------|------|
| S | 和用户当前工作强相关的产品 | Claude Code / Cursor / LangChain / Letta |
| S | 行业风向标公司 | Anthropic / OpenAI / Hugging Face |
| A | 核心技术概念 | MCP 协议 / RAG / Agent 框架 / Context Engineering |
| A | 行业关键人物 | Dario Amodei / Karpathy / Swyx / Simon Willison |
| B | 快速崛起的新产品 | 最近 3 个月 HN/Product Hunt 热度 top |
| B | 中文圈重要玩家 | 月之暗面 / 智谱 / 深度求索 |

---

## 依赖

**所有模式**：tavily MCP

**--deep 追加**：
- Playwright MCP
- `pip3 install cairosvg`
- `pip3 install python-docx`

**--podcast 追加**：同 deep-decode

详见 `deep-decode/references/gotchas-exec.md`

---

## 文件结构

```
.claude/skills/decode-entity/                            ← 本 skill
├── SKILL.md                                             ← 本文档
└── references -> ../deep-decode/references/             ← 共用（evaluator-prompt/gotchas-exec/podcast-pipeline/bgm）
    （首次使用时建议改成软链，当前是 cp 复制，hotfix 时同步修改两边）

.claude/skills/deep-decode/state/decode-log.jsonl        ← 共用日志

vault/1-knowledge/project/content_creation企媒内容生产/  ← 共用 Wiki
├── knowledge/
│   ├── horizontal-vertical-analysis-prompt.md           ← entity 专用骨架源
│   ├── writing-style.md                                 ← 共用
│   ├── svg-design.md                                    ← 共用
│   ├── podcast-aesthetics.md                            ← 共用
│   ├── html-template.md                                 ← 共用
│   └── channel-specs.md                                 ← 共用
└── pipelines/decode/                                    ← 产出归档（文章 vs 实体同目录，靠 mode 字段区分）
```

---

> *v1.0 | 2026-04-21 | 从 deep-decode 派生。输入=实体名。骨架=横纵分析法 10 项。共享后半段 Wiki。mode=entity 标记入库。*
