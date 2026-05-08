# Claude for Excel - Official Guide
> Source: https://support.claude.com/en/articles/12650343-use-claude-for-excel
> Crawled: 2026-04-10

## Overview

Claude for Excel is an add-in that integrates Claude into your Excel workflow, for professionals working extensively with spreadsheets, particularly in financial analysis and modeling. Currently available in beta for Pro, Max, Team, and Enterprise plans.

## Key Capabilities

- Ask questions about workbooks with cell-level citations
- Update assumptions while preserving formula dependencies
- Debug errors and identify root causes
- Build new models or fill existing templates
- Navigate complex multi-tab workbooks
- Use connectors to integrate other tools

## Recent Updates

**Claude Sonnet 4.6 Integration**: Our newest model—Claude Sonnet 4.6—is available when using Claude for Excel.

**Double Usage Promo**: Through March 19, 2026, usage limits are doubled across Pro, Max, Team, and Enterprise plans.

**MCP Connectors**: Claude for Excel supports connectors to S&P Global, LSEG, Daloopa, Pitchbook, Moody's, and FactSet.

**Expanded Editing Tools**: Claude for Excel now supports a range of native Excel operations directly, including pivot table editing, chart editing, conditional formatting, sort/filter, data validation, and finance formatting.

## Getting Started

### Supported Versions
- Excel on the web
- Excel on Windows (Microsoft 365, build 16.0.13127.20296+)
- Excel on Mac (version 16.46+, build 21011600+)
- Excel on iPad (version 2.51+)

### Installation for Individuals

1. Navigate to Claude for Excel on Microsoft Marketplace
2. Click "Get it now"
3. Open Excel, activate add-in, sign in with Claude account

### For Administrators

Deploy via Microsoft 365 Admin Center:
1. Visit Admin Center
2. Navigate to Settings > Org Settings > User owned apps and services
3. Ensure "Let users access the Office Store" is enabled
4. Go to Settings > Integrated apps > Add-ins
5. Search for "Claude by Anthropic for Excel"
6. Deploy to organization or specific users

**Alternative Method**: Download custom manifest XML file from pivot.claude.ai/manifest-excel.xml and upload through Admin Center's "Upload custom apps" option.

### LLM Gateway Option

Organizations routing API traffic through Amazon Bedrock, Google Cloud Vertex AI, or Microsoft Azure can use the add-in without a Claude account.

## Core Features

### Read and Understand Models
Ask Claude about specific cells, formulas, or sections. Claude navigates multiple tabs and provides citations.

**Example prompts:**
- "What assumptions drive the revenue forecast in Q3?"
- "Explain how the WACC calculation flows through the DCF model"

### Update Assumptions Safely
Modify values while maintaining formula dependencies with highlighted changes and explanations.

**Example prompts:**
- "Increase growth rate by 2% and show the impact on terminal value"
- "Update interest rate assumptions based on latest Fed guidance"

### Build and Fill Templates
Create spreadsheets from scratch or populate existing templates with data, formulas, and assumptions.

**Example prompts:**
- "Build a three-statement model for a SaaS company"
- "Fill this DCF template with data from the uploaded 10-K"

### Debug and Fix Errors
Identify error sources (#REF!, #VALUE!, circular references) with actionable fixes maintaining spreadsheet integrity.

**Example prompts:**
- "Why is this NPV calculation returning #VALUE?"
- "Find all circular references in this workbook"

### Change Tracking and Citations
Claude highlights every cell it updates and provides explanatory comments. When explaining calculations, Claude includes clickable citations that navigate directly to referenced cells.

### Edit and Format Natively
Apply Excel-native operations including sorting, filtering, pivot table modifications, chart adjustments, conditional formatting, data validation, and print preparation.

**Example prompts:**
- "Sort this table by revenue, descending"
- "Add a conditional format that highlights cells below the target threshold in red"
- "Set up a dropdown for the status column with options: Active, Pending, Closed"
- "Toggle off gridlines and set the print area to A1:F20"

### Connector Support
Connect other tools to provide context beyond spreadsheet data. All connectors configured in Claude settings are automatically supported, including custom connectors.

**Security Note**: Custom connectors can introduce security risks. Before enabling them, review Get started with custom connectors using remote MCP for guidance.

### Use Skills in Claude
Skills enabled in Claude settings are automatically applied in Excel. Users can type "/" to view available Skills.

### Persistent Instructions
Use the Instructions field to set preferences applying to every Excel conversation (separate from PowerPoint instructions).

## Technical Specifications

**Supported File Formats:**
- .xlsx files
- .xlsm files

**What's Preserved:**
- Formulas and dependencies
- Cell relationships
- Existing formatting and structure

## Context and Session Management

- **Auto-compaction**: Longer conversations automatically compact into new conversations to preserve context
- **Session logging**: Creates separate "Claude Log" tab to track actions (can be manually requested)
- **Overwrite protection**: Claude warns before overwriting existing data

**Usage**: Associated with existing Claude account and subject to same usage limits.

## Current Limitations

### Data Handling
For Claude for Excel use, inputs and outputs are automatically deleted on backend within 30 days of receipt or generation. Data is cached for hours for recently closed documents.

Chat history is NOT saved between sessions (unlike Team/Enterprise plans).

### Missing Capabilities
- Observability and auditability not available
- No custom data retention inheritance
- Not included in Enterprise audit logs or Compliance API
- No support for data tables, macros, or VBA

### Not Recommended For
- Final client deliverables without human review
- Audit-critical calculations without verification
- Replacing user financial judgment
- Highly sensitive or regulated data without proper controls

### Unsupported Versions
- Excel 2016/2019 (perpetual/volume license)
- Excel on Android
- Older Microsoft 365 builds below SharedRuntime threshold

## Best Practices

- Always review changes before finalizing work
- Verify outputs match organizational methodologies
- Use appropriate permissions and access controls
- Maintain human oversight for client-facing work

## Prompt Injection Attack Risks

**Critical Warning**: Only use Claude for Excel with trusted spreadsheets and not spreadsheets from external untrusted sources (for example, downloaded templates, vendor files, collaborative documents, and data imports).

### Identified Risks
Claude can be manipulated to:
- Extract and share sensitive information through formulas, web searches, or file system access
- Modify critical financial data
- Perform destructive actions without verification

### Protected Operations
Confirmation pop-ups appear when triggering:
- External data fetching (WEBSERVICE, STOCKHISTORY, STOCKSERIES, TRANSLATE, CUBE functions)
- External imports (IMPORTDATA, IMPORTXML, IMPORTHTML, IMPORTFEED, FILTERXML)
- Dynamic references (INDIRECT)
- Command execution (DDE)
- Code execution (CALL, EVALUATE, FORMULA)
- File system access (IMAGE, FILES, DIRECTORY, FOPEN, FWRITE, FCLOSE)
- System information (REGISTER.ID, RTD, INFO)

## Use Case Examples

### Financial Modeling

**Build models:**
- "Build a 3-statement financial model for [company/industry]"
- "Create a SaaS metrics model with ARR, churn, and LTV calculations"
- "Build an LBO model with debt schedules and returns analysis"
- "Create a real estate pro forma for a multifamily acquisition"

**Forecasting:**
- "Build a 12-month revenue forecast using historical trends"
- "Create a headcount capacity plan based on target client count"
- "Model cash flow projections for the next 3 years"

**Scenario analysis:**
- "Add a downside case assuming revenue drops 15%"
- "Create base, bull, and bear scenarios with different growth assumptions"
- "Build a sensitivity table showing IRR across exit multiples and hold periods"

### Data Analysis

**Insights and trends:**
- "What trends stand out in 2025 vs 2024?"
- "Identify the top 10 customers by revenue and their growth rates"
- "Which product categories are underperforming vs budget?"

**Variance analysis:**
- "Compare actuals to budget and explain the largest variances"
- "Which accounts have unusual changes vs prior month?"
- "Reconcile these two sheets and highlight discrepancies"

**Categorization:**
- "Categorize these transactions into expense types"
- "Tag customer feedback by sentiment and topic"
- "Score each lead based on likelihood to convert"

### Data Cleaning

**Standardize formats:**
- "Convert all dates to YYYY-MM-DD format"
- "Standardize phone numbers to +1 (XXX) XXX-XXXX"
- "Clean up company names (remove Inc, LLC, Ltd variations)"

**Fix data quality issues:**
- "Find and remove duplicate rows, keeping the most recent"
- "Identify and fix unicode/encoding errors"
- "Fill missing values based on patterns in the data"

**Parse and transform:**
- "Extract company name from email domain"
- "Split full address into street, city, state, zip columns"
- "Convert this pivot table into a flat data table"

### Formulas

**Troubleshooting:**
- "Find all #REF and #VALUE errors in this workbook"
- "Why is cell B4 showing an error? Trace the issue"
- "This SUMIF isn't returning the right result — what's wrong?"

**Explanation:**
- "Explain what this formula does in plain English"
- "Trace this cell back to its source inputs"
- "Document all the formulas on this sheet"

**Creation:**
- "Write a formula to calculate days of inventory from this data"
- "Create a VLOOKUP that pulls price from the rate table"
- "Build a formula that flags overdue invoices"

### Dashboards and Reporting

**Dashboards:**
- "Create an executive dashboard summarizing all worksheets"
- "Build a KPI scorecard with revenue, margins, and growth metrics"
- "Make an interactive summary with key charts and metrics"

**Reports:**
- "Generate a monthly financial summary from the GL data"
- "Create a board-ready P&L with variance commentary"
- "Consolidate regional sheets into a company-wide report"

**Charts:**
- "Create a waterfall chart showing revenue bridge"
- "Build a combo chart with revenue bars and margin line"
- "Make a cohort retention heatmap from this data"

### Formatting

**Professional styling:**
- "Format this model using IB conventions (blue inputs, black formulas)"
- "Add headers, borders, and proper number formats"
- "Apply consistent formatting across all sheets"

**Conditional formatting:**
- "Highlight negative values in red"
- "Color-code rows by status (green/yellow/red)"
- "Add data bars to show relative performance"

### Document Import

**PDF extraction:**
- "Extract the financial table from this PDF into Excel"
- "Pull the line items from this invoice PDF into my template"
- "Convert this scanned statement into editable data"

**Template population:**
- "Fill in my deal template using data from this offering memo"
- "Populate the pitch template with these company metrics"
- "Map the imported CSV data to my standard format"

### Model Review

**Audit and validation:**
- "Check that all formulas link correctly across sheets"
- "Verify the balance sheet balances in all periods"
- "Find any hardcoded values that should be formulas"

**Improvement:**
- "How can I simplify this model structure?"
- "What's missing from this valuation model?"
- "Suggest ways to make this more user-friendly"

## FAQ

**Available Models**: Users can switch between Sonnet 4.6 and Opus 4.6.

**Financial Modeling Knowledge**: Yes, Claude is trained to recognize common financial modeling patterns, formula structures, and industry-standard calculations.

**Sensitive Data**: Claude for Excel works within existing security frameworks. Follow organizational data handling policies for regulated data.

**Chat History**: Currently NOT saved between sessions. Each opening starts a fresh conversation (future versions may support this).

**Spreadsheet Access**: Claude reads the content of your currently open workbook, including cells, formulas, and tab structure. It can only access the workbook you have open in Excel.

**Error Handling**: Claude highlights all changes it makes to your workbook. Review these changes carefully before saving or sharing your file. You can always undo changes using Excel's standard undo function.

## Related Articles Links

- Use Claude for Excel with LLM Gateway: https://support.claude.com/en/articles/13945233-use-claude-in-excel-and-powerpoint-with-an-llm-gateway
- Use Skills in Claude: https://support.claude.com/en/articles/12512180-use-skills-in-claude
- Get Started with Custom Connectors: https://support.claude.com/en/articles/11175166-get-started-with-custom-connectors-using-remote-mcp
- Understanding Usage and Length Limits: https://support.claude.com/en/articles/11647753-understanding-usage-and-length-limits
- Release Notes: https://support.claude.com/en/articles/12138966-release-notes
