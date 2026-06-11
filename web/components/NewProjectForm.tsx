"use client";

import { useActionState, useState } from "react";
import { createProject, type CreateState } from "@/app/admin/(panel)/produce/actions";

interface Opts {
  readers: { key: string; displayName: string }[];
  styles: { key: string }[];
  contentTypes: { key: string; title: string }[];
  channels: string[];
}

const ALL_CHANNELS = ["email", "wechat", "xhs", "video", "podcast"];
const CH_LABEL: Record<string, string> = {
  email: "邮件",
  wechat: "公众号",
  xhs: "小红书",
  video: "视频号/抖音",
  podcast: "播客",
};

export function NewProjectForm({ opts }: { opts: Opts }) {
  const [open, setOpen] = useState(false);
  const [state, action, pending] = useActionState<CreateState, FormData>(
    createProject,
    { ok: true, message: "" },
  );

  const fieldCls =
    "rounded border border-line bg-white px-2 py-1 text-sm text-ink";

  return (
    <div className="rounded-lg border border-line bg-white">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center gap-2 px-4 py-3 text-left"
      >
        <span className="rounded bg-ink px-2 py-0.5 text-xs text-paper">＋ 新建项目</span>
        <span className="text-sm text-muted">
          选内容类型 / 读者 / 风格 / 渠道 → 生成生产卡，回到列表点「开始」
        </span>
        <span className="ml-auto text-xs text-muted">{open ? "▲" : "▼"}</span>
      </button>

      {open && (
        <form
          action={action}
          className="grid grid-cols-1 gap-3 border-t border-line/60 p-4 sm:grid-cols-2"
        >
          <label className="flex flex-col gap-1 sm:col-span-2">
            <span className="text-xs text-muted">标题 / 选题（中文可）</span>
            <input name="title" required className={fieldCls} placeholder="例：DeepSeek V4 把范式之争压成一道数学题" />
          </label>

          <label className="flex flex-col gap-1">
            <span className="text-xs text-muted">slug（英文短横线，可留空自动生成）</span>
            <input name="slug" className={fieldCls} placeholder="deepseek-v4-paradigm" />
          </label>

          <label className="flex flex-col gap-1">
            <span className="text-xs text-muted">输入类型</span>
            <select name="input_type" className={fieldCls} defaultValue="url">
              <option value="url">URL（博客/推文）</option>
              <option value="entity">实体（产品/公司/人物）</option>
              <option value="local">本地素材 / 选题描述</option>
            </select>
          </label>

          <label className="flex flex-col gap-1 sm:col-span-2">
            <span className="text-xs text-muted">来源（URL / 实体名 / 描述）</span>
            <input name="source" className={fieldCls} placeholder="https://… 或 实体名" />
          </label>

          <label className="flex flex-col gap-1">
            <span className="text-xs text-muted">内容类型</span>
            <select name="content_type" className={fieldCls} defaultValue="decode">
              {opts.contentTypes.map((c) => (
                <option key={c.key} value={c.key}>
                  {c.key} · {c.title}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-1">
            <span className="text-xs text-muted">读者画像（决定语气）</span>
            <select name="reader" className={fieldCls} defaultValue="default">
              {opts.readers.map((r) => (
                <option key={r.key} value={r.key}>
                  {r.key} · {r.displayName}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-1">
            <span className="text-xs text-muted">风格套件</span>
            <select name="style" className={fieldCls} defaultValue="default">
              {opts.styles.map((s) => (
                <option key={s.key} value={s.key}>
                  {s.key}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-1">
            <span className="text-xs text-muted">音色（留空 = 不配音）</span>
            <input name="voice" className={fieldCls} placeholder="如 doubao-shuangkuaisisi" />
          </label>

          <fieldset className="flex flex-col gap-1 sm:col-span-2">
            <span className="text-xs text-muted">分发渠道（至少一个）</span>
            <div className="flex flex-wrap gap-3">
              {ALL_CHANNELS.map((ch) => (
                <label key={ch} className="inline-flex items-center gap-1.5 text-sm text-ink-soft">
                  <input
                    type="checkbox"
                    name="channels"
                    value={ch}
                    defaultChecked={opts.channels.includes(ch)}
                  />
                  {CH_LABEL[ch]}
                </label>
              ))}
            </div>
          </fieldset>

          <div className="flex items-center gap-3 sm:col-span-2">
            <button
              type="submit"
              disabled={pending}
              className="rounded bg-ink px-3 py-1 text-sm text-paper hover:opacity-85 disabled:opacity-50"
            >
              {pending ? "创建中…" : "创建项目"}
            </button>
            {state.message && (
              <span className={`text-xs ${state.ok ? "text-muted" : "text-red-700"}`}>
                {state.message}
                {state.ok && state.slug && "（已出现在下方列表，可点「开始」）"}
              </span>
            )}
          </div>
        </form>
      )}
    </div>
  );
}
