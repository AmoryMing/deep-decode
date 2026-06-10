"use client";

import { useActionState } from "react";
import { saveConfig, type SaveState } from "@/app/admin/(panel)/setup/actions";
import type { EditableConfig } from "@/lib/setup";

const ALL_CHANNELS = ["email", "wechat", "xhs", "video", "podcast"];
const CH_LABEL: Record<string, string> = {
  email: "邮件",
  wechat: "公众号",
  xhs: "小红书",
  video: "视频号/抖音",
  podcast: "播客",
};

function KeyField({
  name,
  label,
  isSet,
}: {
  name: string;
  label: string;
  isSet: boolean;
}) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-xs text-muted">
        {label}{" "}
        {isSet ? (
          <span className="text-emerald-700">已配置 ✓（留空保持不变）</span>
        ) : (
          <span className="text-red-700">未配置</span>
        )}
      </span>
      <input
        type="password"
        name={name}
        autoComplete="off"
        placeholder={isSet ? "••••••（留空不改）" : "粘贴 key"}
        className="rounded border border-line bg-white px-2 py-1 font-mono text-xs text-ink"
      />
    </label>
  );
}

export function ConfigEditor({ cfg }: { cfg: EditableConfig }) {
  const [state, action, pending] = useActionState<SaveState, FormData>(
    saveConfig,
    { ok: true, message: "" },
  );
  const fieldCls = "rounded border border-line bg-white px-2 py-1 text-sm text-ink";

  return (
    <form action={action} className="flex flex-col gap-4">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {/* 模型 */}
        <KeyField name="deepseekKey" label="DeepSeek API Key（生成步骤）" isSet={cfg.providerKeySet.deepseek} />
        <label className="flex flex-col gap-1">
          <span className="text-xs text-muted">默认 provider</span>
          <select name="defaultModel" defaultValue={cfg.defaultModel} className={fieldCls}>
            <option value="deepseek">deepseek</option>
            <option value="claude">claude</option>
            <option value="doubao">doubao</option>
          </select>
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-xs text-muted">写稿模型（m.article，可空）</span>
          <input name="model_article" defaultValue={cfg.nodeModels["m.article"] || ""} placeholder="deepseek-v4-pro" className={fieldCls} />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-xs text-muted">路由模型（n.router，可空）</span>
          <input name="model_router" defaultValue={cfg.nodeModels["n.router"] || ""} placeholder="deepseek-v4-flash" className={fieldCls} />
        </label>

        {/* 视觉后端 */}
        <label className="flex flex-col gap-1">
          <span className="text-xs text-muted">配图后端 visual.backend</span>
          <select name="visualBackend" defaultValue={cfg.visualBackend} className={fieldCls}>
            <option value="gpt-image">gpt-image（AI 出图）</option>
            <option value="svg">svg（代码绘制）</option>
          </select>
        </label>
        <KeyField name="gptImageKey" label="gpt-image 网关 Key" isSet={cfg.gptImageKeySet} />

        {/* 视频后端 */}
        <label className="flex flex-col gap-1">
          <span className="text-xs text-muted">视频后端 video.backend</span>
          <select name="videoBackend" defaultValue={cfg.videoBackend} className={fieldCls}>
            <option value="remotion">remotion（旁白长视频）</option>
            <option value="seedance">seedance（即梦生成式短片）</option>
          </select>
        </label>
        <div />
        <KeyField name="seedanceAccessKey" label="Seedance Access Key" isSet={cfg.seedanceKeySet} />
        <KeyField name="seedanceSecretKey" label="Seedance Secret Key" isSet={cfg.seedanceKeySet} />
      </div>

      {/* 默认渠道 */}
      <fieldset className="flex flex-col gap-1">
        <span className="text-xs text-muted">默认分发渠道</span>
        <div className="flex flex-wrap gap-3">
          {ALL_CHANNELS.map((ch) => (
            <label key={ch} className="inline-flex items-center gap-1.5 text-sm text-ink-soft">
              <input type="checkbox" name="channels" value={ch} defaultChecked={cfg.channels.includes(ch)} />
              {CH_LABEL[ch]}
            </label>
          ))}
        </div>
      </fieldset>

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={pending}
          className="rounded bg-ink px-3 py-1 text-sm text-paper hover:opacity-85 disabled:opacity-50"
        >
          {pending ? "保存中…" : "保存配置"}
        </button>
        {state.message && (
          <span className={`text-xs ${state.ok ? "text-emerald-700" : "text-red-700"}`}>
            {state.message}
          </span>
        )}
        <span className="ml-auto text-[11px] text-muted">
          写入 factory.config.yaml（gitignore，key 不入库）
        </span>
      </div>
    </form>
  );
}
