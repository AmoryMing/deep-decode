import type { Metadata } from "next";
import { listRuns } from "@/lib/runs";
import { RunsConsole } from "@/components/RunsConsole";

export const metadata: Metadata = {
  title: "运行",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default function Runs() {
  const runs = listRuns();
  return (
    <div className="flex flex-col gap-8">
      <header>
        <h2 className="text-xl font-bold text-ink">③ 运行 · 流水线进度</h2>
        <p className="mt-1 text-sm text-muted">
          每个项目一条 run，driver 自动推进确定性步骤，遇到生成步骤或硬停就卡住并说明原因。
          多个 run 并行可见。发送动作永远在人审之后（见「审核」）。
        </p>
      </header>
      <RunsConsole initial={runs} />
    </div>
  );
}
