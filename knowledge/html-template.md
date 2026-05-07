# Markdown → HTML 标准范式

> **性质**：知识文件（LLM Wiki）。所有分发渠道的 HTML 从这套范式出发。
> **范式定稿**：2026-04-15 企媒邮件（`2026-04-15-claude-code-addiction/email_preview.html`）。以后调整版式从这里改。
> **通用转换脚本**：`2026-04-15-claude-code-addiction/send_email.py`（支持任意 .md 输入）

---

## 各渠道复用方式

| 渠道 | 怎么用这套 HTML |
|------|---------------|
| 邮件 | 直接用，图片 CID 内联 |
| 公众号 | 同一套 HTML，图片换成微信 CDN URL（uploadimg） |
| 小红书 | Playwright 渲染这套 HTML → 截图切割为 3:4 图片 |

---

## HTML 骨架结构

```html
<body style="background:#F7F7F5;">
  <table width="100%">          <!-- 外层：灰底居中 -->
    <tr><td align="center" style="padding:32px 16px;">
      <table width="680">       <!-- 内层：白色卡片，max-width:680px -->
        <tr><td style="padding:36px 40px;">

          <h1>标题</h1>         <!-- 24px, #37352F -->
          <p>元信息</p>         <!-- 13px, #787774 -->
          <hr>                  <!-- 2px solid #2D8C6F -->

          正文内容...

          <hr>                  <!-- 1px solid #E3E2E0 -->
          <p>签名</p>          <!-- 12px, #787774, 居中 -->

        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
```

---

## 元素样式速查表（全内联，无 class）

| 元素 | 样式 |
|------|------|
| h1 标题 | `font-size:24px; color:#37352F; font-weight:700; line-height:1.4` |
| h2 章节 | `font-size:19px; color:#37352F; font-weight:700; padding-bottom:8px; border-bottom:2px solid #2D8C6F` |
| p 正文 | `font-size:15px; line-height:1.9; color:#37352F; margin:0 0 16px 0` |
| p 元信息 | `font-size:13px; color:#787774` |
| strong 高亮 | `background:#FFF3E0; padding:1px 5px; border-radius:3px; color:#37352F` |
| code 行内 | `background:#F5F5F5; padding:2px 5px; border-radius:3px; font-family:'SF Mono',monospace; font-size:13px` |
| pre 代码块 | `background:#F5F5F5; padding:14px 16px; border-radius:6px; font-size:13px; line-height:1.6` |
| a 链接 | `color:#2D8C6F; text-decoration:none` |
| li 列表项 | `font-size:15px; line-height:1.8; margin-bottom:8px` |
| img 图片 | `max-width:100%; height:auto; border-radius:6px`（居中在 div 内） |
| hr 主分割 | `border:none; border-top:2px solid #2D8C6F`（标题下方） |
| hr 次分割 | `border:none; border-top:1px solid #E3E2E0`（章节间/签名前） |

---

## 字体栈

```css
font-family: 'PingFang SC', 'Microsoft YaHei', sans-serif
```

覆盖 Mac + Windows。中文在前（和 SVG 规则一致）。

---

## 配色（Notion 系，和 SVG / 公众号统一）

| 角色 | 色值 |
|------|------|
| 正文 | #37352F |
| 次要文字 | #787774 |
| 主题绿 | #2D8C6F |
| 高亮底色 | #FFF3E0 |
| 代码/引用底 | #F5F5F5 |
| 页面背景 | #F7F7F5 |
| 卡片背景 | #FFFFFF |
| 边框/分割 | #E3E2E0 |

---

## Markdown 元素对应规则

| Markdown | HTML |
|----------|------|
| `## 标题` | `<h2>` + 蓝色底线 |
| `**加粗**` | `<strong>` + 橙底高亮（不只是加粗，是视觉高亮） |
| `` `代码` `` | `<code>` + 灰底 |
| `[文字](url)` | `<a>` + 蓝色无下划线 |
| `![alt](img.png)` | `<div>` 居中 + `<img>` 圆角（邮件用 CID，公众号用 CDN URL） |
| `- 列表项` | `<ul>` + `<li>` |
| `---` | `<hr>` 细灰线 |
| 空行分段 | 新 `<p>` |

---

## 邮件 HTML 特殊规则（更严格）

邮件客户端（Outlook / 腾讯企业邮箱 / Apple Mail）对 HTML 的支持比浏览器差很多。

| 规则 | 做法 | 原因 |
|------|------|------|
| 全内联样式 | 每个标签写 `style="..."` | 邮件客户端剥除 `<style>` 标签和 class |
| 表格布局 | 外层用 `<table>` 居中，max-width:680px | 邮件客户端不认 flexbox/grid |
| 图片 CID 内联 | `<img src="cid:image001">` + MIMEImage attach | 外链图片常被拦截，CID 直接嵌入邮件体 |
| 行高充足 | `line-height: 1.8` | 邮件阅读场景需要更大呼吸感 |
| 重点高亮 | 关键判断用 `background: #FFF3E0; padding: 2px 6px;` 橙底 | 比加粗更醒目，比红字更克制 |
| 表格样式 | 细边框 `border: 1px solid #E3E2E0`，表头蓝底白字 | 表格是信息密度最高的部分，必须清晰 |
| 代码块 | 浅灰底，不用深色主题 | 打印不友好 |
| 段间距 | `margin-bottom: 16px` | 段落之间留白 |
| 标题层级 | h1: 22px / h2: 18px / h3: 16px，三级足够 | 层级太多在邮件里乱 |

---

## 图片 CID 内联代码模板（邮件用）

```python
from email.mime.image import MIMEImage

with open("chart.png", "rb") as f:
    img = MIMEImage(f.read())
    img.add_header("Content-ID", "<chart001>")
    img.add_header("Content-Disposition", "inline", filename="chart.png")
    msg.attach(img)

# HTML 正文中引用
# <img src="cid:chart001" style="max-width:100%; height:auto;">
```

---

## 公众号 HTML 特殊规则

微信编辑器会**剥除所有 `<style>` 标签和 `class` 属性**。所有样式必须写成 `style="..."` 内联。

- 错误：`<p class="content">` → 微信里变成无样式裸文本
- 正确：`<p style="font-size:15px;line-height:1.8;color:#37352F;">`

POST JSON 含中文必须 `json.dumps(data, ensure_ascii=False).encode('utf-8')`，否则中文变 `\uXXXX` 转义。

---

## 小红书 HTML 特殊处理

本地图片路径必须转 `file://` 绝对路径：

```python
# markdown 里的 ![](material/pngs/xx.png) 是相对路径
# playwright 打开临时 HTML 时找不到
# 预处理：检测非 http 路径 → 拼 os.path.join(md_dir, src) → 加 file:// 前缀
```

---

## 自检清单（产出 HTML 后）

1. HTML 在本地浏览器预览过？（`python3 -m http.server` 打开看一眼）
2. 图片全部 CID 内联（邮件） / CDN URL（公众号） / file:// 绝对路径（小红书本地预览）？没有 localhost 链接？
3. 表格在 680px 宽度内不溢出？
4. 重点判断有高亮底色，扫一眼就能抓到关键信息？
5. 没有 `<style>` 标签或 class 属性（邮件/公众号）？

---

> *v1.0 | 2026-04-21 | 从 ground-truth §七"Markdown → HTML 标准范式"切出独立文件*
