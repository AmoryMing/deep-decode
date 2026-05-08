# Phase 1: 结构解剖

## 1. 核心论点（一句话）

**Agent harness 不会消失，harness 决定了 memory 的归属；模型厂商正在把 harness + memory 整体收进 API 后面，本质是用状态绑架用户；开源 harness 是唯一出路。**

## 2. 隐含假设

- Memory 是 AI 产品真正的护城河，不是模型能力
- 模型能力会继续趋同（切换模型越来越便宜），但 memory 不会（切换 harness = 丢 memory = 业务级痛苦）
- 模型厂商有巨大动机把 memory 放到自己服务器
- 开源 agent 基础设施的竞争窗口不在"模型对比"而在"主权让渡"议题

## 3. 关键证据（最强 3 个）

1. **Claude Code 泄漏源码 = 512k 行 TypeScript**（VentureBeat/WaveSpeed 交叉验证）——证明连头部模型公司都在猛投 harness
2. **Anthropic Managed Agents 把 Session 数据、Memory Store 全存在自己数据库**（VentureBeat 标题直接用 "vendor lock-in risk"）——坐实 harness-as-lockin 命题
3. **Harrison 亲历故事**：自己的 Fleet 邮件 Agent 被误删，重建体验断崖下跌——memory 粘性的人肉证据

## 4. 盲区（作者刻意避开的）

- 开源 harness 没有告诉你：**自己托管 memory 的运维复杂度**（DB 备份、多租户隔离、向量库、权限管控）
- LangChain/Letta 也有他们自己的 lock-in（Deep Agents 生态、Letta 自有格式）——**开源派的 moat 其实是生态锁定**
- 企业客户"要 memory 主权"但很少有资源真正自运营——可能最后还是买托管版
- Harrison 全文没承认：LangChain 从 v1 到 LangGraph 再到 Deep Agents 自己也经历了 3 次架构换血，**LangChain 的 harness 保质期问题可能不比 Anthropic 轻**

## 5. 读者画像

- **Harrison 预期读者**：买了 Claude Managed Agents 的企业工程主管 / 正在做 Agent 产品的创业者 / 把 Memory 当下个风口的 VC
- **对 muming（中数智汇产品人）意味着**：
  - 数字员工 MCP APP 走 Managed Agents 路线 = 数据资产全部押给 Anthropic
  - 企百科对话数据、用户行为反馈 = memory，应落盘自己的 PG/Mongo
  - 做"有记忆的 AI 产品"时，架构选型比模型选型重要 10 倍

## 6. 内容结构（章节大纲）

| 章节 | 核心论点 | 证据 | 带走什么判断 |
|------|---------|------|------------|
| 1. 钩子：时间线的协同 | 这不是博客战，是商业战 | Managed Agents→Deep Agents Deploy→Harrison 推文 紧邻 3 天 | 看懂舆论操盘 |
| 2. 作者身份 + 为什么值得看 | 两个 CEO 同向发声 = 行业拐点信号 | Sarah=MemGPT 论文作者；Harrison=LangChain CEO | 这不是路人议论 |
| 3. 核心命题：Harness 不会消失 | 反驳"模型吸收 harness"论 | 512k 行 CC 源码；Web search 本质是 harness | Harness 不仅存在，还在变重 |
| 4. Memory = Harness 本身 | Sarah 原创框架："插记忆 ≈ 插开车" | 7 个无法外部化的决策清单 | Memory 不是 plugin 市场 |
| 5. 三级 Lock-in | Harrison 的风险阶梯 | 轻/中/重三档案例+图 | 识别自己处在哪一档 |
| 6. 状态锁定（Stateful Lock-in） | 原创命名：模型时代 vs Agent 时代的切换成本突变 | Harrison 的邮件 Agent 故事 | Memory 一旦启动就很难回头 |
| 7. 开源派的反击矩阵 | Deep Agents Deploy + Context Constitution + Letta Code 同期动作 | 3 个产品时间线 | 这是有协同的舆论战 |
| 8. 对我们的启示 | 架构选型决定 10 年资产 | 数字员工场景、企百科场景 | 可执行 action |
| 9. 盲区与反论 | 开源派也有锁定、自托管成本 | VentureBeat/Register 报道 | 不盲从 |
| 10. 本期关键词 | 8 个术语 | - | 学 8 个黑话 |

## 7. 可视化规划（目标 6 张图 + 封面）

| # | 配章节 | 解释什么 | 形式 | 风格 |
|---|--------|---------|------|------|
| 00_封面 | 全篇 | 主题视觉 | 大标题+副标+视觉隐喻 | 结构化+标题居中 |
| 01_时间线 | 章节 1 | 3 周内 4 个联动事件 | 横向时间线 | 结构化-时间轴 |
| 02_Harness 不会消失 | 章节 3 | 2023-2026 架构演进 | 三阶段对比图 | 结构化-时间线/矩阵 |
| 03_Memory=Harness | 章节 4 | 7 个不可外部化的决策 | 中心辐射图 | 结构化-中心辐射 |
| 04_三级锁定 | 章节 5 | 轻/中/重三档风险 | 阶梯图+案例标注 | 结构化-阶梯 |
| 05_状态锁定对比 | 章节 6 | 模型切换 vs Memory 切换成本 | 左右对比图 | 结构化-对比 |
| 06_开源反击矩阵 | 章节 7 | 3 家开源派同期产品 | 四象限或时间网格 | 结构化-矩阵 |

SVG 原则：
- 字体 PingFang SC, Inter, sans-serif 中文在前
- 宽度 800
- Notion 式日间：#FFFFFF 底 / #37352F 文字 / #2383E2 强调 / 辅助 #EB5757 红 #4DB6AC 绿 #FFB020 黄
- 每张图独立可传播
