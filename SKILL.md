---
name: deep-decode
description: "AI 大厂/顶级个人博客深度拆解器 v4（输入=文章 URL）。把博客/推文拆解为：观点密度极高的深度解读 + 漫画风信息图 + 图文 Word 文档 + 播客音频。四件套全方位产出。当用户给出博客/推文 URL 并说'拆解'、'解读'、'分析这篇文章'、'拆解博客'时触发。Also triggers on: decode, deep decode, break down this post, analyze this blog. 不触发的输入：产品/公司/人名（走 /decode-entity 横纵分析）、热点话题（走 /hot-history 历史配对）。"
argument-hint: "[URL] [--quick 速拆|--deep 深拆(默认)|--md-only 不出文档|--podcast 含播客]"
user_invocable: true
---

# /deep-decode -- AI 博客深度拆解器 v4

不是翻译，不是摘要，是**用自己的框架重构原文逻辑，产出观点密度极高的深度解读**。

**四件套产出** -- vault 知识节点（.md）+ 漫画风信息图（SVG）+ 图文文档（.docx）+ 播客音频（.mp3）。拆解完能看、能读、能听、能转发。

---

## v4 架构变化（2026-04-21）

**Skill 只存执行步骤，知识与标准存 LLM Wiki。** Skill 不抄规范，执行到对应阶段时读取 Wiki：

| 执行阶段 | 读取的 Wiki 文件 |
|---------|-----------------|
| 写作 | `WIKI_ROOT/knowledge/writing-style.md` |
| **散文润色（Phase 3.5 Evaluator）** | `WIKI_ROOT/knowledge/polish-7steps.md` + `references/evaluator-prompt.md` |
| SVG 画图 | `WIKI_ROOT/knowledge/svg-design.md` |
| 播客 | `WIKI_ROOT/knowledge/podcast-aesthetics.md` + `references/podcast-pipeline.md` |
| HTML/分发 | `WIKI_ROOT/knowledge/html-template.md` + `WIKI_ROOT/knowledge/channel-specs.md` |
| 执行避坑 | `.claude/skills/deep-decode/references/gotchas-exec.md` |

**路径常量**：

```
WIKI_ROOT = vault/1-knowledge/project/content_creation企媒内容生产/
DECODE_ROOT = {WIKI_ROOT}pipelines/decode/
CC_ROOT = {WIKI_ROOT}pipelines/claudecode_deep_decode/
```

---

## 触发判断

- 用户给了**博客/推文 URL**（claude.com/blog, anthropic.com, openai.com, langchain.dev, vercel.com, x.com 长推等）
- "拆解"、"解读"、"分析这篇文章"、"这篇文章说了什么"
- 隐含："XX 发了篇博客"、"看看这个帖子"

**不适用本 skill 的输入（路由到兄弟 skill）**：
- 输入是**产品/公司/人物名**（例："拆 Cursor"、"分析 Anthropic"、"起底 Hermes Agent"）→ 用 `/decode-entity`（横纵分析法，时间轴 + 竞品对比）
- 输入是**当前热点话题**（例："LLM Wiki 的来龙去脉"、"Agent 热潮从哪来"）→ 用 `/hot-history`（热点 × 历史先驱配对）
- 判断要点：有 URL 走 deep-decode；只给名字走 decode-entity；给话题走 hot-history

---

## 铁律（速查，详细定义在 Wiki）

1. **不是翻译是重构** -- 用自己的框架重新组织原文逻辑，不跟着原文顺序走
2. **观点密度 > 信息密度** -- 每 500 字至少 1 个判断 + 1 个外部信号 + 1 个推论（详见 writing-style.md §观点密度标准）
3. **造概念** -- 如果原文揭示了一个没有名字的现象，给它起名字
4. **跨信号交叉验证** -- 不孤立解读，必须拉至少 3 个外部信号源佐证或反驳
5. **说人话** -- 像《晚点》《虎嗅》深度稿，叙事驱动，不用 bullet 做主体
6. **敢下判断但保持客观** -- 基于证据推导，不用"我认为"，保持客观中立第三方视角
7. **图文一体** -- 关键章节配 SVG 信息图，不是装饰，是压缩复杂逻辑

完整铁律和示例 → `{WIKI_ROOT}knowledge/writing-style.md`

---

## 产出形态

| 产出 | 位置 | 用途 | 模式 |
|------|------|------|------|
| vault 知识节点 | `{DECODE_ROOT}{slug}.md` | 知识库双链、/emerge /challenge | 所有 |
| 概念可视化图 | `{slug}/*.svg` + 原站截图 | 独立传播、社交媒体 | --deep |
| 图文 Word 文档 | `{slug}/【AI笔记MMDD】{标题}.docx` | 团队分享、论坛发布 | --deep |
| 播客音频 | `{slug}/podcast.mp3` | 通勤/碎片时间听 | --podcast |

`{slug}` = `YYYY-MM-DD-英文短名`。

---

## 工作流

### Phase 0：抓原文 + 截图（3 分钟）

```
用户给 URL →
  1. WebFetch 抓原文全文
  2. x.com 长推 WebFetch 失败 → tavily_extract
  3. Playwright 截原网页截图（{slug}/screenshots/）
     - 博客：标题+首屏+关键图表
     - 推文：完整推文卡片（含互动数据）
  4. 记录原文引用的数据/图表/链接
  5. 识别：作者身份、为什么他说这话有分量
```

**产出中间文件**：`{slug}/phase0_sources.json`（已读素材+URL+截图路径）

---

### Phase 1：结构解剖（5 分钟）

不急着写，先拆骨架（7 项）：

1. **核心论点**：这篇文章到底在说什么？一句话
2. **隐含假设**：作者没说出来但默认成立的前提
3. **关键证据**：支撑论点的最强 2-3 个证据/数据/案例
4. **盲区**：作者刻意没提或轻描淡写的是什么？为什么？
5. **读者画像**：这篇文章写给谁看的？对我们意味着什么不同？
6. **内容结构**：列出文章完整章节和子章节。每章节标注：核心论点+证据+读者带走什么判断
7. **可视化规划**：每主要章节规划配图。长文目标 **6-10 张**图。每张图标注：配哪章+解释什么概念+用什么形式（对比/流程/矩阵/隐喻/时间线/数据）

**产出中间文件**：`{slug}/phase1_skeleton.md`

---

### Phase 2：跨信号搜集（10 分钟）

用 tavily_search + tavily_research 搜集交叉验证信号：

| 搜什么 | 为什么 |
|--------|--------|
| 同一作者的其他发言 | 看一贯立场，判断这次是常规输出还是转向 |
| 同一话题的竞品/对手观点 | 看行业共识还是分歧 |
| 实际用户/从业者反馈 | HN 评论、Reddit 讨论、即刻/V2EX |
| 相关数据/benchmark | 验证原文引用的数据是否靠谱 |
| vault 内已有知识 | grep vault/ 看有没有相关历史分析可以交叉引用 |

**至少 3 个外部信号源**，用于佐证、补充或反驳。

**产出中间文件**：`{slug}/phase2_signals.json`

---

### Phase 3：写作 + 可视化设计（20-30 分钟）

**文字和图同步产出。**

**先读 Wiki**：
- 写作前：`{WIKI_ROOT}knowledge/writing-style.md`（七条规则 / 钩子 / 证据驱动 / 双受众 / AI 味清单）
- 画图前：`{WIKI_ROOT}knowledge/svg-design.md`（双风格 / 配色 / 字体顺序 / 认知排列）

**核心结构**（思维框架，实际写作叙事驱动）：

```
1. 钩子开头（不用"今天 XX 发布了..."）
   - 新词 / 反直觉数据 / 措辞变化 / 时间压缩，任选一种

2. 作者身份 + 为什么值得关注（1-2 句）

3. 核心论点重构
   - 用自己的话重述，加入自己的框架
   - 如果原文有隐含假设，先揭示再展开

4. 逐点深拆（原文的 3-5 个关键主张）
   - 每个主张：原文说了什么 → 这意味着什么 → 外部信号佐证/反驳
   - 用原文引号保留关键原话（不要意译掉精华）
   - [SVG] 在概念最抽象的 2-4 处配可视化图

5. 原创框架/概念（如果有的话）
   - 给没名字的现象起名字
   - [SVG] 用图形表达概念结构关系

6. 盲区与反面论证
   - 作者没说的、刻意避开的、过于乐观的
   - "但要注意..."

7. 对 AI 从业者/实践者来说意味着什么
   - 具体到：怎么做产品/怎么做技术选型/怎么看行业
   - 如果有可执行的 action，直接说

8. 本期关键词（3-8 个）
   - 前沿术语 / 圈内黑话 / 新造概念
   - 中文在前，英文括号附注
```

**产出中间文件**：`{slug}/draft_v1.md`（字数 >= 3000，图片引用 >= 3）

---

### Phase 3.5：散文润色（Generator-Evaluator，1 轮 hard stop，10-15 分钟）

**架构**：Generator（主流程）≠ Evaluator（subagent）。独立调用，1 轮不迭代。

**为什么分开**：Evaluator 独立跑避免生成偏见；1 轮 stop 防"修到走味"（作者声音消失）。

**执行步骤**：

1. **切段**：读 `draft_v1.md`，按 `\n\n` 切为段落，带编号 `p_001` / `p_002` ...
2. **并行派 Evaluator**：每段起一个 subagent（`Agent` 工具，`subagent_type: "general-purpose"`），prompt 模板见 `references/evaluator-prompt.md`
   - 模板里已内嵌 7 步标尺（见 `WIKI_ROOT/knowledge/polish-7steps.md`）
   - Subagent 输出严格 JSON（paragraph_id / original / revised / insights[] / overall_diagnosis）
3. **汇总报告**：所有段落的 JSON 汇入 `{slug}/polish_report.json`
4. **Generator 自动改（3a 模式）**：读报告，按 `revised` 字段拼接 → `{slug}/draft_v2.md`。不等用户确认，直接改。
5. **失败兜底**：
   - Subagent 返回非 JSON → 用 `original` 作为 `revised`，`insights` 置空，打 warning
   - 改动 > 70% 字符 → 保留 `original`，JSON 标 `"over_polished": true`（用户事后可查 polish_report.json）
   - 超 80% 段落无改动 → 输出"原稿已佳，润色价值低"提示

**铁律**：
- **1 轮 hard stop**。draft_v2 不再二次评估。
- **声音保留优先**（polish-7steps.md §Step 7 刹车条款）——"转圈的小玩意儿"这类个人化表达必须保留
- Evaluator 独立运行，不看 Skill 执行历史，只看该段原文 + 7 步标尺

**产出中间文件**：
- `{slug}/polish_report.json`（所有段落评估汇总）
- `{slug}/draft_v2.md`（润色后终稿，进入 Phase 3b）

**跳过条件**：`--quick` 模式 或 用户 `--no-polish`。

---

### Phase 3b：事实核查 + QA（5-10 分钟）

**输入**：`draft_v2.md`（Phase 3.5 输出），不是 draft_v1。

写完初稿，**先过 fact-check 再出终稿**。不跳过。

**5 步流程**（调用 /fact-checker）：

1. **提取事实声明** -- 扫初稿，标记可验证的客观陈述（数字/日期/开源状态/许可证/人名-职位/最高级声明）
2. **主观语言检测** -- 扫最高级/比较级、价值排序、情感倾向词。每个必须满足：有数据支撑 OR 原文作者判断 OR 已改为客观过渡句
3. **调用 /fact-checker** -- tavily_search + 原文对照，每条标记 Accurate/Incorrect/Outdated/Misleading/Unverifiable
4. **修正报告** -- 列所有非 Accurate：当前 → 修正 → 信源 URL → 理由
5. **确认后修正** -- 展示报告等用户确认 → 改稿 → 验证

**产出中间文件**：`{slug}/factcheck.json`（无未解决 ERROR）

**QA 自检清单**：
- [ ] 所有数字/日期可溯源（原文引用 or 外部信源 URL）
- [ ] 没有把"源码可见"说成"开源"之类的措辞升级
- [ ] 原文引用的英文原话与原文一致（不是凭记忆写的）
- [ ] 人名、公司名、产品名拼写正确
- [ ] 因果关系没有过度推断（"导致" vs "相关"）
- [ ] 盲区/反面论证部分没有编造不存在的批评
- [ ] 所有"最 XX"类表述有数据/证据支撑
- [ ] 文章结构与价值判断一致（声称重要的内容确实在重要位置）
- [ ] 无未标注来源的情感倾向词（"震惊""不可思议"等需删除）

**跳过条件**：用户明确说"跳过 fact-check"或 `--quick` 模式。

---

### Phase 4：产出打包

#### 4a. vault 知识节点 .md（所有模式）

保存到 `{DECODE_ROOT}{slug}.md`

```markdown
---
title: {中文标题}
source: {原文 URL}
author: {作者名} ({身份})
date: {原文发布日期}
decoded: {拆解日期}
tags: [AI产品, PM, ...]
---

{正文内容 -- 纯文字版，图片用 ![描述](material/pngs/xx.png) 引用}

---

## 本期关键词

**{中文概念}（{English}）** -- {大白话解释。为什么值得知道}

（3-8 个前沿术语。格式：中文在前英文括号。详见 writing-style.md §本期关键词格式）

## 原文关键引用

> "{英文原话}"（中文翻译）-- {作者}

## 引用

1. [{原文标题}]({原文URL}) -- 本期拆解原文
2. [{来源1标题}]({URL}) -- {一句话说明关联}
3. [{来源2标题}]({URL})
```

Wikilink：正文中对已有 vault 文件用 `[[文件名]]` 做双链。
反向更新：如果拆解内容与 vault 中已有文件强相关，在已有文件末尾追加链接。

#### 4b. 概念可视化 + 图文文档（--deep 模式）

**目录结构**：
```
{DECODE_ROOT}{slug}/
├── screenshots/
│   ├── original_page.png      ← Playwright 原网站截图
│   └── tweet_card.png         ← 推文卡片截图
├── 00_系列封面.svg
├── 01_xxx.svg                 ← 概念可视化图
├── material/
│   ├── pngs/                  ← SVG→PNG (2x)
│   └── create_doc.py          ← python-docx 生成脚本
├── 【AI笔记MMDD】标题.docx
└── 【AI笔记MMDD】标题.md
```

**执行步骤**：
1. 按 `{WIKI_ROOT}knowledge/svg-design.md` 规范制作 SVG（2-4 张 + 封面）
2. `cairosvg.svg2png(scale=2)` 转 PNG
3. 基于 `references/create_sharing_doc_template.js` 或 `material/create_doc.py` 生成 docx
4. docx 中嵌入可视化图 + 原站截图

**docx 排版**：
- 图文穿插：每 1-2 章节配一张图，不连续放多张
- 封面独立 section，正文另起 section
- 结语：暖黄背景 + 上下边线 + 3 条关键启示
- PNG 必须 2x 渲染

避坑 → `references/gotchas-exec.md`

#### 4c. 播客音频（--podcast 模式）

**听感标准** → `{WIKI_ROOT}knowledge/podcast-aesthetics.md`（结构模板 / 声音选型 / 响度目标）

**执行管线** → `references/podcast-pipeline.md`（脚本改写 prompt / 豆包 TTS 调用 / ffmpeg 命令 / 音效拼接代码）

---

### Phase 5：入库 + 日志（2 分钟）

追加到 `state/decode-log.jsonl`：

```json
{"date": "2026-03-29", "url": "...", "slug": "...", "author": "...", "tags": ["AI产品"], "key_concept": "建造鸿沟", "vault_md": "...", "has_docx": true, "has_podcast": false, "svg_count": 4, "screenshots": 2}
```

下次拆解前读 log，避免重复，交叉引用历史拆解。

---

### Phase 6：分发到公众号（可选，2 分钟）

```bash
python3 vault/1-knowledge/project/企媒运营/pipelines/scripts/wechat_publish.py <markdown文件>
```

脚本自动完成：读 MD → 智能查找同目录 PNG → 上传图片到微信 CDN → 转内联样式 HTML → 创建草稿。

**公众号规范** → `{WIKI_ROOT}knowledge/channel-specs.md §渠道 A`
**HTML 样式** → `{WIKI_ROOT}knowledge/html-template.md`

---

### Phase 7：分发到小红书（自动，2 分钟）

```bash
python3 vault/1-knowledge/project/content_creation企媒内容生产/pipelines/pipeline_tools/md2xhs.py <markdown文件>
```

**发布到草稿箱**（需 opencli 连接）：
```bash
python3 xhs_pipeline.py --article <slug> --publish
```

**小红书规范** → `{WIKI_ROOT}knowledge/channel-specs.md §渠道 B`

---

## 模式选择

| 模式 | 耗时 | 产出 | 适用场景 |
|------|------|------|----------|
| `--quick` | ~15min | vault .md（简版，跳过 fact-check） | 快速消化 |
| `--md-only` | ~40min | vault .md（完整+交叉验证+fact-check） | 只需知识节点 |
| `--deep`（默认） | ~55min | .md + SVG + .docx + 截图（含 fact-check） | 重要信号，值得分享 |
| `--podcast` | ~70min | --deep 全部 + 单人播客 .mp3 | 想听着学 |
| `--podcast --dual` | ~80min | --deep 全部 + 双人播客 .mp3 | 科普向/轻松风 |
| `--cc-source` | ~30min/篇 | 自动选题 + 全流程 + 检查点强制 | CC 源码系列批量产出 |

### --cc-source Claude Code 源码拆解系列

自动从队列选下一篇未完成的选题，全流程强制执行，人只管最后审核。

**选题锁定（铁律）**：
- 带了 `--slug xxx` 参数 → 必须且只能处理该 slug，忽略 queue 中其他条目
- 没带 `--slug` → 严格选 queue.jsonl 中**第一个** `status: "pending"` 的条目（按文件行序，id 最小的那个），不跳选、不挑选
- 选定后立即输出"锁定选题: {slug}"

**路径覆盖（铁律）**：cc-source 模式下所有产出路径前缀替换为 `CC_ROOT = {WIKI_ROOT}pipelines/claudecode_deep_decode/`，忽略通用 `DECODE_ROOT`。

**队列管理**：
- 队列文件：`{CC_ROOT}pipeline/queue.jsonl`
- 素材库：`{CC_ROOT}context/`
- 去重：读 `state/decode-log.jsonl`，跳过已有 slug
- 产出路径：`{CC_ROOT}{slug}/`

**启动流程**：
1. 读 queue.jsonl → 找第一个 `status: "pending"` 的条目
2. **读素材库（铁律，不可跳过）**：
   - 先读 `context/information_sources/` 下与本选题相关的 md/pdf —— hand-pick 过的一手素材
   - 再读 `context/raw_code/` 下相关源码文件
   - 最后 WebFetch 抓 queue.jsonl 中的 URL 补充
   - **三层信源优先级：context/ 素材库（首选）→ queue URL（精选参考）→ tavily 搜索（补充）。不跳层，不从摘要写文章**
3. 显示选题 + 已读素材清单，开始执行
4. 全流程跑完 → 输出审核摘要
5. 用户说"发论坛" → `/discourse-forum`；"发公众号" → `wechat_publish.py`；"下一篇" → 自动选下一个

**检查点机制**（每步必须产出中间文件，缺失不进下一步）：

```
Phase 0 → phase0_sources.json   （素材+URL+截图路径；context 素材数 >= 1，截图 >= 1）
Phase 1 → phase1_skeleton.md    （6 项都有内容）
Phase 2 → phase2_signals.json   （信源 >= 3）
Phase 3 → draft_v1.md           （字数 >= 3000，图片引用 >= 3）
Phase 3.5 → polish_report.json + draft_v2.md  （所有段落已评，revised 字段非空；1 轮停）
Phase 3b → factcheck.json       （输入 draft_v2.md，无未解决 ERROR）
Phase 4 → {slug}.md + SVG + PNG + 截图（frontmatter 完整，所有 ![img] 指向真实文件）
Phase 5 → decode-log.jsonl 追加 + queue.jsonl 状态更新
```

**截图规范（cc-source 专用）**：

截图让人看到真东西，不是装饰。不截信源网站首屏。

| 类型 | 截什么 | 例子 |
|------|--------|------|
| 源码实证 | 被讨论的代码片段 | QueryEngine 核心逻辑、权限分类器 |
| 关键数据/图表 | 原文中的数据表格、架构图 | LMCache 92% 缓存表 |
| 产品/界面 | 被讨论的产品实际界面 | GitHub 镜像仓库、ccleaks.com |
| 社区讨论 | HN/Reddit/V2EX 真实讨论 | 关键评论截图 |

每张截图必须在 md 中用 `![描述](screenshots/xx.png)` 引用，且放在引用该内容的段落旁边。

### --quick 速拆
跳过 Phase 2、Phase 3b（fact-check）和 Phase 4b/4c，核心论点 + 3 insight + "对我们意味着什么"。

### --md-only
完整 Phase 0-3（含截图），产出 vault .md，跳过 SVG/docx/播客。

### --deep（默认）
完整 Phase 0-5，含概念可视化 + 原站截图 + docx，不含播客。

### --podcast
--deep 全部 + Phase 4c 播客。默认单人，加 `--dual` 切双人对话。

---

## 完成门控（铁律，不可跳过）

**文章不算 done，直到以下全部满足。不满足就不能告诉用户"完成了"。**

| 模式 | 必须存在的产出物 | 缺一个都不算完成 |
|------|-----------------|----------------|
| `--quick` | `{slug}.md` | 只需文章 |
| `--md-only` | `{slug}.md` + `factcheck.json` | 文章 + 事实核查 |
| `--deep`（默认） | `{slug}.md` + SVG >= 2 张 + PNG(2x) + `.docx` + `factcheck.json` + `distribute/xiaohongshu/` 配图 | 全套四件去播客 + XHS 配图 |
| `--podcast` | --deep 全部 + `podcast.mp3` | 全套四件 + XHS 配图 |
| `--cc-source` | 同 --deep，且在 `{CC_ROOT}{slug}/` 目录下 | 全套 + 正确路径 + XHS 配图 |

**执行顺序不可乱**：Phase 0 → 1 → 2 → 3 → 3.5 → 3b → 4a → 4b → 4c（可选）→ 5 → 6（可选）→ 7。跳步 = bug。

**违反后果**：如果告诉用户"完成了"但缺产出物，用户会追问"图呢？"——已经发生至少 5 次，不要第 6 次。

---

## 质量自检

### 内容质量（所有模式）
- [ ] 开头不是"今天 XX 发布了..."（用了钩子）
- [ ] 有至少 3 处基于证据的明确判断（"这意味着""数据表明"等，不用"我认为"）
- [ ] 有至少 1 个原创概念/框架/命名
- [ ] 有至少 3 个外部信号源交叉验证（--deep/--md-only）
- [ ] 原文关键金句保留了原话引号
- [ ] 盲区/反面论证至少 1 段
- [ ] "对我们意味着什么"具体到可执行
- [ ] vault .md frontmatter 完整，wikilink >= 2

### 事实核查（--deep/--md-only/--podcast，--quick 豁免）
见 Phase 3b QA 自检清单

### 视觉产出（--deep / --podcast）
- [ ] 原站截图已截取并嵌入
- [ ] SVG 2-4 张 + 封面，概念清晰可独立传播
- [ ] 图形排列符合认知规律
- [ ] SVG 字体 PingFang SC 在前
- [ ] PNG 2x 渲染
- [ ] .docx 图文穿插

### 播客（--podcast）
- [ ] 脚本口语化，有节奏标注
- [ ] TTS 声音自然
- [ ] 有开场/结尾音乐
- [ ] 响度 -16 LUFS
- [ ] 时长 8-15 分钟

### 入库完整性
- [ ] decode-log.jsonl 已更新

---

## 目标源优先级

| 优先级 | 来源 | 为什么 |
|--------|------|--------|
| S | Anthropic 官方博客/工程师推文 | 我们重度使用 Claude，第一手信号 |
| S | OpenAI 官方博客 | 行业风向标 |
| A | LangChain/LlamaIndex 博客 | Agent 生态核心玩家 |
| A | Vercel/Next.js 博客 | AI 应用层基础设施 |
| A | 知名个人（Karpathy, Swyx, Simon Willison, Thariq 等） | 一线 practitioner 实战经验 |
| B | Google DeepMind/Meta AI | 基础研究信号 |
| B | 虎嗅/晚点/36氪深度稿 | 中文行业分析 |
| C | 其他技术博客 | 按内容质量判断 |

---

## 依赖

**所有模式**：tavily MCP

**--deep 追加**：
- Playwright MCP（原站截图）
- `pip3 install cairosvg`（+ libcairo: `apt install libcairo2-dev`）
- `npm install --prefix /tmp docx`（或用 python-docx 替代方案）

**--podcast 追加**：
- `pip3 install edge-tts pydub`（零成本方案）
- 或豆包 TTS（`archive/探索项目/完全复制体/voice_agent/src/tts_doubao.py`）
- ffmpeg（loudnorm 后处理）
- DeepSeek API（脚本改写 $0.002/次）
- lo-fi BGM：`references/bgm/`（Pixabay Music 免费）

详见 `references/gotchas-exec.md`

---

## 文件结构

```
.claude/skills/deep-decode/                              ← Skill（纯执行）
├── SKILL.md                                             ← 本文档
├── references/
│   ├── gotchas-exec.md                                  ← 执行避坑（命令/参数/API 坑）
│   ├── podcast-pipeline.md                              ← 播客执行管线（TTS/ffmpeg/脚本）
│   ├── create_sharing_doc_template.js                   ← docx 生成模板
│   └── bgm/                                             ← 播客 BGM 素材
└── state/decode-log.jsonl                               ← 拆解历史

vault/1-knowledge/project/content_creation企媒内容生产/  ← LLM Wiki（纯知识）
├── knowledge/
│   ├── writing-style.md                                 ← 写作风格（七条规则/AI 味清单/企媒适配）
│   ├── svg-design.md                                    ← SVG 双风格/配色/字体/隐喻
│   ├── podcast-aesthetics.md                            ← 播客听感/结构/声音选型
│   ├── html-template.md                                 ← Markdown → HTML 标准范式
│   └── channel-specs.md                                 ← 各分发渠道规范
├── ground-truth.md                                      ← 索引 + 已发布清单 + 血泪教训
├── context/                                             ← 一手素材
└── pipelines/                                           ← 产出归档
```

---

> *v4.0 | 2026-04-21 | 架构重构：Skill 只存执行步骤，知识/标准/规范全部迁移到 LLM Wiki。Skill 瘦身 ~50%。*
