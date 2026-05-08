# Understanding Usage and Length Limits
> Source: https://support.claude.com/en/articles/11647753-understanding-usage-and-length-limits
> Crawled: 2026-04-10

## Overview

Claude enforces two distinct limit types:

**Usage Limits** - Control interaction frequency over time (your "conversation budget"). Different subscription plans (Pro, Max, Team, Enterprise) offer varying allowances. Usage applies across all Claude surfaces: claude.ai, Claude Code, and Claude Desktop.

**Length Limits** - Define Claude's context window, the maximum information processable in a single chat. Standard paid plans: 200K tokens. Enterprise plans: up to 500K tokens.

## Usage Limits Details

Your usage depends on conversation length, complexity, features used, and model selection. To increase capacity:
- **Paid Plans**: Purchase extra usage
- **Usage-Based Enterprise**: Consumption-based billing applies

## Length Limits & Context Management

When your conversation approaches the context window limit, Claude summarizes earlier messages to continue the conversation seamlessly (for users with code execution enabled). Full chat history remains accessible for reference.

## Optimization Strategies

- Use Projects with retrieval-augmented generation (RAG) for efficient large-dataset handling
- Keep project instructions concise; place task-specific details in chat
- Remove unused project files regularly
- Disable extended thinking when unnecessary
- Temporarily disable web search, Research, and MCP connectors as needed

Tools and connectors consume tokens heavily, affecting both context availability and usage limits.

## Key Distinction

Usage limits regulate how much across all conversations; length limits restrict how long any single conversation lasts. Hit usage limits? Wait for reset, upgrade, or purchase additional access. Hit length limits? Start a new chat or leverage Projects.
