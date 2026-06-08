import fs from "node:fs";
import path from "node:path";

/**
 * 定位内容工厂仓库根目录。
 * web/ 是仓库的子目录，数据（output/ schedule/ skillgraph.yaml）在上一级。
 * build / dev 时 cwd 通常是 web/，向上查找含 skillgraph.yaml + output/ 的目录。
 */
let cached: string | null = null;

export function repoRoot(): string {
  if (cached) return cached;
  let dir = process.cwd();
  for (let i = 0; i < 6; i++) {
    const hasGraph = fs.existsSync(path.join(dir, "skillgraph.yaml"));
    const hasOutput = fs.existsSync(path.join(dir, "output"));
    if (hasGraph && hasOutput) {
      cached = dir;
      return dir;
    }
    const parent = path.dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }
  // 兜底：web 的上一级
  cached = path.resolve(process.cwd(), "..");
  return cached;
}
