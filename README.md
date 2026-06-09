<div align="center">

# Deep-Decode · AI Content Factory

**One idea or URL in. A full multi-format content suite out.**

Deep-dive article · comic-style infographics · illustrated doc · podcast · video —
produced by a deterministic **skill-graph** pipeline, then driven to publish-ready on every channel.

[![Stars](https://img.shields.io/github/stars/AmoryMing/deep-decode?style=for-the-badge&logo=github&color=da7756)](https://github.com/AmoryMing/deep-decode/stargazers)
[![Last commit](https://img.shields.io/github/last-commit/AmoryMing/deep-decode/deploy?style=for-the-badge&color=2b7489)](https://github.com/AmoryMing/deep-decode/commits/deploy)
![Decoded pieces](https://img.shields.io/badge/decoded%20pieces-155%2B-blue?style=for-the-badge)
![Built with Claude Code](https://img.shields.io/badge/built%20with-Claude%20Code-da7756?style=for-the-badge)
![Next.js](https://img.shields.io/badge/web-Next.js%2015-black?style=for-the-badge&logo=next.js)

**English** · [简体中文](README.zh-CN.md)

<br/>

<img src="https://cdn.jsdelivr.net/gh/AmoryMing/deep-decode@deploy/output/2026-04-29-skill-graphs-2/00_cover.png" width="780" alt="Deep-Decode content factory" />

</div>

---

## What is this

**Deep-Decode is an opinionated, end-to-end AI content factory.**

Give it a blog post, a tweet, a product, a person, or a trending topic. It researches the source, writes an **opinion-dense deep-dive** (not a translation, not a summary), draws **comic-style infographics**, lays out an **illustrated document**, voices a **podcast**, cuts a **video**, and pushes every format to publish-ready across email, WeChat, Xiaohongshu, Video Accounts and Douyin.

The whole run is orchestrated by a declarative **skill graph** and a deterministic runner that *refuses to advance until each step's artifact passes its contract*. No silently-skipped steps. File = state. Failure is visible.

This is not a demo. The `output/` folder holds **155+ real pieces** shipped through the pipeline.

## Why it's different from "ask an LLM to write a post"

| | Generic LLM prompt | Deep-Decode |
|---|---|---|
| **Stance** | Translates / summarizes | Reconstructs the argument with its own framework; opinion density > information density |
| **Rigor** | Single source, no checking | Cross-checks 2–3 external signals; coins a name when it spots an unnamed phenomenon |
| **Output** | One blob of text | 5 formats from one source of truth — article, infographics, doc, podcast, video |
| **Reliability** | "Hope the agent finished" | Declarative graph + hard artifact gates; a missing file *stops* the run |
| **Reach** | Copy-paste yourself | Auto-driven to draft-ready on 5 Chinese platforms |

## Product tour

Real outputs, straight from the pipeline (click any image to view the piece).

<table>
<tr>
<td width="33%"><a href="output/2026-04-29-skill-graphs-2/article.md"><img src="https://cdn.jsdelivr.net/gh/AmoryMing/deep-decode@deploy/output/2026-04-29-skill-graphs-2/00_cover.png" alt="cover"/></a><br/><b>Cover</b><br/><i>Every piece opens with a series cover built for social feeds.</i></td>
<td width="33%"><a href="output/2026-04-17-letta-context-constitution/article.md"><img src="https://cdn.jsdelivr.net/gh/AmoryMing/deep-decode@deploy/output/2026-04-17-letta-context-constitution/00_cover.png" alt="cover"/></a><br/><b>Concept cover</b><br/><i>One hook, one keyword, one promise.</i></td>
<td width="33%"><a href="output/2026-04-27-anthropic-product-launchroom/article.md"><img src="https://cdn.jsdelivr.net/gh/AmoryMing/deep-decode@deploy/output/2026-04-27-anthropic-product-launchroom/00_cover.png" alt="cover"/></a><br/><b>Topic cover</b><br/><i>Decoded from a single source URL.</i></td>
</tr>
<tr>
<td><a href="output/2026-04-29-skill-graphs-2/article.md"><img src="https://cdn.jsdelivr.net/gh/AmoryMing/deep-decode@deploy/output/2026-04-29-skill-graphs-2/02_three_layers.png" alt="architecture infographic"/></a><br/><b>Architecture infographic</b><br/><i>Complex logic compressed into one visual.</i></td>
<td><a href="output/2026-04-17-letta-context-constitution/article.md"><img src="https://cdn.jsdelivr.net/gh/AmoryMing/deep-decode@deploy/output/2026-04-17-letta-context-constitution/02_three_piece_timeline.png" alt="timeline infographic"/></a><br/><b>Timeline infographic</b><br/><i>Narrative shown, not bullet-listed.</i></td>
<td><a href="output/2026-04-27-anthropic-product-launchroom/article.md"><img src="https://cdn.jsdelivr.net/gh/AmoryMing/deep-decode@deploy/output/2026-04-27-anthropic-product-launchroom/03_eval_loop.png" alt="loop infographic"/></a><br/><b>Process infographic</b><br/><i>SVG-drawn, then rasterized at 2×.</i></td>
</tr>
</table>

Beyond infographics, every deep run can also emit a **GPT-Image** illustration set, a **podcast** (`podcast.mp3`), a **video** (`video.mp4`), an **illustrated Word doc** (`.docx`), and **Xiaohongshu card decks** — all addressed by the same `output/<slug>/` contract.

<div align="center">
<img src="https://cdn.jsdelivr.net/gh/AmoryMing/deep-decode@deploy/output/2026-05-08-codex-pets-state-personification/00_gpt_image_hero.png" width="600" alt="GPT-Image backend example"/>
<br/><i>GPT-Image backend — switchable per project via <code>image_backend: gpt-image</code>.</i>
</div>

## How it works — the skill graph

The old pipeline was ~18 prose steps in a doc. Agents running a deep chain would *silently get lost* — skip a step, use the wrong template, stop at an email draft instead of shipping. So the flow became a **declarative graph** (`skillgraph.yaml`) traversed by a deterministic runner (`tools/pipeline.py`).

```
            ┌──────────────────────────────────────────────────────────┐
            │  skillgraph.yaml  —  declarative 3-layer graph            │
            │                                                          │
   compounds│  decode · brief · practice · distribute-all   ← you drive │
            │      ▲  (pick a playbook + confirm Strategy Spec)         │
  molecules │  article · infographic set · podcast · video · doc        │
            │      ▲  (each = one deliverable)                          │
     atoms  │  svg→png · tts · imagegen · tone-lint · send              │
            │      ▲  (single deterministic action)                     │
            └──────────────────────────────────────────────────────────┘
                         │  topological order computed by
                         ▼
            tools/pipeline.py  —  the ONLY authority on step order
                 status · next · gate · verify
```

- **Three layers.** `atoms` (one deterministic action) → `molecules` (one deliverable) → `compounds` (a full playbook a human drives).
- **You don't count steps.** The runner computes the topological order from `depends_on` edges.
- **Done = artifact exists *and* passes its contract.** Contracts include `file_exists`, `min_bytes`, `png_for_each_svg`, `audio_visual_sync`, `tone_match` (banned-word + voice lint), and `channel_draft_ready`. A missing artifact = stuck; the runner won't continue.
- **Humans steer at the compound layer only** — choose the playbook, confirm the Strategy Spec. Everything else the runner pulls along.

```bash
cd output/2026-06-08-some-slug
python3 ../../tools/pipeline.py status   # whole graph + ✓/✗ + next step
python3 ../../tools/pipeline.py next      # "what node runs now?"
python3 ../../tools/pipeline.py gate m.article   # verify the artifact contract
```

## Examples

A few of the 155+ pieces (titles translated; sources are decoded in Chinese):

| Piece | Source decoded |
|---|---|
| [Why Skill Graph 1.0 must collapse: humans shouldn't drive agents at the atom layer](output/2026-04-29-skill-graphs-2/article.md) | A tweet thread |
| [Karpathy joins Anthropic: star-individual migration as a roadmap signal](output/2026-05-20-karpathy-joins-anthropic/article.md) | TechCrunch |
| [0.2 points and a 7× price gap — DeepSeek V4 compresses the paradigm war into one math problem](output/2026-04-25-deepseek-v4-paradigm-shift/article.md) | Official + 3rd-party benchmarks |
| [17m05s — a Fields medalist hands the lower bound of a math PhD thesis to GPT-5.5 Pro](output/2026-05-10-gowers-gpt-5-5-math-research/article.md) | Research write-up |
| [Write your AI a constitution](output/2026-04-17-letta-context-constitution/article.md) | Letta blog |
| [Claude Code addiction: the feedback-loop slot machine](output/2026-04-15-claude-code-addiction/article.md) | Blog post |

Browse them all in `output/`, or through the web workbench below.

## The web workbench

A Next.js 15 app (`web/`) turns the factory into a three-in-one site:

| Section | Route | Access | What |
|---|---|---|---|
| **Portal** | `/`, `/post/[slug]` | public | every decoded piece — article + infographics + podcast + video |
| **Process** | `/process` | public | the three verbs + the live skill-graph (reads the real `skillgraph.yaml`) |
| **Admin** | `/admin` | login | schedule / in-progress / queue / revenue dashboard |

Static-generated, **zero media in the deploy bundle** — images/audio are rewritten to a jsDelivr CDN backed by this repo, video to GitHub raw. Deploys to Vercel with `deploy` as the production branch.

```bash
cd web
npm install
cp .env.example .env.local
npm run dev          # http://localhost:3000
```

## Repository layout

```
deep-decode/
├── .claude/skills/   # the skills: deep-decode, polish, visual, podcast, video, distribute…
├── skillgraph.yaml   # the declarative 3-layer graph (single source of step order)
├── tools/            # pipeline.py runner + atoms (tone_lint, tts_atom, imagegen_relay…)
├── output/           # 155+ shipped pieces — one folder each (article + media)
├── wiki/             # structured knowledge: topics / sources / concepts / published
├── schedule/         # queue · in-progress · published · calendar
├── styles/           # voice + feedback + best-of, multiple kits
├── readers/          # audience personas (drives tone)
├── templates/        # content + project templates
└── web/              # Next.js 15 portal + process view + admin
```

## Quick start

Deep-Decode runs as a [Claude Code](https://claude.com/claude-code) skill system.

1. Clone the repo and open it in Claude Code — the skills live under `.claude/skills/`.
2. Drop source material in `raw/`, or hand it a URL.
3. Say *"decode this"* (`/deep-decode <url>`) and confirm the Strategy Spec; the runner takes it from there to publish-ready.
4. Run the web workbench (`cd web && npm run dev`) to browse what you've made.

> Heads-up: distribution targets Chinese platforms (WeChat / Xiaohongshu / Video Accounts / Douyin) and Chinese TTS voices. The **architecture** — declarative skill graph, contract gates, one-source-to-many-formats — is fully general; fork the pattern for any language or channel set.

## Status

Actively used in production for a Chinese AI-commentary publication. `deploy` is the content branch (the default branch on GitHub); see `web/README.md` for why content lives on an orphan branch and how it's pushed.

## License

No license file yet — open an issue if you'd like to use or adapt the pipeline and we'll sort out terms.

---

<div align="center">
<sub>Built with <a href="https://claude.com/claude-code">Claude Code</a>. If the architecture is useful to you, a ⭐ helps.</sub>
</div>
