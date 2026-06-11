/**
 * nodeLabels.ts — 渲染层「黑话 → 人话」唯一映射。
 *
 * 流水线内部用工程编号（n.router / m.article / spec_lock …）当节点 id，
 * 这些是给造发动机的人看的，不该直出给创作者。任何要展示给用户的节点 id、
 * 节点标题、状态原因，都先过这里翻译成中文人话再渲染。
 *
 * 单一来源：状态色、状态文案也集中在这，避免各页面各写一套互相打架。
 */

/** 节点 id → 人话标签（创作者能看懂这一步在干嘛）。 */
export const NODE_LABEL: Record<string, string> = {
  "n.router": "AI 定位选题",
  "n.strategy": "写作策略",
  "n.evidence": "抓原文找证据",
  "m.article": "写稿",
  "m.tone_gate": "语气检查",
  "a.tone_lint": "语气检查",
  "m.polish": "润色",
  "m.factcheck": "事实核查",
  "m.visual": "配图",
  "visual.backend": "配图引擎",
  "m.video": "生成视频",
  "video.backend": "视频引擎",
  "m.podcast": "生成播客",
  "a.tts": "配音合成",
  "m.email_package": "邮件草稿",
  "a.email_draft": "邮件草稿",
  "a.wechat_draft": "公众号草稿",
  "c.distribute_all": "全渠道草稿打包",
};

/** 每层前缀 → 中文角色名（替代 m/a/C 这种字母层标记）。 */
const LAYER_LABEL: Record<string, string> = {
  n: "步骤",
  m: "步骤",
  a: "工具",
  c: "汇总",
};

/**
 * 把一个节点 id 翻成人话。
 * 优先查表；查不到就剥掉前缀、把下划线变空格，至少不泄漏 `m.xxx` 形态。
 */
export function nodeLabel(id: string | null | undefined): string {
  if (!id) return "";
  const key = id.trim();
  if (NODE_LABEL[key]) return NODE_LABEL[key];
  const dot = key.indexOf(".");
  if (dot > 0) {
    const rest = key.slice(dot + 1).replace(/_/g, " ");
    return rest || key;
  }
  return key;
}

/** 自由文本里的黑话词逐个替换（节点标题、状态原因、日志摘要等）。 */
const PHRASE_MAP: Array<[RegExp, string]> = [
  [/（?\s*\d*\s*原子推荐\s*）?/g, ""],
  [/入口路由/g, "AI 定位选题"],
  [/\bspec[_-]?lock(?:\.yaml)?\b/gi, "生产卡"],
  [/factory\.config(?:\.yaml)?/gi, "工厂设置"],
  [/\bREADY\.md\b/g, "发布清单"],
  [/\bsend_email\.py\b/g, "发布脚本"],
  [/\bperf_record(?:\.py)?\b/gi, "互动数记录"],
  [/\banalytics_snapshot\b/gi, "数据快照"],
  [/\btone_lint\b/gi, "语气检查"],
  [/契约(?:未过|没过)?/g, "质检"],
  [/硬停/g, "等你拍板"],
  [/\bBYOK\b/g, "用你自己的模型 Key"],
  [/\bexecutor\b/gi, "自动执行"],
  [/\brunner\b/gi, "自动流水线"],
  [/\bdriver\b/gi, "自动流水线"],
  [/\bcron\b/gi, "定时任务"],
  [/\bgitignore\b/gi, "本地私密文件"],
  [/ANTHROPIC_API_KEY/g, "模型 API Key"],
  [/\.ya?ml\b/gi, ""],
];

/**
 * 把一段自由文本中的工程黑话翻成人话。
 * 先把已知节点 id（m.video 之类）替换成标签，再做短语替换。
 */
export function humanize(text: string | null | undefined): string {
  if (!text) return "";
  let s = text;
  // 节点 id：长 key 先替换，避免 m.video 被 m.v 之类截断
  const ids = Object.keys(NODE_LABEL).sort((a, b) => b.length - a.length);
  for (const id of ids) {
    s = s.split(id).join(NODE_LABEL[id]);
  }
  // 兜底：任何残留的 n./m./a./c. + 词，剥成「步骤名」
  s = s.replace(/\b([nmac])\.([a-z][a-z_]*)/g, (_m, _p, body: string) =>
    body.replace(/_/g, " "),
  );
  for (const [re, to] of PHRASE_MAP) s = s.replace(re, to);
  return s.replace(/\s{2,}/g, " ").trim();
}

export { LAYER_LABEL };
