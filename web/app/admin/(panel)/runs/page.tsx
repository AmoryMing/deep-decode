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
        <h2 className="text-xl font-bold text-ink">运行 · 流水线进度</h2>
        <p className="mt-1 text-sm text-muted">
          每个项目一个任务，自动流水线一步步往前推，遇到要生成或需要你拍板的步骤就停下并说明原因。
          多个任务并行可见。发送动作永远在你人工审核之后（见「审核」），AI 不会自己发布。
        </p>
      </header>
      <RunsConsole initial={runs} />
    </div>
  );
}
