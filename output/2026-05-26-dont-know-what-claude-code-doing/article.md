---
title: 思考被默认藏起来了：Claude Code v2 把可观测性押给了反蒸馏
source: https://github.com/anthropics/claude-code/issues/8477
author: janbam（提案人）+ 81 楼评论
date: 2026-05-25
decoded: 2026-05-26
type: decode
status: review-ready
tags: [Claude Code, 思考链, 可观测性, 反蒸馏, UX 退步]
---

![封面](00_系列封面.png)

GitHub 上有一个持续累积评论的 issue：[anthropics/claude-code #8477 ——「Add Option to Always Show Claude's Thinking」](https://github.com/anthropics/claude-code/issues/8477)。81 楼评论，标签是 `area:tui`、`enhancement`，目前还 open。

但翻完评论会发现，这不是一个普通的功能请求。它是一群付费用户在协作做一件事——把官方默认拿走的东西，从一个被 minify 过的二进制里抠回来。有人在 `claude.exe` 里搜变量名做同长度字节替换，有人写 PowerShell 正则定位 `createElement` 的 props，有人开了一个 GitHub Actions 仓库专门给每个新版本重新打 patch。

这一切只是为了让一个原本默认显示的东西继续显示——Claude 在调用工具之前到底在想什么。

## 「Thought for 376s」是个时长，不是信号

提案人 janbam 的原话很短：

> Since v2.0.0 thinking is no longer shown in verbose mode. I work on steering and improving Claude's thinking. Now I have to press ctrl-o, ctrl-e, and scroll up all the time to see the thinking content, which is tedious.

翻成中文：v2.0 之后思考链不再显示，我在做的就是 steering（操舵）和改进 Claude 的思考，现在每次都得按 ctrl+o、ctrl+e 再往上翻，烦透了。

楼里有一条更尖锐的判断，值得整篇文章围着它转：

> 可见的实时思考是 steering loop 的承重梁。它在的时候，你能在模型沿着一个错误前提走出 N 个回合之前把它停下；你能验证它有没有真的内化 CLAUDE.md 里的约束，还是凭空捏造了一个；你能在 commit 一个方案之前 audit 它的假设。
> 把它藏进一个不可展开的 pill 之后，你没法分辨一个错误的最终答案是来自错误的前提，还是来自正确前提的错误执行。「Thought for 376s」是个时长，不是信号。它什么都告诉不了你。这是开发者对 agent 监督能力的退步。

这是 hifihedgehog 在 issue 后期的一条长评论里写的。他没在抱怨界面变难看，他在说一个系统性的事——可观测性被默认关掉之后，整个 steer-as-you-go 工作流被废了。

## 三层默认值

把思考从屏幕上拿走，不是改了一个 if 分支，而是叠了三层默认值。这三层每一层单独看都讲得通，但叠在一起就把用户钉死在「看不见」上。

打开 `src/utils/betas.ts:264-277`，里面有一段直接写在源码里的解释：

```ts
// Skip the API-side Haiku thinking summarizer — the summary is only used
// for ctrl+o display, which interactive users rarely open. The API returns
// redacted_thinking blocks instead; AssistantRedactedThinkingMessage already
// renders those as a stub. SDK / print-mode keep summaries because callers
// may iterate over thinking content. Users can opt back in via settings.json
// showThinkingSummaries.
if (
  includeFirstPartyOnlyBetas &&
  modelSupportsISP(model) &&
  !getIsNonInteractiveSession() &&
  getInitialSettings().showThinkingSummaries !== true
) {
  betaHeaders.push(REDACT_THINKING_BETA_HEADER)
}
```

注释的承重句是 _「the summary is only used for ctrl+o display, which interactive users rarely open」_——这条 summary 的唯一用途就是 ctrl+o 视图，而交互式用户很少打开它。这是写代码的人的认知。但 issue 里的 81 楼评论恰好在反驳这条认知：用户不是不打开 ctrl+o，是不能 _在生成过程中_ 用 ctrl+o，因为 ctrl+o 切到的是 transcript 模式，是事后查看，而 steering 要的是 _实时_。把信号塞进一个事后视图，等于把方向盘装在后视镜上。

这是第一层默认值——服务端给 1P 用户加 `redact-thinking-2026-02-12` beta header，让 API 直接吞掉思考摘要。常量定义在 `src/constants/betas.ts:20`，原文是 `export const REDACT_THINKING_BETA_HEADER = 'redact-thinking-2026-02-12'`。

![三层默认值架构](01_三层默认值.png)

第二层在 `src/services/api/claude.ts:1599-1629`，是构造 API 请求体的部分：

```ts
let thinking: BetaMessageStreamParams['thinking'] | undefined = undefined

if (hasThinking && modelSupportsThinking(options.model)) {
  if (
    !isEnvTruthy(process.env.CLAUDE_CODE_DISABLE_ADAPTIVE_THINKING) &&
    modelSupportsAdaptiveThinking(options.model)
  ) {
    thinking = {
      type: 'adaptive',
    } satisfies BetaMessageStreamParams['thinking']
  } else {
    let thinkingBudget = getMaxThinkingTokensForModel(options.model)
    ...
    thinking = {
      budget_tokens: thinkingBudget,
      type: 'enabled',
    } satisfies BetaMessageStreamParams['thinking']
  }
}
```

注意请求体里 `thinking` 只有 `type` 和 `budget_tokens`，**没有 `display` 字段**。这意味着 display 完全靠服务端默认值。Opus 4.5 时代服务端默认是 `summarized`，所以即使客户端不传，思考链也会回来；Opus 4.7 时代服务端默认改成了 `omitted`，于是同一段代码同一个请求体，行为就翻了。客户端没出 bug，只是它的「不传」从「靠服务端默认拿到」变成「靠服务端默认丢掉」。

第三层叠在这两层之上，是 `betas.ts:273` 那个看起来无关的小条件：`!getIsNonInteractiveSession()`。它说，REDACT 这个 header 只有在 _交互式_ 会话里才会加。所以 SDK 调用、`-p` 模式、VS Code 扩展底层走的非交互式入口理论上应该不受影响。

但 issue 里 anthrotype 在 v2.1.118 反编译之后发现的 `S8()` gate 恰好是这条逻辑的反向：

```js
function S8(){ return !x_.isInteractive }
...
if (H5.type !== "disabled") {
  if (w.thinkingDisplay === "summarized" || w.thinkingDisplay === "omitted")
    H5.display = w.thinkingDisplay;
  else if (!S8() && u8().showThinkingSummaries === true)
    H5.display = "summarized";
}
```

`!S8()` 等价于 `isInteractive`。这段代码说：只有在交互式模式里，`showThinkingSummaries=true` 才会把 display 强制设为 `summarized`。SDK、`-p`、VS Code 这些非交互式调用即使打开了设置也拿不到摘要——因为这层 if 不进。

三层默认值的合成效果是这样的：
- 交互式 + 默认设置 → server-side redact + client 不传 display → 拿到空 thinking 块 → UI 渲染 `∴ Thinking <Ctrl+O to expand>` 一个 pill。
- 交互式 + `showThinkingSummaries: true` → 不加 REDACT header，client 在 117 之后会传 display=summarized → 拿到 summary → 但 UI 还是默认折叠到 Ctrl+O 后面。
- 非交互式（VS Code、SDK、`-p`）+ `showThinkingSummaries: true` → 不加 REDACT header，但 client _不会_ 传 display=summarized（被 `!S8()` gate 掉了）→ 拿到空 thinking 块 → 还是看不见。

每一层单独看都有它的工程理由（少传一个废 token、保留 SDK 调用者的灵活性、避免转录视图被太多内容淹没），合起来就是一个不传 display、依赖服务端默认、又把服务端默认从 summarized 改成 omitted 的故事。

## 「ctrl+o 用户很少打开」是一个错误的承重假设

`AssistantThinkingMessage.tsx` 是 UI 端最直接的证据。整个组件 85 行，把核心决策写得很清楚（`src/components/messages/AssistantThinkingMessage.tsx:33-58`）：

```tsx
if (!thinking) {
  return null;
}
if (hideInTranscript) {
  return null;
}
const shouldShowFullThinking = isTranscriptMode || verbose;
if (!shouldShowFullThinking) {
  return (
    <Box marginTop={addMargin ? 1 : 0}>
      <Text dimColor italic>
        {label} <CtrlOToExpand />
      </Text>
    </Box>
  );
}
return (
  <Box flexDirection="column" gap={1} marginTop={addMargin ? 1 : 0} width="100%">
    <Text dimColor italic>{label}…</Text>
    <Box paddingLeft={2}>
      <Markdown dimColor>{thinking}</Markdown>
    </Box>
  </Box>
);
```

第一行 `if (!thinking) return null` 解释了用户看到的「pill 但点开是空」——服务端返回了 thinking 块但 thinking 字段是空字符串，整个组件直接渲染 null。这就是为什么 hifihedgehog 强调「`showThinkingSummaries` 在 Opus 4.7 上 _静默地_ 坏掉了」：设置打开了，beta header 也对了，但服务端不再主动给 summary。

第六行 `const shouldShowFullThinking = isTranscriptMode || verbose` 是另一处假设。它把「显示完整思考」绑定在两个开关上——transcript 模式（ctrl+o）和 verbose flag。`CtrlOToExpand` 组件在 `src/components/CtrlOToExpand.tsx:29-46` 里，渲染的是一个 dim italic 的「(ctrl+o to expand)」提示。

提示挂在 thinking 块上，挂在 FileWriteTool 的 +5 lines 后面，挂在 Grep 的 count 后面，挂在 AgentTool 隐藏的子调用后面。整个 Claude Code 的输出哲学是「先折叠、再展开」——节省屏幕、让长 session 可滚——只是这个哲学把 thinking 也收进了「应该折叠」的桶里。

提示的潜台词是：你想看就按 ctrl+o，但只能事后看。`useShortcutDisplay('app:toggleTranscript', ...)` 命名也透露了态度：这是一个 _toggleTranscript_，是把整个会话切到「滚动浏览历史记录」的模式，不是「展开此处的思考块」。两件事不一样。事后查看不能用来 steer 模型；steer 需要 _正在生成的同时_ 看到。

## 用户自救工具链

issue 里被 +1 最多的几条不是抱怨，是工作流。把它们按代价从低到高排：

**Workaround A：UI 切换中段开关**（betovildoza）。在 VS Code 扩展里发消息前把右侧 thinking 开关关掉，等回复结束，再把左侧开关打开，下一回合开始 thinking 就内联展开。完全 UI 操作，不动 settings.json。代价：依赖一个本身有 bug 的开关（[#49739](https://github.com/anthropics/claude-code/issues/49739) ——开关无视觉反馈、状态不持久、滑到错的一侧）。

**Workaround B：env var 注入 extraBody**：

```json
{
  "env": {
    "CLAUDE_CODE_EXTRA_BODY": "{\"thinking\":{\"type\":\"adaptive\",\"display\":\"summarized\"}}"
  }
}
```

代价更高：这是进程级的，会被所有子 agent 调用继承。Haiku 4.5 不支持 `type: adaptive`，子 agent 一启动就 400 `adaptive thinking is not supported on this model`。多 agent 编排者用这个 workaround 等于自废武功——能看见 thinking 就不能 delegate，能 delegate 就看不见 thinking。

**Workaround C：CLI flag** `--thinking-display summarized`。jmac122 在 v2.1.117+ 反复测试后写：「这个 flag 在 117+ 实际上 _干扰_ 设置驱动的行为，会让 thinking 块返回空。我花了几小时 debug，flag 单独用看似工作，但跟 `showThinkingSummaries=true` 同时用会破坏 setting 的代码路径。设置单用，flag 别加。」一个文档上看起来正交的开关，实际是互相破坏的。

**Workaround D：binary patch**。最硬核也最普遍。jmac122 把 Windows 上的具体步骤写完整了（v2.1.123，Opus 4.7，Max 订阅）：

```python
# Patch 1: 短路 thinking guard
data = data.replace(b'if(!j&&!f)return null', b'if(!1&&!f)return null')

# Patch 2: 把 createElement 的两个 props 强制成 true
data = data.replace(
    b'isTranscriptMode:j,verbose:f,hideInTranscript:',
    b'isTranscriptMode:1,verbose:1,hideInTranscript:'
)
assert len(data) == orig_len, 'byte length changed!'
```

铁律是字节长度必须保持不变，否则 Bun 装载二进制会 TypeError。而且 minify 后的变量名每个版本都变（v2.1.101–116 是 `j` 和 `A`，v2.1.123 是 `j` 和 `f`），所以每次更新都要重新找变量名重新打 patch。a-connoisseur 干脆开了一个 [patch-claude-code](https://github.com/a-connoisseur/patch-claude-code) 仓库，用 GitHub Actions 给每个新 release 自动重打 patch。

这套工具链不是技术爱好者的玩具。它是付费用户在用这种方式做产品反馈——issue 提了几个月没动，那就自己改。

![用户工具链谱系](02_用户工具链谱系.png)

## 看不见思考的二阶代价

把这件事单纯当 UX 退步来分析就低估了它。它影响的是开发者的几个具体动作：

**捕获前提偏差**。模型经常读漏 prompt 的某个约束，或者把一段被截断的代码当成完整的，然后基于错误前提推理几个回合。jmac122 的原话是「我经常逮到模型在思考里走进死胡同，及时纠正之前已经烧了几千个 token」。前提偏差只能在思考阶段抓到，工具调用阶段太晚——错误的工具调用是错误前提的下游结果。

**验证 CLAUDE.md 内化**。你在项目里写了一份 CLAUDE.md，要求模型遵守 X、Y、Z。模型有没有真的把这些规则纳入推理，还是只是表面上「收到」了？只有看思考链才能验证。看不到的话，你只能靠最终行为反推，而最终行为可能因为别的原因恰好满足约束，给你一个假阳性的「它懂了」。

**Audit assumption**。计划长任务之前，模型会列假设。把这些假设亮出来，开发者可以在 commit 之前就 challenge 掉错的——这是「Plan Mode」存在的意义。但 Plan Mode 只在显式触发的时候打开，日常 turn 里的 implicit assumptions 全在思考链里。

`shouldEnableThinkingByDefault()` 这个函数在 `src/utils/thinking.ts:146-162`，里面有一条 IMPORTANT 注释：

```ts
// IMPORTANT: Do not change default thinking enabled value without notifying
// the model launch DRI and research. This can greatly affect model quality and
// bashing.

// Enable thinking by default unless explicitly disabled.
return true
```

更上面一点的 `modelSupportsAdaptiveThinking()`（同文件 line 137-144）写：「4.6+ 的模型 _必须_ 启用 adaptive thinking，DO NOT default to false for first party，否则会 _silently degrade model quality_。」

代码里反复出现这两个判断：思考默认开、模型质量依赖思考。但「思考开」和「思考可见」是两件不同的事——前者影响模型自己的推理，后者影响人对模型的 steering。Anthropic 选择保留前者、悄悄关掉后者。把这个选择和 `betas.ts:264` 那段 `// the summary is only used for ctrl+o display, which interactive users rarely open` 的注释放在一起读，意图就清晰了：思考链是模型质量的承重梁，但不是用户体验的承重梁——所以让它在背后跑，但不要默认显示。

这个假设的错误程度，issue 的 81 楼评论已经回答了。

## 反蒸馏：浮在水面下的动机

楼里 AndASM 把猜测说在明面上：「他们看起来在防止别人拿他们的模型做训练源。模型本身在收敛、在 plateau，他们越来越用阴险的手法防止系统被理解。」

这个解读不是空穴来风。源码里有另一段 POC 在 `src/utils/betas.ts:279-298`：

```ts
// POC: server-side connector-text summarization (anti-distillation). The
// API buffers assistant text between tool calls, summarizes it, and returns
// the summary with a signature so the original can be restored on subsequent
// turns — same mechanism as thinking blocks. Ant-only while we measure
// TTFT/TTLT/capacity; betas already flow to tengu_api_success for splitting.
// Backend independently requires Capability.ANTHROPIC_INTERNAL_RESEARCH.
```

注释直接写了「anti-distillation」。机制描述也直白：API 把工具调用之间的助手文本 buffer 起来、做摘要、带签名返回，跟 thinking 块「同样的机制」（_same mechanism as thinking blocks_）。这是连工具调用之间的常规助手输出都要走「摘要-签名-下一轮恢复」流程，避免完整原文流到客户端。

如果 connector-text 这块的反蒸馏理由直接写在源码里，那 thinking 块的同款机制是不是也是同款理由？源码没有显式承认。但当你把「服务端默认 omitted」「客户端不传 display」「UI 默认折叠」「文档说默认 false」这四件事叠起来看，最有解释力的假设就是：thinking 是模型最有价值的训练源——它包含了完整的推理链，而不是裁剪过的最终答案——把它从付费用户的客户端默认拿走，是降低被蒸馏成本的一种 attrition 策略。

jmac122 反驳得也很硬：「真要蒸馏的人不会通过 Max 订阅做。他们会用 OpenRouter 或 Cursor 当中间人，把流量混在普通 API 调用里。这种 defensive design 不影响真敌人，只影响付费用户。」

这两套解释不互斥。可以同时是「降低蒸馏成本」+「把代价转嫁给个人付费用户而对企业/API 客户开放更多 display 控制」。事实上 hifihedgehog 在评论里指出 [`platform.claude.com/docs/en/about-claude/models/migration-guide#migrating-to-claude-opus-4-7`](https://platform.claude.com/docs/en/about-claude/models/migration-guide) 上 API 端就承认了 Opus 4.7 的默认值变更——API 直接调用方有文档可查，但 Claude Code 自家的 settings.json 文档却没跟上。

## 盲区

源码读到这个程度也还是有几个我不知道的。

第一，`getIsNonInteractiveSession()` 那道 gate 到底是 _设计_ 还是 _漏洞_。把非交互调用排除在 REDACT 之外、又把非交互调用排除在 client-side display upgrade 之外，这两件事如果是同一个工程师设计的，意图大概是「让 SDK 用户自己决定」；如果是不同时间不同工程师加的，那就是没人审 cross-cutting 行为，导致 VS Code 扩展恰好掉进交集为空的坑里。issue 里 hifihedgehog 提的 9 个 related issue（#49268、#49757、#49902、#49322、#48065、#49739、#30958、#51131、#33163）都指向同一个根因，说明内部至少没人把这些串成一条线修。

第二，patch-claude-code 这个第三方仓库的存在合法性。它每个 release 都在 patch Anthropic 的二进制。Anthropic 的服务条款是不是允许这种修改、修改后的 binary 是不是仍然能正常 OAuth、Max 订阅会不会因为请求里的 thinking 块结构异常而被风控——issue 里没人讨论。a-connoisseur 把仓库挂出来了，没人投诉也没人下架，但这不等于「被默许」。

第三，最关键的——这个默认值未来会不会改回去。issue 是 enhancement 标签，没有 Anthropic 员工回复。9 个 related issue 也都还 open。81 楼之后还在涨。如果默认值不改、`showThinkingSummaries` 不在 Opus 4.7+ 上被正确实现、CLI flag 跟 setting 互相干扰的 bug 不修——那这个 issue 会变成 Claude Code 第一个由用户社区维护 binary patch 来 routinely overwrite 的官方默认值。这种事一旦成立，会改变用户对 Claude Code 的信任 model：付费产品的默认值是可信的 → 付费产品的默认值需要在论坛里找 workaround 才能用。

## 对 AI 从业者意味着什么

如果你在用 Claude Code 做日常开发，下面这几件事这周就该做：

**确认你看到的是真思考还是 pill**。打开 `~/.claude/settings.json`，添加 `"showThinkingSummaries": true`。然后 v2.1.117 之后 _不要_ 加 `--thinking-display summarized` 这个 CLI flag——它会跟设置互相破坏。如果你在 VS Code 扩展里用 Opus 4.7、设置打开了但还是看不到 thinking 内容，那你撞到的是 `!getIsNonInteractiveSession()` gate，目前没有官方解。

**别用 env var workaround 来跑 subagent**。`CLAUDE_CODE_EXTRA_BODY` 是 process-wide 的，会让 Haiku subagent 和不支持 adaptive thinking 的 model 全 400。多 agent 编排场景里这个 workaround 是负优化。

**如果你的工作 _依赖_ steering**——比如做 model evaluation、prompt 工程、长任务调试——认真考虑要不要切回 Opus 4.5 或者用 patch-claude-code 这类第三方分支。直接用官方默认会让你失去 catch-error-early 的能力，而这个能力在 token-burn 视角下经常比模型本身的能力更值钱。

**如果你在为自家产品做类似设计**：注意「Anthropic 的注释假设错了」这个教训。「ctrl+o display, which interactive users rarely open」是一个看起来合理的 telemetry-driven 判断——大概率后台数据真的显示 ctrl+o 打开率低。但用户不打开 ctrl+o，是因为 ctrl+o 是事后视图，不是因为他们不关心思考。把信号塞进事后视图、再用「事后视图打开率低」来证明信号没人要——这是一个完美的循环 confirm。下次你的产品默认值是基于「打开率低」做的决策，先问自己：这个低打开率是因为没人要这个东西，还是因为通向它的路径本身被设计成了「事后」。

## 本期关键词

- **adaptive thinking** —— Claude API 自 Opus 4.6 引入的思考模式。请求体里写 `thinking: { type: "adaptive" }`，模型自己决定要不要思考、思考多长。`type: "enabled"` 配 `budget_tokens` 是上一代的固定预算模式。Claude Code 在 4.6+ 默认走 adaptive。

- **display: summarized vs omitted** —— API 响应里 thinking 块的 _可见性_ 维度，跟「思考是否启用」是正交的两件事。Opus 4.5 默认 summarized（思考摘要回来），Opus 4.7 默认 omitted（响应里有 thinking 块但 thinking 字段是空字符串）。Claude Code 请求体不传这个字段，靠服务端默认，于是模型升级悄悄改变了客户端行为。

- **redact-thinking beta header** —— `redact-thinking-2026-02-12`，Claude Code 默认加在 1P 请求上的 beta header，告诉 API 不要返回 thinking 摘要。常量定义在 `src/constants/betas.ts:20`。`showThinkingSummaries: true` 的设置作用是 _不加_ 这个 header。

- **steering loop** —— 操舵循环。开发者一边看模型思考一边介入纠正的工作流。它的承重前提是「思考可见」+「实时」。把思考藏到 ctrl+o 等于把方向盘装到后视镜上。

- **anti-distillation** —— 反蒸馏。防止其他模型厂商或个人通过调用 API、收集 in/out 数据来训练自己的模型。源码里 `src/utils/betas.ts:279` 的 connector-text summarization POC 直接以这个为名。

- **CLAUDE_CODE_EXTRA_BODY** —— 一个进程级的环境变量，允许往每个 API 请求注入额外字段。是用户绕过「不传 display」最常用的 workaround，代价是 process-wide 生效，会把 Haiku subagent 一起搞挂。

## 引用

1. [Add Option to Always Show Claude's Thinking · Issue #8477](https://github.com/anthropics/claude-code/issues/8477) —— 原 issue，janbam 起头，81 楼评论。
2. [Migrating to Claude Opus 4.7 · Anthropic Docs](https://platform.claude.com/docs/en/about-claude/models/migration-guide#migrating-to-claude-opus-4-7) —— API 端的迁移指南，承认了 4.7 默认值变更。
3. [a-connoisseur/patch-claude-code](https://github.com/a-connoisseur/patch-claude-code) —— 第三方 binary patch 仓库，GitHub Actions 自动跟随 release。
4. `raw/claudecodesources/raw_code/claude-code/src/constants/betas.ts:20` —— `REDACT_THINKING_BETA_HEADER` 常量定义。
5. `raw/claudecodesources/raw_code/claude-code/src/utils/betas.ts:264-277` —— 默认加 REDACT header 的逻辑及注释（「ctrl+o display, which interactive users rarely open」）。
6. `raw/claudecodesources/raw_code/claude-code/src/utils/betas.ts:279-298` —— connector-text summarization 反蒸馏 POC，注释直接写明 anti-distillation。
7. `raw/claudecodesources/raw_code/claude-code/src/services/api/claude.ts:1599-1629` —— 构造请求体，thinking 字段只有 type + budget_tokens，无 display。
8. `raw/claudecodesources/raw_code/claude-code/src/components/messages/AssistantThinkingMessage.tsx:33-58` —— 思考块 UI 渲染逻辑，空 thinking 返回 null，非 transcript 模式渲染 `∴ Thinking <CtrlOToExpand />` pill。
9. `raw/claudecodesources/raw_code/claude-code/src/utils/thinking.ts:113-162` —— 思考开关默认值的两个函数，`modelSupportsAdaptiveThinking` 和 `shouldEnableThinkingByDefault`，注释强调「do not silently degrade model quality」。
10. `raw/claudecodesources/raw_code/claude-code/src/utils/settings/types.ts:956-961` —— `showThinkingSummaries` setting 的 schema 描述，明文写着「ctrl+o」。
