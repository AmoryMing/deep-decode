"use client";

import { useActionState, useState } from "react";
import { sendChannel, type MarkState } from "@/app/admin/(panel)/queue/actions";

const LABEL: Record<string, string> = {
  邮件: "发送邮件",
  公众号: "传公众号草稿",
};

/**
 * 一键发送/建草稿——替代"复制命令去终端"。
 * 安全：邮件是真发送，做成「发送邮件」→「确认发送」两步；公众号是建草稿，单步即可。
 * 永不自动触发，只响应人工点击。
 */
export function SendButton({ slug, platform }: { slug: string; platform: string }) {
  const [state, action, pending] = useActionState<MarkState, FormData>(sendChannel, {
    ok: true,
    message: "",
  });
  const [armed, setArmed] = useState(false);
  const label = LABEL[platform];
  if (!label) return null; // 其它平台暂手动

  const isEmail = platform === "邮件";
  return (
    <form action={action} className="inline-flex items-center gap-2">
      <input type="hidden" name="slug" value={slug} />
      <input type="hidden" name="platform" value={platform} />
      <input type="hidden" name="confirm" value={armed ? "yes" : "no"} />
      <button
        type="submit"
        disabled={pending}
        onClick={() => {
          if (isEmail && !armed) setArmed(true);
        }}
        title={isEmail ? "真的发送邮件给订阅者（点两次确认）" : "在公众号后台建一篇草稿，不会直接群发"}
        className={`rounded px-2 py-0.5 text-[12px] text-paper hover:opacity-85 disabled:opacity-50 ${
          armed && isEmail ? "bg-red-700" : "bg-ink"
        }`}
      >
        {pending
          ? "处理中…"
          : armed && isEmail
            ? "确认发送 ✓"
            : `${label}${isEmail ? "" : ""}`}
      </button>
      {isEmail && !armed && (
        <span className="text-[12px] text-muted">真发送</span>
      )}
      {state.message && (
        <span className={`text-[12px] ${state.ok ? "text-emerald-700" : "text-red-700"}`}>
          {state.message}
        </span>
      )}
    </form>
  );
}
