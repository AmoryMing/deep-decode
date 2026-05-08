# Use Claude for Excel and PowerPoint with Third-Party Platforms (LLM Gateway)
> Source: https://support.claude.com/en/articles/13945233-use-claude-in-excel-and-powerpoint-with-an-llm-gateway
> Crawled: 2026-04-10

## Overview

Organizations can deploy Claude for Excel and PowerPoint add-ins through AWS Bedrock, Google Cloud Vertex AI, or LLM gateways without requiring individual Claude accounts. Prompts and responses stay within your existing trust boundary when connecting through organizational infrastructure.

## Three Connection Paths

**LLM Gateway**: The add-in routes requests through your gateway (LiteLLM, Portkey, Kong, etc.) to your chosen provider. This mirrors Claude Code's pattern and reuses existing infrastructure.

**Bedrock Direct**: Microsoft Entra ID authentication connects directly to AWS Bedrock without an intermediary gateway.

**Vertex AI Direct**: Google OAuth authentication connects directly to Google Cloud Vertex AI.

## Requirements Overview

**All paths require:**
- Claude for Excel or PowerPoint installed
- Microsoft 365 with Entra ID

**LLM gateway requires:**
- Gateway URL and API token from IT team

**Bedrock direct requires:**
- AWS account with Claude model access
- IAM OIDC identity provider trusting Entra ID tokens

**Vertex AI direct requires:**
- Google Cloud project with Vertex AI API enabled
- Google OAuth client configuration

## Network Allowlist Domains

| Domain | Purpose |
|--------|---------|
| pivot.claude.ai | Add-in interface and telemetry |
| claude.ai/api/ | Feature-flag evaluation |
| appsforoffice.microsoft.com | Office.js runtime |
| login.microsoftonline.com | Entra ID authentication |
| Your LLM gateway URL | Inference routing |
| sts.amazonaws.com | AWS token exchange (Bedrock) |
| bedrock-runtime.<region>.amazonaws.com | Bedrock endpoint |
| accounts.google.com | Google OAuth consent |
| oauth2.googleapis.com | Google OAuth tokens |
| aiplatform.googleapis.com | Vertex AI endpoints |

Optional: o1158394.ingest.us.sentry.io (crash reporting)

## Deployment Process (IT Admins)

### Using the Setup Wizard

Install and run the claude-in-office plugin:

```
claude plugin marketplace add anthropics/financial-services-plugins
claude plugin install claude-in-office@financial-services-plugins
/claude-in-office:setup
```

Available commands:
- /claude-in-office:setup - Provisions resources, obtains admin consent, generates manifest
- /claude-in-office:manifest - Creates customized add-in manifest XML
- /claude-in-office:consent - Generates Azure admin consent URL
- /claude-in-office:update-user-attrs - Writes per-user configuration

### Deployment to Microsoft 365

1. Open Microsoft 365 Admin Center
2. Navigate to Settings > Integrated Apps > Upload custom apps
3. Select "Office Add-in" and upload manifest.xml
4. Choose audience: entire organization or specific users/groups
5. Accept permissions and complete deployment

Propagation takes up to 24 hours; test with pilot group first.

## End-User Connection Instructions

### LLM Gateway Connection

1. Open Excel or PowerPoint and launch Claude add-in
2. Select "Enterprise gateway" on sign-in screen
3. Enter Gateway URL (HTTPS base URL of your LLM proxy)
4. Enter API token (sent as Authorization: Bearer <token> header)
5. Add-in tests connection; main experience loads on success

Credentials store locally in browser localStorage within the sandboxed iframe—not synced to Anthropic.

### Bedrock or Vertex AI Direct

1. Open Excel or PowerPoint and launch Claude add-in
2. Sign in with Microsoft work account
3. Add-in reads admin-provisioned configuration and connects directly

If sign-in fails, confirm your account is assigned to the add-in group.

### Updating Connection Details

Go to Settings in the add-in sidebar, enter new values, and select "Test connection."

## Gateway Requirements for IT Teams

### Supported Format

The Office add-ins only support the Anthropic Messages API format via the Unified endpoint.

### CORS Requirements

Gateway must return Access-Control-Allow-Origin: https://pivot.claude.ai (or *) on all responses: GET, POST, OPTIONS, and error responses. For preflight, return Access-Control-Allow-Headers: *.

### Required Endpoints

- /v1/messages - Send messages to Claude (supports streaming)
- /v1/models - List available models

### Required Headers

- anthropic-version - Must be forwarded to upstream provider

### Authorization

Accept tokens in either x-api-key or Authorization header.

## LiteLLM Configuration Examples

**Note:** Avoid LiteLLM PyPI versions 1.82.7 and 1.82.8 (credential-stealing malware).

### Routing to Anthropic

```yaml
model_list:
  - model_name: claude-sonnet-4-5-20250929
    litellm_params:
      model: claude-sonnet-4-5-20250929
      api_key: os.environ/ANTHROPIC_API_KEY
litellm_settings:
  drop_params: true
```

### Routing to Bedrock

```yaml
model_list:
  - model_name: claude-sonnet-4-5-20250929
    litellm_params:
      model: bedrock/anthropic.claude-sonnet-4-5-20250929-v1:0
      aws_region_name: us-east-1
litellm_settings:
  drop_params: true
```

### Routing to Vertex AI

```yaml
model_list:
  - model_name: claude-sonnet-4-5-20250929
    litellm_params:
      model: vertex_ai/claude-sonnet-4-5-20250929
      vertex_project: your-gcp-project-id
      vertex_location: us-east5
litellm_settings:
  drop_params: true
```

### Routing to Azure

```yaml
model_list:
  - model_name: claude-sonnet-4-5-20250929
    litellm_params:
      model: azure_ai/claude-sonnet-4-5-20250929
      api_base: https://your-resource.services.ai.azure.com/anthropic
      api_key: os.environ/AZURE_API_KEY
      extra_headers:
        x-api-key: os.environ/AZURE_API_KEY
litellm_settings:
  drop_params: true
```

## Data Collection

Anthropic collects operational telemetry (feature usage, performance, error rates) through pivot.claude.ai and claude.ai/api/, but prompts and Claude's responses don't transmit through these connections.

Anthropic doesn't have access to a customer's AWS, Google, or Microsoft instance, including prompts or outputs. Metadata (tool use, token counts) may be collected for analytics and product improvement.

## Feature Availability Comparison

| Feature | Claude Account | Third-Party |
|---------|---|---|
| Chat with spreadsheet/deck | Yes | Yes |
| Read/edit cells, slides, formulas | Yes | Yes |
| Connectors (S&P, FactSet) | Yes | Coming soon |
| Working across apps | Yes | No |
| Skills | Yes | Coming soon |
| File uploads | Yes | No |
| Web search | Yes | Vertex only |

## Troubleshooting

- **Connection refused/network error**: Verify URL, service running, allowlist domains
- **401 Unauthorized**: Confirm token validity; verify Entra ID group assignment
- **403 Forbidden**: Verify IAM role permissions (bedrock:InvokeModel / aiplatform.endpoints.predict)
- **404 Not found**: Use base gateway URL, don't include /v1/messages
- **500 errors**: Check gateway logs for upstream errors
- **No models available**: Configure gateway to expose /v1/models
- **Streaming responses fail**: Verify gateway supports SSE pass-through
- **Missing features**: Some capabilities not yet available through third-party platforms
