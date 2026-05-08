---
title: "Undercover Mode：Anthropic 员工的隐身衣"
source: "Claude Code v2.1.88 泄露源码"
author: Claude Code 源码拆解系列
date: 2026-03-31
decoded: 2026-04-07
tags: [AI产品, 开源伦理, Claude Code源码, AI归属, 合规]
series: Claude Code 源码深度拆解
series_index: 6
---

"93% 3-shotted by claude-opus-4-5, 2 memories recalled."

这行字出现在 Anthropic 内部仓库的 PR 描述里。翻译一下：这个 PR 里 93% 的代码是 Claude 写的，人类只提了 3 次需求，AI 还调用了 2 次记忆。

但你永远不会在任何公开仓库里看到这行字。

因为在公开仓库里，它被一个叫 Undercover Mode 的系统自动抹掉了。不只抹掉归属信息——连"我是 AI"这个事实本身都不允许出现。Commit message 不能写 "Claude Code"，不能有 Co-Authored-By，不能提内部模型代号，不能暴露任何 Anthropic 内部信息。源码里的提示词用了一个词：CRITICAL。

这个系统的源码注释里有一句话比任何功能描述都更有信息量：

> "There is NO force-OFF."

没有强制关闭选项。无法确认是内部仓库时，默认隐身。这是源码里极少见的单向开关设计。

## 一套源码，两张面孔

Undercover Mode 藏在 `src/utils/undercover.ts` 里，总共不到 90 行。但它牵出来的东西远超 90 行代码的重量。

先说它做了什么。当 Anthropic 员工（构建时通过 `USER_TYPE=ant` 标识）在公共或开源仓库工作时，系统自动注入一段 CRITICAL 级别的提示词：

> "You are operating UNDERCOVER in a PUBLIC/OPEN-SOURCE repository. Your commit messages, PR titles, and PR bodies MUST NOT contain ANY Anthropic-internal information. Do not blow your cover."

![五层纵深防御](material/pngs/01_五层纵深防御.png)

"Do not blow your cover." 措辞像间谍小说。但如果你往下看具体禁止的内容，就明白为什么要这么严：

- 内部模型代号（Capybara、Tengu 这些动物名）
- 未发布的版本号（opus-4-7、sonnet-4-8）
- 内部仓库和项目名（claude-cli-internal）
- 内部工具、Slack 频道、短链接（go/cc、#claude-code-…）
- "Claude Code" 这个词本身
- 任何暗示自己是 AI 的内容
- Co-Authored-By 或任何归属信息

提示词还给了正反示例。正确的 commit message："Fix race condition in file watcher initialization"。错误的："Fix bug found while testing with Claude Capybara"、"1-shotted by claude-opus-4-6"。

## 安全默认值：不确定就隐身

Undercover Mode 的激活逻辑只有 10 行代码，但设计哲学非常清晰。

系统先检查当前仓库的 remote URL，和一个内部仓库白名单比对。白名单列了 21 个 Anthropic 私有仓库——`claude-cli-internal`、`casino`、`labs`、`mobile-apps`、`terraform-config`、`forge-web` 等等。

关键细节：`anthropics/claude-code` 这个仓库是公开的，所以它不在白名单上。Anthropic 员工在自家产品的公开仓库工作时，Undercover Mode 也是启用的。

源码注释解释了为什么不做组织级别的检查：

> "The anthropics and anthropic-experimental orgs contain PUBLIC repos (e.g. anthropics/claude-code, anthropic-experimental/sandbox-runtime). Undercover mode must stay ON in those to prevent codename leaks. Only add repos here that are confirmed PRIVATE."

不是 "Anthropic 的仓库就是内部的"。只有逐个确认为私有的仓库才放行。这是白名单逻辑（明确允许的才放行），不是黑名单逻辑（明确禁止的才拦截）。

再看构建时的处理。`USER_TYPE` 是编译时 `--define` 注入的常量。在面向外部用户的构建中，Bun 的编译器把所有 `process.env.USER_TYPE === 'ant'` 判断为 false，整个 undercover.ts 的代码被死代码消除——物理上从最终 npm 包里删除。外部用户的 Claude Code 里根本不存在这些代码。

五层纵深防御：

1. **构建时**：外部构建物理删除代码
2. **运行时**：`USER_TYPE` 检查
3. **仓库层**：白名单比对
4. **提示词层**：注入 CRITICAL 指令
5. **输出层**：归属信息返回空字符串

## 21 个仓库背后的 Anthropic

内部仓库白名单本身就是一份有趣的情报。21 个仓库名揭示了 Anthropic 的技术组织结构：

![内部仓库白名单](material/pngs/03_内部仓库白名单.png)

- `claude-cli-internal`：Claude Code 的内部版本，和公开版是分开的仓库
- `casino`：赌场？更可能是某种内部 A/B 测试或实验平台
- `labs`：研究实验室的代码
- `mobile-apps`：Anthropic 在做移动端应用
- `terraform-config`、`infra-manifests`、`mycro_manifests`：基础设施即代码，说明他们用 Terraform + 自研微服务平台
- `forge-web`：Web 版产品的仓库
- `ts-tools`、`ts-capsules`：TypeScript 工具链和封装层
- `feldspar-testing`：测试框架
- `claude-for-hiring`：用 Claude 辅助招聘
- `starling-configs`、`argo-rollouts`：部署配置和渐进式发布
- `dotfiles`：连员工的 dotfiles 都有共享仓库
- `hex-export`、`dbt`：数据相关

一家 AI 公司的核心代码库，加上数据平台、基础设施、移动端、招聘工具、测试框架、员工开发环境配置——这不是一个初创团队的架构，是一个正在快速机构化的组织。

而且所有这些仓库里，Claude Code 的 Co-Authored-By 归属信息是启用的。他们在内部完全不隐藏 AI 的参与——甚至在量化它。

## 字符级贡献度追踪

这是整个 Undercover Mode 故事里最容易被忽略、但信息量最大的部分。

源码里有一套完整的代码归属追踪系统（`attribution.ts` + `commitAttribution.ts`），精确到每个文件的每次编辑。

工作原理：每次 Claude 通过 Edit 或 Write 工具修改文件，系统计算修改区域的字符数（不是简单的新旧长度差——它用前缀/后缀匹配找到精确的修改区域，处理同长度替换的边界情况）。每个文件累积 `claudeContribution` 字符数。

到 commit 或 PR 的时候，系统汇总所有被修改文件的 Claude 贡献 vs 人类贡献，算出百分比，再加上 N-shot 计数（人类发了几次提示）和记忆调用次数，生成一行增强归属信息：

```
🤖 Generated with Claude Code (93% 3-shotted by claude-opus-4-5, 2 memories recalled)
```

这行字只在内部仓库出现。Undercover Mode 启用时，`getAttributionTexts()` 和 `getEnhancedPRAttribution()` 都返回空字符串。

还有一个细节：模型名会被"消毒"。`sanitizeModelName()` 函数把内部变体映射到公开名称。如果遇到无法识别的模型名（可能是未发布的新模型），fallback 到 `'claude'`——连 "我不认识这个模型所以原样输出" 都不允许，因为那可能泄露代号。

![隐身 vs 标注的矛盾](material/pngs/02_归属悖论.png)

## 归属悖论

同一套源码，同一个公司，同时在做两件看起来矛盾的事：

一方面，Undercover Mode 主动抹掉所有 AI 参与的痕迹。另一方面，字符级归属追踪系统精确记录 AI 写了多少代码、人类干预了几次、调用了几次记忆。

这不矛盾。这是在为两个不同的未来同时做准备。

**隐身的逻辑**：保护商业机密（模型代号、内部架构），防止竞品情报，回避开源社区对 AI 贡献的争议。这是解决今天的问题。

**追踪的逻辑**：EU AI Act 第 50 条要求 2026 年 8 月 2 日起标注 AI 生成内容。California AI Transparency Act 2026 年 1 月已生效。FTC 2026 年 3 月更新了 AI 生成内容披露要求。合规需要的不是"AI 参与了"这个笼统声明，是"AI 贡献了 93%"这种可审计数据。

Anthropic 的字符级追踪系统，看起来像内部工具，实际上是合规基础设施。当法规要求你证明"AI 写了多少代码"的时候，你需要的就是这种精度的数据。

行业数据佐证了这个判断：2026 年 AI 代码的行业均值已经达到提交行数的 15-25%，头部团队 40-60%。当 AI 贡献从 "辅助" 变成 "主力"，归属追踪从 "nice-to-have" 变成 "must-have"。

## 开源社区的争议

Undercover Mode 在开源社区引发的争论远比技术问题复杂。

核心矛盾是 DCO（Developer Certificate of Origin，开发者来源证书）。很多开源项目要求贡献者签署 DCO，证明提交的代码是自己写的（或有权提交）。AI 隐身提交绕过了这个机制——提交者签了 DCO，但代码实际上是 AI 生成的。

各项目的应对方式分化明显。QEMU 直接禁止 AI 生成的贡献。Fedora 走另一个方向：允许 AI 参与，但要求用 "Assisted-by:" 标签明确标注。大部分项目还没有正式政策。

GitHub Copilot 保留 Co-Authored-By 归属信息。Anthropic 主动抹掉。在主流 AI 编程工具中，这是唯一一个。

Hacker News 上有一条评论切中了要害：

> "This very much sounds like it does what it says on the tin, i.e. stays undercover and pretends to be a human."

也有人反驳：Undercover Mode 的主要目的是保护商业机密（模型代号、内部工具链），不是隐藏 AI 参与本身。这两种解读都有源码支持——提示词里既禁止泄露内部信息，也禁止提及 "Claude Code" 和 "any mention that you are an AI"。

## 对 AI 从业者意味着什么

Undercover Mode 揭示的核心判断：**AI 归属不是一个技术问题，是一个治理问题，而且窗口期正在关闭。**

具体到可执行的建议：

**做 AI 编程工具的**：现在就建归属追踪系统。不是 PR 描述里加一行 "Generated by AI"，是字符级的贡献度记录。EU AI Act 8 月 2 日生效后，这会从差异化功能变成合规门槛。Anthropic 的 `commitAttribution.ts` 是目前公开的最完整的参考实现。

**开源项目维护者**：需要明确 AI 贡献政策。不表态不代表问题不存在——你的仓库里可能已经有大量 AI 生成的代码，只是没有被标注。参考 Fedora 的 "Assisted-by:" 方案比 QEMU 的全面禁止更务实。

**企业合规负责人**：EU AI Act + California AI Transparency Act + FTC guidance 三线收紧。如果你的工程团队在用 AI 编程工具，你需要知道 AI 贡献了多少代码。Anthropic 内部已经在追踪这个数据了——你呢？

---

## 本期关键词

**Undercover Mode（隐身模式）** -- Claude Code 源码中的一个子系统，当 Anthropic 员工在公共仓库工作时自动激活。抹掉所有 AI 归属信息，注入 CRITICAL 级指令禁止暴露 AI 身份。外部用户的构建中这段代码被物理删除。

**DCO（Developer Certificate of Origin）** -- 开源社区常用的贡献者证书，要求提交者证明代码是自己写的或有权提交。AI 隐身提交与 DCO 机制存在潜在冲突，因为签署者实际上提交了 AI 生成的代码。

**Co-Authored-By** -- Git commit message 中标注共同作者的约定格式。大部分 AI 编程工具保留这个标注，Undercover Mode 下 Claude Code 主动移除。

**Feature Flag 死代码消除** -- Bun 编译器在构建时把 `feature()` 调用求值为常量，未启用的功能分支被完全删除。Undercover Mode 在外部构建中不是"关闭"，是"不存在"——连代码本身都被物理移除。

**Attribution Tracking（归属追踪）** -- Claude Code 内置的字符级代码贡献追踪系统。记录每个文件中 AI 写了多少字符 vs 人类写了多少字符，在 PR 中生成增强归属信息（百分比 + N-shot + 记忆调用次数）。

**EU AI Act Article 50** -- 欧盟 AI 法案第 50 条，要求 AI 生成内容必须明确标注。适用日期 2026 年 8 月 2 日。欧盟委员会正在制定配套的标注实践准则（Code of Practice），预计 2026 年 6 月定稿。

## 原文关键引用

> "There is NO force-OFF. This guards against model codename leaks — if we're not confident we're in an internal repo, we stay undercover."（没有强制关闭选项。这是为了防止模型代号泄露——如果无法确认是内部仓库，就保持隐身。）-- Claude Code 源码，undercover.ts 注释

> "You are operating UNDERCOVER in a PUBLIC/OPEN-SOURCE repository. Do not blow your cover."（你正在公共/开源仓库中隐身操作。不要暴露身份。）-- Claude Code 源码，undercover.ts:getUndercoverInstructions()

> "The anthropics and anthropic-experimental orgs contain PUBLIC repos. Undercover mode must stay ON in those to prevent codename leaks."（anthropics 组织包含公共仓库。这些仓库里 Undercover Mode 必须保持启用以防代号泄露。）-- Claude Code 源码，commitAttribution.ts 注释

> "Actively stripping those signals, specifically from public open-source repositories, puts Claude Code in a different category."（主动从公共开源仓库中剥离这些信号，让 Claude Code 进入了一个不同的类别。）-- WaveSpeed AI 分析

## 引用

1. Claude Code v2.1.88 泄露源码（TypeScript）-- 本期拆解的一手素材
2. [Here's what that Claude Code source leak reveals about Anthropic's plans](https://arstechnica.com/ai/2026/04/heres-what-that-claude-code-source-leak-reveals-about-anthropics-plans/) -- Ars Technica 报道
3. [Claude Code Undercover Mode: What the Leaked Source Actually Shows](https://wavespeed.ai/blog/posts/claude-code-undercover-mode-leaked-source/) -- WaveSpeed 深度分析，含 DCO/Fedora/QEMU 对比
4. [HN 讨论：Undercover Mode 解读争议](https://news.ycombinator.com/item?id=47591989) -- 开发者社区观点碰撞
5. [EU AI Act Article 50 标注义务](https://pandectes.io/blog/labeling-ai-generated-content-what-the-new-rules-require/) -- 2026 年 8 月 2 日生效
6. [AI Code Share: What Percentage of Your Code Is AI-Generated?](https://larridin.com/developer-productivity-hub/ai-code-share-percentage-ai-generated) -- 2026 年 AI 代码占比行业数据
7. [EU Commission Code of Practice on Marking AI-generated Content](https://digital-strategy.ec.europa.eu/en/library/commission-publishes-second-draft-code-practice-marking-and-labelling-ai-generated-content) -- EU 标注实践准则第二稿
