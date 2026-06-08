---
title: 相位地理解耦（Phase-Geographic Decoupling）
type: concept
created: 2026-04-25
updated: 2026-04-25
tags: [llm-inference, infra, system-design]
---

# 相位地理解耦

LLM 推理有两个"相位"——

- **Prefill**：吃算力，把 prompt 变成 KVCache（注意力记忆）
- **Decode**：吃带宽，逐 token 生成，每生成一个都要查 KVCache

过去这两个相位**必须物理共处一地**——KVCache 的传输必须走 RDMA 胖管道（400 Gbps 起步），跨机房延迟会崩。Moonshot 的 *Prefill-as-a-Service* 论文（2026-04-16）让两相位**第一次可以分布在不同地理位置**——用商用 100 Gbps 以太网（VPC peering 级别）就能跨数据中心运行 prefill 服务。

## 类比框架

| 类比对象 | 解耦的对象 | 跨地理后的形态 |
|---|---|---|
| **CDN** | 静态内容从计算中心剥离 | 内容靠近用户 |
| **S3 / 对象存储** | 冷数据从热数据库剥离 | 跨 DC 部署 |
| **PrfaaS** | Prefill 从 Decode 剥离 | 算力丰沛 DC 跑 prefill，带宽充足 DC 跑 decode |

## 硬件分家的佐证

- **NVIDIA Rubin CPX**（2025 宣布）专攻 high-throughput long-context prefill
- **Groq LPU** 专攻 decode 所需的极高内存带宽

硬件已经在分家，PrfaaS 是把这个分家**软件化、调度化**。

## 推论：基础设施的物理假设松动

过去"AI 集群"是不可切分的地理原子——一栋楼一套 RDMA。现在开始可以像微服务那样拆。会催生：
- 跨 DC 调度器
- KVCache 边缘缓存
- prefix 命中率市场化
- 异构推理池化（H200 + H20 混合池）

## 三个支撑机制（来自论文）

1. **选择性卸载**：阈值 t=19.4K，约 50% 长请求被卸载到 PrfaaS，短请求留本地
2. **双时间尺度调度**：短时（秒级）反馈抑抖动，长时（分钟级）反馈调结构
3. **混合前缀池**：Linear attention 的 request 级状态 + Full attention 的 block 级 KVCache 塞进同一存储池

## 数据强度

| 维度 | PrfaaS（H200+H20 混合） | 同构基线（H20） | 提升 |
|---|---|---|---|
| 吞吐相对值 | 1.54 | 1.00 | +54% |
| Mean TTFT | 2.22s | 4.44s | 砍半 |
| P90 TTFT | 3.51s | 9.73s | 砍 64% |
| 带宽占用 | ~13 Gbps | — | 100 Gbps 链路只用 13% |

## 局限

- 实测的"跨 DC"是同地域两机房（VPC peering 1-5ms），未测真跨大洲
- SLO 卡 40 tokens/sec 中等松弛
- 仅 Kimi 自家 1T 模型实验
- 跨 VPC KVCache 隔离/加密未提
- 经济 TCO 未算

## 关联

- [[mooncake-lineage]] —— 学术谱系（待建）
- [[managed-agents-architecture]] —— infra 与 agent 架构的两条护城河

## 出处

[[prfaas-prefill-as-a-service]]
