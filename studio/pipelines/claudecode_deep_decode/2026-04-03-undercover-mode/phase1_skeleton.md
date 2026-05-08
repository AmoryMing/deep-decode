# Phase 1: 结构解剖 -- Undercover Mode：Anthropic 员工的隐身衣

## 1. 核心论点（一句话）

Undercover Mode 不是一个隐私功能，是 Anthropic 在"AI 应该隐身还是标注"这道题上给出的工程答案——而这个答案暴露了一个更深的矛盾：同一套源码里，既有抹掉 AI 身份的隐身衣，也有精确到字符级的 AI 贡献度追踪系统。

## 2. 隐含假设

- **假设1：AI 参与开源贡献是事实。** Anthropic 员工用 Claude Code 向公共仓库提交代码，而且提交量大到需要建一套自动化系统来管理归属信息。
- **假设2：暴露 AI 身份有实际风险。** 不只是面子问题——内部模型代号、未发布版本号、Slack 频道名、短链接，任何一个泄露都可能被竞品情报利用。
- **假设3：安全默认值必须是"隐身"。** 源码注释写死了 "There is NO force-OFF"。无法确认是内部仓库时，默认隐身。宁可过度保护，不冒泄露风险。
- **假设4：AI 归属标注是未来的合规要求。** 源码里同时存在一套字符级贡献度追踪系统（claudePercent、N-shotted、memory recalled），这不是给用户看的，是给合规审计准备的。

## 3. 关键证据

### 证据1：源码注释 "There is NO force-OFF"
undercover.ts 第 17 行，注释明确写着没有强制关闭选项。安全默认值是 ON。这是一个罕见的工程决策——大多数 feature flag 都有 force-on 和 force-off 两个方向。Undercover Mode 只有 force-on。

### 证据2：21 个内部仓库白名单
commitAttribution.ts 列出了 21 个 Anthropic 私有仓库（claude-cli-internal、casino、labs、mobile-apps 等）。关键细节：anthropics/claude-code（公共仓库）不在白名单上，所以 Anthropic 员工在自家公共仓库工作时，Undercover Mode 也是启用的。

### 证据3：字符级 AI 贡献度追踪
attribution.ts 实现了一套完整的代码归属追踪系统。每次 Claude 编辑文件，系统记录 claude 写了多少字符、人类写了多少字符，算出百分比，在 PR 描述里生成 "93% 3-shotted by claude-opus-4-5, 2 memories recalled"。这套系统只在内部仓库启用——Undercover Mode 下它返回空字符串。

## 4. 盲区

- **开源伦理争议**：DCO（Developer Certificate of Origin）要求贡献者证明代码是自己的。AI 隐身提交绕过了这个机制。
- **EU AI Act 冲突**：2026年8月2日起 EU 要求标注 AI 生成内容。Undercover Mode 与这个方向直接矛盾。
- **竞品对比**：GitHub Copilot 保留 Co-Authored-By，Anthropic 主动抹掉——这是行业里唯一一个。

## 5. 读者画像

- AI 产品 PM：理解 AI 归属的产品设计决策
- 开源社区维护者：评估 AI 贡献的治理风险
- 合规/法务：EU AI Act 合规准备

## 6. 可视化规划

| 图序 | 概念 | 形式 |
|------|------|------|
| 封面 | Undercover Mode 隐身衣 | 系列封面 |
| 01 | 五层纵深防御：build-time → runtime → repo → prompt → output | 层级图 |
| 02 | 隐身 vs 标注：同一套源码的矛盾 | 对比图 |
| 03 | 内部仓库白名单：21个repo揭示的组织结构 | 结构化列表 |
