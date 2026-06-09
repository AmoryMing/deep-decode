"use client";

import { useMemo, useState } from "react";
import type { PublishEvent } from "@/lib/calendar";

const PLAT_ABBR: Record<string, string> = {
  邮件: "邮",
  公众号: "公",
  小红书: "红",
  视频号: "视",
  抖音: "抖",
};
const PLAT_COLOR: Record<string, string> = {
  邮件: "#2563eb",
  公众号: "#16a34a",
  小红书: "#e11d48",
  视频号: "#ea580c",
  抖音: "#18181b",
};
const WEEKDAYS = ["日", "一", "二", "三", "四", "五", "六"];

function shift(ym: string, delta: number): string {
  const [y, m] = ym.split("-").map(Number);
  let nm = m + delta;
  let ny = y;
  if (nm < 1) {
    nm = 12;
    ny--;
  } else if (nm > 12) {
    nm = 1;
    ny++;
  }
  return `${ny}-${String(nm).padStart(2, "0")}`;
}

export function CalendarView({ events }: { events: PublishEvent[] }) {
  const latest = events[0]?.date?.slice(0, 7) || "2026-06";
  const [ym, setYm] = useState(latest);
  const [y, m] = ym.split("-").map(Number);

  const cells = useMemo(() => {
    const byDate = new Map<string, PublishEvent[]>();
    for (const e of events) {
      if (e.date.startsWith(ym)) {
        if (!byDate.has(e.date)) byDate.set(e.date, []);
        byDate.get(e.date)!.push(e);
      }
    }
    const first = new Date(Date.UTC(y, m - 1, 1));
    const startDow = first.getUTCDay();
    const days = new Date(Date.UTC(y, m, 0)).getUTCDate();
    const out: { date: string | null; events: PublishEvent[] }[] = [];
    for (let i = 0; i < startDow; i++) out.push({ date: null, events: [] });
    for (let d = 1; d <= days; d++) {
      const ds = `${ym}-${String(d).padStart(2, "0")}`;
      out.push({ date: ds, events: byDate.get(ds) || [] });
    }
    while (out.length % 7 !== 0) out.push({ date: null, events: [] });
    return out;
  }, [events, ym, y, m]);

  const monthCount = events.filter((e) => e.date.startsWith(ym)).length;

  return (
    <div className="rounded-xl border border-line bg-white p-4">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-baseline gap-2">
          <span className="text-lg font-bold text-ink">
            {y} 年 {m} 月
          </span>
          <span className="text-xs text-muted">{monthCount} 个发布</span>
        </div>
        <div className="flex gap-1">
          <button
            onClick={() => setYm(shift(ym, -1))}
            className="rounded border border-line px-2.5 py-1 text-sm text-ink-soft hover:bg-paper"
          >
            ←
          </button>
          <button
            onClick={() => setYm(latest)}
            className="rounded border border-line px-2.5 py-1 text-xs text-ink-soft hover:bg-paper"
          >
            最新
          </button>
          <button
            onClick={() => setYm(shift(ym, 1))}
            className="rounded border border-line px-2.5 py-1 text-sm text-ink-soft hover:bg-paper"
          >
            →
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-px overflow-hidden rounded-lg bg-line">
        {WEEKDAYS.map((w) => (
          <div
            key={w}
            className="bg-paper py-1.5 text-center text-xs font-medium text-muted"
          >
            {w}
          </div>
        ))}
        {cells.map((c, i) => (
          <div
            key={i}
            className={`min-h-[72px] bg-white p-1.5 ${c.date ? "" : "bg-paper/50"}`}
          >
            {c.date && (
              <>
                <div className="mb-1 text-[11px] text-muted">
                  {Number(c.date.slice(-2))}
                </div>
                <div className="flex flex-wrap gap-0.5">
                  {c.events.map((e, k) => (
                    <span
                      key={k}
                      title={`${e.platform} · ${e.slug} · ${e.raw}`}
                      className="inline-flex h-4 w-4 items-center justify-center rounded text-[9px] font-bold text-white"
                      style={{
                        backgroundColor: PLAT_COLOR[e.platform] || "#71717a",
                        opacity: e.status === "published" ? 1 : 0.5,
                      }}
                    >
                      {PLAT_ABBR[e.platform] || "?"}
                    </span>
                  ))}
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      <div className="mt-3 flex flex-wrap gap-3 text-[11px] text-muted">
        {Object.entries(PLAT_ABBR).map(([plat, ab]) => (
          <span key={plat} className="flex items-center gap-1">
            <span
              className="inline-block h-3 w-3 rounded"
              style={{ backgroundColor: PLAT_COLOR[plat] }}
            />
            {plat}
          </span>
        ))}
        <span className="text-muted">· 半透明=排期/草稿</span>
      </div>
    </div>
  );
}
