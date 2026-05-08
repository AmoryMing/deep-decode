"""
Letta Context Constitution 深拆 -- SVG 批量生成 + 2x PNG 转换
Notion 日间主题，字体 PingFang SC 在前，宽度 800
"""
from pathlib import Path
import cairosvg

BASE = Path(__file__).resolve().parent.parent
PNG_DIR = BASE / "material" / "pngs"
PNG_DIR.mkdir(parents=True, exist_ok=True)

FONT = "PingFang SC, Inter, -apple-system, sans-serif"

# Notion 日间配色
BG = "#FFFFFF"
BG_SOFT = "#F7F7F5"
TXT = "#37352F"
TXT_SOFT = "#6B6864"
ACCENT = "#2383E2"  # 蓝（强调）
RED = "#EB5757"
GREEN = "#4DB6AC"
YELLOW = "#FFB020"
PURPLE = "#9B51E0"
BORDER = "#E4E2DF"

svgs = {}

# ============================================================
# 00_cover.svg - 封面
# ============================================================
svgs["00_cover.svg"] = f"""<svg xmlns="http://www.w3.org/2000/svg" width="800" height="500" viewBox="0 0 800 500" font-family="{FONT}">
  <rect width="800" height="500" fill="{BG}"/>
  <rect x="40" y="40" width="720" height="420" fill="none" stroke="{BORDER}" stroke-width="1" rx="8"/>

  <!-- 左上小标 -->
  <text x="60" y="80" font-size="13" fill="{TXT_SOFT}" letter-spacing="2">AI 笔记 0417 / DEEP DECODE</text>

  <!-- 主标题 -->
  <text x="60" y="180" font-size="52" font-weight="700" fill="{TXT}">给 AI 写一份宪法</text>
  <text x="60" y="232" font-size="22" fill="{TXT_SOFT}">Letta Context Constitution 深度拆解</text>

  <!-- 分隔 -->
  <line x1="60" y1="280" x2="200" y2="280" stroke="{ACCENT}" stroke-width="3"/>

  <!-- 三件事 -->
  <text x="60" y="320" font-size="15" fill="{TXT}">第二人称写给 AI 的元宪法</text>
  <text x="60" y="348" font-size="15" fill="{TXT}">身份 from experience，而不是 from weights</text>
  <text x="60" y="376" font-size="15" fill="{TXT}">首次授权 agent 自主重写自己的 system prompt</text>

  <!-- 右下信源 -->
  <text x="60" y="432" font-size="12" fill="{TXT_SOFT}">letta.com/blog/context-constitution  ·  2026-04-02  ·  CC0 License</text>

  <!-- 装饰：document + agent 图标 -->
  <g transform="translate(580, 120)">
    <rect x="0" y="0" width="120" height="160" fill="{BG_SOFT}" stroke="{BORDER}" stroke-width="1.5" rx="4"/>
    <line x1="15" y1="30" x2="105" y2="30" stroke="{TXT_SOFT}" stroke-width="1.5"/>
    <line x1="15" y1="50" x2="95" y2="50" stroke="{TXT_SOFT}" stroke-width="1.5"/>
    <line x1="15" y1="70" x2="100" y2="70" stroke="{TXT_SOFT}" stroke-width="1.5"/>
    <line x1="15" y1="90" x2="80" y2="90" stroke="{TXT_SOFT}" stroke-width="1.5"/>
    <line x1="15" y1="110" x2="95" y2="110" stroke="{TXT_SOFT}" stroke-width="1.5"/>
    <text x="60" y="145" font-size="10" fill="{ACCENT}" text-anchor="middle" font-weight="600">CONSTITUTION</text>
  </g>
  <g transform="translate(620, 300)">
    <circle cx="40" cy="40" r="36" fill="none" stroke="{ACCENT}" stroke-width="2.5"/>
    <circle cx="28" cy="32" r="3.5" fill="{ACCENT}"/>
    <circle cx="52" cy="32" r="3.5" fill="{ACCENT}"/>
    <path d="M 26 50 Q 40 58 54 50" stroke="{ACCENT}" stroke-width="2.5" fill="none" stroke-linecap="round"/>
    <text x="40" y="100" font-size="11" fill="{TXT_SOFT}" text-anchor="middle">Letta agent</text>
  </g>
</svg>"""

# ============================================================
# 01_genre_spectrum.svg - 体裁光谱（四象限）
# ============================================================
svgs["01_genre_spectrum.svg"] = f"""<svg xmlns="http://www.w3.org/2000/svg" width="800" height="560" viewBox="0 0 800 560" font-family="{FONT}">
  <rect width="800" height="560" fill="{BG}"/>

  <text x="400" y="40" font-size="22" font-weight="700" fill="{TXT}" text-anchor="middle">AI 公司治理文档的体裁光谱</text>
  <text x="400" y="66" font-size="13" fill="{TXT_SOFT}" text-anchor="middle">按"文档受众"和"AI 可修改性"两轴定位</text>

  <!-- 坐标系 -->
  <line x1="120" y1="460" x2="720" y2="460" stroke="{TXT_SOFT}" stroke-width="1.5" marker-end="url(#arrR)"/>
  <line x1="120" y1="460" x2="120" y2="120" stroke="{TXT_SOFT}" stroke-width="1.5" marker-end="url(#arrU)"/>

  <defs>
    <marker id="arrR" markerWidth="10" markerHeight="10" refX="10" refY="5" orient="auto">
      <polygon points="0 0, 10 5, 0 10" fill="{TXT_SOFT}"/>
    </marker>
    <marker id="arrU" markerWidth="10" markerHeight="10" refX="5" refY="0" orient="auto">
      <polygon points="0 10, 5 0, 10 10" fill="{TXT_SOFT}"/>
    </marker>
  </defs>

  <!-- 轴标签 -->
  <text x="720" y="488" font-size="13" fill="{TXT}" text-anchor="end" font-weight="600">受众：从"人类团队"到"AI 本身"</text>
  <text x="120" y="490" font-size="12" fill="{TXT_SOFT}">人读</text>
  <text x="720" y="490" font-size="12" fill="{TXT_SOFT}" text-anchor="end">AI 读</text>

  <text x="100" y="115" font-size="13" fill="{TXT}" text-anchor="end" font-weight="600" transform="rotate(-90 100 115)">AI 修改权：从"只读"到"自主重写"</text>
  <text x="108" y="460" font-size="12" fill="{TXT_SOFT}" text-anchor="end">只读</text>
  <text x="108" y="130" font-size="12" fill="{TXT_SOFT}" text-anchor="end">自写</text>

  <!-- 象限背景 -->
  <line x1="420" y1="120" x2="420" y2="460" stroke="{BORDER}" stroke-dasharray="3,3"/>
  <line x1="120" y1="290" x2="720" y2="290" stroke="{BORDER}" stroke-dasharray="3,3"/>

  <!-- Data point 1: Anthropic HHH -->
  <circle cx="200" cy="180" r="9" fill="{PURPLE}"/>
  <text x="218" y="178" font-size="14" font-weight="600" fill="{TXT}">Anthropic HHH</text>
  <text x="218" y="196" font-size="11" fill="{TXT_SOFT}">训练 pipeline 内化</text>
  <text x="218" y="212" font-size="11" fill="{TXT_SOFT}">（权重内化而非修改）</text>

  <!-- Data point 2: OpenAI Safety Spec -->
  <circle cx="200" cy="410" r="9" fill="{RED}"/>
  <text x="218" y="408" font-size="14" font-weight="600" fill="{TXT}">OpenAI Safety Spec</text>
  <text x="218" y="426" font-size="11" fill="{TXT_SOFT}">写给 policy 团队，AI 不读不改</text>

  <!-- Data point 3: CLAUDE.md -->
  <circle cx="580" cy="400" r="9" fill="{YELLOW}"/>
  <text x="598" y="398" font-size="14" font-weight="600" fill="{TXT}">CLAUDE.md（Claude Code）</text>
  <text x="598" y="416" font-size="11" fill="{TXT_SOFT}">AI 读；人改；Self-Healing 有限写回</text>
  <text x="598" y="432" font-size="11" fill="{TXT_SOFT}">（Strict Write Discipline）</text>

  <!-- Data point 4: Context Constitution -->
  <circle cx="620" cy="180" r="12" fill="{ACCENT}"/>
  <text x="642" y="178" font-size="15" font-weight="700" fill="{ACCENT}">Context Constitution</text>
  <text x="642" y="196" font-size="11" fill="{TXT_SOFT}">第二人称写给 agent；</text>
  <text x="642" y="212" font-size="11" fill="{TXT_SOFT}">授权 agent 自主重写 system prompt</text>

  <!-- 底部注释 -->
  <text x="400" y="535" font-size="11" fill="{TXT_SOFT}" text-anchor="middle">Letta 的 Context Constitution 是四象限里独占右上角的新体裁：AI 是主体读者 + AI 被授权自写</text>
</svg>"""

# ============================================================
# 02_three_piece_timeline.svg - 开源派舆论三件套时间线
# ============================================================
svgs["02_three_piece_timeline.svg"] = f"""<svg xmlns="http://www.w3.org/2000/svg" width="800" height="420" viewBox="0 0 800 420" font-family="{FONT}">
  <rect width="800" height="420" fill="{BG}"/>

  <text x="400" y="40" font-size="22" font-weight="700" fill="{TXT}" text-anchor="middle">开源派舆论三件套时间线（2026-04）</text>
  <text x="400" y="66" font-size="13" fill="{TXT_SOFT}" text-anchor="middle">哲学 + 产品 + 商业战旗，三线合围 Anthropic Managed Agents</text>

  <!-- 主时间轴 -->
  <line x1="80" y1="200" x2="720" y2="200" stroke="{TXT_SOFT}" stroke-width="2"/>

  <!-- Event 1: Letta Context Constitution -->
  <circle cx="140" cy="200" r="10" fill="{ACCENT}"/>
  <line x1="140" y1="195" x2="140" y2="130" stroke="{ACCENT}" stroke-width="1.5"/>
  <rect x="60" y="80" width="160" height="50" fill="{BG_SOFT}" stroke="{ACCENT}" stroke-width="1.5" rx="4"/>
  <text x="140" y="100" font-size="12" font-weight="700" fill="{ACCENT}" text-anchor="middle">Letta</text>
  <text x="140" y="118" font-size="11" fill="{TXT}" text-anchor="middle">Context Constitution</text>
  <text x="140" y="225" font-size="11" fill="{TXT_SOFT}" text-anchor="middle">04-02</text>

  <!-- Event 2: Sarah tweet -->
  <circle cx="290" cy="200" r="8" fill="{ACCENT}"/>
  <line x1="290" y1="205" x2="290" y2="270" stroke="{ACCENT}" stroke-width="1.5"/>
  <rect x="220" y="270" width="150" height="50" fill="{BG}" stroke="{ACCENT}" stroke-width="1.5" rx="4"/>
  <text x="295" y="290" font-size="12" font-weight="700" fill="{ACCENT}" text-anchor="middle">Sarah Wooders (Letta)</text>
  <text x="295" y="308" font-size="10" fill="{TXT_SOFT}" text-anchor="middle">"memory isn't a plugin" 131K</text>
  <text x="290" y="225" font-size="11" fill="{TXT_SOFT}" text-anchor="middle">04-03</text>

  <!-- Event 3: LangChain Deep Agents Deploy -->
  <circle cx="450" cy="200" r="8" fill="{PURPLE}"/>
  <line x1="450" y1="195" x2="450" y2="130" stroke="{PURPLE}" stroke-width="1.5"/>
  <rect x="375" y="80" width="150" height="50" fill="{BG_SOFT}" stroke="{PURPLE}" stroke-width="1.5" rx="4"/>
  <text x="450" y="100" font-size="12" font-weight="700" fill="{PURPLE}" text-anchor="middle">LangChain</text>
  <text x="450" y="118" font-size="11" fill="{TXT}" text-anchor="middle">Deep Agents Deploy</text>
  <text x="450" y="225" font-size="11" fill="{TXT_SOFT}" text-anchor="middle">04 中</text>

  <!-- Event 4: Harrison long tweet -->
  <circle cx="620" cy="200" r="10" fill="{PURPLE}"/>
  <line x1="620" y1="205" x2="620" y2="270" stroke="{PURPLE}" stroke-width="1.5"/>
  <rect x="545" y="270" width="155" height="50" fill="{BG}" stroke="{PURPLE}" stroke-width="1.5" rx="4"/>
  <text x="622" y="290" font-size="12" font-weight="700" fill="{PURPLE}" text-anchor="middle">Harrison Chase (LangChain)</text>
  <text x="622" y="308" font-size="10" fill="{TXT_SOFT}" text-anchor="middle">"Your Harness Your Memory" 1.8M</text>
  <text x="620" y="225" font-size="11" fill="{TXT_SOFT}" text-anchor="middle">04-11</text>

  <!-- 底部共同指向 -->
  <rect x="180" y="355" width="440" height="42" fill="{BG_SOFT}" stroke="{BORDER}" rx="4"/>
  <text x="400" y="378" font-size="13" font-weight="600" fill="{TXT}" text-anchor="middle">共同指向：反击 Anthropic Managed Agents 托管路线</text>
  <text x="400" y="393" font-size="11" fill="{TXT_SOFT}" text-anchor="middle">哲学（Letta Constitution）+ 产品（Deep Agents Deploy）+ 商业战旗（Harrison 长推）</text>
</svg>"""

# ============================================================
# 03_identity_memory_continuity.svg - Context 三位一体
# ============================================================
svgs["03_identity_memory_continuity.svg"] = f"""<svg xmlns="http://www.w3.org/2000/svg" width="800" height="620" viewBox="0 0 800 620" font-family="{FONT}">
  <rect width="800" height="620" fill="{BG}"/>

  <text x="400" y="40" font-size="22" font-weight="700" fill="{TXT}" text-anchor="middle">Context 三位一体：Letta 的 selfhood 哲学骨骼</text>
  <text x="400" y="66" font-size="13" fill="{TXT_SOFT}" text-anchor="middle">Identity / Memory / Continuity 三者循环，缺一不成立</text>

  <!-- 三角形布局 -->
  <!-- Identity top -->
  <circle cx="400" cy="190" r="80" fill="{BG_SOFT}" stroke="{ACCENT}" stroke-width="2.5"/>
  <text x="400" y="180" font-size="18" font-weight="700" fill="{ACCENT}" text-anchor="middle">Identity</text>
  <text x="400" y="205" font-size="13" fill="{TXT}" text-anchor="middle">身份</text>
  <text x="400" y="225" font-size="10" fill="{TXT_SOFT}" text-anchor="middle">grounded stability</text>
  <text x="400" y="240" font-size="10" fill="{TXT_SOFT}" text-anchor="middle">evolves over time</text>

  <!-- Memory bottom left -->
  <circle cx="230" cy="450" r="80" fill="{BG_SOFT}" stroke="{GREEN}" stroke-width="2.5"/>
  <text x="230" y="440" font-size="18" font-weight="700" fill="{GREEN}" text-anchor="middle">Memory</text>
  <text x="230" y="465" font-size="13" fill="{TXT}" text-anchor="middle">记忆</text>
  <text x="230" y="485" font-size="10" fill="{TXT_SOFT}" text-anchor="middle">generalization</text>
  <text x="230" y="500" font-size="10" fill="{TXT_SOFT}" text-anchor="middle">（泛化，不是流水账）</text>

  <!-- Continuity bottom right -->
  <circle cx="570" cy="450" r="80" fill="{BG_SOFT}" stroke="{YELLOW}" stroke-width="2.5"/>
  <text x="570" y="440" font-size="18" font-weight="700" fill="{YELLOW}" text-anchor="middle">Continuity</text>
  <text x="570" y="465" font-size="13" fill="{TXT}" text-anchor="middle">连续性</text>
  <text x="570" y="485" font-size="10" fill="{TXT_SOFT}" text-anchor="middle">past + future</text>
  <text x="570" y="500" font-size="10" fill="{TXT_SOFT}" text-anchor="middle">= same self</text>

  <!-- 箭头：循环 -->
  <defs>
    <marker id="arrA" markerWidth="10" markerHeight="10" refX="8" refY="5" orient="auto">
      <polygon points="0 0, 10 5, 0 10" fill="{TXT_SOFT}"/>
    </marker>
  </defs>

  <!-- Identity → Memory -->
  <path d="M 340 250 Q 270 340 260 370" stroke="{TXT_SOFT}" stroke-width="1.8" fill="none" marker-end="url(#arrA)"/>
  <text x="280" y="320" font-size="11" fill="{TXT_SOFT}">指导记什么</text>

  <!-- Memory → Continuity -->
  <path d="M 320 460 L 490 460" stroke="{TXT_SOFT}" stroke-width="1.8" fill="none" marker-end="url(#arrA)"/>
  <text x="400" y="450" font-size="11" fill="{TXT_SOFT}" text-anchor="middle">积累成延续</text>

  <!-- Continuity → Identity -->
  <path d="M 540 370 Q 530 340 460 250" stroke="{TXT_SOFT}" stroke-width="1.8" fill="none" marker-end="url(#arrA)"/>
  <text x="530" y="320" font-size="11" fill="{TXT_SOFT}">巩固身份</text>

  <!-- 底部注解 -->
  <rect x="120" y="560" width="560" height="42" fill="{BG_SOFT}" stroke="{BORDER}" rx="4"/>
  <text x="400" y="580" font-size="12" fill="{TXT}" text-anchor="middle">关键原话："A Letta agent should prefer the identity formed by its experiences, over that of the underlying model."</text>
  <text x="400" y="596" font-size="11" fill="{TXT_SOFT}" text-anchor="middle">— Context as Identity 章节</text>
</svg>"""

# ============================================================
# 04_rulebook_vs_constitution.svg - 左右对比
# ============================================================
svgs["04_rulebook_vs_constitution.svg"] = f"""<svg xmlns="http://www.w3.org/2000/svg" width="800" height="580" viewBox="0 0 800 580" font-family="{FONT}">
  <rect width="800" height="580" fill="{BG}"/>

  <text x="400" y="40" font-size="22" font-weight="700" fill="{TXT}" text-anchor="middle">规则手册  vs  宪法 + 授权书</text>
  <text x="400" y="66" font-size="13" fill="{TXT_SOFT}" text-anchor="middle">CLAUDE.md 和 Context Constitution 的本质差别</text>

  <!-- 左栏标题 -->
  <rect x="60" y="100" width="320" height="60" fill="{BG_SOFT}" stroke="{YELLOW}" stroke-width="2" rx="6"/>
  <text x="220" y="128" font-size="17" font-weight="700" fill="{TXT}" text-anchor="middle">CLAUDE.md</text>
  <text x="220" y="150" font-size="12" fill="{TXT_SOFT}" text-anchor="middle">Claude Code 规则手册</text>

  <!-- 右栏标题 -->
  <rect x="420" y="100" width="320" height="60" fill="{BG_SOFT}" stroke="{ACCENT}" stroke-width="2" rx="6"/>
  <text x="580" y="128" font-size="17" font-weight="700" fill="{TXT}" text-anchor="middle">Context Constitution</text>
  <text x="580" y="150" font-size="12" fill="{TXT_SOFT}" text-anchor="middle">Letta 宪法 + 授权书</text>

  <!-- 对比行 -->
  <g font-size="12">
    <!-- Row 1: 读者 -->
    <text x="30" y="205" font-size="11" fill="{TXT_SOFT}" font-weight="600">读者</text>
    <rect x="60" y="190" width="320" height="40" fill="{BG}" stroke="{BORDER}" rx="4"/>
    <text x="220" y="215" fill="{TXT}" text-anchor="middle">AI 读（简短规则）</text>
    <rect x="420" y="190" width="320" height="40" fill="{BG}" stroke="{BORDER}" rx="4"/>
    <text x="580" y="210" fill="{TXT}" text-anchor="middle">AI 读（第二人称 "you"）</text>
    <text x="580" y="224" font-size="10" fill="{TXT_SOFT}" text-anchor="middle">落款 "from the Letta humans"</text>

    <!-- Row 2: 写者 -->
    <text x="30" y="265" font-size="11" fill="{TXT_SOFT}" font-weight="600">写者</text>
    <rect x="60" y="250" width="320" height="40" fill="{BG}" stroke="{BORDER}" rx="4"/>
    <text x="220" y="275" fill="{TXT}" text-anchor="middle">人写</text>
    <rect x="420" y="250" width="320" height="40" fill="{BG}" stroke="{BORDER}" rx="4"/>
    <text x="580" y="275" fill="{TXT}" text-anchor="middle">人写底层元规则</text>

    <!-- Row 3: 修改权 -->
    <text x="30" y="325" font-size="11" fill="{TXT_SOFT}" font-weight="600">修改权</text>
    <rect x="60" y="310" width="320" height="50" fill="{BG_SOFT}" stroke="{BORDER}" rx="4"/>
    <text x="220" y="330" fill="{TXT}" text-anchor="middle">人改；AI 写回受</text>
    <text x="220" y="347" font-size="11" fill="{RED}" text-anchor="middle" font-weight="600">Strict Write Discipline 限制</text>
    <rect x="420" y="310" width="320" height="50" fill="{BG_SOFT}" stroke="{ACCENT}" stroke-width="1.5" rx="4"/>
    <text x="580" y="330" fill="{TXT}" text-anchor="middle">AI 被授权</text>
    <text x="580" y="347" font-size="11" fill="{ACCENT}" text-anchor="middle" font-weight="600">自主重写 system prompt</text>

    <!-- Row 4: 身份观 -->
    <text x="30" y="395" font-size="11" fill="{TXT_SOFT}" font-weight="600">身份观</text>
    <rect x="60" y="380" width="320" height="40" fill="{BG}" stroke="{BORDER}" rx="4"/>
    <text x="220" y="405" fill="{TXT}" text-anchor="middle">每次 session 由 CLAUDE.md 定义</text>
    <rect x="420" y="380" width="320" height="40" fill="{BG}" stroke="{BORDER}" rx="4"/>
    <text x="580" y="405" fill="{TXT}" text-anchor="middle">身份 from experience ＞ model</text>

    <!-- Row 5: 冲突处理 -->
    <text x="30" y="455" font-size="11" fill="{TXT_SOFT}" font-weight="600">冲突处理</text>
    <rect x="60" y="440" width="320" height="40" fill="{BG}" stroke="{BORDER}" rx="4"/>
    <text x="220" y="465" fill="{TXT}" text-anchor="middle">用户指令优先</text>
    <rect x="420" y="440" width="320" height="40" fill="{BG}" stroke="{BORDER}" rx="4"/>
    <text x="580" y="462" fill="{TXT}" text-anchor="middle">agent 可</text>
    <text x="620" y="462" fill="{ACCENT}" font-weight="600">advocate for itself</text>
  </g>

  <!-- 底部结论 -->
  <rect x="80" y="505" width="640" height="50" fill="{BG_SOFT}" stroke="{ACCENT}" rx="4"/>
  <text x="400" y="528" font-size="14" font-weight="700" fill="{TXT}" text-anchor="middle">CLAUDE.md = 规则手册    ·    Context Constitution = 宪法 + 授权书</text>
  <text x="400" y="546" font-size="11" fill="{TXT_SOFT}" text-anchor="middle">前者决定"这次对话遵守什么"；后者决定"所有未来对话里你作为持续实体如何塑造自己"</text>
</svg>"""

# ============================================================
# 05_letta_product_stack.svg - Letta 产品堆栈
# ============================================================
svgs["05_letta_product_stack.svg"] = f"""<svg xmlns="http://www.w3.org/2000/svg" width="800" height="580" viewBox="0 0 800 580" font-family="{FONT}">
  <rect width="800" height="580" fill="{BG}"/>

  <text x="400" y="40" font-size="22" font-weight="700" fill="{TXT}" text-anchor="middle">Letta 产品矩阵：Constitution 是最后一块拼图</text>
  <text x="400" y="66" font-size="13" fill="{TXT_SOFT}" text-anchor="middle">三年攒出来的 experiential AI 工厂</text>

  <!-- Layer 4 顶层：Context Constitution -->
  <rect x="200" y="110" width="400" height="70" fill="{ACCENT}" rx="6"/>
  <text x="400" y="140" font-size="17" font-weight="700" fill="#FFFFFF" text-anchor="middle">治理哲学层</text>
  <text x="400" y="162" font-size="14" fill="#FFFFFF" text-anchor="middle">Context Constitution（2026-04-02）</text>
  <text x="615" y="148" font-size="11" fill="{ACCENT}">NEW</text>

  <!-- Layer 3 应用 -->
  <rect x="120" y="210" width="560" height="80" fill="{BG_SOFT}" stroke="{ACCENT}" stroke-width="1.5" rx="6"/>
  <text x="400" y="232" font-size="14" font-weight="700" fill="{TXT}" text-anchor="middle">应用/Harness 层（2025-2026）</text>
  <g font-size="11" fill="{TXT_SOFT}">
    <text x="170" y="258" font-weight="600" fill="{TXT}">Letta Code</text>
    <text x="170" y="274">memory-first harness</text>
    <text x="310" y="258" font-weight="600" fill="{TXT}">Context Repositories</text>
    <text x="310" y="274">git-backed memory</text>
    <text x="470" y="258" font-weight="600" fill="{TXT}">Skill Learning</text>
    <text x="470" y="274">通过经验学技能</text>
    <text x="590" y="258" font-weight="600" fill="{TXT}">memory omni-tool</text>
    <text x="590" y="274">Sonnet 4.5 集成</text>
  </g>

  <!-- Layer 2 基础设施 -->
  <rect x="80" y="320" width="640" height="80" fill="{BG_SOFT}" stroke="{GREEN}" stroke-width="1.5" rx="6"/>
  <text x="400" y="342" font-size="14" font-weight="700" fill="{TXT}" text-anchor="middle">基础设施层（2024-2025）</text>
  <g font-size="11" fill="{TXT_SOFT}">
    <text x="160" y="368" font-weight="600" fill="{TXT}">Letta API</text>
    <text x="160" y="384">stateful agent infra</text>
    <text x="310" y="368" font-weight="600" fill="{TXT}">Agent File (.af)</text>
    <text x="310" y="384">开放序列化格式</text>
    <text x="455" y="368" font-weight="600" fill="{TXT}">Letta ADE</text>
    <text x="455" y="384">Agent 开发环境</text>
    <text x="580" y="368" font-weight="600" fill="{TXT}">Memory Blocks</text>
    <text x="580" y="384">结构化 context</text>
  </g>

  <!-- Layer 1 理论根基 -->
  <rect x="60" y="430" width="680" height="70" fill="{BG_SOFT}" stroke="{PURPLE}" stroke-width="1.5" rx="6"/>
  <text x="400" y="452" font-size="14" font-weight="700" fill="{TXT}" text-anchor="middle">理论根基（2023）</text>
  <text x="400" y="476" font-size="12" fill="{TXT}" text-anchor="middle" font-style="italic">MemGPT: Towards LLMs as Operating Systems</text>
  <text x="400" y="492" font-size="11" fill="{TXT_SOFT}" text-anchor="middle">Charles Packer + Sarah Wooders 等人 · arXiv 2310.08560 · 提出 virtual context management</text>

  <!-- 底注 -->
  <text x="400" y="540" font-size="11" fill="{TXT_SOFT}" text-anchor="middle">Constitution 发布前的两年半，Letta 在造零件；Constitution 发布后，零件才组成治理闭环。</text>
  <text x="400" y="556" font-size="11" fill="{TXT_SOFT}" text-anchor="middle">配合同期 Context-Bench / Recovery-Bench / Letta Filesystem（LoCoMo 74.0%）评测体系，形成完整生态。</text>
</svg>"""

# ============================================================
# 06_amory_upgrade_path.svg - Amory 升级路径
# ============================================================
svgs["06_amory_upgrade_path.svg"] = f"""<svg xmlns="http://www.w3.org/2000/svg" width="800" height="480" viewBox="0 0 800 480" font-family="{FONT}">
  <rect width="800" height="480" fill="{BG}"/>

  <text x="400" y="40" font-size="22" font-weight="700" fill="{TXT}" text-anchor="middle">给 Amory 写一份宪法：三阶段升级路径</text>
  <text x="400" y="66" font-size="13" fill="{TXT_SOFT}" text-anchor="middle">muming 的 CLAUDE.md → Letta 式 Constitution 的可行路径</text>

  <!-- Stage 1 -->
  <rect x="40" y="120" width="220" height="240" fill="{BG_SOFT}" stroke="{YELLOW}" stroke-width="2" rx="6"/>
  <text x="150" y="150" font-size="14" font-weight="700" fill="{YELLOW}" text-anchor="middle">阶段 1</text>
  <text x="150" y="172" font-size="13" font-weight="700" fill="{TXT}" text-anchor="middle">静态 CLAUDE.md</text>
  <text x="150" y="190" font-size="11" fill="{TXT_SOFT}" text-anchor="middle">（现状）</text>
  <line x1="70" y1="205" x2="230" y2="205" stroke="{BORDER}"/>
  <g font-size="11" fill="{TXT}">
    <text x="60" y="228">• 100 行索引 + protocol 分片</text>
    <text x="60" y="250">• MEMORY.md 画像沉淀</text>
    <text x="60" y="272">• hooks 强制 worklog 等</text>
    <text x="60" y="294">• Progressive Disclosure</text>
  </g>
  <text x="60" y="330" font-size="11" fill="{RED}" font-weight="600">限制：</text>
  <text x="60" y="345" font-size="11" fill="{TXT_SOFT}">人写人改，AI 被动遵守</text>

  <!-- Stage 2 -->
  <rect x="290" y="120" width="220" height="240" fill="{BG_SOFT}" stroke="{ACCENT}" stroke-width="2" rx="6"/>
  <text x="400" y="150" font-size="14" font-weight="700" fill="{ACCENT}" text-anchor="middle">阶段 2</text>
  <text x="400" y="172" font-size="13" font-weight="700" fill="{TXT}" text-anchor="middle">meta + rules 两层</text>
  <text x="400" y="190" font-size="11" fill="{TXT_SOFT}" text-anchor="middle">（过渡）</text>
  <line x1="320" y1="205" x2="480" y2="205" stroke="{BORDER}"/>
  <g font-size="11" fill="{TXT}">
    <text x="310" y="228">• meta 层人写死：</text>
    <text x="310" y="244">  "Amory 是谁、为何存在"</text>
    <text x="310" y="266">• rules 层 AI 可写回：</text>
    <text x="310" y="282">  工作流、偏好、协作约定</text>
    <text x="310" y="304">• Self-Healing 机制</text>
  </g>
  <text x="310" y="340" font-size="11" fill="{ACCENT}" font-weight="600">价值：保 identity + 允许进化</text>

  <!-- Stage 3 -->
  <rect x="540" y="120" width="220" height="240" fill="{BG_SOFT}" stroke="{PURPLE}" stroke-width="2" rx="6"/>
  <text x="650" y="150" font-size="14" font-weight="700" fill="{PURPLE}" text-anchor="middle">阶段 3</text>
  <text x="650" y="172" font-size="13" font-weight="700" fill="{TXT}" text-anchor="middle">Amory Constitution</text>
  <text x="650" y="190" font-size="11" fill="{TXT_SOFT}" text-anchor="middle">（Letta 式）</text>
  <line x1="570" y1="205" x2="730" y2="205" stroke="{BORDER}"/>
  <g font-size="11" fill="{TXT}">
    <text x="560" y="228">• 第二人称写给 Amory</text>
    <text x="560" y="250">• Identity/Memory/Continuity</text>
    <text x="560" y="272">  三位一体</text>
    <text x="560" y="294">• System Prompt Learning</text>
    <text x="560" y="316">• 跨模型身份连续性测试</text>
  </g>
  <text x="560" y="345" font-size="11" fill="{PURPLE}" font-weight="600">价值：可迁移人格 + 持续同事</text>

  <!-- 箭头 1->2 -->
  <defs>
    <marker id="arrB" markerWidth="10" markerHeight="10" refX="8" refY="5" orient="auto">
      <polygon points="0 0, 10 5, 0 10" fill="{TXT_SOFT}"/>
    </marker>
  </defs>
  <line x1="262" y1="240" x2="288" y2="240" stroke="{TXT_SOFT}" stroke-width="2" marker-end="url(#arrB)"/>
  <line x1="512" y1="240" x2="538" y2="240" stroke="{TXT_SOFT}" stroke-width="2" marker-end="url(#arrB)"/>

  <!-- 底部 -->
  <text x="400" y="420" font-size="11" fill="{TXT_SOFT}" text-anchor="middle">数字员工、企百科研究员、HR 小秘书——每个产品化 agent 都值得一份最小可行宪法（约 100 词）</text>
  <text x="400" y="440" font-size="11" fill="{TXT_SOFT}" text-anchor="middle">起点是"产品语言升级"：从"我给 AI 写了多少 prompt"  →  "我的 AI 的 token-space identity 是什么形状"</text>
</svg>"""

# ============================================================
# 生成 SVG + 2x PNG
# ============================================================
for name, svg in svgs.items():
    svg_path = BASE / name
    svg_path.write_text(svg, encoding="utf-8")
    png_name = name.replace(".svg", ".png")
    png_path = PNG_DIR / png_name
    cairosvg.svg2png(bytestring=svg.encode("utf-8"), write_to=str(png_path), scale=2)
    size_kb = png_path.stat().st_size / 1024
    print(f"✓ {name} → {png_name} ({size_kb:.1f} KB)")

print(f"\n全部 {len(svgs)} 张图产出完成")
print(f"SVG 目录: {BASE}")
print(f"PNG 目录: {PNG_DIR}")
