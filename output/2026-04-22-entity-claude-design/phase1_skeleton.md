# Phase 1 骨架：Claude Design 横纵分析

slug: 2026-04-22-entity-claude-design
entity_type: product
骨架源: WIKI_ROOT/knowledge/horizontal-vertical-analysis-prompt.md

---

## 【纵向 5 项】沿时间轴追深度

### 1. 起源追溯

**技术理念/需求来源**：Anthropic 从 2024 年底 Claude Code 意外大爆开始，逐渐发现"模型供应商"和"应用公司"的边界正在瓦解。Claude Code 从 2025-05 GA 到 2026-02 做到 $2.5B ARR、4% 全球 GitHub commits，成为"bundle 进订阅 → 用需求数据反推定价"的打法样本。Anthropic Labs（Anthropic 的 AI 安全+研究部门）因此获得一块"研究预览"试验田来复制这条路径到其他品类。Claude Design 的**需求假设**：从 idea 到 shipped product 的链路里，"设计"是唯一没被 Anthropic 自家工具覆盖的环节——Claude 写代码（Code）/写文档（Word/Excel/PPT integrations）/操作浏览器（Chrome）/管理知识工作（Cowork），但设计师/PM/创始人的视觉初稿还得去 Figma 或 Canva 另起锅。

**核心推动者**：Anthropic Labs（官方挂名）；幕后推手是 CPO **Mike Krieger**（前 Instagram 联合创始人，2024 年加入 Anthropic），他对应用层产品和视觉设计有深度理解——这个人的加入本身就是 Anthropic 从"AI 实验室"转"产品公司"的信号。

**当时行业环境（2026-04）**：
- **AI 设计工具**已乱战一年：Figma Make（2025-05）、v0 by Vercel、Galileo AI 被 Google 收编成 Stitch、Uizard、Canva Magic Studio 全面铺开
- **设计圈心态撕裂**：Figma CEO Dylan Field 2026-04-12 刚在访谈里说"taste, craft, POV 是 AI 不能替代的 3 件事"，防御姿态明显
- **Anthropic 资本势能拉满**：2026-02 刚拿 Series G $30B @ $380B，$14B ARR，业内公认"史上增长最快的软件公司"，准备 2026-10 IPO
- **Figma 股价 12 个月累跌近 50%**，投资者已经在问"AI 时代 Figma 值不值 80% 市占率的估值"

### 2. 诞生节点

**2026-04-17（周五）**：Anthropic Labs 发布 Claude Design，同日 Drop 四件套：
1. Claude Opus 4.7（最强视觉模型）
2. Claude Design（本文主角）
3. Claude Code 新增 /ultrareview 命令
4. Claude Code auto mode 扩展到 Max 用户

**最初形态**：research preview（研究预览）。对所有付费订阅者（Pro $20、Max $100/$200、Team $25/seat、Enterprise 自协议）免费开放，不额外收费，超额部分按 API pay-as-you-go 计价（Opus 4.7：$5/$25 per MTok）。

**入口**：claude.ai/design（登录付费账号后可用）

**宣传定位**：一句话标语"让你用对话做设计稿、原型、幻灯片、单页图"。官方口径刻意含糊：对 TechCrunch 说"补充 Canva 不是取代"，对 VentureBeat 说"meet teams where they already work"——典型的"先放进市场，再看用户怎么用"打法。

### 3. 演进历程（关键节点时间线）

研究预览才 5 天，产品本身没有"演进"可言。但**前因时间线**丰满，构成 Claude Design 能被这么快推出的铺垫：

| 日期 | 事件 | 因果关联 |
|------|------|---------|
| 2024-11 | Anthropic Series D $4B @ $40B | 开始资本军备 |
| 2025-05 | Claude Code GA | bundle 打法第一枪成功 |
| 2025 年底 | ~$9B ARR | 收入曲线进入陡峭段 |
| 2026-01 | 单月发布 30+ 产品功能，含 Claude Cowork | Anthropic Labs 进入"月度铺产品"节奏 |
| 2026-02 | Series G $30B @ $380B，$14B ARR | 有钱+有数据双重底气 |
| 2026-03 | $20B ARR | 比 2025 年底 2x 多，全年预期 $26B 已被提前打穿 |
| **2026-04-12** | Figma CEO Dylan Field 发访谈"AI 不能替代的 3 件事" | 防御姿态公开化 |
| **2026-04-14** | **Mike Krieger 辞 Figma 董事会** | SEC filing 写 "no disagreement"；Figma 股价反涨 5%（市场误读） |
| **2026-04-17** | **Claude Opus 4.7 + Claude Design 同日发布** | **决定性时刻** |
| 2026-04-17 | Figma 股价跌 5%，Adobe 同跌 | 市场连点成线 |
| 2026-04 起 | $30B ARR 估算；备战 2026-10 IPO（目标 $60B 融资） | IPO 前夜"战功展示窗口" |

### 4. 决策逻辑（为什么选 A 不选 B）

三处关键决策还原：

**① 为什么用 Anthropic Labs 品牌而不是 Anthropic 主品牌？**
- 选 A（Labs）：给"研究预览"留未来调整空间。如果产品不成功可以悄悄下架或 pivot，不伤主品牌。Google 在 Gemini Labs 用过同样的打法
- 选 B（主品牌）：承诺更重，定价空间反而小
- **约束**：Claude Design 的质量还没到商业 GA 级别（The New Stack 记者亲测 50% weekly quota 吃一个 design system）

**② 为什么 bundle 进订阅不单独定价？**
- 选 A（bundle）：复制 Claude Code 的路径——"先把工具放进用户手里，用 demonstrated value 反推定价"。Anthropic 在 VentureBeat 背景采访里明确说了这个逻辑
- 选 B（单独定价 $XX/月）：Figma/Canva/Adobe 都这么干。但那需要先说服用户"值这个价"——Anthropic 还没这个 brand permission
- **约束**：Claude Code 成功证明了 bundle 打法在 AI 原生产品上有效，路径复用风险低

**③ 为什么导出选项有 Canva、Claude Code、PDF、PPTX、HTML，唯独没有 Figma？**
- 选 A（不做 Figma 导出）：给 Figma 设一个"你必须被动适应"的信号。Canva CEO 当天就签了 native 集成，Figma 被晾在外面
- 选 B（做 Figma 导出）：降低设计师迁移成本
- **约束**：Krieger 刚辞 Figma 董事会 3 天，Anthropic 这个选择是**战略姿态**不是技术疏漏

### 5. 叙事弧线规划（起承转合）

- **铺垫（2024-2025 整年）**：Claude Code 悄悄跑到 $2.5B ARR，Anthropic 内部意识到"bundle → 需求验证 → 货币化"是可复用套路
- **蓄力（2026-01~03）**：月度铺产品，Series G 拿到 $30B，$14B→$20B→$30B ARR 三级跳
- **明牌（2026-04-12~14）**：Dylan Field 公开谈"AI 不能替代设计"，紧接着 Krieger 退 Figma 董事会——业内老玩家都嗅到味道了但还在猜
- **爆发（2026-04-17）**：Claude Design + Opus 4.7 同日发布，Figma/Adobe 股价当天跌
- **转折（未来 6-12 个月，Linas 的预判）**：先行者用 Claude Design + Claude Code handoff bundle 压缩 design-to-prod 周期，建立肌肉记忆；Figma/Adobe/Google 出击反攻窗口收窄

---

## 【横向 4 项】同期赛道切面

### 6. 竞品场景判断

**场景 C：竞品充分（3+）**。AI 设计工具市场 2024-2026 两年狂奔，已形成清晰的 3 层格局：
- 设计师原生工具带 AI（Figma Make / Adobe Firefly）
- 代码产出型（v0 / Lovable）
- 生成式可视化（Canva Magic Studio / Galileo AI）

Claude Design 插进来的是第 4 层——"对话式全流程，输出直连 Code"。

选 5 个主要竞品做逐一对比（按相关性排序）：Figma Make / Canva Magic Studio / Adobe Firefly / v0 by Vercel / Galileo AI。Uizard / Framer AI / Lovable 简要提及。

### 7. 竞品逐一（每个 1500+ 字展开，此处先列要点）

#### Figma Make（最关键对手）
- **时间**：2025-05 launch，2025-07 GA
- **路线**：Figma 原生 AI 工具，紧贴现有 canvas
- **目标用户**：已在 Figma 的设计师 + 非设计师
- **优势**：设计师肌肉记忆、2/3 Figma 用户已非设计师（Dylan Field 数据）、80-90% UX 市占率
- **短板**：文档输入（DOCX/PPTX/XLSX）能力弱；没有 Claude Code 式 dev handoff
- **定价**：bundle 进 Figma seat $15-45/月
- **真实口碑**：Medium 评测"credit 限制感觉紧"；Lenny Rachitsky 记 Dylan Field"focus on time-to-value"

#### Canva Magic Studio
- **路线**：大众品牌可视化 AI，模板驱动
- **目标用户**：营销、小企业、内容创作者
- **优势**：渠道、已有数亿用户基数、模板库
- **短板**：高质量 UI 原型产出弱，几乎不做产品设计
- **定价**：bundle 进 Canva $12.99/月
- **和 Claude Design 关系**：**直接打通 native 集成**——Claude Design 输出可一键送 Canva 编辑。这是 Claude Design 最友好的外部生态

#### Adobe Firefly + GenStudio
- **路线**：企业合规 + 商业安全素材，嵌 PS/AI/PR
- **目标用户**：企业营销团队、被法务盯的大公司
- **优势**：商业合规"indemnification"（出事 Adobe 赔）、生态深
- **短板**：贵、学习曲线、非 AI-first
- **定价**：Creative Cloud $60+/月
- **状态**：股价受 AI 冲击，FY2025 收入 $23.77B 但投资者在问未来

#### v0 by Vercel
- **路线**：代码产出（React + shadcn）
- **目标用户**：前端开发者
- **优势**：代码质量业内最好、Vercel 部署直连
- **短板**：不是设计工具，产出是代码不是视觉稿
- **定价**：$20/月
- **和 Claude Design 关系**：间接竞争——Claude Design 的"handoff 到 Claude Code"就是要抢 v0 的开发者用户

#### Galileo AI（Google 收编成 Stitch）
- **路线**：text-to-UI 高保真
- **目标用户**：产品设计师、UX 团队
- **优势**：免费（Google 补贴）、高保真输出
- **短板**：HN 用户吐槽"有时陷入奇怪循环，以为做了其实没做"
- **定价**：免费 / 增值未定
- **状态**：Google 的答卷

### 8. 生态位分析

**Claude Design 在赛道版图占据的位置**：

```
            「要代码」────────────「要视觉稿」
              ↑                         ↑
              |                         |
     v0 by Vercel          Figma Make / Galileo AI
              ↖                         ↗
                ↖                     ↗
       Claude Design（在两者交汇处，独占"对话 → 视觉稿 → 代码"全链路）
                ↓                     ↓
              Canva Magic Studio（品牌素材）
              Adobe Firefly（商业合规）
```

**填补的空白**：
- 现有 AI 设计工具要么给设计师（Figma Make）、要么给开发者（v0）、要么给营销（Canva），**没有一个工具说"非设计师但想要一整条 idea-to-production 链路"**
- Claude Design 用 Claude Code handoff 把这条链路走通

**正面竞争的对象**：
- Figma Make（争设计师和 PM）
- v0（争前端开发者）

**护城河**：
- Claude Code 现成的 $2.5B ARR 用户基数（开发者导入链路）
- Opus 4.7 模型领先（Anthropic 自家人用自家最强模型）
- Mike Krieger 从 Figma 带出来的产品洞察（推测但高可信度）

### 9. 趋势判断

**未来 12-24 个月可能走向**：

**机会面**：
- bundle 进 Claude 订阅大幅降低试用门槛，像 Claude Code 一样"意外爆发"
- Anthropic 2026-10 IPO 前需要"战功展示"，Claude Design 是天然的应用层故事
- Claude Code 用户群（4% GitHub commits）一键导流
- MCP 协议开放，第三方工具可接入 Claude Design（Figma 被逼做 MCP）

**风险面**：
- **Token 成本问题**：HN 和 Reddit 多处反馈 weekly quota 50% 一个 design system 就吃掉，付费用户抱怨激烈，如果 Opus 4.7 推理成本下不来商业化艰难
- **Figma 反击**：Figma Make 本身是 Figma 的 AI 答卷，迭代速度会加速；Figma 80-90% UX 市占率的迁移成本不是 5 天能冲掉的
- **Adobe + Google 未发招**：Adobe Firefly 企业合规护城河；Google 有 Gemini 3 + Stitch + Slides 的组合拳
- **Research preview 陷阱**：如果停在 preview 半年以上，用户期待会冷却（Claude Cowork 有这个迹象）
- **Figma 股价已经在价内打进风险**（12 月累跌 50%），说明市场对 AI 替代论已经 partially priced-in，Claude Design 发布的边际震撼可能比预期小

**Linas Beliūnas 判断**：先行者有 6-12 个月窗口用 Claude Design + Claude Code handoff 建立肌肉记忆，Q4 各家会齐头并进。

---

## 【交汇 1 项】横纵交汇 & 可视化规划

### 10. 横纵交汇的新判断

纵向看到的**不是产品故事，是 Anthropic 战略转型**：从 2024-11 Series D $4B 到 2026-04 $30B ARR，Anthropic 完成从"模型供应商"到"全栈产品公司"的身份切换。Claude Design 不是一个设计工具——它是这个转型在设计品类的落地信号。

横向看到的**不是竞品对比，是价值链重构**：AI 设计工具过去一年的本质争论是"AI 替代谁"——替代设计师？替代工具？替代流程？Claude Design 给了第三个答案：**都不替代，但把 idea-to-production 链路整个收进 Anthropic 生态内**。Figma 负责一张稿子的精修，Claude Design 负责"从 0 到 1 到 code"。

**原创概念命名**（候选）：
- "**链路内包策略**"（in-ecosystem value chain capture）——不跟 Figma 抢单点精修，而是把 idea→design→code 整条链路圈进 Claude 生态
- "**Anthropic Labs 沙盒打法**"——用"研究预览"降低失败惩罚 + bundle 订阅降低用户门槛 + Claude Code handoff 做生态粘合，三位一体

**未来 12-24 个月具体推测**：
- **6 个月内**：Claude Design 可能离开 research preview，或者推出"Claude Design Pro"单独定价。同时 Claude Code handoff 会被打磨成"一键出产品"卖点
- **12 个月内**：Figma 会做 MCP 集成 + 强化 Figma Make + 可能收购 Galileo 后的替代品；Adobe 推出 Firefly 对 Claude Design 的直接回击
- **24 个月内**：如果 Anthropic IPO 成功 + $60B 融资到位，Claude Design 会整合进一个更大的 "Claude Studio"（我的预测）——把 Code/Design/Cowork/Chrome 统一成一个超级应用。Figma 可能被 Adobe 或微软收购

**对 AI 从业者（你）的 actionable insight**：
- 如果你在企媒/产品岗需要做设计稿/PPT/原型——**现在就上 Claude Design**（已付 Max 订阅更值），6-12 月先行者窗口期
- 如果你在做产品拆解的内容——**Anthropic 的"bundle 订阅 + demonstrated value → 货币化"打法是 2026 下半年所有 AI 公司会抄的模板**
- 如果你在评估设计工具订阅——**别砍 Figma 订阅，但可以砍 Canva Pro / Adobe CC**（Claude Design 的 PPTX/PDF 导出已经覆盖中间需求）

### 可视化规划（6-10 张 SVG）

| 编号 | 主题 | 类型 | 核心信息 |
|------|------|------|---------|
| 00_封面 | Claude Design 横纵拆解 | 封面设计 | 产品名 + 拆解日期 + 横纵分析法 logo |
| 01_时间线 | Anthropic 2024-2026 战略转型时间线 | 水平时间轴 | 从 Series D 到 Claude Design，标注决定性时刻 |
| 02_竞品矩阵 | AI 设计工具竞品矩阵 | 2×2 矩阵（代码↔视觉稿 × 开发者↔设计师↔非专业） | Claude Design 独占中间交汇区 |
| 03_生态位图 | Claude Design 生态位 | 同心圆或 Venn | Anthropic Labs 全栈产品矩阵（Code/Cowork/Chrome/Office/Design）形成的护城河 |
| 04_关键转折 | 2026-04 连点成线 | 4 步流程图 | Krieger 辞职 → Opus 4.7 → Design 发布 → Figma 股价跌 |
| 05_链路对比 | 传统 vs Claude Design 链路 | 流程对比（上下两行） | 传统：idea→Canva→Figma→handoff→Claude Code → 部署；Claude Design：idea→Design→Code 一键 |
| 06_趋势预判 | 12-24 月推测 | 时间分层卡片 | 6 月 / 12 月 / 24 月三段预测 |

---

## Phase 2 信源需求清单

骨架里每个关键主张需要的补证据：
1. Anthropic Labs 成立时间和 CPO Krieger 履历（补官方 about + LinkedIn）
2. Claude Code $2.5B ARR + 4% GitHub commits 原始数据（Anthropic 官方 + SemiAnalysis）
3. Krieger 辞 Figma 董事会 SEC filing 原文
4. Figma 股价走势（FIG ticker，12 月）
5. Dylan Field 2026-04-12 访谈完整引用
6. Datadog PM Aneesh Kethini 原话（AdWeek 已有，交叉验证）
7. The New Stack 亲测"50% weekly quota"原文引用
8. HN 高赞评论 2-3 条真实用户口碑
9. Figma Make GA 日期（2025-07）和市占率引用
10. Adobe FY2025 $23.77B 收入原始来源
11. v0 by Vercel 用户数、Galileo 被 Google 收购细节
12. Anthropic Series G 官方融资稿
13. Opus 4.7 定价细节（$5/$25 per MTok）
14. Anthropic 潜在 IPO 时间线（$60B 融资目标）
15. 2/3 Figma 用户非设计师的 Dylan Field 数据出处
