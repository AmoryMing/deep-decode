---
title: Knowledge Domains 定义
type: meta
created: 2026-05-09
updated: 2026-05-09
---

# Knowledge Domains

> 给 wiki 切作用域的标签集合。每个 wiki 页面的 frontmatter 用 `domains: [a, b]` 多标签。
> 写作时按 domain 过滤 wiki——只读相关切片，避免无关概念污染上下文（lazy load 的 domain 版）。

## 标签清单（封闭集合，新增请编辑此文件）

| domain | 范围 | 典型概念 |
|---|---|---|
| `ai-infra` | 模型架构、推理、上下文、harness、agent loop | Memory System / Context Compression / Harness Engineering / Agent Loop |
| `ai-product` | 产品策略、Anthropic / OpenAI / xAI 产品决策 | Anthropic Product Launchroom / Capability Overhang / Mythos / Forked Leadership |
| `dev-ux` | Claude Code / Cursor / 开发者工具 UX、源码 | Ink / PromptInput / Permission Pipeline / Skill Graphs |
| `creative-tools` | 视频生成、生成式 UI、设计系统、AI 创意工具 | Generative UI / LTX Studio / Flipbook / HTML Artifact / Microinteraction |
| `methodology` | 内容生产、写作方法论、polish、podcast、分发 | Deep Decode / Polish 7-steps / Visual Pipeline / Distribution |
| `business` | 商业模式、护城河、生态、收入结构 | Memory as Moat / Anthropic Revenue Mix / Blender Patron |
| `alignment` | 对齐、风险、伦理、Mythos | Reckless Helpfulness / Stable Boundary / Tide vs Waves |

## 使用约定

1. **多标签鼓励**：一个概念跨域很正常。例：Memory System 同时是 `ai-infra` + `ai-product`
2. **不要发明新 domain**：先编辑本文件，确认必要性再加
3. **不批量回填**：现有 wiki 页面遇到新写作任务时再补 frontmatter，不强制扫表
4. **domain 缺失 fallback**：写作时若 filter 命中过少（< 3 个文件），自动回退到全 wiki + 警告
5. **router 推荐**：S3 的 router 会建议 domain 组合，但最终在 Strategy Spec 阶段由用户确认
