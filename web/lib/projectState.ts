import { execFile } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { repoRoot } from "./repo";

/**
 * 每个项目的真实流水线状态——通过跑 `tools/pipeline.py status --json` 取。
 * runner 是步骤顺序的唯一权威，所以进度也只能问它，不能在 web 这边另算一套。
 * 本地工作台可用；线上（Vercel 无 python / 文件只读）优雅降级返回 null。
 */

export interface RunNode {
  id: string;
  layer: string;
  title: string;
  status: "done" | "todo";
  blocked: boolean;
  details: string[];
}

export interface ProjectState {
  slug: string;
  content_type: string | null;
  reader: string | null;
  style: string | null;
  voice: string | null;
  confirmed: boolean;
  progress: { done: number; total: number };
  next: { id: string; title: string; run: string | null; hard_stop: boolean } | null;
  ready_to_distribute: boolean;
  nodes: RunNode[];
}

function runnerJson(slug: string): Promise<ProjectState | null> {
  const root = repoRoot();
  const projDir = path.join(root, "output", slug);
  if (!fs.existsSync(path.join(projDir, "spec_lock.yaml"))) {
    return Promise.resolve(null); // 没 spec_lock = 还没进 runner 的项目
  }
  return new Promise((resolve) => {
    execFile(
      "python3",
      ["tools/pipeline.py", "status", "--json", "--root", projDir],
      { cwd: root, timeout: 8000, maxBuffer: 4 * 1024 * 1024 },
      (err, stdout) => {
        if (err && !stdout) return resolve(null);
        try {
          resolve(JSON.parse(stdout.trim()) as ProjectState);
        } catch {
          resolve(null);
        }
      },
    );
  });
}

/** 批量取多个项目状态（并行 + 单点失败不影响其它）。 */
export async function getProjectStates(
  slugs: string[],
): Promise<Map<string, ProjectState>> {
  const out = new Map<string, ProjectState>();
  const results = await Promise.all(
    slugs.map((s) =>
      runnerJson(s)
        .then((st) => [s, st] as const)
        .catch(() => [s, null] as const),
    ),
  );
  for (const [slug, st] of results) if (st) out.set(slug, st);
  return out;
}

export async function getProjectState(
  slug: string,
): Promise<ProjectState | null> {
  return runnerJson(slug);
}

/** 列出 output/ 下所有有 spec_lock 的项目 slug（= 已进 runner 的）。 */
export function listPipelineProjects(): string[] {
  const dir = path.join(repoRoot(), "output");
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((s) => !s.startsWith("_") && !s.startsWith("exp-"))
    .filter((s) => fs.existsSync(path.join(dir, s, "spec_lock.yaml")))
    .sort()
    .reverse();
}
