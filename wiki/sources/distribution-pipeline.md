---
title: 多渠道分发管线
type: source
created: 2026-04-15
updated: 2026-04-15
tags: [分发, 微信公众号, 小红书, 播客, 邮件, 工具链]
---

# 多渠道分发管线

来源：`raw/content-production-bundle/` 下的 6 个分发脚本 + ground-truth.md 管线章节

## 管线总览

文章写完后，走四条分发路径，每条有独立脚本：

| 渠道 | 脚本 | 输入 | 输出 | 关键约束 |
|------|------|------|------|---------|
| 邮件 | send_email.py | article.md + PNG | CID 内嵌 HTML 邮件 | 三模式：preview/draft/send |
| 微信公众号 | wechat_publish.py | article.md + PNG | 草稿（draft/add API） | 全内联 CSS，外链被剥离 |
| 小红书 | md2xhs.py + xhs_pipeline.py | article.md + PNG | 3:4 图片卡（2160x2880px） | 最多 9 张图，标题 <=20 字 |
| 播客 | tts_doubao_v2.py + srt_generator.py | 播客脚本文本 | MP3 + SRT 字幕 | 10 分钟 = 2500-3000 字 |

## 邮件管线（send_email.py）

- Markdown→HTML 转换器，全内联 CSS，Notion 风格配色
- 图片通过 CID（Content-ID）内嵌，不依赖外部 CDN
- 三模式安全设计：默认只生成 preview HTML，`--draft` 存企业邮箱草稿，`--send` 直接发送
- SMTP 凭证读取自 chinadaas-email skill 的 config.yaml
- HTML 模板标准：680px 白卡 + 灰底，PingFang SC + Microsoft YaHei 字体栈，#2383E2 强调蓝

## 微信公众号管线（wechat_publish.py）

- 图片上传分两类 API：
  - `uploadimg`：文章内嵌图，无配额限制，返回 CDN URL
  - `add_material`：封面图，上限 5000 张，返回 media_id
- 智能图片发现：三级搜索（同目录→递归文件名→父目录），解决路径不匹配问题
- 外链全部剥离（errcode 45166），`<a>` 标签只保留文本
- `<style>` 标签和 class 属性全部被微信剥离，必须全内联 CSS
- Token 缓存管理，过期前 5 分钟刷新

## 小红书管线（md2xhs.py + xhs_pipeline.py）

- Markdown→HTML→Playwright 无头渲染→截图→Pillow 切割
- 视口：1080x1440 @2x，输出 2160x2880px 3:4 比例
- 标题截断：从第 19 个字符向前扫描标点找自然断点
- 最后一页补白：创建标准尺寸白底画布，粘贴实际内容
- 相对路径转 `file://` 绝对路径给 Playwright
- 批量管线用 `opencli xiaohongshu publish`，发布间隔 3 秒防限流

## 播客管线（tts_doubao_v2.py + srt_generator.py）

- TTS：字节豆包 WebSocket 协议，gzip 压缩 JSON 载荷
- 关键 v2 改动：时间戳参数必须放 `request_json["request"]` 不是 `request_json["audio"]`
- 字幕生成：多段拼接需要全局偏移计算（intro + 段间静音 200ms + 翻页音效 500ms）
- 句级分组：句号断句，逗号仅在超 25 字时断句
- 替代了旧 Whisper 方案（0.5-2 秒误差 + 专有名词乱码）

## 与当前 content-factory 的关系

当前 content-factory 的模板（templates/decode.md）定义了产出物和写作规范，但不含分发管线。这些脚本是产出物→发布的"最后一公里"。未来可从 raw/ 移到工作目录集成。
