---
title: 一条挂了七个月的 issue
---

## 七个月没人合并

2025 年 9 月 30 日，有人在 claude-code 仓库提了 issue #8477,标题平淡:"加个选项,一直显示 Claude 的思考"。他升级到 v2.0.0 后,想看模型怎么想的,得连按三步——ctrl+o、ctrl+e、再向上滚,他用的原词是 tedious(很麻烦)。七个多月过去,issue 状态还是 open,没合并。看着像 UX 小改进,翻开源码才知道不是漏改,是写进代码里的取舍。

## 第一刀砍渲染

翻 Messages.tsx 第 229 行有条注释直白得很:"transcript 模式下,除最后一次外隐藏所有 thinking 块"。日常主屏更彻底,根本不渲染思考内容。模型确实想了,但你看不到。主屏唯一留下的痕迹在 SpinnerAnimationRow,转圈时显示 thinking…,停下显示 thought for 7s。一个字符串,没有内容,终端窄到放不下时连 thinking 这个词都会被砍掉。这就是 v2.0.0 主屏对思考的全部礼遇。

## 第二刀砍到 API

2026 年 2 月 12 日又补一刀,更靠后。betas.ts 里加了个 header,值是 redact-thinking-2026-02-12,直接告诉 API 别返回思考摘要。源码注释写得像教科书:摘要是 API 端跑一个小 Haiku 模型做的,要钱要时间;而 interactive users rarely open ctrl+o(交互用户很少打开 ctrl+o)。既然没人看,干脆跳过摘要,只返回一个签名占位块。第一刀时内容还在 response 里,这一刀连内容都不返回了。

## 占位块只剩三个字

被砍掉摘要后,你能看到的全部思考,是 AssistantRedactedThinkingMessage 这个组件——整个文件就 30 行,主体是一句灰色斜体的"✻ Thinking…"。更耐人寻味的是组件名里的 Redacted:它本是 API 协议里"涉密/不可见思考"的概念,现在被复用成"我们故意不给你的思考块"的占位符。同一个 UI 组件,承担了两种语义。

## 开关存在但不解决

issue 作者想用 settings 开个 always show,打开 types.ts 会看到 showThinkingSummaries 这个设置项,默认 false。但描述里写着 in the transcript view (ctrl+o)。即便设成 true,摘要也只回到 transcript 屏,不会回主屏。三步按键一步没省。Anthropic 用一行 schema 告诉你:开关有,但开了之后你看思考的路径依然是 ctrl+o。

## Anthropic 也许是对的

把这当判决书递过去,反论至少三条。一是数据驱动:给 99% 用户每次省一次 Haiku 摘要,代价是 1% 用户多按两次键,成本不对等。二是 opt-in 路径已存在:SDK 和 print mode 默认返回摘要,交互用户改一行 settings 也能找回。三是真要严肃 steer 思考的人本就该写代码消费 thinking 块,而不是按 ctrl+o 滚屏。三条都站得住,但都没解决 issue 作者要的——v2.0.0 之前那种 verbose 一开什么都看见的工作流。

## 默认隐身是通用方向

#8477 是一家的 issue,但默认隐身不只一家在走。tool call 详情默认折叠、reasoning 默认收起、extended thinking 躲进次屏——这是 2025 下半年到 2026 上半年 Agent 工具的共同方向。两个驱动同向用力:模型层面,extended thinking 一次几千 token,平铺既污染视觉又费钱;用户层面,Agent 越自动,注意力假设越偏向"完成态",用户希望被告知结果而非过程。结果是默认设置下,Agent 的"如何完成"对人不可见。

## 对从业者意味着什么

架构师本周打开 telemetry 看一项:用户停留在隐藏内容(思考、tool args)的时间占比,低于 5% 你的默认值大概率在挤走高级用户。PM 回看最近三次"减少视觉噪音"的折叠决策,是主观觉得吵还是有数据支撑。工程师把主循环的 reasoning 字段从事后日志提到前台流,给个开关让默认安静但好打开。看不到中间状态的工具,是用来出活的,不是用来被审计的——这两类用途 2026 年得分开采购。
