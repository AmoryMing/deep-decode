import fs from "node:fs";
import path from "node:path";
import yaml from "js-yaml";
import { repoRoot } from "./repo";

export interface GraphNode {
  id: string;
  title: string;
  run?: string;
  produces?: number;
}

export interface Axis {
  key: string;
  default?: string;
  variants?: string[];
}

export interface SkillGraph {
  version?: number;
  atoms: GraphNode[];
  molecules: GraphNode[];
  compounds: GraphNode[];
  axes: Axis[];
}

/* eslint-disable @typescript-eslint/no-explicit-any */
function norm(arr: any): GraphNode[] {
  if (!Array.isArray(arr)) return [];
  return arr
    .map((n: any) => ({
      id: String(n?.id ?? ""),
      title: String(n?.title ?? n?.id ?? ""),
      run: n?.run ? String(n.run) : undefined,
      produces: Array.isArray(n?.produces) ? n.produces.length : undefined,
    }))
    .filter((n) => n.id);
}

export function getSkillGraph(): SkillGraph | null {
  const f = path.join(repoRoot(), "skillgraph.yaml");
  if (!fs.existsSync(f)) return null;
  let doc: any;
  try {
    doc = yaml.load(fs.readFileSync(f, "utf8"));
  } catch {
    return null;
  }
  if (!doc) return null;
  const axes: Axis[] =
    doc.axes && typeof doc.axes === "object"
      ? Object.entries(doc.axes).map(([key, v]: [string, any]) => ({
          key,
          default: v?.default ? String(v.default) : undefined,
          variants: Array.isArray(v?.variants)
            ? v.variants.map(String)
            : undefined,
        }))
      : [];
  return {
    version: typeof doc.version === "number" ? doc.version : undefined,
    atoms: norm(doc.atoms),
    molecules: norm(doc.molecules),
    compounds: norm(doc.compounds),
    axes,
  };
}
