---
title: Anthropic 把 €240,000 一年转给了 Blender，顺手卡住了 9 把锁
type: published
created: 2026-04-30
updated: 2026-04-30
tags: [decode, mcp, connector, anthropic, blender]
---

# 复盘

## 写了什么

- 选题：4/28 Claude 一次发布 9 个 Creative Connector + Anthropic 加入 Blender Development Fund 做 Corporate Patron（€240k/年）
- 角度：A 卡位论 + B 生态转移支付。文章主线沿"九件套不是堆叠"→"端 vs 中枢（Figma 缺席）"→"€240k = 4 个工程师"→"OpenAI 缺席"→"对从业者的三层影响"展开
- 长度：约 3000 中文字
- 引用：6 条独立信源（Anthropic 官网 / 9to5Mac / MacRumors / Blender 官网 / 80 Level / TechRadar）
- 关键词页：5 个（Connector / Corporate Patron / 被调用方 vs 中枢 / MCP / 生态转移支付）
- 配图：5 张商汤 SenseNova-U1-Fast 信息图（封面 + 4 个章节概念图）

## 配图引擎换商汤的体验记录

**第一次完全跑通 unify.light-ai.top + opencli + Chrome MCP 路径**：

- opencli `browser` 子命令打开页面、读 state 都成功，但 React 合成事件路径下，`browser click` 触发不了 SenseNova 的发送按钮（无论是直接 click 还是 dispatchEvent MouseEvent）。
- 切到 Claude in Chrome MCP（直接驱动用户已登录的 Chrome 实例）后，computer use 的 `left_click` + 物理键盘 `type` 一次跑通。
- 单张图生成 30-45s，包含「思考过程 → Prompt 扩写 → 生成信息图」三阶段。
- 图片下载机制：原生 `<img>` 的 src 带签名 query，外部 fetch 受限；走 JS `fetch + blob + a.download` 触发 Chrome 自带下载，Chrome 把 PNG 写到 `~/Downloads/.com.google.Chrome.XXXXXX` 临时文件（已是完整 PNG），再 `cp` 到项目目录。

**输出质量**：
- 5 张全部 2752×1536，构图清晰、信息准确（端 vs 中枢、€240k = 4 工程师、OpenAI 缺席等概念都对）
- 拼写有 LLM 系统性瑕疵：「Anthnropic」「Spice」「Autedock Fusion」「SketchShup」「Anthothotic」等。下次需在 prompt 里加"严格按以下英文拼写"的硬约束
- 风格一致性好——都是深色 + 高亮黄/蓝 + 极简扁平
- 比 visual-pipeline 的 SVG 信息图视觉冲击力强一档（有手绘感、概念隐喻），但精度差一档（拼写错误）

## 各渠道发布状态

| 渠道 | 状态 | 备注 |
|------|------|------|
| 邮件（xuehongtao@chinadaas.com） | **草稿已存** | 系统拒绝 `--send` 直发，需登录 exmail.qq.com 草稿箱手动发送 |
| 微信公众号 | **未上传** | wechat_publish 被权限系统拒绝（即便仅 draft 模式） |
| 小红书图文 | **未生成** | playwright 未安装，md2xhs 跑不通 |
| 播客 podcast.mp3 | ✅ 7:02 ，edge-tts XiaoxiaoNeural | 单独发布或拼视频号/抖音可用 |

## 这一次最值得记的

1. **opencli 在普通页面 OK，遇到 React 合成事件路径就废**——Claude in Chrome MCP（基于扩展 + CDP）才是稳定底层
2. **"Chrome 临时下载文件就是完整 PNG"** 是个有用的副信道——blob.download 即便没出现"另存为"对话框，也已经写到 `.com.google.Chrome.XXXXXX`
3. **商汤 SenseNova-U1-Fast 适合做 marketing/封面级别配图**，不适合做需要精确文字的图（拼写崩）。下次可以让它专做「视觉概念」，文字另外用 SVG 叠加
4. **权限系统对"对外发送"的把关比预期严**——即便用户提前在对话里授权"邮件直接发送"，每次对外动作仍走独立 deny。需要在 settings.json 里加 Bash 命令白名单或在执行前再次明示

## 关联

- topic: [[2026-04-28-claude-creative-connectors]]
- sources: [[2026-04-28-claude-creative-connectors]] / [[2026-04-28-anthropic-blender-corporate-patron]]
- concepts: [[mcp-connector-ecosystem]] / [[blender-development-fund]]
