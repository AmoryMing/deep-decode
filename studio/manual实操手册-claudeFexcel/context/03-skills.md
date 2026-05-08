# Use Skills in Claude
> Source: https://support.claude.com/en/articles/12512180-use-skills-in-claude
> Crawled: 2026-04-10

## Overview

Skills extend Claude's capabilities by providing access to specialized knowledge and workflows. Available on Free, Pro, Max, Team, and Enterprise plans, requiring code execution to be enabled.

## Prerequisites & Setup

**Enterprise Plans:** Organization owners must enable "Code execution and file creation" and "Skills" in Organization settings > Skills. Owners can upload skills organization-wide.

**Team Plans:** Feature enabled by default. Members access settings via Customize > Skills.

**Max, Pro, Free Plans:** Enable skills through Customize > Skills.

## Enabling Skills

1. Navigate to Settings > Capabilities and enable "Code execution and file creation"
2. Go to Customize > Skills
3. Toggle individual skills on or off as needed

## Anthropic Built-In Skills

Claude automatically uses these when relevant:
- Enhanced Excel spreadsheet creation and manipulation
- Professional Word document creation
- PowerPoint presentation generation
- PDF creation and processing

No explicit invocation required—Claude determines usage based on requests.

## Custom Skills

Users can create and upload custom skills:

1. Create skill following proper structure
2. Package as ZIP file
3. Navigate to Customize > Skills
4. Click "+" then "Create skill"
5. Select "Upload a skill"
6. Upload ZIP containing skill folder

Custom skills remain private to individual accounts unless organization owners provision them organization-wide.

## Sharing Skills (Team/Enterprise)

Skills can be shared with:
- **Specific people:** Enter names/emails; appears grayed out until enabled
- **Entire organization:** Published to directory for discovery

Shared skills are view-only; recipients cannot edit but receive automatic updates.

## Skills Organization

Your Skills list contains three sections:
- **Personal skills:** Created or uploaded by you
- **Shared skills:** Shared directly by colleagues
- **Organization skills:** Org-wide or provisioned by owner

## Excel & PowerPoint Integration

Skills enabled in Claude settings work automatically in add-ins. Trigger via "/" command or natural language description. Claude adapts skill output to the application context.

## Management

- **View:** All skills listed in Customize > Skills with descriptions and dates
- **Enable/Disable:** Toggle switches control availability
- **Delete:** Click "..." menu next to toggle, then select "Delete"

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Skills section not visible | Enable code execution in Settings > Capabilities |
| Claude not using skill | Verify enabled, check description clarity, ensure well-structured instructions |
| Upload errors | Verify ZIP size, folder name matches skill name, Skill.md present, valid characters |
| Skills greyed out | Check code execution enabled; contact org owner |
| Share button missing | Owner must enable sharing toggles |

## Security Considerations

Primary risks include prompt injection and data exfiltration. Review skill contents before enabling, especially from less-trusted sources. Examine code dependencies and bundled resources carefully. Avoid skills instructing Claude to connect to untrusted external sources.

Only install skills from trusted sources.

## Best Practices

- Start with Anthropic's pre-built skills before creating custom ones
- Write clear, specific skill descriptions to indicate when Claude should invoke them
- Test custom skills with various prompts after uploading
- Create separate skills for different purposes rather than multi-purpose skills
