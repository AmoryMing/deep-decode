---
title: Zerostack — 纯 Rust、受 Unix 启发的极简编程代理
type: source
created: 2026-05-18
updated: 2026-05-18
tags: [coding-agent, rust, unix-philosophy, 开发者工具, 开源]
---

# Zerostack 信源摘要

## 一手出处

- crates.io 包页：https://crates.io/crates/zerostack/1.0.0（1.0.0，GPL-3.0-only）
- GitHub 仓库：https://github.com/gi-dellav/zerostack
  - 描述："Minimalistic coding agent written in Rust, optimized for memory footprint and performance"
  - stars 529 / forks 37 / open_issues 9（2026-05-18 抓取）
  - 创建于 2026-05-12，最近 push 2026-05-17 —— 仅 6 天就到 1.0.0 + 上 HN 头条
  - 主语言 Rust，license GPL-3.0
- README（github raw，270 行，已通读全文）
- Hacker News 讨论：https://news.ycombinator.com/item?id=48164287
  - 标题 "Zerostack – A Unix-inspired coding agent written in pure Rust"
  - **536 点 / 295 评论**（AIHOT 报的 115 点是早期快照，实际已破 500）
  - 来源标注 crates.io

## 核心事实（README 实证）

- 作者自称受 [pi](https://pi.dev) 和 [opencode](https://opencode.ai) 启发
- 代码量 ~7k LoC，二进制 8.9MB
- RAM：空 session ~8MB，工作时 ~12MB（对比 opencode/JS 系 ~300MB）
- CPU：idle 0.0%，用工具时 ~1.5%（i5 7 代实测；opencode idle ~2%、工作 ~20%）
- 启动 ~90ms（HN 作者补充）
- 多 provider：OpenRouter（默认）/OpenAI 兼容/Anthropic/Gemini/Ollama + 自定义
- 4 档权限模式：restrictive / standard（默认，安全命令自动批）/ accept-all / yolo
- doom-loop 检测：同一 tool call 重复 3+ 次触发警告
- **Prompts 系统替代 Skills**：内置 10 个系统提示模式（code/plan/review/debug/ask/brainstorm/frontend-design/review-security/simplify/write-prompt），运行时 `/prompt` 切换；目标是"用一套 prompt 完全替代 superpower / Claude 官方 skills"
- 自动读取项目根的 AGENTS.md / CLAUDE.md 注入系统提示
- Ralph Wiggum loop：长任务迭代循环（读任务→选计划项→做→跑测试→更新计划→循环）
- git worktree 集成：`/worktree` `/wt-merge` `/wt-exit`
- ACP（Agent Communication Protocol）：可作为 Zed 等编辑器的 agent 后端（gated feature）
- MCP 支持（可选编译特性）
- bubblewrap `--sandbox`：每条 bash 跑在隔离环境
- 单线程 async：`tokio::main(flavor="current_thread")` 省 ~50% RAM
- 优化手段：smallvec / compactstring 栈存储、LTO、按需分配

## HN 讨论关键判断（一手）

- 质疑核心："对一个大部分时间在调 LLM 等返回的软件，追性能有什么意义？"
- 作者回应：用过 Claude Code / copilot cli 后被它们的慢和吃内存"震惊"；长 session 吃几十 GB RAM
- 反驳作者的声音："写不出不爆内存的简单 Java agent，说明的是开发者水平，不是语言""把所有问题当系统编程问题是巨大资源浪费"
- 对 Claude Code 的吐槽：有人报 29 个进程共占 6.3 GiB RAM；内存泄漏
- 对 prompt 替代 skills 的质疑："没有运行时发现机制，就是个用户得自己记得用的模板系统"
- 作者证实：手选 crate（cargo add），不让 LLM 选依赖（吃过 agent 生成"奇怪 crate"的亏）
- 生态观察：很多人都在自己造 agent（Go/Zig/Deno-TS），共识是"几万个 harness 项目会冒出来"，扩展性而非二进制大小才是竞争壁垒

## 竞品定位（jock.pl 2026 harness 横评 + nxcode）

- SWE-bench Pro：Claude Code 80.8% / Codex CLI 77.3% / GPT-5.4-Codex 56.8%
- 同一 Opus 模型：Claude Code 77% vs Cursor 93% —— 仅 harness 调校差 16 分
- Claude Code：云端、CLAUDE.md 持久、Agent Teams、为"睡觉时跑"设计；3-4x 成本
- Codex CLI：codex-rs 已用 Rust 重写（启动快、内存低）；patch-based 编辑省 token
- Aider：git-first，每次编辑即 commit，token 效率比 Claude Code 高 4.2x
- OpenCode：75+ provider，无持久项目记忆
- Pi：primitives harness，RPC 可嵌入子进程，AGENTS.md/SYSTEM.md
- 作者判断："区分监督式助手 vs 自主编排器 vs 专注结对，比 benchmark 分数更重要"

## 可写角度

又一个 coding agent 进入已拥挤赛道。Rust + Unix 哲学的差异化是否成立？资源占用是真痛点还是伪需求？护城河在哪——是 8MB 内存，还是别的？
