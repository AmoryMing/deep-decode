# Work across Excel and PowerPoint
> Source: https://support.claude.com/en/articles/13892150-work-across-excel-and-powerpoint
> Crawled: 2026-04-10

## Overview

Claude can now coordinate between Excel and PowerPoint add-ins, enabling users to read data from one application and make changes in another without manually copying and pasting.

## Requirements

- A paid Claude plan (Pro, Max, Team, or Enterprise)
- Claude for Excel add-in from Microsoft Marketplace
- Claude for PowerPoint add-in from Microsoft Marketplace

## Setup Instructions

### 1. Install Add-ins
Download both "Claude for Excel" and "Claude for PowerPoint" from the Microsoft Marketplace, then activate each add-in at least once.

### 2. Enable Cross-App Features
In Settings for each application, toggle "Let Claude work across files" on. Team and Enterprise plan owners must enable this capability at the organizational level first.

You'll see connected file indicators when Excel or PowerPoint files are linked to your session.

## How It Works

When describing multi-file tasks, Claude:
- Uses both add-ins to read from and write to open files
- Automatically transfers context between applications
- Allows you to stay in one location while Claude handles the switching

## Capabilities

**Read and write across files:** Pull numbers from Excel into PowerPoint slides or update charts with latest figures.

**Pass context forward:** Claude already understands the model's structure and key outputs, so you don't need to re-explain when moving between files.

**Skills integration:** Enabled Skills apply during cross-app work, enforcing modeling conventions and template matching as needed.

## Data Handling

Inputs and outputs are deleted from Anthropic's backend within 30 days. Chat history is not saved between sessions.

## Administrative Controls

Organization owners can manage access via Organization settings > Capabilities > Integration permissions, toggling "Let Claude work across apps" on or off.

## Current Limitations

- Claude can only access currently open files
- Cannot create, open, close, or switch files directly
- Cross-app chat history doesn't persist between sessions

## Troubleshooting

- **Files not visible:** Ensure add-in is activated and cross-app settings are enabled
- **Changes not appearing:** Wait for Claude to complete actions, then check target file; may need refresh
