import fs from "node:fs";
import path from "node:path";
import { repoRoot } from "./repo";

const scheduleDir = () => path.join(repoRoot(), "schedule");

function read(name: string): string {
  const f = path.join(scheduleDir(), name);
  return fs.existsSync(f) ? fs.readFileSync(f, "utf8") : "";
}

export interface MdTable {
  headers: string[];
  rows: string[][];
  caption?: string;
}

function splitRow(line: string): string[] {
  return line
    .trim()
    .replace(/^\|/, "")
    .replace(/\|$/, "")
    .split("|")
    .map((c) => c.trim());
}

/** 解析 markdown 里所有表格，并尝试用上方最近的标题作为 caption。 */
export function parseTables(md: string): MdTable[] {
  const lines = md.split("\n");
  const tables: MdTable[] = [];
  let lastHeading = "";
  for (let i = 0; i < lines.length; i++) {
    const h = lines[i].match(/^#{1,6}\s+(.*)$/);
    if (h) lastHeading = h[1].trim();
    const isRow = /^\s*\|.*\|\s*$/.test(lines[i]);
    const isSep =
      i + 1 < lines.length && /^\s*\|[\s:|-]+\|\s*$/.test(lines[i + 1]);
    if (isRow && isSep) {
      const headers = splitRow(lines[i]);
      let j = i + 2;
      const rows: string[][] = [];
      while (j < lines.length && /^\s*\|.*\|\s*$/.test(lines[j])) {
        rows.push(splitRow(lines[j]));
        j++;
      }
      tables.push({ headers, rows, caption: lastHeading || undefined });
      i = j - 1;
    }
  }
  return tables;
}

export function getPublished(): MdTable[] {
  return parseTables(read("published.md"));
}
export function getQueue(): MdTable[] {
  return parseTables(read("queue.md"));
}
export function getInProgress(): MdTable[] {
  return parseTables(read("in-progress.md"));
}
export function getCalendar(): MdTable[] {
  return parseTables(read("calendar.md"));
}

export interface RevenueRow {
  month: string;
  channel: string;
  amount: number;
}

export function getRevenue(): RevenueRow[] {
  const f = path.join(scheduleDir(), "revenue.json");
  if (!fs.existsSync(f)) return [];
  try {
    const data = JSON.parse(fs.readFileSync(f, "utf8"));
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

export interface ScheduleSummary {
  publishedCount: number;
  inProgressCount: number;
  queueCount: number;
  revenueThisMonth: number;
  revenueByMonth: { month: string; amount: number }[];
}

/** 统计：扫每张表的数据行数，剔除删除线行 (~~...~~) */
function countLiveRows(tables: MdTable[]): number {
  let n = 0;
  for (const t of tables) {
    for (const r of t.rows) {
      const joined = r.join("");
      if (!joined) continue;
      if (/^~~/.test(r[0] || "")) continue; // 删除线 = 已迁出
      n++;
    }
  }
  return n;
}

export function getScheduleSummary(): ScheduleSummary {
  const revenue = getRevenue();
  const byMonth = new Map<string, number>();
  for (const r of revenue)
    byMonth.set(r.month, (byMonth.get(r.month) || 0) + (r.amount || 0));
  const months = [...byMonth.entries()]
    .map(([month, amount]) => ({ month, amount }))
    .sort((a, b) => (a.month < b.month ? 1 : -1));
  return {
    publishedCount: countLiveRows(getPublished()),
    inProgressCount: countLiveRows(getInProgress()),
    queueCount: countLiveRows(getQueue()),
    revenueThisMonth: months[0]?.amount || 0,
    revenueByMonth: months,
  };
}
