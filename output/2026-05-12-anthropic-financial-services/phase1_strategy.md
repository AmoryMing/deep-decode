# Phase 1 Strategy

## 标题方向

主标题用“默认工作流”抓住判断，副标题点明金融服务仓库不是 demo。

候选：

1. Anthropic 开始卖金融行业的默认工作流
2. 不是金融 demo，是默认结构之争
3. Claude 走进金融街，卖的不是模型

最终采用：**Anthropic 开始卖金融行业的默认工作流**

## 主判断

Anthropic 这次公开 financial-services 仓库，表面是开源一套金融 agent 模板，实质是在把金融行业 know-how 产品化。它卖的不是“Claude 会写投研报告”这个单点能力，而是“投行、投研、私募、基金运营、KYC 这些流程应该怎么被 AI 组织”的默认结构。

## 论证路径

1. 从 frxiaobei 的“我正在金融街”切入：这句话的准，不在金融行业本身，而在 Anthropic 把战场推进到行业工作台。
2. GoSailGlobal 长推已经抓到表层结构：10 个 agent、7 个垂直插件、11 个数据连接器、两种部署方式、Microsoft 365 工具。
3. README 与官方新闻证明这不是网友拔高：Anthropic 官方 2026-05-05 新闻直接写了 10 个 ready-to-run agent templates，且每个 agent 由 skills、connectors、subagents 支撑。
4. 核心转折：当一个行业模板被写成 markdown、JSON、agent.yaml、MCP connector 和 Microsoft 365 install tooling，它就从“提示词”变成“默认工作流”。
5. 最后落到从业者：企业不要只问选哪个模型，要开始问谁在定义本行业的 agent 文件结构、技能边界、数据入口和人工签核点。

## 盲区

- 公开仓库不是生产系统，不代表 Anthropic 已经替任何金融机构跑真实交易或审批。
- README 的免责声明很强：不构成投资、法律、税务、会计建议；输出需要 qualified professional 审核。
- MCP 数据连接器不是免费公共数据池，README 明确说可能需要 provider subscription 或 API key。
- “行业默认结构”会形成生态优势，也会造成路径依赖。金融机构如果照抄，省掉前期探索，也可能把自身流程差异交给供应商重写。

## 文章结构

1. 开篇：frxiaobei 的一句话 + 仓库事实。
2. 第一节：不是 demo，是把金融工作拆成可安装资产。
3. 第二节：真正值钱的是默认结构，不是 prompt。
4. 第三节：Microsoft 365 与 Managed Agents 说明 Anthropic 要进工作台，不只进聊天框。
5. 盲区：合规、订阅、生产采用、路径依赖。
6. 对从业者意味着什么。
7. 本期关键词。
8. 引用。

