---
title: 故障排除 — Claude for Excel / PowerPoint
sources:
  - Anthropic 官方故障排除文档
  - Claude for Excel 管理员指南
  - LLM Gateway 集成文档
links_to:
  - "[[安装与配置]]"
  - "[[企业部署]]"
  - "[[限制与安全]]"
linked_from:
  - "[[安装与配置]]"
  - "[[企业部署]]"
  - "[[最佳实践]]"
last_updated: 2026-04-10
---

# 故障排除 — Claude for Excel / PowerPoint

## Excel / PowerPoint 通用问题

| 问题 | 解决方案 |
|------|----------|
| 加载项不显示 | 确认 Office 版本满足最低要求（需要较新的 Microsoft 365 订阅版）；检查管理员是否已将加载项部署到你的账号 |
| Skills 区域不可见 | 进入 Settings > Capabilities，确认"代码执行"（Code Execution）已启用 |
| Claude 不使用某个 Skill（技能） | 验证该 Skill 已启用、描述清晰、指令结构正确。描述模糊的话 Claude 不知道什么时候该用它 |
| Skill 上传报错 | 检查：ZIP 文件大小是否合规、文件夹名是否等于技能名、是否包含 Skill.md 文件、文件名是否只用合法字符（字母数字下划线） |
| Skills 灰显（不可点击） | 检查代码执行是否已启用；如果是管理员部署的，联系你的组织管理员确认权限 |
| 分享按钮不见了 | 这个功能需要管理员手动启用"分享"开关，联系 IT |
| 跨应用文件不可见 | 确认 Excel 和 PowerPoint 两边的加载项都已激活，并且跨应用设置（Cross-App）已开启 |
| Claude 的修改没出现 | 等 Claude 完成当前操作（看对话框是否还在"思考中"）；检查目标文件是否正确；可能需要手动刷新工作簿 |

## LLM Gateway / 第三方平台问题

> 这部分主要给 IT 管理员或使用企业网关接入的用户看。如果你是个人用户直连 Anthropic，可以跳过。

| 问题 | 解决方案 |
|------|----------|
| 连接拒绝 / 网络错误 | 验证 Gateway URL 是否正确、服务是否在运行、域名是否已加入白名单（见 [[企业部署]] 的网络白名单章节） |
| 401 未授权（Unauthorized） | 确认 API token 还在有效期内；验证 Entra ID（微软身份认证）的组分配是否正确 |
| 403 禁止访问（Forbidden） | 验证云平台的 IAM（身份与访问管理）角色权限 — Bedrock 需要 `bedrock:InvokeModel` 权限；Vertex AI 需要 `aiplatform.endpoints.predict` 权限 |
| 404 未找到（Not Found） | 使用 Gateway 的**基础 URL**，不要在后面加 `/v1/messages` 路径 |
| 500 服务器错误 | 检查 Gateway 日志中的上游错误信息，问题通常出在 Gateway 后面连接的 AI 服务 |
| 没有可用模型 | 配置 Gateway 暴露 `/v1/models` 端点（API 入口），让加载项能查询到可用模型列表 |
| 流式响应失败 | 验证 Gateway 支持 **SSE**（Server-Sent Events，服务器推送事件）透传。有些代理或网关会截断流式传输 |
| 功能缺失 | 通过第三方平台（非 Anthropic 直连）使用时，部分功能尚不支持：连接器（Connectors）、Skills（技能）、文件上传、跨应用协作 |

## 常见排查步骤

遇到问题时，按这个顺序排查：

1. **检查版本** — 你的 Office 版本是否在支持范围内？（见 [[限制与安全]] 的"不支持的版本"）
2. **检查网络** — 能否访问 `pivot.claude.ai`？公司网络是否有防火墙拦截？
3. **检查权限** — 管理员是否已部署加载项到你的账号？
4. **重启加载项** — 关闭再重新打开 Claude 侧边栏
5. **重启 Office** — 完全退出 Excel/PowerPoint 再重新打开
6. **清除缓存** — Office 加载项缓存偶尔会出问题，清除后重试
7. **联系管理员** — 如果以上都不行，提供错误截图给 IT

---

相关页面：[[安装与配置]] · [[企业部署]] · [[限制与安全]]
