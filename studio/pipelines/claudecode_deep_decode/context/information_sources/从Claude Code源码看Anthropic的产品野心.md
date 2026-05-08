从Claude Code源码看Anthropic的产品野心
卷友们好，我是rumor。

昨天Claude Code ”开源”了，我手速飞快去下载了源码。50万行TypeScript，1900个文件——用AI读完之后我发现，这东西远比表面看到的要野得多。

大量功能被feature flag锁住，编译时直接从npm包里物理删除，你反编译都看不到。但源码一摊开，Anthropic的野心藏不住了：他们不是在做一个编程工具，而是在孵化一个有记忆、能自主行动、会团队协作的AI agent平台。

今天我们就沿着这条演进主线，对源码里的设计进行拆解。

记忆
记忆是整个演进的基石。没有记忆，AI就是一个每次对话都从零开始的陌生人。Claude Code在记忆上的投入远超预期——不是简单的"把对话存下来"，而是一套有分类、有提取、有整合、有遗忘的记忆生命周期管理系统。

四类记忆：正面反馈也要记
Claude Code的记忆分为4种类型：用户偏好（user）、反馈修正（feedback）、项目信息（project）、外部引用（reference）。每种类型有独立的存储文件和触发条件。

其中最有意思的设计在feedback类型上。大多数AI系统只记"负反馈"——你骂它"别mock数据库！"它记住。但Claude Code的prompt里明确要求正面反馈也要记：

Record from failure AND success: if you only save corrections, you will avoid past mistakes but drift away from approaches the user has already validated, and may grow overly cautious.

如果只记批评不记表扬，时间长了模型就会趋向保守——不敢做决定、不敢主动行动，事事请示。Prompt还特别提醒："批评很容易注意到；肯定更安静——要主动留意。"

三层记忆架构
记忆的写入不是一次性的，而是分三层逐步沉淀：

层级
机制
触发时机
作用
实时提取
Session Memory
对话token达到10000后，每增长5000token且满足工具调用条件时
总结当前会话关键信息
跨会话整合
Auto-Dream
距上次整理≥24小时，且积累≥5个新会话
回顾、合并、修剪记忆文件
永驻日志
KAIROS Daily Log
助手模式下持续运行
append-only日志+夜间蒸馏
Session Memory的触发逻辑很精巧：先达到初始token阈值（对话足够长才值得总结），然后基于token增长量判断是否需要更新，额外条件是要么有足够多的工具调用（≥3次），要么最近一轮没有工具调用（捕捉自然停顿点）。提取工作由一个forked subagent完成，这个subagent只被允许编辑那一个特定的记忆文件，不能做其他任何写操作。

上下文压缩：有限窗口里的记忆术
AI聊久了token会爆。Claude Code的压缩机制不是简单的"总结一下之前说了什么"，而是一套9段式结构化记忆术：

1. Primary Request and Intent（用户的原始需求）
2. Key Technical Concepts（关键技术概念）
3. Files and Code Sections（文件和代码片段——必须附代码！）
4. Errors and fixes（犯了什么错、怎么修的）
5. Problem Solving（问题解决过程）
6. All user messages（用户的所有原话——不许遗漏！）
7. Pending Tasks（待办事项）
8. Current Work（当前进度）
9. Optional Next Step（下一步计划）
两个硬性要求：必须保留代码片段（不是"我修改了 auth.ts"，是要把关键代码粘进来）；必须保留用户的所有原话（防止压缩后丢失用户的真实意图）。

还有一个<analysis>标签作为AI的"草稿纸"——压缩前先自言自语分析一遍，再输出最终摘要。分析完成后<analysis>块被正则剥离，只保留<summary>部分。这是Chain-of-Thought在工程中的直接应用。

DreamTask：AI在你睡觉时"做梦"
这是整个源码中最让人惊叹的设计。

Claude Code设计了一个叫DreamTask的后台进程。当满足条件时，它会启动一个子agent，像人类做梦一样回顾和整理之前的记忆。

整理过程分四个阶段：

Phase 1 — Orient（定位）：扫描已有记忆，防止创建重复
Phase 2 — Gather（采集）：扫描日志目录，按需grep会话记录中的具体细节
Phase 3 — Consolidate（整合）：合并重复、修正矛盾、"昨天"→绝对日期、删除被推翻的旧事实
Phase 4 — Prune（修剪）：更新索引，控制在200行/25KB以内，解决矛盾
触发条件极其克制：必须距上次整理超过24小时，且中间积累了至少5个新会话。还有基于文件锁的并发控制——锁文件的mtime就是上次整理时间戳，锁体存储持有者PID，超过1小时未释放视为过期可回收。如果整理失败，锁的时间戳会回滚到之前的值，确保下次可以重试。

自主性
有了记忆，下一步是让AI不再被动等待指令，而是能主动发现和执行有价值的工作。这就是KAIROS全家桶要解决的问题。

tick心跳+Sleep
通过claude assistant命令启动助手模式后，系统会周期性地向模型发送<tick>心跳提示。模型收到tick后评估当前是否有有价值的工作——有就主动推进，没有就调用SleepTool休眠。

SleepTool的prompt里有一个很实际的工程权衡提示：prompt cache 5分钟后过期，所以AI需要权衡醒来的频率——太频繁浪费API调用，太不频繁cache过期后下一次调用更贵。

这本质上是一个事件驱动的agent运行时——不是轮询，而是在有意义的时刻才消耗资源。

强制工具化输出
助手模式下，模型的所有用户可见输出必须通过SendUserMessage（即BriefTool）工具发送，普通文本输出对用户不可见。这个设计将"思考过程"和"用户沟通"彻底分离——助手在后台默默工作，只在有意义的时候才"说话"。

你隔了几小时回来，说一句/brief，AI就给你汇报最近发生了什么。

外部消息唤醒
通过MCP Channel协议，Discord、Slack、SMS等外部消息可以被推入助手会话。消息被包装成XML标签后入队，SleepTool在1秒内检测到新消息并唤醒助手。

更厉害的是，助手可以通过channel向人类请求工具执行权限——有一套结构化的permission_request/permission通知协议，避免聊天中的随意文本被误判为审批。

定时任务：本地 + 云端双引擎
本地有CronScheduler，支持标准cron表达式，助手模式下预装任务、自动启用。

云端更激进——通过/schedule skill，用户可以创建在Anthropic云端按cron定时运行的agent。每次触发都会生成一个完全隔离的远程会话，最小间隔1小时，支持配置Git仓库、工具白名单、MCP连接器。

想象一下：每天早上9点自动跑代码质量检查，每周五下午自动生成changelog，定时扫描依赖漏洞。这是AI agent从"人驱动"到"自主运行"的关键基础设施。

GitHub PR订阅
通过SubscribePRTool，助手可以订阅GitHub PR的事件——有人review了代码、CI结果出来了、出现新评论……这些事件实时推送到助手会话中。

把上面这些拼在一起：一个永不关机的AI同事，你睡觉它还在盯着代码库、盯着PR、盯着CI，有事叫你，没事自己整理记忆。

多Agent协作
单个agent能力再强也有瓶颈。源码中同时存在三套不同的多agent系统（src/utils/swarm/ 目录下有 20+ 个文件），不是重复建设，而是针对不同场景的精确设计。

Swarm/Teammate：文件邮箱团队系统
一个基于文件邮箱的agent团队系统。每个teammate有一个JSON邮箱文件，agent之间通过读写邮箱通信，使用文件锁保证并发安全。

Teammate可以运行在两种后端：同进程模式（通过AsyncLocalStorage实现上下文隔离，共享API客户端和MCP连接）和分屏模式（在tmux或iTerm2中启动独立的ClaudeCLI进程）。

权限管理是最精巧的部分——Worker遇到需要审批的操作时，通过邮箱向team leader发送权限请求，leader的UI上弹出审批对话框，审批结果再通过邮箱回传。整个权限同步、关机协调、计划审批都复用同一套邮箱基础设施。

Coordinator：不许偷懒的项目经理
开启Coordinator模式后，Claude从"执行者"变成"项目经理"，只有3个工具：Agent（派活）、SendMessage（继续）、TaskStop（叫停）。

源码中有一段369行的coordinator system prompt，定义了四阶段工作流：Research → Synthesis → Implementation → Verification。其中最核心的铁律是：

Never write "based on your findings" or "based on the research." These phrases delegate understanding to the worker instead of doing it yourself.

Coordinator必须自己理解问题，不能偷懒委派理解。 必须写出具体到文件名和行号的方案，不能把"理解问题"这个步骤也外包给Worker。

这跟现实中好的项目经理一模一样——最差的PM是传话筒，最好的PM是自己理解技术细节后再做决策。Anthropic把这个管理哲学写进了prompt。

Workers之间还有一个共享草稿目录（Scratchpad），可以往里读写文件作为跨Worker的知识通道，不需要权限审批。

Fork子agent：字节级缓存优化
Fork模式解决一个很工程化的问题：如何让多个并行子agent共享 prompt cache。

当fork一个子agent时，系统会完整复制父agent的assistant message，将所有tool_use的结果替换为相同的占位符文本，只在最后追加每个子agent各自不同的指令。这样所有子agent的API 请求前缀在字节级别完全一致，最大化 prompt cache 命中率。

UDS_INBOX：跨实例通信
通过Unix Domain Socket实现多个 Claude Code实例之间的发现和通信。你开了两个终端各跑一个 Claude Code，它们可以通过 SendMessageTool 互相发消息，地址格式为 uds:/path/to.sock（本地）或 bridge:session_id（远程）。

三套系统分别解决了团队通信（Swarm）、任务编排（Coordinator）、缓存效率（Fork）三个不同层面的问题，加上跨实例通信（UDS），这是目前公开代码中最完整的多agent工程实现之一。

云端：突破本地边界
前面的能力都可以在本地运行。但Anthropic显然不满足于此——源码中有一整套本地-云端混合架构，让AI的能力延伸到云端。

Bridge：四种远程控制模式
Bridge是Claude Code的远程会话基础设施，支持四种模式：

Headless：无UI的后台运行，适合CI/CD集成
Remote MCP：作为MCP服务器暴露给其他客户端
Teleport：在浏览器和终端之间"传送"会话
Full Remote：完整的远程Claude Code实例
这不是简单的SSH远程执行，而是一套完整的会话管理协议——支持会话恢复、状态同步、跨设备切换。

Ultraplan：用最强模型当军师
当一个任务太复杂时，Ultraplan会启动一个远程服务器，用Opus 4.6（Anthropic最强模型）专门做深度规划。

流程很"奢侈"：用户描述复杂任务 → 本地CLI创建远程会话 → Opus 4.6在远程服务器上进入 Plan Mode，可能思考30分钟 → 用户在浏览器中审批或修改方案 → 方案通过后传回本地执行。

源码里有一个有趣的防递归细节：远程会话的 prompt中刻意避免出现 "ultraplan" 这个裸词，因为远程CLI也会做关键词检测，出现这个词会自触发 /ultraplan，导致无限递归。

还有一个 ULTRAPLAN_TELEPORT_SENTINEL——用户可以在浏览器中点击"传送回终端"，把规划方案从远程拽回本地执行。

这相当于：**你有一个随叫随到的首席架构师，用最强大脑帮你做顶层设计，你只需要点"同意"或"改这里"**。

Settings Sync：跨设备记忆同步
通过Anthropic API的settings sync端点，用户的配置和记忆可以在多台设备之间同步。源码中有完整的冲突解决逻辑——基于时间戳的 last-write-wins策略，加上本地缓存和增量同步。

交互
前面解决的是"能力"问题——记忆、自主、协作、云端。这一章解决的是"关系"问题——怎么让人和AI的交互更自然、更有温度。

Buddy：编程工具里的宠物精灵
这是整个源码中最出人意料的发现。Claude Code藏着一个完整的桌面宠物系统，代号BUDDY：

18 个物种：鸭子(duck)、鹅(goose)、果冻(blob)、猫(cat)、龙(dragon)、章鱼(octopus)、猫头鹰(owl)、企鹅(penguin)、乌龟(turtle)、蜗牛(snail)、幽灵(ghost)、六角恐龙(axolotl)、水豚(capybara)、仙人掌(cactus)、机器人(robot)、兔子(rabbit)、蘑菇(mushroom)、胖团(chonk)
5 个稀有度：Common → Uncommon → Rare → Epic → Legendary
6 种眼睛：·✦×◉@°
8 种帽子（Common 没帽子）：无、皇冠、礼帽、螺旋桨帽、光环、巫师帽、毛线帽、小鸭子帽
5 项属性值：DEBUGGING（调试力）、PATIENCE（耐心）、CHAOS（混沌）、WISDOM（智慧）、SNARK（毒舌）
每个用户基于userId+固定盐值通过确定性 PRNG算法生成唯一精灵——你的精灵跟你的账号绑定，换设备也不变。还有 1%概率出闪光个体。每个物种都有3帧ASCII动画，你可以 /buddy pet撸它，会飘出爱心动画。

骨骼数据（外观）不持久化，每次从用户ID重新生成；灵魂数据（名字、性格）单独存储——这个设计防止用户通过修改配置文件伪造稀有度。

发布时间也被泄露了：源码中明确写着 Teaser window: April 1-7, 2026 only。2026年4月1日预热（愚人节彩蛋），之后正式上线。

一个编程工具为什么要做宠物精灵？因为 Anthropic不想只做编程工具。它在做情感连接。

Voice Mode：按住说话，松开执行
一个完整实现的语音输入系统。Push-to-talk模式，音频通过WebSocket流式传输到 Anthropic的私有STT端点。支持原生音频捕获（macOS CoreAudio、Linux ALSA），不支持时回退到SoX。

一个实际的工程细节：原生音频模块是懒加载的，因为CoreAudio的 dlopen 是阻塞的，冷启动可能需要8秒。源码中还有一个通过feature flag控制的 Deepgram Nova 3 STT引擎切换路径，说明 Anthropic在评估不同的语音识别方案。

Prompt Suggestion + 推测性执行
每轮对话结束后，一个forked subagent 会预测用户下一步可能输入什么。生成后经过严格过滤：太短太长的丢弃，听起来像AI口吻而非用户口吻的丢弃。

更进一步：生成建议后可以触发推测性执行——在用户还没确认之前，就用一个完全隔离的沙箱 agent（带overlay文件系统）预执行建议的操作。如果用户确认了，结果直接使用；如果用户输入了不同的内容，预执行结果被丢弃。

这和CPU的分支预测是同一个思路，只不过预测的对象从机器指令变成了人类意图。

终极观察
这不是在做产品迭代，是在做物种进化

把所有隐藏功能拼在一起，你会看到一条清晰的进化链：

工具 → 助手 → 同事 → 伙伴

   编程工具          长期助手          AI同事          AI伙伴
 ┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐
 │ 你问它答  │ →  │ 它主动做  │ →  │ 它管项目  │ →  │ 它有感情  │
 │ Read/Write│    │ KAIROS   │    │Coordinator│    │ BUDDY    │
 │ Bash/Edit │    │ DreamTask│    │ Ultraplan │    │ 宠物精灵  │
 │           │    │ Sleep/   │    │ 多Agent   │    │ 记住你的  │
 │           │    │ Tick心跳  │    │ 协作      │    │ 夸奖      │
 └──────────┘    └──────────┘    └──────────┘    └──────────┘
   已发布            灰度中           即将上线          远期愿景
Anthropic不是在迭代一个编程工具。他们在孵化一个新物种。

这个物种会写代码、会做梦、会主动干活、会管理团队、会在你不在的时候盯着项目、会在云端按时执行任务、能听懂你说话——然后在你回来的时候，用一只戴着巫师帽的鸭子跟你打招呼。


