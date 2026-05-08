---
title: "Harness > Model：51 万行代码揭示的 AI 产品真相"
source: https://blog.lmcache.ai/en/2025/12/23/context-engineering-reuse-pattern-under-the-hood-of-claude-code/
author: 多信源交叉验证（Sebastian Raschka / LMCache Team / 源码分析社区）
date: 2026-03-31
decoded: 2026-04-07
tags: [Claude Code, Harness Engineering, 上下文工程, 缓存复用, Agent架构, AI工程]
---

51.2 万行 TypeScript，1902 个源文件。这是 2026 年 3 月 31 日泄露的 Claude Code 完整代码库的体量。但真正让人愣住的不是这个数字，而是另一个：在这 51 万行里，直接跟 LLM 对话的核心代码——query.ts、QueryEngine.ts、claude.ts——加起来只有大约 6,400 行。

剩下的 50 万行在干什么？

这个问题的答案，正在重塑整个 AI 产品行业对"竞争力"的理解。

## 一个 ML 老兵的判断

Sebastian Raschka 是 Lightning AI 的研究工程师，写过多本机器学习畅销书，在 AI 工程领域有十几年的积累。泄露事件发生后不到 24 小时，他在 Substack 上发了一篇文章，标题直截了当：「Claude Code's Real Secret Sauce Isn't the Model」。

四天后，他把这个判断展开成了一篇更系统的技术分析——「Components of a Coding Agent」，识别出 coding harness 的六大核心组件：实时代码库上下文（repo context）、Prompt 分层与缓存复用（prompt shaping + cache）、结构化工具系统（structured tools）、上下文压缩（context reduction）、会话记录与记忆（transcripts + memory）、子 Agent 委托（subagent delegation）。

他甚至做了一个大胆推测：

> "I suspect that if we dropped one of the latest, most capable open-weight LLMs, such as GLM-5, into a similar harness, it could likely perform on par with GPT-5.4 in Codex or Claude Opus 4.6 in Claude Code."

把最新的开源模型放进同样的 harness，性能可能跟闭源顶级模型不相上下。这句话的含义很明确——模型不是不重要，但 harness 才是把"能力"变成"产品"的那层东西。

这个判断不是孤例。泄露事件后，行业里几乎形成了一个共识性的叙事。Reddit 上 r/ClaudeCode 的高赞帖标题就是「Claude Code's leaked source is basically a masterclass in harness engineering」。Medium 上有人直接写了「The Model Isn't the Product」。Bilgin Ibryam 在 Generative Programmer 上总结了十条实践教训，最后一条收束全文：

> "The best coding agent is not the one with the cleverest instructions. It is the one with the best workflow design."

最好的 coding agent 不是指令写得最聪明的那个，而是工作流设计得最好的那个。

但在深入源码之前，需要先理解一个概念。

## 什么是 Harness——用一个比喻说清楚

Harness 这个词，直译是"笼具"或"驾具"。在 AI 产品语境里，它指的是围绕 LLM 搭建的所有工程系统——工具调度、上下文管理、安全权限、记忆持久化、多 Agent 协调。如果把 LLM 想象成一匹马力巨大的赛马，harness 就是缰绳、马鞍和赛道围栏的总和。马再快，没有缰绳它只会在草原上乱跑。

Claude Code 的 51 万行代码，就是这套缰绳。

姑且给这个现象起个名字：**「前缀沉重架构」**。这不是 Anthropic 官方用语，而是从源码结构里浮现出来的工程特征——整个系统的重心不在模型调用本身，而在调用之前和之后的那些事：怎么组装上下文、怎么复用缓存、怎么约束工具行为、怎么在长对话中维持状态。沉重的是前缀，不是模型推理。

![冰山架构](material/pngs/01_冰山架构.png)

## 92% 缓存复用率：不是运气，是架构

这个数字来自 LMCache 团队的一次实测分析。他们追踪了一个真实的 Claude Code 执行 trace：92 次 LLM 调用，处理约 200 万 token，耗时 13 分钟。结果发现，prompt 前缀的复用率达到了 92%。

92% 意味着什么？按 Anthropic 的 API 定价换算：不用缓存，200 万输入 token 的费用约 6 美元；用了缓存，降到 1.15 美元。一个任务省 81%。

但这不是"加了个缓存"就能拿到的数字。LMCache 的分析揭示了一套精心设计的缓存友好架构。整个执行过程分成四个阶段，每个阶段的缓存复用率不同，但都在 90% 以上：

| 阶段 | 复用率 | 机制 |
|------|--------|------|
| Explore（并行探索） | 92.06% | 3 个并行子 Agent，每个只带角色相关工具 |
| Plan（规划） | 93.23% | 只接收探索摘要，不带完整历史 |
| Execute（执行） | 97.83% | 按 markdown todo list 逐项执行 |

97.83%。执行阶段几乎每次 API 调用都在复用之前的前缀。

这背后有几个关键的架构决策。

**第一，System Prompt 被切成了静态段和动态段。** 源码里有个常量叫 `SYSTEM_PROMPT_DYNAMIC_BOUNDARY`，它把整个系统提示词一分为二：工具定义、安全规则、行为准则这些不变的内容放在前面，作为"编译后的二进制"走缓存；当前目录、Git 状态、用户偏好这些每轮都变的内容放在后面，作为"运行时参数"每次重新装配。工具排序甚至是固定的，目的是保持字节级前缀稳定——排序一变，缓存就作废。

用架构师公众号那篇分析的话说：

> "Claude Code 把 Prompt 管理做成了一件和编译器优化类似的事。静态部分是'编译后的二进制'走缓存，动态部分是'运行时参数'每次装配。"

**第二，子 Agent 继承父 Agent 的缓存。** 源码里有个叫 Fork 的机制——不是普通的子 Agent（从零开始），而是继承父 Agent 完整对话上下文和 system prompt 的分支。Fork Agent 的 model 设为 `'inherit'`，工具集用 `useExactTools` 确保和父 Agent 完全一致。为什么？因为换模型或换工具列表就意味着 API 请求前缀变了，缓存命中率直接归零。

**第三，有一个"预热"阶段。** LMCache 的 trace 显示，执行的最初几次 API 调用并不做实际工作，而是把工具列表和子 Agent 的 system prompt 推入缓存。这像是数据库的 warm-up query——先把热数据加载到内存，后面的查询才能快。

这三个设计叠加起来，才拿到了 92%。不是"碰巧缓存命中率高"，是整个架构从第一天就围绕缓存复用来设计的。

![前缀沉重架构](material/pngs/02_前缀沉重架构.png)

## 五步预处理流水线：在模型开口之前做完大部分工作

如果说缓存复用是成本武器，五步预处理流水线就是质量武器。

源码分析者 AeroMind 拆解 query.ts 后发现，Claude Code 的主循环在每轮调用 Claude API 之前，都会经过一条五步流水线：

**Snip → 微压缩 → 上下文折叠 → 自动压缩 → 组装请求。**

这五步之间有精心设计的依赖关系。不是简单地串行执行，每一步都知道前一步做了什么：

1. **Snip** 先裁掉明显过时的工具调用结果——比如你 10 轮对话前读的一个文件，内容早就不相关了。裁掉的 token 数会传给后面的自动压缩，让阈值判断更准确。

2. **微压缩（MicroCompact）** 就地缩减过长的工具返回。让 Claude 读一个 5000 行的文件，微压缩可能只保留跟当前任务相关的部分。这一层对用户完全透明。

3. **上下文折叠（Context Collapse）** 把早期对话中的工具调用细节折叠起来，只保留摘要。源码注释写得很直白：这步刻意放在自动压缩之前——"if collapse gets us under the autocompact threshold, autocompact is a no-op and we keep granular context instead of a single summary." 如果折叠就够了，就不做更激进的压缩，保留更细粒度的上下文。

4. **自动压缩（AutoCompact）** 在 token 接近上下文窗口时触发。阈值不是简单的百分比，而是窗口大小减去 20K token 的预留量。20K 这个数字来自实际数据：p99.99 的 compact summary 输出是 17,387 token。留余量是怕压缩结果本身太长，反而把上下文撑爆。压缩阶段有一条非常严厉的指令——"CRITICAL: Respond with TEXT ONLY. Do NOT call any tools."——因为如果 AI 在总结时又去调工具，就会产生更多 token，适得其反。

5. **组装请求**。把经过前四步处理的上下文，加上当前轮的用户输入和 system prompt，组装成最终的 API 请求。

五步走完，才轮到 Claude 开口。

这条流水线的设计哲学很清晰：**能不让模型看到的东西，就不让它看到。** 不是因为上下文窗口不够大——Claude 已经有 200K token 的窗口——而是因为无关信息会分散注意力，降低输出质量。这和人的认知规律一模一样：一个程序员同时打开 50 个文件不会比打开 5 个文件写得更好。

![五步预处理流水线](material/pngs/03_五步预处理流水线.png)

## 用 grep 不用向量数据库：最反直觉的工程决策

泄露源码里有一个细节让很多人不可思议：Claude Code 搜索代码用的是 ripgrep——一个几十年前就有的命令行文本搜索工具。不用 Embedding，不用向量数据库，不用语义检索。

这看起来像是工程上的偷懒，但放在整个 harness 的语境里看，这是一个深思熟虑的选择。

ripgrep 有几个向量检索无法匹敌的工程优势：结果是确定性的（同一个查询永远返回同样的结果）、不需要额外的基础设施（不用维护向量数据库）、延迟极低（毫秒级返回）、用户可以理解和预测结果（搜的是文本，不是语义向量）。在一个已经高度复杂的系统里，选择一个简单、可预测、零维护成本的方案来解决"搜代码"这个子问题，本质上是在管理系统整体复杂度的上限。

阿里云那篇分析文章里有一句总结点到了要害：

> "用最简单、最可靠、最可预测的工具，做最关键的事。不追求技术上的花哨，只追求结果上的稳定。"

这个原则在整个 Claude Code 的代码库里反复出现。工具系统的默认值是保守的——`isConcurrencySafe` 默认 false，`isReadOnly` 默认 false。编辑文件前必须先读过一次，这不是写在文档里的"最佳实践"，而是代码里的硬约束——没读就编辑，系统直接报错拦住。权限不是一个弹窗，而是一条七步决策管道。

这套工程哲学可以叫做**「默认不信任」**——系统默认不信任任何没有显式声明安全属性的组件，默认不信任模型的自觉性，默认不信任用户没有确认过的操作。起步会慢一点，但后面在并发、安全、可预测性上欠的债会少很多。

## 但是——模型真的不重要吗？

到这里，一个过于整齐的叙事已经浮现了：harness 是一切，模型无所谓。但事实没那么简单。

一个叫 dmckinno 的开发者在 Threads 上直接反驳了 Raschka：

> "There is nothing special in the harness (it seems less sophisticated than Codex), which I think is supported by the fact that Claude Code works much better with (strong) Claude models vs Chinese OSS."

他的论据很实在：Claude Code 的 harness 看起来不比 OpenAI 的 Codex 复杂，但 Claude Code 搭配 Claude 模型的表现明显优于搭配中国开源模型。如果 harness 真的是决定性因素，换模型不应该有这么大差距。

这个反方值得认真对待。

源码里也能看到端倪。`USER_TYPE === 'ant'` 的分支显示，Anthropic 内部员工用的版本和外部版本在提示词策略上有差异——更激进的输出策略、更详细的代码风格指引、一些还在 A/B 测试的实验功能。这说明 Anthropic 在 harness 和模型之间做了大量联合调优。harness 不是通用适配器，它和 Claude 模型是共进化（co-evolve）的关系。

更准确的说法可能是：**模型是底座，harness 是杠杆。** 底座决定了你能站多高，杠杆决定了你能把力放大多少倍。Claude Code 的真正壁垒不是 harness 单独有多厉害，也不是 Claude 模型单独有多强，而是这两者之间长期磨合出来的协同效应。这种协同是不可拍照复制的——你可以抄走 harness 的架构设计，但你抄不走 Anthropic 团队在模型和 harness 之间做了多少轮联合调优。

这也解释了为什么 Raschka 那个"把 GLM-5 放进同样 harness"的推测，可能过于乐观。harness 里有些隐含假设是和 Claude 模型绑定的——比如工具描述的措辞方式、安全分类器的温度设置、压缩阶段的 prompt 结构——换一个模型，这些假设不一定成立。

## 50 万行的隐性代价

还有一个被"Harness > Model"叙事忽略的问题：51 万行 TypeScript 的维护成本。

源码里有一段注释用魔法师的口吻描述了 thinking blocks 的处理规则：

> "The rules of thinking are lengthy and fortuitous. They require plenty of thinking of most long duration and deep meditation for a wizard to wrap one's noggin around... Heed these rules well, young wizard. For if ye does not heed these rules, ye will be punished with an entire day of debugging and hair pulling."

维护者显然已经被这段逻辑坑过很多次了。这不是个案——query.ts 被多位分析者称为"胖核心"，架构师那篇文章也承认"query.ts 好不好看，可以讨论"。当一个系统的状态管理集中在一个超级文件里，长期维护的认知负担会持续累积。

泄露后社区的反应也能侧面印证这一点。shareAI-lab/learn-claude-code 获得了 47.6k stars，口号是"Bash is all you need"，用 12 课教人从零构建 agent harness。这说明行业在寻找更轻量级的替代路径——不是每个团队都需要 51 万行的 harness。

## 对 AI 从业者意味着什么

这次源码泄露揭示的不是一个技术细节，而是一个行业趋势的拐点。

**第一，AI 产品的竞争正在从"模型军备竞赛"转向"工程军备竞赛"。** 模型能力在趋同——Claude、GPT、Gemini 在主流任务上的差距越来越小。但 harness 的差距正在拉大。Claude Code 的四层权限管道、三层上下文压缩、92% 缓存复用——这些东西不是有好模型就自动拥有的，需要几百人月的工程投入。Generative Programmer 的 Bilgin Ibryam 说的那句话很到位：harness 不是那个更聪明的指令集，而是那个更好的工作流设计。

**第二，"上下文工程"正在成为 AI 工程的核心学科。** 这次泄露让大家看到，Anthropic 对上下文的管理精细到了什么程度：CLAUDE.md 是唯一不会被压缩吞掉的上下文（因为每次 API 请求都会出现）、工具排序固定是为了保持缓存前缀稳定、微压缩和自动压缩是两套独立系统可以叠加。这已经不是"写个好 prompt"的层次了，这是一个完整的工程学科。

**第三，对于 Agent 产品的建设者，投资回报比最高的方向是：先把上下文管理和工具约束做对。** 不需要 51 万行代码，但需要想清楚几个关键问题：你的 system prompt 哪些部分是静态的、可以走缓存？工具系统有没有显式的安全属性声明？长对话中的历史压缩和状态续写是不是分开处理的？这些问题想清楚了，一万行代码也能做出靠谱的 Agent。

这场"意外开源"让整个行业提前看到了一个本来需要再等几年才能看清的事实：AI Agent 时代的工程竞争，本质上是 harness 工程能力的竞争。模型会越来越强，差距会越来越小；但那套让模型变得可靠、可预测、可信任的工程体系，才是把产品和玩具区分开来的东西。

---

## 本期关键词

**Harness（笼具/驾具）** -- AI Agent 周围的所有工程基础设施：工具调度、上下文管理、安全权限、记忆系统。如果 LLM 是马，harness 就是缰绳+马鞍+围栏。2026 年最热门的 AI 工程术语。

**Prefix Caching（前缀缓存）** -- Anthropic API 的特性：如果两次 API 请求的前缀相同，第二次只需要为缓存读取付费（正常价格的 1/10）。Claude Code 围绕这个特性设计了整个上下文架构。

**Context Engineering（上下文工程）** -- 系统性地管理 AI 模型在每次推理时"看到"的所有信息。不只是写 prompt，而是决定哪些信息放进上下文、以什么顺序放、什么时候压缩、什么时候丢弃。

**MicroCompact / AutoCompact（微压缩 / 自动压缩）** -- Claude Code 的两级上下文压缩系统。微压缩就地缩减单次工具返回，对用户透明；自动压缩在 token 接近窗口上限时触发，用 AI 生成整段对话摘要。两套系统正交设计，可以叠加使用。

**Fork（分叉 Agent）** -- 不同于从零开始的子 Agent，Fork 继承父 Agent 的完整上下文和工具集，共享 prompt cache。判断标准不是任务大小，而是"中间结果是否需要保留在主上下文中"。

**Agent Loop（Agent 循环）** -- Agent 的核心执行模式：思考 → 调用工具 → 观察结果 → 继续思考，循环直到任务完成。Claude Code 的 query.ts 是这个循环的实现，但在循环内部嵌入了五步预处理流水线，把大部分工作做在模型推理之前。

**默认不信任（Default Distrust）** -- Claude Code 的工程哲学。工具的安全属性默认是"不安全"（isConcurrencySafe=false, isReadOnly=false），权限默认是"需要确认"。只有显式声明安全的组件才被信任。起步慢，但技术债少。

## 原文关键引用

> "I suspect that if we dropped one of the latest, most capable open-weight LLMs, such as GLM-5, into a similar harness, it could likely perform on par with GPT-5.4 in Codex or Claude Opus 4.6 in Claude Code."（如果把最新的开源大模型放进同样的 harness，性能可能跟闭源顶级模型不相上下。）-- Sebastian Raschka

> "The best coding agent is not the one with the cleverest instructions. It is the one with the best workflow design."（最好的 coding agent 不是指令最聪明的，而是工作流设计最好的。）-- Bilgin Ibryam, Generative Programmer

> "There is nothing special in the harness (it seems less sophisticated than Codex), which I think is supported by the fact that Claude Code works much better with (strong) Claude models vs Chinese OSS."（harness 里没什么特别的，CC 搭配强模型明显更好。）-- dmckinno

> "Runs BEFORE autocompact so that if collapse gets us under the autocompact threshold, autocompact is a no-op and we keep granular context instead of a single summary."（上下文折叠刻意放在自动压缩之前，能省就不做更激进的压缩。）-- Claude Code 源码注释

## 引用

1. [Context Engineering & Cache Reuse Patterns Under the Hood of Claude Code](https://blog.lmcache.ai/en/2025/12/23/context-engineering-reuse-pattern-under-the-hood-of-claude-code/) -- LMCache Blog，92% 缓存复用率的定量分析
2. [Components of a Coding Agent](https://magazine.sebastianraschka.com/p/components-of-a-coding-agent) -- Sebastian Raschka，coding harness 六大组件分析
3. [Practical Lessons From the Claude Code Leak](https://generativeprogrammer.com/p/practical-lessons-from-the-claude) -- Bilgin Ibryam，泄露源码的 10 条实践教训
4. [Claude Code 源码架构解析：从启动、Prompt 到权限管道](context/information_sources/) -- 架构师公众号，主链路 8 步分析
5. [Claude Code 源码深度解析](context/information_sources/) -- AeroMind，五步预处理流水线拆解
6. [Claude Code 源码泄露：一份价值亿元的 AI 工程公开课](context/information_sources/) -- 阿里云开发者，Harness Engineering 论述
