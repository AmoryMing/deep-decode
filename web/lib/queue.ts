import fs from "node:fs";
import path from "node:path";
import { repoRoot } from "./repo";
import { parseTables } from "./schedule";

/**
 * 统一审核队列的数据层。
 * 事实源只有两处：schedule/published.md（每篇 × 每平台的状态单元格）
 * 和 output/<slug>/READY.md（该篇分发草稿的"下一步"命令）。
 * 这里不执行任何发送动作——发送永远是人审之后的事。
 */

export const PLATFORMS = ["邮件", "公众号", "小红书", "视频号", "抖音"] as const;
export type Platform = (typeof PLATFORMS)[number];

export type CellStatus =
  | "published" // 填了日期，已发
  | "draft" // 远端草稿已建，待人工点发布
  | "scheduled" // 平台侧已排期（是否真的发出需人工核对）
  | "ready" // 本地素材就绪，未上传
  | "none" // 空白，未动
  | "skip" // — 按计划不发该平台
  | "other"; // 其他自由文本，原样展示

export interface QueueCell {
  platform: Platform;
  raw: string;
  status: CellStatus;
  /** READY.md「下一步」列的命令/指引（若有），或可靠的通用命令 */
  nextStep?: string;
}

export interface QueueItem {
  slug: string;
  kit: string;
  produced: string;
  section: string;
  cells: QueueCell[];
  pendingCount: number;
  hasReady: boolean;
  hasEmailPreview: boolean;
  hasArticle: boolean;
  hasPodcast: boolean;
  hasVideo: boolean;
}

export interface PlatformSummary {
  platform: Platform;
  published: number;
  draft: number;
  scheduled: number;
  ready: number;
  none: number;
  skip: number;
  other: number;
}

export function classifyCell(raw: string): CellStatus {
  const t = raw.trim();
  if (!t) return "none";
  if (/^[-—–]+$/.test(t)) return "skip";
  // 注意顺序：`2026-06-08(draft, …)` 同时含日期与 draft，draft 优先
  if (/draft|草稿/i.test(t)) return "draft";
  if (/^\d{4}-\d{2}-\d{2}/.test(t)) return "published";
  if (/排期|^\d{2}-\d{2}(\s|$)|\d{1,2}:\d{2}/.test(t)) return "scheduled";
  if (/就绪|未发/.test(t)) return "ready";
  return "other";
}

const PENDING: CellStatus[] = ["draft", "scheduled", "ready", "none", "other"];

function publishedPath(): string {
  return path.join(repoRoot(), "schedule", "published.md");
}

/** 解析 output/<slug>/READY.md 的「分发草稿状态」表 → 平台 → 下一步 */
function readyNextSteps(slug: string): Map<Platform, string> {
  const map = new Map<Platform, string>();
  const f = path.join(repoRoot(), "output", slug, "READY.md");
  if (!fs.existsSync(f)) return map;
  let md = "";
  try {
    md = fs.readFileSync(f, "utf8");
  } catch {
    return map;
  }
  for (const table of parseTables(md)) {
    const chanIdx = table.headers.findIndex((h) => /渠道|平台/.test(h));
    const nextIdx = table.headers.findIndex((h) => /下一步|next/i.test(h));
    if (chanIdx < 0 || nextIdx < 0) continue;
    for (const row of table.rows) {
      const chan = row[chanIdx] || "";
      const next = (row[nextIdx] || "").trim();
      if (!next) continue;
      for (const p of PLATFORMS) {
        if (chan.includes(p) && !map.has(p)) map.set(p, next);
      }
    }
  }
  return map;
}

/** 没有 READY.md 行时的兜底命令——只给文件实际存在、参数可确定的 */
function genericNextStep(slug: string, platform: Platform): string | undefined {
  const dir = path.join(repoRoot(), "output", slug);
  if (platform === "邮件" && fs.existsSync(path.join(dir, "send_email.py"))) {
    return `cd output/${slug} && python3 send_email.py --send`;
  }
  if (platform === "公众号" && fs.existsSync(path.join(dir, "article.md"))) {
    return `cd output/${slug} && python3 ../../.claude/skills/distribute/wechat_publish.py article.md`;
  }
  return undefined;
}

export function buildQueue(): {
  items: QueueItem[];
  summary: PlatformSummary[];
} {
  const f = publishedPath();
  const md = fs.existsSync(f) ? fs.readFileSync(f, "utf8") : "";
  const tables = parseTables(md);

  const items: QueueItem[] = [];
  const summary: PlatformSummary[] = PLATFORMS.map((platform) => ({
    platform,
    published: 0,
    draft: 0,
    scheduled: 0,
    ready: 0,
    none: 0,
    skip: 0,
    other: 0,
  }));

  // 同一 slug 可能出现在多张表（如「当前未完结」+ 历史 batch 节）——首张表优先
  const seen = new Set<string>();
  for (const table of tables) {
    const slugIdx = table.headers.findIndex((h) => /slug/i.test(h));
    if (slugIdx < 0) continue;
    const colIdx = new Map<Platform, number>();
    for (const p of PLATFORMS) {
      const i = table.headers.findIndex((h) => h.includes(p));
      if (i >= 0) colIdx.set(p, i);
    }
    const kitIdx = table.headers.findIndex((h) => /套件/.test(h));
    const prodIdx = table.headers.findIndex((h) => /生产完成/.test(h));

    for (const row of table.rows) {
      const slug = (row[slugIdx] || "").trim();
      if (!slug || slug.startsWith("~~")) continue;
      if (seen.has(slug)) continue;
      seen.add(slug);

      const dir = path.join(repoRoot(), "output", slug);
      const exists = (name: string) => fs.existsSync(path.join(dir, name));
      const nextSteps = readyNextSteps(slug);

      const cells: QueueCell[] = [];
      for (const p of PLATFORMS) {
        const i = colIdx.get(p);
        const raw = i === undefined ? "" : (row[i] || "").trim();
        const status = classifyCell(raw);
        const s = summary.find((x) => x.platform === p)!;
        s[status]++;
        cells.push({
          platform: p,
          raw,
          status,
          nextStep:
            status === "published" || status === "skip"
              ? undefined
              : nextSteps.get(p) || genericNextStep(slug, p),
        });
      }

      items.push({
        slug,
        kit: kitIdx >= 0 ? (row[kitIdx] || "").trim() : "",
        produced: prodIdx >= 0 ? (row[prodIdx] || "").trim() : "",
        section: table.caption || "",
        cells,
        pendingCount: cells.filter((c) => PENDING.includes(c.status)).length,
        hasReady: exists("READY.md"),
        hasEmailPreview: exists("email_preview.html"),
        hasArticle: exists("article.md"),
        hasPodcast: exists("podcast.mp3"),
        hasVideo: exists("video.mp4"),
      });
    }
  }

  // 待办多的、新的排前面
  items.sort(
    (a, b) =>
      b.pendingCount - a.pendingCount || (a.slug < b.slug ? 1 : -1),
  );
  return { items, summary };
}

/**
 * 把 published.md 中某篇某平台的单元格写为指定值（通常是今天的日期）。
 * 只动目标单元格，其余字节保持原样。返回是否写成功。
 */
export function updatePublishedCell(
  slug: string,
  platform: Platform,
  value: string,
): boolean {
  const f = publishedPath();
  if (!fs.existsSync(f)) return false;
  const lines = fs.readFileSync(f, "utf8").split("\n");

  let headers: string[] | null = null;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const isRow = /^\s*\|.*\|\s*$/.test(line);
    if (!isRow) {
      headers = null;
      continue;
    }
    const cells = line
      .trim()
      .replace(/^\|/, "")
      .replace(/\|$/, "")
      .split("|")
      .map((c) => c.trim());
    const isSep =
      i + 1 < lines.length && /^\s*\|[\s:|-]+\|\s*$/.test(lines[i + 1]);
    if (isSep && cells.some((c) => /slug/i.test(c))) {
      headers = cells;
      i++; // 跳过分隔行
      continue;
    }
    if (!headers) continue;
    const slugIdx = headers.findIndex((h) => /slug/i.test(h));
    const colI = headers.findIndex((h) => h.includes(platform));
    if (slugIdx < 0 || colI < 0) continue;
    if ((cells[slugIdx] || "").trim() !== slug) continue;

    while (cells.length <= colI) cells.push("");
    cells[colI] = value;
    lines[i] = `| ${cells.join(" | ")} |`;
    let out = lines.join("\n");
    // frontmatter 的 updated: 顺手刷新
    out = out.replace(
      /^updated: \d{4}-\d{2}-\d{2}$/m,
      `updated: ${new Date().toISOString().slice(0, 10)}`,
    );
    fs.writeFileSync(f, out, "utf8");
    return true;
  }
  return false;
}
