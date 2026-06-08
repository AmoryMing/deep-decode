---
title: Grok 进了 Cloudflare 的 AI Gateway——模型分发开始"自来水管化"
type: published
created: 2026-06-05
updated: 2026-06-05
style: default
distribute: [email, xiaohongshu]
tags: [Cloudflare, AI-Gateway, Grok, xAI, 模型网关, OpenRouter]
---

# Grok 进了 Cloudflare 的 AI Gateway——模型分发开始"自来水管化"

6 月 3 日，xAI 发了一条只有六个词的推文："在 Cloudflare 的 AI Gateway 上试试 Grok 模型。"配图是 Cloudflare 开发者账号的视频，下面一行字：Grok 的语言、音频、图像、视频模型现在都能通过 AI Gateway 调用，账单直接走 Cloudflare，不用额外配 auth、环境变量、API key。

这条推文本身没有信息量。值得拆的是它背后那个动作：又一家模型厂商，把自己接到了一个"网关"上。一年前还在各自卖 API 的模型公司，现在排着队往同一类入口里挤。这个入口叫 AI Gateway，它正在变成开发者接所有模型的统一总阀门——而谁握住这个总阀门，谁就握住了分发权和切换成本。

![封面](assets/gpt-img/00_cover.png)

## 本期看点

- AI Gateway 是夹在你的应用和各家模型之间的一层代理：缓存、限流、日志、回退、多模型切换，一个入口全包。
- xAI 上架 Cloudflare，图的不是技术而是渠道——把 Grok 摆到开发者每天经过的货架上。
- 这和本周 OpenRouter 那套聚合路由是同一场战争：网关层在抢"谁来决定请求打给哪个模型"。
- 对从业者：接多模型的正确姿势是接网关层，不是各家直连——但要看清你交出去的是什么。

## AI Gateway 到底是什么：模型和你之间的那层代理

直接说人话。你写一个应用要调大模型，最朴素的做法是拿着 OpenAI 的 key 往 `api.openai.com` 发请求，拿着 Anthropic 的 key 往 Anthropic 发请求。每多接一家，多一套 key、多一套 SDK、多一处要监控的开销。

AI Gateway 是插在中间的一层。你的应用不再直接发给模型厂商，而是发给 Gateway，Gateway 再转发出去。就因为所有请求都过这一道关，它能顺手做四件各家直连做不了的事。

第一是缓存。Cloudflare 文档里写得直白：相同的请求"直接从 Cloudflare 的缓存返回，而不是回源到模型厂商"。同一个问题问第二遍，不必再花一次 token 钱。第二是限流，按你设的上限卡住请求量，防止某个失控的循环把账单刷爆。第三是可观测，请求数、token 用量、花了多少钱、哪些报错，全在一个面板里——这是各家直连时你得自己拼日志才能得到的东西。第四是回退和重试，Cloudflare 的说法是"定义请求重试和模型回退，在出错时提升韧性"：主模型挂了或超时，自动切到备用模型，应用不至于跟着一起倒。

把这四件事合起来看，AI Gateway 干的就是"代理层"该干的活——它不生产模型，它管理你对模型的访问。这个位置，和 CDN 当年插在用户和源站之间是同一个生态位。Cloudflare 做这个尤其顺手，因为它本来就是干代理的。

![什么是AI Gateway](assets/gpt-img/01_what.png)

## xAI 为什么要上架：这是铺货，不是炫技

xAI 把 Grok 接到 Cloudflare，技术上没有任何难度可言。一家能训出千亿参数模型的公司，对接一个网关的 API 是下午就能干完的活。所以这步动作的意义不在技术，在渠道。

看 Cloudflare 那条推文强调的三点："Grok 的 LLM、音频、图像、视频模型现已通过 AI Gateway 提供""账单直接通过 Cloudflare 结算""无需额外的 auth、环境变量、API key"。三句话指向同一件事：把接 Grok 的摩擦降到接近于零。一个已经在用 Cloudflare AI Gateway 的开发者，想试 Grok，不必去 xAI 注册账号、申请额度、配密钥，改一个模型名字符串就行。

这就是铺货的逻辑。对模型厂商来说，能力再强，开发者接不进来也是零。各家直连的世界里，每个开发者接你都要付出一次性成本，这个成本就是你的获客漏斗在漏水的地方。上架网关等于把自己摆到开发者每天都经过的那个货架上，省掉他们重新建立连接的那一步。据 Cloudflare 文档，目前 Grok 4.3 带百万 token 上下文、函数调用、结构化输出，外加 Grok 的语音转文字（25 种语言、词级时间戳、说话人分离）和 Grok Imagine 的图像、视频生成——一整套全模态摆上同一个货架。

代价是什么？xAI 把和开发者之间的那道"直接连接"让给了 Cloudflare。账单走 Cloudflare、调用经 Cloudflare、切换在 Cloudflare 的面板里完成。开发者记住的是"我在用 AI Gateway"，而不是"我在用 xAI"。铺货铺得越成功，品牌就越被网关吃掉一层。这是所有上货架的供应商都要付的过路费。

![xAI上架是铺货](assets/gpt-img/02_distribution.png)

## 网关层之争：和 OpenRouter 是同一场战争

把 Cloudflare 这步放到本周的另一条线上看才完整。OpenRouter 这种聚合路由本周也在被反复讨论——它给你一个 key、一个 OpenAI 风格的接口，背后接 200 多个模型，请求哪个模型就写哪个模型名。逻辑和 AI Gateway 高度重叠：都是"你只对一个入口，入口替你连所有模型"。

两者的差别在站位。OpenRouter 是一个托管的聚合市场，重心是模型的"广度"和零摩擦接入——把尽可能多的模型摆进同一个目录，开发者图省事。Cloudflare AI Gateway 重心是"控制面"，缓存、限流、可观测、回退跑在它的边缘网络上，和 Workers、Secrets Store 这些已有产品长在一起。一个像模型超市，一个像架在你应用前面的调度台。但它们抢的是同一个位置：请求离开你的应用之后、到达模型之前的那一层，谁说了算。

这一层一旦被占住，议价权就开始转移。Cloudflare 2026 年上线了统一账单，第三方模型（OpenAI、Anthropic、Google AI Studio 这些）的用量可以直接计进 Cloudflare 的发票，代价是 5% 的手续费——充 100 美元额度扣 105。这个 5% 就是网关位置变现的第一道收费口。还有动态路由：你设好条件和上限，由 Gateway 内部决定这次请求该打给哪个厂商、还是直接返回缓存。Cloudflare 自己也承认这套路由和回退逻辑是不透明的——它怎么选模型、怎么命中缓存、怎么故障转移，外部看不到，你得信它的算法。

这是网关层之争的核心赌注：模型在变成可替换的后端，而"决定打给哪个后端"的权力，正在从开发者手里挪到网关手里。模型厂商排队上货架，是在亲手把这个权力喂给网关。

![网关层之争](assets/gpt-img/03_battle.png)

## 模型在商品化，网关在基础设施化

退一步看趋势。模型本身正在快速商品化——同一个任务，今天用 Grok、明天用 Claude、后天用 Gemini，对很多应用来说差别在收窄，价格和延迟反而更要紧。当后端可以随时替换，真正稀缺的就不再是某一个模型，而是"在它们之间无痛切换"的能力。这个能力，恰好就是网关层提供的。

所以会看到一个分层在固化。底层是模型厂商，拼参数、拼上下文、拼多模态，但越来越像发电厂——电是电，谁家的电点亮灯泡没本质区别。上面一层是网关，谁都不发电，但它握着自来水管和总阀门，决定水从哪个厂引、按什么价收、出故障切到哪。当年 CDN 对 web 流量、电网对发电厂，都是这个生态位。AI Gateway 想做的就是 agent 时代的那根总管。

判断落在这里：模型分发正在基础设施化。xAI 上架 Cloudflare 不是一条产品新闻，是一个信号——连最不缺渠道、最有品牌的模型公司，也开始接受"通过别人的水管把自己卖出去"。当供应商都来上货架，货架本身就成了行业里最值钱的不动产。

![分层固化](assets/gpt-img/04_layering.png)

## 对从业者意味着什么

如果你在接多模型，默认选网关层，别再各家直连。各家直连意味着你自己重写缓存、自己拼日志、自己做限流和故障转移——这些 AI Gateway 开箱就有，省下的是实打实的工程时间。一个入口接所有模型，今天想换个后端改一个字符串，这是直连给不了的灵活度。

但接之前看清三件事。一是你交出去了路由的可见性：动态路由怎么选、缓存怎么命中，网关说了不一定让你看到，对延迟敏感或要审计的场景这是真问题。二是看清收费口在哪，比如统一账单那 5% 的便利费，省心是有价的，量大了这笔过路费要算进成本模型。三是别让网关把你锁死——尽量让你的代码在"绕过网关直连模型"和"走网关"之间能切换，网关是为了降摩擦，不是为了再造一个你逃不出的依赖。

还有一条给做模型或做平台的：如果你在卖能力，问自己货架在哪。开发者不会为了你重新建一次连接，他们在哪个网关上，你就得出现在哪个网关上。xAI 这步给的就是这个答案。

## 本期关键词

- **AI Gateway（AI 网关）**：插在应用和各家大模型之间的代理层，统一做缓存、限流、日志、故障回退、多模型切换。你只对一个入口，它替你连所有模型。
- **回退（Fallback）**：主模型出错或超时，自动切到预设的备用模型，应用不中断。
- **动态路由（Dynamic Routing）**：按你设的条件和上限，由网关在运行时决定请求打给哪个厂商或直接返缓存，路由逻辑通常不透明。
- **统一账单（Unified Billing）**：第三方模型的用量直接计进网关厂商的发票，免去逐家结算，Cloudflare 收 5% 便利费。
- **BYOK（自带密钥）**：把你自己的模型厂商 key 存进网关，运行时由网关替你带上，密钥集中托管加密。
- **商品化（Commoditization）**：模型之间的差异收窄、可互换，价值从"用哪个模型"转向"在模型间怎么切换"。

## 引用

1. xAI 推文（主信源），2026-06-03："Try Grok models on @Cloudflare's AI Gateway!"（在 Cloudflare 的 AI Gateway 上试试 Grok 模型！）https://x.com/xai/status/2062294202625696081
2. Cloudflare Developers 推文，2026-06-03："We're partnering with @xai to bring Grok to @Cloudflare AI Gateway. Grok LLMs, audio, image, and video models are now available through AI Gateway; billed directly through Cloudflare; no additional auth, env, API keys needed."（我们和 xAI 合作，把 Grok 带进 Cloudflare AI Gateway。Grok 的语言、音频、图像、视频模型现已通过 AI Gateway 提供；账单直接走 Cloudflare 结算；无需额外的 auth、环境变量、API key。）https://x.com/CloudflareDev/status/2062281694162629119
3. Cloudflare AI Gateway 官方文档（概览）：缓存、限流、可观测、回退与重试、多厂商支持。https://developers.cloudflare.com/ai-gateway/
4. Cloudflare AI Gateway 文档·统一账单：第三方模型用量计进 Cloudflare 发票，收 5% 便利费。https://developers.cloudflare.com/ai-gateway/features/unified-billing/
5. Cloudflare AI Gateway 文档·xAI（Grok 上架的厂商页与模型清单）。https://developers.cloudflare.com/ai-gateway/usage/providers/grok/
6. Cloudflare 博客："AI Gateway now gives you access to your favorite AI models, dynamic routing and more — through just one endpoint."（AI Gateway 现在让你通过单一端点访问喜欢的模型、动态路由等更多功能。）https://blog.cloudflare.com/ai-gateway-aug-2025-refresh/
