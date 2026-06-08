---
title: 从 v0.2.8 到 v2.1.88——两次泄露的技术演进
type: published
status: published
created: 2026-04-03
updated: 2026-04-25
tags: [Claude Code, 源码泄露, 版本对比, 演进]
mode: source-code-decode
series: claudecode_deep_decode
---

# 两次泄露的技术演进

## 摘要

Series 第三篇（版本对比）。把 2025-02 v0.2.8 泄露 + 2026-03 v2.1.88 泄露 14 个月间隔放一起讲。

钩子用反讽时间序：「同一行配置，同一个错误，14 个月后再犯一次。」第 13 种钩子方式：反讽事件重演。

第一次：Dave Schumaker 发现 cli.mjs 底部 `sourceMappingURL`，恢复早期 TS 源码。Anthropic v0.2.9 删除 sourcemap，下架旧版本。
第二次：Chaofan Shou 同样配置错误，但暴露范围从单文件 CLI 扩到 1902 文件 / 512K 行的完整 Agent 平台。

技术鸿沟：v0.2.8 单文件 CLI vs v2.1.88 完整 Agent 平台——14 个月里 Claude Code 从"婴儿期"长到"完整平台"。

## 写作特点

- **第 13 种钩子方式：反讽事件重演**。"同一X 同一Y N 个月后又一次"——结构内嵌反讽
- **配置错误叙事 + 演进叙事一起讲**：表面是同一个配置 bug 重演，深层是产品规模 14 个月里指数级扩张
- **暴露内部失败模式**：把 Anthropic 14 个月里没修同一类配置错误作为"工程组织也会重复犯错"的证据

## 关联概念

- [[claude-code-leak-panorama]] —— 全景前置
- [[harness-engineering]] —— 14 个月里 harness 体量扩张

## 复盘备注

- 钩子方式 #13：反讽事件重演
- 把 bug 重演作为产品演进的反向叙事入口——独特视角
