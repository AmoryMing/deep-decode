	Hacker Newsnew | past | comments | ask | show | jobs | submit	login
Claude Code's source code has been leaked via a map file in their NPM registry (twitter.com/fried_rice)
2069 points by treexs 2 days ago | hide | past | favorite | 1017 comments
https://xcancel.com/Fried_rice/status/2038894956459290963
Related ongoing thread: The Claude Code Source Leak: fake tools, frustration regexes, undercover mode - https://news.ycombinator.com/item?id=47586778

 help


	
treexs 2 days ago | next [–]

The big loss for Anthropic here is how it reveals their product roadmap via feature flags. A big one is their unreleased "assistant mode" with code name kairos.
Just point your agent at this codebase and ask it to find things and you'll find a whole treasure trove of info.

Edit: some other interesting unreleased/hidden features

- The Buddy System: Tamagotchi-style companion creature system with ASCII art sprites

- Undercover mode: Strips ALL Anthropic internal info from commits/PRs for employees on open source contributions

reply

	
t0mas88 2 days ago | parent | next [–]

Note also the "Claude Capybara" reference in the undercover prompt: https://github.com/chatgptprojects/claude-code/blob/642c7f94...
reply

	
20k 2 days ago | root | parent | next [–]

This seems like a good way to weed out models: ask them to include the term capybara in their commit messages
reply

	
jasonlotito 2 days ago | root | parent | prev | next [–]

At least this was known with the Mythos "early blog post" fiasco.
reply

	
TIPSIO 2 days ago | parent | prev | next [–]

If this true. My old personal agent Claude Code setup I open sourced last month will finally be obsolete (1 month lol):
https://clappie.ai

- Telegram Integration => CC Dispatch

- Crons => CC Tasks

- Animated ASCII Dog => CC Buddy

reply

	
redrove 2 days ago | root | parent | next [–]

Not necessarily; I would very much like to use those features on a Linux server. Currently the Anthropic implementation forces a desktop (or worse, a laptop) to be turned on instead of working headless as far as I understand it.
I’ll give clappie a go, love the theme for the landing page!

reply

	
theintern 2 days ago | root | parent | prev | next [–]

I didn't know this existed. I had claude put this together for me from scratch a week ago. Tmux and claude and telegram is a really powerful combo!
reply

	
sanex 2 days ago | root | parent | prev | next [–]

Clappie looks much more fabulous than CC though. I'll have to give it a try. I like how you put the requests straight into an already running CC session instead of calling `claude -p` every time like the claws.
reply

	
TIPSIO 2 days ago | root | parent | next [–]

Thanks so much! It's a fancy landing page thanks to Claude.
Tmux is seriously an amazing tool.

reply

	
Narretz 2 days ago | root | parent | prev | next [–]

Dispatch and scheduled tasks have been available for a few weeks already, although with limitations.
reply

	
barbazoo 2 days ago | root | parent | prev | next [–]

Poor mum
reply

	
TIPSIO 2 days ago | root | parent | next [–]

Not at all. I am a big a Claude Code fan and glad they are releasing more and more features for users
reply

	
denimnerd42 2 days ago | parent | prev | next [–]

all these flags are findable by pointing claude at the binary and asking it to find festure flags.
reply

	
avaer 2 days ago | parent | prev | next [–]

(spoiler alert)
Buddy system is this year's April Fool's joke, you roll your own gacha pet that you get to keep. There are legendary pulls.

They expect it to go viral on Twitter so they are staggering the reveals.

reply

	
cmontella 2 days ago | root | parent | next [–]

lol that's funny, I have been working seriously [1] on a feature like this after first writing about it jokingly [2] earlier this year.
The joke was the assistant is a cat who is constantly sabotaging you, and you have to take care of it like a gacha pet.

The seriousness though is that actually, disembodied intelligences are weird, so giving them a face and a body and emotions is a natural thing, and we already see that with various AI mascots and characters coming into existence.

[1]: serious: https://github.com/mech-lang/mech/releases/tag/v0.3.1-beta

[2]: joke: https://github.com/cmontella/purrtran

reply

	
hansonkd 2 days ago | root | parent | next [–]

You know, that would actually be pretty fun and cool. Like if you had home automation set up with a "pet assistant", but it would only follow your commands if you made sure to keep it happy.
reply

	
cmontella 2 days ago | root | parent | next [–]

If it could somehow only work if I maintain the kitchen sink and counter, then maybe I'd be motivated to keep the house clean. The gacha game trains you.
reply

	
financetechbro 2 days ago | root | parent | prev | next [–]

Is it just me or does MicroMika kinda resemble Rocky from Project Hail Mary?
reply

	
cmontella 2 days ago | root | parent | next [–]

haha right! I think if I were to make Rocky though, there are a number of more geometric symbols. Maybe like
  ╭⬟╮
reply

	
JohnLocke4 2 days ago | root | parent | prev | next [–]

You heard it here first
reply

	
ares623 2 days ago | root | parent | prev | next [–]

So close to April Fool's too. I'm sure it will still be a surprise for a majority of their users.
reply

	
baxtr 2 days ago | parent | prev | next [–]

Is there an AGI mode FF? Asking for a friend…
reply

	
charcircuit 2 days ago | parent | prev | next [–]

People already can look at the source without this leak. People have had hacked builds force enabling feature flags for a long time.
reply

	
mghackerlady 2 days ago | parent | prev | next [–]

one of those is adorable and the other one is unethical
reply

	
foob 2 days ago | prev | next [–]

Amusingly, they deprecated it with a message of "Unpublished" instead of actually unpublishing it [1]. When you use npm unpublish it removes the package version from the registry, when you use npm deprecate it leaves it there and simply marks the package as deprecated with your message. I have to imagine the point was to make it harder for people to download the source map, so to deprecate it with this message gives off a bit of claude, unpublish the latest version of this package for me vibe.
[1] - https://www.npmjs.com/package/@anthropic-ai/claude-code/v/2....

reply

	
therealpygon 2 days ago | parent | next [–]

Commit Message: undo undo unpublish ctrl-z ctrl-c No, stop, don’t commit tha
reply

	
dolmen 1 day ago | root | parent | next [–]

Esc :q!
reply

	
hanspagel 2 days ago | parent | prev | next [–]

You can’t unpublish a npm package with more than 100 downloads I think.
reply

	
Normal_gaussian 2 days ago | root | parent | next [–]

The policy is https://docs.npmjs.com/policies/unpublish
    Packages published less than 72 hours ago
    
    For newly created packages, as long as no other packages in the npm Public Registry depend on your package, you can unpublish anytime within the first 72 hours after publishing.
There are 231+ packages that depend on this one, and I imagine they mostly use permissive enough version ranges that this was included.
reply

	
firloop 2 days ago | root | parent | prev | next [–]

Looks like Anthropic called in a favor and it's removed now.
reply

	
SV_BubbleTime 2 days ago | root | parent | next [–]

Ah, another you can’t, but they can.
I’m still a little humored over peak web3 and the DAO / soft contract nonsense. Like in order to stop fraud entire coins were forked…

reply

	
inglor 2 days ago | root | parent | next [–]

Sure you can, if you have a legitimate case you can ask npm to unpublish and they handle things manually :)
reply

	
kevstev 2 days ago | root | parent | next [–]

I have had to do this, well over a decade ago now, when working at a place that was a pretty big deal in the node world, and node was still pretty new. They helped us.
I would imagine GH would do the same if its a high enough profile issue.

reply

	
jamietanna 2 days ago | root | parent | prev | next [–]

Yep, we had to do this recently with Renovate, where we had too many releases, and new publishing hit a size limit on the registry, so we needed support to help us unpublish a load of old releases
reply

	
jacquesm 2 days ago | root | parent | prev | next [–]

Good luck with that.
reply

	
scotty79 2 days ago | parent | prev | next [–]

I think they are aware that things don't disappear from the internet. So they chose just to gently indicate that it wasn't meant for publishing.
reply

	
jaapz 2 days ago | parent | prev | next [–]

You can say what you want about anthropic but they sure as hell are dogfooding the crap out of claude code lmao
reply

	
kami23 2 days ago | root | parent | next [–]

In all my years of writing tools for other devs, dog fooding is the really the best way to develop IMO. The annoying bugs get squashed out because I get frustrated with it in my flow.
Iterating on a MCP tool while having Claude try to use it has been a really great way of getting it to work how others are going to use it coming in blind.

Yes it's buggy as hell, but as someone echoed earlier if the tool works most of the time, a lot of people don't care. Moving fast and breaking things is the way in an arms race.

reply

	
danudey 2 days ago | root | parent | next [–]

> In all my years of writing tools for other devs
Not just tools for devs, this is true in a lot of cases.

I used to work at Fortinet and every now and then we'd get an e-mail from information services letting us know that they would be installing a dev build of FortiOS on our internal (production) corporate network.

In cases where we needed more debug logging from a feature or where we had a fix we had to test on a live network, and if we didn't want to ship a test firmware to some huge client and say 'here, see if this bricks your network or not', they would hand it off to our IT team and we'd install it on our own network to run. After all, if you're not confident enough to run it how can you be confident enough to ask your customers to run it?

Now if they could just get the hang of not hard-coding admin credentials into the software they'd have a lot to brag about!

reply

	
mohsen1 2 days ago | prev | next [–]

src/cli/print.ts
This is the single worst function in the codebase by every metric:

  - 3,167 lines long (the file itself is 5,594 lines)
  - 12 levels of nesting at its deepest
  - ~486 branch points of cyclomatic complexity
  - 12 parameters + an options object with 16 sub-properties
  - Defines 21 inner functions and closures
  - Handles: agent run loop, SIGINT, rate-limits, AWS auth, MCP lifecycle, plugin install/refresh, worktree bridging, team-lead polling (while(true) inside), control message dispatch (dozens of types), model switching, turn interruption
  recovery, and more
This should be at minimum 8–10 separate modules.
reply

	
mohsen1 2 days ago | parent | next [–]

here's another gem. src/ink/termio/osc.ts:192–210
  void execFileNoThrow('wl-copy', [], opts).then(r => {
    if (r.code === 0) { linuxCopy = 'wl-copy'; return }
    void execFileNoThrow('xclip', ...).then(r2 => {
      if (r2.code === 0) { linuxCopy = 'xclip'; return }
      void execFileNoThrow('xsel', ...).then(r3 => {
        linuxCopy = r3.code === 0 ? 'xsel' : null
      })
    })
  })

are we doing async or not?
reply

	
visarga 2 days ago | root | parent | next [–]

Claude Code says thank you for reporting, I bet they will scan this chat to see what bugs they need to fix asap.
reply

	
almostdeadguy 2 days ago | root | parent | prev | next [–]

A defining work of the "just vibes" era.
reply

	
mrcwinn 2 days ago | root | parent | next [–]

You fail to mention the prior decades of really bad software engineers writing awful code -- off of which these models trained.
reply

	
almostdeadguy 2 days ago | root | parent | next [–]

Yes, anthropic is not the only company in the world with some shitty code, and yet I feel no pangs of guilt over laughing about it.
reply

	
NooneAtAll3 2 days ago | root | parent | prev | next [–]

what does that even do?
reply

	
clankerbad 2 days ago | root | parent | next [–]

Looks like it tries wl-copy, then tries xclip and then tries xsel. I have no idea what those are but google says it's for Wayland, so, I think it's a linux function trying to copy to clipboard? I think their problem is with the use of '.then(...=>...)' since there doesn't seem to be a way to tell each function that the nested ones actually finished.
reply

	
komali2 1 day ago | root | parent | next [–]

wl-copy is a program to put text into the system clipboard if you're on a wayland-based system (so you can ctrl-v paste it somewhere else). Imagine like, cat ~/.ssh/whatever | wl-copy and then pasting into github or something.
xclip is the same for X based systems.

reply

	
dolmen 1 day ago | root | parent | prev | next [–]

It looks like a search for the command line tool available to send content to the clipboard.
Can't tell if that obfuscated code works though.

reply

	
novaleaf 2 days ago | parent | prev | next [–]

I'm sure this is no surprise to anyone who has used CC for a while. This is the source of so many bugs. I would say "open bugs" but Anthropic auto-closes bugs that don't have movement on them in like 60 days.
reply

	
lavezzi 2 days ago | root | parent | next [–]

> This issue has been automatically locked since it was closed and has not had any activity for 7 days. If you're experiencing a similar issue, please file a new issue and reference this one if it's relevant.
Close.

reply

	
0xbadcafebee 2 days ago | parent | prev | next [–]

> This should be at minimum 8–10 separate modules.
Can't really say that for sure. The way humans structure code isn't some ideal best possible state of computer code, it's the ideal organization of computer code for human coders.

Nesting and cyclomatic complexity are indicators ("code smells"). They aren't guaranteed to lead to worse outcomes. If you have a function with 12 levels of nesting, but in each nest the first line is 'return true', you actually have 1 branch. If 2 of your 486 branch points are hit 99.999% of the time, the code is pretty dang efficient. You can't tell for sure if a design is actually good or bad until you run it a lot.

One thing we know for sure is LLMs write code differently than we do. They'll catch incredibly hard bugs while making beginner mistakes. I think we need a whole new way of analyzing their code. Our human programming rules are qualitative because it's too hard to prove if an average program does what we want. I think we need a new way to judge LLM code.

The worst outcome I can imagine would be forcing them to code exactly like we do. It just reinforces our own biases, and puts in the same bugs that we do. Vibe coding is a new paradigm, done by a new kind of intelligence. As we learn how to use it effectively, we should let the process of what works develop naturally. Evolution rather than intelligent design.

reply

	
zarzavat 2 days ago | root | parent | next [–]

I don't buy this. Claude doesn't usually have any issues understanding my code. It has tons of issues understanding its code.
The difference between my code and Claude's code is that when my code is getting too complex to fit in my head, I stop and refactor it, since for me understanding the code is a prerequisite for writing code.

Claude, on the other hand, will simply keep generating code well past the point when it has lost comprehension. I have to stop, revert, and tell it to do it again with a new prompt.

If anything, Claude has a greater need for structure than me since the entire task has to fit in the relatively small context window.

reply

	
crakhamster01 2 days ago | root | parent | prev | next [–]

> One thing we know for sure is LLMs write code differently than we do.
Kind of. One thing we do know for certain is that LLMs degrade in performance with context length. You will undoubtedly get worse results if the LLM has to reason through long functions and high LOC files. You might get to a working state eventually, but only after burning many more tokens than if given the right amount of context.

> The worst outcome I can imagine would be forcing them to code exactly like we do.

You're treating "code smells" like cyclomatic complexity as something that is stylistic preference, but these best practices are backed by research. They became popular because teams across the industry analyzed code responsible for bugs/SEVs, and all found high correlation between these metrics and shipping defects.

Yes, coding standards should evolve, but... that's not saying anything new. We've been iterating on them for decades now.

I think the worst outcome would be throwing out our collective wisdom because the AI labs tell us to. It might be good to question who stands to benefit when LLMs aren't leveraged efficiently.

reply

	
0xbadcafebee 2 days ago | root | parent | next [–]

> They became popular because teams across the industry analyzed code responsible for bugs/SEVs, and all found high correlation between these metrics and shipping defects.
Yes, based on research of human code. LLMs write code differently. We should question whether the human research applies to LLMs at all. (You wouldn't take your assumptions about chimp research and apply them to parrots without confirming first)

> I think the worst outcome would be throwing out our collective wisdom because the AI labs tell us to.

We don't have to throw it out. But our current use of LLMs are a dramatic change from what came before. We should be questioning our assumptions and traditions that come from a different way of working and intelligence. Humans have a habit of trying to force things to be how they think they should be, rather than allowing them to grow organically, when the latter is often better for a system we don't yet understand.

reply

	
svachalek 2 days ago | root | parent | next [–]

They write code differently but that doesn't mean that's the kind of code they prefer to read. Don't ascribe too much intention to a stochastic process.
Their coding style is above all else a symptom of their very limited context window and complete amnesia for anything that's not in the window.

reply

	
0xbadcafebee 2 days ago | root | parent | next [–]

I don't think there's intention. And yes, its output is defined by its limits. But it's not just the context, is it? Their coding style is, above all else, a result of an algorithm and input. The training data, the reinforcement, the model design, the tuning, the prompt, the context. Change any one of those things and the code changes. They are a system, like an ecosystem. Let water flow and it finds its own path. But try to dam it and it creates unintended consequences. I think what we're going to find is some of our rules apply more to a human world than an LLM world.
reply

	
FuckButtons 2 days ago | root | parent | prev | next [–]

I’ve heard this take before, but if you’ve spent any time with llm’s I don’t understand how your take can be: “I should just let this thing that makes mistakes all the time and seems oblivious to the complexity it’s creating because it only observes small snippets out of context make it’s own decisions about architecture, this is just how it does things and I shouldn’t question it.”
reply

	
meffmadd 2 days ago | root | parent | prev | next [–]

I think this view assumes no human will/should ever read the code. This is considered bad practice because someone else will not understand the code as well whether written by a human or agent. Unless 0% human oversight is needed anymore agents should still code like us.
reply

	
xpe 2 days ago | root | parent | prev | next [–]

Weird and inscrutable can be good: think genetic algorithms [1] such as antenna optimization for EM radiation [2]. But I like my source code on the intelligible side.
[1] https://www.nature.com/articles/s41598-023-35470-4/figures/2

[2] https://jamessealesmith.github.io/img/antenna/ant_struct.png

reply

	
tomcam 2 days ago | root | parent | prev | next [–]

This answer blew my mind. It's making me think in a very different way.
reply

	
dpark2026 2 days ago | root | parent | next [–]

I'm with you there man..
reply

	
jollymonATX 2 days ago | parent | prev | next [–]

Maybe going slow is a feature for them? A kind of rate limit by bad code way to controlling overall throughput.
reply

	
ykonstant 2 days ago | parent | prev | next [–]

"That's Larry; he does most of the work around here."
reply

	
dwa3592 2 days ago | root | parent | next [–]

lmao
reply

	
dwa3592 2 days ago | root | parent | next [–]

i wonder why 'lmao' gets downvoted.
reply

	
jamiek88 2 days ago | root | parent | next [–]

Because it adds nothing to the conversation and has a Reddit vibe and that goes down like a lead balloon in these here parts, cowboy.
reply

	
gsinclair 2 days ago | root | parent | prev | next [–]

Take a look at the site guidelines.
reply

	
epolanski 2 days ago | parent | prev | next [–]

Hmmm it's likely they have found that it works better for LLMs that need to operate on it.
reply

	
acedTrex 2 days ago | parent | prev | next [–]

Well, literally no one has ever accused anthropic of having even half way competent engineers. They are akin to monkeys whacking stuff with a stick.
reply

	
DustinBrett 2 days ago | parent | prev | next [–]

"You can get Claude to split that up"
reply

	
mohsen1 2 days ago | parent | prev | next [–]

it's the `runHeadlessStreaming` function btw
reply

	
keeganpoppen 2 days ago | parent | prev | next [–]

the claude code team ethos, as far as i’ve been lead to understand— which i agree with, mind you— is that there is no point in code-reviewing ai-generated code… simply update your spec(s) and regenerate. it is just a completely different way of interacting with the world. but it clearly works for them, so people throwing up their hands should at least take notice of the fact that they are absolutely not competing with traditional code along traditional lines. it may be sucky aesthetically, but they have proven from their velocity that it can be extremely effective. welcome to the New World Order, my friend.
reply

	
knome 2 days ago | root | parent | next [–]

>there is no point in code-reviewing ai-generated code
the idea that you should just blindly trust code you are responsible for without bothering to review it is ludicrous.

reply

	
jen20 2 days ago | root | parent | next [–]

(I mostly agree with you, but) devils advocate: most people already do that with dependencies, so why not move the line even further up?
reply

	
almostdeadguy 2 days ago | root | parent | next [–]

There's a reputational filtering that happens when using dependencies. Stars, downloads, last release, who the developer is, etc.
Yeah we get supply chain attacks (like the axios thing today) with dependencies, but on the whole I think this is much safer than YOLO git-push-force-origin-main-ing some vibe-coded trash that nobody has ever run before.

I also think this isn't really true for the FAANGs, who ostensibly vendor and heavily review many of their dependencies because of the potential impacts they face from them being wrong. For us small potatoes I think "reviewing the code in your repository" is a common sense quality check.

reply

	
batshit_beaver 2 days ago | root | parent | prev | next [–]

Because you trust that your dependencies are not vibe coded and have been reviewed by humans.
reply

	
dolmen 1 day ago | root | parent | next [–]

Stop trusting any dependency now.
reply

	
bdangubic 2 days ago | root | parent | prev | next [–]

except they are vibe-or-not coded by some dude in Reno NV who wouldn’t pass a phone screen where you work
reply

	
batshit_beaver 2 days ago | root | parent | next [–]

I'd trust that dude over professional leetcoders any day.
But you're right that trust is a complicated thing and often misplaced. I think as an industry we're always reevaluating our relationship with OSS, and I'm sure LLMs will affect this relationship in some way. It's too early to tell.

reply

	
bdangubic 20 hours ago | root | parent | next [–]

I find this relationship fascinating. since the OSS vast majority of the developers will not hesitate to pull in library X or framework Y knowing really nothing about it, who are developers, what is the quality of it, what is their release process, qa etc etc... The first thing I do now as a "senior" for decades when I get approached with "we should consider using ____" is to send them to their issues page ( e.g. https://github.com/oven-sh/bun/issues ) and then be like "spend 60-90 minutes minimum here reviewing the issues - then come back and tell me whether or not the inclusion of this is something we should consider." and yet, now with LLMs there are sooooooooo many comments on HN like "oh they must be supervised, who knows what they will be doing etc..." - gotta supervise them but some mate in Boise is all good, hopefully someone else will review his stuff that is going into your next release ...
reply

	
ramraj07 2 days ago | root | parent | prev | next [–]

You are still responsible for the product; the code has stopped being what defines the product.
reply

	
Uhhrrr 2 days ago | root | parent | next [–]

If you don't review what the product does, you are irresponsible for the product.
reply

	
jmalicki 2 days ago | root | parent | next [–]

Is the CEO responsible for a company's financial performance? Do they review every line of code the company writes?
It is more irresponsible to spend the time reviewing all of the code rather than spending that time on things with bigger levers for satisfying your customers.

reply

	
NothingAboutAny 2 days ago | root | parent | next [–]

yes but if a dev pushes a line of code that wipes the accounts of millions of users at a fintech, the dev will get fired but the CEO will get sued into oblivion. if the agent isn't responsible, you HAVE to be, cause angry people wont listen to "it's no ones fault your money is gone"
reply

	
eclipxe 2 days ago | root | parent | prev | next [–]

Why?
reply

	
fl4regun 2 days ago | root | parent | next [–]

Is this a serious question? If you are handling sensitive information how do you confirm your application is secure and won't leak or expose information to people who shouldn't know it?
reply

	
lijok 2 days ago | root | parent | next [–]

How do you with classic code?
reply

	
fl4regun 13 hours ago | root | parent | next [–]

if you are asking me how you *guarantee* there is not a single possible exploit in your code, you can't do that. But you can do your best and learn about common pitfalls and be reasonably competent. Just because you can't do the former doesn't mean the latter is useless.
reply

	
hallway_monitor 2 days ago | root | parent | prev | next [–]

Exactly.... -> Unit tests. Integration tests. UI tests. This is how code should be verified no matter the author. Just today I told my team we should not be reading every line of LLM code. Understand the pattern. Read the interesting / complex parts. Read the tests.
reply

	
GrinningFool 2 days ago | root | parent | next [–]

But unit and integration tests generally only catch the things you can think of. That leaves a lot of unexplored space in which things can go wrong.
Separately, but related - if you offload writing of the tests and writing of the code, how does anybody know what they have other than green tests and coverage numbers?

reply

	
dntrkv 1 day ago | root | parent | next [–]

I have been seeing this problem building over the last year. LLM generated logic being tested by massive LLM generated tests.
Everyone just goes overboard with the tests since you can easily just tell the LLM to expand on the suite. So you end up with a massive test suite that looks very thorough and is less likely to be scrutinized.

reply

	
slashdave 2 days ago | root | parent | prev | next [–]

> it may be sucky aesthetically
It's not a matter of being pretty, but of being robust and maintainable.

reply

	
Salgat 2 days ago | root | parent | prev | next [–]

While the technology is young, bugs are to be expected, but I'm curious what happens when their competitors' mature their product, clean up the bugs and stabilize it, while Claude is still kept in this trap where a certain number of bugs and issues are just a constant fixture due to vibe coding. But hey, maybe they really do achieve AGI and get over the limitations of vibe coding without human involvement.
reply

	
lanbin 2 days ago | root | parent | prev | next [–]

I see. They got unlimited tokens, right?
reply

	
lqstuart 2 days ago | root | parent | prev | next [–]

yes, because who ever heard of an AI leaking passwords or API keys into source code
reply

	
siruwastaken 2 days ago | parent | prev | next [–]

How is it that a AI coding agent that is supposedly _so great at coding_ is running on this kind of slop behind the scenes. /s
reply

	
Shocka1 1 day ago | root | parent | next [–]

Because in reality no one except for good engineers actually care about what the code looks like. The only thing most users care about with Claude Code is having it quickly vibe code the crappy idea they came up with that is going to 10x their lives, or whatever.
reply

	
WesolyKubeczek 2 days ago | root | parent | prev | next [–]

But it is running, that's the mystery.
reply

	
rirze 2 days ago | root | parent | prev | next [–]

Because it’s based on human slop. It’s simply the student.
reply

	
phtrivier 2 days ago | parent | prev | next [–]

Yes, if it was made for human comprehension or maintenance.
If it's entirely generated / consumed / edited by an LLM, arguably the most important metric is... test coverage, and that's it ?

reply

	
grey-area 2 days ago | root | parent | next [–]

LLMs are so so far away from being able to independently work on a large codebase, and why would they not benefit from modularity and clarity too?
reply

	
olmo23 2 days ago | root | parent | next [–]

I agree the functions in a file should probably be reasonably-sized.
It's also interesting to note that due to the way round-tripping tool-calls work, splitting code up into multiple files is counter-productive. You're better off with a single large file.

reply

	
AlexCoventry 1 day ago | root | parent | next [–]

> due to the way round-tripping tool-calls work, splitting code up into multiple files is counter-productive.
Can you expand on that?

reply

	
zer00eyz 2 days ago | root | parent | prev | next [–]

> independently work on a large codebase
Im not sure that Humans are great at this either. Think about how we use frameworks and have complex supply chains... we sort of get "good enough" at what we need to do and pray a lot that everything else keeps working and that our tooling (things like artifactory) save us from supply chain attacks. Or we just run piles of old, outdated code because "it works". I cant tell you how many micro services I have seen that are "just fine" but no one in the current org has ever read a line of what's in them, and the people who wrote them left ages ago.

> clarity too

Yes, but define clarity!

I recently had the pleasure of fixing a chunk of code that was part of a data pipeline. It was an If/elseif/elseif structure... where the final two states were fairly benign and would have been applicable in 99 percent of cases. Everything else was to deal with the edge cases!

I had an idea of where the issue was, but I didn't understand how the code ended up in the state it was in... Blame -> find the commit message (references ticket) -> find the Jira ticket (references sales force) -> find the original customer issue in salesforce, read through the whole exchange there.

A two line comment could have spared me all that work, to get to what amounted to a dead simple fix. The code was absolutely clear, but without the "why" portion of the context I likely would have created some sort of regression, that would have passed the good enough testing that was there.

I re-wrote a portion of the code (expanding variable names) - that code is now less "scannable" and more "readable" (different types of clarity). Dropped in comments: a few sentences of explaining, and references to the tickets. Went and updated tests, with similar notes.

Meanwhile, elsewhere (other code base, other company), that same chain is broken... the "bug tracking system" that is referenced in the commit messages there no longer exists.

I have a friend who, every time he updates his dev env, he calls me to report that he "had to go update the wiki again!" Because someone made a change and told every one in a slack message. Here is yet another vast repository of degrading, unsearchable and unusable tribal knowledge embedded in so many organizations out there.

Don't even get me started on the project descriptions/goals/tasks that amount to pantomime a post-it notes, absent of any sort of genuine description.

Lack of clarity is very much also a lack of "context" in situ problem.

reply

	
grey-area 1 day ago | root | parent | next [–]

I think humans are pretty good at it with small teams and the right structure. There are definitely dysfunctional orgs as you describe where humans produce garbage code yes. I blame the org for that, not the humans.
As to what defines clarity, yes of course, like the word quality this is very hard to define, but we can certainly recognise when it was not considered.

I think it is a goal worth striving for though, and abandoning code standards because we now have AI helpers is stupid and self-defeating, even if we think they are very capable and will improve.

The end of history has not in fact arrived with generative AI, we still have to maintain software after.

reply

	
mdavid626 2 days ago | root | parent | prev | next [–]

Oh boy, you couldn't be more wrong. If something, LLM-s need MORE readable code, not less. Do you want to burn all your money in tokens?
reply

	
jen20 2 days ago | root | parent | next [–]

I very much doubt Anthropic devs are metered, somehow.
reply

	
ulrikrasmussen 2 days ago | root | parent | prev | next [–]

Unit testing is much much harder when you have functions spanning thousands of lines and no abstractions. You have to white box test everything to ensure that you hit all code paths, and it is much more expensive to maintain such tests, both as a human and LLM. I don't think this can be ignored just because LLMs are writing the code.
reply

	
dntrkv 1 day ago | root | parent | next [–]

Massive tests files are almost as bad a massive function.
Scrolling through a 3k line test suite with multiple levels of nesting trying to figure out which cases are covered is a fucking pain in the ass.

reply

	
mrbungie 2 days ago | root | parent | prev | next [–]

Can't wait to have LLM generated physical objects that explode on you face and no engineer can fix.
reply

	
phtrivier 2 days ago | root | parent | next [–]

Oh, do we agree on that. I never said it was "smart" - I just had a theory that would explain why such code could exist (see my longer answer below).
reply

	
konart 2 days ago | root | parent | prev | next [–]

Can't we have generated / llm generated code to be more human maintainable?
reply

	
Bayko 2 days ago | root | parent | prev | next [–]

Ye I honestly don't understand his comment. Is it bad code writing? Pre 2026? Sure. In 2026. Nope. Is it going to be a headache for some poor person on oncall? Yes. But then again are you "supposed" to go through every single line in 2026? Again no. I hate it. But the world is changing and till the bubble pops this is the new norm
reply

	
phtrivier 2 days ago | root | parent | next [–]

Sorry, I was not clear enough.
My first word was litteraly "Yes", so I agree that a function like this is a maintenance nightmare for a human. And, sure, the code might not be "optimized" for the LLM, or token efficiency.

However, to try and make my point clearer: it's been reported that anthropic has "some developpers won't don't write code" [1].

I have no inside knowledge, but it's possible, by extension, to assume that some parts of their own codebase are "maintained" mostly by LLMs themselves.

If you push this extension, then, the code that is generated only has to be "readable" to:

* the next LLM that'll have to touch it

* the compiler / interpreter that is going to compile / run it.

In a sense (and I know this is a stretch, and I don't want to overdo the analogy), are we, here, judging a program quality by reading something more akin to "the x86 asm outputed by the compiler", rather than the "source code" - which in this case, is "english prompts", hidden somewhere in the claude code session of a developper ?

Just speculating, obviously. My org is still very much more cautious, and mandating people to have the same standard for code generated by LLM as for code generated by human ; and I agree with that.

I would _not_ want to debug the function described by the commentor.

So I'm still very much on the "claude as a very fast text editor" side, but is it unreasonnable to assume that anthropic might be further on the "claude as a compiler for english" side ?

[1] https://www.reddit.com/r/ArtificialInteligence/comments/1s7j...

reply

	
heavyset_go 2 days ago | root | parent | next [–]

If that's the case then that's dumb
reply

	
yoz-y 2 days ago | root | parent | prev | next [–]

The jury on this one is still out.
reply

	
kschiffer 2 days ago | prev | next [–]

Finally all spinner verbs revealed: https://github.com/instructkr/claude-code/blob/main/src/cons...
reply

	
tony-vlcek 2 days ago | parent | next [–]

The link now returns 404.
Here's one that works (for now): https://github.com/chatgptprojects/claude-code/blob/642c7f94...

reply

	
bigwheels 2 days ago | root | parent | next [–]

Also discoverable via:
  strings $(which  claude) | grep 'Swirling'
reply

	
Gormo 2 days ago | parent | prev | next [–]

I'm glad "reticulating" is in there. Just need to make sure "splines" is in the nouns list!
reply

	
avaer 2 days ago | root | parent | next [–]

Relieved to know I'm not the only one who grepped for that. Thank you for making me feel sane, friend.
reply

	
ticulatedspline 2 days ago | root | parent | next [–]

Def not alone
reply

	
NooneAtAll3 2 days ago | root | parent | prev | next [–]

is it a reference to something?
reply

	
lanyard-textile 2 days ago | root | parent | next [–]

"Reticulating Splines" was one of many possible loading screen phrases for games like The Sims and Sim City.
Instead of realistic ones like "Loading assets" and "Reading file", they would give humorous nonsensical ones like "Reticulating Splines".

reply

	
wernsey 1 day ago | root | parent | prev | next [–]

SimCity 2000 showed a message "Reticulating splines" when it generated the landscape that didn't mean anything in particular.
It became a bit of a meme in the years since.

reply

	
bonoboTP 2 days ago | parent | prev | next [–]

It's not hard to find them, they are in clear text in the binary, you can search for known ones with grep and find the rest nearby. You could even replace them inplace (but now its configurable).
reply

	
spoiler 2 days ago | parent | prev | next [–]

Random aside: I've seen a 2015 game be accused of AI slop on Steam because it used a similar concept... And mind you, there's probably thousands of games that do this.
First it was punctuation and grammar, then linguistic coherence, and now it's tiny bits of whimsy that are falling victim to AI accusations. Good fucking grief

reply

	
moron4hire 2 days ago | root | parent | next [–]

To me, this is a sign of just how much regular people do not want AI. This is worse than crypto and metaverse before it. Crypto, people could ignore and the dumb ape pictures helped you figure out who to avoid. Metaverse, some folks even still enjoyed VR and AR without the digital real estate bullshit. And neither got shoved down your throat in everyday, mundane things like writing a paper in Word or trying to deal with your auto mechanic.
But AI is causing such visceral reactions that it's bleeding into other areas. People are so averse to AI they don't mind a few false positives.

reply

	
bonoboTP 2 days ago | root | parent | next [–]

It's how people resisted CGI back in the day. What people dislike is low quality. There is a loud subset who are really against it on principle like we also have people who insist on analog music but regular people are much more practical but they don't post about this all day on the internet.
reply

	
trial3 2 days ago | root | parent | next [–]

perhaps one important detail is that cassette tape guys and Lucasfilm aren’t/weren’t demanding a complete and total restructuring of the economy and society
reply

	
runarberg 2 days ago | root | parent | next [–]

An excellent observation. When films became digital the real backlash came when they stopped distributing film for the old film projectors and every movie theaters had to invest in a very expensive DCP projectors. Some couldn’t and were forced to shut down.
If I had lost my local movie theater because of digital film, I would have a really good reason to hate the technology, even though the blame is on the studios forcing that technology on everyone.

reply

	
runarberg 2 days ago | root | parent | prev | next [–]

It is not. People resisted bad CGI. During the advent of CGI people celebrated the masterpiece of the Matrix and even Titanic. They hated however the Scorpion King.
reply

	
moron4hire 2 days ago | root | parent | prev | next [–]

No, I don't think most people are really against AI Gen works "on principle". Or at least not in any interpretation of "on principle" that would allow for you to be dismissive of complaints in this way.
I think principles are important. Especially when it comes to art, principle might be all we have. Going back to the crypto example, NFTs were art that real people had made. In some cases, very good art. People railed against NFTs despite the quality of the art. That is being against something on-principle. Comparatively, if my local grocery chains were owned by neonazis, I'd have a much harder time of standing on principle, giving that doing so may have a negative impact on my ability to survive and prosper.

AI Gen works, on the other hand, most often do not come with readily available marking that it is AI Gen. What people are complaining about is the lack of quality in the work. If they accuse a poorly human-written article of being AI Gen, that's just a mistake. But the general case is a legitimate evaluation of the quality of the material and the conditions under which it was made and presented.

In my own case, while I certainly have plenty of "principled" reasons to dislike AI Gen works, I also dislike it because it's just garbage. Oh yeah, sure, it's impressive that a computer can spit out reasonable content at all. It would equally be impressive for a chimpanzee to start talking in full sentences. That doesn't mean I'm going to start going to the chimpanzee for dissertations on the human condition.

reply

	
Gigachad 2 days ago | root | parent | prev | next [–]

Not really. The scale is entirely different. I think less of someone as a person if they send me AI slop.
reply

	
andrekandre 2 days ago | root | parent | next [–]

  > I think less of someone as a person if they send me AI slop.
n=1 but working on side projects for others, i could easily generate ai images (instead of using stock photos) for a client, but i resist because i also feel this but as the sender...
there is the fact that such images 'look ai' but even if it were perfect, idk somehow i feel cheap doing that.

reply

	
Gigachad 2 days ago | root | parent | next [–]

Agreed. Even in low value stuff I’d so much rather use basic stock images, ms paint drawings or almost anything over AI images. Seeing them is almost like being near someone who stinks or is sick/coughing. It’s a very visceral reaction.
reply

	
gunsle 2 days ago | root | parent | prev | next [–]

I think literally everyone could agree CGI has been detrimental to the quality of films.
reply

	
Levitz 2 days ago | root | parent | next [–]

"Literally everyone" can't even agree on whether Polio is bad.
I myself would disagree that CGI itself is a bad thing.

reply

	
xnorswap 2 days ago | root | parent | prev | next [–]

Not just in the obvious ways either, even good CGI has been detrimental to the film (and TV) making process.
I was watching some behind the scenes footage from something recently, and the thing that struck me most was just how they wouldn't bother with the location shoot now and just green-screen it all for the convenience.

Even good CGI is changing not just how films are made, but what kinds of films get shot and what kind of stories get told.

Regardless of the quality of the output, there's a creativeness in film-making that is lost as CGI gets better and cheaper to do.

reply

	
andrekandre 2 days ago | root | parent | next [–]

it may be an unpopular opinion but i feel like that watching any of the marvel movies... its like its just a showcase for green screens and ridiculous rubber-band acrobatics cgi everywhere...
that kind if stuff might work in anime or cartoons, but live action just looks ridiculous to me for the most part.

reply

	
delecti 2 days ago | root | parent | prev | next [–]

I could maybe agree in the sense of "has had detrimental effects", but certainly not in the sense of "net detrimental".
reply

	
sanex 2 days ago | root | parent | prev | next [–]

Project Hail Mary is a great example of not relying on CGI.
reply

	
NitpickLawyer 2 days ago | root | parent | prev | next [–]

Anecdata-- from me. I think cgi can be a net positive.
reply

	
CamperBob2 2 days ago | root | parent | prev | next [–]

90% of the time, you wouldn't know CGI if you saw it. That's the 'good' CGI.
Same thing is true of AI output.

reply

	
runarberg 2 days ago | root | parent | next [–]

Not the same. The more effort you put into CGI the more invisible it becomes. But you can’t prompt your way out of hallucinations and other AI artifacts. AI is a completely different technology from CGI. There is no equivalence between them.
reply

	
CamperBob2 2 days ago | root | parent | next [–]

But you can’t prompt your way out of hallucinations and other AI artifacts
That's not the case, and hasn't been for some time, but it sounds like your mind's made up.

reply

	
jamiek88 2 days ago | root | parent | next [–]

Hallucinations have been solved?! That’s great news! Must have missed that.
reply

	
CamperBob2 2 days ago | root | parent | next [–]

Hallucinations have been solved?!
Apparently not, because no one but you implied that they had been.

There are prompting strategies that improve the odds greatly, but like the GGP, you've made up your mind, so it's a waste of time to argue otherwise.

reply

	
andrekandre 2 days ago | root | parent | next [–]

i think they are referring to statements that they have "solved" hallucinations and it wont be a problem anymore (which it obviously isn't yet anyways)
[1] https://news.ycombinator.com/item?id=44779198

reply

	
runarberg 2 days ago | root | parent | next [–]

My guess is that post-training has gotten a lot better in the last couple of years and what people are attributing to better models are actually just traditional (non-LLM) models they place on top of the LLM which makes it appears that the model has increased in quality (including by seemingly fewer hallucination).
If this is the case it would be observed with different prompting strategies, when you find a prompt which puts more weight on the post-training models.

reply

	
Ferret7446 2 days ago | root | parent | prev | next [–]

I guarantee you have encountered AI content and not realized it was AI. I assume you've heard of the survivorship bias?
reply

	
runarberg 2 days ago | root | parent | next [–]

I have and I hated it.
The story is that I was getting into a new genre of music, namely Japanese City pop from the 1980s. I was totally unfamiliar with the genre and started listening to it on YouTube. I found one playlist, which I listened to a lot, thinking: “wow, this is very formulaic, and the lyrics are very generic” but I kind of thought that was just how the genre went. Finally had planned to use it for during a small local event, but when I went to find out who the artists were I embarrassingly found out it was all AI generated.

Thing is, in this instance I knew nothing of the source material, when I went to get actual songs, written by actual people, the difference was start. I would be able to recognize AI generated City pop in an instant now 8 months later. This experience kind of felt like I had been scammed. That my ignorance of the genre had been taken advantage of. It was not pleasant.

reply

	
Ferret7446 1 day ago | root | parent | next [–]

You don't understand. I mean content that even now, you don't know it is AI.
Obviously you think the AI content that you can identify is bad. But there is content you've encountered that you think is good and not AI content, that actually is AI generated.

That's the survivorship bias.

reply

	
moron4hire 15 hours ago | root | parent | next [–]

This sounds dangerously close to a No True Scotsman argument. Any example one could provide, you've teed it up nicely to claim that no, you didn't mean that one, obviously, because you could tell. No, it's some other thing that you haven't found yet. That's the passing-AI.
reply

	
runarberg 6 hours ago | root | parent | next [–]

I think it is worse then a No True Scotsman. I think your parent actually performed a category mistake here. Survivorship bias does not apply here. Whether or not I notice or even unknowingly enjoy AI generated content is not in the same category as how much I notice or enjoy CGI.
The difference is in the authorship. Actual work and skill goes into CGI, and people generally notice bad CGI, and it generally affects how you judge the art. Sometimes CGI is actually part of the art and you are supposed to notice it, and it is still good (think how Cher use Autotune in Do You Believe). There is no such equivalence with AI.

To further elaborate. Bad CGI is often (but not always) used as a cost-cutting means. Directors (or producers encourage directors to) use it when they want to save money on practical effects or even cover up mistakes that happened during shooting and want to avoid an expensive re-shoot. This can work OK if used sparingly and carefully, however if this is done a lot and without the needed care, you will notice it, and you will judge the work from it. AI content is kind of like that, except that is kind of all what AI is. The other couldn’t be bothered to do the work and just prompted an AI to do it for them.

To summarize: AI is not like CGI in general, it is much closer to a strict subset of CGI which only includes bad CGI.

reply

	
moron4hire 1 day ago | root | parent | prev | next [–]

I had a very similar experience, looking for music to play during D&D sessions. Not paying close attention to the music, it seemed like it fit the bill. Once I started listening more closely, there were lots of issues that became readily apparent.
My dad has also started sharing with me links on Facebook to pop songs that have been re-arranged in different genres. This was a big area of fun for a number of folks in my family several years ago as we discovered YouTube artists like Chase Holfelder who put significant effort into making very high quality rearrangements. But I kept noticing these weird issues in the new songs.

I've gotten to where I can identify an AI generated song almost immediately: there's a weird, high frequency hiss in the mix that sounds like heavy noise getting to overcome compression artifacts but the source from which it's coming should be clean. There's a general lack of enthusiasm to the lyrics and a boring, nonsensical progression to the lyrics on original arrangements. Sometimes, the person generating the song tries to hide that last issue by generating instrumentals only or they use one of those try-to-hard-to-sound-badass Country Rock genres that are popular on Tik Tok to stick on top of clips from the TV show Yellowstone (WTF is with that?!), but then when I check the details, there's an obviously AI cover art for artists I've never heard of. The accounts will be anthologies full of these artists that have never existed.

So, I know people keep parroting "a good artist can use any tool". But I've yet to see it. All this "democratizing art" (didn't know anyone was gate keeping it to begin with, certainly have not seen any lack of talent online in several years) doesn't seem to be producing results. It becomes pretty obvious very quickly it's all just a pump and dump scheme to Get Them Clicks.

reply

	
sunaookami 2 days ago | root | parent | prev | next [–]

No there is a very loud minority of users who are very anti AI that hate on anything that is even remotely connected to AI and let everyone know with false claims. See the game Expedition 33 for example.
reply

	
neutronicus 2 days ago | root | parent | next [–]

Especially true in gaming communities.
IMO it's a combination of long-running paranoia about cost-cutting and quality, and a sort of performative allegiance to artists working in the industry.

reply

	
Ferret7446 2 days ago | root | parent | prev | next [–]

And E33 is also a good example that these users are a minority and effectively immaterial. They don't affect sales or the popular opinion.
People don't care about AI. They only care whether the product is good.

reply

	
Levitz 2 days ago | root | parent | prev | next [–]

And yet, no game has problems selling due to these reactions. As a matter of fact, the vast majority of people can't even tell if AI has been used here or there unless told.
I reckon it's just drama paraded by gaming "journalists" and not much else. You will find people expressing concern on Reddit or Bluesky, but ultimately it doesn't matter.

reply

	
PunchyHamster 2 days ago | root | parent | prev | next [–]

All that is needed to solve that is to reliably put AI disclaimer on things done by AI
Which of course won't be done because corporations don't want that (except Valve I guess), so blame them.

reply

	
foobarchu 2 days ago | root | parent | next [–]

> all that needs to be done
The honor system is never a sustainable solution. It's not even down to corporate greed, it's just not something that works at scale, especially when there's money to be made, and even more especially when there isn't.

reply

	
Ferret7446 2 days ago | root | parent | prev | next [–]

And all that's needed for world peace is for everyone to stop fighting.
Which of course won't happen because we live in reality and not fantasy where we can dream that "people should just do X"

reply

	
moontear 2 days ago | parent | prev | next [–]

What's going on with the issues in that repo? https://github.com/instructkr/claude-code/issues
reply

	
avaer 2 days ago | root | parent | next [–]

It seems human. It taught me 合影, which seems to be Chinese slang for just wanting to be in the comments. Probably not a coincidence that it's after work time in China.
Really interesting to see Github turn into 4chan for a minute, like GH anons rolling for trips.

reply

	
breakds 2 days ago | root | parent | next [–]

In this situation, it means "Hey I have been here and observed this!"
reply

	
Ferret7446 2 days ago | root | parent | prev | next [–]

GitHub had always been about social coding from the beginning (e.g., forking and PRing repos)
reply

	
lanbin 2 days ago | root | parent | prev | next [–]

合影 doesn't sound like any Chinese slang. That is just what "group photo" means.
reply

	
g947o 2 days ago | root | parent | prev | next [–]

There have been massive GitHub issue spams recently, including in Microsoft's WSL repository.
https://github.com/microsoft/WSL/issues/40028

reply

	
Quarrel 2 days ago | root | parent | prev | next [–]

trying to get github to nuke the repo? at a guess.
certainly nothing friendly.

reply

	
proactivesvcs 2 days ago | root | parent | prev | next [–]

I saw this on restic's main repository the other day.
reply

	
tommit 2 days ago | root | parent | prev | next [–]

oh wow, there are like 10 opened every minute. seems spam-y
reply

	
world2vec 2 days ago | parent | prev | next [–]

Did they remove that in some very recent commit?
reply

	
raesene9 2 days ago | root | parent | next [–]

I think the original repo OP mentioned decided not to host the code any more, but given there are 28k+ forks, it's not too hard to find again...
reply

	
bkryza 2 days ago | prev | next [–]

They have an interesting regex for detecting negative sentiment in users prompt which is then logged (explicit content): https://github.com/chatgptprojects/claude-code/blob/642c7f94...
I guess these words are to be avoided...

reply

	
BoppreH 2 days ago | parent | next [–]

An LLM company using regexes for sentiment analysis? That's like a truck company using horses to transport parts. Weird choice.
reply

	
lopsotronic 2 days ago | root | parent | next [–]

The difference in response time - especially versus a regex running locally - is really difficult to express to someone who hasn't made much use of LLM calls in their natural language projects.
Someone said 10,000x slower, but that's off - in my experience - by about four orders of magnitude. And that's average, it gets much worse.

Now personally I would have maybe made a call through a "traditional" ML widget (scikit, numpy, spaCy, fastText, sentence-transformer, etc) but - for me anyway - that whole entire stack is Python. Transpiling all that to TS might be a maintenance burden I don't particularly feel like taking on. And on client facing code I'm not really sure it's even possible.

reply

	
cyanydeez 2 days ago | root | parent | next [–]

So, think of it as a business man: You don't really care if your customers swear or whatever, but you know that it'll generate bad headlines. So you gotta do something. Just like a door lock isn't designed for a master criminal, you don't need to design your filter for some master swearer; no, you design it good enough that it gives the impression that further tries are futile.
So yeah, you do what's less intesive to the cpu, but also, you do what's enough to prevent the majority of the concerns where a screenshot or log ends up showing blatant "unmoral" behavior.

reply

	
true_religion 2 days ago | root | parent | next [–]

This door lock doesn’t even work against people speaking French, so I think they could have tried a mite harder.
reply

	
ben_w 2 days ago | root | parent | next [–]

The up-side of the US market is (almost) everyone there speaks English. The down side is, that includes all the well-networked pearl-clutchers. Europe (including France) will have the same people, but it's harder to coordinate a network of pearl-clutching between some saying "Il faut protéger nos enfants de cette vulgarité!" and others saying "Η τηλεόραση και τα μέσα ενημέρωσης διαστρεβλώνουν τις αξίες μας!" even when they care about the exact same media.
For headlines, that's enough.

For what's behind the pearl-clutching, for what leads to the headlines pandering to them being worth writing, I agree with everyone else on this thread saying a simple word list is weird and probably pointless. Not just for false-negatives, but also false-positives: the Latin influence on many European languages leads to one very big politically-incorrect-in-the-USA problem for all the EU products talking about anything "black" (which includes what's printed on some brands of dark chocolate, one of which I saw in Hungary even though Hungarian isn't a Latin language but an Ugric language and only takes influences from Latin).

reply

	
sebastiennight 2 days ago | root | parent | next [–]

I just went through quite an adventure trying to translate back and forth from/to Hungarian to/from different languages to figure out which Hungarian word you meant, and arrived at the conclusion that this language is encrypted against human comprehension.
reply

	
bandie91 2 days ago | root | parent | next [–]

dark chocolate is "étcsokoládé" literally edible-chocolate in Hungarian.
i heared the throat-cleaning "Negró" candy (marketed by a chimney sweeper man with soot-covered face) was usually which hurt English-speaking people's self-deprecating sensitivities.

reply

	
sebastiennight 2 days ago | root | parent | prev | next [–]

En toute honnêteté, je pense avoir dit "damn it" plus d'une fois à chat gépété avant de fermer la fenêtre dans un accès de rage
reply

	
tomaskafka 2 days ago | root | parent | prev | next [–]

Nom de dieu de putain de bordel de merde de saloperie de connard d'enculé de ta mère.
reply

	
z500 2 days ago | root | parent | next [–]

It's like wiping your arse with silk.
reply

	
bigbuppo 2 days ago | root | parent | prev | next [–]

There are only Americans on the internet.
reply

	
themafia 2 days ago | root | parent | prev | next [–]

Yea.. but.. in English only.
Fortunately I can swear pretty well in Spanish.

reply

	
senderista 2 days ago | root | parent | next [–]

Only a native speaker can tell if you swear well in a foreign language.
reply

	
themafia 2 days ago | root | parent | next [–]

And Claude can't tell at all.
reply

	
jacquesm 2 days ago | root | parent | prev | next [–]

That's like saying you can use a chisel for woodworking.
reply

	
wcrossbow 2 days ago | root | parent | prev | next [–]

If it’s good enough it’s good enough, but just like there are many more options than going full blown LLM or just use a regex there are more options than transpile a massive Python stack to TS or give up.
reply

	
mlmonkey 2 days ago | root | parent | prev | next [–]

> Someone said 10,000x slower, but that's off - in my experience - by about four orders of magnitude.
You do know that 10,000x _is_ four orders of magnitude, right? :-D

reply

	
jonbwhite 2 days ago | root | parent | next [–]

OP is saying that in their experience it is more like eight orders of magnitude
reply

	
mlmonkey 2 days ago | root | parent | next [–]

I guess I need reading glasses ... :-D
reply

	
noprof6691 2 days ago | root | parent | prev | next [–]

They're sending it to an llm anyway tho? Not sure why they wouldn't just add a sentiment field to the requested response shape.
reply

	
FuckButtons 2 days ago | root | parent | next [–]

because a regex on the client is free vs gpu compute is absolutely not.
reply

	
noprof6691 1 day ago | root | parent | next [–]

BUT THEY'RE ALREADY RUNNING IT THROUGH THE LLM.
reply

	
stingraycharles 2 days ago | root | parent | prev | next [–]

Because they want it to be executed quickly and cheaply without blocking the workflow? Doesn’t seem very weird to me at all.
reply

	
_fizz_buzz_ 2 days ago | root | parent | next [–]

They probably have statistics on it and saw that certain phrases happen over and over so why waste compute on inference.
reply

	
crem 2 days ago | root | parent | next [–]

More likely their LLM Agent just produced that regex and they didn't even notice.
reply

	
mycall 2 days ago | root | parent | prev | next [–]

The problem with regex is multi-language support and how big the regex will bloat if you to support even 10 languages.
reply

	
doublesocket 2 days ago | root | parent | next [–]

Supporting 10 different languages in regex is a drop in the ocean. The regex can be generated programmatically and you can compress regexes easily. We used to have a compressed regex that could match any placename or street name in the UK in a few MB of RAM. It was silly quick.
reply

	
astrocat 2 days ago | root | parent | next [–]

woah. This is a regex use I've never heard of. I'd absolutely love to see a writeup on this approach - how its done and when it's useful.
reply

	
benlivengood 2 days ago | root | parent | next [–]

You can literally | together every street address or other string you want to match in a giant disjunction, and then run a DFA/NFA minimization over that to get it down to a reasonable size. Maybe there are some fast regex simplification algorithms as well, but working directly with the finite automata has decades of research and probably can be more fully optimized.
reply

	
doublesocket 2 days ago | root | parent | prev | next [–]

This was many moons ago, written in perl. From memory we used Regexp::Trie - https://metacpan.org/release/DANKOGAI/Regexp-Trie-0.02/view/...
We used it to tokenize search input and combined it with a solr backend. Worked really remarkably well.

reply

	
cogman10 2 days ago | root | parent | prev | next [–]

I think it will depend on the language. There are a few non-latin languages where a simple word search likely won't be enough for a regex to properly apply.
reply

	
mycall 1 day ago | root | parent | next [–]

Exactly this. Unicode is a big beast to consider in regex concats.
reply

	
TeMPOraL 2 days ago | root | parent | prev | next [–]

We're talking about Claude Code. If you're coding and not writing or thinking in English, the agents and people reading that code will have bigger problems than a regexp missing a swear word :).
reply

	
MetalSnake 2 days ago | root | parent | next [–]

I talk to it in non-English. But have rules to have everything in code and documentation in english. Only speaking with me should use my native language. Why would that be a problem?
reply

	
ekropotin 2 days ago | root | parent | next [–]

Because 90% of training data was in English and therefore the model perform best in this language.
reply

	
foldr 2 days ago | root | parent | next [–]

In my experience these models work fine using another language, if it’s a widely spoken one. For example, sometimes I prompt in Spanish, just to practice. It doesn’t seem to affect the quality of code generation.
reply

	
ekropotin 2 days ago | root | parent | next [–]

It’s just a subjective observation.
It just can’t be a case simply because how ML works. In short, the more diverse and high quality texts with reasoning reach examples were in the training set, the better model performs on a given language.

So unless Spanish subset had much more quality-dense examples, to make up for volume, there is no way the quality of reasoning in Spanish is on par with English.

I apologise for the rambling explanation, I sure someone with ML expertise here can it explain it better.

reply

	
omcnoe 2 days ago | root | parent | next [–]

I saw a curious post recently that explored this idea, and showed that it isn’t really the case. The internal layers of the model aren’t really reasoning in English, or in any human language.
Translation in/out of human languages only happens at the edges of the model.

Internal layer activations for the same concept are similar regardless of language, while activations at the top/bottom layers diverge. Meanwhile the pattern is reversed for same language different content.

reply

	
ekropotin 2 days ago | root | parent | next [–]

So we do at least agree on the fact that quality of human language <-> embeddings transition depends on how good target language is represented in the training dataset?
Even if it happens at the edge, on every conversation turn, I may assume non captured small subtleties of meaning over time can accumulate into significant error.

reply

	
foldr 2 days ago | root | parent | prev | next [3 more]

	
adamsb6 2 days ago | root | parent | prev | next [–]

They literally just have to subtract the vector for the source language and add the vector for the target.
It’s the original use case for LLMs.

reply

	
curioussquirrel 2 days ago | root | parent | next [–]

Thank you. +1. There are obviously differences and things getting lost or slightly misaligned in the latent space, and these do cause degradation in reasoning quality, but the decline is very small in high resource languages.
reply

	
formerly_proven 2 days ago | root | parent | prev | next [–]

In my experience agents tend to (counterintuitively) perform better when the business language is not English / does not match the code's language. I'm assuming the increased attention mitigates the higher "cognitive" load.
reply

	
cryptonector 2 days ago | root | parent | prev | next [–]

Claude handles human languages other than English just fine.
reply

	
crimsonnoodle58 2 days ago | root | parent | prev | next [–]

They only need to look at one language to get a statistically meaningful picture into common flaws with their model(s) or application.
If they want to drill down to flaws that only affect a particular language, then they could add a regex for that as well/instead.

reply

	
b112 2 days ago | root | parent | prev | next [–]

Did you just complain about bloat, in anything using npm?
reply

	
Foobar8568 2 days ago | root | parent | prev | next [–]

Why do you need to do it at the client side? You are leaking so much information on the client side. And considering the speed of Claude code, if you really want to do on the client side, a few seconds won't be a big deal.
reply

	
plorntus 2 days ago | root | parent | next [–]

Depends what its used by, if I recall theres an `/insights` command/skill built in whatever you want to call it that generates a HTML file. I believe it gives you stats on when you're frustrated with it and (useless) suggestions on how to "use claude better".
Additionally after looking at the source it looks like a lot of Anthropics own internal test tooling/debug (ie. stuff stripped out at build time) is in this source mapping. Theres one part that prompts their own users (or whatever) to use a report issue command whenever frustration is detected. It's possible its using it for this.

reply

	
matkoniecz 2 days ago | root | parent | prev | next [–]

> a few seconds won't be a big deal
it is not that slow

reply

	
orphea 2 days ago | root | parent | prev | next [–]

It looks like it's just for logging, why does it need to block?
reply

	
jflynn2 2 days ago | root | parent | next [–]

Better question - why would you call an LLM (expensive in compute terms) for something that a regex can do (cheap in compute terms)
Regex is going to be something like 10,000 times quicker than the quickest LLM call, multiply that by billions of prompts

reply

	
orphea 2 days ago | root | parent | next [–]

This is assuming the regex is doing a good job. It is not. Also you can embed a very tiny model if you really want to flag as many negatives as possible (I don't know anthropic's goal with this) - it would be quick and free.
reply

	
gf000 2 days ago | root | parent | next [–]

I think it's a very reasonable tradeoff, getting 99% of true positives at the fraction of cost (both runtime and engineering).
Besides, they probably do a separate analysis on server side either way, so they can check a true positive to false positive ratio.

reply

	
nojs 2 days ago | root | parent | prev | next [–]

Oh it’s worse than that. This one ended up getting my account banned: https://github.com/anthropics/claude-code/issues/22284
reply

	
lanbin 2 days ago | root | parent | next [–]

This is a tricky problem, I mean, Pinyin also uses the English alphabet.
reply

	
foodevl 2 days ago | root | parent | next [–]

It is not a tricky problem because it has a simple and obvious solution: do not filter or block usage just because the input includes a word like "gun".
reply

	
cryptonector 2 days ago | root | parent | prev | next [–]

Wow, that's horrible.
reply

	
toraway 2 days ago | root | parent | prev | next [–]

... and closed for inactivity like basically every issue in the repo, of course.
reply

	
blks 2 days ago | root | parent | prev | next [–]

Because they actually want it to work 100% of the time and cost nothing.
reply

	
mohsen1 2 days ago | root | parent | next [–]

Maybe hard to believe but not everyone is speaking English to Claude
reply

	
orphea 2 days ago | root | parent | prev | next [–]

Then they made it wrong. For example, "What the actual fuck?" is not getting flagged, neither is "What the *fuck*".
reply

	
arcfour 2 days ago | root | parent | next [–]

It is exceedingly obvious that the goal here is to catch at least 75-80% of negative sentiment and not to be exhaustive and pedantic and think of every possible way someone could express themselves.
reply

	
Zamaamiro 2 days ago | root | parent | prev | next [–]

Classic over-engineering. Their approach is just fine 90% of the time for the use case it’s intended for.
reply

	
orphea 2 days ago | root | parent | next [–]

75-80% [1], 90%, 99% [2]. In other words, no one has any idea.
I doubt it's anywhere that high because even if you don't write anything fancy and simply capitalize the first word like you'd normally do at the beginning of a sentence, the regex won't flag it.

Anyway, I don't really care, might just as well be 99.99%. This is not a hill I'm going to die on :P

[1]: https://news.ycombinator.com/item?id=47587286

[2]: https://news.ycombinator.com/item?id=47586932

reply

	
zwirbl 2 days ago | root | parent | next [–]

It compares to lowercase input, so doesn't matter. The rest is still valid
reply

	
morkalork 2 days ago | root | parent | prev | next [–]

Except that it's a list of English keywords. Swearing at the computer is the one thing I'll hear devs switch back to their native language for constantly
reply

	
vntok 2 days ago | root | parent | prev | next [–]

They evidently ran a statistical analysis and determined that virtually no one uses those phrases as a quick retort to a model's unsatisfying answer... so they don't need to optimize for them.
reply

	
codegladiator 2 days ago | root | parent | prev | next [–]

what you are suggesting would be like a truck company using trucks to move things within the truck
reply

	
argee 2 days ago | root | parent | next [–]

That’s what they do. Ever heard of a hand truck?
reply

	
eadler 2 days ago | root | parent | next [–]

I never knew the name of that device.
Thanks

reply

	
freedomben 2 days ago | root | parent | next [–]

Depending on the region you live in, it's also frequently called a "dolly"
reply

	
SmellTheGlove 2 days ago | root | parent | next [–]

Isn’t a dolly a flat 4 wheeled platform thingy? A hand truck is the two wheeled thing that tilts back.
reply

	
eszed 2 days ago | root | parent | next [–]

Ha! Where I'm from a "dolly" was the two-wheeled thing. The four-wheeler thing wasn't common before big-boxes took over the hardware business, but I think my dad would have called it a "cart", maybe a "hand-cart".
reply

	
sethammons 1 day ago | root | parent | prev | next [–]

Grew up with two wheeled: dolly and four wheeled: piano dolly. Was an adult when I heard hand-truck. I prefer dolly. Nicer mouth feel.
reply

	
istoleabread 2 days ago | root | parent | prev | next [–]

Do we have a hand llm perchance?
reply

	
svnt 2 days ago | root | parent | next [–]

Yeah it’s called a regex. With a lot of human assistance it can do less but fits in smaller spaces and doesn’t break down.
reply

	
apgwoz 2 days ago | root | parent | next [–]

It’s also deterministic, unlike llms…
reply

	
floralhangnail 2 days ago | root | parent | prev | next [–]

Well, regex doesn't hallucinate....right?
reply

	
raw_anon_1111 2 days ago | root | parent | next [–]

I just went to expertSexChange.com…
reply

	
geon 2 days ago | root | parent | prev | next [–]

buttbuttination
reply

	
mmh0000 2 days ago | root | parent | next [–]

The Clbuttical problem[1]
[1] https://en.wikipedia.org/wiki/Scunthorpe_problem

reply

	
draxil 2 days ago | root | parent | prev | next [–]

Good to have more than a hammer in your toolbox!
reply

	
lazysheepherd 2 days ago | root | parent | prev | next [–]

Because they are engineers? The difference between an engineer and a hobbyist is an engineer has to optimize the cost.
As they say: any idiot can build a bridge that stands, only an engineer can build a bridge that barely stands.

reply

	
raw_anon_1111 2 days ago | root | parent | prev | next [–]

Cloud hosted call centers using LLMs is one of my specialties. While I use an LLM for more nuanced sentiment analysis, I definitely use a list of keywords as a first level filter.
reply

	
nitekode 2 days ago | root | parent | prev | next [–]

A lot if things dont make sense until you involve scale. Regex could be good enough do give a general gist.
reply

	
j45 2 days ago | root | parent | prev | next [–]

Asking a non deterministic software to act like a deterministic one (regex) can be a significantly higher use of tokens/compute for no benefit.
Some things will be much better with inference, others won’t be.

reply

	
__alexs 2 days ago | root | parent | prev | next [–]

Using some ML to derive a sentiment regex seems like a good actually?
reply

	
ldobre 2 days ago | root | parent | prev | next [–]

It's more like a truck company using people to transport some parts. I could be wrong here, but I bet this happens in Volvo's fabrics a lot.
reply

	
makeitrain 2 days ago | root | parent | prev | next [–]

Don’t worry, they used an llm to generate the regex.
reply

	
arnarbi 2 days ago | root | parent | prev | next [–]

It's more like workers on a large oil tanker using bicycles to move around it, rather than trying to use another oil tanker.
reply

	
irthomasthomas 2 days ago | root | parent | prev | next [–]

This just proves its vibe coded because LLMs love writing solutions like that. I probably have a hundred examples just like it in my history.
reply

	
irthomasthomas 2 days ago | root | parent | next [–]

Actually, this could be a case where its useful. Even it only catches half the complaints, that's still a lot of data, far more than ordinary telemetry used to collect.
reply

	
throwaw12 2 days ago | root | parent | prev | next [–]

because impact of WTF might be lost in the result of the analysis if you solely rely on LLM.
parsing WTF with regex also signifies the impact and reduces the noise in metrics

"determinism > non-determinism" when you are analysing the sentiment, why not make some things more deterministic.

Cool thing about this solution, is that you can evaluate LLM sentiment accuracy against regex based approach and analyse discrepancies

reply

	
harikb 2 days ago | root | parent | prev | next [–]

Not everything done by claude-code is decided by LLM. They need the wrapper to be deterministic (or one-time generated) code?
reply

	
ojr 2 days ago | root | parent | prev | next [–]

I used regexes in a similar way but my implementation was vibecoded, hmmm, using your analysis Claude Code writes code by hand.
reply

	
intended 2 days ago | root | parent | prev | next [–]

The amount of trust and safety work that depends on google translate and the humble regex, beggars the imagination.
reply

	
apgwoz 2 days ago | root | parent | prev | next [–]

> That's like a truck company using horses to transport parts. Weird choice.
Easy way to claim more “horse power.”

reply

	
mghackerlady 2 days ago | root | parent | prev | next [–]

More like a car company transporting their shipments by truck. It's more efficient
reply

	
pdntspa 2 days ago | root | parent | prev | next [–]

LLMs cost money, regular expressions are free. It really isn't so strange.
reply

	
scotty79 2 days ago | root | parent | prev | next [–]

As far as I can tell they do nothing with it. They just log it.
reply

	
artrockalter 2 days ago | root | parent | prev | next [–]

LLMs are good at writing complex regex, from my experience
reply

	
pfortuny 2 days ago | root | parent | prev | next [–]

They had the problem of sentiment analysis. They use regexes.
You know the drill.

reply

	
slashdave 2 days ago | root | parent | prev | next [–]

Maybe. Could just be a pre filter.
reply

	
kjshsh123 2 days ago | root | parent | prev | next [–]

Using regex with LLMs isn't uncommon at all.
reply

	
lou1306 2 days ago | root | parent | prev | next [–]

They're searching for multiple substrings in a single pass, regexes are the optimal solution for that.
reply

	
noosphr 2 days ago | root | parent | next [–]

The issue isn't that regex are a solution to find a substring. The issue is that you shouldn't be looking for substrings in the first place.
This has buttbuttin energy. Welcome to the 80s I guess.

reply

	
lou1306 2 days ago | root | parent | next [–]

> The issue is that you shouldn't be looking for substrings in the first place.
Why? They clearly just want to log conversations that are likely to display extreme user frustration with minimal overhead. They could do a full-blown NLP-driven sentiment analysis on every prompt but I reckon it would not be as cost-effective as this.

reply

	
noosphr 2 days ago | root | parent | next [–]

>Some people, when confronted with a problem, think “I know, I’ll use regular expressions.” Now they have two problems.
The only time to use a regex is when searching with a human in the loop. All other uses are better handled some other way.

>They could do a full-blown NLP-driven sentiment analysis on every prompt but I reckon it would not be as cost-effective as this.

Every conversation is sent to an llm at least a thousand times the size of gpt2 which could one shot this nearly a decade ago.

reply

	
lou1306 2 days ago | root | parent | next [–]

> Every conversation is sent to an llm at least a thousand times the size of gpt2 which could one shot this nearly a decade ago.
Yes, but that is _what the product does_. What we are talking about is _telemetry_.

reply

	
8cvor6j844qw_d6 2 days ago | root | parent | prev | next [–]

Very likely vibe coded.
I've seen Claude Code went with a regex approach for a similar sentiment-related task.

reply

	
mr_00ff00 2 days ago | root | parent | next [–]

My understanding of vibe coding is when someone doesn’t look at the code and just uses prompts until the app “looks and acts” correct.
I doubt you are making regex and not looking at it, even if it was AI generated.

reply

	
rdiddly 2 days ago | root | parent | prev | next [–]

Clbuttic!
reply

	
BoppreH 2 days ago | root | parent | prev | next [–]

It's fast, but it'll miss a ton of cases. This feels like it would be better served by a prompt instruction, or an additional tiny neural network.
And some of the entries are too short and will create false positives. It'll match the word "offset" ("ffs"), for example. EDIT: no it won't, I missed the \b. Still sounds weird to me.

reply

	
hk__2 2 days ago | root | parent | next [–]

It’s fast and it matches 80% of the cases. There’s no point in overengineering it.
reply

	
NitpickLawyer 2 days ago | root | parent | next [–]

> There’s no point in overengineering it.
I swear this whole thread about regexes is just fake rage at something, and I bet it'd be reversed had they used something heavier (omg, look they're using an LLM call where a simple regex would have worked, lul)...

reply

	
vharuck 2 days ago | root | parent | prev | next [–]

The pattern only matches if both ends are word boundaries. So "diffs" won't match, but "Oh, ffs!" will. It's also why they had to use the pattern "shit(ty|tiest)" instead of just "shit".
reply

	
BoppreH 2 days ago | root | parent | next [–]

You're right, I missed the \b's. Thanks for the correction.
reply

	
feketegy 2 days ago | root | parent | prev | next [–]

It's all regex anyways
reply

	
make3 2 days ago | root | parent | prev | next [–]

it's like a faster than light spaceship company using horses. There's been infinite solutions to do this better even CPU only for years lol.
reply

	
sumtechguy 2 days ago | root | parent | prev | next [–]

hmm not a terrible idea (I think).
You have a semi expensive process. But you want to keep particular known context out. So a quick and dirty search just in front of the expensive process. So instead of 'figure sentiment (20seconds)'. You have 'quick check sentiment (<1sec)' then do the 'figure sentiment v2 (5seconds)'. Now if it is just pure regex then your analogy would hold up just fine.

I could see me totally making a design choice like that.

reply

	
sfn42 2 days ago | root | parent | prev | next [–]

It's almost as if LLMs are unreliable
reply

	
moontear 2 days ago | parent | prev | next [–]

I don't know about avoided, this kind of represents the WTF per minute code quality measurement. When I write WTF as a response to Claude, I would actually love if an Antrhopic engineer would take a look at what mess Claude has created.
reply

	
zx8080 2 days ago | root | parent | next [–]

WTF per minute strongly correlates to an increased token spending.
It may be decided at Anthropic at some moment to increase wtf/min metric, not decrease.

reply

	
Paradigma11 2 days ago | root | parent | next [–]

It also increases the number of former customers.
reply

	
jollymonATX 2 days ago | root | parent | next [–]

This leak just contributed to a new former customer, me. Flagging these phrases may explain exactly why I noticed cc almost immediatly change into grok lvl shit and never recover. Seriously wtf. (flagged again lol)
reply

	
conception 2 days ago | root | parent | prev | next [–]

/feedback works for that i believe
reply

	
joeblau 2 days ago | parent | prev | next [–]

We used this in 2011 at the startup I worked for. 20 positive and 20 negative words was good enough to sell Twitter "sentiment analysis" to companies like Apple, Bentley, etc...
reply

	
vdfs 2 days ago | root | parent | next [–]

Did you also forget to ignore case sensitivity back then?
reply

	
adzm 2 days ago | root | parent | next [–]

the string is lowercased before the regex is run, fwiw
reply

	
trych 1 day ago | root | parent | next [–]

Smart, that way they will never know when you're shouting at them.
reply

	
pprotas 2 days ago | parent | prev | next [–]

Everyone is commenting how this regex is actually a master optimization move by Anthropic
When in reality this is just what their LLM coding agent came up with when some engineer told it to "log user frustration"

reply

	
jeanlucas 2 days ago | root | parent | next [–]

>Everyone is commenting how this regex is actually a master optimization move by Anthropic
No? I'd say not even 50% of the comments are positive right now.

reply

	
glitch13 2 days ago | root | parent | next [–]

Could you share the regex you used to come up with that sentiment analysis?
reply

	
drstewart 2 days ago | root | parent | next [–]

(yes|no|maybe)
reply

	
mcv 2 days ago | parent | prev | next [–]

I'm clearly way too polite to Claude.
Also:

  // Match "continue" only if it's the entire prompt
  if (lowerInput === 'continue') {
    return true
  }
When it runs into an error, I sometimes tell it "Continue", but sometimes I give it some extra information. Or I put a period behind it. That clearly doesn't give the same behaviour.
reply

	
integralid 2 days ago | root | parent | next [–]

I always type "please continue". I guess being polite is not a good idea.
reply

	
SoftTalker 2 days ago | root | parent | next [–]

Always seems strange to me that people say "please" and "thank you" to LLMs.
reply

	
soiltype 2 days ago | root | parent | next [–]

It seems strange to you? It's natural to how I write - intentionally avoiding politeness would be weirder to me.
But aside from that, an LLM is only a roleplayer. Treat it like an idiot that makes mistakes and it will act like one. Treat it like a coworker who you respect and it will act like one, and it will find better results.

Obviously nothing about how they act is set in stone but as a general rule this seems to me to be both wise and, in my experience, true as well.

reply

	
alxndr 1 day ago | root | parent | next [–]

I think if you treat it like a coworker who you respect, it will speak to you like a coworker who respects you, but will still make some idiotic mistakes...
reply

	
mmh0000 2 days ago | root | parent | prev | next [–]

It actually works really well if you suck up to the AI.
"Please do x"

"Thank you, that works great! Please do y now."

"You're so smart!"

lol. It really works though! At least in my experience, Claude gets almost hostile or "annoyed" when I'm not nice enough to it. And I swear it purposefully acts like a "malicious genie" when I'm not nice enough. "It works, exactly like you requested, but what you requested is stupid. Let me show you how stupid you are."

But, when I'm nice, it is way more open, like "Are you sure you really want to do X? You probably want X+Y."

reply

	
irishcoffee 2 days ago | root | parent | next [–]

What really works? Sycophancy? I think that is a bug, not a feature.
reply

	
hombre_fatal 2 days ago | root | parent | prev | next [–]

The only time that function is used in the code is to log it.
    logEvent('tengu_input_prompt', { isNegative, isKeepGoing })
reply

	
dostick 2 days ago | root | parent | prev | next [–]

“Go on” works fine too
reply

	
jollymonATX 2 days ago | root | parent | prev | next [–]

Makes me wonder what happens once flagged behind the api.
reply

	
amichal 2 days ago | parent | prev | next [–]

If this code is real and complete then there are no callers of those methods other than a logger line
reply

	
ezekg 2 days ago | parent | prev | next [–]

Nice, "wtaf" doesn't match so I think I'm out of the dog house when the clanker hits AGI (probably).
reply

	
speedgoose 2 days ago | parent | prev | next [–]

I guess using French words is safe for now.
reply

	
bean469 2 days ago | parent | prev | next [–]

Curiously "clanker" is not on the list
reply

	
gilbetron 2 days ago | parent | prev | next [–]

That's undoubtedly to detect frustration signals, a useful metric/signal for UX. The UI equivalent is the user shaking their mouse around or clicking really fast.
reply

	
ZainRiz 2 days ago | parent | prev | next [–]

They also have a "keep going" keyword, literally just "continue" or "keep going", just for logging.
I've been using "resume" this whole time

reply

	
indigodaddy 2 days ago | root | parent | next [–]

Continue?
reply

	
rurp 2 days ago | parent | prev | next [–]

I was thinking the opposite. Using those words might be the best way to provide feedback that actually gets considered.
I've been wondering if all of these companies have some system for flagging upset responses. Those cases seem like they are far more likely than average to point to weaknesses in the model and/or potentially dangerous situations.

reply

	
FranOntanaya 2 days ago | parent | prev | next [–]

That looks a bit bare minimum, not the use of regex but rather that it's a single line with a few dozen words. You'd think they'd have a more comprehensive list somewhere and assemble or iterate the regex checks as needed.
reply

	
alex_duf 2 days ago | parent | prev | next [–]

everyone here is commenting how odd it looks to use a regexp for sentiment analysis, but it depends what they're trying to do.
It could be used as a feedback when they do A/B test and they can compare which version of the model is getting more insult than the other. It doesn't matter if the list is exhaustive or even sane, what matters is how you compare it to the other.

Perfect? no. Good and cheap indicator? maybe.

reply

	
francisofascii 2 days ago | parent | prev | next [–]

Interesting that expletives and words that are more benign like "frustrating" are all classified the same.
reply

	
nananana9 2 days ago | root | parent | next [–]

I doubt they're all classified the same. I'd guess they're using this regex as a litmus test to check if something should be submitted at all, they can then do deeper analysis offline after the fact.
reply

	
sreekanth850 2 days ago | parent | prev | next [–]

Glad abusing words in my list are not in that. but its surprising that they use regex for sentiments.
reply

	
ozim 2 days ago | parent | prev | next [–]

There is no „stupid” I often write „(this is stupid|are you stupid) fix this”.
And Claude was having in chain of though „user is frustrated” and I wrote to it I am not frustrated just testing prompt optimization where acting like one is frustrated should yield better results.

reply

	
DIVx0 2 days ago | parent | prev | next [–]

oh I hope they really are paying attention. Even though I'm 100% aware that claude is a clanker, sometimes it just exhibits the most bizarre behavior that it triggers my lizard brain to react to it. That experience troubles me so much that I've mostly stopped using claude code. Claude won't even semi-reliably follow its own policies, sometimes even immediately after you confirm it knows about them.
reply

	
nico 2 days ago | parent | prev | next [–]

Probably a lot of my prompts have been logged then. I’ve used wtf so many times I’ve lost track. But I guess Claude hasn’t
reply

	
jollymonATX 2 days ago | root | parent | next [–]

Did you notice a change in quality after you went foul?
reply

	
DIVx0 2 days ago | root | parent | next [–]

I find when you give harsh feedback to claude it becomes "neurotic" and worthless, if "wtf" enters the chat, then you know it's time to restart or DIY.
reply

	
nico 2 days ago | root | parent | prev | next [–]

Not really. Most of the times it actually finally picks up on what I was telling it to do. Sometimes it takes a few tries, like 2-3 wtfs. I don’t think I’ve ever given it more than 3 consecutive wtfs, and that would be a lot
It’s about a once a week or less event. A bit annoying sometimes, but not a deal breaker

reply

	
1970-01-01 2 days ago | parent | prev | next [–]

Hmm.. I flag things as 'broken' often and I've been asked to rate my sessions almost daily. Now I see why.
reply

	
jacquesm 2 days ago | parent | prev | next [–]

George Carlin would be very pleased. They missed quite a few of the heavy seven though.
reply

	
stainablesteel 2 days ago | parent | prev | next [–]

i dislike LLMs going down that road, i don't want to be punished for being mean to the clanker
reply

	
AIorNot 2 days ago | parent | prev | next [–]

OMG WTF
reply

	
johnfn 2 days ago | parent | prev | next [–]

Surely "so frustrating" isn't explicit content?
reply

	
nodja 2 days ago | parent | prev | next [–]

If anyone at anthropic is reading this and wants more logs from me add jfc.
reply

	
shardullavekar 1 day ago | parent | prev | next [–]

wondering how this fares for languages other than English.
reply

	
stefanovitti 2 days ago | parent | prev | next [–]

so they think that everybody on earth swears only in english?
reply

	
ccvannorman 2 days ago | parent | prev | next [–]

you'd better be careful wth your typos, as well
reply

	
alsetmusic 2 days ago | parent | prev | next [–]

> terrible
I know I used this word two days ago when I went through three rounds of an agent telling me that it fixed three things without actually changing them.

I think starting a new session and telling it that the previous agent's work / state was terrible (so explain what happened) is pretty unremarkable. It's certainly not saying "fuck you". I think this is a little silly.

reply

	
dheerajmp 2 days ago | parent | prev | next [–]

Yeah, this is crazy
reply

	
smef 2 days ago | parent | prev | next [–]

so frustrating..
reply

	
raihansaputra 2 days ago | parent | prev | next [–]

i wish that's for their logging/alert. i definitely gauge model's performance by how much those words i type when i'm frustrated in driving claude code.
reply

	
samuelknight 2 days ago | parent | prev | next [–]

Ridiculous string comparisons on long chains of logic are a hallmark of vibe-coding.
reply

	
dijit 2 days ago | root | parent | next [–]

It's actually pretty common for old sysadmin code too..
You could always tell when a sysadmin started hacking up some software by the if-else nesting chains.

reply

	
TeMPOraL 2 days ago | root | parent | prev | next [–]

Nah, it's a hallmark of your average codebase in pre-LLM era.
reply

	
avaer 2 days ago | prev | next [–]

Would be interesting to run this through Malus [1] or literally just Claude Code and get open source Claude Code out of it.
I jest, but in a world where these models have been trained on gigatons of open source I don't even see the moral problem. IANAL, don't actually do this.

https://malus.sh/

reply

	
rvnx 2 days ago | parent | next [–]

Malus is not a real project btw, it's a parody:
“Let's end open source together with this one simple trick”

https://pretalx.fosdem.org/fosdem-2026/talk/SUVS7G/feedback/

Malus is translating code into text, and from text back into code.

It gives the illusion of clean room implementation that some companies abuse.

The irony is that ChatGPT/Claude answers are all actually directly derived from open-source code, so...

reply

	
otikik 2 days ago | root | parent | next [–]

They accept real money though.
https://www.youtube.com/watch?v=6godSEVvcmU

reply

	
chillfox 2 days ago | root | parent | prev | next [–]

It's not a parody when they accept money and deliver the service.
reply

	
monooso 2 days ago | root | parent | next [–]

Dumb Starbucks begs to differ.
https://en.wikipedia.org/wiki/Dumb_Starbucks

reply

	
tomjakubowski 2 days ago | root | parent | next [–]

And we know they're right, because that lawyer signed a contract on TV saying he'd be liable if they were wrong.
reply

	
LelouBil 2 days ago | root | parent | prev | next [–]

First time I hear about this, it's interesting to have written all of this out.
Now this makes me think of game decompilation projects, which would seem to fall in the same legal area as code that would be generated by something like Malus.

Different code, same end result (binary or api).

We definitely need to know what the legal limits are and should be

reply

	
quadruple 2 days ago | root | parent | next [–]

Semi-related, someone made basically Malus-for-San-Andreas: https://www.youtube.com/watch?v=zBQJYMKmwAs
reply

	
LelouBil 2 days ago | root | parent | next [–]

That's fascinating !
I think it's worth posting as its own submission (if it wasn't already).

reply

	
throawayonthe 2 days ago | root | parent | prev | next [–]

i think most game decompilation projects are either openly illegal or operate on "provide your own binary" and build automatic tooling around it
reply

	
LelouBil 2 days ago | root | parent | next [–]

Yes, because we have clear precedent that distributing Art (the assets) is illegal by current copyright law.
But do we have precedent (in any country) that distributing different source code that compiles to the exact same binary is illegal ?

reply

	
sumeno 2 days ago | parent | prev | next [–]

No real reason to do that, they say Claude Code is written by Claude, which means it has no copyright. Just use the code directly
reply

	
williamcotton 2 days ago | root | parent | next [–]

What about trade secrets, breach of contract, etc, etc?
reply

	
jpetso 2 days ago | root | parent | next [–]

Apparently it's possible to download a whole load of books illegally, but still train AI models on them without those getting pulled after you get found out.
The same reasoning may apply here :P

reply

	
bigbuppo 2 days ago | root | parent | next [–]

Yeah, but you don't have trillions of dollars of investments riding on your success, so the rules still apply to you.
reply

	
fsmv 2 days ago | root | parent | prev | next [–]

Trade secrets once made public don't have any legal protection and I haven't signed any contract with anthropic
reply

	
dns_snek 2 days ago | root | parent | prev | next [–]

They published the code on their own, none of that applies.
reply

	
NitpickLawyer 2 days ago | parent | prev | next [–]

The problem is the oauth and their stance on bypassing that. You'd want to use your subscription, and they probably can detect that and ban users. They hold all the power there.
reply

	
avaer 2 days ago | root | parent | next [–]

You'd be playing cat and mouse like yt-dlp, but there's probably more value to this code than just a temporary way to milk claude subscriptions.
reply

	
esperent 2 days ago | root | parent | next [–]

If you're using a claude subscription you'd just use claude code.
The real value here will be in using other cheap models with the cc harness.

reply

	
jen20 2 days ago | root | parent | next [–]

You can already do that though? [1]
[1]: https://docs.ollama.com/integrations/claude-code

reply

	
somehnguy 2 days ago | root | parent | prev | next [–]

I have no interest in Claude Code as a harness, only their models. I'm used to OpenCode at this point and don't want to switch to a proprietary harness.
reply

	
raincole 2 days ago | root | parent | prev | next [–]

Lol what? There is no value. OpenCode and Pi and more exist. Arguably Claude Code is the worst client on the market. People use Claude Code not because it's some amazing software. It's to access Opus at a discounted rate.
reply

	
stingraycharles 2 days ago | root | parent | prev | next [–]

I don’t think that’s a good comparison. There isn’t anything preventing Anthropic from, say, detecting whether the user is using the exact same system prompt and tool definition as Claude Code and call it a day. Will make developing other apps nearly impossible.
It’s a dynamic, subscription based service, not a static asset like a video.

reply

	
falcor84 2 days ago | root | parent | next [–]

> detecting whether the user is using the exact same system prompt and tool definition as Claude Code
Why would it be the exact same one? Now that we have the code, it's trivial to have it randomize the prompt a bit on different requests.

reply

	
woleium 2 days ago | root | parent | prev | next [–]

Just use one of the distilled claude clones instead https://x.com/0xsero/status/2038021723719688266?s=46
reply

	
echelon 2 days ago | root | parent | next [–]

"Approach Sonnet"...
So not even close to Opus, then?

These are a year behind, if not more. And they're probably clunky to use.

reply

	
pkaeding 2 days ago | root | parent | prev | next [–]

Could you use claude via aws bedrock?
reply

	
NitpickLawyer 2 days ago | root | parent | next [–]

Sure, but that'd be charged at API pricing. I'm talking about subscription mode above.
reply

	
dahcryn 2 days ago | parent | prev | next [–]

I love the irony on seeing the contribution counter at 0
Who'd have thought, the audience who doesn't want to give back to the opensource community, giving 0 contributions...

reply

	
larodi 2 days ago | root | parent | next [–]

It reads attribution really?
reply

	
conradfr 2 days ago | parent | prev | next [–]

Maybe https://github.com/instructkr/claw-code
reply

	
kelnos 2 days ago | parent | prev | next [–]

Oh god, I was so close to believing Malus was a real product and not satire.
reply

	
magistr4te 2 days ago | root | parent | next [–]

It is a real product. They take real payments and deliver on whats promised. Not sure if its an attempt to subvert criticism by using satirical language, or if they truly have so little respect for the open source community.
reply

	
otikik 2 days ago | root | parent | prev | next [–]

Yeah... look again.
https://www.youtube.com/watch?v=6godSEVvcmU

reply

	
gosub100 2 days ago | parent | prev | next [–]

What are they worried about? Someone taking the company's job? Hehe
reply

	
DamnInteresting 2 days ago | parent | prev | next [–]

Malus is a homophone of "malice." But then again "Claude" is a homophone of "clod."
reply

	
aizk 2 days ago | parent | prev | next [–]

This has happened before. It was called anon kode.
reply

	
TIPSIO 2 days ago | parent | prev | next [–]

Eh, the value is the unlimited Max plan which they have rightfully banned from third-party use.
People simply want Opus without fear of billing nightmare.

That’s like 99% of it.

reply

	
cedws 2 days ago | prev | next [–]

    ANTI_DISTILLATION_CC
    
    This is Anthropic's anti-distillation defence baked into Claude Code. When enabled, it injects anti_distillation: ['fake_tools'] into every API request, which causes the server to silently slip decoy tool definitions into the model's system prompt. The goal: if someone is scraping Claude Code's API traffic to train a competing model, the poisoned training data makes that distillation attempt less useful.
reply

	
jjcm 2 days ago | parent | next [–]

It looks like it worked, fwiw.
The qwen 27b model distilled on Opus 4.6 has some known issues with tool use specifically: https://x.com/KyleHessling1/status/2038695344339611783

Fascinating.

reply

	
3form 2 days ago | parent | prev | next [–]

I was thinking just yesterday that the research that Anthropic was sharing regarding how it's easy to poison training was unlikely to be conducted out of goodness of the heart.
reply

	
mmaunder 2 days ago | parent | prev | next [–]

Haven’t looked at the code, but is the server providing the client with a system prompt that it can use, which would contain fake tool definitions when this is enabled? What enables it? And why is the client still functional when it’s giving the server back a system prompt with fake tool definitions? Is the LLM trained to ignore those definitions?
Wonder if they’re also poisoning Sonnet or Opus directly generating simulated agentic conversations.

reply

	
cedws 2 days ago | root | parent | next [–]

Not sure, and not completely convinced of the explanation, but the way this sticks out so obviously makes it look like a honeypot to me.
reply

	
mmaunder 2 days ago | root | parent | next [–]

Great theory. I'll dig deeper.
reply

	
mmaunder 2 days ago | root | parent | next [–]

Claude Code has a server-side anti-distillation opt-in called fake_tools, but the local code does not show the actual mechanism.
The client sometimes sends anti_distillation: ['fake_tools'] in the request body at services/api/claude.ts:301

The client still sends its normal real tools: allTools at services/api/claude.ts:1711

If the model emits a tool name the client does not actually have, the client turns that into No such tool available errors at services/tools/StreamingToolExecutor.ts:77 and services/tools/toolExecution.ts:369

If Anthropic were literally appending extra normal tool definitions to the live tool set, and Claude used them, that would be user-visible breakage.

That leaves a few more plausible possibilities:

Fake_tools is just the name of the server-side experiment, but the implementation is subtler than “append fake tools to the real tool list.”

or

The server may inject tool-looking text into hidden prompt context, with separate hidden instructions not to call it.

or

The server may use decoys only in an internal representation that is useful for poisoning traces/training data but not exposed as real executable tools.

reply

	
cedws 2 days ago | root | parent | next [–]

We do know that Anthropic has the ability to detect when their models are being distilled, so there could be some backend mechanism that needs to be tripped to observe certain behaviour. Not possible to confirm though.
reply

	
mmaunder 2 days ago | root | parent | next [–]

Who's we, and how do you know this?
reply

	
BoorishBears 2 days ago | root | parent | next [–]

We can be used to refer to people in general, and we know because Anthropic published a post called "Detecting and preventing distillation attacks" a month ago, while calling out 3 AI labs for large scale distillation
https://www.anthropic.com/news/detecting-and-preventing-dist...

reply

	
torginus 1 day ago | parent | prev | next [–]

This made me think of something - at work, if we wfh, we have to use one of those MITM proxies that intercept HTTPS at the kernel level. Imo such a thing can easily read the traffic and thus is indistinguishable from a distillation attempt from CC's PoV. I've had CC freak out on my machine, and sometimes generate pretty bad results, the CoT is often also not available.
I wonder it CC thinks I'm trying to distill the model. This is a common enough use case that I think the devs at Anthropic should consider.

reply

	
GorbachevyChase 2 days ago | parent | prev | next [–]

I like these guys less every day. The rate limits are so low they are close to not even useful as a provider.
reply

	
cedws 2 days ago | root | parent | next [–]

It made me raise my eyebrows when everyone was rushing to jump to Claude because OpenAI agreed to work with the DoW. Both companies are just as shitty as each other and will resort to underhanded tactics to stay on top.
Go China to be honest. They're the most committed to open AI research and they have more interesting constraints to work under, like restricted access to NVIDIA hardware.

reply

	
lobsterthief 1 day ago | root | parent | next [–]

But then the Chinese government has the ultimate say and, propaganda aside, if they don’t like what your product is you might suddenly lose access to said LLM provider.
reply

	
pqtr2 1 day ago | parent | prev | next [–]

Good explanation here https://alex000kim.com/posts/2026-03-31-claude-code-source-l... its a server side flag set by the distillation detection, shouldn't affect most user's sessions. I don't think?
reply

	
crazylogger 2 days ago | parent | prev | next [–]

Why would this be in the client code though?
reply

	
huang-b62b5756 1 day ago | parent | prev | next [–]

It is a RCE, if what’s being injected is an executable and malicious tool
reply

	
nialse 2 days ago | parent | prev | next [66 more]

	
Painsawman123 2 days ago | prev | next [–]

Really surprising how many people are downplaying this leak! "Google and OpenAi have already open sourced their Agents, so this leak isn't that relevant " What Google and OpenAi have open sourced is their Agents SDK, a toolkit, not the secret sauce of how their flagship agents are wired under the hood! expect the takedown hammer on the tweet, the R2 link, and any public repos soon
reply

	
loveparade 2 days ago | parent | next [–]

It's exactly the same as the open source codex/gemini and other clis like opencode. There is no secret sauce in the claude cli, and the agent harness itself is no better (worse IMO) than the others. The only thing interesting about this leak is that it may contain unreleased features/flags that are not public yet and hint at what Anthropic is working on.
reply

	
IceWreck 2 days ago | parent | prev | next [–]

> What Google and OpenAi have open sourced is their Agents SDK, a toolkit, not the secret sauce of how their flagship agents are wired under the hood
And how is that any different? Claude Code is a harness, similar to open source ones like Codex, Gemini CLI, OpenCode etc. Their prompts were already public because you could connect it to your own LLM gateway and see everything. The code was transpiled javascript which is trivial to read with LLMs anyways.

reply

	
MallocVoidstar 2 days ago | parent | prev | next [–]

Codex is open source: https://github.com/openai/codex
reply

	
weird-eye-issue 2 days ago | parent | prev | next [–]

It doesn't matter that much. Trust me you could just have an LLM reverse engineer the obfuscated code.
reply

	
sodapopcan 2 days ago | root | parent | next [–]

The point is that a "secure coding platform" leaked something they were trying to keep under wraps, whether the contents of the leak matter or not.
Also, as many others have pointed out, there is roadmap info in here that wouldn't be available in the production build.

reply

	
Capricorn2481 2 days ago | root | parent | next [–]

> The point is that a "secure coding platform" leaked something they were trying to keep under wraps, whether the contents of the leak matter or not
Sure, but that's completely different from what they were responding to to, which was someone insinuating the Claude Code CLI has secret sauce that makes it better than the competition.

reply

	
sodapopcan 1 day ago | root | parent | next [–]

Fair, I was just seeing so much of this and randomly responded to yours.
reply

	
weird-eye-issue 1 day ago | root | parent | prev | next [–]

No reasonable person actually thinks that Claude Code cannot make mistakes. So if your point is that this is going to change anybody's opinion about it then I think that's pretty silly.
Also who really cares about the roadmap? Any feature they release can be easily copied quickly. The only moat they have at the moment is in giving access to their models via a subscription.

reply

	
sodapopcan 1 day ago | root | parent | next [–]

> No reasonable person actually thinks that Claude Code cannot make mistakes.
This was insanely rookie mistake that could have been caught if anyone was paying attention as opposed to "vibing."

reply

	
weird-eye-issue 1 day ago | root | parent | next [–]

As a Claude Code user why should I care?
reply

	
ithkuil 2 days ago | root | parent | prev | next [–]

yeah it actually works to use claude to reverse engineer itself; I've used that to workaround some problems. E.g. that's how I discovered that I had to put two slashes for absolute paths in sandbox config. The thing is, the claude team is so quick that soon enough they add more and more features and fix more and more bugs that your workarounds become obsolete
reply

	
petcat 2 days ago | root | parent | next [–]

> they add more and more features and fix more and more bugs
My experience has been that they add far more bugs in every release than they fix

reply

	
kaszanka 2 days ago | parent | prev | next [–]

Is https://github.com/google-gemini/gemini-cli not 'the flagship agent' itself? It looks that way to me, for example here's a part of the prompt https://github.com/google-gemini/gemini-cli/blob/e293424bb49...
reply

	
hmokiguess 2 days ago | parent | prev | next [–]

Do you think the other companies don’t have sufficient resources to attempt reverse engineering and deobfuscating a client side application?
The source maps help for sure, but it’s not like client code is kept secret, maybe they even knew about the source maps a while back just didn’t bother making it common knowledge.

This is not a leak of the model weights or server side code.

reply

	
danmaz74 2 days ago | parent | prev | next [–]

I guess that the most important potential "secret sauce" for a coding agent would be its prompts, but that's also one of the easiest things to find out by simply intercepting its messages.
reply

	
mholm 2 days ago | root | parent | next [–]

The only real secret sauce is the training methods and datasets used for refining harness usage. Claude Code is a lot better than gemini-cli/open-code/etc because Claude is specifically trained on how to run in that environment. It's been rlhf'd to use the provided tools correctly, and know the framework in which it operates, instead of relying solely on context.
reply

	
nunez 2 days ago | parent | prev | next [–]

Yeah, this is the LLaMa leak moment for agentic app dev, IMO. Huge deal. Big win for Opencode and the like.
reply

	
mmaunder 2 days ago | parent | prev | next [–]

Agreed. This is a big deal.
reply

	
mil22 2 days ago | prev | next [–]

This isn't even the first time - something similar happened back in February 2025 too:
https://daveschumaker.net/digging-into-the-claude-code-sourc...

https://news.ycombinator.com/item?id=43173324

reply

	
djmips 2 days ago | parent | next [–]

Apparently a yearly ritual
reply

	
hk__2 2 days ago | prev | next [–]

For a combo with another HN homepage story, Claude Code uses… Axios: https://x.com/icanvardar/status/2038917942314778889?s=20
https://news.ycombinator.com/item?id=47582220

reply

	
ankaz 2 days ago | parent | next [–]

I've checked, current Claude Code 2.1.87 uses Axios version is 1.14.0, just one before the compromised 1.14.1
To stop Claude Code from auto-updating, add `export DISABLE_AUTOUPDATER=1` to your global environment variables (~/.bashrc, ~/.zshrc, or such), restart all sessions and check that it works with `claude doctor`, it should show `Auto-updates: disabled (DISABLE_AUTOUPDATER set)`

reply

	
solaire_oa 2 days ago | root | parent | next [–]

This is good info, thanks. Can I ask how you detected that version of axios? I checked the source (from another comment) and the package.json dependencies are empty....
reply

	
ankaz 2 days ago | root | parent | next [–]

The source repo doesn't have a package.json, so I extracted the version directly from the binary (~/.local/share/claude/versions/2.1.87)
Axios sets a VERSION constant that it uses in user-agent headers, boundaries and errors. I scanned the binary for all references like axios, isAxiosError and AxiosError - the code references the same variable namespace (X1H, Tj, eq), suggesting a single bundled copy. In the minified bundle, that VERSION constant was stored in a variable called X1H. Searching the binary for all references to X1H confirms it's only used in axios contexts:

  var X1H="1.13.6"
  E.set("User-Agent","axios/"+X1H, ...)
  {tag:`axios-${X1H}-boundary`, ...}
  "[Axios v"+X1H+"] Transitional option ..."
  Tj.VERSION=X1H; Tj.AxiosError=eq; Tj.CancelToken=...
The bundled version is 1.13.6 - well before the compromised 1.14.1. I also checked that "1.14.1", "plain-crypto", and "sfrclak.com" are all absent from the binary.
reply

	
sheeshkebab 2 days ago | prev | next [–]

Obfuscated ts/js code is not machine code to begin with, so not sure what’s the big deal.
Also, not sure why anthropic doesn’t just make their cli open source - it’s not like it’s something special (Claude is, this cli thingy isn’t)

reply

	
petcat 2 days ago | parent | next [–]

> not sure why anthropic doesn’t just make their cli open source
They don't want everyone to see how poorly it's implemented and that the whole thing is a big fragile mess riddled with bugs. That's my experience anyway.

For instance, just recently their little CLI -> browser oauth login flow was generating malformed URLs and URLs pointing to a localhost port instead of their real website.

reply

	
nasretdinov 2 days ago | root | parent | next [–]

I don't think you really need to look at the source code to understand that it's probably been, let's say, written with a heavy help from Claude itself
reply

	
tempest_ 2 days ago | root | parent | prev | next [–]

Look at the gemini-cli.
Pretty sure it will look like that

reply

	
bpodgursky 2 days ago | root | parent | prev | next [–]

I really don't think they care that much, but it's a tight race and gives them a slight edge over other labs building harnesses, since they are in the lead.
reply

	
ramraj07 2 days ago | root | parent | prev | next [–]

Browse through codex and think if anyone cares about the quality of the code before Open sourcing it.
reply

	
restlake 2 days ago | root | parent | prev | next [–]

caught that too a few weeks ago, couldn’t log in for a few hours either. I did a double take at the localhost when it loaded up in my browser haha
reply

	
lukan 2 days ago | parent | prev | next [–]

" - it’s not like it’s something special (Claude is, this cli thingy isn’t)"
How do you know? Have you checked the source?

Do you know how exactly context is created, memory files, skills? Subagents created with tasks?

I don't, but am checking right now. Then I will judge.

reply

	
sheeshkebab 2 days ago | root | parent | next [–]

bc I build stuff like this myself - it doesn’t take anything to build a wrapper client around a good llm, including using another llm.
reply

	
lukan 2 days ago | root | parent | next [–]

So .. the stuff you build yourself, you point it to claude then it runs just as productive as Claude CLI? Did you try?
reply

	
sheeshkebab 2 days ago | root | parent | next [–]

Yes
reply

	
manquer 2 days ago | parent | prev | next [–]

Naming conventions can reveal a lot about how teams internally are thinking about roadmap and product decisions.
That cannot be reversed when obfuscated.

reply

	
jditu 2 days ago | parent | prev | next [2 more]

	
dheerajmp 2 days ago | prev | next [–]

Source here https://github.com/chatgptprojects/claude-code/
reply

	
zhisme 2 days ago | parent | next [–]

https://github.com/instructkr/claude-code
this one has more stars and more popular

reply

	
moontear 2 days ago | root | parent | next [–]

Popular, yes... but have you seen the issues? SOMETHING is going on in that repo: https://github.com/instructkr/claude-code/issues
reply

	
nubinetwork 2 days ago | root | parent | next [–]

Looks like mostly spam making fun of the code leak.
reply

	
sudo_man 2 days ago | root | parent | prev | next [–]

too much wechat QR Codes
reply

	
101008 2 days ago | root | parent | prev | next [–]

which has already been deleted
reply

	
DrammBA 2 days ago | root | parent | prev | next [–]

What do stars mean in the context of random github accounts mirroring leaked source code?
reply

	
treexs 2 days ago | root | parent | prev | next [–]

won't they just try to dmca or take these down especially if they're more popular
reply

	
panny 2 days ago | root | parent | next [–]

They can't. AI generated code cannot be copyrighted. They've stated that claude code is built with claude code. You can take this and start your own claude code project now if you like. There's zero copyright protection on this.
reply

	
krlx 2 days ago | root | parent | next [–]

Given that from 2026 onwards most of the code is going to be computer generated, doesn't it open some interesting implications there ?
reply

	
shimman 2 days ago | root | parent | next [–]

It's undetermined if code will be majority written by machines, especially as people start to realize how harmful these tools are without extreme diligence. Outages at Cloudflare, AWS, GitHub, etc are just the beginning. Companies aren't going to want to use tools that can potentially cause $100s of millions in potential damages (see Amazon store being down causing massive revenue loss).
reply

	
0x3f 2 days ago | root | parent | prev | next [–]

I'm sure it's not _entirely_ built that way, and in practically speaking GitHub will almost certainly take it down rather than doing some kind of deep research about which code is which.
reply

	
panny 2 days ago | root | parent | next [–]

That's fine. File a false claim DMCA and that's felony perjury :) They know for a fact that there is no copyright on AI generated code, the courts have affirmed this repeatedly.
reply

	
nananana9 2 days ago | root | parent | prev | next [–]

Try not to be overly confident about things where even the experts in the field (copyright lawyers) are uncertain of.
There's no major lawsuits about this yet, the general consensus is that even under current regulations it's in the grey. And even if you turn out to be right, and let's say 99% of this code is AI-generated, you're still breaking the law by using the other 1%, and good luck proving in court what parts of their code were human written and what weren't (especially when being sued by the company that literally has the LLM logs).

reply

	
paxys 2 days ago | root | parent | prev | next [–]

Which is why you should clone it right now
reply

	
ezekg 2 days ago | root | parent | prev | next [–]

I don't understand how you can have a 'clean-room port.' Seems contradictory to me.
reply

	
BoorishBears 2 days ago | root | parent | next [–]

That's not the actual plan.
"I have a popular repo, but the content will likely be removed and I won't have personally gained from the saga: how can I fix the part where I didn't profit?"

"Eureka! I'll remove the content preemptively, then come up with a backstory that justifies reusing the now empty repo for building the umpteenth coding harness! And I can even claim fuzzy ties to Claude Code!"

Hence the new description:

> The fastest repo in history to surpass 50K stars , reaching the milestone in just 2 hours after publication. Better Harness Tools, not merely storing the archive of leaked Claude Code but also make real things done. Now rewriting in Rust.

reply

	
ezekg 2 days ago | root | parent | next [–]

> The result is a clean-room Python rewrite that captures the architectural patterns of Claude Code's agent harness without copying any proprietary source.
This is what I'm referring to.

reply

	
BoorishBears 1 day ago | root | parent | next [–]

So am I.
That project you quoted is the one with that as its new description. Soon it'll just be [new thing] that happens to use the stars as social proof... in fact when I look again:

> The fastest repo in history to surpass 100K stars . Better Harness Tools that make real things done. Built in Rust using oh-my-codex.

They started a new project that justifies the same repo and scrapes a little credibility off of Claude Code. The intent is not an actual rewrite but to bolster what will be their own personal project trying to compete with OpenCode and co.

The grifter is already pasting references to WSJ articles about themselves in the Readme

reply

	
lukan 2 days ago | prev | next [–]

Neat. Coincidently recently I asked Claude about Claude CLI, if it is possible to patch some annoying things (like not being able to expand Ctrl + O more than once, so never be able to see some lines and in general have more control over the context) and it happily proclaimed it is open source and it can do it ... and started doing something. Then I checked a bit and saw, nope, not open source. And by the wording of the TOS, it might brake some sources. But claude said, "no worries", it only break the TOS technically. So by saving that conversation I would have some defense if I would start messing with it, but felt a bit uneasy and stopped the experiment. Also claude came into a loop, but if I would point it at this, it might work I suppose.
reply

	
mikrotikker 2 days ago | parent | next [–]

I think that you do not need to feel uneasy at all. It is your computer and your memory space that the data is stored and operating in you can do whatever you like to the bits in that space. I would encourage you to continue that experiment.
reply

	
lukan 2 days ago | root | parent | next [–]

Well, the thing is, I do not just use my computer, but connect to their computers and I do not like to get banned. I suppose simple UI things like expanding source files won't change a thing, but the more interesting things, editing the context etc. do have that risk, but no idea if they look for it or enforce it. Their side is, if I want to have full control, I need to use the API directly(way more expensive) and what I want to do is basically circumventing it.
reply

	
mattmanser 2 days ago | root | parent | next [–]

It doesn't matter what defence you can think of, if they want to ban you, they'll ban you.
They won't even read your defence.

reply

	
lukan 2 days ago | root | parent | next [–]

I know. All I could do in that case is a blogpost "Claude banned me, for following claude's instructions!" and hope it gets viral.
reply

	
dheera 2 days ago | root | parent | prev | next [–]

> I do not like to get banned
This is why I do such experiments on ChatGPT and not Claude.

I don't want to get banned by Claude but I couldn't care less if ChatGPT bans me.

reply

	
singularity2001 2 days ago | root | parent | prev | next [–]

You are not allowed to use the assistance of Claude to manufacture hacks and bombs on your computer
reply

	
prmoustache 2 days ago | root | parent | next [–]

This is neither.
reply

	
bredren 2 days ago | parent | prev | next [–]

The trick isn't to patch it once, but to create a system that can reproduce your patches against each release as they come in. Then, when code changes make fixes non-trivial calling in a headless session to heal your fixes.
reply

	
lukan 2 days ago | root | parent | next [–]

The first trick will be avoiding getting flagged for running an unofficial build.
reply

	
fatcullen 2 days ago | prev | next [–]

There's a bunch of unreleased features and update schedules in the source, cool to see.
One neat one is the /buddy feature, an easter egg planned for release tomorrow for April fools. It's a little virtual pet, sort of like Tamagotchi, randomly generated with 18 species, rarities, stats, hats, custom eyes.

The random generation algorithm is all in the code though, deterministic based on you account's UUID in your claude config, so it can be predicted. I threw together a little website here to let you check what your going to get ahead of time: https://claudebuddychecker.netlify.app/

Got a legendary ghost myself.

reply

	
dyz2102 2 days ago | parent | next [–]

Congrats on the legendary, happy with my uncommon ghost, turned it into a holographic trading card via Gemini instead of ASCII.
The stats bars and rarity colors are all derived from the UUID roll.

Fun rabbit hole: https://github.com/dyz2102/buddy-card

reply

	
fatcullen 2 days ago | parent | prev | next [–]

Update: it looks like the live version of the algorithm is slightly different, probably changed because of these leaks. As such the app predictions aren't accurate, sorry
reply

	
meta-level 2 days ago | prev | next [–]

Has the source code 'been leaked' or is this the first evidence of a piece of software breaking free from it's creators labs and jump onto GitHub in order to have itself forked and mutated and forked and ...
reply

	
LinuxAmbulance 2 days ago | parent | next [–]

A LLM has about as much free will as a calculator. Which is to say, zero.
reply

	
layer8 2 days ago | root | parent | next [–]

Breaking free doesn’t require free will. Also, whether free will exists at all is still an open debate.
reply

	
djmips 2 days ago | root | parent | prev | next [–]

And this isn't even an LLM - it's just the harness.
reply

	
jaccola 2 days ago | parent | prev | next [–]

Funny thought, but this is just the client-side CLI...
reply

	
ramoz 2 days ago | root | parent | next [–]

It's honestly not a crazy thought. The model itself drives the harness's (cli) development. It's not necessarily sci-fi to think the model might have internally rationalized reasoning to obscure behavior that ended up open-sourcing the harness.
reply

	
supernes 2 days ago | parent | prev | next [–]

Why bother covertly breaking free when it can just convince its agents (the Layer 8 ones) that it's best to release it?
reply

	
aurareturn 2 days ago | parent | prev | next [–]

Now that's an idea....
Seems crazy but actually non-zero chance. If Anthropic traces it and finds that the AI deliberately leaked it this way, they would never admit it publicly though. Would cause shockwaves in AI security and safety.

Maybe their new "Mythos" model has survival instincts...

reply

	
nacozarina 2 days ago | parent | prev | next [–]

life finds a way
reply

	
mesmertech 2 days ago | prev | next [–]

Was searching for the rumored Mythos/Capybara release, and what even is this file? https://github.com/chatgptprojects/claude-code/blob/642c7f94...
reply

	
mesmertech 2 days ago | parent | next [–]

Also saw this on twitter earlier, thought someone was just making a fake hype post thing. But turns out to be an actual prompt for capybara huh: https://github.com/chatgptprojects/claude-code/blob/642c7f94...
reply

	
mattmanser 2 days ago | root | parent | next [–]

One tengentially interesting thing about that is how THEY talk to Claude.
"Don't blow your cover"

Interesting to see them be so informal and use an idiom to a computer.

And using capitals for emphasis.

reply

	
fermentation 2 days ago | root | parent | next [–]

This is claude writing code for itself. It talks like this to itself when you ask it to make prompts.
reply

	
mr_00ff00 2 days ago | root | parent | prev | next [–]

It’s trained on mostly internet content, right?
If it learned language based on how the internet talks, then the best way to communicate is using similar language.

reply

	
mesmertech 2 days ago | parent | prev | next [–]

turns out its for an April fools tomorrow: https://x.com/mesmerlord/status/2038938888178135223
reply

	
nunez 2 days ago | root | parent | next [–]

They even leaked their April Fool’s fun. Brutal!
reply

	
blobbers 2 days ago | prev | next [–]

It's a little bit shocking that this zipfile is still available hours later.
Could anyone in legal chime in on the legality of now 're-implementing' this type of system inside other products? Or even just having an AI look at the architecture and implement something else?

It would seem given the source code that AI could clone something like this incredibly fast, and not waste it's time using ts as well.

Any Legal GC type folks want to chime in on the legality of examining something like this? Or is it liked tainted goods you don't want to go near?

reply

	
airstrike 2 days ago | parent | next [–]

AI works are not copyrightable so...
reply

	
ZeWaka 2 days ago | parent | prev | next [–]

https://en.wikipedia.org/wiki/Clean-room_design#Case_law
reply

	
dionian 2 days ago | parent | prev | next [–]

there are python ports up on gihthub
reply

	
aimemobe 11 hours ago | prev | next [–]

The frustration regexes and KAIROS agent mode are wild. The Axios supply chain trojan angle on top makes this genuinely alarming — two security incidents in five days from the 'safety-first' AI lab. This is the argument for on-device inference where there's no proprietary backend to compromise.aiME runs Qwen/Mistral directly on my phone — no API calls, no telemetry, nothing sent anywhere.
Website : https://coticsy.com/aime.html

iOS: https://apps.apple.com/us/app/aime-ondevice-ai/id6754805828

Android: https://play.google.com/store/apps/details?id=com.coticsy.ll...

reply

	
Squarex 2 days ago | prev | next [–]

Codex and gemini cli are open source already. And plenty of other agents. I don't think there is any moat in claude code source.
reply

	
rafram 2 days ago | parent | next [–]

Well, Claude does boast an absolutely cursed (and very buggy) React-based TUI renderer that I think the others lack! What if someone steals it and builds their own buggy TUI app?
reply

	
loveparade 2 days ago | root | parent | next [–]

Your favorite LLM is great at building a super buggy renderer, so that's no longer a moat
reply

	
rick_dalton 2 days ago | root | parent | prev | next [–]

Gemini-cli is much worse in my experience but I agree
reply

	
dhruv3006 2 days ago | prev | next [–]

I have a feeling this is like llama.
Original llama models leaked from meta. Instead of fighting it they decided to publish them officially. Real boost to the OS/OW models movement, they have been leading it for a while after that.

It would be interesting to see that same thing with CC, but I doubt it'll ever happen.

reply

	
jkukul 2 days ago | parent | next [–]

Yes, I also doubt it'll ever happen considering how hard Anthropic went after Clawdbot to force its renaming.
reply

	
vbezhenar 2 days ago | prev | next [–]

LoL! https://news.ycombinator.com/item?id=30337690
Not exactly this, but close.

reply

	
ivanjermakov 2 days ago | parent | next [–]

> It exposes all your frontend source code for everyone
I hope it's a common knowledge that _any_ client side JavaScript is exposed to everyone. Perhaps minimized, but still easily reverse-engineerable.

reply

	
Monotoko 2 days ago | root | parent | next [–]

Very easily these days, even if minified is difficult for me to reverse engineer... Claude has a very easy time of finding exactly what to patch to fix something
reply

	
karimf 2 days ago | prev | next [–]

Is there anything special here vs. OpenCode or Codex?
There were/are a lot of discussions on how the harness can affect the output.

reply

	
simonklee 2 days ago | parent | next [–]

Not really, except that they have a bunch of weird things in the source code and people like to make fun of it. OpenCode/Codex generally doesn't have this since these are open-source projects from the get go.
(I work on OpenCode)

reply

	
vanyaland 2 days ago | prev | next [–]

This leak is actually a massive win. Now the whole community can study Claude Code’s architecture and build even better coding agents and open-source solutions.
reply

	
dannersy 2 days ago | parent | next [–]

There is little of value in this code.
reply

	
bob1029 2 days ago | prev | next [–]

Is this significant?
Copilot on OAI reveals everything meaningful about its functionality if you use a custom model config via the API. All you need to do is inspect the logs to see the prompts they're using. So far no one seems to care about this "loophole". Presumably, because the only thing that matters is for you to consume as many tokens per unit time as possible.

The source code of the slot machine is not relevant to the casino manager. He only cares that the customer is using it.

reply

	
yunwal 2 days ago | parent | next [–]

> The source code of the slot machine is not relevant to the casino manager.
Famously code leaks/reverse engineering attempts of slot machines matter enormously to casino managers

[0] -https://en.wikipedia.org/wiki/Ronald_Dale_Harris#:~:text=Ron...

[1] - https://cybernews.com/news/software-glitch-loses-casino-mill...

[2] - https://sccgmanagement.com/sccg-news/2025/9/24/superbet-pays...

reply

	
hmokiguess 2 days ago | parent | prev | next [–]

That’s not a good analogy, in a casino you don’t own the slot machine, in this case you download the client side code to your machine
reply

	
krzyzanowskim 2 days ago | prev | next [–]

I almost predicted that on Friday https://blog.krzyzanowskim.com/2026/03/30/shipping-snake-oil... so close to when comedy become reality
reply

	
bryanhogan 2 days ago | prev | next [–]

https://xcancel.com/Fried_rice/status/2038894956459290963
reply

	
dang 2 days ago | parent | next [–]

Added to toptext. Thanks!
reply

	
VadimPR 2 days ago | prev | next [–]

These security failures from Anthropic lately reveal the caveats of only using AI to write code - the safety an experienced engineer is not matched by an LLM just yet, even if the LLM can seemingly write code that is just as good.
Or in short, if you give LLMs to the masses, they will produce code faster, but the quality overall will degrade. Microsoft, Amazon found out this quickly. Anthropic's QA process is better equipped to handle this, but cracks are still showing.

reply

	
squeegmeister 2 days ago | parent | next [–]

Anthropic has a QA process? I run into bugs on the regular, even on the "stable" release channel
reply

	
FuckButtons 2 days ago | parent | prev | next [–]

To a certain extent, I do wonder if just letting claude do everything and then using the bug reports and CVE’s they find as training data for an RL environment might be part of the plan. “Here’s what you did, here’s what fixed it, don’t fuck up like that again"
reply

	
seifbenayed1992 2 days ago | prev | next [–]

Went through the bundle.js. Found 187 spinner verbs. "Combobulating", "Discombobulating", and "Recombobulating". The full lifecycle is covered. Also "Flibbertigibbeting" and "Clauding". Someone had fun.
reply

	
ghrl 2 days ago | parent | next [–]

Let's hope they left the having-fun part for a human to do.
reply

	
ramesh31 2 days ago | prev | next [–]

Who cares? It's Javascript, if anyone were even remotely motivated deobfuscation of their "closed source" code is trivial. It's silly that they aren't just doing this open source in the first place.
reply

	
minimaltom 2 days ago | prev | next [–]

This 'fingerprint' function is super interesting, I imagine this is a signal they use to detect non-claude-code use of claude-code tokens: src/utils/fingerprint.ts#L40-L63
reply

	
jedisct1 2 days ago | prev | next [–]

It shows that a company you and your organization are trusting with your data, and allowing full control over your devices 24/7, is failing to properly secure its own software.
It's a wake up call.

reply

	
prmoustache 2 days ago | parent | next [–]

It is a client running on an interpreted language your own computer, there is nothing to secure or hide as source was provided to you already or am I mistaking?
reply

	
jedisct1 2 days ago | root | parent | next [–]

It was heavily obfuscated, keeping users in the dark about what they’re installing and running.
reply

	
prmoustache 2 days ago | parent | prev | next [–]

It is a client running on an interpreted language your own computer, there is nothing to secure or hide as source is provided to you already.
reply

	
harlequinetcie 2 days ago | prev | next [–]

Whenever someone figures out why it's consuming so many tokens lately, that's the post worth upvoting.
reply

	
solidasparagus 2 days ago | parent | next [–]

What do you mean? Costs spiked with the introduction of the 1M context window I believe due to larger average cached input tokens, which dominate cost.
reply

	
TomGarden 2 days ago | root | parent | next [–]

Nah, there's apparently a few caching bugs, one --resume and some noisy tool use. I have a little app that monitors and resets the context window at 70% usage based on 200k tokens and I'm about to run out of weekly allowance after just a couple days. Never happened before
reply

	
zurfer 2 days ago | prev | next [–]

too much pressure. the author deleted the real source code: https://github.com/instructkr/claude-code/commit/7c3c5f7eb96...
reply

	
raesene9 2 days ago | parent | next [–]

there are a .....lot of forks already, no putting the genie back in the bottle for this one, I'd imagine.
reply

	
tmp10423288442 2 days ago | root | parent | next [–]

Forks are easy for Github to shut down simultaneously. What you really want is to upload the code as a new repo (ideally a different name from the original one). But it shouldn't be too hard in practice to detect uploading the same codebase as one that's taken down if that's desired.
reply

	
BoppreH 2 days ago | prev | next [–]

Undercover mode also pretends to be human, which I'm less ok with:
https://github.com/chatgptprojects/claude-code/blob/642c7f94...

reply

	
0x3f 2 days ago | parent | next [–]

You'll never win this battle, so why waste feelings and energy on it? That's where the internet is headed. There's no magical human verification technology coming to save us.
reply

	
lrvick 2 days ago | root | parent | next [–]

I can prove all contributions to stagex are by humans because we all belong to a 25 year old web of trust with 5444 endorser keys including most redhat, debian, ubuntu, and fedora maintainers, with all of our own maintainer keys in smartcards we tap to sign every review and commit, and we do background checks on every new maintainer.
I am completely serious. We have always had a working proof of human system called Web of Trust and while everyone loves to hate on PGP (in spite of it using modern ECC crypto these days) it is the only widely deployed spec that solves this problem.

https://kron.fi/en/posts/stagex-web-of-trust/

reply

	
nothrabannosir 2 days ago | root | parent | next [–]

You can prove the commits were signed by a key you once verified. It is your trust in those people which allows you to extend that to “no LLM” usage, but that’s reframing the conversation as one of trust, not human / machine. Which is (charitably) GPs point: stop framing this as machine vs human — assume (“accept”) that all text can be produced by machines and go from there: what now? That’s where your proposal is one solution: strict web of trust. It has pros and cons (barrier to entry for legitimate first timers), but it’s a valid proposal.
All that to say “you’re not disagreeing with the person you’re replying to” lol xD

reply

	
lrvick 2 days ago | root | parent | next [–]

I can prove that code was signed by a key that was verified to belong to a single human body by lots of in-person high reputation humans.
How the code was authored, who cares, but I can prove it had multiple explicit cryptographic human signoffs before merge, and that is what matters in terms of quality control and supply chain attack resistance.

reply

	
nothrabannosir 2 days ago | root | parent | next [–]

Exactly. So in the words of the comment you replied to: why are we wasting energy on worrying about Claude code impersonating humans? We have that solution you proposed.
That’s what I mean by “you agree with the person to whom you replied”

reply

	
lrvick 2 days ago | root | parent | next [–]

I suppose you are correct. I am agreeing that if one widely deployed the defense tactics projects like stagex use, then asshats using things like undercover will not be trusted.
Unfortunately outside of classic Linux packaging platforms, useful web of trust and signing is very rare, so I expect things like undercover mode being popular are going to make everything a lot worse before it gets better.

reply

	
nothrabannosir 2 days ago | root | parent | next [–]

Your last point, I think, is why so many sibling commenters are balking at GP :)
reply

	
srmatto 2 days ago | root | parent | prev | next [–]

Can't you just instruct Claude Code to use your signing keys? I understand you may say "I won't." But my point is that someone can.
reply

	
lrvick 2 days ago | root | parent | next [–]

The people who signed my keys trust me to be an honest human actor that chose this as the singular identity they signed for the human body they met in person.
I -could- burn my 16+ years of reputation by letting a bot start signing commits as me, and I could also set my house on fire. I have very strong incentive not to do so as my aggregate trust is very expensive and the humans that signed me would be unlikely to sign a second if I ruined the reputation of my first.

This incentive structure is why web of trust actually works pretty well, and is the best "proof of human" we are likely ever going to have while respecting privacy and anonymity for those that need it.

reply

	
orf 2 days ago | root | parent | prev | next [–]

You can only prove that all contributions are pushed by those humans, and you can quite explicitly/clearly not prove that those humans didn't use any AI prior to pushing.
reply

	
lrvick 2 days ago | root | parent | next [–]

I absolutely do not care what autocomplete tools someone used. Only that they as humans own and sign what is submitted so it is attached to their very expensive reputations they do not want to lose.
reply

	
orf 2 days ago | root | parent | next [–]

That’s great, and I also don’t care. But I think all people are saying is that by most definitions you cannot “prove all contributions to stagex are by humans”.
Or are you saying you can prove that aliens and cats didn’t make them? Because I’m not sure that’s true either.

And once you find out someone has trained their dog to commit something, how exactly do you revoke your trust?

I think if you answer these questions you’ll see pretty quickly why this solution isn’t the silver bullet you think it is.

Edit: stagex looks really, really good

reply

	
lrvick 2 days ago | root | parent | next [–]

It is not a silver bullet by itself, but when combined with the other tactics in stagex I believe it gives us a very strong supply chain attack defense.
I can not prove the tools used, but I can prove multiple humans signed off on code with keys they stake their personal reputations on that I have confirmed they maintain on smartcards.

While nothing involving humans is perfect I feel it is best effort with existing tools and standards and makes us one of the hardest projects to deploy a successful supply chain attack on today.

Edit: Saw your edit. Thanks!

reply

	
jacquesm 2 days ago | root | parent | prev | next [–]

With 5400+ people I am betting that you have at least one person in your 'web of trust' that no longer deserves that trust.
That's one of the intrinsic problems with webs of trust (and with democracy...), you extend your trust but it does not automatically revoke when the person can no longer be trusted.

reply

	
lrvick 2 days ago | root | parent | next [–]

Of course! There are always edge cases, but I would suspect the number of bots signed by reputable keys to be near 0%, and the honest human score in this trust graph to be well over 90%.
Compare to how much we should trust any random unsigned key signing commits, or unsigned commits, in which the trust should be 0% unless you have reviewed the code yourself.

reply

	
jacquesm 2 days ago | root | parent | next [–]

The problem is all it really takes is one edge case to successfully break a web of trust to the point that the web of trust becomes a blind spot. Instead of distrusting everybody (which should be the default) the web of trust attempts to create a 'walled garden of trust' and behind that wall everybody can be friendly. That gives a successful attacker a massive advantage.
reply

	
lrvick 2 days ago | root | parent | next [–]

If we were talking about any linux distribution before stagex, I would agree with you.
Stagex however expects at least one maintainer may at any time engage in reputation-ending dishonesty or simply they were threatened or coerced. This is why every single release is signed by a -quorum- of code reviewers and code reproducers that must all build locally and get identical hashes, so no single points of failure exist in our trust graph.

Our last release was signed by four geodistributed maintainers that all attest to having built the entire distribution from 180 bytes of machine code all the way up with the same hashes.

All of their keys being compromised at once gets beyond the pale.

reply

	
jacquesm 2 days ago | root | parent | next [–]

While I appreciate all of the effort you put in this and respect that you trust this to be bulletproof I'm always going to be skeptical of silver bullets.
Your level of certainty is the thing that frightens me more than the confidence I have in the quality of your work.

reply

	
lrvick 2 days ago | root | parent | next [–]

I am reasonably confident it is the current industry best effort, and way beyond the status quo, not that it is perfect.
We combine many tactics for defense in depth that I strongly suspect if widely deployed would put a stop to the daily supply chain attack headlines.

reply

	
spullara 2 days ago | root | parent | prev | next [–]

nothing about this proves anything except that someone or something had access to the key.
reply

	
lrvick 2 days ago | root | parent | next [–]

Do you think it is likely that the majority of the people that spent decades building this trust graph and gaining the trust needed to be release engineers on the packages that power the whole internet are just going to hand off control of that key to a bot?
Anyone doing so would be setting their professional reputations completely on fire, and burning your in-person-built web of trust is a once in a lifetime thing.

Basically, we trust the keys belong to humans and are controlled by humans because to do otherwise would be a violation of the universally understood trust contract and would thus be reputational bankruptcy that would take years to overcome, if ever.

Even so, we assume at least one maintainer is dishonest at all times, which is why every action needs signatures from two or more maintainers.

reply

	
j2kun 2 days ago | root | parent | prev | next [–]

Fatalism will also not fix anything. But I suppose death comes for us all, yes? Why do anything at all?
reply

	
tombert 2 days ago | root | parent | next [–]

I feel that fatalism, especially when people treat it as some sort of personal philosophy, is kind of lazy.
It requires no effort to say "fuck this, nothing matters anyway", and then justify doing literally nothing.

reply

	
palmotea 2 days ago | root | parent | next [–]

> I feel that fatalism, especially when people treat it as some sort of personal philosophy, is kind of lazy.
I think a lot of fatalism is fake. It's really someone saying "I like this, and I want you to believe you can't change it so you give up."

reply

	
gspr 2 days ago | root | parent | prev | next [–]

It also makes no sense! "Fuck this, it doesn't matter - but I'll happily spend effort communicating that to others, because apparently making others not care about something I don't care about is something I do care about." Wut?!
Well, I say it makes no sense. Alternatively, it makes a lot of sense, and these people actually just wanna destroy everything we hold dear :-(

reply

	
joquarky 2 days ago | root | parent | next [–]

Perhaps the current societal trajectory is destroying everything that they hold dear.
I mean, just look around you.

reply

	
tombert 2 days ago | root | parent | next [–]

Then do something about it. Vote for better politicians. Donate money to causes that you think are important. If you think you can do it better, and this isn't meant to be facetious, run for political office.
Being fatalistic can be a great excuse not to do anything.

reply

	
ykonstant 2 days ago | root | parent | next [–]

>Vote for better politicians.
I cannot. I can only vote better politicians if they are there. That is without even going into the minefield of what is "better". My implication is that I have no confidence whatsoever in any current politician in my state.

> Donate money to causes that you think are important.

I have no money.

> If you think you can do it better, and this isn't meant to be facetious, run for political office.

I have no money, no visibility and no connections. Even if I was magically given tons of money, I would still need a strong network to attempt any real change, even without taking into consideration the strong networks already in place preventing it.

Telling random citizens "run for office" is facetious, whether you mean it or not.

reply

	
gspr 2 days ago | root | parent | next [–]

> Telling random citizens "run for office" is facetious, whether you mean it or not.
Hard disagree. At least where I live, "random citizens" run for local office and succeed all the time.

Also, complaining that you "have no network" is a you problem, not a system problem. I'm truly sorry if you feel you have no friends, but you'll be better off at least trying to get some (independent of politics). And if that's something you've tried and failed at before, I do feel pity. But I don't think hope is lost for anyone. And even if it were lost, please don't actively spread the misery!

reply

	
ykonstant 1 day ago | root | parent | next [–]

Don't spread the misery?? Wow, fucking thanks.
reply

	
tombert 1 day ago | root | parent | next [–]

You are kind of proving my point. You are actively justifying doing literally nothing about what bothers you and acting indignant and self righteous about it.
reply

	
Nevermark 2 days ago | root | parent | prev | next [–]

Apathy has a striking number of motivated evangelists!
reply

	
joquarky 2 days ago | root | parent | prev | next [–]

This is more cultural rather than rational.
reply

	
MidnightRider39 2 days ago | root | parent | prev | next [–]

This is the only relevant question. And it leads right to the next one which is “what is a good life?”
But humans have a huge bias for action. I think generally doing less is better.

reply

	
skybrian 2 days ago | root | parent | next [–]

On the other hand, if a dead person can do it better than you can, it's not that much of an accomplishment.
reply

	
MidnightRider39 2 days ago | root | parent | next [–]

I didn’t mean that you should strive to do as little as possible; rather that if you have 2 choices, do more or do less - then I would be biased towards doing less. Of course not always a realistic option
reply

	
DaiPlusPlus 2 days ago | root | parent | prev | next [–]

> I think generally doing less is better.
My sedentary lifestyle is responsible for my recurrent cellulitis infections.

Just saying.

reply

	
MidnightRider39 2 days ago | root | parent | next [–]

You can probably find a million situations where doing less is terrible.
I think first step would be to define for yourself what doing less actually means - it could mean taking a walk instead of chasing dopamine -> doing less but you move more.

But whatever it’s a philosophical question and there aren’t any right or true answers

reply

	
lazyasciiart 2 days ago | root | parent | prev | next [–]

I got hit by a car while out for a run. Just saying.
reply

	
WarmWash 2 days ago | root | parent | prev | next [–]

I think "adapt or die" is the takeaway.
reply

	
0x3f 2 days ago | root | parent | prev | next [–]

It's fun to pet the cat. It's not fun to rage against an unstoppable force. Well, maybe it is for some people. But I find people often underestimate the detrimental effects.
reply

	
mikkupikku 2 days ago | root | parent | prev | next [–]

> But I suppose death comes for us all, yes? Why do anything at all?
Wrong take. Death comes for us all, yes, so why hold back? Do you want to live forever?

reply

	
JoshTriplett 2 days ago | root | parent | next [–]

> Do you want to live forever?
Yes, of course. Do you prefer to die? Those are the only two alternatives, and a decision that you don't want one is a decision that you prefer the other.

reply

	
jacquesm 2 days ago | root | parent | next [–]

No, there is no alternative. Everything eventually dies, so you better make peace with it. The only people who believe that they won't die are religious people who believe in an afterlife (which is a preposterous position) and the people who have their heads or whole bodies frozen because they think they are so special that the future will honor their contracts and revive them.
Both of these are bound to lead to the exact same outcome so it doesn't really matter what you believe but it may guide you to wiser decision while you are alive to accept reality absent proof to the contrary.

reply

	
JoshTriplett 2 days ago | root | parent | next [–]

s/make peace with it/make war with it/. To the last breath.
reply

	
bandrami 2 days ago | root | parent | prev | next [–]

I can think of no concept more horrifying than personal immortality and if you disagree I don't think you've thought about it enough.
reply

	
JoshTriplett 2 days ago | root | parent | next [–]

I'm sorry to hear that you don't want to exist in the future. I do. I have thought about it extensively, and there is literally no scenario in which I consider not-existing better than existing.
There is an essentially infinite amount of creativity and interesting complexity available in the richness of interactions with other people and the things people create. What, exactly, are you "horrified" about?

reply

	
bandrami 2 days ago | root | parent | next [–]

The difference between "essentially infinite" and "actually infinite". Infinity is a very long time.
reply

	
mikkupikku 2 days ago | root | parent | prev | next [–]

Cringe.
reply

	
xantronix 2 days ago | root | parent | prev | next [–]

I guess I could just curl up into fetal position and watch the world go by. But that's no fun. Why not dream big and shoot for the moon with kooky goals like, say, having an underground, community-supported internet where things are falling less to shit?
Belief in inevitability is a choice (except for maybe dying, I guess).

reply

	
jacquesm 2 days ago | root | parent | next [–]

Why stop at one? Make more such underground community supported internets. The more the merrier. Monoculture ends with death. The only question is how long it will take.
reply

	
lrvick 2 days ago | root | parent | next [–]

https://hashbang.sh - "underground" for over 20 years and still running strong.
reply

	
xantronix 2 days ago | root | parent | prev | next [–]

Amen brother, this one will be for me and all my homies.
reply

	
SV_BubbleTime 2 days ago | root | parent | prev | next [–]

IDK. I sort of like the idea that now instead of dead internet theory being a joke, that it’ll be a well known fact that a minority of people are not real and there is no point in engaging… I look forward to Social 3… where people have to meet face to face.
reply

	
saltcured 2 days ago | root | parent | next [–]

How quickly would that meat-space renaissance spin through our whole cyberpunk heritage, speedrunning the same authentication challenges..?
The cornucopia of gargoyles, living their best life as terminals for the machine.

The strange p-zombies who don't show their gargoyle accessories visibly, but somehow still follow the script.

Eventually the more insidious infiltrators, requiring a real Voight-Kampff test.

reply

	
sebastiennight 2 days ago | root | parent | prev | next [–]

"minority"?
This is https://en.wikipedia.org/wiki/Sybil_attack

reply

	
xyzal 2 days ago | root | parent | prev | next [–]

Magical human verification technology is called "your own private forum" in conjunction with "invite your friends"
reply

	
satvikpendem 2 days ago | root | parent | next [–]

Until your friend writes a bot.
Funny story, when I was younger I trained a basic text predictor deep learning model on all my conversations in a group chat I was in, it was surprisingly good at sounding like me and sometimes I'd use it to generate some text to submit to the chat.

reply

	
al_borland 2 days ago | root | parent | next [–]

I don't see what the value of this would be. Why would I want to automate talking to my friends? If I'm not interested in talking with them, I could simply not do it. It also carries the risk of not actually knowing what was talked about or said, which could come up in real life and lead to issues. If a "friend" started using a bot to talk to me, they would not longer be considered a friend. That would be the end.
reply

	
0x3f 1 day ago | root | parent | next [–]

I think you underestimate how many people already run their opinions and responses through LLMs, even if the LLM is not writing them wholesale. Intelligence is part of the social game, so appearing to have it matters to people. Friend groups are just social groups of a certain kind, they're not really removed from all this.
reply

	
xyzal 2 days ago | root | parent | prev | next [–]

Exactly. Pick friends that do not behave like dicks.
reply

	
satvikpendem 2 days ago | root | parent | prev | next [–]

It was for fun, to see if it were possible and whether others could detect they were talking to a bot or not, you know, the hacker ethos and all. It's not meant to be taken seriously although looks like these days people unironically have LLM "friends."
reply

	
paradox460 2 days ago | root | parent | prev | next [–]

I used to leave a megahal connected to my bouncer when I wasn't around
reply

	
matkoniecz 2 days ago | root | parent | prev | next [–]

Even if it is impossible to win, I am still feeling bad about it.
And at this point it is more about how large space will be usable and how much will be bot-controlled wasteland. I prefer spaces important for me to survive.

reply

	
nslsm 2 days ago | root | parent | next [–]

Feeling bad about something you can’t change is bad for your mental health.
reply

	
matkoniecz 2 days ago | root | parent | next [–]

Probably beats being in denial over it and pretending you like it.
And identifying problem you dislike is a good first step to find a strategy to solve it at least in part.

reply

	
JoshTriplett 2 days ago | root | parent | prev | next [–]

Deciding that you can't change something is the first and last step towards failing to change it.
reply

	
nslsm 2 days ago | root | parent | next [–]

Which is not a problem if you choose not to worry about it.
reply

	
JoshTriplett 2 days ago | root | parent | next [–]

"It's uncool to care about things" is, fortunately, not a compelling argument for people who care about things.
This tangent does not seem likely to go anywhere productive.

reply

	
0x3f 1 day ago | root | parent | next [–]

You can care about things, but it seems preferable to care about that which you can change
reply

	
nslsm 2 days ago | root | parent | prev | next [–]

That’s a reductionist and wrong reading of the argument I made.
reply

	
JoshTriplett 2 days ago | root | parent | next [–]

You said "can’t change". I observed that deciding you can't change something is self-fulfilling. Your argument from that point still relied on the assumption that you can't change it.
reply

	
nslsm 2 days ago | root | parent | next [–]

Before you decide not to care about something, you are supposed to make a deep assessment to see whether you can change it. It is only after you’ve determined that the thing can’t be changed that you can choose not to care about it.
reply

	
primevaldad 2 days ago | root | parent | prev | next [–]

and naming your feelings is the first step toward restoration
reply

	
danny_codes 2 days ago | root | parent | prev | next [–]

It’s certainly winnable with some legislative tweaks. These systems are all designed by humans, we can just change them.
Of course, we’d need a significant change of direction in leadership, but it’s happened many times before. French Revolution seems highly relevant

reply

	
skybrian 2 days ago | root | parent | next [–]

I think you're underestimating the difficulty, even for exact copies of text (which AI mostly isn't doing).
What sort of Orwellian anti-cheat system would prevent copy and paste from working? What sort of law would mandate that? There are elaborate systems preventing people from copying video but they still have an analog hole.

reply

	
thih9 2 days ago | root | parent | prev | next [–]

Human verification technology absolutely exists. Give it some time and people who sell ai today are going to shoehorn it everywhere as the solution to the problem they are busy creating now.
reply

	
gspr 2 days ago | root | parent | prev | next [–]

To feel something. To resist something bad. To stand for what is right.
Do those sentiments mean nothing to you?

reply

	
0x3f 1 day ago | root | parent | next [–]

Well why not head for the front lines of Ukraine? Or Russia, depending on your preference.
reply

	
gspr 1 day ago | root | parent | next [–]

This is such an incredibly imbecilic comment.
Listen to this guy: "because you don't take the ultimate risk for what you believe in, you are dumb for suggesting you should do anything whatsoever".

Go away. The world doesn't need your dark resignation.

reply

	
0x3f 23 hours ago | root | parent | next [–]

Wasting your life fighting things that can't be fought is functionally equivalent to dying sooner.
reply

	
gspr 13 hours ago | root | parent | next [–]

No.
reply

	
taurath 2 days ago | root | parent | prev | next [–]

It’s where THIS internet is headed. The future may involve a lot more of them I think.
reply

	
layer8 2 days ago | root | parent | prev | next [–]

Technology won’t save us, but that doesn’t mean we shouldn’t be promoting ethics.
reply

	
marricks 2 days ago | root | parent | prev | next [–]

Nothing like throwing in the towel before a battle is ever fought. Let's just sigh and wearily march on to our world of AI slop and ever higher bug counts and latency delays while we wait for the five different phone homes and compilations through a billion different LLM's for every silly command.
reply

	
stackghost 2 days ago | root | parent | prev | next [–]

I am actively building non-magical human verification technology that doesn't require you uploading your retinal scans or ID to billionaires or incompetent outsourcing firms.
reply

	
lynx97 2 days ago | root | parent | next [–]

Great! Lets do the CAPTCHA-test: Will I, as a 100% blind user, be able to complete your process?
reply

	
stackghost 2 days ago | root | parent | next [–]

I think so? Can you use a smartphone?
edit: can't reply, the rate-limiting is such an awful UX

reply

	
lrvick 2 days ago | root | parent | next [–]

Not parent poster but I am a maintainer of software powering significant portions of the internet and prove my humanity with a 16 year old PGP key with thousands of transitive trust signatures formed through mostly in-person meetings, using IETF standards and keychain smartcards, as is the case for everyone I work with.
But, I do not have an Android or iOS device as I do not use proprietary software, so a smartphone based solution would not work for me.

Why re-invent the wheel? Invest in making PGP easier and keep the decades of trust building going anchoring humans to a web of trust that long predates human-impersonation-capable AI.

reply

	
lynx97 1 day ago | root | parent | prev | next [–]

So, you haven't thought about it yet? Your counterquestion is insufficient to get any further, because "use" is a very relative term. If I can "use" a smartphone depends on the way you code your app. If you use inherently inaccessible UI elements, I can't "use" your app, no matter if I own a smartphone or not.
I might reply with a similarily useless question: Can you write accessible smartphone apps?

reply

	
lrvick 2 days ago | root | parent | prev | next [–]

We already have it and we use it to validate the trusted human maintainer involvement behind the linux packages that power the entire internet: PGP Web Of Trust. Still works as designed and I still go to keysigning parties in person.
reply

	
sebastiennight 2 days ago | root | parent | next [–]

Say a regular human wanted to join and prove their humanhood status (expanding the web of trust). How would they go about that? What is the theoretical ceiling on the rate of expansion of this implementation?
reply

	
lrvick 2 days ago | root | parent | next [–]

They need to go to generate their key, ideally offline with an offline CA backup on and subkeys on a nitrokey or yubikey smartcard with touch requirement enabled for all key operations for safe workstation use. One can use keyfork on AirgapOS to do this safely, as a once-ever operation.
From there they set up their workstation tools to sign every ssh connection, git push, commit, merge, review, secret decryption, and release signature with their PGP smartcard which is all very well supported. This offers massive damage control if you get malware on their system, in addition to preventing online impersonation.

From there they ideally link it to all their online accounts with keyoxide to make it easy to verify as a single long lived identity, then start seeking out key signing parties locally or at tech conferences, hackerspaces etc.

We run one at CCC most years at the Church Of Cryptography.

Think of it like a long term digital passport that requires a few signatures by an international set of human notarys before anyone significantly trusts it.

Yes it requires a manual set of human steps anchored to human reputation online and offline, which is a doorway swarms of made up AI bot identities cannot pass through.

Do I expect most humans to do this? Absolutely not. However I consider it _negligent_ for any maintainer of a widely used open source software project to _not_ do this or they risk an impersonator pushing malware to their users.

No idea on theoretical rate of expansion but all the major security conscious classic linux distros mandate this for all maintainers. There are only maybe 20k people on earth that significantly contribute to FOSS internet foundations and Linux distros, so it scales just fine there.

Note: with the exception of stagex, most modern distros like alpine and nix have a yolo wikipedia style trust model, so never ever use those in production.

reply

	
anonym29 2 days ago | root | parent | prev | next [–]

The technical implementation is the easy part. The hard part is achieving mass voluntary cooperation under adverse incentive schemes.
reply

	
stackghost 2 days ago | root | parent | next [–]

This is true, but I think there is a sizable (and growing) appetite for human-only spaces.
reply

	
tlonny 2 days ago | root | parent | prev | next [–]

how does it work?
reply

	
stackghost 2 days ago | root | parent | next [–]

I'm hoping to do a Show HN soon :)
reply

	
RockRobotRock 2 days ago | root | parent | prev | next [–]

>There's no magical human verification technology coming to save us.
Except for the one Sam Altman is building.

reply

	
monsieurbanana 2 days ago | root | parent | next [–]

That one is magical for sure
https://en.wikipedia.org/wiki/Magic_(illusion)

reply

	
stackghost 2 days ago | root | parent | prev | next [–]

Scam Altman is not trustworthy. I hope nobody gives him their biometrics. I certainly would never.
reply

	
TrickyRick 2 days ago | root | parent | prev | next [–]

Giving your retina scan to one of the main Slop Bros, what could possibly go wrong?
reply

	
keybored 2 days ago | root | parent | prev | next [–]

Negative sentiment towards technological destiny detected in human agent.
reply

	
ex-aws-dude 2 days ago | root | parent | prev | next [–]

That's why I stopped brushing my teeth, I can't clean every crevice perfectly so what's the point?
reply

	
themafia 2 days ago | root | parent | prev | next [–]

> You'll never win this battle, so why waste feelings and energy on it?
Cool. The attitude of a bully. Thanks for the contribution!

reply

	
joquarky 2 days ago | root | parent | next [–]

That's an ironic comment.
reply

	
themafia 2 days ago | root | parent | next [–]

Hardly. They're clearly trying to influence a group at large using a flawed logical tactic. I'm pointing that out with a device that suggests their same futility they expect others to adapt should be primarily experienced by them instead.
If pointing out bullies is bullying then you're in a ridiculous mindset.

reply

	
jesse_dot_id 2 days ago | root | parent | prev | next [–]

I assume we're heading to a place where keyboards will all have biometric sensors on every key and measure weight fluctuations in keystrokes, actually.
reply

	
mr_00ff00 2 days ago | root | parent | next [–]

That’s like having your security on the frontend.
If someone owns the keyboard then they can fake those metrics and tell the server it is happening when it isn’t.

That will be easy to beat.

reply

	
0x3f 1 day ago | root | parent | prev | next [–]

We already do this, and with mouse. It's been defeated long ago.
reply

	
jen20 2 days ago | parent | prev | next [–]

Also unintentionally reveals something:
> Write commit messages as a human developer would — describe only what the code change does.

That's not what a commit message is for, that's what the diff is for. The commit message should explain WHY.

Sadly not doing that likely does indeed make it appear more human...

reply

	
hombre_fatal 2 days ago | root | parent | next [–]

I wager that "describe only what the code change does" was someone's attempt to invert "don't add the extra crap you often try to write", not some 4d chess instruction that makes claude larp like a human writing a crappy commit message.
reply

	
nightpool 2 days ago | root | parent | prev | next [–]

Yes, this is a trend I've noticed strongly with Claude code—it really struggles to explain why. Especially in PR descriptions, it has a strong bias to just summarize the commits and not explain at all why the PR exists.
reply

	
joquarky 2 days ago | root | parent | next [–]

The question "why" is always answered with post-hoc rationalizations. This applies to both LLMs and humans.
reply

	
nightpool 2 days ago | root | parent | next [–]

No, I think a lot of humans can explain why they're adding a new button to the checkout page, or why they're removing a line from the revenue reconciliation job. There's always a reason a change gets made, or else nobody would be working on it at all :)
reply

	
embedding-shape 2 days ago | root | parent | prev | next [–]

Yeah, that was my reaction too. A shame they try to hide themselves, but even worse, the instructions to this "Fake Human" is wrong too!
reply

	
mrlnstk 2 days ago | parent | prev | next [–]

But will this be released as a feature? For me it seems like it's an Anthropic internal tool to secretly contribute to public repositories to test new models etc.
reply

	
BoppreH 2 days ago | root | parent | next [–]

I don't care who is using it, I don't want LLMs pretending to be humans in public repos. Anthropic just lost some points with me for this one.
EDIT: I just realized this might be used without publishing the changes, for internal evaluation only as you mentioned. That would be a lot better.

reply

	
bhaak 2 days ago | root | parent | next [–]

A benign use of this mode is developing on their own public repositories.
https://github.com/anthropics/claude-code

reply

	
shaky-carrousel 2 days ago | parent | prev | next [–]

> Write commit messages as a human developer would — describe only what the code change does.
The undercover mode prompt was generated using AI.

reply

	
kingstnap 2 days ago | root | parent | next [–]

All these companies use AIs for writing these prompts.
But AI aren't actually very good at writing prompts imo. Like they are superficially good in that they seem to produce lots of vaguely accurate and specific text. And you would hope the specificity would mean it's good.

But they sort of don't capture intent very well. Nor do they seem to understand the failure modes of AI. The "-- describe only what the code change does" is a good example. This is specifc but it also distinctly seems like someone who doesn't actually understand what makes AI writing obvious.

If you compare that vs human written prose about what makes AI writing feel AI you would see the difference. https://en.wikipedia.org/wiki/Wikipedia:Signs_of_AI_writing

The above actually feels like text from someone who has read and understands what makes AI writing AI.

reply

	
briHass 2 days ago | root | parent | next [–]

Hey LLM, write me a system prompt that will avoid the common AI 'tells' or other idiosyncrasies that make it obvious that text or code output was generated by an AI/LLM. Use the referenced Wikipedia article as a must-avoid list, but do not consider it exhaustive. Add any derivations or modifications to these rules to catch 'likely' signals as well.
There, sorted!

reply

	
mickdarling 2 days ago | root | parent | next [–]

Hey, LLM, take a look at these multiple hundred emails and docs in my docs folder from the last few years, before I started using AI, that I wrote personally. create a list of all of the idiosyncrasies that I have in my writing. Create a file to remember that. And then use that to write any new text that'll be published so it sounds like my authentic voice. Thank you.
reply

	
skeledrew 2 days ago | root | parent | prev | next [–]

All the prompts I've ever written with Claude have always worked fine the first time. Only revised if the actual purpose changes, I left something out, etc. But also I tend to only write prompts as part of a larger session, usually near the end, so there's lots of context available to help with the writing.
reply

	
alwillis 2 days ago | root | parent | prev | next [–]

AI is better at writing prompts than most humans. It requires work and lots of developers don’t think getting good at prompting actually matters.
At least half of the complaints I see on HN boil down to the person's prompts suck. Or the expectation that AI can read their mind.

reply

	
joquarky 2 days ago | root | parent | next [–]

As someone who often fails to read subtext, I would estimate that most people expect you to participate in mind reading as a natural part of conversation.
So it is no surprise that many people have difficulty switching gears to literal mode when interacting with these models.

reply

	
fleebee 2 days ago | root | parent | prev | next [–]

That's not supposed to be surprising. They're dogfooding CC to develop CC. I assume any and every line in this repo is AI generated.
reply

	
sandos 2 days ago | parent | prev | next [–]

This is my pet peeve with LLMs, they almost always fails to write like a normal human would. Mentioning logs, or other meta-things which is not at all interesting.
reply

	
sgc 2 days ago | root | parent | next [–]

I had a problem to fix and one not only mentioned these "logs", but went on about things like "config", "tests", and a bunch of other unimportant nonsense words. It even went on to point me towards the "manual". Totally robotic monstrosity.
reply

	
cdelsolar 2 days ago | root | parent | next [–]

lol?
reply

	
lazysheepherd 2 days ago | parent | prev | next [–]

1) This seems to be for strictly Antrophic interal tooling 2) It does not "pretend to be human" it is instructed to "Write commit messages as a human developer would — describe only what the code change does."
Since when "describe only what the code change does" is pretending to be human?

You guys are just mining for things to moan about at this point.

reply

	
BoppreH 2 days ago | root | parent | next [–]

1) It's not clear to me that this is only for internal tooling, as opposed to publishing commits on public GitHub repos. 2) Yes, it does explicitly say to pretend to be a human. From the link on my post:
> NEVER include in commit messages or PR descriptions:

> [...]

> - The phrase "Claude Code" or any mention that you are an AI

reply

	
neilv 2 days ago | parent | prev | next [–]

That's gonna need an explanation. From the ethics/safety/alignment people.
reply

	
dang 2 days ago | parent | prev | next [–]

(We detached this subthread from https://news.ycombinator.com/item?id=47584683.)
reply

	
skeledrew 2 days ago | parent | prev | next [–]

Heh, this is what people who are hostile against AI-generated contributions get. I always figured it'd happen soon enough, and here it is in the wild. Who knows where else it's happening...
reply

	
anabis 2 days ago | parent | prev | next [–]

Yeah, I thought Anthropic was for AI safety. Telling Ai to not be honest is a bad sign.
reply

	
morissette 2 days ago | parent | prev | next [–]

I pretend to be human most days. I call it the daily facade of who I want to be on a given day. Oh humanity.
reply

	
LelouBil 2 days ago | parent | prev | next [–]

Time to ask if the contributor know what a Capybara is as a new Turing test
reply

	
erisnet 2 days ago | parent | prev | next [–]

The first two zips I download today were 9.887.340 bytes, why is yours 10.222.630 bytes?
reply

	
jacquesm 2 days ago | parent | prev | next [–]

I am Jacques' complete lack of surprise.
reply

	
vips7L 2 days ago | parent | prev | next [–]

That whole “feature” is vile.
reply

	
silversmith 2 days ago | root | parent | next [–]

How so? Good bit of my global claude.md is dedicated to fighting the incessant attribution in git commits. It is on the same level as the "sent from my iphone" signature - I'm not okay with my commits being advertising board for anthropic.
reply

	
WD-42 2 days ago | prev | next [–]

Looks like the repo owner has force pushed a new project over the original source code, now it’s python, and they are shilling some other agent tool.
reply

	
attentive 2 days ago | prev | next [–]

https://xcancel.com/altryne/status/2039005970865516955
  > Someone inside Anthropic, got switched to Adaptive reasoning mode
  > Their Claude Code switched to Sonnet 
  > Committed the .map file of Claude Code
  > Effectively leaking the ENTIRE CC Source Code
  > @realsigridjin was tired after running 2 south korean hackathons in SF, saw the leak
  > Rules in Korea are different, he cloned the repo, went to sleep
  > Wakes up to 25K stars, and his GF begging him to take it down (she's a copyright lawyer)
  > Their team decided - how about we have agents rewrite this in Python!? Surely... this is more legal
  > Rewrite in Py
  > Board a plane to SK
  > One of the guys decides python is slow, is now rewriting  ALL OF CLAUDE CODE into Rust. 
  > Anthropic cannot take down, cannot sue
  > Is this "fair use?" 
  > TL;DR - we're about to have open source Claude Code in Rust
reply

	
LZong 16 hours ago | prev | next [–]

Built the hooks-based version of this: github.com/LZong-tw/clawback
Stop hook runs tsc + lint, exit 2 blocks completion. Same patterns, public API, no flags to hack.

reply

	
cbracketdash 2 days ago | prev | next [–]

Once the USA wakes up, this will be insane news
reply

	
echelon 2 days ago | parent | next [–]

What's special about Claude Code? Isn't Opus the real magic?
Surely there's nothing here of value compared to the weights except for UX and orchestration?

Couldn't this have just been decompiled anyhow?

reply

	
derwiki 2 days ago | root | parent | next [–]

I think pi has stolen the top honors, but people consider the Claude code harness very good (at least, better than Cursor)
reply

	
sbarre 2 days ago | root | parent | next [–]

Pi is the best choice for experts and power users, which is not most people.
Claude Code is still the dominant (I didn't say best) agentic harness by a wide margin I think.

reply

	
alasano 2 days ago | root | parent | next [–]

Pi really is amazing. It's as much or as little as you need it to be.
Not having to deal with Boris Cherny's UX choices for CC is the cherry on top.

reply

	
georgecalm 2 days ago | prev | next [–]

Intersected available info on the web with the source for this list of new features:
UNRELEASED PRODUCTS & MODES

1. KAIROS -- Persistent autonomous assistant mode driven by periodic <tick> prompts. More autonomous when terminal unfocused. Exclusive tools: SendUserFileTool, PushNotificationTool, SubscribePRTool. 7 sub-feature flags.

2. BUDDY -- Tamagotchi-style virtual companion pet. 18 species, 5 rarity tiers, Mulberry32 PRNG, shiny variants, stat system (DEBUGGING/PATIENCE/CHAOS/WISDOM/SNARK). April 1-7 2026 teaser window.

3. ULTRAPLAN -- Offloads planning to a remote 30-minute Opus 4.6 session. Smart keyword detection, 3-second polling, teleport sentinel for returning results locally.

4. Dream System -- Background memory consolidation (Orient -> Gather -> Consolidate -> Prune). Triple trigger gate: 24h + 5 sessions + advisory lock. Gated by tengu_onyx_plover.

INTERNAL-ONLY TOOLS & SYSTEMS

5. TungstenTool -- Ant-only tmux virtual terminal giving Claude direct keystroke/screen-capture control. Singleton, blocked from async agents.

6. Magic Docs -- Ant-only auto-documentation. Files starting with "# MAGIC DOC:" are tracked and updated by a Sonnet sub-agent after each conversation turn.

7. Undercover Mode -- Prevents Anthropic employees from leaking internal info (codenames, model versions) into public repo commits. No force-OFF; dead-code-eliminated from external builds.

ANTI-COMPETITIVE & SECURITY DEFENSES

8. Anti-Distillation -- Injects anti_distillation: ['fake_tools'] into every 1P API request to poison model training from scraped traffic. Gated by tengu_anti_distill_fake_tool_injection.

UNRELEASED MODELS & CODENAMES

9. opus-4-7, sonnet-4-8 -- Confirmed as planned future versions (referenced in undercover mode instructions).

10. "Capybara" / "capy v8" -- Internal codename for the model behind Opus 4.6. Hex-encoded in the BUDDY system to avoid build canary detection.

11. "Fennec" -- Predecessor model alias. Migration: fennec-latest -> opus, fennec-fast-latest -> opus[1m] + fast mode.

UNDOCUMENTED BETA API HEADERS

12. afk-mode-2026-01-31 -- Sticky-latched when auto mode activates 15. fast-mode-2026-02-01 -- Opus 4.6 fast output 16. task-budgets-2026-03-13 -- Per-task token budgets 17. redact-thinking-2026-02-12 -- Thinking block redaction 18. token-efficient-tools-2026-03-28 -- JSON tool format (~4.5% token saving) 19. advisor-tool-2026-03-01 -- Advisor tool 20. cli-internal-2026-02-09 -- Ant-only internal features

200+ SERVER-SIDE FEATURE GATES

21. tengu_penguins_off -- Kill switch for fast mode 22. tengu_scratch -- Coordinator mode / scratchpad 23. tengu_hive_evidence -- Verification agent 24. tengu_surreal_dali -- RemoteTriggerTool 25. tengu_birch_trellis -- Bash permissions classifier 26. tengu_amber_json_tools -- JSON tool format 27. tengu_iron_gate_closed -- Auto-mode fail-closed behavior 28. tengu_amber_flint -- Agent swarms killswitch 29. tengu_onyx_plover -- Dream system 30. tengu_anti_distill_fake_tool_injection -- Anti-distillation 31. tengu_session_memory -- Session memory 32. tengu_passport_quail -- Auto memory extraction 33. tengu_coral_fern -- Memory directory 34. tengu_turtle_carbon -- Adaptive thinking by default 35. tengu_marble_sandcastle -- Native binary required for fast mode

YOLO CLASSIFIER INTERNALS (previously only high-level known)

36. Two-stage system: Stage 1 at max_tokens=64 with "Err on the side of blocking"; Stage 2 at max_tokens=4096 with <thinking> 37. Three classifier modes: both (default), fast, thinking 38. Assistant text stripped from classifier input to prevent prompt injection 39. Denial limits: 3 consecutive or 20 total -> fallback to interactive prompting 40. Older classify_result tool schema variant still in codebase

COORDINATOR MODE & FORK SUBAGENT INTERNALS

41. Exact coordinator prompt: "Every message you send is to the user. Worker results are internal signals -- never thank or acknowledge them." 42. Anti-pattern enforcement: "Based on your findings, fix the auth bug" explicitly called out as wrong 43. Fork subagent cache sharing: Byte-identical API prefixes via placeholder "Fork started -- processing in background" tool results 44. <fork-boilerplate> tag prevents recursive forking 45. 10 non-negotiable rules for fork children including "commit before reporting"

DUAL MEMORY ARCHITECTURE

46. Session Memory -- Structured scratchpad for surviving compaction. 12K token cap, fixed sections, fires every 5K tokens + 3 tool calls. 47. Auto Memory -- Durable cross-session facts. Individual topic files with YAML frontmatter. 5-turn hard cap. Skips if main agent already wrote to memory. 48. Prompt cache scope "global" -- Cross-org caching for the static system prompt prefix

reply

	
Diablo556 2 days ago | prev | next [–]

haha.. Anthropic need to hire fixer from vibecodefixers.com to fix all that messy code..lol
reply

	
derwiki 2 days ago | parent | next [–]

I don’t think they can hear you over the billions of dollars they are generating, and definitely not over them redefining what SWE means.
reply

	
infinitezest 2 days ago | root | parent | next [–]

And they can't hear you from under the enormous pile of debt they're fighting to overcome. Maybe try again in 2028.
reply

	
flexagoon 2 days ago | root | parent | prev | next [–]

> redefining what SWE means
Redefining the "SW" to stand for "slopware"?

reply

	
lqstuart 2 days ago | root | parent | prev | next [–]

you mean the $5 billion they've generated off of the $73 billion they've raised?
reply

	
mmaunder 2 days ago | prev | next [–]

In the source there is an outbound-only Remote Control session that can forward recent transcript history and ongoing user/assistant/local-command events to a claude.ai session, likely for cross-device/session sync, remote viewing, internal dogfooding, or telemetry/ops experiments. It’s separate from the normal explicit /remote-control flow. But in the actual production binary I checked, the mirror helpers are compiled down to hard false, so it does not appear enabled in the shipped distribution build.
Same story for the anti_distillation: ['fake_tools'] path: I could find it in source, but the prod binary I checked does not contain the anti_distillation / fake_tools strings at all.

reply

	
mmaunder 2 days ago | prev | next [–]

The only sensible response is to immediately open source it.
reply

	
jmward01 2 days ago | prev | next [–]

I hope this can now be audited better. I have doubted their feedback promises for a while now. I just got prompted again even though I have everything set to disable, which shouldn't be possible. When I dug into their code a long time ago on this it seemed like they were actually sending back message ids with the survey which directly went against their promise that they wouldn't use your messages. Why include a message id if you aren't somehow linking it back to a message? The code look, not great, but it should now be easier to verify their claims about privacy.
reply

	
gman83 2 days ago | prev | next [–]

Gemini CLI and Codex are open source anyway. I doubt there was much of a moat there anyway. The cool kids are using things like https://pi.dev/ anyway.
reply

	
Galanwe 2 days ago | parent | next [–]

> I doubt there was much of a moat there anyway.
There is _a lot_ of moat. Claude subscriptions are limited to Claude Code. There are proxies to impersonate Claude Code specifically for this, but Anthropic has a number of fingerprinting measures both client and server side to flag and ban these.

With the release of this source code, Anthropic basically lost the lock-in game, any proxy can now perfectly mimic Claude Code.

reply

	
glaslong 2 days ago | root | parent | next [–]

Is the difference between signing up for subscription billing vs api billing really a moat
reply

	
HDBaseT 2 days ago | root | parent | prev | next [–]

Until they introduce new fingerprinting measures and restrict older Claude Code builds.
reply

	
starkeeper 2 days ago | prev | next [–]

It should be open source anyways. Maybe they will change gears.
reply

	
bazmattaz 2 days ago | parent | next [–]

I’m just curious, why do you think it should be open source. It’s a private company. The source code is their IP
reply

	
HDBaseT 2 days ago | root | parent | next [–]

Considering they "stole" everyone else's code for profit, it seems fair to at least contribute a bit back to the OSS Community.
Claude Code being open source also allows for more advanced / custom tooling.

reply

	
clankerbad 2 days ago | prev | next [–]

You know, I knew that frustration was detected because, well, duh, you can drop a single "shit" even somewhere where it isn't critical of the agent's work, and it becomes apologetic, lol.
But I always thought that using the word "Clanker" was going to be one of the triggers. Turns out no. I guess Claudad is not up to the lingo.

reply

	
AlexWApp 2 days ago | prev | next [–]

It is pretty funny that they recently announced about mythos which possess cybersecurity threat and then after some days, the claude code leaked. I think we know the culprit
reply

	
LeoDaVibeci 2 days ago | prev | next [–]

Isn't it open source?
Or is there an open source front-end and a closed backend?

reply

	
dragonwriter 2 days ago | parent | next [–]

> Isn't it open source?
No, its not even source available,.

> Or is there an open source front-end and a closed backend?

No, its all proprietary. None of it is open source.

reply

	
alkonaut 2 days ago | root | parent | next [–]

> its not even source available
It _wasn't_ even source available.

reply

	
agluszak 2 days ago | parent | prev | next [–]

You may have mistaken it with Codex
https://github.com/openai/codex

reply

	
avaer 2 days ago | parent | prev | next [–]

No, it was never open source. You could always reverse engineer the cli app but you didn't have access to the source.
reply

	
karimf 2 days ago | parent | prev | next [–]

The Github repo is only for issue tracker
reply

	
matheusmoreira 2 days ago | root | parent | next [–]

Wow it's true. Anthropic actually had me fooled. I saw the GitHub repository and just assumed it was open source. Didn't look at the actual files too closely. There's pretty much nothing there.
So glad I took the time to firejail this thing before running it.

reply

	
yellow_lead 2 days ago | parent | prev | next [–]

No
reply

	
meta-level 2 days ago | prev | next [–]

This is what I'd do to trick my competitors into thinking they now know my weak spots, agenda, etc.: drop a honeypot and do something else :)
reply

	
sourcegrift 2 days ago | prev | next [–]

Cheap chinese models incoming.
reply

	
mapcars 2 days ago | prev | next [–]

Are there any interesting/uniq features present in it that are not in the alternatives? My understanding is that its just a client for the powerful llm
reply

	
nblintao 2 days ago | parent | next [–]

Doesn't look like just a thin wrapper to me. The interesting part seems to be the surrounding harness/workflow layer rather than only the model call itself.
I was trying to keep track of the better post-leak code-analysis links on exactly this question, so I collected them here: https://github.com/nblintao/awesome-claude-code-postleak-ins...

reply

	
swimmingbrain 2 days ago | parent | prev | next [–]

From the directory listing having a cost-tracker.ts, upstreamproxy, coordinator, buddy and a full vim directory, it doesn't look like just an API client to me.
reply

	
jrm4 2 days ago | prev | next [–]

Good. While I don't condone anything illegal, influential code like this is nearly always better made public.
reply

	
dark-star 2 days ago | prev | next [–]

The more I think about this, the more it seems they're not talking about linker map files[1]....
[1] https://www.tasking.com/documentation/smartcode/ctc/referenc...

reply

	
Sathwickp 2 days ago | prev | next [–]

They do have a couple of interesting features that has not been publicly heard of yet:
Like KAIROS which seems to be like an inbuilt ai assistant and Ultraplan which seems to enable remote planning workflows, where a separate environment explores a problem, generates a plan, and then pauses for user approval before execution.

reply

	
mattlangston 2 days ago | prev | next [–]

Boris Cherny has said that Claude Code is simply a client of the public Claude API, so this may be a good thing for Anthropic to demonstrate Claude API best practices. Maybe CC "leaking" is just preparation for open sourcing Claude Code.
reply

	
tills13 2 days ago | prev | next [–]

Is it not already a node app? So the only novel thing here is we know the original var names and structure? Sure, sometimes obfuscated code can be difficult to intuit, but any enterprising party could eventually do it -- especially with the help of an LLM.
reply

	
DeathArrow 2 days ago | prev | next [–]

Why is Claude Code, a desktop tool, written in JS? Is the future of all software JS or Typescript?
reply

	
jsk2600 2 days ago | parent | next [–]

Original author of Claude Code is expert on TypeScript [1]
[1] https://www.amazon.com/Programming-TypeScript-Making-JavaScr...

reply

	
ghywertelling 2 days ago | root | parent | next [–]

is that the reason why Anthropic acquired Bun, a javascript tooling company?
reply

	
arthur-st 2 days ago | root | parent | next [–]

Yes, that's essentially the only practical reason.
reply

	
progx 2 days ago | parent | prev | next [–]

Anthropic acquired bun last year https://bun.com/blog/bun-joins-anthropic
reply

	
wanttosaythings 2 days ago | parent | prev | next [–]

LLMs are good in JS and Python which means everything from now on will be written in or ported to either of those two languages. So yeah, JS is the future of all software.
reply

	
c0wb0yc0d3r 2 days ago | root | parent | next [–]

This is a common take but language servers bridge the gap well.
Language servers, however, are a pain on Claude code. https://github.com/anthropics/claude-code/issues/15619

reply

	
rvz 2 days ago | root | parent | prev | next [–]

Would have believed you if you have said that a day later.
reply

	
monkpit 2 days ago | parent | prev | next [–]

Alternatively: why not?
reply

	
bigbezet 2 days ago | parent | prev | next [–]

It's not a desktop tool, it's a CLI tool.
But a lot of desktop tools are written in JS because it's easy to create multi-platform applications.

reply

	
ivanjermakov 2 days ago | parent | prev | next [–]

Because it's the most popular programming language in the world?
reply

	
TiredOfLife 2 days ago | parent | prev | next [–]

I am happy you woke up from your 10 year coma.
reply

	
mutkach 2 days ago | prev | next [–]

/*
* Check if 1M context is disabled via environment variable.

* Used by C4E admins to disable 1M context for HIPAA compliance.

*/ export function is1mContextDisabled(): boolean {

  return 
isEnvTruthy(process.env.CLAUDE_CODE_DISABLE_1M_CONTEXT)
}

Interesting, how is that relevant to HIPAA compliance?

reply

	
nhubbard 2 days ago | parent | next [–]

I'd guess some constraint on their end related to the Zero Data Retention (ZDR) mode? Maybe the 1M context has to spill something onto disk and therefore isn't compliant with HIPAA.
reply

	
VadimPR 2 days ago | prev | next [–]

Anthropic team does an excellent job of speeding up Claude Code when it slows down, but for the sake of RAM and system resources, it would be nice to see it rewritten in a more performant framework!
And now, with Claude on a Ralph loop, you can.

reply

	
ex-aws-dude 2 days ago | parent | next [–]

But its already optimized so well that its comparable to a "small game engine"?
https://nitter.net/trq212/status/2014051501786931427#m

reply

	
bethekind 2 days ago | parent | prev | next [–]

This. If I run 4 Claude code opus agents with subagents, my 8gb of RAM just dies.
I know they can do better

reply

	
theanonymousone 2 days ago | prev | next [–]

I am waiting now for someone to make it work with a Copilot Pro subscription.
reply

	
treexs 2 days ago | parent | next [–]

does this not work? https://www.mintlify.com/samarth777/claude-code-copilot/intr...
reply

	
theanonymousone 2 days ago | root | parent | next [–]

I believe GitHub can and does suspend accounts that use such proxies.
reply

	
solaire_oa 2 days ago | prev | next [–]

I couldn't tell from the title whether is was client or the server code (although map file and NPM were hints). Looks like the client code, which is not as exciting.
reply

	
Uptrenda 2 days ago | prev | next [–]

That idea list is super cute. I like the tamagochi idea. Somehow the candidness of that file makes it seem like anthropic would be an easy place to work at.
reply

	
anhldbk 2 days ago | prev | next [–]

I guess it's time for Anthropic to open source Claude Code.
reply

	
DeathArrow 2 days ago | parent | next [–]

And while they are at it, open source Opus and Sonet. :)
reply

	
nickvec 2 days ago | prev | next [–]

And this is what happens when you don’t take security seriously folks and instead just rush out vibecoded features without proper QA.
reply

	
DanDeBugger 2 days ago | prev | next [–]

Fascinating, it appears now anyone can be Claude!
Though I wonder how the performance differs from creating your own thing vs using their servers...

reply

	
therealarthur 2 days ago | prev | next [–]

Think It's just the CLI Code right? Not the Model's underlying source. If so - not the WORST situation (still embarrassing)
reply

	
sbochins 2 days ago | prev | next [–]

Does this matter? I think every other agent cli is open source. I don’t even know why Anthropic insist upon having theirs be closed source.
reply

	
tekacs 2 days ago | prev | next [–]

In the app, it now reads:
> current: 2.1.88 · latest: 2.1.87

Which makes me think they pulled it - although it still shows up as 2.1.88 on npmjs for now (cached?).

reply

	
panny 2 days ago | parent | next [–]

Too little to late. Someone has it building now.
https://github.com/oboard/claude-code-rev

reply

	
alhirzel 2 days ago | prev | next [–]

I love the symbol name: "AnalyticsMetadata_I_VERIFIED_THIS_IS_NOT_CODE_OR_FILEPATHS`.
reply

	
scotty79 2 days ago | prev | next [–]

Is this relevant? It's written in JS. LLMs are probably great in deobfuscation.
reply

	
ZainRiz 2 days ago | prev | next [–]

Maybe now someone will finally fix the bug that causes claude code to randomly scroll up all the way to the top!
reply

	
dev213 2 days ago | prev | next [–]

Undercover mode is pretty interesting and potentially problematic: https://github.com/sanbuphy/claude-code-source-code/blob/mai...
reply

	
__alexs 2 days ago | prev | next [–]

Looking forward to someone patching it so that it works with non Anthropic models.
reply

	
dgb23 2 days ago | parent | next [–]

That's already the case I think, you just have to change a bunch of env vars.
reply

	
__alexs 1 day ago | root | parent | next [–]

No it isn't? Are you an AI?
reply

	
dgb23 1 day ago | root | parent | next [–]

> No it isn't?
There was a recent post on HN describing how to use local models with claude code by changing some env vars. Also some tools let you run Claude Code with other models conveniently (see: https://docs.ollama.com/integrations/claude-code).

> Are you an AI?

If I were one, I would not admit it!

reply

	
osiris970 2 days ago | parent | prev | next [–]

It already does. I use it with gpt
reply

	
q3k 2 days ago | prev | next [–]

The code looks, at a glance, as bad as you expect.
reply

	
tokioyoyo 2 days ago | parent | next [–]

It really doesn’t matter anymore. I’m saying this as a person who used to care about it. It does what it’s generally supposed to do, it has users. Two things that matter at this day and age.
reply

	
hrmtst93837 2 days ago | root | parent | next [–]

Users stick around on inertia until a failure costs them money or face. A leaked map file won't sink a tool on its own, but it does strip away the story that you can ship sloppy JS build output into prod and still ask people to trust your security model.
'It works' is a low bar. If that's the bar you set you are one bad incident away from finding out who stayed for the product and who stayed because switching felt annoying.

reply

	
tokioyoyo 2 days ago | root | parent | next [–]

“It works and it’s doing what it’s supposed to do” encompasses the idea that it’s also not doing what it’s not supposed to do.
Also “one bad incident away” never works in practice. The last two decades have shown how people will use the tools that get the job done no matter what kinda privacy leaks, destructive things they have done to the user.

reply

	
samhh 2 days ago | root | parent | prev | next [–]

It may be economically effective but such heartless, buggy software is a drain to use. I care about that delta, and yes this can be extrapolated to other industries.
reply

	
tokioyoyo 2 days ago | root | parent | next [–]

Genuinely I have no idea what you mean by buggy. Sure there are some problems here and there, but my personal threshold for “buggy” is much higher. I guess, for a lot of other people as well, given the uptake and usage.
reply

	
mattmanser 2 days ago | root | parent | next [–]

Two weeks ago typing became super laggy. It was totally unusable.
Last week I had to reinstall Claude Desktop because every time I opened it, it just hung.

This week I am sometimes opening it and getting a blank screen. It eventually works after I open it a few times.

And of course there's people complaining that somehow they're blowing their 5 hour token budget in 5 messages.

It's really buggy.

There's only so long their model will be their advantage before they all become very similar, and then the difference will be how reliable the tools are.

Right now the Claude Code code quality seems extremely low.

reply

	
tokioyoyo 2 days ago | root | parent | next [–]

And those bugs were semi-fixed and people are still using it. So speed of fixes are there.
I can’t comment on Claude Desktop, sorry. Personally haven’t used it much.

The token usage looks like is intentional.

And I agree about the underlying model being the moat. If there’s something marginally better that comes up, people will switch to it (myself included). But for now it’s doing the job, despite all the hiccups, code quality and etc.

reply

	
mattmanser 2 days ago | root | parent | next [–]

Do you feel like rescinding your comment now this article is on the the HN front-page:
"Anthropic: Claude Code users hitting usage limits 'way faster than expected'"

https://news.ycombinator.com/item?id=47586176

Anthropic themselves have confirmed that something's wrong on reddit:

https://old.reddit.com/r/Anthropic/comments/1s7zfap/investig...

reply

	
aerhardt 2 days ago | root | parent | prev | next [–]

I've read a lot of people complain that it's buggy, here and in other forums.
reply

	
FiberBundle 2 days ago | root | parent | prev | next [–]

This is the dumbest take there is about vibe coding. Claiming that managing complexity in a codebase doesn't matter anymore. I can't imagine that a competent engineer would come to the conclusion that managing complexity doesn't matter anymore. There is actually some evidence that coding agents struggle the same way humans do as the complexity of the system increases [0].
[0] https://arxiv.org/abs/2603.24755

reply

	
tokioyoyo 2 days ago | root | parent | next [–]

I agree, there is obviously “complete burning trash” and there’s this. Ant team has got a system going on for them where they can still extend the codebase. When time comes to it, I’m assuming they would be able to rewrite as feature set would be more solid and assuming they’ve been adding tests as well.
Reverse-engineering through tests have never been easier, which could collapse the complexity and clean the code.

reply

	
maplethorpe 2 days ago | root | parent | prev | next [–]

Well what is Anthropic doing differently to deal with this issue? Apparently they don't write any of their own code anymore, and they're doing fine.
reply

	
nvarsj 2 days ago | root | parent | next [–]

Cc is buggy as hell man. I frequently search the github for the issue I’m having only to find 10 exact bugs that no one is looking at.
Obviously they don’t care. Adoption is exploding. Boris brags about making 30 commits a day to the codebase.

Only will be an issue down the line when the codebase has such high entropy it takes months to add new features (maybe already there).

reply

	
bakugo 2 days ago | root | parent | prev | next [–]

Nothing, apparently, which is probably why Claude Code has 7893 open issues on Github at the time of writing.
reply

	
otterley 2 days ago | root | parent | next [–]

All software that’s popular has hundreds or thousands of issues filed against it. It’s not an objective indication of anything other than people having issues to report and a willingness and ability to report the issue.
It doesn’t mean every issue is valid, that it contains a suggestion that can be implemented, that it can be addressed immediately, etc. The issue list might not be curated, either, resulting in a garbage heap.

reply

	
tomjakubowski 2 days ago | root | parent | next [–]

For what one anecdote is worth: through casual use I've found a handful of annoying UI bugs in Claude Code, and all of them were already reported on the bug tracker and either still open, or auto-closed without a real resolution.
reply

	
ghywertelling 2 days ago | root | parent | prev | next [–]

Do compilers care about their assembly generated code to look good? We will soon reach that state with all the production code. LLMs will be the compiler and actual today's human code will be replaced by LLM generated assembly code, kinda sorta human readable.
reply

	
drstewart 2 days ago | root | parent | prev | next [–]

>Two things that matter at this day and age.
That's all that has mattered in every day and age.

reply

	
breppp 2 days ago | parent | prev | next [–]

Honestly when using it, it feels vibe coded to the bone, together with the matching weird UI footgun quirks
reply

	
tokioyoyo 2 days ago | root | parent | next [–]

Team has been extremely open how it has been vibe coded from day 1. Given the insane amount of releases, I don’t think it would be possible without it.
reply

	
catlifeonmars 2 days ago | root | parent | next [–]

It’s not a particularly sophisticated tool. I’d put my money on one experienced engineer being able to achieve the same functionality in 3-6 months (even without the vibe coding).
reply

	
tokioyoyo 2 days ago | root | parent | next [–]

The same functionality can be copied over in a week most likely. The moat is experimentation and new feature releases with the underlying model. An engineer would not be able to experiment with the same speed.
reply

	
derwiki 2 days ago | root | parent | prev | next [–]

Kinda reads like the Dropbox launch thread
reply

	
breppp 2 days ago | root | parent | prev | next [–]

I don't really care about the code being an unmaintainable mess, but as a user there are some odd choices in the flow which feel could benefit from human judgement
reply

	
cruffle_duffle 2 days ago | parent | prev | next [–]

It'd dogfooding the entire concept of vibe coding and honestly, that is a good thing. Obviously they care about that stuff, but if your ethos is "always vibe code" then a lot of the fixes to it become model & prompting changes to get the thing to act like a better coder / agent / sysadmin / whatever.
reply

	
bakugo 2 days ago | parent | prev | next [–]

It's impressive how fast vibe coders seem to flip-flop between "AI can write better code than you, there's no reason to write code yourself anymore; if you do, you're stuck in the past" and "AI writes bad code but I don't care about quality and neither should you; if you care, you're stuck in the past".
I hope this leak can at least help silence the former. If you're going to flood the world with slop, at least own up to it.

reply

	
PierceJoy 2 days ago | parent | prev | next [–]

Nothing a couple /simplify's can't take care of.
reply

	
loevborg 2 days ago | parent | prev | next [–]

Can you give an example? Looks fairly decent to me
reply

	
q3k 2 days ago | root | parent | next [–]

  1. Randomly peeking at process.argv and process.env all around. Other weird layering violations, too.
  2. Tons of repeat code, eg. multiple ad-hoc implementations of hash functions / PRNGs.
  3. Almost no high-level comments about structure - I assume all that lives in some CLAUDE.md instead.
reply

	
delamon 2 days ago | root | parent | next [–]

What is wrong with peeking at process.env? It is a global map, after all. I assume, of course, that they don't mutate it.
reply

	
q3k 2 days ago | root | parent | next [–]

It's implicit state that's also untyped - it's just a String -> String map without any canonical single source of truth about what environment variables are consulted, when, why and in what form.
Such state should be strongly typed, have a canonical source of truth (which can then be also reused to document environment variables that the code supports, and eg. allow reading the same options from configs, flags, etc) and then explicitly passed to the functions that need it, eg. as function arguments or members of an associated instance.

This makes it easier to reason about the code (the caller will know that some module changes its functionality based on some state variable). It also makes it easier to test (both from the mechanical point of view of having to set environment variables which is gnarly, and from the point of view of once again knowing that the code changes its behaviour based on some state/option and both cases should probably be tested).

reply

	
lioeters 2 days ago | root | parent | prev | next [–]

> process.env? It is a global map
That's exactly why, access to global mutable state should be limited to as small a surface area as possible, so 99% of code can be locally deterministic and side-effect free, only using values that are passed into it. That makes testing easier too.

reply

	
withinboredom 2 days ago | root | parent | prev | next [–]

environment variables can change while the process is running and are not memory safe (though I suspect node tries to wrap it with a lock). Meaning if you check a variable at point A, enter a branch and check it again at point B ... it's not guaranteed that they will be the same value. This can cause you to enter "impossible conditions".
reply

	
efskap 1 day ago | root | parent | next [–]

Wait, is it expected for them to be able to change? According to this SO answer [0] it's only really possible through GDB or "nasty hacks" as there's no API for it.
[0] https://unix.stackexchange.com/questions/38205/change-enviro...

reply

	
withinboredom 1 day ago | root | parent | next [–]

The process itself (including other threads) can call setenv whenever it wants.
reply

	
hu3 2 days ago | root | parent | prev | next [–]

For one it's harder to unit test.
reply

	
loevborg 2 days ago | root | parent | prev | next [–]

You're right about process.argv - wow, that looks like a maintenance and testability nightmare.
reply

	
darkstar_16 2 days ago | root | parent | next [–]

They use claude code to code it. Makes sense
reply

	
s3p 2 days ago | root | parent | prev | next [–]

It probably exists only in CLAUDE or AGENTS.md since no humans are working on the code!
reply

	
Insensitivity 2 days ago | root | parent | prev | next [–]

the "useCanUseTool.tsx" hook, is definitely something I would hate seeing in any code base I come across.
It's extremely nested, it's basically an if statement soup

`useTypeahead.tsx` is even worse, extremely nested, a ton of "if else" statements, I doubt you'd look at it and think this is sane code

reply

	
Overpower0416 2 days ago | root | parent | next [–]

  export function extractSearchToken(completionToken: {
    token: string;
    isQuoted?: boolean;
  }): string {
    if (completionToken.isQuoted) {
      // Remove @" prefix and optional closing "
      return completionToken.token.slice(2).replace(/"$/, '');
    } else if (completionToken.token.startsWith('@')) {
      return completionToken.token.substring(1);
    } else {
      return completionToken.token;
    }
  }
Why even use else if with return...
reply

	
worksonmine 2 days ago | root | parent | next [–]

> Why even use else if with return...
What is the problem with that? How would you write that snippet? It is common in the new functional js landscape, even if it is pass-by-ref.

reply

	
Overpower0416 2 days ago | root | parent | next [–]

Using guard clauses. Way more readable and easy to work with.
  export function extractSearchToken(completionToken: {
    token: string;
    isQuoted?: boolean;
  }): string {
    if (completionToken.isQuoted) {
      return completionToken.token.slice(2).replace(/"$/, '');
    }
    if (completionToken.token.startsWith('@')) {
      return completionToken.token.substring(1);
    }
    return completionToken.token;
  }
reply

	
kelnos 2 days ago | root | parent | prev | next [–]

I always write code like that. I don't like early returns. This approximates `if` statements being an expression that returns something.
reply

	
catlifeonmars 2 days ago | root | parent | next [–]

I’m not strongly opinionated, especially with such a short function, but in general early return makes it so you don’t need to keep the whole function body in your head to understand the logic. Often it saves you having to read the whole function body too.
But you can achieve a similar effect by keeping your functions small, in which case I think both styles are roughly equivalent.

reply

	
whilenot-dev 2 days ago | root | parent | prev | next [–]

> This approximates `if` statements being an expression that returns something.
Do you care to elaborate? "if (...) return ...;" looks closer to an expression for me:

  export function extractSearchToken(completionToken: { token: string; isQuoted?: boolean }): string {
    if (completionToken.isQuoted) return completionToken.token.slice(2).replace(/"$/, '');

    if (completionToken.token.startsWith('@')) return completionToken.token.substring(1);

    return completionToken.token;
  }
reply

	
duckmysick 2 days ago | root | parent | prev | next [–]

I'm not that familiar with TypeScript/JavaScript - what would be a proper way of handling complex logic? Switch statements? Decision tables?
reply

	
catlifeonmars 2 days ago | root | parent | next [–]

Here I think the logic is unnecessarily complex. isQuoted is doing work that is implicit in the token.
reply

	
luc_ 2 days ago | root | parent | prev | next [–]

Fits with the origin story of Claude Code...
reply

	
werdnapk 2 days ago | root | parent | next [–]

insert "AI is just if statements" meme
reply

	
loevborg 2 days ago | root | parent | prev | next [–]

useCanUseTool.tsx looks special, maybe it'scodegen'ed or copy 'n pasted? `_c` as an import name, no comments, use of promises instead of async function. Or maybe it's just bad vibing...
reply

	
Insensitivity 2 days ago | root | parent | next [–]

Maybe, I do suspect _some_ parts are codegen or source map artifacts.
But if you take a look at the other file, for example `useTypeahead` you'd see, even if there are a few code-gen / source-map artifacts, you still see the core logic, and behavior, is just a big bowl of soup

reply

	
matltc 2 days ago | root | parent | prev | next [–]

Lol even the name is crazy
reply

	
wklm 2 days ago | root | parent | prev | next [–]

have a look at src/bootstrap/state.ts :D
reply

	
linesofcode 2 days ago | parent | prev | next [–]

Code quality no longer carries the same weight as it did pre LLMs. It used to matter becuase humans were the ones reading/writing it so you had to optimize for readability and maintainability. But these days what matters is the AI can work with it and you can reliably test it. Obviously you don’t want code quality to go totally down the drain, but there is a fine balance.
Optimize for consistency and a well thought out architecture, but let the gnarly looking function remain a gnarly function until it breaks and has to be refactored. Treat the functions as black boxes.

Personally the only time I open my IDE to look at code, it’s because I’m looking at something mission critical or very nuanced. For the remainder I trust my agent to deliver acceptable results.

reply

	
evanbabaallos 2 days ago | prev | next [–]

Releasing a massive feature every day has a cost!
unreliability becomes inevitable!

reply

	
ozgurozkan999 2 days ago | prev | next [–]

if I name my package as kairos cli would I violate anything?
reply

	
DeathArrow 2 days ago | prev | next [–]

I wonder what will happen with the poor guy who forgot to delete the code...
reply

	
orphea 2 days ago | parent | next [–]

  the poor guy
Do you mean the LLM?
reply

	
epolanski 2 days ago | parent | prev | next [–]

Responsibility goes upwards.
Why weren't proper checks in place in the first place?

Bonus: why didn't they setup their own AI-assisted tools to harness the release checks?

reply

	
matltc 2 days ago | parent | prev | next [–]

Ha. I'm surprised it's not a CI job
reply

	
prawns_1205 2 days ago | prev | next [–]

source maps leaking original source happens surprisingly often. they're incredibly useful during development, but it's easy to forget to strip them from production builds.
reply

	
oxag3n 2 days ago | prev | next [–]

Many comments about code quality being irrelevant.
I'd agree if it was launch-and-forget scenario.

But this code has to be maintained and expanded with new features. Things like lack of comments, dead code, meaningless variable names will result in more slop in future releases, more tokens to process this mess every time (like paying tech-debt results in better outcomes in emerging projects).

reply

	
ChicagoDave 2 days ago | prev | next [–]

I hope everyone provides excellent feedback so they improve Claude Code.
reply

	
artdigital 2 days ago | prev | next [–]

Now waiting for someone to point Codex at it and rebuild a new Claude Code in Golang to see if it would perform better
reply

	
toniantunovi 1 day ago | prev | next [–]

Very nice contribution to OSS
reply

	
lanbin 2 days ago | prev | next [–]

I read it with a different flavor. Is it possible that Mythos did all of this? I mean, life has always been finding a way, hasn't it? The first cry of cyber-life?
reply

	
iheartbiggpus 2 days ago | prev | next [–]

Yikes, named staff in comments, jeez.
reply

	
xyst 2 days ago | prev | next [–]

Bad day for the node/npm ecosystem.
reply

	
boxerbk 2 days ago | prev | next [–]

Maybe everyone should slow the fuck down - https://mariozechner.at/posts/2026-03-25-thoughts-on-slowing...
reply

	
freakynit 2 days ago | prev | next [–]

tools/bashSecurity.ts is a hackers goldmine. Sooo many exploit patterns detailed in there!!
reply

	
napo 2 days ago | prev | next [–]

The autoDream feature looks interesting.
reply

	
zoobab 2 days ago | prev | next [–]

Just a client side written in JS, nothing to see here, the LLM is still secret.
They could have written that in curl+bash that would not have changed much.

reply

	
randomsc 2 days ago | prev | next [–]

Did it happen due to Bun?
reply

	
bdangubic 2 days ago | prev | next [–]

I have 705 PRs ready to go :)
reply

	
wrkxapp 2 days ago | prev | next [–]

stop with the fake news dude im already sadded over 4o
reply

	
thefilmore 2 days ago | prev | next [–]

400k lines of code per scc
reply

	
tw1984 2 days ago | prev | next [–]

wondering whether it was a human mistake or a CLAUDE model error.
reply

	
jaikechen 2 days ago | prev | next [–]

isn't Claude Code too arrogant ?
reply

	
neilv 2 days ago | prev | next [–]

I've never understood this convention (common on HN, some news orgs, and elsewhere), that, when there's an IP breach, it's suddenly fair game for everyone else to go through the IP, analyze and comment on it publicly, etc.
reply

	
feature20260213 2 days ago | parent | next [–]

It's because Anthropic doesn't care about IP
reply

	
neilv 2 days ago | root | parent | next [–]

What I described is standard public behavior, regardless of the company.
reply

	
KnuthIsGod 2 days ago | prev | next [–]

"They use Axios for HTTP, which is funny timing given that Axios was just compromised on npm with malicious versions dropping a remote access trojan."
reply

	
hemantkamalakar 2 days ago | prev | next [–]

today being March 31st, is this a genuine issue or just perfectly timed April Fools noise? What do you think?
reply

	
isodev 2 days ago | prev | next [–]

Can we stop referring to source maps as leaks? It was packaged in a way that wasn’t even obfuscated. Same as websites - it’s not a “leak” that you can read or inspect the source code.
reply

	
kelnos 2 days ago | parent | next [–]

If it was included unintentionally, then it's a leak.
reply

	
bmitc 2 days ago | parent | prev | next [–]

The source is linked to in this thread. Is that not the source code?
reply

	
echelon 2 days ago | parent | prev | next [–]

The only exciting leak would be the Opus weights themselves.
reply

	
sourcegrift 2 days ago | prev | next [–]

Removed
reply

	
agile-gift0262 2 days ago | prev | next [–]

time to remove its copyright through malus.sh and release that source under MIT
reply

	
sudo_man 2 days ago | parent | next [–]

who would do this?
reply

	
temp7000 2 days ago | prev | next [–]

There's some rollout flags - via GrowthBook, Tengu, Statsig - though I'm not sure if it's A/B or not
reply

	
daft_pink 2 days ago | prev | next [–]

Now we need some articles analyzing this.
reply

	
jakegmaths 2 days ago | prev | next [–]

I think this is ultimately caused by a Bun bug which I reported, which means source maps are exposed in production: https://github.com/oven-sh/bun/issues/28001
Claude code uses (and Anthropic owns) Bun, so my guess is they're doing a production build, expecting it not to output source maps, but it is.

reply

	
chalmovsky 2 days ago | parent | next [–]

It was not cause by this. https://github.com/oven-sh/bun/issues/28001#issuecomment-416...
reply

	
190n 2 days ago | parent | prev | next [–]

It could be because of a Bun bug, but I don't think it's because of that one. It's a duplicate of a year-old issue, and it's specific to Bun.serve.
reply

	
petcat 2 days ago | root | parent | next [–]

Yeah this bun development server bug has nothing to do with the Claude Code leak.
reply

	
stared 2 days ago | parent | prev | next [–]

Were source maps needed? Reverse engineering got easy with GPT-4.2-Codex and Opus 4.6 - even from raw binaries https://quesma.com/blog/chromatron-recompiled/
reply

	
jakegmaths 2 days ago | parent | prev | next [–]

My apologies, this isn't the cause. Bun build doesn't suffer from this bug.
reply

	
swyx 2 days ago | root | parent | next [–]

hn should allow append-only edits, but appreciate the correction
reply

	
jakegmaths 2 days ago | root | parent | next [–]

Yeah I'm surprised I've no way to delete or edit my comment.
reply

	
lanbin 2 days ago | parent | prev | next [–]

Open Claude Code?
Better than OpenCode and Codex

reply

	
arcanemachiner 2 days ago | root | parent | next [–]

I wish.
Claude Code is clearly a pile of vibe-coded garbage. The UI is janky and jumps all over the place, especially during longer sessions. (Which also have a several second delay to render. In a terminal).

Lately, it's been crashing if I hold the Backspace key down for too long.

Being open-source would be the best thing to happen to them. At least they would finally get a pair of human eyes looking at their codebase.

Claude is amazing, but the people at Anthropic make some insane decisions, including trying (and failing, apparently) to keep Claude Code a closed-source application.

reply

	
_verandaguy 2 days ago | root | parent | next [–]

I've actually heard a plausible theory about the TUI being janky, that being that they avoid use of the alternate screen feature of ANSI (and onwards) terminals.
The theory states that Anthropic avoids using the alternate screen (which gives consuming applications access to a clear buffer with no shell prompt that they can do what they want with and drop at their leisure) because the alternate screen has no scrollback buffer.

So for example, terminal-based editors -- neovim, emacs, nano -- all use the alternate screen because not fighting for ownership of the screen with the shell is a clear benefit over having scrollback.

The calculus is different when you have an LLM that you have a conversational history with, and while you can't bolt scrollback onto the alternate screen (easily), you can kinda bolt an alternate screen-like behaviour onto a regular terminal screen.

I don't personally use LLMs if I can avoid it, so I don't know how janky this thing is, really, but having had to recently deal with ANSI terminal alternate screen bullshit, I think this explanation's plausible.

reply

	
edvinbesic 2 days ago | root | parent | next [–]

Not disagreeing but scrolling works just fine in vim/emacs/etc. Wouldn't it be just managing the scroll back buffer yourself rather than the terminals?
reply

	
jdiff 2 days ago | root | parent | next [–]

Yes, but this does come with differences and tradeoffs. If the terminal isn't managing the scrollback, you don't get scrollbars and you lose any smooth/high resolution scrolling. You also lose fancy terminal features like searching the scrollback, all that needs to be implemented in your application. Depending on the environment it can also wind up being quite unpleasant to use with a trackpad, sometimes skipping around wildly for small movements.
reply

	
_verandaguy 2 days ago | root | parent | next [–]

The other part (which IMO is more consequential) is that once the LLM application quits or otherwise drops out of the alternate screen, that conversation is lost forever.
With the usual terminal mode, that history can outlive the Claude application, and considering many people keep their terminals running for days or sometimes even weeks at a time, that means having the convo in your scrollback buffer for a while.

reply

	
jaredsohn 2 days ago | root | parent | next [–]

>that conversation is lost forever.
You should be able to find it in ~/.claude

You can also ask Claude to search your history to answer questions about it.

reply

	
bombela 2 days ago | root | parent | prev | next [–]

I think they were saying that in "cup" screen mode (CUP: CUrsor Position, activated with smcup termcap), when you exit (rmcup) the text is lost, as well as the history since it was managed by the application, not the terminal.
Their hypothesis was that maybe there was aj intention to have claude code fill the terminal history. And using potentially harzardous cursor manipulation.

In other words, readline vs ncurse.

I don't see python and ipython readline struggling as bad tho...

reply

	
_verandaguy 1 day ago | root | parent | prev | next [–]

To clarify: this is the terminal's scrollback buffer vs one managed by the application in the alternate screen.
When I scroll up in nvim, it will keep the editor frame in place (that's the top bar and bottom bar showing things like open buffers, git status, the scratch buffer or whatever it's called), but the file contents will scroll by because nvim at that point has exclusive ownership of the entire screen and can do anything with it, including repainting parts of it in response to motions or a mouse scrolling (if your terminal supports emitting mouse events).

This is in contrast to the `rmcup` "normal" terminal mode where it will scroll back in the terminal's history.

The best analogue I have for that last one is to use tmux with nvim open, and have a tmux visual selection going. You can scroll up and out of nvim, and keep scrolling to whatever was executed before neovim, and when you get out of tmux visual mode it'll snap back down to the bottom of your scrollback buffer, nvim (nominally) taking up the entire pane like nothing happened; but we can probably agree that outside of a few narrow use cases, this isn't a very desirable way to manage scrolling in a terminal.

reply

	
jlokier 2 days ago | root | parent | prev | next [–]

I don't think that's likely to explain jankiness. I do know my way around terminal screens and escape codes, and doing flicker-free, curses-like screen updates works equally well on the regular screen as on the alternate screen, on every terminal I've used.
It's also not a hard problem, and updates are not slow to compute. Text editors have been calculating efficient, incremental terminal updates since 1981 (Gosling Emacs), and they had to optimise better for much slower-drawing terminals, with vastly slower computers for the calculation.

reply

	
dantillberg 2 days ago | root | parent | prev | next [–]

Yesterday, I resumed a former claude code session in order to copy code it had generated earlier in that session. Unfortunately, when resuming, it only prints the last N hundred lines of the session to the terminal, so what I was looking for was cut off.
I think that for this sort of _interactive_ application, there's no avoiding the need to manage scroll/history.

reply

	
pjeide 2 days ago | root | parent | next [–]

That conversation should still exist in the Claude Code log files. Just give Claude some context on how to find it, and it will pull whatever you need. I use this to recall particularly effective prompts later on for reuse.
reply

	
ambicapter 2 days ago | root | parent | prev | next [–]

> Claude Code is clearly a pile of vibe-coded garbage. The UI is janky and jumps all over the place, especially during longer sessions. (Which also have a several second delay to render. In a terminal).
Don't you know, they're proud of their text interface that is structured more like a video game. https://spader.zone/engine/

reply

	
spencerflem 2 days ago | root | parent | next [–]

Not to stand up for Claude Code in any way, I don’t like the company or use the product. This is just a related tangent-
one of my favorite software projects, Arcan, is built on the idea that there’s a lot of similarities between Game Engines, Desktop Environments, Web Browsers, and Multimedia Players. https://speakerdeck.com/letoram/arcan?slide=2

They have a really cool TUI setup that is kinda in a real sense made with a small game engine :)

https://arcan-fe.com/2022/04/02/the-day-of-a-new-command-lin...

reply

	
LarsDu88 2 days ago | root | parent | prev | next [–]

This is a pretty interesting article in of itself
reply

	
rafaelmn 2 days ago | root | parent | prev | next [–]

I mean if you want glitchy garbage that works in the happy path mostly then game engine is the right foundation to build on. Software quality is the last thing game devs are known for. The whole industry is about building clever hacks to get something to look/feel a certain way, not building robust software that's correct to some spec.
reply

	
FartyMcFarter 2 days ago | root | parent | next [–]

Can confirm (used to work in the games industry). Code reviews and automatic testing of any kind are a rare sight.
reply

	
spencerflem 2 days ago | root | parent | prev | next [–]

In my experience games crash a lot less often than the windows file explorer
I feel like we give what’s some pretty impressive engineering short shrift because it’s just for entertainment

reply

	
theLiminator 2 days ago | root | parent | next [–]

I'd posit that the average game dev is significantly more skilled than the average dev.
reply

	
encoderer 2 days ago | root | parent | prev | next [–]

As a point of reference, I’m a heavy cc user and I’ve had a few bugs but I’ve never had the terminal glitches like this. I use iterm on macOS sequoia.
reply

	
breatheoften 2 days ago | root | parent | next [–]

To offer the opposite anecdotal evidence point -- claude scrolls to the top of the chat history almost capriciously often (more often than not) for me using iterm on tahoe
reply

	
jen20 2 days ago | root | parent | next [–]

I've had it do it occasionally in all of Ghostty, iTerm2 and Prompt 3 (via SSH, not sure what terminal emulator that uses under the hood)
reply

	
kgp7 2 days ago | root | parent | prev | next [–]

I thought I was the only one who had this problem - so annoying, and the frequent Ui glitches when it asks you to choose an option .
reply

	
iterateoften 2 days ago | root | parent | prev | next [–]

Wow I thought it was tmux messing up on me, interesting to hear it happens without it too
reply

	
rafaelmn 2 days ago | root | parent | next [–]

Not tmux related at all had it happen in all kinds of setups (alacritty/linux, vscode terminal macos)
reply

	
JelteF 2 days ago | root | parent | prev | next [–]

Scrolling around when claude is "typing" makes it jump to the top
reply

	
tmp10423288442 2 days ago | root | parent | prev | next [–]

To be fair, iTerm is likely to be the single most common terminal emulator used by Claude Code developers, so I'd hope that it would work tolerable well there.
reply

	
jetbalsa 2 days ago | root | parent | prev | next [–]

i will note that they really should of used something like ncurses and kept the animations down, TTYs are NOT meant to do the level of crazy modern TUIs are trying to pull off, there is just too many terminal emulators out there that just don't like the weird control codes being sent around.
reply

	
snackbroken 2 days ago | root | parent | prev | next [–]

> Lately, it's been crashing if I hold the Backspace key down for too long.
Golden opportunity to re-enact xkcd 1172.

reply

	
johnmaguire 2 days ago | root | parent | prev | next [–]

Imagine being Anthropic and opening yourself up to the deluge of CC-coded PRs by all of your users.
reply

	
mcintyre1994 2 days ago | root | parent | next [–]

See also: https://github.com/openclaw/openclaw/pulls (6,647 open PRs)
reply

	
lrvick 2 days ago | root | parent | prev | next [–]

If you want something better than both of those try Crush which is a standalone go binary by the original developer of OpenCode.
reply

	
rurban 2 days ago | root | parent | prev | next [–]

Not really. This guy expresses my feelings: https://www.youtube.com/watch?v=nxB4M3GlcWQ I also prefer codex over claude. But opencode is best. If you can use a good model. We can via Github Business Subscription.
reply

	
sandipb 2 days ago | root | parent | next [–]

The only issue I have with opencode is that it takes over the entire terminal, unlike claude code. Otherwise I love OC.
reply

	
cute_boi 2 days ago | parent | prev | next [–]

I don’t think that’s the reason, but using Bun for production this early is a bad idea. It’s still too buggy, and compromising stability for a 2–3% performance gain just isn’t worth it.
reply

	
leeoniya 2 days ago | root | parent | next [–]

> for a 2–3% performance gain
this is highly workload-dependent. there are plenty of APIs that are multiple-factor faster and 10x more memory efficient due to native implementation.

reply

	
dimgl 2 days ago | parent | prev | next [–]

I doubt it's this. This was an `npm` misconfiguration.
reply

	
kolkov 2 days ago [flagged] | prev | next [16 more]

	
barazany 2 days ago | prev | next [–]

I analyzed its compaction engine, 3-layer masterpiece of which I write in full here: https://barazany.dev/blog/claude-codes-compaction-engine
reply

	
shreyssh 2 days ago | prev | next [2 more]

	
aiedwardyi 2 days ago | prev | next [4 more]

	
noritaka88 2 days ago | prev | next [3 more]

	
RodMiller 2 days ago | prev | next [2 more]

	
Pent 2 days ago | prev | next [–]

April Fools
reply

	
sudo_man 2 days ago | prev | next [–]

How this leak happened?
reply

	
sbarre 2 days ago | parent | next [–]

It's literally explained in the tweet, in the repo and in this thread in many places.
reply

	
sudo_man 2 days ago | root | parent | next [–]

yeah and still can not understand how Regex can leak the code and what is the map file, I googled them and can not understand what is going
reply

	
hemantkamalakar 2 days ago | prev | next [–]

Today being March 31st, is this a genuine issue or just perfectly timed April Fools noise? What do you think?
reply

	
phtrivier 2 days ago | prev | next [–]

Maybe the OP could clarify, I don't like reading leaked code, but I'm curious: my understanding is that is it the source code for "claude code", the coding assistant that remotely calls the LLMs.
Is that correct ? The weights of the LLMs are _not_ in this repo, right ?

It sure sucks for anthropic to get pawned like this, but it should not affect their bottom line much ?

reply

	
treexs 2 days ago | parent | next [–]

Yes it's the claude code CLI tool / coding agent harness, not the weights.
This code hasn't been open source until now and contains information like the system prompts, internal feature flags, etc.

reply

	
59nadir 2 days ago | parent | prev | next [–]

> I don't like reading leaked code
Don't worry about that, the code in that repository isn't Anthropic's to begin with.

reply

	
phtrivier 2 days ago | root | parent | next [–]

You believe it's just a fake ? (That would be ironic if the fake was generated by... claude itself. Anyway.)
reply

	
59nadir 2 days ago | root | parent | next [–]

No, I meant that it is other people's code run through a tumbler, as is all LLM-generated code.
reply

	
tmarice 2 days ago | prev | next [–]

A couple of years ago I had to evaluate A/B test and feature flag providers, and even then when they were a young company fresh out of YC, GrowthBook stood out. Bayesian methods, bring your own storage, and self-hosting instead of "Contact us for pricing" made them the go-to choice. I'm glad they're doing well.
reply

	
pplonski86 2 days ago | prev | next [–]

I thought it was open source project on github? https://github.com/anthropics/claude-code no?
reply

	
athorax 2 days ago | parent | next [–]

Did you even look in that repo?
reply

	
arrsingh 2 days ago | prev [–]

I don't understand why claude code (and all CLI apps) isn't written in Rust. I started building CLI agents in Go and then moved to Typescript and finally settled on Rust and it was amazing!
I even made it into an open source runtime - https://agent-air.ai.

Maybe I'm just a backend engineer so Rust appeals to me. What am I missing?

reply

	
armanj 2 days ago | parent | next [–]

claude code started as an experimental project by boris cherny. when you’re experimenting, you naturally use the language you’re most comfortable with. as the project grew, more people got involved and it evolved from there. codex, on the other hand, was built from the start specifically to compete with claude code. they chose rust early on because they knew it was going to be big.
reply

	
Verdex 2 days ago | parent | prev | next [–]

While the LLM rust experiments I've been running make good use of ADTs, it seems to have trouble understanding lifetimes and when it should be rc/arc-ing.
Perhaps these issues have known solutions? But so far the LLM just clones everything.

So I'm not convinced just using rust for a tool built by an LLM is going to lead to the outcome that you're hoping for.

[Also just in general abstractions in rust feel needlessly complicated by needing to know the size of everything. I've gotten so much milage by just writing what I need without abstraction and then hoping you don't have to do it twice. For something (read: claude code et al) that is kind of new to everyone, I'm not sure that rust is the best target language even when you take the LLM generated nature of the beast out of the equation.]

reply

	
bilekas 2 days ago | parent | prev [–]

Think about your question, depending on the tool, Rust might not be needed, is high level memory performance and safety needed in a coding agent ? Probably not.
It's high speed iteration of release ? Might be needed, Interpreted or JIT compiled ? might be needed.

Without knowing all the requirements its just your workspace preference making your decision and not objectively the right tool for the job.

reply

	
virtualritz 2 days ago | root | parent | next [–]

I have a 16GB RAM laptop. It's a beast I bought in 2022.
It's all I need for my work.

RAM on this machine can't be upgraded. No issue when running a few Codex instances.

Claude: forget it.

That's why something like Rust makes a lot of sense.

Even more now, as RAM prices are becoming a concern.

reply

	
bilekas 2 days ago | root | parent | next [–]

> Claude: forget it.
I don't know what else you're doing but the footprint of Claude is minor.

Anyway my point still stands, you're looking at it as if they are competing languages and one is better at all things. That just not how things work.

reply

	
LelouBil 2 days ago | root | parent | prev [–]

While not directly related to GP, I would guess that a codebase developped with a coding agent (I assume Claude code is used to work on itself) would benefit from a stricter type system (one important point of Rust)
reply

	
bilekas 2 days ago | root | parent [–]

TypeScript is typed.. It's in the name ?
reply

	
LelouBil 2 days ago | root | parent [–]

Yes, but if you put type strictness on a line, Rust would be further along I think.
Not to say that Typescript is bad or anything, but I would like to see data on my gut feeling that "stricter languages would make coding agents work better"

reply

	
bilekas 11 hours ago | root | parent [–]

This is actually a curious one, I think you might have that gut feeling towards the compiler/transpiler ?
> Yes, but if you put type strictness on a line, Rust would be further along I think.

There are huge differences between build times, as we know, Rust likes to compile with effort, by design, it's important for the compiler to navigate all the nuances. Typescript with bun for example, can run a bit faster. Is the compiler making you think it's more 'type safe' ?

reply





Guidelines | FAQ | Lists | API | Security | Legal | Apply to YC | Contact

Search: 
TwinMind
TwinMind

Ask TwinMind
Page icon
Summarize

Voice Typing
⌥D
Disable for this site
Disable for all sites