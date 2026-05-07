# 执行避坑清单

> **性质**：Skill 执行时的命令/参数/API 坑。
> 知识性规范（字体顺序/不贩卖焦虑/标签格式等）不在这里，见 `vault/.../knowledge/*.md`。

---

## SVG 转 PNG

### cairosvg 系统依赖

```bash
apt install libcairo2-dev
# 或
brew install cairo

# 然后
pip3 install cairosvg
```

仅 `pip install cairosvg` 不够，缺 libcairo 会报"cannot load library"。

Ubuntu 24.04+ 遵循 PEP 668：`pip3 install --break-system-packages cairosvg` 或用 pipx。

### 2x 渲染命令

```python
cairosvg.svg2png(url="01_xxx.svg", write_to="material/pngs/01_xxx.png", scale=2)
```

1x 在 Word / 微信 / 小红书中模糊。

> 字体顺序、Unicode 符号、marker orient 属性等 SVG 渲染约束 → `knowledge/svg-design.md` §SVG 渲染约束

---

## docx 生成

### Node.js 包路径

docx 包在 `/tmp/node_modules/`：

```bash
NODE_PATH=/tmp/node_modules node material/create_doc.js "【AI笔记MMDD】标题"
```

包不存在：`npm install --prefix /tmp docx`

### 脚本必须放 material/ 目录内

`img()` 函数用 `path.join(__dirname, "pngs", name + ".png")` 定位 PNG。脚本必须在 `material/create_doc.js`，否则 PNG 读取失败。

### 颜色值不带 #

docx 库的 color 属性不接受 `#` 前缀：

- 正确：`"2383E2"`
- 错误：`"#2383E2"`

### ImageRun 尺寸单位 EMU

```python
transformation: { width, height }  # 单位 EMU
# 从 twips 转换
convertInchesToTwip(5.8) / 15
```

### python-docx 替代方案（推荐，避免 JS 引号地狱）

**踩坑**：中文内容含 ASCII 双引号 `"` 时，JS 字符串定界符冲突报 `SyntaxError: missing ) after argument list`。花了 3 轮调试才定位到 hex 层面（`"` 是 ASCII 0x22 而非 Unicode `\u201c\u201d`），Python 方案一次通过。

`material/create_doc.py` 是 `create_doc.js` 的等价实现：
- 组件：`add_h1()` `add_h2()` `add_p()` `add_pb()` `add_li()` `add_quote()` `add_img()` `add_divider()`
- 字体：`Songti SC`（正文）/ `Heiti SC`（标题），macOS/Linux 兼容
- 图片路径相对于 `material/pngs/`

备选（必须用 JS）：所有字符串参数用反引号 `` ` ``（template literal）包裹，不用 `"`。

### 封面独立 section

封面用第一个 section，正文用第二个 section。保证封面无页眉、正文页码从 1 开始。

### 不要连续放多张图

图文穿插：每张图前后应有文字。连续两张图排版松散。

---

## 播客相关

### 豆包 TTS 时间戳参数（参数在 request 不在 audio！）

**正确**（在 `request_json["request"]` 里）：

```python
request_json["request"]["with_frontend"] = "1"       # 开启音素级时间戳
request_json["request"]["frontend_type"] = "unitTson"  # 返回格式
request_json["request"]["with_timestamp"] = "1"      # 开启原文时间戳
```

**错误**（旧 gotchas 写错了）：`request_json["audio"]["enable_timestamp"] = True` — 参数名和位置全错，服务器会静默忽略。

服务器在 message_type 0xc（frontend response）里返回双重编码 JSON：

```json
{"frontend": "{\"words\":[{\"confidence\":0.89,\"end_time\":205,\"start_time\":85,\"word\":\"这\"}, ...]}"}
```

注意 frontend 的值是 JSON 字符串，需要再 `json.loads()` 一次。第二个 0xc 消息返回总时长：`{"duration": "5424", "first_pkg": "344"}`。

### edge-tts 限流

连续调用之间加 `await asyncio.sleep(0.5)`，否则可能被限流。

### 节奏标注清理

TTS 前必须移除 `[停顿]` `[强调]` `[放慢]` 等标注，否则会被朗读出来。

### [转场] 标记不是文本段落

按 `\n\n` 分段后，`[转场]` 标记可能独立成段。TTS 合成时必须跳过纯 `[转场]` 段落（不送 TTS），只在拼接时插入翻页音效。

### ffmpeg loudnorm 两遍（严格场景）

```bash
# 第一遍测量
ffmpeg -i input.mp3 -af loudnorm=print_format=json -f null -

# 第二遍用测量值
ffmpeg -i input.mp3 -af "loudnorm=I=-16:measured_I=xxx:measured_LRA=xxx" output.mp3
```

单遍 loudnorm 可能不够精确。

### pydub 依赖 ffmpeg

`pip install pydub` 后还需要系统级 ffmpeg：`apt install ffmpeg`

### 播客脚本字数控制（关键）

中文朗读速度约 300 字/分钟。10 分钟播客 = 3000 字脚本。

**踩坑**：首次测试 6100 字脚本产出 20 分钟，严重超标。

**修正**：DeepSeek 改写 prompt 中必须明确写"控制在 2500-3000 字以内"，否则会自由发挥到 6000+。

---

## 截图相关

### Playwright 超时

某些网站加载慢，设置合理超时：

```
browser_navigate → URL (timeout 30s)
browser_wait_for → networkidle
browser_take_screenshot
```

### 推文截图裁剪

x.com 推文页面有大量 UI 噪音，截取推文卡片区域而非全页。

---

## 微信公众号 API 执行

### 图片上传 endpoint 选择

- `/media/uploadimg` → 文章内嵌图（不占素材配额，无限量，返回 CDN URL）
- `/material/add_material` → 封面图（占配额上限 5000 张，返回 media_id）
- 每张图 ≤ 1MB，仅 JPG/PNG

### 封面图必填

创建草稿时 `thumb_media_id` 不能为空，否则报 40007。脚本优先找目录里文件名含"封面"或"cover"的图，找不到就用第一张。

### POST JSON 含中文

```python
json.dumps(data, ensure_ascii=False).encode('utf-8')
```

否则中文变 `\uXXXX` 转义，微信显示乱码。

### 图片路径智能搜索

.md 里的图片引用路径可能和实际位置不一致（重组目录后常见）。按三级策略查找：

1. .md 同目录直接匹配
2. 按文件名在目录树中递归搜索
3. 相对于父目录匹配

### 脚本位置

`vault/1-knowledge/project/企媒运营/pipelines/scripts/wechat_publish.py`

用法：`python3 wechat_publish.py <markdown_file>`

密钥：`~/各种密钥.md` → 微信公众号段落

> 公众号 HTML 规则 / IP 白名单 / 未认证号限制等知识性规范 → `knowledge/channel-specs.md §渠道 A`

---

## 小红书配图管线执行

### md → 3:4 配图链路（已验证 2026-04-10）

```
markdown 
→ python markdown 库转 HTML（带内联 CSS）
→ playwright headless 渲染（viewport 1080x1440）
→ 截全页长图 
→ Pillow 按 PAGE_H*DPR 切割为 3:4 页面
```

### 本地图片路径转 file://

markdown 里的 `![](material/pngs/xx.png)` 是相对路径，playwright 打开临时 HTML 时找不到。

md2xhs 里预处理：检测非 http 路径 → 拼 `os.path.join(md_dir, src)` → 加 `file://` 前缀。

### 图片数量硬上限

小红书最多 **9 张**图（不是 18 张，opencli 报 `Too many images: 12 (max 9)`）。超过 9 张自动截取前 9 张。

### 脚本

- 配图：`pipelines/pipeline_tools/md2xhs.py`
- 管线：`pipelines/pipeline_tools/xhs_pipeline.py`
- 发布：`python3 xhs_pipeline.py --article <slug> --publish`

> 短配文策略 / 标签规则 / 标题截断等 → `knowledge/channel-specs.md §渠道 B`

---

## 系统/安装

### pip3 install 需要 --break-system-packages

Ubuntu 24.04+ 遵循 PEP 668：

```bash
pip3 install --break-system-packages xxx
# 或
pipx install xxx
```

---

> *v1.0 | 2026-04-21 | 从 references/gotchas.md 拆分，只保留执行侧坑点。知识性规范（字体顺序/内联样式/关键词格式等）已迁移到 wiki/knowledge/ 下对应文件。*
