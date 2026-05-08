# 分发渠道规范

> **性质**：知识文件（LLM Wiki）。各平台的约束、策略、避坑点。
> HTML 样式范式见 `html-template.md`，播客听感见 `podcast-aesthetics.md`。

---

## 渠道速查表

| 平台 | 格式 | 要点 |
|------|------|------|
| 公众号 | HTML 正文 + 内联图片 | 全内联样式，人工点发布 |
| 小红书 | 竖版视频 + 200-300 字短配文 | 前 40 字是生死线，最多 9 张图 |
| 视频号/抖音 | 幻灯片视频 + 硬字幕 | 必须有字幕，大量用户静音刷 |
| 内部论坛 | Discourse 自动同步 | /discourse-forum skill |
| 邮件 | HTML 正文 + CID 内联图片 | 收件人打开即完整阅读，不依赖外部链接 |

---

## 渠道 A：微信公众号

### HTML 样式规范（摘要）

详见 `html-template.md`。公众号特殊要求：**全内联样式，无 class，无 style 标签**。

### 图片上传策略

- `/media/uploadimg` → 文章内嵌图（**不占素材配额，无限量**，返回 CDN URL）
- `/material/add_material` → 封面图（占配额上限 5000 张，返回 media_id）
- 每张图 ≤ 1MB，仅 JPG/PNG

### 封面图

`thumb_media_id` 是必填项，不能为空，否则报 40007。脚本会优先找目录里文件名含"封面"或"cover"的图，找不到就用第一张。

### 未认证个人号不能 API 发布

2025 年 7 月起，未认证的个人订阅号 `freepublish/submit` API 被收回。

**流程**：API 创建草稿 → 人工登录 mp.weixin.qq.com 点"发布"。认证号不受影响。

### IP 白名单

微信 API 强制 IP 白名单，不在白名单的 IP 拿不到 token。绑的是"脚本跑在哪"不是"人在哪"。把发布脚本放在固定 IP 的服务器上，人在任何地方 SSH 过来触发即可。换网络（咖啡厅/家里）不影响。

### POST JSON 含中文

必须 `json.dumps(data, ensure_ascii=False).encode('utf-8')`，否则中文变 `\uXXXX` 转义，微信显示乱码。

### 脚本

`vault/1-knowledge/project/企媒运营/pipelines/scripts/wechat_publish.py`

用法：`python3 wechat_publish.py <markdown_file>`

密钥：`~/各种密钥.md` → 微信公众号段落

### 7 步流程

1. 读取 markdown，提取 frontmatter
2. 智能查找引用图片（三级策略：同目录 → 递归搜索 → 父目录匹配）
3. 上传图片到微信 CDN
4. 选封面图（优先"封面"/"cover"），上传为永久素材
5. Markdown → 微信内联 HTML
6. 创建草稿
7. 人工登录 mp.weixin.qq.com 点"发布"

---

## 渠道 B：小红书

### 定位

**竖版视频 + 200-300 字短配文 + 标签**。不发图文长文，图文长文放公众号。

### 配文前 40 字是生死线

折叠后只看得到这些。最重要的钩子放最前面。

### 图片上限 9 张

不是 18 张。opencli 会报 `Too many images: 12 (max 9)`。超过自动截取前 9 张。

### 新账号同话题不发两条

新账号同一话题发两条（视频+图文）会被算法判"水号"。策略固定为"一条视频 + 短配文 + 标签"。

### 标签规则

- 不能有空格。`Claude Managed Agents` → `ClaudeManagedAgents`（发布前 `.replace(" ", "")`）
- frontmatter `tags: [Claude Managed Agents]` 含空格会变成多个碎标签

### 标题 ≤ 20 字，在标点处截断

硬截 `title[:18] + ".."` 出来不通顺（"不再只.."）。

**正确做法**：从第 19 位往前找标点（：，、—）截断，截出完整短语（"脑手分离：Anthropic"）。

### 配图管线

**md → 3:4 配图**（已验证 2026-04-10）：

```
markdown 
→ python markdown 库转 HTML（带内联 CSS）
→ playwright headless 渲染（viewport 1080x1440）
→ 截全页长图 
→ Pillow 按 PAGE_H*DPR 切割为 3:4 页面
```

- 尺寸：1080x1440 @2x = 2160x2880 实际像素
- 服务器没有 LaTeX/weasyprint/wkhtmltopdf，不能用 pandoc 转 PDF
- 依赖：playwright, markdown, Pillow

### 最后一页补背景

长图切割时最后一页通常不满 1440px 高。Pillow `Image.new()` 先创建标准画布填背景色 `#1a1a2e`，再粘贴实际内容，避免底部露白。

### 参考账号

万有引力 AI

### 脚本

- 配图：`pipelines/pipeline_tools/md2xhs.py`
- 管线：`pipelines/pipeline_tools/xhs_pipeline.py`

### 发布命令

```bash
python3 xhs_pipeline.py --article <目录名> --publish  # 生成+发布到草稿箱
# 需在 creator.xiaohongshu.com 人工审核后点发布
```

---

## 渠道 C：播客

**听感/美学/结构/声音选型** → 全部见 `podcast-aesthetics.md`

**执行管线（TTS 代码 / ffmpeg 命令 / 脚本路径）** → 见 `.claude/skills/deep-decode/references/podcast-pipeline.md`

---

## 渠道 D：短视频（视频号 / 抖音 / B 站）

### 结构

图片序列 + 播客音频 → 幻灯片视频。**必须硬字幕（burnt-in subtitles）**，大量用户静音刷。

### 字幕样式

- 白字黑边，居中底部
- 竖版 FontSize=14，横版 FontSize=12，MarginV=20（贴近底部）
- SRT 按句号/问号/感叹号断句，不在句中截断
- 逗号处可断但仅当单句超 30 字
- 每条字幕必须是完整语义单元（句号结尾或逗号结尾），不能出现"发起的一个自主小实验"这种半句

### 发布前测试

生成视频前先出 10 秒样本确认字号和位置，确认后再全量渲染。

### 字幕生成管线（v2，豆包原生时间戳，2 步替代旧方案 5 步）

旧方案（已废弃）：Whisper base → DeepSeek 修字 → SRT。问题：时间戳偏差 0.5-2 秒，专有名词全错。

新方案：豆包 TTS 原生字级时间戳，精度 10ms，文字 100% 准（用原始脚本）。

代码位置：
- `pipelines/scripts/tts_doubao_v2.py` -- 带时间戳的 TTS
- `pipelines/scripts/srt_generator.py` -- 时间戳 → SRT

---

## 渠道 E：企业邮件

### 工具

- 脚本：`.claude/skills/chinadaas-email/scripts/email_client.py`
- 配置：同目录 `config.yaml`（腾讯企业邮箱 SMTP_SSL smtp.exmail.qq.com:465）
- 通讯录：`references/contacts.md`（规律：全拼@chinadaas.com）

### Happy Path

```
用户说"发邮件给薛泓涛"
  → 查通讯录 → xuehongtao@chinadaas.com
  → 准备内容：markdown → HTML（全内联样式）
  → 图片处理：SVG/PNG → CID 内联嵌入（不是外部链接）
  → 展示摘要等用户确认（安全协议）
  → 用户说"发"
  → email_client.py send --to "..." --subject "..." --body "..." --html
  → {"status": "sent"}
```

### 发送命令

```bash
# 纯文本
python3 email_client.py send --to "..." --subject "主题" --body "内容"

# HTML 正文（decode 文章、信息图邮件）
python3 email_client.py send --to "..." --subject "主题" --body "<html>..." --html

# 带附件
python3 email_client.py send --to "..." --subject "主题" --body "内容" --attach 文件.pdf

# 存草稿（不发送，人工检查后再发）
python3 email_client.py draft --to "..." --subject "主题" --body "内容"
```

### 默认存草稿（用户反馈）

邮件默认存草稿箱，不直接 send，用 draft 子命令。

### HTML 规则

详见 `html-template.md` §邮件 HTML 特殊规则。

### 自检清单（发送前）

1. 收件人正确？
2. HTML 在本地浏览器预览过？（`python3 -m http.server` 打开看一眼）
3. 图片全部 CID 内联，没有 `file://` 或 localhost 链接？
4. 表格在 680px 宽度内不溢出？
5. 重点判断有高亮底色，扫一眼就能抓到关键信息？
6. 展示摘要给用户确认了？（安全协议：外部操作必须确认）

---

## 渠道 F：内部论坛 Discourse

用 `/discourse-forum` skill 自动同步。触发条件：有新的经验/教训需要沉淀分享时。

---

> *v1.0 | 2026-04-21 | 从 ground-truth §七"分发渠道" + §八"分发格式速查"整合迁移到 LLM Wiki*
