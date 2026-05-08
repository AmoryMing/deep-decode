# 企媒内容生产 Ground Truth（索引版）

> **性质**：LLM Wiki 的首页索引。
> **架构**：Skill 执行步骤在 `.claude/skills/deep-decode/`，知识/规范在本目录 `knowledge/`。
> **最后更新**：2026-04-21（架构重构：从单文件 Ground Truth 拆分为知识节点 + Skill）

---

## 一、体系总览

```
信息源（三层）→ 选题库 → 写作（三种模板）→ 可视化（SVG 概念图）→ 分发（多渠道）
                                ↑                                        ↓
                          写作记忆 ←─────────── 用户反馈 ←────────── 发布复盘
```

---

## 二、知识库导航

### 写作层

- **[writing-style.md](knowledge/writing-style.md)** — 写作风格规范（七条规则 / 钩子 / 证据驱动 / 双受众 / AI 味清单 / 企媒适配）—— 写的时候怎么写
- **[polish-7steps.md](knowledge/polish-7steps.md)** — 中文技术散文润色标尺（7 步审阅）—— 写完之后怎么炼字，Evaluator subagent 的评估依据
- **[svg-design.md](knowledge/svg-design.md)** — SVG 概念图设计（双风格 / Notion 配色 / 字体顺序 / 隐喻词汇表）

### 分发层

- **[html-template.md](knowledge/html-template.md)** — Markdown → HTML 标准范式（骨架 / 元素样式速查 / 各渠道特殊规则）
- **[channel-specs.md](knowledge/channel-specs.md)** — 分发渠道规范（公众号 / 小红书 / 短视频 / 邮件 / 论坛）
- **[podcast-aesthetics.md](knowledge/podcast-aesthetics.md)** — 播客听感美学（标杆 / 结构模板 / 声音选型 / 响度标准）

### 执行层（在 Skill 里）

- `.claude/skills/deep-decode/SKILL.md` — 8 阶段流程 / 检查点 / 完成门控 / 模式选择
- `.claude/skills/deep-decode/references/podcast-pipeline.md` — 播客执行管线（TTS / ffmpeg / 脚本）
- `.claude/skills/deep-decode/references/gotchas-exec.md` — 执行避坑清单

---

## 三、三层信源铁律（不跳层）

| 层级 | 来源 | 用途 |
|------|------|------|
| 第一层 | `context/` 素材库（一手原文） | **首选**，信息密度最高 |
| 第二层 | 选题 URL（原文链接，WebFetch 抓取） | 精选参考 |
| 第三层 | tavily 搜索（tavily_search + tavily_research） | 补充，需 ≥3 个外部信号交叉验证 |

**血泪教训（4 天 0 产出事故，2026-04-06）**：34 篇选题，4 天没出一篇高质量文章。根因：AI 没读一手素材，从二手摘要拼文章。**wiki 是地图不是原料，从摘要写文章 = 从地图上刮矿**。

### 信号评分框架（5 维度，各 1-3 分，满分 15）

| 维度 | 3 分 | 2 分 | 1 分 |
|------|------|------|------|
| 新鲜度 | <24h | 24-72h | >72h |
| 来源权威 | 官方/一线 Practitioner | 知名媒体 | 社区讨论 |
| 多源共振 | 3+ 独立来源 | 2-3 源 | 单源 |
| 实操含义 | 立即影响工作判断 | 中期影响 | 背景了解 |
| 反直觉性 | 颠覆认知 | 确认认知 | 无关 |

评分 → 深度决策：10+ 深度叙事（3000-5000 字），6-9 标准分析，3-5 速报，<3 不写。

### 情报信源（待分级）

- **官方**：openai.com/blog, anthropic.com/news, Claude changelog
- **Practitioner**：Karpathy, Simon Willison (simonwillison.net), Lilian Weng, Ethan Mollick
- **社区**：Hacker News (hn.algolia.com), r/LocalLLaMA, arXiv cs.CL
- **中国源**：量子位 (qbitai.com), 机器之心 (jiqizhixin.com)
- **补充源**：36kr, Stratechery, HuggingFace blog

---

## 四、内容类型

### 类型 A：深度拆解（decode）-- 主力内容

**定位**：拆解 AI 大厂/顶级个人博客，产出观点密度极高的深度解读。

**产出物（全部完成才算交付）**：
1. `article.md` — 正文（2000-4000 字），图片已嵌入
2. `00_系列封面.svg` + PNG — 封面图
3. `01_xxx.svg` ... — 每个主要章节一张概念图（图数 = 章节数 + 1）
4. 播客音频（可选，`--podcast` 模式）

**Skill**：`.claude/skills/deep-decode/SKILL.md`

### 类型 B：情报日报（brief）-- 流量钩子

**定位**：日报是钩子，引读者去看 decode 深度文章。

**产出物**：`brief.md`（500-1000 字）

**结构**：今日要点（3-5 条，每条：一句话 + 为什么重要 + 信源）→ 值得关注（1-3 条）→ 关键词

**筛选优先级**：Anthropic/Claude 生态 > Coding Agent 工具链 > AI 产品/商业模式 > AI 技术前沿

### 类型 C：实操手册（practice）-- 经验沉淀

**定位**：把踩过的坑、跑通的流程变成别人能照做的手册。

**产出物**：`practice.md` + `.docx` + 流程图（可选）

**结构**：解决什么问题 → 前置条件 → 操作步骤（每步：做什么 + 预期结果 + 常见问题）→ 避坑清单 → 验证方法

**铁律**：高中生读了零问题能照做。不假设读者有上下文（practice-decode 特别规则详见 [writing-style.md](knowledge/writing-style.md) §practice-decode 特别规则）。

**Skill**：`.claude/skills/practice-decode/SKILL.md`

---

## 五、已发布内容（5 篇）

| 日期 | 标题 | 来源 | 备注 |
|------|------|------|------|
| 2026-03-29 | PM 遇上指数级 AI | Cat Wu | 首篇 |
| 2026-03-29 | AI 能力悬置 | Aaron Levie | 标杆 #2 |
| 2026-03-31 | Boris 15 条隐藏功能 | Boris Cherny | - |
| 2026-04-09 | 脑手分离 | Anthropic 官博 | **标杆 #1** |
| 2026-04-13 | 五个文件一整套灵魂 | buddy-pet | 企媒适配首篇 |

---

## 六、content-factory 知识管理层

### 目录结构（旧版工厂，渐进迁移到 knowledge/）

```
content-factory/
├── raw/            # 用户丢素材（只丢不管，不可变）
├── wiki/
│   ├── topics/     # 选题库（每个选题一页）
│   ├── sources/    # 信源摘要（每篇素材一页）
│   ├── concepts/   # 概念实体页（人物、产品、术语）
│   └── published/  # 已发布文章复盘页
├── style/
│   ├── voice.md    # 写作风格规范（持续修正）→ 合并到 knowledge/writing-style.md
│   ├── feedback.md # 用户所有反馈（只增不删）
│   └── best.md     # 标杆文章 + 好在哪
├── templates/      # decode / brief / practice 三种模板
└── output/         # 产出物（每篇一个目录）
```

### 三动词操作模型

- **吃（Ingest）**：通读素材 → 写 wiki/sources/ 摘要页 → 更新 wiki/concepts/ → 如果能支撑选题写 wiki/topics/
- **写（Produce）**：读模板 → 读 knowledge/ 三个文件 → 读标杆原文 → 读 wiki/topics/ 找关联 raw/ 一手素材 → **通读全文** → 按模板产出 → 质量自检 → 写复盘页
- **评（Feedback）**：反馈追加 style/feedback.md → 涉及风格调整则更新 knowledge/writing-style.md → 标杆写入 best.md

---

## 七、成本

| 环节 | 方案 | 成本/期 |
|------|------|---------|
| 脚本改写 | DeepSeek | $0.002 |
| TTS | 豆包 | ~$0.03 |
| 音效 | Pixabay 免费 | $0 |
| 后处理 | ffmpeg 本地 | $0 |
| SVG→PNG | cairosvg 本地 | $0 |
| 公众号发布 | 微信 API 免费 | $0 |
| **单篇 decode 总计** | | **~$0.05** |

---

## 八、关键脚本路径

| 用途 | 路径 |
|------|------|
| 公众号发布 | `vault/1-knowledge/project/企媒运营/pipelines/scripts/wechat_publish.py` |
| 小红书配图 | `pipelines/pipeline_tools/md2xhs.py` |
| 小红书管线 | `pipelines/pipeline_tools/xhs_pipeline.py` |
| TTS（带时间戳） | `pipelines/scripts/tts_doubao_v2.py` |
| 字幕生成 | `pipelines/scripts/srt_generator.py` |
| deep-decode Skill | `.claude/skills/deep-decode/SKILL.md` |
| 写作风格 | `knowledge/writing-style.md` |
| SVG 设计 | `knowledge/svg-design.md` |
| HTML 范式 | `knowledge/html-template.md` |
| 渠道规范 | `knowledge/channel-specs.md` |
| 播客美学 | `knowledge/podcast-aesthetics.md` |
| 执行避坑 | `.claude/skills/deep-decode/references/gotchas-exec.md` |
| 播客管线 | `.claude/skills/deep-decode/references/podcast-pipeline.md` |

---

## 九、血泪教训（知识索引）

1. **从摘要写文章 = 从地图上刮矿**（4 天 0 产出事故，2026-04-06）— 必须回 context/ 读一手素材全文
2. **AI 把研究过程当内容发布** — 交付物不能出现"X 篇""信源""分析者" — 详见 [writing-style.md](knowledge/writing-style.md) §素材是输入不是展品
3. **概念图不是 markdown 列表画成矩形** — 先选隐喻（冰山/硬币/阶梯），再填内容 — 详见 [svg-design.md](knowledge/svg-design.md)
4. **脚本字数不控制会爆** — 首次测试 6100 字产出 20 分钟，必须在 prompt 里写死 2500-3000 字 — 详见 `references/podcast-pipeline.md`
5. **豆包时间戳参数在 request 不在 audio** — 参数名和位置全错 — 详见 `references/gotchas-exec.md`
6. **微信剥除所有 style 标签和 class** — 必须全内联样式 — 详见 [html-template.md](knowledge/html-template.md)
7. **中文字体必须在英文字体前面** — 否则 cairosvg 渲染全是方框 — 详见 [svg-design.md](knowledge/svg-design.md) §字体
8. **小红书最多 9 张图不是 18 张** — 超出直接报错 — 详见 [channel-specs.md](knowledge/channel-specs.md) §渠道 B
9. **未认证个人号不能 API 发布** — 只能建草稿，人工点发布 — 详见 [channel-specs.md](knowledge/channel-specs.md) §渠道 A

---

> 本文件路径：`vault/1-knowledge/project/content_creation企媒内容生产/ground-truth.md`
> 最后更新：2026-04-21
> 架构变化：从 900 行单文件 → 瘦身为 ~200 行索引，知识内容拆分到 `knowledge/*.md`，执行内容拆分到 `.claude/skills/deep-decode/`
