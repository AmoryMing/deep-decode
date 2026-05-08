# Get Started with Custom Connectors Using Remote MCP
> Source: https://support.claude.com/en/articles/11175166-get-started-with-custom-connectors-using-remote-mcp
> Crawled: 2026-04-10

## Overview

Custom connectors using remote MCP are available on Claude, Cowork, and Claude Desktop for users on Free, Pro, Max, Team, and Enterprise plans. Free users are restricted to a single connector. Currently in beta.

## What Are Custom Connectors?

Custom connectors enable Claude to connect directly to your tools and data sources, allowing it to operate within your preferred software while accessing complete context from external applications. You can either connect to existing remote MCP servers or build your own.

**Important Security Note:** These connectors link Claude to unverified services, granting it access and modification capabilities. Review the security section before proceeding.

## Understanding Remote MCP Servers

The Model Context Protocol (MCP) is Anthropic's open standard enabling AI applications to interface with tools and data. Unlike previously local-only MCP servers, remote servers now allow developers to host and expose their tools across the internet.

## Network Requirements

When you add a connector, Claude connects from Anthropic's cloud infrastructure rather than your local device. Your MCP server must be publicly accessible from Anthropic's IP ranges. Private corporate networks, VPNs, and firewalls will block connections. If your server operates on a private network, you'll need to allowlist Anthropic's IP addresses.

Even though Cowork and Claude Desktop run locally, remote connectors originate from Anthropic's servers, not your machine's network interface.

## Adding Custom Connectors

### For Team and Enterprise Plans

**Owners must first:**
1. Navigate to Organization settings > Connectors
2. Click "Add"
3. Select "Custom," then "Web"
4. Enter your remote MCP server URL
5. Optionally configure OAuth Client ID and Secret in Advanced settings
6. Click "Add"

**Members then:**
1. Go to Customize > Connectors
2. Locate the connector your Owner added (marked "Custom")
3. Click "Connect" to authenticate

### For Pro and Max Plans

1. Navigate to Customize > Connectors
2. Click "+" then "Add custom connector"
3. Enter your server URL
4. Optionally add OAuth credentials in Advanced settings
5. Click "Add"

### Enabling Connectors

Enable connectors per conversation using the "+" button in your chat interface, then select "Connectors" to toggle them on/off.

## Removing Custom Connectors

1. Go to Customize > Connectors (Owners use Organization settings > Connectors)
2. Locate the Connectors section
3. Click "Remove" or select the three-dot menu
4. Follow prompts to confirm

To edit a connector, remove it first, then re-add with updated details.

## Security and Privacy

### Authentication
Authentication typically uses OAuth, allowing Claude to interact on your behalf without accessing your password. Revoke permissions anytime through Claude settings or the third-party service's security panel.

### Best Practices
- Only connect to servers built and hosted by trusted organizations
- Review OAuth permission requests carefully; limit scopes when possible
- Monitor tool behavior—developers may introduce unexpected changes
- Watch for prompt injection attacks

### Tool Actions
Remote MCP servers provide tools Claude can invoke, including reading, creating, modifying, or deleting external application data. You should:
- Monitor Claude's actions for destructive or unintended effects
- Carefully review tool approval requests before clicking "Allow always"
- Disable irrelevant tools through the Search and tools menu

### Interactive Connectors
Some connectors display interactive interfaces directly in conversations through inline cards (compact components) or fullscreen views (immersive interfaces for complex interactions).

**Admin controls:** Team and Enterprise owners can disable specific tool calls rendering interactive connectors in Organization settings > Connectors.

### Using with Research
Advanced Research can invoke connector tools automatically during investigation without additional approval. When using Research with custom connectors:
- Disable write-action tools in external applications
- Review approval requests carefully
- Consider the impact of numerous automatic requests

### Reporting Malicious Servers
Report malicious MCP servers to Anthropic's vulnerability disclosure program, selecting https://github.com/modelcontextprotocol as the asset.
