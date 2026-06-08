---
title: 视频模型的分叉日：Omni 走统一架构，Uni 走协调层
source:
  - https://x.com/demishassabis/status/2054326444189253655
  - https://x.com/LumaLabsAI/status/2054300200517456185
author: Demis Hassabis（Google DeepMind）/ Luma Labs
date: 2026-05-12
type: decode
slug: 2026-05-12-video-model-fork-omni-vs-uni
suite:
  reader: default
  style: default
---

距离 Google I/O 2026 还有一周。5 月 12 日同一天，Demis Hassabis 和 Luma Labs 各自发了一条视频 demo 推文。前一天，9to5Google 已经放出 Gemini Omni 的早期演示截屏；同一周，Luma 的 Uni-1.1 API 刚开放七天。两条 demo 推文的具体帧画面外人看不到，但它们落在的时间点和上下文足够清楚——视频模型的下一回合，今天开打。

钩子不在视频本身。钩子在两家公司选了截然相反的路径去做同一件事——让视频模型从"生成"变成"在聊天里编辑、混音、按模板套用"。Google 把 Veo 吞进 Gemini，做一个统一模型；Luma 把 Uni 放在前面，让 agent 在背后调度 Veo、Seedream、Nano Banana、ElevenLabs。一个内部融合，一个外部协调。这是视频 AI 路线分叉的第一次清晰可见。

![封面](assets/png/00_cover.png)

## 同一天发同一类 demo，差几个小时

5 月 11 日，9to5Google 发了一条核稿："Gemini 'Omni' video model shows up with some early demos"（Gemini "Omni" 视频模型出现，附若干早期演示）。Google 在 Gemini 应用内对 Omni 的官方介绍语是："Meet our new video generation model. Remix your videos, edit directly in chat, try a template, and more."（认识下我们的新视频生成模型。重混你的视频，在聊天里直接编辑，套模板，等等。）

demo 内容两个：一个让模型生成"教授在黑板上推导三角恒等式并讲解当前那一步"的镜头——黑板文字渲染过关，整体仍能看出 AI 感；另一个生成"两个男人在海边露台高档餐厅吃意面"的场景。一个用户跑两条 prompt 用掉了当日 AI Pro 套餐配额的 86%。

5 月 12 日，Demis Hassabis 在 X 上发了一条带视频的推文。同一天，Luma Labs 也在 X 上发了一条带视频的推文。两条具体视频内容因 x.com 反爬未能取得逐帧——但 9to5Google 的泄露时机、Luma 在 5 月 5 日刚发的 Uni-1.1 API 公告，决定了同一周这两条视频不是巧合而是节奏。

**把这件事命名：节奏共振**。当两家在同一周做同一类产品演示，并不一定是抄袭或互相回应——更常见的解释是行业曲线到了某个拐点，谁先发都会被解读成对手的应答。视频模型的"聊天内编辑"是 2026 春季的共振拐点。Google I/O 5 月 19 日开幕，Demis 的视频是 keynote 前的预热；Luma 在同一天放视频，是不让自己的 narrative 被 keynote 全部覆盖。

![同日信号](assets/png/01_same_day_signal.png)

## Omni vs Uni：两条路同一终点

把两家短期内的公开动作拉一条线对比，差异极其干净。

**Google Omni（统一架构路径）**。"Omni" 这个名字本身就有三种解读，felloai 把这三种摆得很清楚：一是 Veo 3.1 的公开品牌重塑，二是 Gemini 专属的新视频模型，三是真正的多模态统一架构——文本/图像/视频/音频在同一组权重里。"Omni" 这个名字最支持的是第三种解读。Demis 在 2025 年 4 月接受 TechCrunch 采访时说得很白：Google "will eventually combine Gemini and Veo"（将最终把 Gemini 和 Veo 合并）来让前者真正理解物理世界。Omni 是这个合并的产品名。

Google 的赌注是：**一个模型搞定所有模态，能力随规模涌现**。这条路要求大算力、大数据、大架构改造——Google 的资源结构刚好对得上。代价是迭代慢，Omni 现在的原始保真度据报可能落后 ByteDance Seedance 2，但 felloai 强调它真正的护城河是"同一聊天里直接编辑"——工作流整合优于纯生成画质。

**Luma Uni（协调层路径）**。Uni-1 在 3 月 5 日上线，定位是"多模态推理模型，能生成像素"（multimodal reasoning model that can generate pixels）。它的官方描述"understands intention, responds to direction, and thinks with you"（理解意图，响应指令，与你共同思考）说明设计重心在 reason-before-generate，不在直接堆视觉保真度。同一天 Luma 发了 Luma Agents——一组创意 agent，背后协调 Google Veo 3、Nano Banana Pro、ByteDance Seedream、ElevenLabs voice 等多家模型。

Luma 的赌注是：**自己做不到全栈最强，但可以做调度层最强**。Uni-1 在自家推理 benchmark 上击败 Google Nano Banana 2 和 OpenAI GPT Image 1.5，而且便宜 30%——这是局部优势。真正的杠杆在 Luma Agents 把别家模型当工具调用，做"哪家模型在某一步最合适就用哪家"的智能编排。Luma Series C 公告那句"AGI is multimodal and reality is the dataset of AGI"——他们把 AGI 押在"协调"而不是"统一"。

把这种差异命名：**统一架构 vs 协调层**。统一架构追求模型涌现，赌的是 Google 这种巨头才玩得起的资源密度；协调层追求工作流编排，赌的是 Luma 这种中型公司可以靠产品形态拿到独立价值。两条路最终落点都是"视频从一段输出变成一个可编辑对象"——区别只是先做 superModel 还是先做 superAgent。

![两条路径](assets/png/02_two_paths.png)

## Omni 的真实卖点：从生成到编辑

90% 的视频 AI 报道把"画质"当作头条指标。Omni 的官方介绍打开新角度："Remix your videos, edit directly in chat, try a template, and more."

四个动词分开看：

- **Remix**：拿一段已有视频，让模型改其中一部分——换演员、换场景、换风格
- **Edit directly in chat**：不进剪辑软件，在 Gemini 对话框里用文字指令改
- **Try a template**：套预设——婚礼回忆、产品广告、教学解释——用户只填空
- **And more**：留白

这四个动词指向同一件事：**视频从"生成结果"变成"可对话对象"**。过去 Veo/Sora/Kling 的工作流是 prompt-render-pray（写提示词、等渲染、祈祷出片）；Omni 想做的是 prompt-render-converse（生成完之后可以接着聊改）。

对比 OpenAI 的 Sora——在 2026 年早期被 OpenAI 自己下线——可以看出节奏差。Sora 把宝押在保真度，结果在产品形态上没找到稳定 PMF；Google 这次的赌注是：保真度可能不是最高，但工作流够顺，用户黏在 Gemini 里。86% 的日配额耗在两条 prompt 这个数据点本身也说明——Omni 不是即开即用的玩具，它正在被 Google 当严肃工作流来定价。

![Omni 能力](assets/png/03_omni_capabilities.png)

## Uni 的真实卖点：把别人的模型当 SDK 用

Luma 这条路看起来"自己模型不够强、靠拼装"，但 3 月 5 日的 Luma Agents 公告把这件事解构得不留余地：Luma 不光卖 Uni-1 的图像生成，它卖一个**会自动选用别家模型**的 creative agent。

实际工作流大致是这样的：用户在 Luma Agents 里说"做一个 30 秒的产品广告，主角是这个小狗"。Agent 内部拆任务——分镜由 Uni-1 推理出来；每个分镜的图像让 Nano Banana Pro 渲染、或让 Seedream 处理风格化；视频运动让 Veo 3 来跑；旁白让 ElevenLabs 合成；最后 Agent 拼起来。从用户视角看，他在用一个 Luma 产品；从模型视角看，背后是五六家公司的 API 被 Luma 编织成一个工作流。

这是**SDK 化竞争对手**。Luma 把 Google Veo、字节 Seedream 当作 SDK 调用——它们仍在收 token 费，但产品入口和定义权在 Luma 手里。这个模式对中型公司极有诱惑力：自家模型不需要每个维度都最强，只需要在调度层有独立判断力。

Uni-1.1 API 5 月 5 日开放给开发者，意味着 Luma 把这套调度层暴露给第三方应用——任何创意工具都可以接入 Uni 做 reasoning 层，下面调谁的视频/图像/音频模型由 Luma 决定。Luma 在视频赛道做的事，逻辑上和 LangChain 在 LLM 赛道做的事是一类。

![Uni 协调](assets/png/04_uni_orchestration.png)

## 盲区与反面论证

**Omni 的三种解读还没有官方答案**。Veo 改名最保守、新模型中间、真正多模态统一最激进。在 Google I/O 5 月 19 日给出正式公告前，"Omni 是什么"只能基于泄露反推。Demis 5 月 12 日发视频推文是 I/O 前的最后一波铺垫，他不会在 keynote 之前把底牌完全揭。

**Luma 协调层有自我依赖陷阱**。Uni-1 自家的图像保真度不是最强（推理强、像素未必）。一旦 Agent 调度逻辑被复制——OpenAI 或 Google 也搞类似的协调层——Luma 失去独立价值。Luma Agents 现在的护城河更多在产品设计和创意行业品牌（Wonder Project 合作、Jude Law 同业未发生但同类广告语境），不在技术。

**保真度仍在中国手里**。原始视频画质这一块，ByteDance Seedance 2 和 Kling 的输出在 2026 年仍然被多家行业评测列为头部。Google Omni 拿"工作流"做差异化，Luma 拿"协调"做差异化——两家都不和中国头部模型在像素竞赛上正面打。如果 Seedance 3 或 Kling 3 推出更好的对话内编辑能力，这两条护城河会同时被掏。

**Sora 下线的真实原因 OpenAI 没说完**。这件事在 2026 年早期发生，行业一般归因为 PMF 和合规，但 OpenAI 自己没正面解释。Sora 死后留下的市场空位，是 Omni 和 Uni 现在抢的核心位置。如果 OpenAI 用别的形态重回视频赛道（比如把视频做成 ChatGPT 的工具调用，而不是独立产品），这两条路都会被搅乱。

## 对从业者意味着什么

**视频/创意工具 PM**：本周看你产品里的"生成"按钮——它能不能在结果之后接受第二轮修改指令？如果不能，你正在做 2024 年的产品。Omni 和 Uni 两条路殊途同归地把视频变成"可对话对象"。

**多模态 AI 架构师**：本周判断你的技术选型——你是押单一统一模型，还是押多模型协调。这个判断在 2026 年下半年会越来越像选边。统一模型路径需要绑定一家大厂；协调路径需要自己有 reasoning 层。

**创业者**：本周想清楚你的 moat 是不是 "agent 把别家模型用得最好"。Luma 把这件事公开做了——你能不能在自己的垂直领域做同样的事？教育视频、电商带货、品牌广告——每个垂类都有自己的"哪家模型在哪一步最合适"。

**视频内容创作者**：本周试一次 Omni（如果你有 AI Pro）或 Luma Agents——重点不看出片质量，看对话内编辑的体验。这件事比单帧画质决定下半年的工作流。

**研究爱好者 / 关心 AGI 路径**：本周回想一下 Luma Series C 公告那句"reality is the dataset of AGI"——视频在 2026 年正式从"产品"被定义为"AGI 训练数据"。这意味着所有视频生成公司同时在做两件事：服务终端用户 + 收集真实世界视频反馈。Omni 86% 的高配额消耗也指向这个方向。

## 本期关键词

**Gemini Omni** —— Google 2026 年 5 月泄露的视频模型，定位是"在聊天里直接编辑视频"的统一多模态产品。Omni 这个名字暗示文/图/视频/音频在同一模型里。Veo 是 Omni 的前身或子模块。Demis 在 2025 年 4 月已经预告过 Gemini × Veo 合并。

**统一架构 vs 协调层** —— 多模态 AI 在 2026 年的两条主路径。统一架构由 Google/OpenAI 这种巨头玩，赌的是大规模训练带来的涌现；协调层由 Luma/LangChain 这类中型公司玩，赌的是用 agent 把别家模型编排得更聪明。两条路最终都让"视频"从"输出"变成"可对话对象"。

**节奏共振** —— 当两家公司在同一周做同一类产品演示，通常不是巧合也不是抄袭，而是行业曲线到了拐点。视频模型 2026 春的拐点是"聊天内编辑"，Google 和 Luma 都被这个拐点拉到 5 月 12 日同时演示。

**SDK 化竞争对手** —— 协调层路径的核心动作：把别家的强模型当作自己产品里的可调用 SDK。Luma Agents 调用 Veo 3、Seedream、ElevenLabs，把它们框在自己的工作流入口下。这种姿态的潜台词是"我不在每个维度都最强，但我决定什么时候用谁"。

**prompt-render-converse** —— 视频 AI 的新工作流。过去是 prompt-render-pray（写提示词、等渲染、祈祷），现在是 prompt-render-converse（生成完之后接着聊改）。Omni 的"edit directly in chat"和 Luma Agents 的"thinks with you"都是这一变化的产品化。

**reality as dataset** —— Luma Series C 公告里的说法："AGI is multimodal and reality is the dataset of AGI"。视频生成公司收集用户生成行为，是在收集"现实"的标注数据。这把视频赛道的商业模式和 AGI 训练数据回路绑死。

## 引用

1. [Demis Hassabis 2026-05-12 video tweet](https://x.com/demishassabis/status/2054326444189253655) —— 推文锚点（视频内容因 x.com 反爬未能取得逐帧）
2. [Luma Labs 2026-05-12 video tweet](https://x.com/LumaLabsAI/status/2054300200517456185) —— 推文锚点
3. [Gemini 'Omni' video model shows up with some early demos](https://9to5google.com/2026/05/11/gemini-omni-video-model-shows-up-with-some-early-demos/) —— 9to5Google 2026-05-11，含 Omni 官方介绍语原文与 demo 描述
4. [Gemini Omni Just Leaked Ahead of Google I/O 2026](https://felloai.com/google-gemini-omni/) —— Omni 三种解读、与 Veo 3.1 / Seedance 2 对比
5. [DeepMind CEO Demis Hassabis says Google will eventually combine its Gemini and Veo AI models](https://techcrunch.com/2025/04/10/deepmind-ceo-demis-hassabis-says-google-will-eventually-combine-its-gemini-and-veo-ai-models/) —— TechCrunch 2025-04，Demis 关于统一架构的原始预告
6. [Luma launches creative AI agents powered by its new "Unified Intelligence" models](https://techcrunch.com/2026/03/05/exclusive-luma-launches-creative-ai-agents-powered-by-its-new-unified-intelligence-models/) —— TechCrunch 2026-03-05，Luma Agents 协调 Veo/Seedream/ElevenLabs 的原始报道
7. [UNI-1 | Less Artificial. More Intelligent.](https://lumalabs.ai/uni-1) —— Luma 官方 Uni-1 产品页
8. [Luma Series C 官方公告](https://lumalabs.ai/news/series-c) —— "AGI is multimodal and reality is the dataset of AGI" 原话出处
