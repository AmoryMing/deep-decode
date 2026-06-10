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

export interface EditableConfig {
  exists: boolean;
  defaultModel: string;
  nodeModels: Record<string, string>;
  providerKeySet: Record<string, boolean>; // provider → 是否已配 key（不回传 key 本身）
  visualBackend: string;
  videoBackend: string;
  seedanceKeySet: boolean;
  gptImageKeySet: boolean;
  channels: string[];
}

/** 读当前 factory.config 供 UI 编辑——绝不把 key 明文回传前端，只回"是否已配"。 */
export function getEditableConfig(): EditableConfig {
  const { doc, real } = loadConfig();
  const models = doc?.models || {};
  const providerKeySet: Record<string, boolean> = {};
  for (const [k, v] of Object.entries<any>(models.providers || {})) {
    providerKeySet[k] = Boolean(v?.api_key && String(v.api_key).trim());
  }
  const video = doc?.video || {};
  const visual = doc?.visual || {};
  return {
    exists: real,
    defaultModel: String(models.default || "deepseek"),
    nodeModels: (models.node_models || {}) as Record<string, string>,
    providerKeySet,
    visualBackend: String(visual.backend || "gpt-image"),
    videoBackend: String(video.backend || "remotion"),
    seedanceKeySet: Boolean(video?.seedance?.access_key && video?.seedance?.secret_key),
    gptImageKeySet: Boolean(visual?.gpt_image?.api_key),
    channels: Array.isArray(doc?.channels?.default) ? doc.channels.default : [],
  };
}

/** 把 UI 改动合并写回 factory.config.yaml（保留未触及字段；空 key = 不改）。 */
export function saveConfigPatch(patch: {
  defaultModel?: string;
  visualBackend?: string;
  videoBackend?: string;
  channels?: string[];
  nodeModels?: Record<string, string>;
  deepseekKey?: string;
  gptImageKey?: string;
  seedanceAccessKey?: string;
  seedanceSecretKey?: string;
}): { ok: boolean; message: string } {
  const root = repoRoot();
  const f = path.join(root, "factory.config.yaml");
  let doc: any = {};
  if (fs.existsSync(f)) {
    try {
      doc = yaml.load(fs.readFileSync(f, "utf8")) || {};
    } catch {
      return { ok: false, message: "现有 factory.config.yaml 解析失败" };
    }
  } else {
    // 从 example 起底
    const ex = path.join(root, "factory.config.yaml.example");
    if (fs.existsSync(ex)) {
      try {
        doc = yaml.load(fs.readFileSync(ex, "utf8")) || {};
      } catch {
        doc = {};
      }
    }
  }
  doc.models = doc.models || {};
  doc.models.providers = doc.models.providers || {};
  doc.models.node_models = doc.models.node_models || {};
  doc.visual = doc.visual || {};
  doc.visual.gpt_image = doc.visual.gpt_image || {};
  doc.video = doc.video || {};
  doc.video.seedance = doc.video.seedance || {};
  doc.channels = doc.channels || {};

  if (patch.defaultModel) doc.models.default = patch.defaultModel;
  if (patch.visualBackend) doc.visual.backend = patch.visualBackend;
  if (patch.videoBackend) doc.video.backend = patch.videoBackend;
  if (patch.channels) doc.channels.default = patch.channels;
  if (patch.nodeModels)
    doc.models.node_models = { ...doc.models.node_models, ...patch.nodeModels };
  if (patch.deepseekKey) {
    doc.models.providers.deepseek = doc.models.providers.deepseek || {
      base_url: "https://api.deepseek.com/v1",
      model: "deepseek-v4-pro",
    };
    doc.models.providers.deepseek.api_key = patch.deepseekKey;
  }
  if (patch.gptImageKey) doc.visual.gpt_image.api_key = patch.gptImageKey;
  if (patch.seedanceAccessKey) doc.video.seedance.access_key = patch.seedanceAccessKey;
  if (patch.seedanceSecretKey) doc.video.seedance.secret_key = patch.seedanceSecretKey;

  try {
    fs.writeFileSync(
      f,
      "# factory.config.yaml — 真配置（含 key，gitignore，绝不入库）\n" +
        yaml.dump(doc, { lineWidth: 120, noRefs: true }),
      "utf8",
    );
  } catch {
    return { ok: false, message: "写入失败：文件系统只读" };
  }
  return { ok: true, message: "已保存" };
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
