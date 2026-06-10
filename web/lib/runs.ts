import fs from "node:fs";
import path from "node:path";
import { repoRoot } from "./repo";

/** 一次 run 的状态，由 tools/run_pipeline.py 写到 output/<slug>/_state/run.json。 */
export interface RunState {
  slug: string;
  status: "queued" | "running" | "blocked" | "done" | "failed" | "idle";
  started_at?: string;
  updated_at?: string;
  current?: string | null;
  progress?: { done: number; total: number };
  blocked_reason?: string | null;
  history?: { node: string | null; action: string; ok: boolean; at: string; msg?: string }[];
  log_tail?: string[];
}

function runPath(slug: string): string {
  return path.join(repoRoot(), "output", slug, "_state", "run.json");
}

export function readRun(slug: string): RunState | null {
  const f = runPath(slug);
  if (!fs.existsSync(f)) return null;
  try {
    return JSON.parse(fs.readFileSync(f, "utf8")) as RunState;
  } catch {
    return null;
  }
}

/** 扫所有项目的 _state/run.json —— 用于 /admin/runs 一屏看全部并行批次。 */
export function listRuns(): RunState[] {
  const dir = path.join(repoRoot(), "output");
  if (!fs.existsSync(dir)) return [];
  const out: RunState[] = [];
  for (const slug of fs.readdirSync(dir)) {
    const r = readRun(slug);
    if (r) out.push(r);
  }
  // 活跃的（running/queued/blocked）排前面，再按更新时间倒序
  const rank = (s: RunState["status"]) =>
    s === "running" || s === "queued" ? 0 : s === "blocked" ? 1 : 2;
  return out.sort(
    (a, b) =>
      rank(a.status) - rank(b.status) ||
      (b.updated_at || "").localeCompare(a.updated_at || ""),
  );
}
