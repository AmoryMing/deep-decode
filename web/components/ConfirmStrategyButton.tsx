"use client";

import { useState } from "react";
import { useActionState } from "react";
import { confirmStrategy, type CreateState } from "@/app/admin/(panel)/produce/actions";

/**
 * 写作策略是唯一一次「等你拍板」。
 * 诚实两步：先点开看策略草案（这一步要你过目），看过再确认放行下游——
 * 不再一键替你签字。
 */
export function ConfirmStrategyButton({ slug }: { slug: string }) {
  const [reviewed, setReviewed] = useState(false);
  const [state, action, pending] = useActionState<CreateState, FormData>(
    confirmStrategy,
    { ok: true, message: "" },
  );

  if (!reviewed) {
    return (
      <button
        type="button"
        onClick={() => setReviewed(true)}
        title="先看 AI 拟的写作策略草案，你过目后才进入下一步确认"
        className="rounded border border-amber-400 bg-amber-100 px-2.5 py-0.5 text-xs text-amber-900 hover:bg-amber-200"
      >
        查看策略草案
      </button>
    );
  }

  return (
    <form action={action} className="inline-flex items-center gap-2">
      <input type="hidden" name="slug" value={slug} />
      <a
        href={`/post/${slug}`}
        target="_blank"
        className="text-xs text-amber-900 underline"
      >
        策略草案 ↗
      </a>
      <button
        type="submit"
        disabled={pending}
        className="rounded border border-amber-400 bg-amber-100 px-2.5 py-0.5 text-xs text-amber-900 hover:bg-amber-200 disabled:opacity-50"
      >
        {pending ? "确认中…" : "我看过了，按这个写"}
      </button>
      {state.message && (
        <span className={`text-xs ${state.ok ? "text-muted" : "text-red-700"}`}>
          {state.message}
        </span>
      )}
    </form>
  );
}
