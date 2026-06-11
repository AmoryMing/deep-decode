"use client";

import { useActionState } from "react";
import { startRun, type RunActionState } from "@/app/admin/(panel)/runs/actions";

export function StartRunButton({ slug }: { slug: string }) {
  const [state, action, pending] = useActionState<RunActionState, FormData>(
    startRun,
    { ok: true, message: "" },
  );
  return (
    <form action={action} className="inline-flex items-center gap-2">
      <input type="hidden" name="slug" value={slug} />
      <button
        type="submit"
        disabled={pending}
        title="后台自动跑约几分钟，只生成草稿，不会自动发布到任何平台"
        className="rounded bg-ink px-2.5 py-0.5 text-xs text-paper hover:opacity-85 disabled:opacity-50"
      >
        {pending ? "启动中…" : "▶ 开始"}
      </button>
      <span className="text-xs text-muted">
        约几分钟 · 只出草稿 · 不会自动发布
      </span>
      {state.message && (
        <span className={`text-xs ${state.ok ? "text-muted" : "text-red-700"}`}>
          {state.message}
          {state.ok && state.message === "已启动" && (
            <>
              {" "}
              ·{" "}
              <a href="/admin/runs" className="underline">
                看进度
              </a>
            </>
          )}
        </span>
      )}
    </form>
  );
}
