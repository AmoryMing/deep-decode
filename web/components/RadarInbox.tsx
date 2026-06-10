"use client";

import { useActionState, useState } from "react";
import { createProject, type CreateState } from "@/app/admin/(panel)/produce/actions";
import type { RadarItem } from "@/lib/topics";

function InboxCard({ item }: { item: RadarItem }) {
  const [state, action, pending] = useActionState<CreateState, FormData>(
    createProject,
    { ok: true, message: "" },
  );
  const ct = item.content_type || "decode";
  return (
    <div className="rounded-lg border border-line bg-white p-3">
      <div className="flex items-start gap-2">
        <span className="shrink-0 rounded bg-ink/90 px-1.5 py-0.5 text-[11px] font-bold text-paper">
          {item.score}
        </span>
        <a
          href={item.url}
          target="_blank"
          className="min-w-0 flex-1 text-sm font-medium text-ink hover:underline"
        >
          {item.title}
        </a>
        <span className="shrink-0 text-[11px] text-muted">{item.source}</span>
      </div>

      {item.angle && (
        <p className="mt-1.5 text-xs text-ink-soft">
          <span className="text-muted">角度：</span>
          {item.angle}
          <span className="ml-1 rounded bg-paper px-1 text-[10px] text-muted">{ct}</span>
        </p>
      )}
      <div className="mt-1 flex flex-wrap items-center gap-1.5 text-[10px] text-muted">
        {item.relevance !== null && <span>rel {item.relevance}</span>}
        {item.signals.slice(0, 4).map((s, i) => (
          <span key={i} className="rounded bg-line/40 px-1">
            {s}
          </span>
        ))}
      </div>

      <form action={action} className="mt-2 flex items-center gap-2">
        <input type="hidden" name="title" value={item.hook || item.title} />
        <input type="hidden" name="source" value={item.url} />
        <input type="hidden" name="input_type" value="url" />
        <input type="hidden" name="content_type" value={ct} />
        <input type="hidden" name="angle" value={item.angle || ""} />
        <button
          type="submit"
          disabled={pending || (state.ok && !!state.slug)}
          className="rounded bg-ink px-2 py-0.5 text-[11px] text-paper hover:opacity-85 disabled:opacity-50"
        >
          {pending ? "建中…" : state.ok && state.slug ? "✓ 已建" : "▶ 建项目"}
        </button>
        {state.message && (
          <span className={`text-[11px] ${state.ok ? "text-muted" : "text-red-700"}`}>
            {state.message}
            {state.ok && state.slug && (
              <a href="/admin/produce" className="ml-1 underline">
                去产出
              </a>
            )}
          </span>
        )}
      </form>
    </div>
  );
}

export function RadarInbox({ items, date }: { items: RadarItem[]; date: string }) {
  const [n, setN] = useState(12);
  const shown = items.slice(0, n);
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2 text-xs text-muted">
        <span>{date} · 按分排序 · 勾选热点一键建项目</span>
        <span className="ml-auto">显示前 {shown.length}/{items.length}</span>
      </div>
      <div className="grid grid-cols-1 gap-2.5 lg:grid-cols-2">
        {shown.map((it) => (
          <InboxCard key={it.rank} item={it} />
        ))}
      </div>
      {n < items.length && (
        <button
          type="button"
          onClick={() => setN((v) => v + 12)}
          className="self-center rounded border border-line px-3 py-1 text-xs text-ink-soft hover:bg-paper"
        >
          再看 12 条
        </button>
      )}
    </div>
  );
}
