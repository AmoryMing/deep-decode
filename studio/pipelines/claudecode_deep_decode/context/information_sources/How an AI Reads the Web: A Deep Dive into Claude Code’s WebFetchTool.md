

How an AI Reads the Web: A Deep Dive into Claude Code’s WebFetchTool

--




On March 31, 2026, the leak of the Claude Code source code provided a rare window into the inner workings of a production-grade AI coding tool. This is the first entry in a series where we deconstruct its core modules.

Claude Code’s capabilities are driven by its tool system — a collection of over 65 specialized tools that handle everything from reading files and executing commands to spawning sub-agents. Today, we’re cracking open one of the most essential: WebFetchTool, the module that allows the AI to “read” the web.

At first glance, this is a task that could be handled by a simple curl command. Yet, in Claude Code, it spans 1,131 lines of code across five files. Permission controls, redirect interception, HTML-to-Markdown conversion, copyright guardrails, and secondary-model summarization—each layer reveals a fascinating set of engineering trade-offs.

The 90-Domain Whitelist
By default, WebFetchTool is cautious. It requires manual user approval before accessing any domain. However, it maintains a pre-approved whitelist of approximately 90 domains that it can access silently.

The list is comprehensive: official documentation for programming languages (docs.python.org, doc.rust-lang.org, go.dev), major frameworks (react.dev, nextjs.org, fastapi.tiangolo.com), cloud services (docs.aws.amazon.com, kubernetes.io), and Anthropic’s own documentation. Essentially, if a developer needs to look it up, it’s probably on the list.

Server-Side Blacklist Pre-flight
Even if a domain is user-approved, WebFetchTool doesn't just charge ahead. Before initiating a request, it performs a domain check against Anthropic’s API. This is a dynamically maintained server-side blacklist designed to intercept malicious domains in real-time.

One interesting detail in the caching strategy: successful checks are cached for 5 minutes, but failures are not cached. If a request fails due to a temporary network hiccup, the tool is designed to retry on the next attempt rather than permanently blacklisting the domain for the session.

The Danger of Automatic Redirects
Most HTTP clients follow redirects by default. For an AI tool, however, this is a significant attack surface. An attacker could exploit an open redirect vulnerability on a trusted domain to bounce the AI’s request to a malicious site. If a user approves trusted.com, but the request ends up at evil.com, the security model breaks.

WebFetchTool handles this by disabling automatic redirects. It only auto-follows jumps within the same domain (including adding/removing www.) up to a limit of 10 hops. For cross-domain jumps, it stops and forces the model to call WebFetch again with the new URL, triggering a fresh permission check.

Don’t Give the Model the Full Page
The most interesting part of the tool isn’t the security — it’s how it optimizes performance. The raw web content is almost never returned directly to the primary model.

Instead, WebFetchTool inserts a layer of Haiku (Anthropic’s fastest, most efficient model) to summarize the content first. While using a smaller model for pre-filtering is a common RAG (Retrieval-Augmented Generation) pattern, the specific implementation here is noteworthy:

Prompt-Driven Extraction: When the primary model calls WebFetch, it must provide a URL and a prompt. This prompt isn't for the main model; it’s for Haiku, describing exactly what information needs to be extracted. By the time the tool is called, the "extraction intent" is already set. This makes the process far more efficient than handing a massive page to the main model and asking it to find the needle in the haystack.
Selective Skipping: The tool is pragmatic. If the source content is already in Markdown format and is under 100K characters, it skips the Haiku summary and returns the original text. Technical docs are often already structured; re-summarizing them would likely lose information and add unnecessary latency.
Tool Descriptions as Architecture
WebFetchTool only performs anonymous GET requests. It is guaranteed to fail on pages requiring authentication, such as Google Docs or Confluence.

Rather than writing complex fallback logic in the code, the developers handled this through the tool description. It explicitly tells the model: WebFetch will fail on authenticated pages; please use the corresponding MCP tool instead. By moving the capability boundary into the tool’s self-description, the model can make better routing decisions before ever executing a command.

There’s a subtle detail here: this warning remains in the description even if the user hasn’t configured the relevant MCP tools. A comment in the source explains why: the tool description is part of the system prompt. If the description changes between API calls, it breaks Anthropic’s prompt cache. To maintain high cache hit rates and low latency, the description remains static, even if it’s occasionally redundant.

Copyright Guardrails: “No Lyrics Allowed”
That 90-domain whitelist serves a dual purpose: it also governs copyright constraints.

For domains on the whitelist, Haiku is allowed to quote freely and include full code samples. For any domain outside the list, Haiku receives strict instructions: quotes must not exceed 125 characters, they must be enclosed in quotation marks, and copying song lyrics is strictly forbidden.

Seeing a “no lyrics” rule in a tool built for developers makes one wonder what Anthropic’s legal department has been through :)

It’s also worth noting that even if you use “bypass permissions” mode, these copyright constraints still apply — they are baked into the content processing layer, not the permission layer.

HTML Conversion and Memory Management
The fetched HTML is converted to Markdown using the Turndown library. Since Turndown consumes about 1.4MB of heap memory, it is implemented as a lazy-loaded singleton. It’s only imported when a web request is actually made, saving resources for conversations that don't involve the web.

To manage memory during the conversion of large pages (where the DOM tree can swell to 3–5x the size of the raw HTML), the code immediately sets the axios response buffer reference to null before handing the data to Turndown. This ensures the Garbage Collector (GC) can reclaim that memory as early as possible, preventing a "double memory" spike.

That’s the breakdown of WebFetchTool. The Claude Code leak is full of these "production-grade" nuances that separate a weekend project from a tool used by thousands of engineers. We’ll dive into more modules in the next post.

Press enter or click to view image in full size

Claude
Claude Code
--



Tao Lin
Written by Tao Lin
1 follower
·
5 following
No responses yet
Help

Status

About

Careers

Press

Blog

Privacy

Rules

Terms

Text to speech

TwinMind
TwinMind

Ask TwinMind
Page icon
Summarize

Voice Typing
⌥D
Disable for this site
Disable for all sites