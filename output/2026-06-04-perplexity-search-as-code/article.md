---
title: Perplexity 让 agent 写代码去搜索：function-calling 的来回往返时代结束了
date: 2026-06-04
type: decode
slug: 2026-06-04-perplexity-search-as-code
style: default
reader: default
sources: [https://x.com/perplexity_ai/status/2061506359326384319, https://research.perplexity.ai/articles/rethinking-search-as-code-generation]
distribute: [email, xiaohongshu]
---

# Perplexity 让 agent 写代码去搜索：function-calling 的来回往返时代结束了

6 月 1 日，Perplexity 发布了一套叫 Search as Code（搜索即代码，下文简称 SaC）的新搜索架构。一句话讲清它干了什么：以前 agent 搜索，是模型一次喊一个函数调用、等结果、再喊下一个，来回往返几十上百轮；现在 agent 直接**写一段 Python**，在一个沙箱里把"搜什么、并行搜多少、怎么去重、怎么过滤、怎么排序"全部编排成代码一次跑完。Perplexity 官方推文原话：

> "It writes Python that calls our search stack directly, instead of looping through function calls one at a time."（它直接写 Python 调用我们的搜索栈，而不是一次一个地循环函数调用。）

这不是一个搜索产品的小升级。它和本周另外两件事——6 月 3 日 Claude Code 的 Dynamic Workflows（让 agent 自己写编排脚本）、Cloudflare 推机器对机器通信——指向同一个转折：**agent 驱动外部系统的范式，正在从"用自然语言一次调一个工具"切换到"用代码一次性编排一批调用"**。这个范式有个学界已有的名字，叫 code-as-action（代码即动作）。这一篇拆给做 agent、搜索、RAG 的人。

![封面](assets/gpt-img/00_cover.png)

## 本期看点

- **function-calling（函数调用）** —— 模型把"要调哪个工具、传什么参数"以结构化格式吐出来，外部执行后把结果塞回上下文，模型再决定下一步。核心特征是一次只调一个、每调一次走一个来回。
- **code-as-action（代码即动作）** —— 模型不吐单个工具调用，而是直接写一段可执行代码（这里是 Python），在沙箱里一次跑完批量、并行、循环、过滤等所有逻辑。一段代码顶过去几十轮往返。
- **Agentic Search SDK** —— Perplexity 把搜索拆成最细的积木（检索、排序、过滤、扇出、渲染）封装成 Python 函数库，塞进沙箱供模型调用，而不是给一个黑盒搜索端点。
- **扇出（fan-out）** —— 一次性把一个任务拆成几十上百条子查询并行发出去，而不是串行一条条问。agent 干这个天然顺手，人做不到。

## 一、function-calling 卡在哪：每搜一次走一个来回

要看懂 SaC 解决什么，得先看清旧办法的瓶颈。Perplexity 在技术文里把传统搜索定性为"黑盒"：模型只能通过函数调用或 MCP 串行地命中搜索端点，拿回的是已经处理好的成品结果。这套机制有三个硬伤，每一个都拖慢 agent。

第一是上下文粗。模型有时只想要"一条非常外科手术式的精确信息"，但端点是为召回率优化的，于是"把一大堆无关信息灌进了模型上下文"。上下文被噪声撑大，既花钱又干扰推理。

第二是用不上领域知识。模型其实知道某些搜索策略更优——混合关键词与语义信号、优先某些来源、按某个键聚合——但只要这些策略没做成查询参数，模型就无从施展。

第三，也是最致命的，控制流低效。很多任务天然需要扇出、并行、异步，可 function-calling 只能"通过反复的模型回合"来实现这些，Perplexity 的原话是这"增加了延迟、让工作流更难优化"，还把"嘈杂的中间状态"污染进上下文。

Perplexity 把根因点得很准：

> "The key bottleneck is ultimately one of control."（关键瓶颈归根结底是控制权问题。）

前沿模型对着固定上下文做推理已经很强了，真正缺的是**对"上下文如何被检索、处理、聚合、呈现"的控制权**。function-calling 把这层控制权锁死在了黑盒里。

![function-calling 的串行往返 vs SaC 的一次编排](assets/gpt-img/01_paradigm.png)

## 二、SaC 怎么干：三层架构 + 一套最细颗粒的搜索 SDK

SaC 的实现是三层紧耦合的结构。模型是控制平面，负责生成实现检索管线的代码；中间是安全的 Python 计算沙箱，跑这段代码；底层是 Agentic Search SDK，把搜索原语嵌进沙箱。

关键设计在 SDK。Perplexity 没有简单地把传统搜索 API 包一层，而是"精心设计了一套 Agentic Search SDK，把搜索的各个构件以尽可能原子的颗粒度暴露出来"——检索、排序、过滤、扇出、渲染都拆成独立函数，连候选列表、排序信号这种**中间状态**都开放给模型直接拿。同时保留了高层端到端端点，作为常见搜索模式的"速记"。运行时语言选了 Python，而不是 Rust、TypeScript 或 Bash——因为前沿模型写 Python 最熟。

代码长什么样？技术文给了一个查 CVE（软件安全漏洞）的实例。第一步是扇出编排，模型生成一段循环，把多个厂商、多个年份组合成几十条查询，一次性并行发出：

```python
queries = [{"vendor": vendor, "query": pattern.format(...)}
    for year in [2023, 2024, 2025]
    for vendor, pattern in templates]
seed_hits = sdk.search.web_many(queries, limit_per_query=8, concurrency=12)
```

一个 `sdk.search.web_many()` 配上 `concurrency=12`，就把过去要几十个来回的搜索压成了一次调用。第二步用代码做覆盖度统计、再请模型补漏；第三步用 `sdk.llm.extract_many()` 批量抽取并按 schema 校验，去重、过滤、聚合全用确定性的 Python 代码完成。

更妙的一点：代码不只是编排，还能当"能力补丁"。Perplexity 说"代码的威力超出编排本身，它还能补搜索栈里没有的能力"——比如模型并行调一批搜索、去重后再套一段自定义正则过滤，比硬塞一条嘈杂的大查询高效得多。搜索栈缺的功能，模型现场用代码补上。

![SaC 三层架构与 Python 编排](assets/gpt-img/02_architecture.png)

## 三、数字：CVE 任务省 85% token，五个基准赢四个

判断要有证据，Perplexity 这次给的数字相当硬。

那个 CVE 实例，SaC 做到了 **100% 准确率**，token 消耗从 28.87 万降到 4.29 万，**砍掉 85.1%**；而所有非 Perplexity 系统在同一任务上得分都不到 25%。token 砍掉八成五的意思是：同样一件事，旧办法因为反复往返、把中间状态全堆进上下文，烧掉了六倍多的 token。

更系统的对比在五个公开基准上（DeepSearchQA、BrowseComp、Humanity's Last Exam、WideSearch，以及 Perplexity 自建的 WANDR）。SaC 在其中**四个上拿第一**，只在 HLE 上和 OpenAI 打平。最夸张的是 WANDR，SaC 领先次优系统 **2.5 倍**。

和不带 SaC 的同源基线比，提升也很明确：DeepSearchQA 涨 19.77 个百分点（相对提升 29%），WANDR 涨 12 个百分点（相对 45%）。成本-性能上，中等推理档的 SaC 做到**每个任务不到 1 美元、却跑赢所有非 SaC 系统**。Perplexity 据此宣称建立了"agentic 搜索新的成本-性能前沿"。

有一处技术细节值得做 agent 的人记下来。跨回合的状态怎么存，Perplexity 试了两条路：一是 REPL 内存持久化，更省 token 但难追踪；二是写文件、在回合边界显式序列化。结论是后者在超长任务上更可靠，因为"要求模型把状态声明式地表达出来、而不是隐式携带，能帮模型更好地管理状态"。换句话说，让 agent 把状态写进文件、而非攒在脑子里，长链路更稳——这条经验对任何做长程 agent 的团队都通用。

![CVE 任务 token 对比与五基准战绩](assets/gpt-img/03_benchmarks.png)

## 四、这是一股趋势：agent 正在改用代码驱动外部系统

把 SaC 单看是一个搜索升级，放进本周的上下文看，它是一股范式迁移的一个切面。

6 月 3 日 Claude Code 推 Dynamic Workflows，核心是让 agent 自己写编排脚本，而不是被预设的固定流程牵着走；Cloudflare 推进机器对机器通信，让系统之间不再靠人或单次调用握手。SaC、Dynamic Workflows、Cloudflare——三件事的共同点是：**agent 不再用自然语言、不再靠一次一调去驱动外部系统，而是用代码批量编排**。代码的好处也一致：省往返、可组合、更快、状态可控。

为什么是现在？Perplexity 点了一个前提：最新的前沿模型"在通用代码生成上已经全面相当能打"。当模型写代码足够可靠，把"动作"从单个函数调用升级成一段程序，收益就压过了风险。这也呼应技术文里另一句判断——最强的计算系统会把 token 空间的推理和确定性的代码计算**结合**起来，而不是二选一。模型负责想策略，代码负责确定性地执行批量操作，各干各擅长的。

边界也要说清。WANDR 这个基准即便对 SaC 仍未饱和，Perplexity 承认那些"高度横向的复杂搜索工作流"还需要进一步的研究和工程突破。运行时选 Python 是当前最优，但会定期重估。文件序列化优于 REPL 也只是"初步发现"。这套架构强依赖前沿模型的代码生成能力，且需要专门的 skill（提示词指南 + few-shot 例子）教模型怎么用这套 SDK——SaC 不是免费午餐，它把复杂度从"调 API"转移到了"写好代码 + 教好模型"。

![三件事指向同一范式：代码即动作](assets/gpt-img/04_trend.png)

## 对从业者意味着什么

最直接的一条结论给做工具层的人：**给 agent 暴露的不该只是单点函数，而应该是一套可编程接口**。如果你在做搜索、RAG、或任何给 agent 用的工具栈，SaC 的设计哲学是把能力拆到最原子的颗粒度（检索、排序、过滤分开暴露，中间状态开放），让模型用代码自由组合，而不是给一个调一次返一坨结果的黑盒端点。黑盒端点在 function-calling 时代够用，在 code-as-action 时代会成为瓶颈。

做 agent / 编排的人，记住那条状态管理经验：长链路任务让模型把状态写进文件、显式序列化，比靠上下文隐式携带更稳。这和"上下文工程"是同一回事——往返越少、堆进上下文的中间噪声越少，agent 越准越省。

做 RAG 的人要重新算账。SaC 在 CVE 任务上省了 85% 的 token，根源是把"反复往返 + 中间状态进上下文"换成了"一段代码沙箱内跑完"。如果你的检索管线还在靠模型一轮轮调用拼装，token 成本和延迟里有很大一块是这套来回往返的税——值得评估能不能把编排逻辑下沉成代码。

最后给所有人一个判断坐标：当 Perplexity、Anthropic、Cloudflare 在同一周不约而同地让 agent 改用代码驱动外部系统时，"给 AI 提供 function"这个产品形态正在被"给 AI 提供 SDK + 沙箱"取代。下一波 agent 基础设施的竞争，会发生在"谁的能力被拆得最原子、最适合被模型写成代码调用"上。

## 引用

1. Perplexity 官方推文《Introducing Search as Code》（搜索即代码发布，2026-06-01）：https://x.com/perplexity_ai/status/2061506359326384319
2. Perplexity 技术文《Rethinking Search as Code Generation》（重新思考：把搜索当作代码生成）：https://research.perplexity.ai/articles/rethinking-search-as-code-generation
