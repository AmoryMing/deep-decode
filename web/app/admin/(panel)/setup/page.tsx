import type { Metadata } from "next";
import { getSetupInventory, getEditableConfig } from "@/lib/setup";
import { ConfigEditor } from "@/components/ConfigEditor";

export const metadata: Metadata = {
  title: "接入",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

function Card({
  title,
  hint,
  children,
}: {
  title: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border border-line bg-white p-4">
      <div className="mb-2 flex items-baseline gap-2">
        <h3 className="text-sm font-bold text-ink">{title}</h3>
        {hint && <span className="text-[11px] text-muted">{hint}</span>}
      </div>
      {children}
    </div>
  );
}

function Pill({ on, children }: { on: boolean; children: React.ReactNode }) {
  return (
    <span
      className={`inline-flex h-5 items-center rounded px-1.5 text-[11px] ${
        on
          ? "bg-ink/90 text-paper"
          : "border border-dashed border-red-300 bg-white text-red-700"
      }`}
    >
      {children}
    </span>
  );
}

export default function Setup() {
  const inv = getSetupInventory();
  const editable = getEditableConfig();

  return (
    <div className="flex flex-col gap-8">
      <header>
        <h2 className="text-xl font-bold text-ink">接入 · 创作者资产盘点</h2>
        <p className="mt-1 text-sm text-muted">
          流水线启动前，这里盘点你已接入的配置、读者画像、风格、内容类型与知识库。
          缺的项标红——补齐后产出才会用对语气、对模板、对渠道。
        </p>
      </header>

      {/* 可编辑配置（UI 写工厂设置） */}
      <Card title="⚙ 工厂设置（这里改，自动保存）" hint="你的 Key 只存本地，不上传">
        <ConfigEditor cfg={editable} />
      </Card>

      {/* 配置源盘点 */}
      <Card
        title="① 工厂设置"
        hint={inv.configSource || "未找到"}
      >
        {inv.configExists ? (
          <p className="text-sm text-ink-soft">
            ✓ 已就位。默认模型{" "}
            <span className="font-mono">{inv.defaultModel || "—"}</span>，默认渠道{" "}
            <span className="font-mono">{inv.channels.join(" / ") || "—"}</span>。
          </p>
        ) : (
          <p className="text-sm text-amber-800">
            ⚠ 还在用示例模板。在上面「工厂设置」里填好模型 Key
            后，生成步骤才能自动跑。
          </p>
        )}
        <div className="mt-3 flex flex-wrap gap-2">
          {inv.providers.map((p) => (
            <Pill key={p.key} on={p.hasKey}>
              {p.key} {p.model && `· ${p.model}`} {p.hasKey ? "✓ 已填 Key" : "缺 Key"}
            </Pill>
          ))}
          {inv.providers.length === 0 && (
            <span className="text-xs text-muted">还没配模型</span>
          )}
        </div>
      </Card>

      {/* 读者画像 */}
      <Card title="② 读者画像" hint="决定写给谁、用什么语气">
        <div className="flex flex-col gap-2">
          {inv.readers.map((r) => (
            <div key={r.key} className="flex items-center gap-2 text-sm">
              <span className="w-24 shrink-0 font-mono text-xs text-ink">
                {r.key}
              </span>
              <span className="min-w-0 flex-1 truncate text-ink-soft">
                {r.displayName}
              </span>
              <Pill on={r.hasTone}>语气</Pill>
              <Pill on={r.hasPersona}>画像</Pill>
            </div>
          ))}
        </div>
      </Card>

      {/* 风格 */}
      <Card title="③ 风格套件" hint="决定写作者的气质和遣词">
        <div className="flex flex-col gap-2">
          {inv.styles.map((s) => (
            <div key={s.key} className="flex items-center gap-2 text-sm">
              <span className="w-24 shrink-0 font-mono text-xs text-ink">
                {s.key}
              </span>
              <span className="min-w-0 flex-1" />
              <Pill on={s.hasVoice}>声音</Pill>
              <Pill on={s.hasFeedback}>反馈记忆</Pill>
            </div>
          ))}
        </div>
      </Card>

      {/* 内容类型 */}
      <Card title="④ 内容类型" hint="决定走哪套写作流程">
        <div className="flex flex-wrap gap-2">
          {inv.contentTypes.map((c) => (
            <span
              key={c.key}
              className="rounded border border-line bg-paper px-2 py-1 text-xs text-ink-soft"
            >
              <span className="font-mono">{c.key}</span> · {c.title} ·{" "}
              {c.requiredArtifacts} 必产物
            </span>
          ))}
        </div>
      </Card>

      {/* 知识库 */}
      <Card title="⑤ 知识库" hint="选题和写作的素材底座">
        <p className="text-sm text-ink-soft">
          信源 <b>{inv.wikiCounts.sources}</b> · 概念{" "}
          <b>{inv.wikiCounts.concepts}</b> · 选题 <b>{inv.wikiCounts.topics}</b>
        </p>
      </Card>
    </div>
  );
}
