---
title: Thariq：The Unreasonable Effectiveness of HTML
type: source
created: 2026-05-09
updated: 2026-05-09
tags: [Claude Code, HTML, Agent UX, artifact]
source_url: https://x.com/trq212/status/2052809885763747935
---

# Thariq：The Unreasonable Effectiveness of HTML

## 核心论点

Thariq 认为 Markdown 仍然简单、可移植、易编辑，但在 Agent 输出越来越复杂之后，开始限制表达能力。HTML 更适合承载长 spec、PR 解说、研究报告、设计原型、配置编辑器和 prompt 调参器，因为它天然支持视觉结构、交互控件、SVG、代码高亮、canvas、表格和静态链接分享。

更深一层的信号是：人类越来越少直接手改 Agent 输出，而是把输出当 spec、reference、brainstorming artifact 使用。于是格式选择从“方便手改”转向“方便阅读、操作、导出和回流”。

## 金句

- “I'm also increasingly not editing these files myself, but using them as specs, reference files, brainstorming outputs, etc.”  
  中文：我也越来越少直接编辑这些文件，而是把它们当作 spec、参考文件、头脑风暴输出等。
- “HTML can convey much richer information compared to markdown.”  
  中文：与 Markdown 相比，HTML 可以传达更丰富的信息。
- “HTML diffs are noisy and hard to review compared to Markdown.”  
  中文：与 Markdown 相比，HTML diff 噪声很大，也更难审阅。

## 可写角度

- [[html-artifact]]：Agent 输出从文档转向工作界面。
- Source of truth 与 rendered artifact 分层：Markdown/YAML/JSON 仍做源，HTML 做人类界面。
- 企业内部 Agent 工具：PR explainer、incident report、feature flag editor、prompt tuning UI 会先爆发。

## 关联

- [[html-agent-artifacts]]
- [[enterprise-content-ops]]
- [[microinteraction-ai-era]]
