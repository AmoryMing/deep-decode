# Phase 1: 结构解剖

## 1. 核心论点
Claude Code 把 CPU 流水线技术（分支预测 + 推测执行）搬进了 AI 编程助手：用"预测人类意图 → 沙箱预执行 → 按需提交"的三级流水线架构，将人类等待时间变成生产力。这不是优化，是范式转移——从"人等机器"变成"机器抢跑人"。

## 2. 隐含假设
- 开发者在编程工作流中的下一步操作是高度可预测的（尤其是运维类操作：测试、提交、推送）
- 用户愿意用更多 API 算力换取更少等待时间（推测执行 = 额外的 forked agent 调用）
- Copy-on-write overlay 文件系统 + 权限分级足以保证推测执行的安全性
- Prompt cache 复用可以把推测执行的边际成本压到足够低

## 3. 关键证据
1. **speculation.ts (992行)**：完整实现了 overlay 文件系统 + copy-on-write + 三种边界类型（bash/edit/denied_tool）+ 递归 pipelining
2. **promptSuggestion.ts 的 12+ 条过滤规则**：太短、太长、Claude 口吻、评价性、meta 文本、多句子……确保建议"像用户自己会打的话"
3. **startSpeculativeClassifierCheck**：模型还在流式输出 Bash 参数时，安全分类器已经在并行运行
4. **CacheSafeParams 机制**：fork 严格复用父进程的 cache key 参数，PR #18143 实测：改 effort 参数导致 cache hit 从 92.7% 暴跌到 61%
5. **Pete 的独立发现**：外部研究者通过环境变量 `CLAUDE_CODE_ENABLE_PROMPT_SUGGESTION=1` 激活了建议功能，验证了系统存在

## 4. 盲区
- 目前仅 `USER_TYPE === 'ant'`（Anthropic 内部员工）可用，没有外部用户的命中率/接受率数据
- 推测执行的 API 成本未公开——每次推测 = 一次完整 forked agent 调用，如果预测准确率不高，大量算力浪费
- 代码中 `tengu_chomp_inflection` feature flag 控制建议功能的开关，但曾短暂对外开放后又关闭，暗示可能遇到了问题
- overlay 文件系统只处理了文件操作，对于数据库写入、API 调用等不可逆操作没有沙箱方案

## 5. 读者画像
AI 产品经理、开发工具从业者、关注 AI 工程架构的技术人。他们关心：这个设计背后的产品逻辑是什么？我的产品能借鉴什么？

## 6. 内容结构

### 第一章：从 CPU 到 AI——推测执行的跨域迁移
- 核心论点：CPU 流水线 50 年的经验正在被 AI 编程助手重新发明
- 证据：speculation.ts 的注释直接类比 CPU 分支预测
- 读者带走：理解"推测执行"不是新概念，但应用到人类意图预测是全新范式

### 第二章：Prompt Suggestion——预测你下一句话
- 核心论点：用 LLM 自己预测用户的下一步操作
- 证据：SUGGESTION_PROMPT 的设计、12+ 条过滤规则、forked agent 机制
- 读者带走：建议系统的设计哲学——宁可不建议，也不建议错

### 第三章：Speculation——预测了还不够，直接替你做
- 核心论点：推测执行是建议系统的自然延伸——预测了就执行，错了就丢
- 证据：speculation.ts 核心流程、overlay 文件系统、三种边界类型
- 读者带走：理解"预测→执行→提交/丢弃"的完整生命周期

### 第四章：Overlay 文件系统——沙箱里的平行宇宙
- 核心论点：Copy-on-write 是推测执行的安全基石
- 证据：overlayPath 机制、写重定向、读回退、copyOverlayToMain
- 读者带走：如何用最小成本实现文件级别的事务隔离

### 第五章：三层推测流水线
- 核心论点：Claude Code 不止一处在"抢跑"，而是系统性地消除等待
- 证据：speculative classifier check + memory/skill prefetch + speculation pipelining
- 读者带走：从微观（单个 bash 命令）到宏观（整个用户操作）的全链路预取

### 第六章：成本控制——Prompt Cache 复用的精密计算
- 核心论点：推测执行能成立的经济前提是 cache hit rate 要够高
- 证据：CacheSafeParams、PR #18143 的 45x cache write spike、MAX_PARENT_UNCACHED_TOKENS=10000
- 读者带走：理解 fork 与父进程共享 cache 的机制和代价

### 第七章：边界与克制——推测执行的刹车系统
- 核心论点：知道什么不能推测，比知道能推测什么更重要
- 证据：WRITE_TOOLS / SAFE_READ_ONLY_TOOLS 分类、bash read-only 检查、denied_tool 边界
- 读者带走：安全设计的核心是"fail-safe"而非"fail-fast"

### 第八章：对从业者意味着什么
- AI 产品的下一个竞争维度：不是更聪明，而是更快（感知速度）
- "人机交互延迟"将成为 AI 工具的核心体验指标
- 开发者工具的 autocomplete 进化路径：文本补全 → 意图预测 → 推测执行

## 7. 可视化规划

| 图序 | 配合章节 | 概念 | 形式 | 风格 |
|------|----------|------|------|------|
| 00 | 封面 | CPU 流水线 vs AI 意图流水线 | 双栏对比 | 风格A 概念漫画 |
| 01 | 第二章 | Prompt Suggestion 生成→过滤→展示 | 漏斗图 | 风格B 结构化 |
| 02 | 第三章 | Speculation 核心循环 | 状态机/流程图 | 风格B 结构化 |
| 03 | 第四章 | Overlay 文件系统 copy-on-write | 双层文件系统示意 | 风格A 概念漫画 |
| 04 | 第五章 | 三层推测流水线时序图 | 时间线/甘特图 | 风格B 结构化 |
| 05 | 第六章 | Cache 复用 vs Cache 失效的成本对比 | 对比图 | 风格B 结构化 |
| 06 | 第七章 | 权限边界矩阵 | 表格/矩阵图 | 风格B 结构化 |
