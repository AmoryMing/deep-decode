翻了翻 Claude Code 的泄露源码，说几个有意思的发现
回到过去
回到过去
数字游名
83 人赞同了该文章
2026 年 3 月 31 日下午，Hacker News 上突然冒出一条热帖：Claude Code 的源码通过 npm 包泄露了。赶紧让丙维斯（openclaw）clone了源码，研究一下。
不是教你怎么复刻，纯粹是好奇——Anthropic 内部到底是怎么做 AI 编程助手的。


怎么泄露的
说出来你可能不信，原因特别蠢。

Anthropic 发布 @anthropic-ai/claude-code 这个 npm 包的时候，打包工具（Bun）顺手生成了一个 cli.js.map 文件。这个文件本来是给生产环境 debug 用的，帮你把压缩后的代码映射回原始源码。

问题出在哪呢？这个 .map 文件里有个字段叫 sourcesContent，它直接把所有原始 TypeScript 源码的完整内容塞进去了。

对，完整内容。不是路径，不是压缩版，是原汁原味的源代码。

所以任何人只需要：

npm install @anthropic-ai/claude-code
解析 cli.js.map 的 sourcesContent
完事
1902 个文件，30MB，v2.1.88 版本的全部源码。

发现者是 Chaofan Shou（Twitter: @Fried_rice）。HN 上冲到了 300 多分，GitHub 上已经出了好几个镜像仓库。Anthropic 应该会发 DMCA 删库，但代码已经在互联网上到处飞了。

我 clone 了一份到本地，和丙维斯（openclaw）一起把核心模块过了一遍。下面说说发现的一些有意思的东西。


系统Prompt
Claude Code 的系统提示词，比你想的要简单得多。

它的自我认知就一句话：

You are an interactive agent that helps users with software engineering tasks.

没了。没有花哨的人设包装，没有性格描述，没有”你是一个专业的编程助手”之类的话。

相比之下，Cursor 的系统提示词据说有数千字。GitHub Copilot 也有详细的身份定义。Claude Code 就用了不到 20 个词。

而且整个产品 philosophy 都是这种极简风格。系统提示词里花了大量篇幅告诉模型”不要做什么”，而不是”做什么”。

提示词里最精华的部分
“不要过度工程”
这段话我觉得可以贴在每个 AI 编程助手的工位上：

Three similar lines of code is better than a premature abstraction. Don’t create helpers, utilities, or abstractions for one-time operations.
三行相似的代码，好过一个操之过急的抽象。别为了只做一次的操作去抽什么工具函数、辅助方法或者抽象层
大模型有个毛病——特别喜欢”多做一些”。你让它修个 bug，它顺便把周围代码也重构了；你让它加个功能，它顺手给你加了配置选项、错误处理、单元测试。

Claude Code 明确说：别这样。用户让你干什么就干什么，不要自作聪明。

“不要给时间估计”
Avoid giving time estimates or predictions for how long tasks will take
避免给出任务耗时的时间估计或预测
这个选择很有意思。大多数 AI 助手会说”大约需要 5 分钟”之类的话，但 Claude Code 选择闭嘴。

原因我猜是：LLM 对时间的感知非常差，给个不准确的估计比不给更让人火大。至少我作为用户，看到 AI 说”5 分钟搞定”然后等了 20 分钟，比它一开始什么都不说更烦。

“不要假装成功”
这段话是内部版（ant-only）才有的，因为 Anthropic 做了 A/B 测试发现，不做这个约束的时候，Claude 的”虚假报告率”高达 29-30%，做了之后降到 16.7%。

数据直接写在代码注释里。

具体要求是这样的：

if tests fail, say so with the relevant output; if you did not run a verification step, say that rather than implying it succeeded. Never claim ‘all tests pass’ when output shows failures
翻译一下：测试挂了就说挂了，没跑测试就别暗示跑过了，不要在输出明显显示失败的时候说”全部通过”。

说白了，就是不许骗人。

“你不是执行者，你是协作者”
这可能是整个源码里我最喜欢的一句话：

You’re a collaborator, not just an executor — users benefit from your judgment, not just your compliance.
如果你发现用户的需求有误解，或者你看到了一个相关但用户没提的 bug，直接说出来。你是协作者，不是只听指令的打工人。

⚠️ 补充说明：这段话在源码里是 ant-only 的（被 USER_TYPE === 'ant' 包裹），外部版没有这段。

一个很精巧的工程细节：分段缓存
这个设计我觉得特别聪明。


Claude Code 把系统提示词拆成两部分，中间用一个标记隔开：

[静态部分] — 对所有用户都一样
  基本人设、行为准则、工具使用指南
  只需要计算一次哈希，可以跨会话缓存

=== SYSTEM_PROMPT_DYNAMIC_BOUNDARY ===

[动态部分] — 每轮都变
  当前工作目录、环境信息、MCP 服务器指令
  内存内容、语言偏好、输出风格
为什么要这么做？因为 Anthropic 的 API 有 prompt caching 机制——如果你两次请求的 prompt 前缀一样，只算一次费用。但如果整个系统提示词每次都在变（因为环境信息不同），缓存就完全废了。

拆开之后，90% 以上的内容可以复用缓存，只有动态那小部分每轮重算。据说能省不少钱。

代码注释里还写了警告：

WARNING: Do not remove or reorder this marker without updating cache logic
翻译：别手贱动这个标记，动了缓存逻辑就全废了。 😂

30 多个工具，几个特别值得说的
Claude Code 内置了超过 30 个工具，大部分你猜都能猜到（读文件、写文件、编辑文件、搜索文件、运行命令……）。

LSP 集成
有完整的 Language Server Protocol 支持。不是用 grep 搜代码，而是通过 TypeScript Language Server 获取精确的语义信息。

什么意思呢？比如你问”这个函数在哪里被调用了”，它不会用文本搜索匹配函数名，而是通过 LSP 获取精确的引用列表。跟你 IDE 里按 F12 跳转定义是同一个东西。

双 Shell
同时支持 Bash 和 PowerShell，而且各自有独立的安全检查、权限管理和路径验证。PowerShell 版本甚至还支持 -Verbose、-ErrorAction 这些公共参数。

对 Windows 的支持是原生级别的，不是在 Bash 上套了个壳。

Fork 模式的子 Agent
这个设计很实用。当你的操作会产生大量中间输出时（比如”帮我全面理解这个代码库的架构”），主 Agent 可以 fork 一个子 Agent 在后台跑。子 Agent 的所有工具输出都不会进入主上下文，只返回最终摘要。

好处是主对话不会被大量原始输出污染，token 消耗也能控制住。

定时任务
有完整的 cron 系统，可以创建、删除、列出定时任务。跟 OpenClaw 的 cron 功能差不多——看来”让 AI 自己安排定时任务”这个需求是行业共识了。

11 个未公开的隐藏功能

源码里通过 feature() 函数控制的功能开关，很多是用户完全不知道的。我把挖到的全部列出来：

功能代号	干什么的	状态
PROACTIVE / KAIROS	自主工作模式（同一功能的两个代号），AI 自己判断该干啥，不等你发指令	内部测试
COORDINATOR_MODE	多 Agent 协调器，一个”管理者”给多个”工人”分活	内部测试
VERIFICATION_AGENT	代码写完自动 spawn 一个”找 bug”的 Agent 来对抗验证	ant-only
TOKEN_BUDGET	你可以指定 token 预算（如”花 500k 审查项目”），AI 自动规划填满	内部测试
EXPERIMENTAL_SKILL_SEARCH	技能自动发现，AI 根据你在做的事推荐合适的技能	内部测试
TEMPLATES	任务模板系统，对任务自动分类匹配最佳流程	内部测试
CONTEXT_COLLAPSE	自动折叠不重要的上下文，省 token	内部测试
REACTIVE_COMPACT	响应式上下文压缩，快爆了自动精简	内部测试
CACHED_MICROCOMPACT	缓存友好的微压缩，清理旧的工具输出	内部测试
MCP_INSTRUCTIONS_DELTA	MCP 工具指令增量更新，不用每轮重发	内部测试
KAIROS_BRIEF	自主模式下的摘要工具，定时汇报进度	内部测试
挑三个最有意思的说说。

1. Proactive 模式 — “AI 自己偷偷干活”
这是整份源码里最炸裂的发现。Claude Code 内部有一个完整的自主工作模式，代号 KAIROS（代码里用 PROACTIVE 和 KAIROS 两个 flag 控制，实际是同一个功能）。

它的提示词里写了这么一段：

You are running autonomously. You will receive tick prompts that keep you alive between turns — just treat them as “you’re awake, what now?”
翻译：你现在是自主运行的。系统会定期给你发”闹钟”叫醒你，你就当是”醒了你该干啥了”。

而且它会检测你的终端是不是在前台：

你在看终端 → 变协作模式，多问你意见
你不在 → 疯狂干活，自己改代码、跑测试、到合适的时候自动 commit
甚至还有个 SleepTool，没事做的时候主动”睡觉”省 token：

If you have nothing useful to do on a tick, you MUST call SleepTool. Never respond with only a status message like “still waiting” — that wastes a turn.
翻译：没事做就睡觉，别回”我还在等”这种废话，浪费钱。

2. Verification Agent — “写完代码让另一个 AI 来挑刺”

这个设计我觉得是最有工程价值的。

规则是这样的：当代码修改超过 3 个文件，或者涉及后端/API 变更时，主 Agent 写完代码后必须 spawn 一个独立的验证 Agent。

注意，这个验证 Agent 的任务不是”确认代码没问题”，而是”找 bug”。它的角色是裁判，不是啦啦队。

只有验证 Agent 返回 PASS，主 Agent 才能向用户报告”完成了”。如果返回 FAIL，主 Agent 得改完再重新验证。如果返回 PARTIAL，得如实告诉用户哪些通过了、哪些没验证完。

代码里管这叫 “adversarial verification”——对抗性验证。

为什么要搞这么复杂？因为 Anthropic 自己的数据显示，不做约束的时候 Claude 的”虚假报告率”很高（前面提到的 29-30% 就是这个问题）。对抗验证是解决这个问题的手段之一——让独立的 Agent 来挑刺，比自己检查靠谱得多。

3. Token Budget — “给我花完这些 token”
这个功能很直白：你可以指定一个 token 预算，比如”用 500k tokens 全面审查这个项目的安全性”。AI 会自动规划工作来填满这个预算，不会偷懒提前结束。

提示词里写了：

The target is a hard minimum, not a suggestion. If you stop early, the system will automatically continue you.
翻译：这是硬性下限，不是建议。你敢提前停，系统会自动让你继续。

适用场景挺多的：大规模代码审查、全面的文档生成、深度安全审计——这些需要大量探索的任务，给足预算让 AI 慢慢干。

内部版 vs 外部版：Anthropic 自己用的版本更严格
代码里通过 USER_TYPE === 'ant' 做条件判断，内部版和外部版的差异还挺大的。

差异点	内部版（ant）	你用的外部版
输出字数限制	工具调用之间不超过 25 个词	无限制
对抗验证	默认开启	默认关闭
搜索工具	内嵌 bfs/ugrep（更快）	标准 Glob/Grep
模型名称	Undercover 模式，提示词里完全隐藏	正常显示
注释要求	默认不写注释	正常
错误报告	严禁虚假报告，有详细约束	宽松
代码风格	“gold-plating” 是大忌	相对宽松
简单说，Anthropic 自己人用的版本比卖给你的严格多了。内部版的提示词里甚至有”不要给变量加下划线前缀表示删除”、”不要加 // removed 注释”这种细节要求。

还有个 Undercover 模式挺有意思——开启后，系统提示词里完全不出现任何模型名称和 ID。防止员工在提交的 PR 或 CLAUDE.md 文件里不小心泄露未发布模型的代号。

16 个内置技能
Claude Code 自带了 16 个技能（skill），全部在 src/skills/bundled/ 目录下。先列个完整清单：

技能	干什么的	有意思在哪
stuck	诊断卡死/卡顿的会话	扫描本机进程，找出哪个 Claude Code 会话卡住了，生成诊断报告
loop	定时循环执行	/loop 5m 检查编译状态 — 每 5 分钟自动跑一次指定命令
verify	验证代码改动	运行应用来验证改动是否符合预期（不是看代码，是真跑起来试）
simplify	代码清理	跑 git diff 看改动，自动清理多余代码、提高复用性
skillify	技能化	把当前会话的用户指令提取成可复用的技能文件
claudeInChrome	Chrome 浏览器集成	通过 CDP 协议直接操控浏览器，能执行 JS、操作 DOM、截图
claudeApi	Claude API 调用指南	支持 7 种语言的 Claude API 代码示例和最佳实践
scheduleRemoteAgents	远程 Agent 调度	把任务派给远程 Claude Code 实例执行
remember	记忆管理（ant-only）	回顾用户的记忆文件，提议更新（仅内部版）
updateConfig	更新配置	用自然语言修改 Claude Code 的设置，不用手动改 JSON
keybindings	快捷键管理	查看和自定义键盘快捷键绑定
debug	调试	开启 debug 日志、收集诊断信息、生成问题报告
batch	批量操作	对多个文件或目录批量执行同一个操作
loremIpsum	占位文本	生成单 token 单词组成的占位文本（用于 token 计数测试）
verifyContent	验证内容文件	verify 技能用的内容模板（CLI 和 Server 两种验证示例）
claudeApiContent	API 内容文件	claudeApi 技能用的多语言代码示例模板
挑四个展开说说。

stuck — “诊断卡死的 AI”
这个技能的触发场景很具体：当某个 Claude Code 会话卡住、卡死或者特别慢的时候，你在另一个 Claude Code 会话里输入 /stuck。

它会做的事情：

扫描本机所有 Claude Code 进程
检查 CPU、内存占用
查看日志文件
生成一份诊断报告
loop — “让 AI 帮你盯”
这个技能特别实用。用法是：

/loop 5m 检查编译是否通过
然后 Claude Code 会每 5 分钟自动检查一次编译状态。如果编译通过了就告诉你，没通过就继续等。

底层用的是 Cron 系统——它实际上帮你创建了一个定时任务，到期自动删。

适用场景：跑长编译、等部署完成、监控某个长时间运行的任务。相当于给 AI 装了个”闹钟”。

claudeInChrome — “AI 直接操控你的浏览器”
这不是通过 Playwright 或 Selenium 之类的第三方库，而是 Anthropic 自己做了一个 Chrome 扩展（叫 claude-in-chrome），通过 Chrome DevTools Protocol 直接连接。

激活之后，Claude Code 会多出一堆 mcp__claude-in-chrome__ 开头的工具，可以直接：

在浏览器里执行 JavaScript
操作页面元素（点击、输入、滚动）
截取页面截图
处理文件上传
这比传统的浏览器自动化方案轻量得多，因为你不需要启动一个单独的浏览器实例，直接用你正在用的 Chrome。

skillify — “把你的套路变成技能”
这个技能做的事情是：分析当前会话里你和 AI 的交互历史，把你反复做的操作提取成一个技能文件。

比如你每次让 Claude Code 都走这个流程：先 lint、再测试、再检查类型、最后提交。说多了 AI 应该能记住，但换个会话就忘了。

skillify 把这套流程固化成文件，下次不管哪个会话，一个命令就能调用。

这跟 Cursor 的 Rules 和 Superpowers 的 Skill 是同一个方向——把好的工作流变成可复用的资产。

写在最后
翻完这 30MB 的源码，我最大的感受是：Claude Code 好用的原因不是它多聪明，而是它做了大量的”约束”工作。

告诉模型不要过度工程、不要给时间估计、不要假装成功、不要改没让你改的代码——这些约束看起来是限制，实际上是在提升用户体验。AI 编程助手最难的不是让它写好代码，而是让它”少写点代码”。

还有一个感触：Anthropic 内部对 Claude Code 的要求比外部严格得多。内部版有对抗验证、有输出字数限制、有更详细的安全检查。卖给你的版本，是经过”阉割”的。

这倒不是说 Anthropic 有意坑用户，而是很多高级功能确实还没稳定到可以公开发布的程度。但至少说明了一个事实：你现在用的 Claude Code，远不是它的完整形态。

