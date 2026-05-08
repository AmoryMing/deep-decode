# 小红书草稿发布操作手册

## 前提条件

1. Mac 已安装 opencli：`npm install -g @jackwener/opencli`
2. Chrome 已安装 Browser Bridge 扩展（在 `~/Applications/opencli-extension`）
3. Chrome 已登录 creator.xiaohongshu.com
4. 验证连接：`opencli doctor`（三个 OK 才行）

## 一键发布（6篇全发为草稿）

```bash
cd ~/Documents/vault-linux/1-knowledge/project/content_creation企媒内容生产/pipelines/claudecode_deep_decode && bash pipeline/xhs_publish_drafts.sh
```

## 单篇手动发布

```bash
opencli xiaohongshu publish "这里是正文内容" --title "标题最多20字" --images "图1.png,图2.png" --topics "AI,ClaudeCode,深度解读" --draft true
```

## 素材包位置

每篇文章的小红书素材在 `distribute/xiaohongshu/` 目录下：

- `content.md` — 标题备选（3个）、正文（200-300字）、标签（20个）、配图建议
- `*.png` — 已选好的配图（封面+3-4张）

## 发布后

1. 打开 creator.xiaohongshu.com
2. 进入「草稿箱」
3. 逐篇审核：检查标题、正文、配图、标签
4. 确认无误后点「发布」

## 排错

- `opencli doctor` 报 Extension not connected → Chrome 里检查扩展是否启用
- publish 报错 → 确认 Chrome 当前页面是 creator.xiaohongshu.com
- 图片上传失败 → 检查 PNG 文件是否存在，路径是否正确
