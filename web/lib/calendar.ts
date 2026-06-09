import { getPublished, getInProgress } from "./schedule";

export const PLATFORMS = ["邮件", "公众号", "小红书", "视频号", "抖音"] as const;
export type Platform = (typeof PLATFORMS)[number];
export type PubStatus = "published" | "draft" | "scheduled";

export interface PublishEvent {
  date: string; // YYYY-MM-DD
  slug: string;
  platform: string;
  status: PubStatus;
  raw: string;
}

function parseCell(
  cell: string,
  slug: string,
  platform: string,
): PublishEvent | null {
  const c = cell.replace(/~~/g, "").replace(/\*\*/g, "").trim();
  if (!c || c === "·" || c === "—") return null;

  const slugYear = slug.match(/^(\d{4})/)?.[1] || "2026";
  let date = "";
  const full = c.match(/(\d{4})-(\d{2})-(\d{2})/);
  if (full) {
    date = `${full[1]}-${full[2]}-${full[3]}`;
  } else {
    const md = c.match(/(\d{1,2})-(\d{2})/);
    if (md)
      date = `${slugYear}-${md[1].padStart(2, "0")}-${md[2].padStart(2, "0")}`;
  }
  if (!date) return null;

  let status: PubStatus = "published";
  if (/draft/i.test(c)) status = "draft";
  else if (/排期|待|TBD|计划/i.test(c) || /\d{1,2}:\d{2}/.test(c))
    status = "scheduled";

  return { date, slug, platform, status, raw: c };
}

/** 从 published.md 各平台列提取所有发布/排期事件 */
export function getPublishEvents(): PublishEvent[] {
  const events: PublishEvent[] = [];
  for (const table of getPublished()) {
    const platCols = table.headers
      .map((h, i) => ({ h: h.trim(), i }))
      .filter((x) => (PLATFORMS as readonly string[]).includes(x.h));
    const slugIdx = table.headers.findIndex((h) => /slug/i.test(h));
    for (const row of table.rows) {
      const slug = (row[slugIdx >= 0 ? slugIdx : 0] || "")
        .replace(/~~/g, "")
        .trim();
      if (!slug || /^~~/.test(row[0] || "")) continue;
      for (const { h, i } of platCols) {
        const ev = parseCell(row[i] || "", slug, h);
        if (ev) events.push(ev);
      }
    }
  }
  return events.sort((a, b) => (a.date < b.date ? 1 : -1));
}

export interface DayBucket {
  date: string;
  events: PublishEvent[];
}

export function getEventsByDate(): DayBucket[] {
  const map = new Map<string, PublishEvent[]>();
  for (const e of getPublishEvents()) {
    if (!map.has(e.date)) map.set(e.date, []);
    map.get(e.date)!.push(e);
  }
  return [...map.entries()]
    .map(([date, events]) => ({ date, events }))
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export interface CalendarStats {
  totalEvents: number;
  published: number;
  scheduled: number;
  draft: number;
  byPlatform: { platform: string; count: number }[];
}

export function getCalendarStats(): CalendarStats {
  const evs = getPublishEvents();
  const byPlat = new Map<string, number>();
  for (const e of evs) byPlat.set(e.platform, (byPlat.get(e.platform) || 0) + 1);
  return {
    totalEvents: evs.length,
    published: evs.filter((e) => e.status === "published").length,
    scheduled: evs.filter((e) => e.status === "scheduled").length,
    draft: evs.filter((e) => e.status === "draft").length,
    byPlatform: [...byPlat.entries()]
      .map(([platform, count]) => ({ platform, count }))
      .sort((a, b) => b.count - a.count),
  };
}

/** 给定年月，返回该月按日组织的网格数据（含空白补位） */
export interface MonthGrid {
  year: number;
  month: number; // 1-12
  weeks: { date: string | null; events: PublishEvent[] }[][];
}

export function getMonthGrid(year: number, month: number): MonthGrid {
  const byDate = new Map<string, PublishEvent[]>();
  for (const e of getPublishEvents()) {
    if (e.date.startsWith(`${year}-${String(month).padStart(2, "0")}`)) {
      if (!byDate.has(e.date)) byDate.set(e.date, []);
      byDate.get(e.date)!.push(e);
    }
  }
  const first = new Date(Date.UTC(year, month - 1, 1));
  const startDow = first.getUTCDay(); // 0 Sun
  const daysInMonth = new Date(Date.UTC(year, month, 0)).getUTCDate();

  const cells: { date: string | null; events: PublishEvent[] }[] = [];
  for (let i = 0; i < startDow; i++) cells.push({ date: null, events: [] });
  for (let d = 1; d <= daysInMonth; d++) {
    const ds = `${year}-${String(month).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
    cells.push({ date: ds, events: byDate.get(ds) || [] });
  }
  while (cells.length % 7 !== 0) cells.push({ date: null, events: [] });

  const weeks: { date: string | null; events: PublishEvent[] }[][] = [];
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));
  return { year, month, weeks };
}
