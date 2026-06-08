---
title: Figure 跑完 8 小时的真正意义：109000 行 C++ 被一个神经网络替掉了
source: https://x.com/adcock_brett
author: Brett Adcock (Figure AI CEO) 直播
date: 2026-05-13
type: decode
slug: 2026-05-15-figure-helix02-8hour-shift
---

# Figure 跑完 8 小时的真正意义：109000 行 C++ 被一个神经网络替掉了

5 月 13 日，Figure AI 的 CEO Brett Adcock 在 X 发了一条直播。

> "Watch a team of humanoid robots running a full 8-hr shift at human performance levels. This is fully autonomous running Helix-02."
> （一队人形机器人在做完整 8 小时班次，达到人类性能水平。完全自主运行，跑的是 Helix-02。）

媒体收到的标题是"机器人连续干 8 小时不歇班"。

这个标题没错，但抓错了重点。

8 小时这个数字 Figure 在 BMW 工厂跑过更长的——10 小时，9 万件汽车零件。真正在 5 月 13 日发生变化的，**是这队机器人脚下的运动控制层**：109000 行手写 C++ 代码，被一个神经网络替掉了。

![封面](assets/png/00_cover.png)

## System 0：把"特技演员"换成"打工人"的关键

Figure 在 1 月发布 Helix-02 时讲了一个三层架构。

最上面是 **System 2**，做长程规划——"接下来分拣这一批包裹"。
中间是 **System 1**，做视觉-语言-动作的多模态决策——"这个箱子条码朝下，要翻过来"。
最底下是 **System 0**——做整个身体的运动控制。

之前 System 0 这一层是 109000 行人工编写的 C++ 代码（这个数字来自 Figure 工程团队的官方披露）。Helix-02 把它换成了一个神经网络，**用 1000+ 小时人类动作数据训练出来**。

技术上叫"learned whole-body controller"（学到的全身控制器）。功能上替代的是机器人学习了几十年的老手艺——逆运动学、PID、ZMP 平衡、足底力学反馈——这些每一项在传统机器人课本里都是单独一章。

![三层架构](assets/png/01_three_systems.png)

这件事的工程意义远超"少写了 10 万行代码"。

手写 C++ 的运动控制器有个根本问题：**它是写给已知场景的**。每次环境变（地面材质、负载重量、夹具状态），工程师要回去调参数、改 PID、重测稳定性。一队机器人在工厂里跑得好，搬到仓库不一定行——因为传送带高度不一样、地面摩擦系数不一样、灯光导致视觉偏差不一样。

神经控制器的核心承诺是：**这些差异在训练数据里见过，泛化时不再需要工程师手动改代码**。

Figure 的 1000+ 小时人类动作数据，意味着模型见过的步态、重心转移、手臂摆动方式，比任何手写控制器涵盖的状况都多。从控制论的视角，这是把"可分析、可证明、但脆弱"的工程系统，换成了"不可证明、但鲁棒"的统计系统。

这是人形机器人这十年最大的方法论转向。Boston Dynamics 的 Atlas 用了二十年模型预测控制（MPC）做出花式动作，但每个新动作要工程师调参数。Tesla Optimus 一直在试图走数据驱动的路，但训练数据量、控制频率始终是瓶颈。**Figure 这次是把"端到端学控制"在生产任务里跑通的第一个公开实证**。

![C++ 到神经网络](assets/png/02_cpp_to_neural.png)

## 8 小时这个测点说明什么

直播本身的细节值得拆。

任务是包裹分拣——传送带上的箱子，机器人识别条码、把条码朝下放回传送带。Brett Adcock 在帖子里说这是"the most boring task humanly possible"（人类能想到最无聊的任务）。这话不是自谦，是工程现实：**包裹分拣是机器人最容易跑通的真实任务之一**。

为什么？三个原因：

1. **环境结构化**——传送带高度固定、来料方向固定、目标动作固定。这跟"机器人帮你扫客厅"不是一个难度。
2. **决策密度低**——99% 的时间在做"看条码-抓-翻面-放回"的循环。少有意外。
3. **失败容忍度高**——掉一个箱子下次再来，不像家庭场景里打碎一个杯子要善后。

所以 8 小时跑下来，证明的是"Helix-02 在 Figure 选定的最友好任务上工程化稳定"。不是"通用人形机器人成熟了"。

但这个测点之所以重要，是因为**它跨过了"剪辑过的 30 秒 demo"和"持续可观察的工业操作"之间的那个门槛**。这个门槛之前，人形机器人公司发布会全是精修视频，谁也分不清是 demo 还是营销。这个门槛之后，时间和摄像机本身就是 verifier——直播间挂着，你想看 30 分钟还是 8 小时随意。

人类工人在这个任务上的速度是大约 3 秒/件。Figure 在帖子里给的口径是"comparable parity"（可比的水平）——没说更快，没说更慢。这个数字诚实，因为快递行业的人类分拣员速度已经被压到工程极限，机器人在 5 月 13 日跟上节奏就已经是工业可用了。

![8h 时间线](assets/png/03_8h_timeline.png)

## 但要注意：批评者说什么

TechRadar 当天的报道标题是"Figure AI streamed humanoid robots sorting packages for 8 hours straight — and not everyone is convinced it was fully real"。

质疑的点不是"机器人是假的"，而是几个工程边界：

**完全自主指什么？** "Fully autonomous" 这个词有两种解读。一种是"过程中没有人远程接管"。另一种是"机器人完全独立决策，不依赖任何外部系统"。在工业部署里，机器人通常接入云端的任务调度系统——这算不算"非自主"？Figure 没明确划线。

**电池/故障处理的边界。** 用户原文提到"电池没电会自己去换，坏了会自己报修联网协作"。这两个能力如果真在 8 小时里发生过，是非常强的信号。但从目前可查的公开报道里，**没有具体记录哪一台机器人在哪一秒去换了电池、哪一台报修了**。这是营销话术还是工程实证，需要看完整直播录像才能下结论。

**24/7 后续是放大了信号还是稀释了？** 8 小时之后，Figure 把直播延展到了 24/7，机器人代号 Bob、Frank、Gary。Bob/Frank/Gary 的命名跟特斯拉 Optimus 一脉相承——把工业品做成人物，是 PR 策略。技术上 24/7 比 8/24 难一档，但这种持续运行更像耐力测试而非能力测试。

**BMW 10 小时已经跑过。** 早在 Helix-01 时代，Figure 在 BMW 工厂的部署就跑过 10 小时班次，搬运 90000 件零件。这次的升级**不是"能跑更久"，是"全身用神经控制器跑"**。这个区别在媒体标题里被压扁了，但工程上完全不是同一件事。

## 把这次和人形机器人赛道放在一起看

5 月 13 日这个时间点上，赛道的其他玩家在做什么？

**Tesla Optimus**——机器人部门负责人 Milan Kovac 在 4 月离职，部门继续推进但节奏放缓。马斯克在 5 月给的指引是"2026 年量产 1 万台"，外界普遍怀疑。

**Apptronik**——2 月融资 5.2 亿美元，跟梅赛德斯-奔驰、GXO 物流签了部署合同。Google DeepMind 通过 Gemini Robotics 给它供 AI 能力——所以 Apptronik 的"控制层"是 Google 在做，应用层是 Apptronik 自己。

**Meta**——5 月 1 日收购 ARI（前身是 Sanctuary AI 团队），整合进 Meta 超级智能实验室。Meta 入场的方式是收编团队，不是从零做。

**Agility Digit、1X Neo**——都在仓储/物流场景里有限部署。1X 的 Neo Gamma 主打家庭，但没人在家里跑 8 小时直播。

把这五家排开，**Figure 是目前唯一在公开摄像机下跑工业班次的人形机器人公司**。其他家要么在 demo 阶段，要么在客户工厂里跑（不直播），要么还在融资。

这个不对称性的含义：Figure 的估值会进一步抬升，但**真正的护城河不是 8 小时本身，是 Helix-02 这套数据飞轮**——1000 小时人类动作数据训练出来的控制器，下一个版本会用 5000 小时、10000 小时。数据越多，泛化越好，对手追赶越难。这是机器人版的"OpenAI 飞轮"，只不过燃料是动作数据不是文本 token。

![赛道格局](assets/png/04_landscape.png)

## 对 AI 从业者意味着什么

三件事可以马上想：

**第一，控制层正在从"工程问题"变成"数据问题"。** 这跟 NLP 在 2018 年的转折是同构的——BERT 之后，没人再认真维护手写规则的 NLP 系统。机器人这边，"手写 C++ 控制器"会成为同样的过去时。如果你在做机器人或自动化方向，工程能力之外要补的是数据采集、动作捕捉、仿真训练这套链路。

**第二，人形机器人的 Bench mark 该重新设计。** 30 秒精修视频对决策者没意义，BMW 10 小时之类的客户案例又不可复现。**8 小时公开直播是新基线**——下次哪家公司发布会还放 demo 视频，这家公司就落后了。toB 客户买单的会是"我能远程看你跑多久"。

**第三，"机器人能不能取代人"是错的问题，"机器人能不能稳定跑某一类任务"才是对的问题。** Figure 的 8 小时只在分拣这一类任务上成立。下一步是分拣 + 装载 + 异常处理的组合任务，再下一步是非结构化场景的单一任务。这条曲线还要爬十年，但每一级新台阶都意味着某一类岗位的工程经济学被重写。

109000 行 C++ 被替掉的那一刻，不是机器人替代人类的时刻——是**机器人这门学科被并入 AI 学科的时刻**。

## 本期关键词

**Helix-02** —— Figure AI 的端到端人形机器人控制模型，2026 年 1 月发布。把视觉、触觉、本体感觉、全身控制统一在一个神经网络里。重点是"统一"——之前这些层是分开训练、分开部署的。

**System 0 / 1 / 2 三层架构** —— Figure 用来组织 Helix-02 的概念框架。System 2 做长程规划，System 1 做即时决策，System 0 做底层运动控制。这次直播的关键升级是 System 0 从手写 C++ 换成神经网络。

**Learned Whole-Body Controller（学到的全身控制器）** —— 用人类动作数据训练出来的运动控制神经网络。替代的是逆运动学、PID 控制、ZMP 平衡这些传统机器人学手艺。

**MPC（Model Predictive Control，模型预测控制）** —— Boston Dynamics 这类公司过去二十年的核心方法。基于物理模型预测未来几步动作，选最优解。优点是可分析、可证明稳定，缺点是每个新场景要工程师手调。

**端到端学控制（End-to-End Learned Control）** —— 跟 MPC 对立的路径。输入传感器信号，输出关节指令，中间全是神经网络。优点是泛化，缺点是不可解释、训练数据量大。Figure 这次是这条路径在生产场景的第一个公开实证。

**comparable parity（可比的水平）** —— Brett Adcock 用来描述 Figure 机器人和人类分拣速度对比的措辞。不说更快，不说更慢，意思是"已经能用"——但保留了未来加速的空间。

**Fully Autonomous（完全自主）** —— 行业里有歧义的术语。可以指"无远程接管"，也可以指"完全独立决策"。Figure 用的是哪个版本，目前没明确划线。

## 引用

1. [Brett Adcock X 帖（原始直播声明）](https://x.com/adcock_brett) — 本文核心一手资料
2. [Figure AI's Helix-02 Robots Complete Full 8-Hour Autonomous Shifts — Tech Times](https://www.techtimes.com/articles/316632/20260514/figure-ais-helix-02-robots-complete-full-8-hour-autonomous-shifts-humanoid-race-intensifies.htm) — 含人形机器人赛道格局
3. [Helix-02 robots now sustain full factory-style 8-hour shifts — Interesting Engineering](https://interestingengineering.com/ai-robotics/figure-helix02-humanoid-robots-8-hour-shifts) — 含 System 0 技术细节
4. [Figure AI streamed humanoid robots... and not everyone is convinced — TechRadar](https://www.techradar.com/ai-platforms-assistants/figure-ai-streamed-humanoid-robots-sorting-packages-for-8-hours-straight-and-not-everyone-is-convinced-it-was-fully-real) — 批评者视角
5. [Figure AI humanoids sort 28,000 packages in 24-hour autonomous test](https://interestingengineering.com/ai-robotics/figure-ai-humanoids-24-hour-autonomous-run) — 24/7 续航后续
