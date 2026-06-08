---
title: 四层权限管道
type: concept
created: 2026-04-13
updated: 2026-04-13
tags: [security, architecture]
---

# 四层权限管道

Claude Code 的安全不是一个弹窗，是一条 4 层决策管道：

```
规则匹配(0.5ms) → Bash分类器 → LLM分类器 → 用户确认
```

| 层 | 速度 | 成本 | 处理什么 |
|---|---|---|---|
| 规则匹配 | 极快 | 零 | 已知安全/危险的命令（白名单/黑名单） |
| Bash 分类器 | 快 | 低 | 语义分析命令意图 |
| LLM 分类器 | 慢 | 高 | 复杂场景的风险判断 |
| 用户确认 | 取决于人 | 零 | 最终兜底 |

**设计哲学**：默认拒绝（deny），逐层证明安全才放行。快的层先走，贵的层最后走。

连续 3 次拒绝触发熔断 → 降级为全手动确认。

BashTool 单独有 23 项安全检查（9300 行代码），包括 Unicode 零宽字符注入防护。

## 相关概念

- [[harness-engineering]] -- 权限管道是 Harness 的安全层
- [[undercover-mode]] -- 权限系统的特殊模式
- [[bash-security]] -- BashTool 的 23 项检查

## 出处

7 个信源提及
