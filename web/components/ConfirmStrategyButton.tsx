"use client";

import { useActionState } from "react";
import { confirmStrategy, type CreateState } from "@/app/admin/(panel)/produce/actions";

/** 确认 Strategy（唯一硬停）→ 生成草案 + 放行下游。会调 DeepSeek，约 30s。 */
export function ConfirmStrategyButton({ slug }: { slug: string }) {
  const [state, action, pending] = useActionState<CreateState, FormData>(
    confirmStrategy,
    { ok: true, message: "" },
  );
  return (
    <form action={action} className="inline-flex items-center gap-2">
      <input type="hidden" name="slug" value={slug} />
      <button
        type="submit"
        disabled={pending}
        className="rounded border border-amber-400 bg-amber-100 px-2.5 py-0.5 text-[11px] text-amber-900 hover:bg-amber-200 disabled:opacity-50"
      >
        {pending ? "生成中…(~30s)" : "✓ 生成并确认 Strategy"}
      </button>
      {state.message && (
        <span className={`text-[11px] ${state.ok ? "text-muted" : "text-red-700"}`}>
          {state.message}
        </span>
      )}
    </form>
  );
}
