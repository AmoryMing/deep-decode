# Phase 1 Strategy: HTML Agent Artifacts

## 核心论点

Agent 输出格式的竞争，不是 Markdown 和 HTML 谁更“漂亮”，而是谁更适合人类在 Agent loop 中保持参与。Markdown 适合人类直接编辑；HTML 更适合人类阅读、操作、调参、分享和把反馈回流给 Agent。

## 隐含假设

Thariq 的判断建立在一个使用习惯变化上：用户不再主要手改 Agent 输出，而是让 Agent 继续编辑。只要这个假设成立，Markdown 的“易手改”优势就会变弱。

## 关键证据

1. Thariq 明确说，自己越来越少直接编辑这些文件，而是把它们当 specs、reference files、brainstorming outputs 使用。
2. HTML 能表达表格、CSS、SVG、script、交互、workflow、canvas、image 等信息形态。
3. Thariq 给出高频场景：planning、code review、design prototype、research report、custom editing interface。
4. 原文也承认反面代价：2-4 倍生成时间、更高 token、版本控制 diff 不友好。

## 盲区

如果文章只顺着原文讲 HTML 的优势，会变成“格式安利”。真正需要拆的是边界：HTML 适合 rendered artifact，不一定适合 canonical source。工程团队不能为了可读性牺牲可追溯性。

## 读者画像

读者不是普通 Markdown 用户，而是正在把 Agent 接入日常工程、产品、设计、研究流程的人。他们的问题不是“用什么格式写文档”，而是“怎么让 Agent 产出的东西能被团队读懂、操作、复用、审计”。

## 可视化规划

1. `00_系列封面`：Markdown 退回草稿层，HTML 变成工作界面。
2. `01_format_shift`：从“人手改文本”到“人审阅界面”的角色迁移。
3. `02_source_vs_artifact`：Markdown / JSON / YAML 作为 source，HTML 作为 rendered artifact。
4. `03_human_loop`：读、调参、导出、回流 Claude Code 的闭环。
5. `04_enterprise_pattern`：企业落地的三层：source of truth / rendered interface / audit trail。
