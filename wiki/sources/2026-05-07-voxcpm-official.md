---
title: VoxCPM2 官方资料与产品页
type: source
created: 2026-05-07
updated: 2026-05-07
tags: [VoxCPM, TTS, voice-ai, open-source, modelbest]
---

# 一手出处

- 官网：https://voxcpm.com/zh/
- 在线 demo：https://voxcpm.modelbest.cn/
- GitHub：https://github.com/OpenBMB/VoxCPM
- Hugging Face：https://huggingface.co/openbmb/VoxCPM2
- 文档：https://voxcpm.readthedocs.io/
- 论文：https://arxiv.org/abs/2509.24650

## 核心事实

VoxCPM2 是面壁智能 / OpenBMB 发布的开源 TTS 模型，官网定位为"新一代开源 TTS 模型，创造富有表现力的 AI 语音"。它不是只强调自然度，而是强调语音克隆、文本可控的情感表达、48kHz 输出和多语言覆盖。

GitHub 与 Hugging Face 均指向 `openbmb/VoxCPM2`，许可证为 Apache-2.0。官方使用路径包括 Python API、CLI、Gradio demo、Nano-vLLM，以及 vLLM-Omni 的 OpenAI-compatible 音频接口。

## 可写角度

- 产品化角度：VoxCPM2 把 TTS 从"朗读工具"推向"可 prompt 的声音生成器"。
- 商业化角度：开源权重 + 商用许可 + 在线 demo + OpenAI-compatible API，意味着它更像声音基础设施，而不是单点模型发布。
- 风险角度：语音克隆天然有冒充和诈骗风险，商业落地必须配套授权、标注和水印策略。

## 待核实点

- 官网中文页写"覆盖30国语言8大方言"，Hugging Face model card 中中文方言列举数量与此不完全一致。正式写作前需要再次核对官方最新文案。
- 需要实测长文本播客生成稳定性，官方文档提醒长文本可能出现语速漂移、噪声或停不下来。

## 关联

- [[voxcpm]]
- [[voxcpm-product-commercialization]]
