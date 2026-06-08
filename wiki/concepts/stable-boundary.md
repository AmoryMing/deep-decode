---
title: 稳定边界（Stable Boundary）
type: concept
created: 2026-04-30
updated: 2026-04-30
tags: [streaming-ui, markdown, claude-code, performance]
---

## 一句话

流式 Markdown 渲染的核心算法：把已经成段的内容封冻，每帧只对最后一个未闭合块重新解析。复杂度从 O(全文) 降到 O(增量)。

## 实现位置

`raw/claudecodesources/raw_code/claude-code/src/components/Markdown.tsx:186-235` `StreamingMarkdown`

## 关键代码片段

```typescript
const stripped = stripPromptXMLTags(children)
const stablePrefixRef = useRef('')
if (!stripped.startsWith(stablePrefixRef.current)) {
  stablePrefixRef.current = ''
}
const boundary = stablePrefixRef.current.length
const tokens = marked.lexer(stripped.substring(boundary))
```

## 工程注解

- `stablePrefixRef` 是 monotonic（只前进不后退）的 ref，opt-out React Compiler memo
- `marked.lexer` 把未闭合 ` ``` ` 当成单 token，所以边界永远落在合法位置
- 旁配 LRU 缓存（`TOKEN_CACHE_MAX = 500`，issue #24180 回归后补）+ 快速通道（前 500 字无 markdown 直接 paragraph）

## 配套

- [[microinteraction-ai-era]] — 范式背景
- [[uncertainty-feedback]] — 同根问题的另一面
