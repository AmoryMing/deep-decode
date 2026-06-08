---
title: Anthropic 从不说"AGI"——它说的是"数据中心里的天才之国",而前沿已经偷偷换了赛道叫 RSI
type: published
created: 2026-06-08
updated: 2026-06-08
style: default
tags: [Anthropic, AGI, RSI, 递归自我改进, Dario Amodei, Sakana, Karpathy, 自进化AI]
---

# Anthropic 从不说"AGI"——它说的是"数据中心里的天才之国",而前沿已经偷偷换了赛道叫 RSI

**本期关键词:powerful AI（强大 AI）/ RSI（递归自我改进）**

你问"Anthropic 说的 AGI 是什么"。最准确的答案是:**Anthropic 不说 AGI。** 这家公司里最有话语权的人——CEO Dario Amodei——在他那篇被反复引用的长文里,用一句括号亲手把这个词扔掉了。这不是口误,是一次刻意的措辞政变。读懂它为什么不用 AGI,比背下任何一个 AGI 定义都重要。

而当所有人还在为"AGI 到底算不算来了"吵架时,真正做事的实验室已经换了一个三字母缩写当目标:**RSI,递归自我改进——让 AI 去改进 AI 自己。** 你提到的 Sakana 在东京成立 RSI 实验室、Karpathy 重回前沿,都是这同一条暗线上的事件。先把第一个问题答到一字一句,再把这条暗线拉直。

---

## 一、Anthropic 的"AGI":一个被刻意废弃的词,和一个刻意精确的替代

### 1. Dario 亲手扔掉"AGI"这个词

证据先行。Dario Amodei 2024 年 10 月的长文《Machines of Loving Grace》(《仁慈机器》)里,原文这样写:

> "What powerful AI (I dislike the term AGI) will look like, and when (or if) it will arrive, is a huge topic in itself."
> （强大 AI——我不喜欢"AGI"这个词——会是什么样、何时或是否到来,本身就是一个巨大的话题。）
> 来源:https://darioamodei.com/essay/machines-of-loving-grace ，2024-10

他给的理由是要甩掉"科幻包袱":

> "Avoid 'sci-fi' baggage... the small community of people who do discuss radical AI futures often does so in an excessively 'sci-fi' tone... I think this causes people to take the claims less seriously."
> （避免"科幻包袱"……少数讨论激进 AI 未来的人往往用一种过度"科幻"的腔调……我认为这让人们不那么严肃地看待这些主张。）

这一步动作的含义,远比换个词大。"AGI"(通用人工智能)是个没有刻度的词——没人能说清到了哪一刻就算"通用"。Dario 的判断是:一个无法证伪的词,只会被用来炒作或恐吓。所以他要把它替换成一个能逐条打钩的工程定义。

### 2. "powerful AI" 的逐字定义——你要的那段在这里

Dario 把替代词定义为"powerful AI"(强大 AI),并列出六条硬属性。这是 Anthropic 阵营对"那个东西"最权威的描述,逐条抄录:

> "By powerful AI, I have in mind an AI model—likely similar to today's LLMs in form... with the following properties:"
> （我心目中的强大 AI,是一个形态上很可能类似今天大语言模型的 AI 模型……具备以下属性:）

- **智力**:"smarter than a Nobel Prize winner across most relevant fields"——比绝大多数相关领域的诺奖得主更聪明,能证明未解的数学定理、从零写出极难的代码库。
- **接口**:拥有人类远程办公的全部"接口"(文本、音频、视频、键鼠控制、联网),且"a skill exceeding that of the most capable humans in the world"(技能超过世界上最能干的人)。
- **自主**:"can be given tasks that take hours, days, or weeks to complete, and then goes off and does those tasks autonomously"——能领受耗时数小时到数周的任务并自主完成,像一个聪明员工,必要时主动来问清楚。
- **具身**:没有肉身,但"can control existing physical tools, robots, or laboratory equipment through a computer"——能通过电脑操控现有工具、机器人、实验设备,甚至自己设计设备。
- **规模**:"The resources used to train the model can be repurposed to run millions of instances of it"——训练它的算力可以反过来并行运行数百万个副本,且吸收信息、产出动作的速度是人类的 10 到 100 倍。
- **协同**:这数百万副本"can act independently"也可像人类一样彼此协作。

然后是那句被引爆全网的总结:

> "We could summarize this as a 'country of geniuses in a datacenter'."
> （我们可以把这总结为"数据中心里的一个天才之国"。）

这就是 Anthropic 的"AGI"——不叫 AGI,叫"数据中心里的天才之国"。它的高明在于:每一条都可观测、可证伪。哪天有个模型并行跑出一百万个比诺奖得主聪明、能自己跑实验设备的副本,那就是它;在那之前,别拿"是不是 AGI"来糊弄。

关于何时到来,Dario 2024 年的原话是"I think it could come as early as 2026"(最早可能 2026 年)。但要带日期看:到 2026 年他接受 Dwarkesh 第二次访谈时,口径已经收敛成"指数曲线的末端",并把"编程能力"压缩到"一两年内"(来源:https://www.dwarkesh.com/p/dario-amodei-2 )。**官方的时间预期本身在两年里漂移过,引用必须带时间戳。**

### 3. 公司层面用另一个词:transformative AI;治理层面根本不谈 AGI,谈 ASL

要分清两层。上面是 Dario 个人散文。Anthropic 作为机构,官方文件《Core Views on AI Safety》(2023-03)用的是第三个词——"transformative AI"(变革性 AI):

> "We believe the impact of AI might be comparable to that of the industrial and scientific revolutions... this level of impact could start to arrive soon – perhaps in the coming decade."
> （我们相信 AI 的影响可能堪比工业革命和科学革命……这种量级的影响可能很快到来,也许就在未来十年内。）
> 来源:https://www.anthropic.com/news/core-views-on-ai-safety

而真正用来约束自己行为的,是第四个东西:它干脆不拿任何"AGI 时刻"做基准,改用一套**ASL(AI Safety Level,AI 安全等级)能力阈值**,照搬美国处理危险病原体的生物安全等级(BSL):

> "Central to our plan is the concept of AI safety levels (ASL), which are modeled loosely after the US government's biosafety level (BSL) standards... We define a series of AI capability thresholds that represent increasing potential risks."
> （我们计划的核心是 AI 安全等级概念,大致仿照美国政府的生物安全等级标准……我们定义一系列代表风险递增的能力阈值。）
> 来源:Responsible Scaling Policy，https://www.anthropic.com/news/responsible-scaling-policy-v3

把四个词排在一起,Anthropic 的"AGI 观"就清楚了:**个人叙事用"powerful AI"(天才之国),公司表态用"transformative AI",自我约束用"ASL 能力阈值",唯独不用"AGI"。** 一家公司宁可造三个新词也不碰这个旧词,本身就是态度:它认为"AGI"这个概念已经坏掉了,不值得用来思考,更不值得用来管理风险。

---

## 二、当大家还在吵 AGI,前沿换了目标叫 RSI

2026 年 5 月 28 日,TechCrunch 一篇文章把这件事点破,标题就是判断:**"RSI is the new AGI"(RSI 是新的 AGI)** ——而且"and it's just as hard to pin down"(而且一样难以界定)。"recursion(递归)"成了 AI 圈最新热词,多家创业公司直接拿它命名,更多公司把它写进路线图(来源:https://techcrunch.com/2026/05/28/rsi-is-the-new-agi-and-its-just-as-hard-to-pin-down/ )。

RSI = Recursive Self-Improvement,递归自我改进。大白话就是你说的那个比喻:**让 AI 当自己的健身教练——不光干活,还反过来研究"我怎么变更强",然后真去优化自己。** 一旦这个循环转起来,改进会复利,这是所有"智能爆炸"叙事的技术内核。当"AGI 是不是来了"变成无法回答的口水仗,"模型能不能改进模型"却是个能跑实验、能看曲线的工程问题——前沿往这边挪,是务实,不是赶时髦。

---

## 三、Sakana 的 RSI 实验室:不堆算力,堆样本效率——这是一次"主权 AI"豪赌

你给的线索没错。Smol AI News 那条原文是:

> "Sakana AI launched an RSI Lab focusing on recursive self-improvement under compute constraints, marking RSI as a formal research program."
> （Sakana AI 设立了一个 RSI 实验室,聚焦算力受限条件下的递归自我改进,标志着 RSI 成为一个正式的研究项目。）
> 来源:https://news.smol.ai/

回到一手。Sakana 官方公告(https://sakana.ai/rsi-lab/ )宣布在**东京**正式成立 RSI 实验室,由联合创始人兼 CEO **David Ha**(网名 hardmaru)领衔、**Robert Lange** 任研究负责人(2026 年 6 月 6 日前后官宣)。David Ha 本人原话:

> "Today, we are officially launching the Sakana AI RSI Lab in Tokyo to build open-ended, adaptive AI systems that collectively self-improve."
> （今天,我们在东京正式启动 Sakana AI RSI 实验室,构建开放式、可适应、能集体自我改进的 AI 系统。）
> 来源:https://x.com/hardmaru/status/2062948594597208557

但真正的判断点,是你提到的那句"不需要海量算力、靠样本效率"。官方把这条提到了战略高度,原文极硬:

> "We are building not the most compute-hungry self-improvement engine, but the most sample-efficient one. Its advances should compound on national, rather than hyperscale, compute budgets."
> （我们要造的不是最耗算力的自我改进引擎,而是最省样本的那一个。它的进展应当在国家级、而非超大规模的算力预算上复利增长。）

证据是他们的 ShinkaEvolve——"required only 150 samples to solve problems that brute-force search treats as intractable"(仅用 150 个样本就解决了暴力搜索视为无解的问题)。

为什么是东京?官方说得直白:

> "compute-efficient self-improvement is not a preference but a structural necessity... That is why the RSI Lab is being established in Tokyo. Japan's... actual position in the global compute landscape supplies the design constraint we want to work under."
> （算力高效的自我改进不是偏好,而是结构性必然……这正是 RSI 实验室设在东京的原因。日本在全球算力格局中的实际位置,恰好提供了我们想在其下工作的设计约束。）

把这层说穿:**日本拼不过美国的 GPU 集群,于是 Sakana 把"算力穷"反过来当成方法论的护城河——你堆硬件,我堆聪明。** 这是一次"主权 AI"叙事下的差异化豪赌。赌赢了,RSI 不再是巨头算力垄断的专利;赌输了,样本效率的天花板会把它摁死在 demo 阶段。

这条路也不是凭空起的。Sakana 把自家"血统"列得清清楚楚:LLM² 产出过完全由 AI 发现并编写的最优化算法 DiscoPOP;**Darwin Gödel Machine(DGM)** 在 SWE-bench 软件工程基准上把自己从 20% 自动改进到 50%(致敬数十年前 Schmidhuber 提出的"哥德尔机"自改写思想);AI Scientist 全自动科研系统刚在 2026 年 3 月登上《自然》。换句话说,RSI 实验室是这家公司"用 AI 改 AI"五年积累的收口,不是蹭热点临时挂的牌子。

---

## 四、同一时空,这条暗线上还站着谁

你想知道"同一平行时空下围绕这个主题都发生了什么"。把 2026 年 5—6 月这一个多月摊开,RSI 这条线上挤满了人:

- **Recursive(Richard Socher 创办)**:本月成立,名字直接就叫"递归超级智能",目标是"研究想法的构思、实现、验证全过程都自动化"(来源:https://techcrunch.com/2026/05/14/what-happens-when-ai-starts-building-itself/ )。
- **Adaption(Sara Hooker,前 Cohere)**:推出 AutoScientist,训智能体对前沿训练做增量改进。
- **DeepMind——AlphaEvolve**:Gemini 驱动的进化式编码智能体,自动设计、优化算法,再把成果回流进下一代 Gemini。这是"AI 改进训练下一代 AI"已经在跑的闭环(来源:https://deepmind.google/blog/alphaevolve-a-gemini-powered-coding-agent-for-designing-advanced-algorithms/ )。
- **OpenAI**:Altman 设了内部目标——"an automated AI research intern by September of 2026... and a true automated AI researcher by 2028"(2026 年 9 月有跑在数十万 GPU 上的自动化 AI 研究实习生,2028 年有真正的自动化 AI 研究员;来源:https://x.com/sama/status/1983584366547829073 )。
- **Anthropic**:Claude Code 已经在大比例地编写它自己——2026 年 1 月团队一位主程估计内部"close to 100%"的代码由该工具生成。这本身就是一种低调版 RSI。

也有泼冷水的。Google CEO Pichai:"in the way people describe RSI, that would represent a next level of acceleration... we aren't quite there yet"(按人们描述 RSI 的方式,那是又一层级的加速,我们还没到)。前 OpenAI 董事 Helen Toner 更尖锐:大家"只是尽可能多地用 AI",这和 RSI 的经典定义——"真的不再需要人类"——是两码事。这正对应 TechCrunch 那个副标题:RSI 和当年的 AGI 一样,**热词先行,定义滞后。**

---

## 五、Karpathy:先纠一个事实错误,再讲它为什么是 RSI 故事的注脚

你说"Karpathy 重新入职了 OpenAI"。**这里要纠正:他 2026 年 5 月 19 日加入的是 Anthropic,不是 OpenAI。**

> "Personal update: I've joined Anthropic. I think the next few years at the frontier of LLMs will be especially formative."
> （个人动态:我加入了 Anthropic。我认为接下来几年在大语言模型前沿会格外具有塑造性。）
> 来源:Karpathy 本人 X，https://x.com/karpathy/status/2056753169888334312 ；TechCrunch 2026-05-19，https://techcrunch.com/2026/05/19/openai-co-founder-andrej-karpathy-joins-anthropics-pre-training-team/

他进的是 Anthropic 预训练团队,向预训练负责人 Nick Joseph 汇报,组建一个"用 Claude 加速预训练研究"的小组。你大概率把两件事记混了:Karpathy 确实"重返过 OpenAI"——但那是 **2023 年**(待约一年,2024 年 2 月再离开去创办教育创业公司 Eureka Labs)。这次回前沿,目的地是 Anthropic。

你"2 个月后入职"和"离开 lab 理解会 drift"的记忆,则基本对得上,只是出处要校准:

- 那套"判断会漂移"的逻辑,出自 **No Priors 播客第 154 集,2026 年 3 月 20 日**——到 5 月 19 日入职,正好约 2 个月。不是被传得更广的 Dwarkesh 那期(2025-10)。
- 原话不是字面的"drift from reality"。最接近的是他在 No Priors 里承认:"his judgment will inevitably drift as he loses visibility into what is happening at the frontier"(随着自己对前沿正在发生什么失去可见性,判断会不可避免地漂移)。他甚至描述了理想方案是去前沿实验室"借调(secondment)"一段——待一阵,既跟上最新技术又不丧失独立性。**两个月后加入 Anthropic,正是兑现了这套说法。**(来源:No Priors ep.154 https://www.youtube.com/watch?v=kwSVtQ7dziU ；TestingCatalog https://testingcatalog.net/karpathy-joins-anthropic-to-avoid-ai-intuition-drift/ )

⚠️ 一个常见误引要避开:Dwarkesh 那期他也说过"drift"——"drift too much from the distribution"——但那是在讲**大模型采样会偏离训练分布(模型坍缩)**,跟"他本人判断漂移"毫无关系,别张冠李戴。

为什么这条注脚重要?因为 Karpathy 自己就在做 RSI:他有个叫 **Auto-Research** 的项目,用智能体集群自动改训练代码,过夜跑出了他手调多年都没发现的优化。他 3 月还自嘲"It's not novel, ground-breaking 'research' (yet)"(这还不是新颖的、开创性的"研究")。如今他在 Anthropic 做预训练——**一个公开宣称"离开前沿就会判断失真"的人,亲自验证了:在 2026 年,你没法在前沿实验室外面理解前沿。** 这比任何一句 AGI 定义都更能说明这个行业的引力有多大。

---

## 对从业者意味着什么

1. **别再用"AGI 来没来"当判断标准。** 连最该宣传 AGI 的公司都把这个词扔了。要追踪的是可证伪的能力阈值:模型能不能自主完成数周的任务、能不能并行跑出"天才之国"、触没触发更高的 ASL 安全等级。拿"是不是 AGI"提问,等于自愿被营销牵着走。

2. **把注意力从"模型多大"挪到"模型能不能改模型"。** 2026 年的竞赛暗线是 RSI。判断一家实验室是否真的领先,看它有没有让 AI 进入自己的研发循环——AlphaEvolve 回流 Gemini、Claude 写 Claude、Auto-Research、AutoScientist 都是信号。这条曲线一旦复利,"参数军备竞赛"会瞬间过时。

3. **Sakana 的赌注值得单独盯。** "样本效率 > 算力"如果成立,等于给所有买不起十万卡集群的国家和公司开了一条侧门——这是中国、日本、欧洲团队最该研究的范式。如果不成立,它会成为"算力才是唯一护城河"的又一个反面教材。要看的硬指标只有一个:**他们能不能在国家级(而非超大规模)算力预算上,把自改进的曲线持续往上推。**

4. **人才流向是最诚实的信号。** Karpathy 这种"独立派旗手"都判断"外面待不下去、必须回前沿",意味着 2026 年最稀缺的不是算力也不是数据,是**对前沿的实时可见性**——它只在那几家闭源巨头墙内。这对所有想在墙外做严肃 AI 研究的人,是一个冷的提醒。

---

## 引用与信源

1. Dario Amodei《Machines of Loving Grace》(2024-10)——"powerful AI / country of geniuses in a datacenter"出处:https://darioamodei.com/essay/machines-of-loving-grace
2. Anthropic《Core Views on AI Safety》(2023-03)——"transformative AI":https://www.anthropic.com/news/core-views-on-ai-safety
3. Anthropic Responsible Scaling Policy(ASL 等级):https://www.anthropic.com/news/responsible-scaling-policy-v3
4. Sakana AI RSI Lab 官方公告:https://sakana.ai/rsi-lab/ ；David Ha 发布:https://x.com/hardmaru/status/2062948594597208557
5. Sakana Darwin Gödel Machine:https://sakana.ai/dgm/ ；论文 arXiv:2505.22954
6. Smol AI News:https://news.smol.ai/
7. TechCrunch《RSI is the new AGI》(2026-05-28):https://techcrunch.com/2026/05/28/rsi-is-the-new-agi-and-its-just-as-hard-to-pin-down/
8. Karpathy 加入 Anthropic——TechCrunch(2026-05-19):https://techcrunch.com/2026/05/19/openai-co-founder-andrej-karpathy-joins-anthropics-pre-training-team/ ；本人 X:https://x.com/karpathy/status/2056753169888334312
9. No Priors 播客 ep.154(2026-03-20):https://www.youtube.com/watch?v=kwSVtQ7dziU ；复盘 https://testingcatalog.net/karpathy-joins-anthropic-to-avoid-ai-intuition-drift/
10. DeepMind AlphaEvolve:https://deepmind.google/blog/alphaevolve-a-gemini-powered-coding-agent-for-designing-advanced-algorithms/
11. Altman 自动 AI 研究员目标:https://x.com/sama/status/1983584366547829073
12. Recursive(Richard Socher):https://techcrunch.com/2026/05/14/what-happens-when-ai-starts-building-itself/
