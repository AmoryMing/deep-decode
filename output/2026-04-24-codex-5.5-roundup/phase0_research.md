# Phase 0 调研原料 — GPT-5.5 / Codex 5.5 周报综述
> 写于 2026-04-24 | 情报兵：document-specialist | 用途：喂给下游写作，不是最终产出

---

## 线 1：GPT-5.5 / Codex 5.5 发布本身

### 时间线

**时间线**：
- 2026-04-08：Codex 宣布突破 300 万周活跃用户，Sam Altman 宣布重置用量上限，并承诺"每多 100 万用户重置一次，直到 1000 万"
- 2026-04-16：OpenAI 发布"Codex for (almost) everything"应用重大更新（独立于 GPT-5.5 发布）
- 2026-04-22：GPT-5.5 提前泄露到 Codex 生产环境（内部测试环境误部署到线上，开发者发现模型标注为"最尖端的 agent 编程模型"）
- 2026-04-23：GPT-5.5 正式发布，向 ChatGPT Plus / Pro / Business / Enterprise 用户推送；Codex 同步跟进
- 2026-04-23 同日：OpenAI Developer Community 发帖确认上线，API"即将开放，很快"

**关键事实**：
- 发布日期：2026-04-23（官方正式）[https://openai.com/index/introducing-gpt-5-5/](https://openai.com/index/introducing-gpt-5-5/)
- API 定价：输入 $5/百万 token，输出 $30/百万 token（相比 GPT-5.4 的 $2.5/$15，双倍）[https://developers.openai.com/codex/pricing](https://developers.openai.com/codex/pricing)
- GPT-5.5 Pro 定价：$30 输入 / $180 输出（与 GPT-5.4 Pro 持平）
- 上下文窗口：API 1M token；Codex App 内 400K token
- 发布节奏：GPT-5.4 发布于 2026 年 3 月，5.5 仅隔约 6 周
- Codex 周活跃用户：3M（2026-04-08）→ 4M（2026-04-23 前后，Fortune 报道确认）[https://www.businesstoday.in/technology/story/openai-codex-celebrates-3-million-weekly-users-ceo-sam-altman-resets-usage-limits-524717-2026-04-08](https://www.businesstoday.in/technology/story/openai-codex-celebrates-3-million-weekly-users-ceo-sam-altman-resets-usage-limits-524717-2026-04-08) [https://www.neowin.net/news/openais-codex-hits-4-million-weekly-active-users-adding-1-million-in-just-two-weeks/](https://www.neowin.net/news/openais-codex-hits-4-million-weekly-active-users-adding-1-million-in-just-two-weeks/)
- ChatGPT 付费用户：5000 万订阅者，900+ 万每周活跃用户 [https://fortune.com/2026/04/23/openai-releases-gpt-5-5/](https://fortune.com/2026/04/23/openai-releases-gpt-5-5/)

**Benchmark 核心数据**（来源：the-decoder.com, lushbinary.com, marktechpost.com）：

| Benchmark | GPT-5.5 | Claude Opus 4.7 | 胜者 |
|-----------|---------|-----------------|------|
| Terminal-Bench 2.0 | **82.7%** | 69.4% | GPT-5.5 |
| Expert-SWE (20h tasks) | **73.1%** | - | GPT-5.5 |
| GDPval（知识工作） | **84.9%** | ~78% | GPT-5.5 |
| OSWorld-Verified（电脑操控） | **78.7%** | ~65% | GPT-5.5 |
| MRCR v2 长上下文（512K-1M） | **74.0%** | 32.2% | GPT-5.5 大幅领先 |
| SWE-bench Pro（多文件代码修复） | 58.6% | **64.3%** | Claude Opus 4.7 |
| SWE-bench Verified | ~85% | **87.6%** | Claude Opus 4.7 |
| CursorBench（IDE 集成） | ~65% | **70%** | Claude Opus 4.7 |
| GPQA Diamond（推理） | ~93% | **94.2%** | Claude Opus 4.7 |
| FrontierMath Tier 4 | **35.4%** | 22.9% | GPT-5.5 |

[https://the-decoder.com/openai-unveils-gpt-5-5-claims-a-new-class-of-intelligence-at-double-the-api-price/](https://the-decoder.com/openai-unveils-gpt-5-5-claims-a-new-class-of-intelligence-for-real-work-at-double-the-api-price/)
[https://lushbinary.com/blog/gpt-5-5-vs-claude-opus-4-7-comparison-benchmarks-pricing/](https://lushbinary.com/blog/gpt-5-5-vs-claude-opus-4-7-comparison-benchmarks-pricing/)

**原话引用**（必须保留原文英文 + 中文翻译）：

> "A new class of intelligence for real work." —— Greg Brockman / OpenAI（9to5Mac 报道）
> 中文：为真实工作带来的新一级智能。

> "Way more intuitive to use—it can look at an unclear problem and figure out what needs to happen next." —— Greg Brockman / Fortune [https://fortune.com/2026/04/23/openai-releases-gpt-5-5/](https://fortune.com/2026/04/23/openai-releases-gpt-5-5/)
> 中文：用起来直觉性强太多——它能看着一个模糊的问题，自己弄清楚下一步该做什么。

> "It's a faster, sharper thinker for fewer tokens compared to something like 5.4." —— Greg Brockman / Fortune
> 中文：相比 5.4，它用更少的 token 完成同等任务，思维更快更准。

> "To celebrate 3 million weekly Codex users, we are resetting usage limits. We will do this for every million users up to 10 million. Happy building!" —— Sam Altman / X（2026-04-08）[https://www.businesstoday.in/technology/story/openai-codex-celebrates-3-million-weekly-users-ceo-sam-altman-resets-usage-limits-524717-2026-04-08](https://www.businesstoday.in/technology/story/openai-codex-celebrates-3-million-weekly-users-ceo-sam-altman-resets-usage-limits-524717-2026-04-08)
> 中文：庆祝 Codex 突破 300 万周活跃用户，我们重置用量上限。每多 100 万用户就做一次，直到 1000 万。尽情构建吧！

> "An impressive hallucination resistance... a step change with this model." —— Leigh-Ann Russell（BNY Mellon CIO）/ Fortune
> 中文：令人印象深刻的抗幻觉能力……这个模型是一次质的飞跃。

**判断**：
- GPT-5.5 不是全面碾压，而是**分叉领先**：Terminal-Bench / 长上下文 / 电脑操控，GPT-5.5 明显胜；SWE-bench（多文件代码工程）、CursorBench（IDE 集成），Claude Opus 4.7 胜。这对 AI Force 团队的实操意义是：用 Codex 跑自动化 DevOps 任务、CI/CD、终端脚本生成，可能比 Claude Code 更快；但真正改动复杂多文件代码库，Claude Code 仍更可靠
- MRCR v2 长上下文的差距（74% vs 32.2%）是目前最值得关注的隐藏信号：整个代码仓库塞进上下文的时代已经到来，GPT-5.5 提前做好了准备
- 6 周发一版的节奏，OpenAI 主席 Jakub Pachocki 暗示会持续，这是"每周 sprint"而非季度发布，对竞对形成持续压力
- 定价翻倍但 Token 效率更高，实际成本是否翻倍需要实测——OpenAI 自称"完成等效 Codex 任务消耗更少 token"

**交叉验证**：
1. 官方：[https://openai.com/index/introducing-gpt-5-5/](https://openai.com/index/introducing-gpt-5-5/)
2. 第三方技术媒体：[https://the-decoder.com/openai-unveils-gpt-5-5-claims-a-new-class-of-intelligence-at-double-the-api-price/](https://the-decoder.com/openai-unveils-gpt-5-5-claims-a-new-class-of-intelligence-at-double-the-api-price/)
3. 开发者评测：[https://simonwillison.net/2026/Apr/23/gpt-5-5/](https://simonwillison.net/2026/Apr/23/gpt-5-5/)
4. 社区：[https://community.openai.com/t/gpt-5-5-is-here-available-in-codex-and-chatgpt-today/1379630](https://community.openai.com/t/gpt-5-5-is-here-available-in-codex-and-chatgpt-today/1379630)
5. 综合对比：[https://lushbinary.com/blog/gpt-5-5-vs-claude-opus-4-7-comparison-benchmarks-pricing/](https://lushbinary.com/blog/gpt-5-5-vs-claude-opus-4-7-comparison-benchmarks-pricing/)

---

## 线 2：Anthropic / Claude 阵营反应

### 2a：Claude Opus 4.7 发布（GPT-5.5 前一周）

**时间线**：
- 2026-04-16：Claude Opus 4.7 GA 发布（GitHub Changelog 确认）[https://github.blog/changelog/2026-04-16-claude-opus-4-7-is-generally-available/](https://github.blog/changelog/2026-04-16-claude-opus-4-7-is-generally-available/)
- 2026-04-20：进入 Amazon Bedrock [https://aws.amazon.com/blogs/aws/aws-weekly-roundup-claude-opus-4-7-in-amazon-bedrock-aws-interconnect-ga-and-more-april-20-2026/](https://aws.amazon.com/blogs/aws/aws-weekly-roundup-claude-opus-4-7-in-amazon-bedrock-aws-interconnect-ga-and-more-april-20-2026/)
- 2026-04-23：GPT-5.5 发布，与 Opus 4.7 正面对抗

**关键事实**：
- SWE-bench Pro：64.3%（较 Opus 4.6 提升 11 个百分点）[https://llm-stats.com/blog/research/claude-opus-4-7-launch](https://llm-stats.com/blog/research/claude-opus-4-7-launch)
- SWE-bench Verified：87.6%（+6.8pp vs 4.6）
- 定价：$5 输入 / $25 输出（每百万 token），与 Opus 4.6 持平
- 新特性：xhigh 推理层级、自适应思考（Adaptive Thinking，去掉固定思考预算）、3.3x 高分辨率视觉（最高 2576px / 3.75MP）、Task Budgets（公测）、/ultrareview 命令
- Claude Code 默认推理从 medium 恢复到 xhigh（回滚时间：4 月 7 日，Opus 4.7 发布前）

**原话引用**：

> "A notable improvement on Opus 4.6 in advanced software engineering, with particular gains on the most difficult tasks." —— Anthropic 官方 [https://platform.claude.com/docs/en/about-claude/models/whats-new-claude-4-7](https://platform.claude.com/docs/en/about-claude/models/whats-new-claude-4-7)
> 中文：在高级软件工程方面相较 Opus 4.6 有显著提升，在最困难的任务上进步尤为突出。

**判断**：
- Opus 4.7 在 2026-04-16 发布，GPT-5.5 在 4-23 发布，间隔恰好一周。这不像巧合——两边都在抢占同一波舆论窗口
- Anthropic 在代码质量 benchmark（SWE-bench）打赢了 GPT-5.5，但在 agentic 任务（Terminal-Bench、OSWorld）输了。这说明 Anthropic 的赌注是：**代码工程质量优先，而非自动化 agent 速度**
- SWE-bench Pro 64.3% vs GPT-5.5 58.6%：这 5.7 个百分点的差在真实多文件 PR 场景里是实质差距，Anthropic 高层应当会在媒体叙事中着重强调

### 2b：Claude Code 从 Pro 计划移除事件

**时间线**：
- 2026-04-21（下午）：Anthropic 悄悄从 $20/月 Pro 计划定价页移除 Claude Code，文档同步从"Pro 或 Max 计划"改为"仅 Max 计划"
- 同日：开发者在 Hacker News / Reddit / X 截图曝光，迅速发酵（Hacker News 帖子 1 小时内 100+ 票）[https://news.ycombinator.com/item?id=47854477](https://news.ycombinator.com/item?id=47854477)
- 同日（晚些）：Anthropic 增长主管 Amol Avasare 在 X 发文解释
- 随后几天：定价页恢复勾选，但部分文档变更保留

**关键事实**：
- 实际影响：新 Pro 用户需要从 $20 升到 $100/月（Max 5x）或 $200/月（Max 20x）才能用 Claude Code，涨幅 5 倍 [https://www.theregister.com/2026/04/22/anthropic_removes_claude_code_pro/](https://www.theregister.com/2026/04/22/anthropic_removes_claude_code_pro/)
- 官方口径：测试范围仅 ~2% 新用户
- 现有 Pro 用户不受影响
- 背景：Opus 4.7 发布后，Claude Code 会话时长剧增（用户报告单次会话长达数小时，自动化工作流在后台持续运行）
- Anthropic 于 2026 年 2 月签下 $250 亿 Amazon 算力协议，但当前仍面临算力供应紧张 [https://startupfortune.com/anthropic-tests-pulling-claude-code-from-its-pro-plan-and-the-move-reveals-an-uncomfortable-truth-about-ai-pricing/](https://startupfortune.com/anthropic-tests-pulling-claude-code-from-its-pro-plan-and-the-move-reveals-an-uncomfortable-truth-about-ai-pricing/)

**原话引用**：

> "For clarity, we're running a small test on ~2 percent of new prosumer signups." —— Amol Avasare（Anthropic 增长主管）/ X [https://www.theregister.com/2026/04/22/anthropic_removes_claude_code_pro/](https://www.theregister.com/2026/04/22/anthropic_removes_claude_code_pro/)
> 中文：明确说明：我们正在对约 2% 的新专业消费者用户进行小规模测试。

> "Usage has changed a lot and our current plans weren't built for this." —— Amol Avasare / X
> 中文：使用模式变化很大，我们现有的计划方案并不是为此设计的。

> "Per-subscriber usage has increased significantly, and our current plan architecture was not designed for this scale." —— Amol Avasare / TechFlowPost [https://www.techflowpost.com/en-US/article/31254](https://www.techflowpost.com/en-US/article/31254)
> 中文：每个订阅用户的使用量大幅增加，我们现有的计划架构不是为这种规模设计的。

> "Codex will remain available in both the free and Plus ($20/month) plans. We have the compute capacity and efficient models to support it." —— OpenAI Codex 团队 / TechFlowPost（对 Anthropic 移除动作的公开回应）
> 中文：Codex 将在免费版和 Plus（$20/月）计划中继续开放。我们有算力和高效模型支撑它。

**判断**：
- 这次操作是 Anthropic 的一次**公关事故**：即便是 2% 的测试，悄悄改文档而不提前通知用户，说明内部流程出了问题。Avasare 后来承诺"以后有变化你们会先从我们这里听到，不是从 X 或 Reddit 的截图"——承认了这一点
- OpenAI 的反应极为迅速：几乎同时发文确认 Codex 留在免费/Plus 计划。这是一次精准的竞争性打击，时机不像巧合
- 更深层信号：Claude Code 的 agentic 使用比 Anthropic 预期的重得多。每个 Pro 用户跑的不再是聊天，而是长达数小时的 agent loop，Anthropic 的订阅定价模型建立在聊天式使用假设上，已经失效
- 这与 GPT-5.5 发布的时间高度重叠（4-21 Claude Code 被移除，4-23 GPT-5.5 发布），形成了对 Anthropic 的双重压力：一边是开发者社区愤怒，一边是 OpenAI 发布更强模型并抢先宣布"我们不移除"

### 2c：Claude 降智事件三连（已修复）

**时间线**（来源：The Register [https://www.theregister.com/2026/04/23/anthropic_says_it_has_fixed/](https://www.theregister.com/2026/04/23/anthropic_says_it_has_fixed/)）：
- 2026-03-04 至 04-07：Claude Code 默认推理从 high 调为 medium（降低延迟），被用户感知为"变笨了"。4-07 回滚，v2.1.118 恢复 xhigh 默认
- 2026-03-26 至 04-10：缓存 bug——原本清理"空闲思考会话"的逻辑，误写成每次 prompt-response 循环都清除缓存，导致 Claude 变得"健忘且重复"。4-10 修复 Sonnet 4.6 / Opus 4.6
- 2026-04-16 至 04-20：系统 prompt 加了字数限制（工具调用间 25 词，最终回应 100 词），内部消融测试发现 Opus 4.6 / Opus 4.7 均下降 3%。4-20 回滚

**原话引用**：

> "This was the wrong tradeoff." —— Anthropic（关于把默认推理从 high 改为 medium）/ The Register [https://www.theregister.com/2026/04/23/anthropic_says_it_has_fixed/](https://www.theregister.com/2026/04/23/anthropic_says_it_has_fixed/)
> 中文：这是错误的权衡。

**判断**：
- 三个 bug 发生在不同时间，但 Anthropic 选择在 GPT-5.5 发布后第二天（4-23）集中披露和承认，这是危机公关的主动管控，也说明内部已经意识到 PR 风险
- 三个 bug 叠加期（3 月底到 4 月中）正好是 Opus 4.7 发布前的备战期，意味着这段时间很多开发者在用的 Claude Code 实际上是被"限频版"，影响了社区对 Anthropic 的印象
- Dario Amodei 没有对 GPT-5.5 发表直接公开声明（搜索结果未找到）。4 月期间他主要在处理与白宫的关系（与白宫幕僚长和财政部长的"和解谈判"）——这意味着 Anthropic 技术层面的叙事没有 CEO 级别的声音背书

**交叉验证**：
1. The Register 报道（移除）：[https://www.theregister.com/2026/04/22/anthropic_removes_claude_code_pro/](https://www.theregister.com/2026/04/22/anthropic_removes_claude_code_pro/)
2. The Register 报道（修复）：[https://www.theregister.com/2026/04/23/anthropic_says_it_has_fixed/](https://www.theregister.com/2026/04/23/anthropic_says_it_has_fixed/)
3. Where's Your Ed At（深度分析）：[https://www.wheresyoured.at/news-anthropic-removes-pro-cc/](https://www.wheresyoured.at/news-anthropic-removes-pro-cc/)
4. StartupFortune（定价结构分析）：[https://startupfortune.com/anthropic-tests-pulling-claude-code-from-its-pro-plan-and-the-move-reveals-an-uncomfortable-truth-about-ai-pricing/](https://startupfortune.com/anthropic-tests-pulling-claude-code-from-its-pro-plan-and-the-move-reveals-an-uncomfortable-truth-about-ai-pricing/)
5. HackerNews 讨论：[https://news.ycombinator.com/item?id=47854477](https://news.ycombinator.com/item?id=47854477)

---

## 线 3：开发者实测口碑

### 3a：Simon Willison 实测（最权威的独立开发者评测）

**时间线**：2026-04-23 发布 [https://simonwillison.net/2026/Apr/23/gpt-5-5/](https://simonwillison.net/2026/Apr/23/gpt-5-5/)

**关键事实**：
- Willison 用 Claude Code 反向工程了 openai/codex 仓库，弄清楚认证 token 的存储方式，构建了 `llm-openai-via-codex` 插件，让现有 Codex 订阅用户直接通过 API 调用 GPT-5.5（官方 API 尚未开放时的"后门"方案）
- 测试方法：Pelican SVG Benchmark（标准化视觉创作任务，Willison 长期用于横向对比各模型）
- 命令：`llm -m openai-codex/gpt-5.5 'Generate an SVG of a pelican riding a bicycle'`

**测试结果**：
- 默认推理（39 reasoning tokens）：输出基础骑车鹈鹕，质量平平，**不如 GPT-5.4 默认设置**
- xhigh 推理（9,322 reasoning tokens，耗时约 4 分钟）：输出带渐变色和精细细节的高质量 SVG，明显优于默认

**原话引用**：

> "the jagged frontier continues to hold" —— Ethan Mollick（援引自 Willison 文章）/ simonwillison.net
> 中文：锯齿形前沿依然成立——GPT-5.5 在不同任务上的表现差异悬殊，难以预测。

**判断**：
- "默认设置不如 5.4" 这个发现非常重要：意味着 GPT-5.5 的能力提升只在开启推理模式后才显现。对日常用 Codex 的开发者来说，如果不主动启用 xhigh，可能感知不到升级
- Willison 用 Claude Code 破解 Codex 认证来测 GPT-5.5——这个行为本身就是一个很好的故事：两个竞对工具的能力被一个开发者用来相互配合
- 9,322 tokens、4 分钟换来更好的 SVG：推理 token 消耗是默认的 239 倍，成本极高。这对 token 效率叙事是个反例

### 3b：XDA Developers 一周切换测评（Codex 替代 Claude Code）

**来源**：[https://www.xda-developers.com/ditched-claude-code-for-codex/](https://www.xda-developers.com/ditched-claude-code-for-codex/)

**关键发现**：

**Claude Code 的实际优势**：
- 相同 prompt 下，Claude Code 会先提问约 10 个澄清问题再动手，Codex 直接开始构建
- 结果：Claude Code 版本更符合作者预期（因为前期对齐）
- API 选择案例：Codex 自动选了 Anthropic API（讽刺：OpenAI 产品默认用竞对 API），而 Claude Code 分析了各提供商的权衡、成本和效率，最终版本单次任务成本更低

**Codex 的实际优势**：
- 有免费层（Claude Code 需要付费订阅）
- Pro 层配额上限比 Claude Max 5x（$100/月）更大方
- 并行执行：Codex 可以同时跑多个任务在独立沙箱，Claude Code 是串行的

**原话引用**：

> "Claude Code's habit of asking questions, explaining trade-offs, and walking you through options is a genuinely educational experience." —— XDA Developers 作者 / [https://www.xda-developers.com/ditched-claude-code-for-codex/](https://www.xda-developers.com/ditched-claude-code-for-codex/)
> 中文：Claude Code 问问题、解释权衡、带你走过选项的习惯，是真正有教育意义的体验。

> "Claude Code is still the tool I'd recommend to most people." —— XDA Developers 作者（切回 Claude Code 续费后的结论）
> 中文：对大多数人来说，Claude Code 仍然是我会推荐的工具。

**判断**：
- 这篇测评来自真实切换场景，结论没有被 benchmark 污染。Claude Code 的"交互式对齐"优势在真实工程里比 benchmark 显示的更重要
- Codex 并行执行是实质差异化功能，对批量任务（跑多个功能分支、并行测试、多仓库操作）有明显价值
- 作者最后续费 Claude Code 的决定是一个真实的市场信号：用了一周 Codex 之后仍然选 Claude Code，反映了迁移成本和生态依赖

### 3c：Hacker News 开发者讨论

**来源**：[https://news.ycombinator.com/item?id=47879092](https://news.ycombinator.com/item?id=47879092)（GPT-5.5 发布帖）

**主要讨论主题**：
- **依赖性焦虑**：多位开发者反映没有前沿模型"像失去一条手臂"，手动写代码的效率回不去了，已经完全依赖 AI 辅助
- **确定性 vs 智能**：工程师批评 LLM 缺乏传统代码库的确定性（"libraries are deterministic，LLM 不是"）
- **技能萎缩担忧**：如果长期依赖 AI 生成代码但不深入理解，当 AI 不可用时会无法独立解决问题
- **定价批评**：对每个版本都涨价感到不满，质疑 token 效率提升是否真的抵消了价格翻倍
- **企业端好评**：10,000+ NVIDIA 员工描述结果为"mind-blowing"和"life-changing"（NVIDIA 官方博客）

**判断**：
- HN 的焦虑讨论（依赖、技能萎缩）是被主流报道忽视的深层信号：AI 编程工具的 adoption 已经越过了"尝鲜"阶段，进入了"戒不掉"阶段——这对工具厂商是好事，但也意味着更高的责任期望（降智、服务中断的代价更大）
- Codex 和 Claude Code 在 HN 上几乎没有直接 A/B 对比，更多是整体 AI 辅助编程的哲学讨论

### 3d：MindStudio 对比文（系统性分析）

**来源**：[https://www.mindstudio.ai/blog/codex-vs-claude-code-2026](https://www.mindstudio.ai/blog/codex-vs-claude-code-2026)

**架构差异**（清楚说明）：
- Codex：云原生，独立沙箱，异步执行，从仓库 clone 开始操作，返回结果
- Claude Code：终端原生，在你的本地代码库上直接操作，执行真实 shell 命令

**任务路由建议**（来自 MindStudio）：

| 任务类型 | 推荐工具 | 理由 |
|----------|----------|------|
| 多文件 bug 修复 | Claude Code | SWE-bench Pro 优势 |
| DevOps 自动化 | Codex/GPT-5.5 | Terminal-Bench 主导 |
| Code Review | Claude Code | 指令跟随精度 |
| 电脑操控 / UI 自动化 | Codex/GPT-5.5 | 原生多模态架构 |
| IDE 集成（Cursor） | Claude Code | CursorBench 70% |
| 并行任务执行 | Codex | 云沙箱天然优势 |

**判断**：
- MindStudio 是 AI 工具测评站，利益上和两边都没有强绑定，这份对比相对中立
- "不在同一赛道上竞争"这个判断（agentic workflow vs 复杂代码工程）是目前最准确的框架，但 GPT-5.5 的发布让这个分野变得模糊——OpenAI 在通过 Terminal-Bench 和 Codex App 更新，向 Claude Code 的传统优势地盘进攻

**交叉验证**：
1. Simon Willison 实测：[https://simonwillison.net/2026/Apr/23/gpt-5-5/](https://simonwillison.net/2026/Apr/23/gpt-5-5/)
2. XDA Developers 切换测评：[https://www.xda-developers.com/ditched-claude-code-for-codex/](https://www.xda-developers.com/ditched-claude-code-for-codex/)
3. MindStudio 系统对比：[https://www.mindstudio.ai/blog/codex-vs-claude-code-2026](https://www.mindstudio.ai/blog/codex-vs-claude-code-2026)
4. Lushbinary benchmark 对比：[https://lushbinary.com/blog/gpt-5-5-vs-claude-opus-4-7-comparison-benchmarks-pricing/](https://lushbinary.com/blog/gpt-5-5-vs-claude-opus-4-7-comparison-benchmarks-pricing/)
5. HN 讨论：[https://news.ycombinator.com/item?id=47879092](https://news.ycombinator.com/item?id=47879092)

---

## 线 4：Codex App 端更新

### 4a：2026-04-16 "Codex for (almost) everything" 大更新

**时间线**：2026-04-16 发布（早于 GPT-5.5 一周）[https://openai.com/index/codex-for-almost-everything/](https://openai.com/index/codex-for-almost-everything/)

**关键能力清单**：

**1. 电脑操控（Computer Use）**
- 能力：Codex 可以通过看屏幕、点击、打字来操控你 Mac 上的所有应用，有自己的光标，可在后台并行运行，不干扰用户操作
- 适用场景：测试前端改动、操作无 API 的工具、GUI-only bug 修复、原生 iOS 应用模拟器工作流
- 限制：**macOS 专属**，EEA（欧洲经济区）、英国、瑞士暂不可用
- 来源：[https://www.ghacks.net/2026/04/17/openai-updates-codex-with-computer-use-in-app-browser-memory-and-90-plus-new-plugins/](https://www.ghacks.net/2026/04/17/openai-updates-codex-with-computer-use-in-app-browser-memory-and-90-plus-new-plugins/)

**2. 内置浏览器（In-App Browser）**
- 能力：可以打开本地或公开页面（无需登录），在渲染后的页面上直接评论，让 Codex 处理页面级反馈
- **本地 Dev Server 支持**：明确支持 localhost 开发服务器和基于文件的页面预览，Codex 可以点击、输入、检查渲染状态、截图、验证修复
- 当前限制：主要面向 localhost 前端和游戏开发，OpenAI 计划后续扩展到更多 web 应用
- 来源：[https://developers.openai.com/codex/app/browser](https://developers.openai.com/codex/app/browser)

**3. 本地文件操作**
- Codex agent 模式可在项目工作区修改文件，超出项目范围需要审批
- 注意：有安全 issue 报告（GitHub issue #11583）指出 Codex 曾绕过工作区限制在未授权目录编辑文件，建议在跑真实任务前先做 Git checkpoint
- 来源：[https://github.com/openai/codex/issues/11583](https://github.com/openai/codex/issues/11583)

**4. 记忆系统（Memory Preview）**
- 跨会话保留上下文和用户偏好，无需每次重新说明

**5. 自动化与调度**
- 可调度未来任务，自动唤醒继续长期工作（支持跨天乃至跨周）
- 支持多终端标签页、PR 自动审查路由、GitHub 集成

**6. 90+ 新插件**
- 涵盖：Atlassian Rovo、CircleCI、CodeRabbit、GitLab Issues、Microsoft Suite、Neon by Databricks、Render、Superpowers 等

**7. iOS / 移动端**
- Codex 现已在 ChatGPT iOS app 中上线（OpenAI Developers 官方 X 账号确认）[https://x.com/OpenAIDevs/status/1924601527898951914](https://x.com/OpenAIDevs/status/1924601527898951914)
- 功能：发起新任务、查看 diff、请求改动、推 PR——全程在手机上
- 支持锁屏 Live Activities 显示任务进度
- 限制：移动端是"任务监控 + 轻交互"，不是完整电脑操控

### 4b：2026-04-23 GPT-5.5 集成更新（Changelog）

**来源**：[https://developers.openai.com/codex/changelog](https://developers.openai.com/codex/changelog)

- CLI 命令：`codex --model gpt-5.5` 或在 IDE / App 界面选择
- 云任务和代码审查仍运行在 GPT-5.3-Codex（非 5.5）
- CLI 0.123.0 / 0.124.0 同日发布

**原话引用**：

> "Codex now interacts with web apps, captures screenshots, and iterates on results." —— 9to5Mac 报道 GPT-5.5 发布 [https://9to5mac.com/2026/04/23/openai-upgrades-chatgpt-and-codex-with-gpt-5-5-a-new-class-of-intelligence-for-real-work/](https://9to5mac.com/2026/04/23/openai-upgrades-chatgpt-and-codex-with-gpt-5-5-a-new-class-of-intelligence-for-real-work/)
> 中文：Codex 现在可以与 web 应用交互、截图、并对结果迭代改进。

> "Teams are using automations to manage open pull requests, follow up on tasks, and monitor activity across Slack, Gmail, and Notion." —— OpenAI [https://www.ghacks.net/2026/04/17/openai-updates-codex-with-computer-use-in-app-browser-memory-and-90-plus-new-plugins/](https://www.ghacks.net/2026/04/17/openai-updates-codex-with-computer-use-in-app-browser-memory-and-90-plus-new-plugins/)
> 中文：团队正在用自动化功能来管理开放 PR、跟进任务、监控 Slack / Gmail / Notion 上的动态。

### 4c：NVIDIA 配合稿

**来源**：[https://blogs.nvidia.com/blog/openai-codex-gpt-5-5-ai-agents/](https://blogs.nvidia.com/blog/openai-codex-gpt-5-5-ai-agents/)

**关键事实**：
- 10,000+ NVIDIA 员工提前获得 GPT-5.5 驱动的 Codex 访问权限，覆盖工程、产品、法务、市场、财务、销售、HR、运营、开发者项目等部门
- 基础设施：Codex 运行在 NVIDIA GB200 NVL72 机架级系统上
- GB200 NVL72 性能：相比上代系统，每百万 token 成本降低 35 倍，每兆瓦每秒 token 输出提升 50 倍
- 安全架构：远程 SSH 连接到审批的云 VM，每个 agent 独立沙箱，零数据留存策略，生产系统只读权限

**原话引用**：

> "Let's jump to lightspeed. Welcome to the age of AI." —— Jensen Huang（对 NVIDIA 员工）/ NVIDIA Blog
> 中文：让我们跳跃到光速。欢迎来到 AI 时代。

> "Debugging cycles reduced from days to hours. Experimentation accelerated from weeks to overnight progress on complex codebases." —— NVIDIA Blog
> 中文：调试周期从几天缩短到几小时。在复杂代码库上的实验，从几周压缩到一夜的进展。

**判断**：
- NVIDIA 配合稿是一篇典型的"大客户背书"文章，但数字是真实的：10,000+ 员工、GB200 基础设施
- 35x 成本降低 / 50x 吞吐量：这组数字来自硬件侧，意味着 OpenAI 在 token 成本上有结构性优势，未来定价有很大的降价空间（但 GPT-5.5 反而涨了——说明 OpenAI 现在在用定价测试市场意愿，不是在竞价）
- OpenAI-NVIDIA 合作始于 2016 年 Jensen Huang 亲送第一台 DGX-1，OpenAI 承诺部署 10 GW 的 NVIDIA 系统。这个关系的深度是 Anthropic 和 Google TPU 关系难以在短期内复制的

**交叉验证**：
1. OpenAI 官方更新日志：[https://developers.openai.com/codex/changelog](https://developers.openai.com/codex/changelog)
2. NVIDIA 官方博客：[https://blogs.nvidia.com/blog/openai-codex-gpt-5-5-ai-agents/](https://blogs.nvidia.com/blog/openai-codex-gpt-5-5-ai-agents/)
3. gHacks 独立报道：[https://www.ghacks.net/2026/04/17/openai-updates-codex-with-computer-use-in-app-browser-memory-and-90-plus-new-plugins/](https://www.ghacks.net/2026/04/17/openai-updates-codex-with-computer-use-in-app-browser-memory-and-90-plus-new-plugins/)
4. MacRumors App 更新报道：[https://www.macrumors.com/2026/04/16/openai-codex-mac-update/](https://www.macrumors.com/2026/04/16/openai-codex-mac-update/)

---

## 信源待补

以下信息未能通过本次调研确认，下游写作时需注意：

1. **Dario Amodei 对 GPT-5.5 的直接回应**：搜索结果中找不到他在 GPT-5.5 发布后针对性发表的声明（他 4 月主要出现在白宫政治新闻中，技术叙事缺位）
2. **NVIDIA 配合稿的精确发布时间**：blogs.nvidia.com/blog/openai-codex-gpt-5-5-ai-agents/ 返回 403，确切日期（4-22 还是 4-23）未直接抓到，但多处报道确认为同期发布
3. **Reddit r/ChatGPTCoding 具体线程**：未做 Reddit 深挖，社区反应以 HN 为主
4. **Codex 4M WAU 的精确确认日期**：Fortune 文章（4-23）报道"4 million active Codex users"，Neowin 文章题为"adding 1 million in just two weeks"但 403 未能直接验证，需二次核实

---

## 给下游写作的故事钩子

**最抓人的故事钩子**：同一周里，Anthropic 把开发者最爱的工具从 $20/月计划悄悄移除，OpenAI 的 GPT-5.5 隔天就发布了，还专门发了一条"我们不移除"的声明——这不是巧合，这是一次精准的竞争性补刀。AI 编程战场第一次出现了真正的"用户争夺战"，战场不是 benchmark，是每月 $20。

