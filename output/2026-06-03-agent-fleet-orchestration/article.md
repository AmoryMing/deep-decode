---
title: Agent 开始给 agent 派活：当 AI 自己写下那张编排脚本
date: 2026-06-03
type: decode
slug: 2026-06-03-agent-fleet-orchestration
style: default
reader: default
sources:
  - https://claude.com/blog/introducing-dynamic-workflows-in-claude-code
  - https://claude.com/blog/a-harness-for-every-task-dynamic-workflows-in-claude-code
  - https://claude.com/blog/running-an-ai-native-engineering-org
  - https://www.anthropic.com/news/services-track-partner-hub
  - https://x.com/ClaudeDevs/status/2061900434722496604
  - https://x.com/shao__meng/status/2061974983094755575
  - https://x.com/googleaidevs/status/2061924472245153863
  - https://law.stanford.edu/press/ai-outperforms-law-professors-in-stanford-law-study/
  - https://www.bloomberg.com/news/articles/2026-06-03/europe-unveils-sweeping-tech-sovereignty-plan-to-boost-chips-ai
distribute: [email, xiaohongshu]
---

# Agent 开始给 agent 派活：当 AI 自己写下那张编排脚本

过去两年所有 AI 编程工具讲的都是同一个故事：你给一个 agent 一个任务，它从头干到尾。5 月 28 日 Anthropic 在发布 Claude Opus 4.8 的同一天，悄悄把这个故事改了——Claude Code 上线了 **Dynamic Workflows（动态工作流）**，让模型不再亲自下场写代码，而是当场写出一份 JavaScript 编排脚本，在一次会话里调度**数十到数百个并行子 agent**，并在结果交给你之前先派别的 agent 去推翻它。

中文圈把这件事说得最准的是 meng shao：这是从「一个 agent 干到底」升级到「**agent 自己当项目经理 + 调度层**」。这句话值得停一下——它不是又快了一点，而是 agent 第一次被允许去管理别的 agent。本期拆的就是这条主线，以及围着它的另外五件事：一套配套的工程组织方法论、一笔铺向几十万人的商业化、以及外面世界三条踩在同一节奏上的脚印。

![封面：agent 自己写下编排脚本，调度一支 agent 舰队](assets/cover.png)

## 本期关键词

- **Dynamic Workflows（动态工作流）** —— Claude Code 新功能：让模型现场写一份编排脚本，把一个大任务拆给几十上百个并行子 agent 去做，再自动验收，而不是自己一行行干到底。
- **编排层（orchestration layer）** —— 介于「单个 agent」和「人去搭一整套 agent 团队」之间的那一层：由模型自己生成、自己调度，人只给目标。
- **对抗式验证（adversarial verification）** —— 派一组独立 agent 专门去推翻另一组 agent 的结论，互相攻防到答案收敛，用来保证高风险任务不出错。
- **AI 原生工程组织（AI-native engineering org）** —— 假设写代码已经不要钱、瓶颈搬到了验证和审查之后，重新设计的研发团队与流程。

## 一、它到底改了什么：从「一个工人」到「一个工头」

先把功能说清楚，否则后面都是空话。

旧版 Claude Code 是一个工人。你派活，它在自己的上下文窗口里从头做到尾，复杂任务可以叫一两个子 agent 帮忙，但调度靠它临场发挥。Dynamic Workflows 是给它发了一顶工头的帽子：面对一个大任务，Claude 先**写出一份 JavaScript 脚本**，脚本里用几个特殊函数声明「这一步并行开 N 个 agent、每个用哪个模型、是否隔离上下文、跑完谁来验收」,然后由这份确定性的脚本去指挥整支队伍。官方账号 ClaudeDevs 给了硬指标:**一次执行最多协调 1000 个 agent，同时并行上限 16 个**。脚本被打断能从断点续跑,不用从头再来。

Anthropic 把常见的编排套路归纳成六种,这六种就是「工头的管理手册」：

1. **分类后分流(classify-and-act)** —— 先判断任务类型,再走不同支线;
2. **扇出再合并(fan-out-and-synthesize)** —— 把活拆开并行,结果归总;
3. **对抗式验证(adversarial verification)** —— 派独立 agent 专门挑刺;
4. **生成再过滤(generate-and-filter)** —— 大量生成候选,按标准筛;
5. **锦标赛(tournament)** —— 多个 agent 两两 PK,评委裁决;
6. **跑到完成为止(loop until done)** —— 设停止条件,不达不停。

判断:这六种没有一种是新算法,它们全是**人类项目经理每天在做的事**——分流、拆包、复核、海选、赛马、盯到交付。真正变了的是,这套管理动作第一次被模型自己写进可执行脚本、自己执行。Agent 不再只是被管理的对象,它成了管理的主体。

## 二、为什么需要工头:一个 agent 干久了会「走神」

为什么不能让一个聪明 agent 一口气干完?Anthropic 的配套技术文给出了三个具体的失败模式,每一个做过长链路 agent 的人都见过:

- **Agentic laziness(智能体偷懒)** —— 任务没真做完就宣布完成;
- **Self-preferential bias(自我偏好偏差)** —— Claude 倾向于偏袒自己产出的结果,不肯否定自己;
- **Goal drift(目标漂移)** —— 在一轮轮摘要、压缩里,慢慢偏离最初的目标。

> "Workflows allow you to dynamically create harnesses built on top of Claude Code that enable Claude to solve all of those problems more natively."(工作流让你在 Claude Code 之上动态搭出一套支架,使 Claude 能更原生地解决上面这些问题。)

这句话里的关键词是 **harness(支架/马具)**。单个 agent 治不了自己的偷懒和偏袒——因为裁判和球员是同一个。把验证拆给**独立的、上下文隔离的**另一组 agent,让它带着「去推翻」的指令上场,自我偏好就失效了:它没有「自己的答案」要维护。这是用结构解决模型的性格缺陷,而不是指望模型变得更诚实。

能写出这层结构,前提是模型够聪明到能当场写对一份编排脚本——这正是 Opus 4.8 和 Dynamic Workflows 同天发布的原因。技术文里那句给开发者的提醒也值得抄下来:

> "For regular coding tasks, try and ask yourself: does it really need more compute?"(对常规编码任务,先问自己:它真的需要更多算力吗?)

因为工作流烧的 token 远高于普通会话——它是为「答错代价很高」的任务准备的重武器,不是日常顺手工具。

![六种编排套路 + Bun 案例:75 万行 Rust、11 天、99.8% 测试通过](assets/orchestration.png)

## 三、它不是 PPT:Bun 的 75 万行重写

最有说服力的不是功能列表,是一个已经落地的案例。Bun(高性能 JavaScript 运行时)的作者 Jarred Sumner 用 Dynamic Workflows 把 Bun 从 Zig 语言**整体重写成 Rust**:

- 约 **75 万行** Rust 代码;
- 原测试套件 **99.8% 通过**;
- 从第一次提交到合并 **11 天**;
- 做法:文件级并行生成,**每个文件配两名 reviewer**,夜里自动跑优化 pass。

这组数字撑起了官方那句最大的承诺:**原本按季度规划的工程量,现在按天交付**。一次语言级整体迁移,过去是一个团队几个月、出错率高到没人敢碰的活,这里用「并行生成 + 双人复核 + 通宵优化」的编排,压进了 11 天。早期用户还把它用在全代码库 bug 猎杀、性能剖析审计、安全加固、大规模迁移现代化上——共同点都是**规模大到一个上下文装不下、且错了代价高**。

企业侧的两条反馈也指向同一个甜点区。Klarna 的高级工程经理 Alessio Vallero:

> "Dynamic workflows have been especially valuable for discovery and review tasks across large codebases. We've seen strong results using it to identify dead code."(动态工作流在大型代码库的勘察与审查任务上尤其有价值,我们用它找死代码效果很好。)

CyberAgent 的首席系统工程师 Ken Takao 那句更点题:

> "Dynamic workflows fill the gap between firing off a single subagent and building out a full agent team."(动态工作流填上了「随手发一个子 agent」和「搭建一整支 agent 团队」之间的空档。)

判断:这个「空档」就是它的全部价值。在它之前,你要么将就用一个 agent,要么花工程师的时间去手搭一套多 agent 系统;现在这层编排由模型按需即时生成,人不必先成为分布式系统工程师。

## 四、组织得先改:瓶颈已经搬家了

光有工具没用,公司得改造自己才接得住。Anthropic 同期那篇《Running an AI-Native Engineering Org》讲的就是这件配套的事,核心判断一句话:

> "Verification, code review, and security took their place."(验证、代码审查和安全,接替了原来的瓶颈。)

逻辑链很直:当写代码、写测试、重构都几乎不要钱,卡住交付的就不再是「打字速度」,而是「怎么确认这堆代码是对的、安全的」。于是整套研发流程都得重排——

- **规划**:六个月路线图 → 即时(just-in-time)规划 + 快速原型;
- **取上下文**:去找当年写代码的人问 → 先问 Claude,能自动化就自动化;
- **代码审查**:风格、lint、找 bug、写测试交给 Claude;法务、安全/信任边界、产品判断、设计留给人;
- **团队构成**:角色边界模糊,PM 也写代码,工程师也做设计;招「有产品感的创造者 + 深系统专家」,不再为「码量」招人。

最硬的一个数据:**连续四个月没有一次非 Claude 参与的提交,100% 采用率**。还有一个细节值得每个团队照镜子——他们砍掉了一个大型周会,理由是「与会者只在轮到自己汇报时才认真听」。

判断:第三节的工具和这一节的组织是一体两面。Dynamic Workflows 把「生产代码」彻底变成商品,而这篇文章诚实地承认:省下来的人力没有消失,而是**整体平移到了验证、审查、安全**这三件机器还做不彻底的事上。谁先完成这次平移,谁就先拿到红利;还在用「码量」考核工程师的组织,等于在奖励一件已经免费的东西。

## 五、它已经在被卖向几十万人

技术和方法论之外,商业化的形状也露出来了。Anthropic 同步上线了 **Services Track + Claude Partner Hub**:把咨询/集成伙伴按「真实部署经验」分成 Select / Preferred / Global Premier 三级,每一级卡的不是公司大小,而是硬指标——**认证人数、生产环境客户数、公开客户案例数**,而且**每季度复核**。配套是 **1 亿美元**投入、**4 万多家**公司申请、**1 万多名**顾问已认证。

接盘的体量很吓人:Accenture 在训 3 万人、Cognizant 铺到约 35 万员工、Deloitte 面向 47 万全球员工、KPMG 覆盖 27.6 万人。这串数字说明一件事:大厂不再把 AI 当试点,而是当**全员基础设施**在铺。Partner Hub 还接了 MCP 连接器,可以直接在对话里查某家伙伴的资质排名。

判断:把伙伴资质从「签了多少合同、公司多大」改成「认证了多少活跃从业者、有多少跑在生产环境的客户、敢不敢公开案例」,并且季度核验——这是在用产品化的方式管理一个咨询网络,逼着集成商把能力做实而不是把 logo 做大。它和前两节是闭环:工具(Dynamic Workflows)→ 方法(AI 原生组织)→ 把方法卖出去的渠道(Partner Hub)。

![同一周三条外部脚印:Google 并行 agent、斯坦福 AI 赢 75%、欧盟 2000 亿欧元算力主权](assets/landscape.png)

## 六、外面的世界踩在同一个节拍上

如果以为这只是 Anthropic 一家的叙事,同一周的另外三条新闻会纠正你——它们从竞品、从专业判断、从国家监管三个方向,踩在同一个节拍上。

**竞品:Google 也在做「并行 agent」。** Google AI Devs 同期放出 Gemini 3.5 Flash 正式版,以及 Gemini API 里的 **Managed Agents(托管 agent)**——能在 Google 托管的隔离 Linux 沙箱里自主规划、写码、执行、管文件、上网的 Antigravity agent。措辞不同,方向一致:让 agent 在隔离环境里自主跑长任务。编排与并行 agent,正在成为两家头部同时押注的下一个战场。

**专业判断:连法学教授都被超过了。** 斯坦福法学院一项盲测里,AI 在合同法答题上**对阵法学教授赢了 75% 的正面交锋**,近 3000 次匿名比对;被评为「可能误导学生」的 AI 回答只有 **3.5%**,而人类同行的答案是 **12%**。研究者 Julian Nyarko 强调这些题「需要综合复杂材料、应用到新情境、解释法律概念」,不是有标准答案的简单题。这正面回应了一个老怀疑:agent 编排能用在代码上,是因为代码能跑测试验证;而这项研究说明,**需要判断的专业工作**同样开始被模型逼近——这恰恰是 Dynamic Workflows 用「对抗式验证」想啃下的那类硬任务。

**监管:欧盟开始抢算力主权。** 同一天(6 月 3 日),欧盟委员会公布大型「技术主权」方案:Chips Act 2.0、Cloud and AI Development Act、开源战略等四件套,目标 **5-7 年内把欧盟数据中心容量翻三倍**,需要约 **2000 亿欧元**(以私人投资为主),还要为云服务设四级主权等级供公共采购参照。判断:当 agent 舰队的产能直接由算力决定(见第一节那句「真的需要更多算力吗」),「谁掌握算力」就从工程问题升级成主权问题。欧盟这一步,是在为「AI 产能 = 国力」这件事提前卡位。

## 对从业者意味着什么

把六件事叠在一起,2026 年的这一周交出的是同一句话:**AI 从「一个助手」正式进入「一支舰队」,而胜负手从「模型多聪明」挪到了「编排得多好、验证得多狠、算力够不够便宜」。**

- **对工程团队**:别再用「码量/打字速度」考核人。写代码已经免费,你的稀缺资源是验证、审查、安全判断和产品品味。先把这次「瓶颈平移」做完——把能交给 Claude 的审查项交出去,把人腾到机器啃不动的信任边界上。Dynamic Workflows 适合「规模大 + 错了代价高」的任务(迁移、安全审计、死代码清理),日常小活别上重武器,先问一句「它真的需要更多算力吗」。
- **对管理者/CTO**:这是组织重构信号,不是工具升级。即时规划替代长路线图,砍掉「只为汇报而开」的会,招「有产品感 + 深系统」的人。要警惕的新风险是「agent 偷懒」和「自我偏袒」——解法是结构(独立验证 agent),不是口头要求模型更认真。
- **对采购/被集成方**:Partner Hub 把游戏规则改成了「认证活跃人数 + 生产客户 + 公开案例」且季度核验。挑伙伴别看 logo 大小,看它在 Hub 上的真实部署排名;自己是集成商的,认证和真实落地案例现在是硬通货。
- **对所有人**:斯坦福那 75% 是提醒——「需要判断」不再是人类的安全区。把自己的不可替代性,从「会做某件事」往「会定义目标、会验收、会担责」上迁移,这正是编排时代里那顶工头帽子的人类版本。

## 引用

1. Introducing dynamic workflows in Claude Code(官方公告):https://claude.com/blog/introducing-dynamic-workflows-in-claude-code
2. A harness for every task: dynamic workflows in Claude Code(技术文):https://claude.com/blog/a-harness-for-every-task-dynamic-workflows-in-claude-code
3. Running an AI-native engineering org:https://claude.com/blog/running-an-ai-native-engineering-org
4. Anthropic — Claude Partner Network: Services track & Partner Hub:https://www.anthropic.com/news/services-track-partner-hub
5. ClaudeDevs 公告推文(1000 agent / 16 并行上限):https://x.com/ClaudeDevs/status/2061900434722496604
6. meng shao(shao__meng)中文解读「agent 自己当项目经理 + 调度层」:https://x.com/shao__meng/status/2061974983094755575
7. Google AI Devs:Gemini 3.5 Flash 正式版 + Managed Agents / Antigravity:https://x.com/googleaidevs/status/2061924472245153863
8. Stanford Law:AI Outperforms Law Professors in Stanford Law Study:https://law.stanford.edu/press/ai-outperforms-law-professors-in-stanford-law-study/
9. Bloomberg:Europe Unveils Sweeping Tech Sovereignty Plan to Boost Chips, AI:https://www.bloomberg.com/news/articles/2026-06-03/europe-unveils-sweeping-tech-sovereignty-plan-to-boost-chips-ai
