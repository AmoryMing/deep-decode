import fs from "node:fs";
import path from "node:path";
import yaml from "js-yaml";
import { repoRoot } from "./repo";

/* eslint-disable @typescript-eslint/no-explicit-any */

/** onboarding 盘点：创作者接入的资产（config / reader / style / content_type / 渠道）现状。 */

export interface ReaderInfo {
  key: string;
  displayName: string;
  hasTone: boolean;
  hasPersona: boolean;
}
export interface StyleInfo {
  key: string;
  hasVoice: boolean;
  hasFeedback: boolean;
}
export interface ContentTypeInfo {
  key: string;
  title: string;
  requiredArtifacts: number;
}
export interface ProviderInfo {
  key: string;
  model: string;
  hasKey: boolean;
}
export interface SetupInventory {
  configExists: boolean; // 真 factory.config.yaml（非 .example）
  configSource: "factory.config.yaml" | "factory.config.yaml.example" | null;
  defaults: Record<string, unknown>;
  providers: ProviderInfo[];
  defaultModel: string | null;
  channels: string[];
  readers: ReaderInfo[];
  styles: StyleInfo[];
  contentTypes: ContentTypeInfo[];
  wikiCounts: { sources: number; concepts: number; topics: number };
}

function exists(p: string): boolean {
  return fs.existsSync(path.join(repoRoot(), p));
}
function listDirs(rel: string): string[] {
  const dir = path.join(repoRoot(), rel);
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir, { withFileTypes: true })
    .filter((d) => d.isDirectory() && !d.name.startsWith("_") && !d.name.startsWith("."))
    .map((d) => d.name);
}
function countFiles(rel: string): number {
  const dir = path.join(repoRoot(), rel);
  if (!fs.existsSync(dir)) return 0;
  return fs.readdirSync(dir).filter((f) => f.endsWith(".md")).length;
}

function loadConfig(): { doc: any; source: SetupInventory["configSource"]; real: boolean } {
  const root = repoRoot();
  for (const [name, real] of [
    ["factory.config.yaml", true],
    ["factory.config.yaml.example", false],
  ] as const) {
    const f = path.join(root, name);
    if (fs.existsSync(f)) {
      try {
        return { doc: yaml.load(fs.readFileSync(f, "utf8")) || {}, source: name, real };
      } catch {
        return { doc: {}, source: name, real };
      }
    }
  }
  return { doc: {}, source: null, real: false };
}

export function getSetupInventory(): SetupInventory {
  const { doc, source, real } = loadConfig();
  const models = doc?.models || {};
  const providers: ProviderInfo[] = Object.entries(models.providers || {}).map(
    ([key, v]: [string, any]) => ({
      key,
      model: String(v?.model || ""),
      hasKey: Boolean(v?.api_key && String(v.api_key).trim()),
    }),
  );

  const readers: ReaderInfo[] = listDirs("readers").map((key) => {
    let displayName = key;
    const tonePath = path.join(repoRoot(), "readers", key, "tone.yaml");
    if (fs.existsSync(tonePath)) {
      try {
        const t: any = yaml.load(fs.readFileSync(tonePath, "utf8"));
        if (t?.display_name) displayName = String(t.display_name);
      } catch {
        /* ignore */
      }
    }
    return {
      key,
      displayName,
      hasTone: exists(`readers/${key}/tone.yaml`),
      hasPersona: exists(`readers/${key}/persona.md`),
    };
  });

  const styles: StyleInfo[] = listDirs("styles").map((key) => ({
    key,
    hasVoice: exists(`styles/${key}/voice.md`),
    hasFeedback: exists(`styles/${key}/feedback.md`),
  }));

  const contentTypes: ContentTypeInfo[] = (() => {
    const f = path.join(repoRoot(), "templates/content/_registry.yaml");
    if (!fs.existsSync(f)) return [];
    try {
      const reg: any = yaml.load(fs.readFileSync(f, "utf8"));
      return Object.entries(reg?.types || {}).map(([key, v]: [string, any]) => ({
        key,
        title: String(v?.title || key),
        requiredArtifacts: Array.isArray(v?.required_artifacts)
          ? v.required_artifacts.length
          : 0,
      }));
    } catch {
      return [];
    }
  })();

  return {
    configExists: real,
    configSource: source,
    defaults: doc?.defaults || {},
    providers,
    defaultModel: models.default ? String(models.default) : null,
    channels: Array.isArray(doc?.channels?.default) ? doc.channels.default : [],
    readers,
    styles,
    contentTypes,
    wikiCounts: {
      sources: countFiles("wiki/sources"),
      concepts: countFiles("wiki/concepts"),
      topics: countFiles("wiki/topics"),
    },
  };
}
