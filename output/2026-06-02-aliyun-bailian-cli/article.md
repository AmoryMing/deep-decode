---
title: 阿里云把整个 AI 平台压成了一行命令，去当别人 Agent 脚下的地基
date: 2026-06-02
source: https://github.com/modelstudioai/cli
author: 阿里云百炼 / IT之家
type: decode
slug: 2026-06-02-aliyun-bailian-cli
---

# 阿里云把整个 AI 平台压成了一行命令，去当别人 Agent 脚下的地基

5 月 29 日，阿里云开源了百炼 CLI（bailian-cli，命令行入口 `bl`，npm 包名即 `bailian-cli`），仓库挂在 GitHub 的 `modelstudioai/cli`，Apache 2.0 协议，TypeScript 占七成、Node ≥ 22.12，开源初期约 144 stars。表面是又一个命令行工具，实质是阿里云把百炼平台上 150+ 多模态模型、十余款应用与知识库，整体压成了一套终端命令——把一个云平台塞进一行 `bl` 里。这不是给人用的 CLI，是给机器用的 CLI。

![把平台压成一行命令](cover.png)

## 一、题眼：每条命令都是一次结构化工具调用

定位句把这层意图写得毫不含糊：

> "Built for AI Agents. Every command works as a structured tool call."（为 AI Agent 而造，每一条命令都是一次结构化的工具调用。）

这句话是整个项目的题眼。传统 CLI 为人类的手指设计，输出是给眼睛看的文本；而 `bl` 的每条命令都被刻意做成"可被程序解析的工具调用"形态——参数结构化、输出结构化，好让上游的 Agent 直接当 function call 来挂。所以它原生适配 Claude Code、Qoder、OpenClaw、Qwen Code、Hermes Agent 这一串 Agent 框架。

"原生挂进 Claude Code"的真实含义是：你不必写胶水代码、不必包 API，Claude 直接把 `bl image generate` 当成自己工具箱里的一把锤子来调。阿里云没在抢 Agent 这一层，它在抢 Agent 脚下那层。

## 二、能力清单：六条模态 + 企业三件套

能力清单印证了"整个平台"不是虚词。全模态六条线一应俱全：文本对话（Qwen3.7-max）、图像生成（Qwen-Image 2.0）、视频生成（HappyHorse-1.0 系列）、语音合成（CosyVoice 流式 TTS）、语音识别（FunAudio-ASR，覆盖 30 语种含多种方言）、视觉与视频理解（Qwen-VL）。

更关键的是企业三件套：多模态知识库 RAG 检索、跨会话的记忆库持久化、以及联网搜索——这三样恰恰是裸模型给不了、却是真实业务必需的"记忆 + 知识 + 实时"。还有个容易被忽略的工程细节：所有接受 URL 的参数都能直接传本地路径，工具会自动把文件上云到临时存储（48 小时有效 URL），等于替 Agent 抹平了"本地文件怎么喂给云端模型"这个脏活。

## 三、"一句话出片"把编排哲学讲透了

旗舰演示"一句话出片"把这套编排哲学讲透了。一句自然语言 prompt 进去，链路是：上游 Agent 做意图解析与叙事规划 → spark-video Skill 做分镜拆解与镜头连续性约束 → `bl video generate` 把多个镜头并行派发给 HappyHorse-1.0 → 约两分钟产出一部完整短片，零手工剪辑。

常用命令也都是这个调性：`bl auth login`（鉴权）、`bl text chat --message`（对话）、`bl omni`（全模态）、`bl image generate --prompt`（出图）、`bl video generate --image --prompt --download`（出视频）、`bl usage free`（查免费额度）。每条都是独立、可组合、结构化输出的积木——"出片"不过是把这些积木交给上游 Agent 自动拼起来的一次展示。

## 对从业者意味着什么

当所有人都在卷"谁的 Agent 更聪明"时，阿里云选择不当那个最聪明的大脑，而去当所有大脑都伸手就能用的那只手。把自家平台做成别人 Agent 里的一行工具调用，是一步"甘当配角"的阳谋——你用 Claude Code 编排得越顺，每一次 `bl video generate` 背后烧的都是百炼的 token。

对做 AI 应用的：这是一个明确的信号——能力供给正在"命令行化、工具调用化"，与其自己包一层云 API，不如直接在 Agent 里挂 `bl` 这类结构化 CLI，开发成本和维护成本都低一个量级。对做平台的：阿里云这步棋值得学——**模型能力正在从"产品"退化成"水电"，而真正的护城河，是成为别人工作流里删不掉的那一行命令**。谁先被 Agent 生态当成默认依赖，谁就锁住了下游。

## 本期关键词

- **结构化工具调用（structured tool call）** —— 把每条命令做成 AI 能直接当"工具"来调的标准件，参数和输出都规整，所以 Claude Code 们能原生挂载。
- **CLI as capability layer（命令行即能力层）** —— 不做前端界面，把整个平台的能力暴露成一组命令，专供上游 Agent 编排调用。
- **能力地基** —— 不抢着当聪明大脑，改去当所有 Agent 脚下随手就调的那只手，靠被依赖锁住下游。

## 引用

1. GitHub 仓库 modelstudioai/cli：https://github.com/modelstudioai/cli
2. IT之家《阿里云开源百炼 CLI》：https://www.ithome.com/0/957/149.htm
