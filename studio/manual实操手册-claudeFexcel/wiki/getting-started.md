---
title: 安装与配置
sources:
  - Anthropic 官方安装文档
  - Microsoft 365 管理员部署指南
links_to:
  - "[[产品全景]]"
  - "[[企业部署]]"
  - "[[Excel核心功能]]"
  - "[[PowerPoint核心功能]]"
linked_from:
  - "[[产品全景]]"
last_updated: 2026-04-10
---

# 安装与配置

## 支持的版本

装之前先确认你的 Excel / PowerPoint 版本是否支持。

### 支持的平台

| 平台 | 最低版本要求 |
|------|------------|
| Excel / PPT 网页版 | 任意现代浏览器均可 |
| Excel / PPT Windows 版 | Microsoft 365，Build 16.0.13127.20296 及以上 |
| Excel / PPT Mac 版 | Version 16.46 及以上，Build 21011600 及以上 |
| Excel iPad 版 | Version 2.51 及以上 |

### 不支持的环境

- **Excel 2016 / 2019 永久许可版**（买断制的旧版本，不是 Microsoft 365 订阅）
- **Android 设备**
- **低版本 Microsoft 365**（低于上表要求的 Build 号）

> **怎么查版本号：** Excel → 文件 → 账户（Account）→ 关于 Excel（About Excel），可以看到 Build 号。

---

## 个人安装（3 步搞定）

适用于自己装着用的情况，不需要管理员权限。

### 第 1 步：获取加载项

1. 打开 Excel
2. 进入 Microsoft Marketplace（插入 → 获取加载项，或直接访问 Office 应用商店）
3. 搜索 **"Claude for Excel"**
4. 点击 **"Get it now"**（立即获取）

### 第 2 步：激活加载项

1. 回到 Excel，在功能区（Ribbon，顶部那排工具栏）找到 Claude 图标
2. 点击打开 Claude 面板

### 第 3 步：登录

1. 用你的 Claude 账号登录（就是 claude.ai 网站的账号）
2. 登录成功后即可开始使用

> PowerPoint 加载项的安装流程完全一样，只是搜索时换成 "Claude for PowerPoint"。

---

## 管理员部署（给全公司/团队统一安装）

适用于 IT 管理员批量部署的场景。需要 Microsoft 365 管理员权限。

### 方法一：通过应用商店部署

1. 打开 **Microsoft 365 Admin Center**（管理中心，`admin.microsoft.com`）
2. 进入 **Settings → Org Settings → User owned apps and services**
   - 确保 **Office Store**（应用商店）已启用，否则用户看不到加载项
3. 进入 **Settings → Integrated apps → Add-ins**（集成应用 → 加载项）
4. 搜索 **"Claude by Anthropic for Excel"**
5. 选择部署范围：
   - **全组织**：所有人都能用
   - **特定用户/组**：只给指定团队开放

### 方法二：通过 Manifest XML 部署

适用于无法直接访问应用商店的网络环境（比如有防火墙限制）。

1. 下载 Manifest 文件（清单文件，告诉 Excel "加载项在哪、怎么加载"的配置文件）：
   - Excel 版：`pivot.claude.ai/manifest-excel.xml`
   - PowerPoint 版：对应的 PPT manifest 文件
2. 打开 Microsoft 365 Admin Center
3. 进入 **Settings → Integrated apps**
4. 点击 **"Upload custom apps"**（上传自定义应用）
5. 上传下载好的 XML 文件
6. 设置部署范围

---

## 跨应用协作设置

如果你同时装了 Excel 和 PowerPoint 两个加载项，可以打开跨应用协作功能，让 Claude 在两个应用之间共享上下文。

### 开启方法

1. 打开 Excel 或 PowerPoint 中的 Claude 面板
2. 点击 **Settings**（设置）
3. 找到 **"Let Claude work across files"**（允许 Claude 跨文件工作）
4. 打开开关

开启后，Claude 就能同时读取 Excel 表格和 PPT 幻灯片的内容。典型用法：Excel 里改了数据，让 Claude 自动更新 PPT 里对应的图表。

---

## 常见问题

**Q：装完后在 Excel 里找不到 Claude 图标？**
A：检查版本号是否满足要求。如果是公司电脑，可能需要管理员先启用 Office Store。

**Q：登录时提示"计划不支持"？**
A：确认你的 Claude 账号是 Pro、Max、Team 或 Enterprise 计划。免费版不支持。

**Q：管理员部署后，用户多久能看到？**
A：通常 24 小时内生效，部分情况下需要用户重启 Excel。

## 相关页面

- [[产品全景]] — 产品整体介绍
- [[企业部署]] — LLM Gateway 等企业级配置
- [[Excel核心功能]] — 装好后能用哪些 Excel 功能
- [[PowerPoint核心功能]] — 装好后能用哪些 PPT 功能
