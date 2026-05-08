# Claude for PowerPoint - Complete Guide
> Source: https://support.claude.com/en/articles/13521390-use-claude-for-powerpoint
> Crawled: 2026-04-10

## Overview

Claude for PowerPoint integrates Claude AI directly into your PowerPoint workflow. Currently in beta, available to Pro, Max, Team, and Enterprise plans.

### Key Capabilities

- Build new slides using existing templates while maintaining formatting
- Edit specific slides without regenerating entire presentations
- Generate complete deck structures from natural language descriptions
- Convert bullet points into native PowerPoint charts and diagrams
- Use connectors to pull context from other tools
- Iterate quickly while preserving template compliance

## Getting Started

### Supported Versions

- PowerPoint on the web
- PowerPoint on Windows (Microsoft 365, build 16.0.13127.20296+)
- PowerPoint on Mac (version 16.46+)

### Individual Installation

1. Visit the Microsoft Marketplace listing for Claude for PowerPoint
2. Click "Get it now"
3. Open PowerPoint, activate the add-in, and sign in with your Claude account

### Administrative Deployment

1. Navigate to Settings > Org Settings > User owned apps and services
2. Ensure "Let users access the Office Store" is enabled
3. Go to Settings > Integrated apps > Add-ins
4. Search for "Claude by Anthropic in PowerPoint"
5. Deploy to organization or specific users

### LLM Gateway Integration

Organizations routing API traffic through internal gateways connected to Amazon Bedrock, Google Cloud Vertex AI, or Microsoft Azure can use the add-in without Claude accounts.

## Key Features

### Build from Templates
Claude reads your slide master, layouts, fonts, and color schemes, then generates slides that comply with your template requirements.

**Example prompts:**
- "Create a market sizing section—3 slides covering TAM, SAM, SOM with supporting visuals"
- "Add an executive summary slide using the one-column content layout"

### Edit Existing Slides
Select a slide and describe desired changes. Claude edits while preserving formatting and context.

**Example prompts:**
- "Simplify the text on this slide"
- "Add a chart showing the quarterly trend"
- "Restructure the storyline across slides 4-7"

### Generate Full Decks
Create complete presentations from natural language descriptions.

**Example prompts:**
- "Create a 10-slide deck walking through our market entry hypotheses"
- "Build an internal project update presentation with timeline and next steps"

### Native Charts and Diagrams
Convert bullet points into editable native PowerPoint charts, process flows, and diagrams—not static images.

### Template Awareness
Claude automatically reads and respects your presentation's slide master, layouts, fonts, and color scheme.

### Connector Support
Connect external tools to provide Claude with additional context beyond your presentation content.

### Skills Integration
Skills enabled in Claude settings are available in PowerPoint. Type "/" in the sidebar to see available Skills.

### Persistent Instructions
Set preferences in the Instructions field that apply to every PowerPoint conversation. Separate from Excel settings.

## Context and Session Management

- **Auto-compaction**: System automatically compacts longer conversations
- **Overwrite Protection**: Claude warns before overwriting existing data

## Current Limitations

### Data Retention
Inputs and outputs automatically deleted within 30 days. Chat history not saved between sessions.

### Missing Features
- Observability and auditability not available
- No custom data retention inheritance
- Not in Enterprise audit logs or Compliance API

### Not Recommended For
- Final client deliverables without human review
- Highly sensitive/regulated data without proper controls
- Replacing judgment on design and narrative flow

### Unsupported Versions
- PowerPoint 2016/2019 (perpetual/volume licenses)
- PowerPoint on iPad
- PowerPoint on Android
- Older Microsoft 365 builds below SharedRuntime threshold

## Security - Prompt Injection Risks

Only use with trusted files. Avoid untrusted sources. Claude could potentially:
- Extract and share sensitive information
- Modify critical data
- Perform destructive actions without verification

## Example Use Cases

### Consulting Deliverables
- "Build a market sizing section with TAM, SAM, SOM slides"
- "Create a competitive landscape slide comparing 4 players"

### Iterative Refinement
- "Simplify the text on slide 3"
- "Combine slides 5 and 6 into a single summary"

### Data Visualization
- "Convert these bullet points into a process flow"
- "Create a bar chart from this data table"

### Deck Restructuring
- "Reorder slides to lead with recommendations first"
- "Add transition slides between each major section"

## FAQ

- **Models**: Sonnet 4.6 and Opus 4.6
- **Template understanding**: Yes, reads slide master, layouts, fonts, color scheme
- **Chat history**: Not saved between sessions
- **Access scope**: Only currently open presentation
- **Undo**: Standard PowerPoint undo (Ctrl+Z / Cmd+Z)
