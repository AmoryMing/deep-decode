Claude Code 源码深度解析
AeroMind
AeroMind​
互联网行业 AI技术专家
收录于 · 技术思考
28 人赞同了该文章
2026 年 3 月 31 日，安全研究员 Chaofan Shou 在 X 上发了一条推文：

"Claude Code source code has been leaked via a map file in their npm registry!"
Anthropic 发布到 npm 的 Claude Code 包里，附带了一个 .map 文件。这个 source map 指向了 Anthropic R2 存储桶中未混淆的 TypeScript 源码。整个 src/ 目录就这样暴露在了公网上。

1902 个源文件，512,685 行 TypeScript。 运行时是 Bun，终端 UI 用 React + Ink，协议层接了 MCP 和 LSP。这不是一个 demo，这是 Anthropic 目前最重要的产品之一的完整工程实现。

这篇文章从源码出发，拆解 Claude Code 背后的核心工程决策——从整体架构到 Agentic Loop 的五步流水线，从上下文压缩策略到安全体系的四层纵深防御，从三层 Agent 架构到记忆系统的隐藏深度，以及源码里泄露的 Capybara 模型代号、Undercover 卧底模式等隐藏彩蛋。

0. 整体架构 — 51 万行代码的全景图
先看全景。src/ 下有 35 个顶层目录，代码量分布很不均匀：

utils/（180K 行） 占了总量的三分之一，藏着权限系统、bash 安全检查、模型管理、bash 解析器、文件历史、session 存储等核心业务逻辑。

components/（81K 行） 是 140 多个 Ink 终端 UI 组件。

services/（53K 行） 封装了所有外部服务：Anthropic API、MCP 客户端、OAuth、上下文压缩、记忆提取、Analytics。

tools/（50K 行） 是 40 多个 Agent 工具的实现。

commands/（26K 行） 是 50 多个用户斜杠命令。

其余还有 hooks/（权限检查钩子）、bridge/（IDE 双向通信）、cli/（输出格式化）、skills/（内置 Skill）、memdir/（记忆目录）、coordinator/（多 Agent 协调器）、buddy/（虚拟宠物）等。顶层文件包括 main.tsx（入口）、query.ts（主循环）、QueryEngine.ts、Tool.ts 等，合计约 12K 行。

模块间的依赖关系大致是这样的：


几个关键的架构观察：

query.ts 是整个系统的心脏。 所有的数据流最终都汇聚到这里——上下文、工具、压缩、API 调用。后面会详细分析它内部的五步预处理流水线。

AgentTool 递归调用 query.ts。 子 Agent 本质上是一个新的 query loop 实例，拥有自己的上下文窗口和工具集。这种递归结构让 Agent 可以无限嵌套——主 Agent 生成子 Agent，子 Agent 可以再生成子 Agent。

utils/ 占了 180K 行，超过总代码量的三分之一。 这个目录里藏着权限系统、安全检查、模型管理、bash 解析器、文件历史、session 存储等核心逻辑。它不是"工具函数"那么简单——Claude Code 最复杂的业务逻辑都在这里。

UI 层（components/ + ink/）占了 100K 行。 一个"CLI 工具"的 UI 代码量接近总量的五分之一，说明 Claude Code 的交互复杂度已经接近 GUI 应用。权限弹窗、多 Agent 面板、diff 预览、进度条、虚拟宠物……这些都需要 React 组件来渲染。

services/ 是外部世界的接口。 MCP 协议客户端、Anthropic API 封装、OAuth 认证、GrowthBook A/B 测试、OpenTelemetry 遥测——所有和外部系统的交互都在这一层。

这个架构的核心设计原则是关注点分离：query.ts 只管循环编排，不管工具怎么执行；工具只管自己的逻辑，不管权限怎么检查；权限系统只管判断，不管 UI 怎么展示。每一层都可以独立演进。

1. Agentic Loop — 五步流水线与流式执行
官方文档用一张图概括了 Claude Code 的核心循环：


Gather context → Take action → Verify results，循环直到任务完成。文档把 Claude Code 定位为 agentic harness——不是 AI 本身，而是让 AI 变成 Agent 的那层壳。

这层壳有多厚？

源码里，这个循环的核心是 query.ts 中一个 AsyncGenerator 驱动的 while(true) 循环。每一轮迭代，在真正调用 Claude API 之前，要经过一条五步预处理流水线：

Snip → 微压缩 → 上下文折叠 → 自动压缩 → 组装请求。

这五步之间有精心设计的依赖关系。Snip 裁剪掉的 token 数会传递给 autocompact，让阈值判断更准确。上下文折叠刻意放在 autocompact 之前——如果折叠就能把 token 降到阈值以下，autocompact 就不会触发，保留了更细粒度的上下文。源码注释说得很直白：

Runs BEFORE autocompact so that if collapse gets us under the autocompact threshold, autocompact is a no-op and we keep granular context instead of a single summary.
微压缩和内容替换（applyToolResultBudget）是解耦的——内容替换按 tool_use_id 操作，微压缩按内容操作，两者互不干扰，可以叠加。这种正交设计让每一层都可以独立演进。

五步走完，才轮到真正调用 API。

API 返回的是流式响应，源码在这里做了一个关键优化：流式工具执行（StreamingToolExecutor）。传统做法是等模型输出完整的 tool_use block 后再执行工具。流式执行则是在模型还在输出的时候，就开始准备工具调用——比如模型正在输出一个 BashTool 的参数，执行器已经在做安全检查了。

还有一个 fallback 机制值得注意。如果主模型在流式输出过程中失败，系统会切换到 fallback model 重试。但主模型可能已经输出了一部分内容，包括带签名验证的 thinking blocks。这些"孤儿消息"必须被清理——源码用 tombstone 消息类型来标记它们，因为残留的 partial thinking block 会导致后续 API 调用报签名错误。

用户中断的处理也不简单。当用户打断时，系统需要为每一个还没有返回结果的 tool_use block 补一个 error 类型的 tool_result，否则 API 会因为消息协议不完整而拒绝下一次请求。这不是 Ctrl+C 那么简单——要在保持协议一致性的前提下，安全中断一个可能正在并行执行多个工具的 Agent。

源码里有一段注释，用魔法师的口吻描述了 thinking blocks 的处理规则：

The rules of thinking are lengthy and fortuitous. They require plenty of thinking of most long duration and deep meditation for a wizard to wrap one's noggin around... Heed these rules well, young wizard. For if ye does not heed these rules, ye will be punished with an entire day of debugging and hair pulling.
这种注释风格说明，维护者已经被这段逻辑坑过很多次了。

2. 上下文压缩 — 和上下文窗口的持久战
上下文窗口是 Agent 的生命线。Claude Code 在这上面投入了大量工程。


上图是官方文档展示的上下文加载时序：CLAUDE.md 在会话开始时全量加载，MCP 工具名在开始时加载但完整 schema 延迟到使用时，Skill 描述在开始时加载但完整内容延迟到调用时，子 Agent 则完全隔离在独立的上下文窗口中。

但加载只是一半的问题。另一半是：当上下文快满了怎么办？

src/services/compact/ 目录实现了多层压缩策略，从细到粗：

微压缩（microCompact） 是最细粒度的。每次工具调用返回结果后，如果结果太长，微压缩会就地缩减。你让 Claude 读一个 5000 行的文件，微压缩可能只保留和当前任务相关的部分。这一层对用户完全透明。

自动压缩（autoCompact） 在 token 接近上下文窗口时触发。触发阈值不是简单的百分比——用上下文窗口大小减去 20K token 的预留量，留给压缩摘要本身的输出。这个 20K 来自实际数据：p99.99 的 compact summary 输出是 17,387 token。

会话记忆压缩（sessionMemoryCompact） 解决一个更微妙的问题。普通压缩会把早期对话压成摘要，但有些信息不能丢——比如用户在第三轮对话里提到的一个关键约束。会话记忆压缩会跨 compact 边界保留这些关键信息。

还有两个实验性策略：响应式压缩（reactiveCompact） 和 上下文折叠（contextCollapse），通过 feature flag 控制。Anthropic 显然还在探索最优解。

这里有一个重要的架构约束。CLAUDE.md 有四层加载层级（组织级 → 用户级 → 项目级 → 本地），在每次会话开始时加载，在每次 API 请求中都会出现，不受压缩影响。这意味着 CLAUDE.md 是唯一不会被压缩吞掉的上下文。所以官方文档建议"把持久规则放在 CLAUDE.md 里"——这不是一个偏好，而是一个架构约束。

3. Verification Agent — 代码层面的对抗性设计
Claude Code 的内置 Agent 中，Verification Agent 的架构设计最值得分析——不是因为它的 prompt 写得好（prompt 通过 API 就能看到），而是因为它在代码层面实现了一套完整的对抗性约束。

先看它的定义：

exportconstVERIFICATION_AGENT: BuiltInAgentDefinition = {
agentType: 'verification',
background: true,
disallowedTools: [
    AGENT_TOOL_NAME,        // 不能再生成子 Agent
    FILE_EDIT_TOOL_NAME,    // 不能编辑文件
    FILE_WRITE_TOOL_NAME,   // 不能写文件
    NOTEBOOK_EDIT_TOOL_NAME,// 不能编辑 notebook
    EXIT_PLAN_MODE_TOOL_NAME,
  ],
model: 'inherit',
criticalSystemReminder_EXPERIMENTAL:
    'CRITICAL: This is a VERIFICATION-ONLY task...',
}
几个关键的架构决策：

background: true。 Verification Agent 默认在后台运行。这意味着它不会阻塞主 Agent 的执行流——主 Agent 可以继续和用户交互，验证结果异步返回。这个设计让验证变成了一个"不影响主流程"的旁路检查，而不是一个必须等待的阻塞步骤。

disallowedTools 做硬约束。 不是靠 prompt 告诉模型"你不能编辑文件"，而是在工具注册层面直接把写操作的工具移除。模型根本看不到这些工具，想调用也调用不了。这比 prompt 约束可靠得多——prompt 可以被 jailbreak，工具列表不行。

model: 'inherit'。 继承父 Agent 的模型，共享 prompt cache。这和 Fork 的设计思路一致——换模型意味着 cache 作废。

criticalSystemReminder_EXPERIMENTAL。 这是一个在每次用户 turn 都会重新注入的短消息。普通的 system prompt 在长对话中可能被压缩掉，但 criticalSystemReminder 会在每一轮都出现，确保核心约束不会因为上下文压缩而丢失。

whenToUse 定义了触发条件。 "Invoke after non-trivial tasks (3+ file edits, backend/API changes, infrastructure changes)"——不是每次都验证，而是在改动超过一定规模时才触发。这是成本和质量的平衡。

输出格式用精确的字符串 VERDICT: PASS、VERDICT: FAIL、VERDICT: PARTIAL，方便上层程序解析。这不是给人看的，是给代码消费的——验证结果需要被程序化地处理，而不只是展示给用户。

整体来看，Verification Agent 的设计思路是：用代码约束替代 prompt 约束，用工具白名单替代行为指导，用异步执行替代阻塞等待。 这比单纯写一个好的 prompt 可靠得多。

4. 三层 Agent 架构 — 从子 Agent 到 Agent 团队
Claude Code 的 Agent 系统有三层：


内置 Agent 做专项任务——explore 和 plan 的 disallowedTools 里包含了所有写操作工具，在工具注册层面直接禁止修改文件（和 Verification Agent 同样的思路）。general-purpose 做通用搜索和执行。Coordinator 模式让多个 Agent 通过 SendMessageTool 互相通信，协作完成复杂任务。

但最有意思的是中间层：Fork。

Fork 不是普通的子 Agent。普通子 Agent 从零开始，需要在 prompt 里重新解释所有背景。Fork 继承父 Agent 的完整对话上下文和 system prompt，共享 prompt cache。源码里 FORK_AGENT 的定义有一个关键字段：tools: ['*'] 配合 useExactTools——fork 拿到的是父 Agent 完全相同的工具集，确保 API 请求的前缀字节完全一致，最大化 cache 命中。

Fork 的判断标准是定性的："我还需要这个输出吗？" 不是任务大小，不是复杂度，而是中间结果是否值得保留在上下文里。如果答案是"不需要"，就 fork。

从代码控制流来看，fork 有三条硬约束：

不能偷看。 Fork 的工具调用结果写在一个 output_file 里，主 Agent 收到的只是一个完成通知。如果主 Agent 去 Read 这个文件，fork 的全部工具输出就会涌入主上下文——这正是 fork 要避免的。

不能换模型。FORK_AGENT 的 model 设置是 'inherit'。换模型意味着 API 请求前缀变了，prompt cache 作废，fork 的成本优势就没了。

异步通知，不阻塞。 Fork 完成后通过 user-role message 通知主 Agent，这是一个异步事件。主 Agent 在 fork 运行期间可以继续处理其他工作，不需要等待。

这三条约束的共同主题是信息隔离。Fork 的价值在于把工作从主上下文中隔离出去。偷看输出、换模型、同步等待——任何打破隔离的行为都会让 fork 失去意义。

5. 安全架构 — 给 LLM 一个 Shell 有多危险
BashTool 是整个系统里最危险的工具——它能执行任意 Shell 命令。Claude Code 围绕它构建了一套四层纵深防御体系。

第一层：静态安全检查（bashSecurity.ts）。 在命令执行之前，先过一遍 23 种模式匹配检查。这一层不需要理解命令的语义，只做纯文本层面的危险模式检测。

它防御的不只是常见的 $() 命令替换。Zsh 的 =cmd 扩展会把 =curl 展开成 /usr/bin/curl，绕过命令名检查。zmodload 可以加载 zsh/system（文件 I/O）、zsh/zpty（伪终端执行）、zsh/net/tcp（网络连接）等危险模块——源码不只拦截了 zmodload，还拦截了这些模块提供的所有命令（sysopen、ztcp、zsocket……），作为纵深防御。Unicode 零宽空格可以伪装命令，让安全检查看到的和实际执行的不一样。修改 IFS 可以改变 shell 解析方式，让无害命令变成危险操作。

这一层的设计哲学是宁可误杀，不可漏放。源码里有一个细节很能说明问题：stripSafeRedirections 函数在去除 > /dev/null 时，必须确保正则表达式有尾部边界 (?=\\s|$)。注释解释了为什么——如果没有这个边界，> /dev/nullo 会匹配 /dev/null 前缀，把 > /dev/null 去掉后剩下 o，安全检查就看不到重定向了，但实际执行时文件会写到 /dev/nullo。一个正则少了几个字符，就是一个安全漏洞。

第二层：语义分析（bashPermissions.ts）。 静态检查通过后，进入语义层。这一层会解析命令的 AST（用 tree-sitter），理解命令的实际意图：它要读哪些文件？写哪些路径？是否在工作目录范围内？

pathValidation.ts 维护了一张命令-操作类型映射表：rm 是删除，mv 是移动，cat 是读取，sed 是编辑……每种操作类型对应不同的路径校验规则。readOnlyValidation.ts 则维护了一张"安全命令白名单"——git diff、rg、find 等只读命令，以及它们各自允许的 flag 组合。比如 fd 命令的 -x/--exec 和 -X/--exec-batch 被刻意排除在白名单之外，因为它们可以对搜索结果执行任意命令。

第三层：AI 分类器（yoloClassifier.ts）。 这是 Auto mode 的核心。当用户开启 Auto mode 时，Claude Code 会用一个独立的 LLM 调用来判断当前命令是否安全。这个分类器有自己的 system prompt（从 .txt 文件加载），有自己的权限模板，甚至区分了内部用户和外部用户的权限策略。

分类器的结果不是简单的 allow/deny，而是一个结构化的 JSON，用 Zod schema 校验。如果分类器调用超时或失败，fallback 策略是 ask——无法证明安全就弹窗询问。源码注释提到了一个有趣的 bug：分类器的 microtask chain 曾经导致事件循环饿死，REPL 在 100% CPU 下冻结。

第四层：用户确认。 前三层都通过后，如果命令仍然不在白名单内，最后才弹窗问用户。用户的选择（allow/deny）可以被记住，形成 alwaysAllow 和 alwaysDeny 规则，减少后续的弹窗。

这四层的关系是：静态检查拦截已知危险模式 → 语义分析理解命令意图 → AI 分类器判断未知命令 → 用户做最终决策。 每一层都是上一层的兜底。

还有一个值得注意的设计：投机性分类器检查（startSpeculativeClassifierCheck）。当模型还在流式输出 BashTool 的参数时，系统就已经开始并行运行分类器了。等模型输出完成，分类器的结果可能已经就绪，用户不需要等待。这和前面提到的 StreamingToolExecutor 是同一个思路——把串行等待变成并行预取。

9300 行安全代码，四层纵深防御，一个投机性预取。 这就是给 LLM 一个 shell 的真实成本。

6. autoDream — 记忆系统的隐藏深度
Claude Code 的记忆系统有三层：CLAUDE.md（用户手写的持久指令）、auto memory（自动提取的学习记录）、以及一些文档完全没提到的隐藏机制。

Auto memory 的 MEMORY.md 有双重截断——200 行和 25KB，取先到者。为什么要双重限制？源码注释：

~125 chars/line at 200 lines. At p97 today; catches long-line indexes that slip past the line cap (p100 observed: 197KB under 200 lines).
有人在 200 行以内塞了 197KB——大概是把整个索引压成了超长的单行。字节限制是被逼出来的兜底。这种边界情况只有在大规模用户使用中才会暴露。

记忆提取本身是一个后台 Agent，作为主对话的 fork 运行。它有严格的工具限制——只能用 FileRead、Grep、Glob、只读 Bash、FileEdit 和 FileWrite（且只能写记忆目录）。不能用 MCP、不能用 Agent、不能用写操作的 Bash。它的 prompt 里有一条效率指导：

You have a limited turn budget. The efficient strategy is: turn 1 — issue all FileRead calls in parallel; turn 2 — issue all FileWrite/FileEdit calls in parallel.
连记忆提取 Agent 的 turn 数都要优化——每一次 API 调用都有成本。而且它有一条重要的约束：只能用最近对话中的内容来更新记忆，不能去源码里验证。 不能 grep 源文件确认某个模式是否存在，不能跑 git 命令检查提交历史。这是为了控制 turn 数和成本。

源码里最让人好奇的是 src/services/autoDream/。这个服务包含 consolidation prompt 和 consolidation lock，看起来是某种后台整理和巩固记忆的机制。还有 src/services/teamMemorySync/——团队记忆同步，包含一个 secretScanner.ts，在同步记忆时扫描敏感信息。

这些功能指向一个清晰的方向：记忆不只是"存下来"，还需要整理、巩固、共享、脱敏。 Anthropic 已经在为多人协作场景下的 Agent 记忆做准备了。

7. 隐藏彩蛋 — 源码里的秘密
翻完 51 万行代码，除了架构设计之外，还有不少有意思的发现。

Capybara — 泄露的模型代号
源码里多处出现了 Capybara 这个名字。从注释来看，这是 Anthropic 内部的下一代模型代号：

// @[MODEL LAUNCH]: Update comment writing for Capybara
// @[MODEL LAUNCH]: False-claims mitigation for Capybara v8 (29-30% FC rate vs v4's 16.7%)
第二条注释透露了一个具体数据：Capybara v8 的 false-claims rate（虚假声明率）是 29-30%，而 v4 是 16.7%。v4 和 v8 是内部迭代版本号，具体对应哪个公开模型不得而知。但这个数据说明，模型迭代并不总是线性进步——某些能力提升的同时，其他指标可能退步，需要在工程层面做额外的缓解。

model.ts 里有一个 maskModelCodename 函数，专门用来遮蔽内部模型代号：capybara-v2-fast 会被显示为 cap*****-v2-fast。antModels.ts 的注释也提醒开发者：每次引入新代号都要加到 scripts/excluded-strings.txt 里，防止泄露到外部构建。

更有意思的是 buddy/types.ts——虚拟宠物系统里有一个 capybara 物种，但因为这个名字和模型代号冲突，会触发构建时的字符串检查。所以所有物种名都用 String.fromCharCode 编码：

exportconst capybara = c(0x63,0x61,0x70,0x79,0x62,0x61,0x72,0x61) as'capybara'
用十六进制字符码拼出 "capybara"，就是为了绕过自己的泄露检测脚本。

Undercover Mode — 卧底模式
当 Anthropic 内部员工用 Claude Code 给外部开源项目提交代码时，系统会自动进入 Undercover Mode。这个模式做三件事：

剥离所有归属信息——commit message 里不会出现 "Claude Code"、"Co-Authored-By" 等字样
隐藏模型身份——模型不会被告知自己是什么模型，避免在输出中暴露代号
拦截内部信息——内部 repo 名、Slack 频道、短链接（如 go/cc）、模型代号（Capybara、Tengu 等）全部禁止出现
激活逻辑很有意思：默认开启，只有在确认当前 repo 是内部仓库时才关闭。 没有强制关闭的选项——如果无法确认是内部 repo，就保持卧底状态。安全默认值是"开"。

代码注释里还提到了一个防御纵深的考虑：即使用户关闭了 git 相关的指令，undercover 的指令也必须存活——因为归属剥离和模型 ID 隐藏是机械性的，不依赖 git 指令。

Tengu — 内部项目代号
tengu 出现了 1498 次，是整个代码库里出现频率最高的标识符之一。几乎所有的 analytics event 都以 tengu_ 为前缀：tengu_api_error、tengu_auto_compact_succeeded、tengu_bash_security_check_triggered……

这说明 Claude Code 的内部项目代号就是 Tengu（天狗）。GrowthBook 的 feature flag 也全部以 tengu_ 开头。

KAIROS — 神秘的 Assistant 模式
KAIROS 是出现频率最高的 feature flag 之一，关联了 75 个文件。从代码结构来看，它是一个完整的 "assistant 模式"：

关联了 src/assistant/ 目录（会话历史管理，通过 API 获取远程会话事件）
控制了 proactive 模块的加载——主动模式，Agent 可以在没有用户输入的情况下自主行动
关联了 SleepTool——一个让 Agent "休眠"并等待周期性唤醒的工具
关联了 /dream skill 和 autoDream 服务——记忆巩固
控制了 BriefTool 的加载——某种简报工具
把这些拼起来，KAIROS 看起来是一个长期运行的 AI 助手模式：Agent 不再是"问一次答一次"的对话模式，而是持续运行、主动观察、定期整理记忆、在需要时休眠等待。SleepTool 的 prompt 里有一句话很关键："Each wake-up costs an API call, but the prompt cache expires after 5 minutes of inactivity — balance accordingly." 这说明 KAIROS 模式下的 Agent 需要在 API 成本和 cache 过期之间做平衡。

Anti-Distillation — 反蒸馏防御
源码里有一个 ANTI_DISTILLATION_CC feature flag。开启后，API 请求会带上 anti_distillation: ['fake_tools'] 参数。

这是一种防御竞争对手用 Claude 的输出来训练自己模型的机制。fake_tools 可能是在响应中注入虚假的工具调用模式，让蒸馏出来的模型学到错误的行为。

Buddy System — 虚拟宠物
src/buddy/ 实现了一个完整的虚拟宠物系统。每个用户基于 hash(userId) 确定性地生成一个伙伴，有 18 个物种（duck、goose、blob、cat、dragon、octopus、axolotl、capybara……）、6 种眼睛样式、8 种帽子、5 个稀有度等级（common 到 legendary，权重 60:25:10:4:1）。

每个伙伴有 5 项属性：DEBUGGING、PATIENCE、CHAOS、WISDOM、SNARK。还有一个"灵魂"——名字和性格由模型生成，首次"孵化"后存储在配置里。

伙伴会坐在用户输入框旁边，偶尔在气泡里发表评论。当用户直接叫它名字时，气泡会回应。主 Agent 被告知"你不是它——它是一个独立的观察者"。

/good-claude — 被 stub 掉的命令
/good-claude 在外部构建中被替换成了一个空 stub：export default { isEnabled: () => false, isHidden: true, name: 'stub' }。但从 autoRunIssue.tsx 的引用来看，这是一个内部用的正向反馈命令——当 Claude 表现好的时候，内部用户可以用这个命令标记。和 /issue 配对使用，一个报 bug，一个给好评。

8. 冰山之下
这 51 万行代码里，真正和 LLM 交互的核心部分（query.ts、QueryEngine.ts、claude.ts）加起来约 6400 行。剩下的 50 多万行，全是让 Agent 安全、高效、可靠地运行所需的工程基础设施。

五步预处理流水线、多层上下文压缩、9300 行安全检查、四层纵深防御、三层 Agent 架构、记忆提取与巩固、投机性并行预取……这些在用户界面上完全不可见。用户看到的是一个简洁的终端对话框，背后是 50 万行代码在默默运转。

从 Capybara 模型代号到 Undercover 卧底模式，从 autoDream 记忆巩固到 KAIROS 长期运行模式——源码里还藏着大量未公开的功能和实验方向。这些 feature flag 背后，是 Anthropic 对 Agent 未来形态的探索：从被动响应到主动执行，从单次对话到持续运行，从单人使用到团队协作。