"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { RunState } from "@/lib/runs";

const STATUS_CHIP: Record<RunState["status"], string> = {
  running: "bg-sky-100 text-sky-900 border border-sky-300",
  queued: "bg-violet-100 text-violet-900 border border-violet-300",
  blocked: "bg-amber-100 text-amber-900 border border-amber-300",
  done: "bg-ink/90 text-paper",
  failed: "bg-red-100 text-red-800 border border-red-300",
  idle: "bg-line/40 text-muted",
};

const STATUS_LABEL: Record<RunState["status"], string> = {
  running: "运行中",
  queued: "排队",
  blocked: "卡住",
  done: "完成",
  failed: "失败",
  idle: "空闲",
};

function RunRow({ run }: { run: RunState }) {
  const { done = 0, total = 0 } = run.progress || {};
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;
  return (
    <div className="rounded-lg border border-line bg-white p-4">
      <div className="flex items-center gap-3">
        <span
          className={`shrink-0 rounded px-2 py-0.5 text-[11px] ${STATUS_CHIP[run.status]}`}
        >
          {STATUS_LABEL[run.status]}
        </span>
        <Link
          href={`/post/${run.slug}`}
          className="min-w-0 flex-1 truncate font-mono text-xs text-ink hover:underline"
        >
          {run.slug}
        </Link>
        <span className="shrink-0 font-mono text-xs text-muted">
          {done}/{total} · {pct}%
        </span>
      </div>

      <div className="mt-2.5 h-2 overflow-hidden rounded-full bg-line/50">
        <div
          className={`h-full ${run.status === "done" ? "bg-ink/85" : "bg-sky-400"}`}
          style={{ width: `${pct}%` }}
        />
      </div>

      {run.current && run.status !== "done" && (
        <div className="mt-2 text-xs text-muted">
          当前 <span className="font-mono text-ink-soft">{run.current}</span>
        </div>
      )}
      {run.status === "blocked" && run.blocked_reason && (
        <div className="mt-1.5 rounded border border-amber-200 bg-amber-50 px-2 py-1 text-[11px] text-amber-900">
          ⏸ {run.blocked_reason}
        </div>
      )}
      {run.log_tail && run.log_tail.length > 0 && (
        <details className="mt-2 text-[11px] text-muted">
          <summary className="cursor-pointer select-none">日志</summary>
          <pre className="mt-1 overflow-x-auto whitespace-pre-wrap break-all rounded bg-paper px-2 py-1 font-mono">
            {run.log_tail.join("\n")}
          </pre>
        </details>
      )}
    </div>
  );
}

export function RunsConsole({ initial }: { initial: RunState[] }) {
  const [runs, setRuns] = useState<RunState[]>(initial);
  const [live, setLive] = useState(true);

  useEffect(() => {
    if (!live) return;
    const tick = async () => {
      try {
        const r = await fetch("/api/runs", { cache: "no-store" });
        if (r.ok) {
          const data = await r.json();
          setRuns(data.runs || []);
        }
      } catch {
        /* 网络抖动忽略，下次再拉 */
      }
    };
    const id = setInterval(tick, 3000);
    return () => clearInterval(id);
  }, [live]);

  const active = runs.filter(
    (r) => r.status === "running" || r.status === "queued",
  ).length;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2 text-xs text-muted">
        <span>{active} 个进行中 / 共 {runs.length} 条 run</span>
        <button
          type="button"
          onClick={() => setLive((v) => !v)}
          className={`ml-auto rounded px-2 py-0.5 ${
            live ? "bg-sky-100 text-sky-900" : "bg-line/40 text-muted"
          }`}
        >
          {live ? "● 实时（每 3s）" : "○ 已暂停"}
        </button>
      </div>
      {runs.length === 0 ? (
        <div className="rounded-lg border border-dashed border-line bg-white px-4 py-8 text-center text-sm text-muted">
          还没有 run。去「产出」页点某个项目的「开始」，它会出现在这里。
        </div>
      ) : (
        runs.map((r) => <RunRow key={r.slug} run={r} />)
      )}
    </div>
  );
}
