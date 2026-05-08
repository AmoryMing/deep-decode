---
title: 企业部署 — Claude for Excel / PowerPoint
sources:
  - Anthropic 企业部署文档
  - LLM Gateway 集成指南
  - AWS Bedrock / Google Vertex AI 接入文档
links_to:
  - "[[安装与配置]]"
  - "[[连接器MCP]]"
  - "[[故障排除]]"
linked_from:
  - "[[安装与配置]]"
  - "[[限制与安全]]"
  - "[[故障排除]]"
last_updated: 2026-04-10
---

# 企业部署 — Claude for Excel / PowerPoint

## 核心概念

企业用户**不需要个人 Claude 账号**。通过以下三种路径之一，让 Claude for Excel 连接到你自己的 AI 基础设施。

简单说：个人用户直连 Anthropic 服务器；企业用户通过自己公司的"中转站"连接，数据不经过 Anthropic。

## 三种连接路径

### 路径一：LLM Gateway（推荐大多数企业）

加载项通过你公司的网关（Gateway，可以理解为"AI 请求的中转调度站"）路由请求到你选择的 AI 服务提供商。

**优势**：复用现有基础设施、统一管理所有 AI 请求、成本可控

**支持的网关产品**：LiteLLM、Portkey、Kong 等

**需要准备**：Gateway URL（网关地址） + API token（访问令牌）

**用户连接步骤**（5 步搞定）：

1. 打开 Excel 或 PowerPoint → 启动 Claude 加载项
2. 在连接方式中选择 **"Enterprise gateway"**
3. 输入 Gateway URL（HTTPS 开头的基础地址）
4. 输入 API token（找 IT 管理员要）
5. 点"测试连接" → 成功后加载主界面

> 凭证（你的 token）存储在浏览器 localStorage 的沙箱 iframe（隔离容器）中，**不会同步到 Anthropic 服务器**。

### 路径二：Bedrock Direct（AWS 用户）

通过 Microsoft Entra ID（微软企业身份认证）直连 AWS Bedrock（亚马逊的 AI 服务平台）。

**需要准备**：
- AWS 账号 + Claude 模型访问权限
- IAM OIDC 身份提供者（Identity Provider，让 AWS 信任你公司的微软账号体系）

**适合**：已经在用 AWS 的企业，想把 AI 费用统一走 AWS 账单。

### 路径三：Vertex AI Direct（Google Cloud 用户）

通过 Google OAuth（谷歌账号认证）直连 Google Cloud Vertex AI（谷歌的 AI 服务平台）。

**需要准备**：
- Google Cloud 项目 + Vertex AI API 已启用
- Google OAuth 客户端（Client ID）

**适合**：已经在用 Google Cloud 的企业。

## 部署流程（给 IT 管理员看）

### Setup Wizard（设置向导）

用命令行快速完成初始配置：

```
claude plugin marketplace add anthropics/financial-services-plugins
claude plugin install claude-in-office@financial-services-plugins
/claude-in-office:setup
```

### 可用命令

| 命令 | 作用 |
|------|------|
| `/claude-in-office:setup` | 配置资源、获取管理员同意、生成 manifest（清单文件） |
| `/claude-in-office:manifest` | 创建自定义 manifest XML（加载项描述文件） |
| `/claude-in-office:consent` | 生成 Azure 管理员同意 URL |
| `/claude-in-office:update-user-attrs` | 写入每用户配置 |

### 部署到 Microsoft 365

1. 进入 **Microsoft 365 Admin Center** → Settings > Integrated Apps > Upload custom apps
2. 选择 **"Office Add-in"** → 上传 manifest.xml
3. 选择受众（先选试点组，别一上来就全员推送）→ 接受权限 → 完成

> 部署传播最多需要 **24 小时**。建议先用试点组（Pilot Group）测试，确认没问题再全员推广。

## 网络白名单

IT 需要在防火墙/代理中放行以下域名：

| 域名 | 用途 |
|------|------|
| `pivot.claude.ai` | 加载项界面和运营遥测 |
| `claude.ai/api/` | 功能标记评估（Feature Flags） |
| `appsforoffice.microsoft.com` | Office.js 运行时（Office 加载项的基础框架） |
| `login.microsoftonline.com` | Entra ID 认证（微软企业登录） |
| 你的 LLM Gateway URL | AI 推理请求路由 |
| `sts.amazonaws.com` | AWS token 交换（仅 Bedrock 路径） |
| `bedrock-runtime.{region}.amazonaws.com` | Bedrock 端点（仅 Bedrock 路径） |
| `accounts.google.com` | Google OAuth（仅 Vertex 路径） |
| `oauth2.googleapis.com` | Google OAuth tokens（仅 Vertex 路径） |
| `aiplatform.googleapis.com` | Vertex AI 端点（仅 Vertex 路径） |

## Gateway 技术要求

如果你自建或配置 LLM Gateway，需要满足以下条件：

- **API 格式**：仅支持 Anthropic Messages API 格式（Unified endpoint，统一端点）
- **CORS 配置**：`Access-Control-Allow-Origin: https://pivot.claude.ai`（允许加载项跨域请求）
- **必需端点**：`/v1/messages`（支持流式传输）和 `/v1/models`（返回可用模型列表）
- **Header 转发**：必须转发 `anthropic-version` 请求头
- **认证方式**：接受 `x-api-key` 或 `Authorization` 两种认证头

## 数据收集说明

- Anthropic **会收集**运营遥测数据：功能使用情况、性能指标、错误率
- Anthropic **不会传输**你的 prompt（提示词）和 response（响应内容）
- Anthropic **无权访问**你的 AWS / Google / Microsoft 云实例

> 简单说：Anthropic 知道你用了什么功能、用了多久，但不知道你问了什么、Claude 回答了什么。

## LiteLLM 配置示例

> **安全提醒**：避免使用 LiteLLM PyPI 版本 **1.82.7** 和 **1.82.8**（这两个版本被发现含有恶意代码）。

### 路由到 Anthropic 直连

```yaml
model_list:
  - model_name: claude-sonnet-4-5-20250929
    litellm_params:
      model: claude-sonnet-4-5-20250929
      api_key: os.environ/ANTHROPIC_API_KEY
litellm_settings:
  drop_params: true
```

路由到 Bedrock / Vertex AI / Azure 的配置详见 [[连接器MCP]] 页面。

---

相关页面：[[安装与配置]] · [[连接器MCP]] · [[故障排除]]
