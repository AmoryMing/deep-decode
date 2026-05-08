
English
中文
Deutsch
Home36氪Article
How should Chinese AI companies "learn from Claude Code"?
极客公园
2026-04-01 16:22
A low-level mistake allowed global developers to obtain the "industry standard answer" for AI programming tools.
If someone had told me a few days ago that Anthropic, which claims to be "the most AI - security - conscious" company, would leak its core secrets twice in a single week, I'd probably have thought it was an April Fools' Day joke.

But it actually happened on the day before April Fools' Day.

On March 31st, security researcher Chaofan Shou discovered that in the Claude Code 2.1.88 version released by Anthropic on npm, there was a 59.8MB source map file. This file, which is supposed to be used for internal debugging, pointed to a zip archive in Anthropic's own Cloudflare R2 storage bucket. Inside the archive was the complete TypeScript source code of Claude Code, about 1,900 files and 512,000 lines of code.

Within a few hours, multiple mirror repositories appeared on GitHub. One project named "claw - code" gained 50,000 stars within two hours, becoming the repository on GitHub with the fastest - growing star count in history. The number of forks exceeded 41,500.

Just five days ago, Anthropic had already leaked the existence of its next - generation model, "Mythos", due to an unprotected public data cache. This new model is internally described as having "a step - change in capabilities" and being "far superior to all existing AI models" in terms of cybersecurity capabilities.

Two leaks in a week. A company that preaches security has been slapped in the face by its own security issues. The developer community's evaluation is quite unanimous - "it's incredibly ironic".

But despite the irony, the leaked content is truly valuable. A more important question is, how should AI companies "copy the homework" from this "leak"?

What's inside the "shell" of Claude Code?
Many people's first reaction is: Isn't Claude Code just a command - line tool wrapped around a model API? So what if the source code is leaked? Without the model weights, these codes are just a "shell".

This judgment is half - right. Claude Code is indeed a shell, but it's a surprisingly sophisticated one.

Let's first look at the tool system. Claude Code adopts a plugin - like architecture. Each capability - file reading and writing, shell execution, web page scraping, LSP integration - is an independent tool module with permission control. Just the tool definition layer has 29,000 lines of TypeScript.

The description of each tool is not just a simple sentence. It details when the tool should be used, how to use it, and what results are expected after use. These descriptions themselves are a form of carefully - tuned prompt engineering.

Next, let's look at the memory system. The leaked code reveals a three - layer "self - repairing memory" architecture. The bottom layer is MEMORY.md, a lightweight index file with about 150 characters per line, which is always loaded into the context. The specific project knowledge is scattered in "topic files" and loaded on demand. The original conversation records are never read back into the context as a whole, and only specific identifiers are retrieved via grep when needed.

In other words, the core problem that Anthropic's engineers spent a lot of time solving is not "how to call the API", but "how to make the model work as smartly as possible within a limited context window".

Then there's KAIROS, which has excited everyone.

This feature, named after the ancient Greek word for "the right moment", is mentioned more than 150 times in the source code. It's an autonomous daemon mode that allows Claude Code to run continuously as an always - on background agent. What's even more interesting is its "autoDream" logic - when the user is idle, the agent will perform "memory integration", merging scattered observations, eliminating logical contradictions, and transforming vague insights into definite facts.

In other words, Anthropic is evolving the AI programming assistant from a "question - answer" tool to a collaborator that "continuously understands your project and actively discovers problems".

In addition, the leaked code also contains 44 unlaunched feature flags, covering multi - agent coordination mode (COORDINATOR MODE), voice interaction (VOICE_MODE), 30 - minute remote planning sessions (ULTRAPLAN), and even a Tamagotchi - style terminal pet (BUDDY) with 18 species and rarity levels.

There are two details worth mentioning. One is the "frustration regex" - a regular expression used to detect whether the user is scolding Claude. Using a regular expression to judge the user's emotions is much faster and cheaper than using model inference.

The other is the "undercover mode". Anthropic uses Claude Code to make "stealth contributions" to public open - source projects. The system prompt clearly states: "You are running in UNDERCOVER mode... Your commit messages cannot contain any internal Anthropic information. Do not reveal your identity."

What can Chinese AI companies learn?
Now let's get back to the really important question.

In the past year, the Chinese AI programming tool market has accelerated significantly. ByteDance's Trae has evolved from the original MarsCode into an AI - native IDE, integrating the Agent mode and supporting full - process automation from requirement understanding to code writing and testing. Zhipu's CodeGeeX focuses on open - source and local deployment and has made in - depth optimizations in Chinese code understanding. Tongyi Lingma and Doubao MarsCode are also iterating rapidly.

However, when comparing these products with the leaked architecture of Claude Code, the gap lies not in "usability" but in engineering finesse.

Lesson 1: Tool descriptions are product power.

This may be the most easily overlooked and most worthy thing to learn.

The prompt descriptions of each tool in Claude Code have been extremely finely tuned - when to use, when not to use, how to handle the results after use, and how to retry in case of errors. These descriptions essentially teach the model "how to be a good programmer".

The implementation of tool use in many domestic tools is still at the stage of "giving the model a function signature and letting it guess how to use it". Just improving the tool descriptions to the level of Claude Code can significantly enhance the performance of the same model.

Lesson 2: The memory architecture has a greater impact on the user experience than model parameters.

Claude Code's three - layer memory system addresses a very real problem - the model's context window is limited, and you can't fit all historical conversations into it.

Anthropic's approach is to layer the memory - hot data is always online, warm data is loaded on demand, and cold data is only indexed. This idea is not new, but most domestic teams haven't achieved the same level of engineering finesse in AI programming tools.

Lesson 3: Emotion perception is not a mystery; it's an engineering problem.

Use a regular expression to detect whether the user is angry and then adjust the response strategy.

This solution is simple and straightforward but extremely practical. It tells you a truth - a good AI product doesn't need to use the model to solve every problem. Sometimes, a regex is enough.

Domestic teams developing AI tools often fall into the mindset of "throwing all problems at the large model", which is a waste.

Lesson 4: The direction pointed to by KAIROS is more important than KAIROS itself.

An always - on background agent that automatically organizes memory and discovers problems when the user is not using the tool.

This product direction means that the next step for AI programming assistants is not "answering questions faster", but "working even when you haven't asked a question".

Currently, almost all domestic AI programming tools are reactive - the user issues an instruction, and the tool executes it.

Whoever develops the daemon mode first may define the next - generation product form.

Where are the boundaries of "copying"?
Of course, there is a line between learning and plagiarism.

Legally, this is not open - source code but commercially - developed software that was accidentally leaked. Building a product directly based on the leaked code clearly poses copyright risks. The "claw - code" project on GitHub claims to rewrite it in Rust, but if the core logic is copied, the legal boundary remains unclear.

For Chinese companies, in the context of increasing pressure to go global, such risks need to be carefully evaluated.

Technically, many design decisions in Claude Code are deeply customized for the capabilities of the Claude model. For example, the tool descriptions are so long and detailed because Claude has strong long - context processing capabilities and won't "get distracted" due to long system prompts. If you use a model with a short context window and weak instruction - following ability, copying the same prompt strategy may backfire.

The truly smart approach is not to fork these 510,000 lines of code but to understand the trade - offs behind each design decision and then re - implement it according to the characteristics of your own model.

The architectural ideas can be learned, the tool orchestration mode can be learned, and the memory - layering strategy can be learned - but the implementation must be your own.

There is also a reality that is easily overlooked - what Anthropic leaked is just a snapshot, and their engineering team is iterating every day. The 44 feature flags mean that at least a dozen major features are queued for release.

The code you fork today will be an old version next month. Chasing to copy will never catch up; understanding the principles can help you find your own path.

The greatest significance of this leak may not lie in the technical details but in tearing off a layer of mystery - it turns out that the core AI programming tool of Anthropic is just a carefully - designed prompt orchestration and engineered tool scheduling at the bottom.

There is no black magic, just a lot of detailed polishing.

This is actually good news for Chinese AI companies. It means that the gap can be bridged. The prerequisite is that you have the patience to polish those details - rather than thinking about directly taking someone else's code and changing the name.

*Image source: LinkedIn

This article is from the WeChat official account "GeekPark" (ID: geekpark), written by Hualin Wuwang, and is published by 36Kr with authorization.

该文观点仅代表作者本人，36氪平台仅提供信息存储空间服务。

For media inquiries, interview requests, business collaboration and Recruit global ecological partners, please contact mohaiying@36kr.com.
Partner：startuprad.io
36kr Europe (eu.36kr.com) delivers global business and markets news, data, analysis, and video to the world, dedicated to building value and providing business service for companies’ global expansion.

© 2024 36kr.com. All rights reserved.

TwinMind
TwinMind

Ask TwinMind
Page icon
Summarize

Voice Typing
⌥D
Disable for this site
Disable for all sites