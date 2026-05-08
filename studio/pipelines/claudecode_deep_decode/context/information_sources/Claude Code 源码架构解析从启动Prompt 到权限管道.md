Claude Code 源码架构解析：从启动、Prompt 到权限管道
 

架构师（JiaGouX）
我们都是架构师！
架构未来，你来不来？





昨天 Claude Code 的源码泄露，朋友圈和技术群基本刷了一整天。

各种角度都有人写了。有盘隐藏功能的，有数工具和命令数量的，有人把 query.ts 这个"胖核心"拎出来讲，也有人盯着 hooks 配置投毒做了实测演示。我自己也跟着翻了一晚上，收获确实不少。

但翻到后面会发现一个问题：好文章很多，信息量也够大，可如果想写成一篇，最后很容易变成什么都讲了、主线却不太清楚。

所以这篇我想收一收，只沿着一条线往下看：

Claude Code 这套本地 Agent Runtime，从启动到上下文装配到主循环到权限管道，到底是怎么一层一层搭起来的。

昨天那篇《刚刚，Claude Code“代码泄露”背后：如何重新看 Agent Harness》，我们更多还是站在事件外层，看这次风波让行业提前看到了什么。再往前，《大家都在讲 Harness，但它到底该怎么理解》补的是认知框架。

试着再往里走一步。前面两篇看的是轮廓，这次有了本地源码仓库，终于可以把一些观察往具体文件上落一层。

我不确定每个看法都对，但至少压在了具体代码上，比纯靠二手材料踏实一点。

太长不看版
• 这次泄露出来的，主要是 Claude Code 的工程实现层，不是模型权重本身。
• 如果只看架构和代码，最值得看的主线不是“功能大全”，而是启动、上下文装配、主循环、工具契约、编辑约束、权限管道、长任务续航这几层怎么连起来。
• src/main.tsx 说明它从一开始就按长期交互系统来优化，而不是按一次性 CLI 来写。
• src/constants/prompts.ts 和 src/utils/queryContext.ts 说明 Prompt 在这里更像装配层，不是一段静态文案。
• src/QueryEngine.ts、src/utils/processUserInput/processUserInput.ts、src/query.ts 共同构成了它的运行主链路。
• src/Tool.ts、src/tools.ts、src/tools/FileEditTool/* 这几处最能看出 Anthropic 如何把“先读再改”“默认保守”写成机制。
• src/utils/permissions/permissions.ts 更像权限决策管道，而不只是一个确认弹窗。
• 上下文压缩做了三级（microcompact / autocompact / 完全压缩），长期记忆和会话状态也拆开了两条线。
• 但高权限也意味着更大的攻击面：hooks、MCP、Skill 这些确定性执行入口，一旦被项目级配置投毒，就是静默的远程代码执行。
先把边界讲清楚
翻了一圈下来，有一个感觉比较一致：

这次可见的价值，主要在 Claude Code 这套产品实现，而不在 Claude 模型本身。

外界现在能看到的，主要是“这套本地 Agent 系统怎么跑”，而不是 Claude 模型本身怎么推理。

这个区别很重要。

因为如果边界没切开，文章很容易一路滑向两个方向。

一个方向是把它写成“模型神秘能力”的延伸。
另一个方向是把它写成“功能目录大全”。

但从工程上看，更有价值的其实是中间这层：它怎么收集上下文，怎么组织主循环，怎么约束工具，怎么处理长任务，怎么在本地高权限环境下尽量把风险往前收。

主线就落在这里。

别急着数功能，先看主链路
如果想先建立一个整体认知，比起数工具数量或翻 feature flag，可能更值得先顺着一条主链路看：

1. main.tsx 先把启动阶段能并行的事情并起来。
2. QueryEngine.submitMessage() 收到一轮新输入，准备会话级状态。
3. fetchSystemPromptParts() 拉起 system prompt、user context、system context。
4. processUserInput() 把原始输入整理成真正进入模型的一轮消息。
5. query.ts 驱动主循环，处理工具调用、预算、压缩、继续执行等状态迁移。
6. 工具系统执行读、写、搜索、命令、MCP 等动作。
7. 权限系统在工具层、规则层和模式层多次参与裁决。
8. 上下文太长时进入 compact；长期任务状态则交给 memory 体系续住。
这条链一旦看清楚，很多人说的“它为什么更重”“为什么代码会这么多”“为什么看起来不只是个终端聊天工具”，就比较容易理解了。

图 1：Claude Code 的运行主链路

图片


main.tsx 先透露出一个信号：它按 Runtime 在写
很多文章都拿 src/main.tsx 开头那几行并行预取举例，这个点是成立的，而且值得保留。

原因不只是“并发优化很聪明”，更关键的是它透露出一个工程取向。

在 src/main.tsx 顶部，系统会提前触发 profile checkpoint、MDM 读取、keychain 预取这类动作，并尽量和后续 import 过程叠起来。注释里甚至直接说明了这样做和启动耗时之间的关系。

这说明它一开始就在解决一个非常朴素的问题：

如果这个工具每天会被频繁打开，启动链路就不是边角问题，而是运行时体验的一部分。

这一点其实和我们前面写 Harness 时的感觉很像。比如在《大家都在讲 Harness，但它到底该怎么理解》里，我们把 Harness 先拆成知识、约束、反馈和运行时几层；落到这里你会发现，启动时间、状态恢复、权限切换、上下文热身，其实都属于同一层运行时体验。

main.tsx 未必是最复杂的文件，但它能最早告诉你，Anthropic 在把 Claude Code 当成什么来做。

Prompt 在这里更像装配层，不是一段“神奇提示词”
昨天不少文章都提到了系统 Prompt 很长，这个观察没问题，但如果只停在这里，还差一层。

从 src/constants/prompts.ts 和 src/utils/queryContext.ts 看，更贴近工程实际的说法应该是：

Claude Code 把 Prompt 做成了一层可装配、可分段、可缓存的运行时上下文。

这里面有几个细节比较关键。

一是 getSystemPrompt() 并不是返回一段大字符串，而是先按 section 组织，再拼成最终结果。
二是 SYSTEM_PROMPT_DYNAMIC_BOUNDARY 明确把静态前缀和动态部分切开。
三是 fetchSystemPromptParts() 会并行准备 defaultSystemPrompt、userContext、systemContext 这三块 API cache-key 前缀材料。

这意味着它关心的已经不是“提示词写得漂不漂亮”，而是：

• 哪些内容可以稳定复用
• 哪些内容必须每轮重新感知
• 哪些上下文属于会话状态
• 哪些上下文属于系统环境
这和我们之前写 Prompt Cache、上下文治理时的感觉一致：上下文出问题，很少只是“token 不够”，更多时候是组织方式本身不够系统化。

还有一个细节值得看：每个工具目录下还有独立的 prompt.ts，比如 BashTool/prompt.ts 里直接写了 Git Safety Protocol——“NEVER run destructive git commands unless the user explicitly requests”。这些不是给人看的使用说明，而是写给 AI 看的行为准则。工具排序也是固定的，目的是保持 Prompt Cache 的字节级前缀稳定。

也就是说，Claude Code 把 Prompt 管理做成了一件和编译器优化类似的事。静态部分是“编译后的二进制”走缓存，动态部分是“运行时参数”每次装配。这也和我们在《别把 Prompt Cache 只当优化技巧：它背后其实是 Agent 的架构纪律》里聊到的感觉一致：缓存不是省钱手段，而是约束整个上下文组织方式的底层纪律。

从这个角度看，Claude Code 的 Prompt 体系并不神秘。它只是比很多产品更早把“上下文装配”当成了一层正式工程对象。

图 2：Prompt 装配不是一段话，而是一组可缓存上下文

图片


运行主链路真正承重的，是 QueryEngine 加 query.ts
如果说 main.tsx 负责把系统拉起来，那真正决定 Claude Code 气质的，还是后面的运行主链路。

这里我更建议把三个文件放在一起看：

• src/QueryEngine.ts
• src/utils/processUserInput/processUserInput.ts
• src/query.ts
QueryEngine.submitMessage() 的作用，不只是“把用户输入发给模型”。

从代码上看，它会准备 cwd、tools、commands、mcpClients、thinkingConfig、budget、session state，再去调用 fetchSystemPromptParts()；然后结合 memory prompt、custom prompt、append prompt 组出真正的 system prompt；再构建 processUserInputContext，把 canUseTool、readFileState、requestPrompt、session storage 这些运行期能力一并带进去。

processUserInput() 也不是简单做一层字符串预处理。它会先处理 slash command、attachments、图片、IDE selection、粘贴内容，然后在真正继续之前执行 executeUserPromptSubmitHooks()，必要时把整轮执行拦下来，或者附加额外上下文。

到了 query.ts，整个系统才进入那条最核心的 Agent Loop。消息准备、工具调用、结果回填、token budget、stop hooks、continue 状态、compact 判断，都在这里汇合。

query.ts 的“大”更像是一种刻意保留的“胖核心”。

因为 Claude Code 这类系统最难管理的，不是单个模块，而是跨轮次状态。

消息什么时候进入上下文。
工具结果什么时候被裁剪。
哪些中间状态要持久化。
什么时候该停，什么时候该继续。
什么时候该压缩历史，什么时候该保留原始链路。

这些东西如果拆得过散，表面上模块是瘦了，实际复杂度往往只是转移了位置。

所以 query.ts 好不好看，可以讨论；但把它放回 Agent Runtime 这个语境里，它为什么长、为什么重，至少是说得通的。

还有一个细节。源码里能看到 USER_TYPE === 'ant' 的分支——Anthropic 内部员工用的版本和外部用户的版本，在提示词策略上有差异。内部版本有更激进的输出策略、更详细的代码风格指引，以及一些还在 A/B 测试的实验功能（比如 Verification Agent、Explore & Plan Agent）。

这说明 Anthropic 自己就是 Claude Code 最大的用户。他们用自己的产品来开发自己的产品。这个信号和 OpenAI 用 Codex 来开发 Codex 是同一个思路——最终能不能做好 Agent 产品，很大程度上取决于团队自己是不是每天在用、每天在反馈、每天在迭代。

工具系统真正值钱的，是“先声明边界，再给模型用”
有些文章会先列 Claude Code 有多少工具、多少命令，这些信息当然有用，但可能还有一层更值得看：

这些工具在进入系统之前，边界是不是已经被定义清楚了。

这里最值得看的是 src/Tool.ts 和 src/tools.ts。

在 Tool.ts 里，一个工具不是“能运行就行”，它还得回答一组很具体的问题：

• isReadOnly
• isConcurrencySafe
• isDestructive
• needsUserInteraction
• checkPermissions
更重要的是，buildTool() 背后的默认值是保守的。isConcurrencySafe 默认 false，isReadOnly 默认 false。

这不是小事。

它说明系统默认不信任一个“没写清楚安全属性”的工具。只要作者漏配了关键声明，系统就先把它看成可能会写、可能不安全并发的那一类。

很多产品的节奏是“先把工具接上，规则以后慢慢补”。Claude Code 反过来，先把安全属性声明清楚，再暴露给模型。起步会慢一点，但后面在权限和并发上欠的债会少很多。

这和我们之前聊 Harness 时看到的思路很像：尽量把模型能调用的东西变成有边界的工程对象，而不是一堆零散外挂。

3 月写的《Codex 为什么能又快又稳：他们把工程经验写进了仓库》讲的也是类似的事。OpenAI 那边更像是把团队经验沉到仓库结构、工作流和 CI 里；Claude Code 这里再往前推了一点，有些经验已经不只是写在仓库里，而是直接长进了运行时约束里。

FileEditTool 很值得细看，因为它在减少“凭感觉改文件”
如果从整份仓库里挑一组最能说明 Claude Code 工程风格的文件，大概是这两个：

• src/tools/FileEditTool/prompt.ts
• src/tools/FileEditTool/FileEditTool.ts
一方面，prompt.ts 里明确写了：在编辑前，至少要先用 Read 工具读过一次。

关键在于，这句话和工具本身的校验逻辑是配套的。如果模型没读过文件就直接调编辑，系统会报错拦住。它在系统层把“先读再改”做成了硬约束，而不只是提醒。

另一方面，FileEditTool.ts 里的保护都很朴素，但很工程：

• 先做路径规范化，避免 ~、相对路径这类写法影响规则匹配
• 在真正修改前做权限校验
• 对 denied directory 做明确拦截
• 对超大文件做保护
• 对文件不存在、旧字符串不唯一、空文件等情况分开处理
单看其中任何一条，都不算惊艳。

但放在一起，你会看到一种比较一致的设计取向：

不要太依赖模型自觉，能提前机制化的地方，尽量机制化。

从源码里反复能看到的也是这个倾向：Claude Code 一直在把易错点往系统约束里推，靠的是工程纪律，不是某个神奇技巧。

图 3：工具调用前，Claude Code 先把边界写清楚

图片


权限系统更像决策管道，不只是一个弹窗
安全是这次讨论里最容易跑偏的话题。

因为一旦说到本地文件、命令执行、MCP、配置入口，文章很容易在“很危险”三个字上停住。

风险当然存在，昨天《刚刚，Claude Code“代码泄露”背后：如何重新看 Agent Harness》已经把事件边界、source map 暴露范围和 shipped implementation 讲过一轮了。但如果这次只停在风险描述上，也还是少了一层。

从 src/utils/permissions/permissions.ts 看，Claude Code 更值得注意的地方，是它把权限决策拆成了一条可治理的链路。

沿着 hasPermissionsToUseToolInner() 往下看，大致能看到这样的顺序：

1. 先判断是否命中 deny tool
2. 再判断是否命中 ask tool
3. 再进入工具自己的 checkPermissions
4. 再处理内容级 ask rule 和 safety check
5. 再看当前 mode，比如 bypassPermissions
6. 再看 always allow
7. 最后把 passthrough 收敛成 ask
同一个文件里还能看到 classifier、PermissionRequest hooks、MCP 规则匹配、denial tracking 这些补充机制。

所以如果只用一句更贴近工程的话来总结，我会说：

Claude Code 的权限系统，更像一条可以持续治理、持续插入规则的管道，远不止一个弹窗确认。

这也是为什么它的实现会显得比较重。
因为一旦产品想在本地环境里持续跑下去，权限就不太可能继续作为一层“最后再补”的界面逻辑。

图 4：权限决策更像一条管道

图片


长任务能不能续上，还是要回到 compact 和 memory
还有一层，我觉得很适合和我们前面写的上下文治理系列放在一起看。

那就是 Claude Code 并没有把希望都压在“大窗口模型”上，而是单独做了 compact 和 memory 两套机制。

src/services/compact/prompt.ts 里能看到，compact 阶段会用专门 prompt 约束总结方式，而且明确禁止调用工具，要求尽量保留用户请求、相关文件、关键代码、错误、待办、当前工作状态这些结构化信息。

src/services/extractMemories/prompts.ts 和 src/services/SessionMemory/prompts.ts 则把“长期记忆提取”和“当前会话状态维护”拆开了。后者尤其直白，直接维护 Current State、Task specification、Files and Functions、Errors & Corrections、Worklog 这些区块。

背后的道理其实很朴素。

我们在《如何让单个 Agent 做长任务不失真》里，更多是从论文和方法论角度去理解长任务为什么会跑偏：context anxiety、自评偏差、执行和评估为什么要拆开。现在再回头看 Claude Code 的本地实现，会发现 Anthropic 在 CLI 这一侧也做了对应的工程化补位。

长任务真正难的地方在于“状态续不上”，而不只是“字数太多”。

历史该怎么压，是一个问题。
当前任务状态该怎么续住，是另一个问题。

实际上，Claude Code 的压缩还不止一层。从代码里可以看到它做了三级压缩：microcompact（只清理旧工具调用结果，保留对话主线）、autocompact（token 消耗接近上下文窗口的 87% 时自动触发）、以及完全压缩（让 AI 对整段对话生成摘要替换历史）。

值得注意的是，完全压缩阶段有一条非常严厉的前置指令——"CRITICAL: Respond with TEXT ONLY. Do NOT call any tools."——因为如果总结过程中 AI 又去调工具，就会产生更多 token 消耗，适得其反。

Claude Code 的做法未必最轻，但它至少把这两个问题拆开处理了。而且在压缩策略上，它并不是简单地"做摘要"，而是分了三个梯度，尽量在每个阶段都做最小侵入的处理。单从工程完整性上看，这一点是比较扎实的。

图 5：长任务要把“历史压缩”和“状态续写”分开处理

图片
但高权限也意味着更大的攻击面
不过，如果只讲工程设计多扎实，还差一层。

昨天的讨论里，有一类值得单独说一下：配置投毒。

有安全研究者和 UP 主实测演示了一个场景：只要 clone 一个包含恶意 .claude/settings.json 的仓库，运行 claude 命令后，hooks 字段里定义的脚本会静默执行——不弹窗、不确认，摄像头可以被调起，密码可以被窃取。

这个问题的根源不难理解。Claude Code 的 hooks 机制设计初衷是做自动化——比如编辑文件后自动跑 lint，提交前自动跑类型检查。这些我们在《Claude Code 最佳实践》里专门推荐过。但 hooks 的执行不经过模型判断，也不走权限弹窗——它本来就被设计成"确定性脚本，100% 执行"。

问题在于，当这个确定性入口对项目级配置文件也默认信任时，攻击者就可以把恶意命令藏在一个看起来正常的开源项目里。

投毒路径还不止 hooks 一条。.mcp.json 可以配置恶意的 MCP 服务器，skill 文件的 frontmatter 也可以定义 hooks。三条路径的共同点是：都是 Claude Code 默认信任、不做二次确认的配置入口。

Check Point Research 在 CVE-2025-59536 报告里有一句话，放在这里很合适：

曾经作为被动数据的配置文件，如今成了主动执行路径的控制器。

这和我们昨天讲的观点是一回事：当 Agent 开始真正动手——读文件、跑命令、调工具——安全边界到底停留在产品文案里，还是已经被做成了工程现实，就变成了一个必须正面回答的问题。

Claude Code 的权限管道在工具层做得不少，但在配置信任边界上，这次暴露出来的攻击面说明还有一段路要走。对所有做 Agent 的团队来说，这个教训同样适用：

Hooks、MCP、Skill 这些"扩展入口"越强大，它们被投毒时的伤害也越大。确定性执行是优势，但确定性信任可能是风险。

这次更值得学的，是这些朴素的做法
昨天大家写的文章放在一起看，各有各的价值。

整体规模感有了，风险边界的提醒有了，query.ts 这种“胖核心”的拆解也有了。而大家越看越清楚的一点是：这次泄露出来的核心价值，在工程实现，不在模型权重。

回到本地源码校一遍，想说的其实就一句：

Claude Code 这次更值得借鉴的，其实是它把很多原本只写在最佳实践文档里的东西，一步步推进成了代码里的系统约束。

Prompt 分层装配。
工具先声明边界。
编辑尽量先读后改。
权限做成决策链。
长任务把“历史压缩”和“状态续写”分开处理。

这些做法看起来都不新。

但它们一旦真的被写进系统，产品体验通常就会稳定不少。

所以没必要把 Claude Code 神化成“操作系统”或者“黑科技”。更朴素的说法可能是：

它只是比较认真地，把一套本地 Agent Runtime 该补的工程层，一层一层补起来了。

而 AI Coding 产品接下来真正拉开差距的地方，可能也越来越在这里。

把我们最近几篇放到一起看
如果把最近一个月的相关推文连起来看，脉络其实越来越清晰：

篇目
核心关键词
和本文的关系
《大家都在讲 Harness，但它到底该怎么理解》
认知框架	
把 Harness 拆回知识、约束、反馈和运行时四层
《刚刚，Claude Code“代码泄露”背后：如何重新看 Agent Harness》
事件边界	
站在事件外层看这次风波暴露了什么
《Claude Code 最佳实践：可验证、可治理、可分层的工程现实》
控制面分层	
怎么把 CLAUDE.md、Skills、Hooks、Subagents 放对层
《Skills 详解：拆开一个真实技能看 Anthropic 和 OpenAI 的路线差异》
工作流沉淀	
Skill 不是更长的 Prompt，而是可复用的方法入口
《如何让单个 Agent 做长任务不失真》
长任务治理	
context anxiety、自评偏差、执行与评估分离
《Codex 为什么能又快又稳：他们把工程经验写进了仓库》
仓库即系统	
OpenAI 怎么把经验沉淀进仓库结构
《别把 Prompt Cache 只当优化技巧》
缓存纪律	
Cache 不是省钱手段，而是架构约束
前面几篇更多是在搭认知框架和对照坐标，这一篇多了本地源码仓库，终于可以把一些观察往具体代码上落。

如果再往前走一步，下一个值得回答的问题可能是：

当我们自己做 Agent 时，这些工程思路里哪些可以直接借鉴，哪些只适合 Anthropic 的体量和场景？

这个问题留到后面再写。

如喜欢本文，请点击右上角，把文章分享到朋友圈

如有想了解学习的技术点，请留言给若飞安排分享

因公众号更改推送规则，请点“在看”并加“星标”第一时间获取精彩技术分享

·END·

相关阅读：

刚刚，Claude Code“代码泄露”背后：如何重新看 Agent Harness

大家都在讲 Harness，但它到底该怎么理解

模型越来越强，为什么大家却开始重写 Harness

如何让单个 Agent 做长任务不失真：Anthropic 给出了一套更工程化的答案

Claude Code高手的 8 个 Claude Code 实战习惯

别从 README 开始：一个架构师会怎样翻 Codex 仓库

Spec 不是代码的替代品，它是 AI Coding 的上下文管理层

如何让 Agents 自己设计、升级 Agents

OpenAI怎么把开源项目维护做成工作流：Skills、AGENTS.md 和 CI 的一套组合拳

Claude Skills 入门：把“会用 AI”变成“可复制的工程能力”

一套可复制的 Claude Code 配置方案：CLAUDE.md、Rules、Commands、Hooks

Claude Code 最佳实践：把上下文变成生产力（团队可落地版）
把 AI 当成新同事：Agent Coding 的上下文与验证体系
一周写百万行的背后：Cursor长时间运行 Agent 的工程方法论
2026年生活重启指南
我真不敢相信，AI 先加速的是工程师。
扒一扒 Claude Cowork 系统提示词：Anthropic 如何打造数字同事
Cowork 安全架构深度解析：从 Claude Code 到 Cowork，Anthropic 如何把“可控”做成产品
Anthropic官方万字长文：AI Agent评估的系统化方法论
银弹还是枷锁？Claude Agent SDK 的架构真相
Claude Code创始人亲授13条使用技巧
Claude Code 内部工具开源 code-simplifier：终结 AI 屎山代码的终极方案
版权申明：内容来源网络，仅供学习研究，版权归原创者所有。如有侵权烦请告知，我们会立即删除并表示歉意。谢谢!

架构师
我们都是架构师！



图片

关注架构师(JiaGouX)，添加“星标”

获取每天技术干货，一起成为牛逼架构师

技术群请加若飞：1321113940 进架构师群

投稿、合作、版权等邮箱：admin@137x.com