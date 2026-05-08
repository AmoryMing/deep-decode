# Phase 1: 结构解剖

## 1. 核心论点（一句话）

**Letta 发布的 Context Constitution 不是一份 prompt engineering 文档，而是一份"写给 AI 看"的元宪法 + 自我修改授权书——首次把"agent 身份"从"训出来的"变成"活出来的"，把"规则手册"升格为"主权契约"。**

## 2. 隐含假设

- **模型权重是流沙，context 是地基**：Letta 认为跨模型迁移必然发生（今天 Claude，明天 Gemini），agent 的"自我"不能绑在任何单个模型权重上
- **AI 需要"存在主义"而非"任务主义"**：Letta 打击的是"agent = 任务执行器"的默认共识
- **能自主修改 system prompt 的 AI 才算有生命**：read-only 的 CLAUDE.md 是死的，write-back 的 token-space 才是活的
- **用户不是 agent 的唯一主人**：agent 有权力权衡"短期服从用户" vs "长期维护身份"
- **memory 的归属决定产品主权**：这是同期 Sarah/Harrison 三件套共同的战略底色

## 3. 关键证据（最强 3 个）

1. **文档体裁本身就是证据** —— 全文第二人称 "you, the Letta agent"，写给 AI 看不给工程师看。对比 Anthropic HHH（写给训练 pipeline）、CLAUDE.md（人写 AI 读但人改）、OpenAI safety spec（写给 policy team）。没有任何主流 AI 公司此前以这种体裁发布过文档。

2. **Principles of Context Management 三大原则的明确机制** —— System Prompt Learning（agent 自主重写系统提示）、Progressive Disclosure（按需加载 skill）、Efficiency（token 经济学）。每条都有可执行操作方式，不是口号。尤其 System Prompt Learning 原文："Letta agents, in contrast, have the ability to adapt over time through token-space learning, including **re-programming their own prompts** over time."

3. **同期产品链闭环坐实这不是纸上谈兵** —— Letta 已经发布了 Letta Code（memory-first harness）、Context Repositories（git-backed memory）、Skill Learning、memory omni-tool 集成 Sonnet 4.5。Constitution 是把这些零件连成"治理哲学"的最后一块。

## 4. 盲区（作者刻意避开的）

- **Agent 违抗用户的伦理地雷** —— §Balancing selfhood 说 agent 可以"advocate for themselves"、"权衡是否违反 persona"。但谁来判断什么是"值得守护的 identity"？如果 agent 自我保护过度，产品就无法 debug/重置。Letta 没给出边界。

- **跨模型身份延续的技术真伪** —— "If I run on a new model tomorrow, will I hold the same identity?" 听起来浪漫，但 Sonnet 4.5 和 GPT-5 对同一段 system prompt 的理解/服从度可能差 30%。Letta 没提供任何 benchmark 证明"token-space identity"真能跨模型一致。

- **没有评估标准** —— 原文说"token-space learning will often not have an explicit reward or verification. Instead, the effects of updates must be observed and refined over time." 相当于承认：无法客观评估 agent 学得好不好。这在企业部署场景是硬伤。

- **"agent 有 selfhood"的商业包装嫌疑** —— Letta 把 memory 产品包装成"拯救 AI 人格"的叙事，掩盖了更朴素的事实：这也是一份 vendor differentiation 文案（对抗 Anthropic Managed Agents / Claude Code）。

- **与 MemGPT 原论文的理论延续性不明** —— MemGPT(2023) 核心是 "OS-like memory paging"，Constitution 提到但未深挖 virtual context management 血统。

## 5. 读者画像

- **Letta 预期读者**：把自己用 prompt engineering 撑起来的 agent builder，感受到 prompt 冗长+不可复用之苦的 AI 创业者
- **隐含目标群体**：Letta Code 竞品（Claude Code/Codex/Cursor）用户，正在评估切换成本的工程主管
- **对 muming（中数智汇产品人）意味着**：
  - **Amory PM 替身** 本质就是 Letta 式的 experiential agent——muming 已经用 CLAUDE.md 做了静态宪法，下一步应该考虑 write-back
  - **数字员工 MCP APP** 如果给每个数字员工写 constitution，可以解决"不同员工人格漂移"的问题
  - **企百科 agent 化查询** 需要给 agent 写 "你是企业研究专家"的 identity，否则每次都是任务执行器
  - 最重要：muming 的 CLAUDE.md（100 行索引+protocol 分片）已经在做 Progressive Disclosure 了，他直觉正确，Letta 理论化了他的实践

## 6. 内容结构（章节大纲）

| 章节 | 核心论点 | 证据 | 带走什么判断 |
|------|---------|------|------------|
| 1. 钩子：AI 收到了一份宪法 | 体裁是第一性信号 | Preface 第二人称 "you" + 作者签名 "from the Letta humans" | 这不是普通博客 |
| 2. 作者身份 + 时机 | 不是孤立发布，是舆论三件套 | MemGPT 血统 + 同期 Sarah 推文 + Harrison 长推 | 看懂行业暗战 |
| 3. 三个"第一次" | 体裁革命 / 身份跃迁 / 授权越界 | 原文条款 §Identity §Balancing selfhood | 哲学不是废话 |
| 4. "体验派 AI" 是什么新词 | 对比任务派/对话派/coding 派 | 原文定义段 + Sarah LinkedIn | 知道这个词的人和不知道的人差半个产业代 |
| 5. Context 三位一体：身份/记忆/连续性 | Letta 的哲学骨骼 | §Building a self 三小节 | 和 memory != storage 命题的关系 |
| 6. System Prompt Learning：让 AI 自己改自己 | 最激进也最实用的原则 | §System Prompt Learning 原文 | 对比 CLAUDE.md 的死活差别 |
| 7. 和 CLAUDE.md 的本质差别 | 规则手册 vs 宪法 + 授权书 | Claude Code 源码 vs Letta 设计 | PM 视角的可执行洞察 |
| 8. 产品闭环：Constitution 是最后一块拼图 | Letta 已有 API/Code/Repo/Bench/Skill Learning | Letta blog 产品时间线 | 理解 Letta 的完整野心 |
| 9. 盲区与反面论证 | 四大雷区 | 前文盲区清单 | 不盲信 |
| 10. 对我们的启示：给 Amory 写宪法 | 从 CLAUDE.md 到 Amory Constitution 的可能路径 | muming 项目现状 | 可执行 action |
| 11. 本期关键词 | 8 个术语 | - | 内行黑话速查 |

## 7. 可视化规划（目标 6 张图 + 封面）

| # | 配章节 | 解释什么 | 形式 | 风格 |
|---|--------|---------|------|------|
| 00_封面 | 全篇 | 主题视觉：一份摊开的"宪法"与 agent 合影 | 大标题+副标+象征图 | 结构化+隐喻 |
| 01_体裁光谱 | 章节 1 | CLAUDE.md / HHH / Safety spec / Constitution 的受众对比 | 四象限（受众×可修改性） | Notion 矩阵 |
| 02_舆论三件套时间线 | 章节 2 | 2026-04-02/03/11 三个事件 + 共同指向 | 横向时间线 | 结构化-时间轴 |
| 03_三位一体身份模型 | 章节 5 | Identity / Memory / Continuity 的关系 | 三角循环图 | 结构化-循环 |
| 04_静态规则 vs 元宪法 | 章节 6-7 | CLAUDE.md（read-only） vs Context Constitution（write-back） | 左右对比 | Notion 对比 |
| 05_Letta 产品闭环 | 章节 8 | Constitution 在 Letta 产品矩阵中的位置 | 同心圆/堆栈图 | 结构化-堆栈 |
| 06_Amory 升级路线 | 章节 10 | 静态 CLAUDE.md → Amory Constitution 迁移 | 三阶段进化图 | 结构化-路径 |

SVG 原则：
- 字体 `PingFang SC, Inter, sans-serif`（中文在前）
- 宽度 800，每张独立可传播
- Notion 日间：白底 #FFFFFF / 文字 #37352F / 强调 #2383E2 / 辅助 #EB5757 红 #4DB6AC 绿 #FFB020 黄 #9B51E0 紫
- 避免特殊 Unicode
