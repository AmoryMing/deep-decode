# Harness > Model

> 51 万行代码揭示的 AI 产品真相  
> Claude Code 源码拆解 #02  
> Sebastian Raschka / LMCache Team / 源码社区 · 2026-03-31 泄露源码分析  
> 原文：https://blog.lmcache.ai/en/2025/12/23/context-engineering-reuse-pattern-under-the-hood-of-claude-code/

---


### 开篇

51.2 万行 TypeScript，1902 个源文件。这是 2026 年 3 月 31 日泄露的 Claude Code 完整代码库的体量。但真正让人愣住的不是这个数字，而是另一个：在这 51 万行里，直接跟 LLM 对话的核心代码——query.ts、QueryEngine.ts、claude.ts——加起来只有大约 6,400 行。

剩下的 50 万行在干什么？**这个问题的答案，正在重塑整个 AI 产品行业对「竞争力」的理解。**


![01_冰山架构](material/pngs/01_冰山架构.png)


---


## 01  一个 ML 老兵的判断

Sebastian Raschka 是 Lightning AI 的研究工程师，写过多本机器学习畅销书。泄露事件后不到 24 小时，他在 Substack 上发了一篇文章，标题直截了当：Claude Code's Real Secret Sauce Isn't the Model。

四天后，他把这个判断展开成了一篇更系统的技术分析——Components of a Coding Agent，识别出 coding harness 的六大核心组件：实时代码库上下文、Prompt 分层与缓存复用、结构化工具系统、上下文压缩、会话记录与记忆、子 Agent 委托。


> *I suspect that if we dropped one of the latest, most capable open-weight LLMs, such as GLM-5, into a similar harness, it could likely perform on par with GPT-5.4 in Codex or Claude Opus 4.6 in Claude Code.*
> 把最新的开源模型放进同样的 harness，性能可能跟闭源顶级模型不相上下。-- Sebastian Raschka

这个判断不是孤例。Reddit 上 r/ClaudeCode 的高赞帖标题就是「Claude Code's leaked source is basically a masterclass in harness engineering」。Bilgin Ibryam 在 Generative Programmer 上总结了十条实践教训，最后一条：


> *The best coding agent is not the one with the cleverest instructions. It is the one with the best workflow design.*
> 最好的 coding agent 不是指令最聪明的，而是工作流设计最好的。-- Bilgin Ibryam


---


## 02  什么是 Harness

Harness 直译是「笼具」或「驾具」。在 AI 产品语境里，它指围绕 LLM 搭建的所有工程系统——工具调度、上下文管理、安全权限、记忆持久化、多 Agent 协调。如果把 LLM 想象成一匹马力巨大的赛马，harness 就是缰绳、马鞍和赛道围栏的总和。马再快，没有缰绳它只会在草原上乱跑。

姑且给这个现象起个名字：**「前缀沉重架构」**。整个系统的重心不在模型调用本身，而在调用之前和之后的那些事：怎么组装上下文、怎么复用缓存、怎么约束工具行为、怎么在长对话中维持状态。沉重的是前缀，不是模型推理。


---


## 03  92% 缓存复用率：不是运气，是架构

这个数字来自 LMCache 团队的实测分析。他们追踪了一个真实的 Claude Code 执行 trace：92 次 LLM 调用，处理约 200 万 token，耗时 13 分钟。结果发现，prompt 前缀的复用率达到了 92%。

92% 意味着什么？按 Anthropic 的 API 定价换算：不用缓存约 6 美元，用了缓存降到 1.15 美元。一个任务省 81%。


![02_前缀沉重架构](material/pngs/02_前缀沉重架构.png)

背后有三个关键的架构决策：

第一，System Prompt 被切成了静态段和动态段。**源码里有个常量叫 SYSTEM_PROMPT_DYNAMIC_BOUNDARY**，把系统提示词一分为二。工具定义、安全规则放前面走缓存；当前目录、Git 状态放后面每次装配。工具排序固定，保持字节级前缀稳定——排序一变，缓存作废。

第二，子 Agent 继承父 Agent 的缓存。**Fork 机制**让子 Agent 继承完整上下文，model='inherit' 不能换——换模型就意味着缓存归零。

第三，有一个「预热」阶段。**前几次 API 调用不做实际工作**，只把工具列表推入缓存。像数据库的 warm-up query。


---


## 04  五步预处理流水线

如果缓存复用是成本武器，五步预处理流水线就是质量武器。Claude Code 的主循环在每轮调用 API 之前，都会经过：

Snip **→ 微压缩 → 上下文折叠 → 自动压缩 → **组装请求


![03_五步预处理流水线](material/pngs/03_五步预处理流水线.png)

- Snip 裁掉过时的工具调用结果，裁剪量传给后续步骤
- 微压缩就地缩减过长工具返回，用户完全透明
- 上下文折叠刻意放在自动压缩之前——能折叠够用就不做更激进的压缩
- 自动压缩在 token 接近窗口上限时触发，预留 20K token（p99.99 = 17,387 token）
- 压缩阶段有硬指令：CRITICAL - Do NOT call any tools
设计哲学：**能不让模型看到的东西，就不让它看到。**不是窗口不够大，而是无关信息分散注意力。


---


## 05  但是——模型真的不重要吗？

到这里一个过于整齐的叙事已经浮现了：harness 是一切，模型无所谓。但事实没那么简单。


> *There is nothing special in the harness (it seems less sophisticated than Codex), which I think is supported by the fact that Claude Code works much better with (strong) Claude models vs Chinese OSS.*
> harness 里没什么特别的，CC 搭配强模型明显更好。-- dmckinno

这个反方值得认真对待。源码里 USER_TYPE === 'ant' 的分支显示，Anthropic 内部员工用的版本和外部版本在提示词策略上有差异。harness 不是通用适配器，它和 Claude 模型是共进化的关系。

更准确的说法可能是：**模型是底座，harness 是杠杆。**底座决定了你能站多高，杠杆决定了你能把力放大多少倍。Claude Code 的真正壁垒不是其中任何一个，而是两者之间长期磨合出来的协同效应。


---



## 结语

这场「意外开源」让整个行业提前看到了：AI Agent 时代的工程竞争，本质是 harness 工程能力的竞争。

原文链接：https://blog.lmcache.ai/en/2025/12/23/context-engineering-reuse-pattern-under-the-hood-of-claude-code/  
AI Force 前沿拆解 · 整理：AI Force