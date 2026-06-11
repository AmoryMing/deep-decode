import type { Metadata } from "next";
import { getSkillGraph, type GraphNode } from "@/lib/pipeline";
import { getFactoryStats } from "@/lib/content";

export const metadata: Metadata = {
  title: "流程",
  description: "内容工厂如何运作：三动词 + 声明式技能图谱，人只在 compound 层驾驶。",
};

const verbs = [
  {
    k: "吃",
    en: "Ingest",
    desc: "用户丢素材进 raw/。通读全文 → 写信源摘要、概念实体页、选题页，能撑起独立文章就进待写队列。raw/ 不可变，wiki/ 由工厂全权维护。",
  },
  {
    k: "写",
    en: "Produce",
    desc: "从选题到成稿。router 推荐配置 → 生成 Strategy Spec 由人确认（唯一硬停）→ 之后由确定性 runner 遍历技能图谱，逐节点过产物门。缺产物即卡住。",
  },
  {
    k: "评",
    en: "Feedback",
    desc: "用户读后说好坏。反馈追加进风格套件的 voice/feedback，更新复盘页。风格只增不删——它是工厂的记忆。",
  },
];

const stages = ["素材", "草稿", "润色", "出图", "播客", "视频", "分发"];

export default function ProcessPage() {
  const graph = getSkillGraph();
  const stats = getFactoryStats();

  return (
    <div className="mx-auto max-w-3xl px-5 py-12">
      <header className="border-b border-line pb-8">
        <p className="text-xs uppercase tracking-[0.25em] text-muted">
          How it works
        </p>
        <h1 className="mt-2 text-4xl font-extrabold tracking-tight text-ink">
          一个想法进，可发布内容出
        </h1>
        <p className="mt-4 leading-relaxed text-ink-soft">
          这不是一个写作助手，是一条产线。三个动词——吃 / 写 / 评——把素材变成
          文章、信息图、播客和视频。已累计产出{" "}
          <strong className="text-ink">{stats.total}</strong> 篇拆解。
        </p>
      </header>

      {/* 三动词 */}
      <section className="py-10">
        <h2 className="mb-5 text-sm font-bold uppercase tracking-wider text-muted">
          三动词
        </h2>
        <div className="flex flex-col gap-4">
          {verbs.map((v) => (
            <div
              key={v.k}
              className="flex gap-4 rounded-xl border border-line bg-white p-5"
            >
              <div className="flex flex-col items-center">
                <span className="text-3xl font-extrabold text-accent">
                  {v.k}
                </span>
                <span className="text-[10px] uppercase tracking-widest text-muted">
                  {v.en}
                </span>
              </div>
              <p className="text-sm leading-relaxed text-ink-soft">{v.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 生产管线 */}
      <section className="py-6">
        <h2 className="mb-5 text-sm font-bold uppercase tracking-wider text-muted">
          decode 生产管线
        </h2>
        <div className="flex flex-wrap items-center gap-2">
          {stages.map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <span className="rounded-lg border border-line bg-white px-3 py-1.5 text-sm font-medium text-ink">
                {s}
              </span>
              {i < stages.length - 1 && (
                <span className="text-muted">→</span>
              )}
            </div>
          ))}
        </div>
        <p className="mt-3 text-xs text-muted">
          每个阶段的"完成" = 它声明的产物文件存在且通过契约校验。由 tools/pipeline.py
          确定性遍历，是步骤顺序的唯一权威。
        </p>
      </section>

      {/* 技能图谱三层 */}
      {graph && (
        <section className="py-6">
          <h2 className="mb-2 text-sm font-bold uppercase tracking-wider text-muted">
            技能图谱 2.0{graph.version ? ` · v${graph.version}` : ""}
          </h2>
          <p className="mb-5 text-sm leading-relaxed text-ink-soft">
            流程是一张声明式三层图，不是散文步骤。深度是约束不是目标——人只在最高的
            compound 层驾驶（选 playbook + 确认 Strategy Spec），其余由 runner 拉着走。
          </p>
          <div className="flex flex-col gap-4">
            <Layer
              name="compounds"
              cn="playbooks · 人在此驾驶"
              nodes={graph.compounds}
              tone="accent"
            />
            <Layer
              name="molecules"
              cn="composites · 可交付物"
              nodes={graph.molecules}
              tone="ink"
            />
            <Layer
              name="atoms"
              cn="capabilities · 单一确定动作"
              nodes={graph.atoms}
              tone="soft"
            />
          </div>
        </section>
      )}

      {/* 可插拔维度 */}
      {graph && graph.axes.length > 0 && (
        <section className="py-6">
          <h2 className="mb-5 text-sm font-bold uppercase tracking-wider text-muted">
            可插拔维度
          </h2>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {graph.axes.map((ax) => (
              <div
                key={ax.key}
                className="rounded-lg border border-line bg-white p-3"
              >
                <div className="font-mono text-sm font-semibold text-ink">
                  {ax.key}
                </div>
                <div className="mt-1 text-xs text-muted">
                  {ax.default && (
                    <span>
                      默认 <code className="text-ink-soft">{ax.default}</code>
                    </span>
                  )}
                  {ax.variants && ax.variants.length > 0 && (
                    <span> · {ax.variants.join(" / ")}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function Layer({
  name,
  cn,
  nodes,
  tone,
}: {
  name: string;
  cn: string;
  nodes: GraphNode[];
  tone: "accent" | "ink" | "soft";
}) {
  const border =
    tone === "accent"
      ? "border-accent/40"
      : tone === "ink"
        ? "border-ink/30"
        : "border-line";
  return (
    <div className={`rounded-xl border ${border} bg-white p-4`}>
      <div className="mb-3 flex items-baseline justify-between">
        <span className="font-mono text-sm font-bold text-ink">{name}</span>
        <span className="text-xs text-muted">
          {cn} · {nodes.length}
        </span>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {nodes.map((n) => (
          <span
            key={n.id}
            title={n.id}
            className="rounded-lg border border-line bg-paper px-2 py-1 text-xs text-ink-soft"
          >
            {n.title}
          </span>
        ))}
      </div>
    </div>
  );
}
