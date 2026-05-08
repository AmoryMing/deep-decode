# Speculative Execution in Claude Code

> Intent Pipeline: From CPU Branch Prediction to AI Intent Prediction  
> 推测执行：当 AI 编程助手学会了 CPU 的老把戏  
> Anthropic Engineering (源码分析) · Claude Code Source · 2026-03-31  
> Claude Code 源码拆解 #12  
> 整理：AI Force  
> 原文：https://github.com/yasasbanukaofficial/claude-code

---


### 开篇

1969 年，IBM System/360 Model 91 第一次在硬件里实现了分支预测——CPU 不再傻等条件判断的结果，而是赌一把：猜你接下来要走哪条路，提前把那条路上的指令算好。猜对了，省掉几十个时钟周期；猜错了，把算好的结果扔掉，假装什么都没发生。

57 年后，Claude Code 的源码里出现了同样的逻辑。只不过这次预测的对象不是机器指令的跳转方向，而是人类开发者的下一步操作。

泄露的 992 行 speculation.ts 揭示了一套完整的**意图流水线（Intent Pipeline）**：预测你要输什么 → 在沙箱里替你先做了 → 你按回车确认就直接用结果，改主意就全丢。这套系统内部代号 Tengu（天狗），目前仅限 Anthropic 内部员工使用，但所有基础设施已经完全就位。

这篇拆解讲的是一种正在浮现的设计范式：**AI 工具的下一个竞争维度不是更聪明，而是更快——不是模型推理更快，而是让人感觉更快。**


![00_系列封面](material/pngs/00_系列封面.png)


---


## 01  预测你下一句话：Prompt Suggestion 的设计哲学

整套意图流水线的起点，是一个看起来不起眼的功能：输入建议。每轮对话结束后，Claude Code 会在后台 fork 一个子 agent，用当前对话上下文去预测用户下一步会输入什么。


> *Your job is to predict what THEY would type - not what you think they should do. THE TEST: Would they think 'I was just about to type that'?*
> 你的任务是预测用户会打什么——不是你觉得他们应该做什么。检验标准：他们会不会觉得“我刚想打这个”？

注意这个设计抖择。建议系统的目标不是“给出最好的下一步”，而是**“猜中用户自己想做的下一步”**。前者是顾问思维，后者是助手思维。

为了确保建议“像用户自己会打的话”，源码里堆了 12 条过滤规则。太短的丢（单个词，除了 yes/no/push/commit）。太长的丢（超过 12 个词或 100 字符）。听起来像 AI 在说话的丢——“Let me...”、“I'll...”、“Here's...” 全部拦截。

这不是简单的文本过滤，这是一套严格的**角色校准系统**。建议必须是“用户语气”，不能是“AI 语气”。一旦用户感觉“这不像我会说的话”，信任就崩了。


![01_建议生成过滤漏斗](material/pngs/01_建议生成过滤漏斗.png)

还有一层更精妙的经济学考量。建议生成本身是一次 LLM 调用，要花钱。源码里有一个 getParentCacheSuppressReason 函数：如果上一轮对话的未缓存 token 数超过 10,000，就不生成建议。原因是 fork 出来的子 agent 必须复用父进程的 prompt cache 才划算。

这个细节说明一件事：**建议系统不是“有总比没有好”。只有在缓存命中率足够高的时候，它才有正的 ROI。** 做不到就宁可不做。


---


## 02  预测了还不够，直接替你做：Speculation 系统

建议只是开胃菜。Claude Code 真正激进的设计在下一步：推测执行（Speculation）。当 Prompt Suggestion 生成一条建议之后，系统不是干等着用户按 Tab 接受。它立刻启动一个隔离的 forked agent，拿这条建议当作用户的真实输入，在后台执行。

源码中 startSpeculation 函数的流程：

- 生成一个唯一 speculation ID（UUID 前 8 位）
- 在临时目录创建 overlay 文件系统：~/.claude/speculation/<pid>/<id>/
- fork 一个子 agent，把建议文本作为用户消息传入
- 子 agent 开始执行工具调用——读文件、搜索代码、甚至编辑文件（写入 overlay）
- 每个工具调用都经过严格的权限检查
- 执行最多 20 轮，或 100 条消息
等用户决定的时候，两种结局：

按 Tab 接受建议 → **overlay 里修改过的文件复制回主文件系统**，推测过程中的所有消息注入对话历史，就好像用户亲自执行了一样。

用户自己打了别的话 → **overlay 整个删除，推测过程中的消息全部丢弃**。几秒到几十秒的计算资源，说扔就扔。

这就是分支预测的精髓：**赌赢了，你省了等待时间；赌输了，你什么都没感觉到。**


![02_推测执行状态机](material/pngs/02_推测执行状态机.png)


---


## 03  沙箱里的平行宇宙：Overlay 文件系统

推测执行最大的工程挑战不是预测——预测错了大不了丢掉。真正危险的是：如果推测过程中修改了文件，然后预测错了，怎么回滚？

Claude Code 的解法借鉴了容器技术中的 overlay filesystem 思想，核心机制是 **Copy-on-Write（写时复制）**。

- 第一次写某个文件时：先把原文件复制到 overlay 目录，然后在副本上修改
- 后续读同一个文件时：如果之前被写过，从 overlay 读；没被写过，从主文件系统读
- 写工作目录之外的文件：直接拒绝，无条件
这套机制的精妙之处在于成本极低。不需要真正的文件系统快照，不需要 git stash，不需要 Docker 容器。就是一个临时目录 + 路径重定向。接受时 copyOverlayToMain 把文件复制回去，拒绝时 rm -rf 整个目录。

```
主文件系统（真实世界）          Overlay（平行宇宙）
├── src/                       ├── src/
│   ├── app.ts ────读───→      │   ├── app.ts（副本，被修改过）
│   ├── test.ts ──读───→       │   │
│   └── utils.ts               │   └──（不存在，从主FS读）

用户按 Tab ──→ 复制回来          用户打字 ──→ rm -rf 整个目录
```


![03_overlay文件系统](material/pngs/03_overlay文件系统.png)

但 overlay 只解决了文件操作的可逆性。对于不可逆的操作——比如运行一个会修改数据库的脚本，或者发送 HTTP 请求——推测执行选择了更简单粗暴的策略：不做。碰到这类操作就停下来，记录一个“边界”，等用户确认后再继续。


---


## 04  三层推测流水线：系统性消除等待

拆到这里，一个更大的图景浮现了。推测执行不是 Claude Code 里唯一在“抢跑”的机制。从微观到宏观，至少有三层流水线在同时工作：


#### 第一层：Bash 分类器预取（微秒级）

当模型还在流式输出 Bash 命令的参数时——参数还没输出完——系统就已经开始并行运行安全分类器了。串行变并行，用户无感但省了一个完整的分类器调用延迟。


#### 第二层：Memory/Skill 预取（百毫秒级）

每个用户 turn 开始时，系统启动异步查询去找相关记忆文件。这个查询不阻塞主循环——每次迭代用 zero-wait 方式检查结果。


> *the prefetch gets as many chances as there are loop iterations before the turn ends*
> 预取在 turn 结束前有和循环迭代次数一样多的机会

Skill Discovery 同样的模式。源码提到一个关键数据：之前的阻塞式 skill 发现在生产环境中 **97% 的调用什么都没找到**。把它改成预取后，那 97% 的空等待就被藏到了模型推理的时间里。


#### 第三层：推测执行 + 递归 Pipelining（秒级）

这是最激进的一层。推测执行完成后，系统不是停下来等用户——它立刻生成下一条建议，然后开始推测执行那条建议。

```
用户输入 → Claude 回复 → 生成建议 A → 推测执行 A
                                         ↓ （A 执行完毕）
                                    生成建议 B → 推测执行 B
                                                    ↓ （B 执行完毕）
                                               生成建议 C → ...
```

对于高度可预测的工作流（比如“改 bug → 跑测试 → 提交 → 推送”），整条链路可以在用户第一次按 Tab 之前就全部预执行完毕。


![04_三层流水线时序](material/pngs/04_三层流水线时序.png)

这让人想起 CPU 流水线的深度。Claude Code 的三层流水线是同一个思路：**人类思考的每一毫秒，机器都不应该闲着。**


---


## 05  Prompt Cache 复用：推测执行的经济学

推测执行听起来很酷，但有一个关键问题：**它划算吗？**

每次推测执行都是一次完整的 forked agent 调用。如果预测准确率只有 30%，那 70% 的推测调用都是浪费。Claude Code 的答案是 prompt cache 复用。

forkedAgent.ts 里定义了一个 CacheSafeParams 类型，包含五个字段：系统提示词、用户上下文、系统上下文、工具使用上下文、父进程对话历史。这五个字段必须和父进程完全一致，才能命中 prompt cache。


> *PR #18143 tried effort:'low' and caused a 45x spike in cache writes (92.7% -> 61% hit rate).*
> 有人尝试设置 effort:'low' 来省 token，结果 cache 命中率从 92.7% 暴跌到 61%，cache write 飙升 45 倍。

这个事故揭示了推测执行的经济学本质：**fork 的边际成本取决于 cache hit rate**。在 92.7% 的 cache hit rate 下，fork 只需为新增内容付费，成本极低。一旦 cache 失效，fork 的成本就等于一次完整的对话请求。


![05_cache复用对比](material/pngs/05_cache复用对比.png)

所以源码里到处都是对 cache 的小心翼翼：

- fork 不设置 maxOutputTokens——因为这会影响 budget_tokens，进而破坏 cache key
- fork 不覆盖 effortValue——同上
- 建议生成使用 skipCacheWrite: true——因为建议的 fork 是“用完即弃”的
- 如果父进程的未缓存 token 超过 10,000，直接放弃生成建议
这些细节加在一起，画出了一条清晰的设计红线：**能复用缓存才做推测，不能复用就不做。经济学先于功能。**


---


## 06  边界与克制：推测执行的刹车系统

**知道什么不能推测，比知道能推测什么更重要。**

speculation.ts 里定义了两组工具白名单：

- 安全只读工具（自由使用）：Read、Glob、Grep、ToolSearch、LSP、TaskGet、TaskList
- 写工具（重定向到 overlay）：Edit、Write、NotebookEdit——但前提是权限模式允许
- Bash 命令：只允许只读命令，任何可能产生副作用的命令都被拒绝
- 所有其他工具：无条件拒绝。WebFetch、Agent、MCP 工具——碰到就停
每种停止都被分类为一个完成边界（CompletionBoundary）：bash、edit、denied_tool、complete。这些边界数据全部通过 tengu_speculation 事件上报分析。


![06_权限边界矩阵](material/pngs/06_权限边界矩阵.png)

一个细节值得注意：推测执行中的 Bash 命令不仅要通过只读检查，还要通过 commandHasAnyCd 检测——如果命令里有 cd，也会被拦截。因为改变工作目录会影响后续所有文件操作的路径解析。

这套边界设计的哲学是**“安全默认拒绝”（deny by default）**——不在白名单里的一律不做。宁可少推测几步，也不冒产生不可逆副作用的风险。


---


## 07  对从业者意味着什么

这套系统背后有一个清晰的产品洞察：**开发者在编程工作流中的“操作类”动作是高度可预测的。**

写完代码之后，下一步大概率是“跑测试”。测试通过之后，大概率是“提交”。提交之后，大概率是“推送”。这些操作不需要创造力，不需要判断力，只需要有人（或有 AI）按照惯性去做。

```
After code written → "try it out"
Task complete, obvious follow-up → "commit this" or "push it"
Claude asks to continue → "yes" or "go ahead"
After error or misunderstanding → silence (let them assess/correct)
```

前三条是可预测的操作流，最后一条是需要人类判断的场景。这条边界的位置，恰恰定义了 AI 编程助手的下一个进化方向：**接管操作流，释放判断力。**

Google 在 2022 年发表的 Speculative Decoding 论文，把 CPU 推测执行的思想用在了 LLM 推理加速上。Claude Code 做了第二次跨域迁移：从模型推理层到人机交互层——用 LLM 预测人类的意图。

两次迁移的共同逻辑是：**在任何存在等待的地方，都可以用预测+回滚来换取速度。**

对于 AI 产品的从业者来说，这意味着“人机交互延迟”正在成为和“模型能力”同等重要的竞争维度。模型的能力差距在缩小，但用户体验的差距可以通过工程手段拉开。

Claude Code 的意图流水线给出了一个方向：**不要让人等机器，让机器抢跑人。**


---


---


---


## 结语

从 CPU 的分支预测到 LLM 的 Speculative Decoding，再到 Claude Code 的意图流水线——同一个思想完成了三次跨域迁移。每一次迁移的核心都是：用预测换时间，用回滚保安全。


**三个关键启示：**

1. **意图流水线是 AI 工具的下一个竞争维度。** 不是更聪明，而是更快——让人感觉更快。
2. **经济学先于功能。** 能复用缓存才做推测，不能复用就不做。
3. **知道什么不能推测，比知道能推测什么更重要。** Deny by default，安全第一。

---

原文链接：https://github.com/yasasbanukaofficial/claude-code  
Claude Code 源码拆解 #12 · 整理：AI Force