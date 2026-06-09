import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { repoRoot } from "./repo";
import { getAllSlugs } from "./content";

// 中国《广告法》绝对化用语（极限词）——发布前必查
const AD_LAW_WORDS = [
  "国家级",
  "最高级",
  "最佳",
  "第一品牌",
  "独一无二",
  "绝无仅有",
  "顶级",
  "最便宜",
  "最先进",
  "唯一",
  "首选",
];

// 写作铁律里的 voice 禁用（CLAUDE.md）
const VOICE_BANNED = ["让我们", "值得注意的是", "我认为", "众所周知"];

const EMOJI =
  /[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{1F000}-\u{1F02F}]/u;

export type Severity = "error" | "warn" | "info";
export interface ComplianceIssue {
  type: string;
  severity: Severity;
  detail: string;
}
export interface ComplianceResult {
  slug: string;
  title: string;
  status: "pass" | "warn" | "error";
  issues: ComplianceIssue[];
  reviewed: boolean;
}

function checkArticle(
  slug: string,
  data: Record<string, unknown>,
  body: string,
): ComplianceIssue[] {
  const issues: ComplianceIssue[] = [];

  for (const w of AD_LAW_WORDS) {
    const n = body.split(w).length - 1;
    if (n > 0)
      issues.push({
        type: "广告法极限词",
        severity: "error",
        detail: `「${w}」出现 ${n} 次，涉嫌违反广告法绝对化用语`,
      });
  }
  for (const w of VOICE_BANNED) {
    if (body.includes(w))
      issues.push({
        type: "voice 禁用",
        severity: "warn",
        detail: `出现「${w}」（写作铁律禁用）`,
      });
  }
  if (EMOJI.test(body))
    issues.push({
      type: "emoji",
      severity: "warn",
      detail: "正文含 emoji（写作铁律禁用）",
    });

  // 引用合规：有英文长句但缺 source
  if (!data.source)
    issues.push({
      type: "信源缺失",
      severity: "warn",
      detail: "frontmatter 缺 source（引用合规要求标注原文 URL）",
    });

  // 英文引用是否翻译（粗略：含较长英文引号片段）
  const enQuotes = body.match(/"[A-Za-z][^"]{30,}"/g) || [];
  if (enQuotes.length > 0)
    issues.push({
      type: "引用翻译",
      severity: "info",
      detail: `检测到 ${enQuotes.length} 处长英文引用，确认均已附中文翻译`,
    });

  return issues;
}

function reviewedSet(): Set<string> {
  const f = path.join(repoRoot(), "schedule", "compliance-reviewed.json");
  try {
    if (fs.existsSync(f)) {
      const arr = JSON.parse(fs.readFileSync(f, "utf8"));
      return new Set(Array.isArray(arr) ? arr.map(String) : []);
    }
  } catch {
    /* ignore */
  }
  return new Set();
}

export function getComplianceReport(): ComplianceResult[] {
  const reviewed = reviewedSet();
  const out = path.join(repoRoot(), "output");
  return getAllSlugs()
    .map((slug) => {
      const file = path.join(out, slug, "article.md");
      const raw = fs.readFileSync(file, "utf8");
      const { data, content } = matter(raw);
      const issues = checkArticle(slug, data, content);
      const hasError = issues.some((i) => i.severity === "error");
      const hasWarn = issues.some((i) => i.severity === "warn");
      return {
        slug,
        title: data.title ? String(data.title) : slug,
        status: hasError ? "error" : hasWarn ? "warn" : "pass",
        issues,
        reviewed: reviewed.has(slug),
      } as ComplianceResult;
    })
    .sort((a, b) => {
      const rank = { error: 0, warn: 1, pass: 2 };
      return rank[a.status] - rank[b.status];
    });
}

export interface ComplianceSummary {
  total: number;
  pass: number;
  warn: number;
  error: number;
  reviewed: number;
}

export function getComplianceSummary(): ComplianceSummary {
  const r = getComplianceReport();
  return {
    total: r.length,
    pass: r.filter((x) => x.status === "pass").length,
    warn: r.filter((x) => x.status === "warn").length,
    error: r.filter((x) => x.status === "error").length,
    reviewed: r.filter((x) => x.reviewed).length,
  };
}
