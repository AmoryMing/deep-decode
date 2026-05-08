#!/usr/bin/env node

/**
 * Claude Code 源码拆解系列批量生产脚本
 *
 * 功能：
 * - 从 queue.jsonl 读取选题队列
 * - 对每个 pending/rework 状态的选题调用 claude CLI 完整跑 deep-decode 流程
 * - 检查产出质量，失败自动重试
 * - 更新队列状态，支持断点续跑
 *
 * 用法：
 *   node batch_decode.js                    # 从第一个 pending 开始
 *   node batch_decode.js --id 5             # 处理指定 ID
 *   node batch_decode.js --parallel 3       # 并行处理（默认串行）
 *   node batch_decode.js --continue         # 从上一次中断处继续
 *
 * 环境要求：
 * - Node.js 18+
 * - claude CLI 2.0+ (claude --print 模式)
 */

const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

// ============ 配置 ============
const CONFIG = {
  baseDir: path.resolve(__dirname, '..'),
  queueFile: path.resolve(__dirname, 'queue.jsonl'),
  contextDir: path.resolve(__dirname, '../context'),
  maxRetries: 2,
  claudeTimeout: 600000, // 10 分钟 per article
  parallel: 1, // 并发数，串行更稳定
};

// ============ 工具函数 ============

function log(msg, level = 'info') {
  const timestamp = new Date().toISOString().split('T')[1].slice(0, 8);
  const prefix = {
    'info': 'ℹ️',
    'success': '✅',
    'error': '❌',
    'warn': '⚠️',
  }[level] || 'ℹ️';
  console.log(`[${timestamp}] ${prefix} ${msg}`);
}

function readQueue() {
  const content = fs.readFileSync(CONFIG.queueFile, 'utf-8');
  return content.trim().split('\n').map(line => {
    try {
      return JSON.parse(line);
    } catch (e) {
      log(`解析队列行失败: ${line.slice(0, 50)}...`, 'error');
      return null;
    }
  }).filter(Boolean);
}

function writeQueue(queue) {
  fs.writeFileSync(
    CONFIG.queueFile,
    queue.map(item => JSON.stringify(item)).join('\n') + '\n'
  );
}

function updateQueueStatus(queue, id, status, outputDir = null) {
  const item = queue.find(i => i.id === id);
  if (item) {
    item.status = status;
    if (outputDir) item.output_dir = outputDir;
    item.updated_at = new Date().toISOString();
    writeQueue(queue);
  }
}

// ============ 质量检查 ============

function checkOutputQuality(slug, outputDir) {
  const requiredFiles = [
    `${slug}.md`,           // 终稿
    'phase0_sources.json',  // 信源
    'phase1_skeleton.md',   // 骨架
    'phase2_signals.json',  // 信号
  ];

  const missing = [];
  for (const file of requiredFiles) {
    const fullPath = path.join(outputDir, file);
    if (!fs.existsSync(fullPath)) {
      missing.push(file);
    }
  }

  if (missing.length > 0) {
    log(`  缺失文件: ${missing.join(', ')}`, 'error');
    return false;
  }

  // 检查文章字数
  const articlePath = path.join(outputDir, `${slug}.md`);
  const content = fs.readFileSync(articlePath, 'utf-8');
  const bodyText = content.split('---')[2] || content.slice(content.indexOf('---', 3) + 3);
  const wordCount = bodyText.replace(/[\s\n]/g, '').length;

  if (wordCount < 2000) {
    log(`  字数不足: ${wordCount} 字 (要求 >= 2000)`, 'warn');
    return false;
  }

  // 检查图片引用
  const imgMatches = content.match(/!\[.*?\]\(material\/pngs\/.*?\.png\)/g) || [];
  if (imgMatches.length < 2) {
    log(`  图片引用不足: ${imgMatches.length} 张 (要求 >= 2)`, 'warn');
    return false;
  }

  log(`  质量检查通过: ${wordCount} 字, ${imgMatches.length} 张图`, 'success');
  return true;
}

// ============ Claude CLI 调用 ============

async function runClaudeForArticle(item) {
  const prompt = `
你是 deep-decode 内容生产专家。任务：为 Claude Code 源码拆解系列产出第 ${item.id} 篇文章。

## 文章信息
- ID: ${item.id}
- slug: ${item.slug}
- 标题: ${item.title}
- 信源: ${item.urls.join(', ')}

## 产出目录
${path.join(CONFIG.baseDir, item.slug)}

## 关键素材路径
- 骨架: ${path.join(CONFIG.baseDir, item.slug, 'phase1_skeleton.md')}
- 信源: ${path.join(CONFIG.baseDir, item.slug, 'phase0_sources.json')}
- 信号: ${path.join(CONFIG.baseDir, item.slug, 'phase2_signals.json')}
- 素材库: ${CONFIG.contextDir}

## 执行流程

### Phase 0-1: 如有已完成的骨架/信源文件，直接使用
### Phase 2: 搜索外部交叉验证信号 (至少 3 个)
### Phase 3: 撰写深度解读文章 (3000-5000 字)

**写作铁律**：
1. 不是翻译是重构 — 用自己的框架重新组织逻辑
2. 观点密度 > 信息密度 — 每段必须有"这意味着"的判断
3. 造概念 — 给没有名字的现象起名字
4. 跨信号交叉验证 — 引用至少 3 个外部信号源
5. 说人话 — 像《晚点》《虎嗅》深度稿，叙事驱动
6. 敢下判断但保持客观 — 基于证据推导，不用"我认为"
7. 图文一体 — 关键章节配 SVG 引用

**文章结构**（参考 phase1_skeleton.md）：
1. 钩子开头（反直觉数据/新词/措辞变化）
2. 核心论点重构
3. 逐点深拆（原文说了什么→这意味着什么→外部信号佐证）
4. 原创框架/概念
5. 盲区与反面论证
6. 对 AI 从业者意味着什么
7. 本期关键词

### Phase 3b: 事实核查
### Phase 4: 产出终稿到 ${item.slug}.md

**终稿格式**：
\`\`\`markdown
---
title: ${item.title}
source: ${item.urls[0] || ''}
decoded: ${new Date().toISOString().split('T')[0]}
tags: [AI产品, Claude-Code, 源码分析]
---

{正文，图片用 ![描述](material/pngs/xx.png) 引用}

---

## 本期关键词
**术语** -- 解释

## 原文关键引用
> "{原话}" -- {作者}

## 引用
1. [标题](URL) -- 说明
\`\`\`

现在开始执行。先读取已有的骨架文件，然后搜索外部信号，然后写文章。
`.trim();

  log(`启动 Claude 处理文章 #${item.id}: ${item.title}...`);

  return new Promise((resolve, reject) => {
    const outputDir = path.join(CONFIG.baseDir, item.slug);
    const claude = spawn('claude', [
      '--print',
      '--permission-mode', 'bypassPermissions',
    ], {
      cwd: outputDir,
      env: { ...process.env },
      stdio: ['pipe', 'pipe', 'pipe'],
    });

    claude.stdin.write(prompt);
    claude.stdin.end();

    let stdout = '';
    let stderr = '';

    claude.on('error', (err) => {
      log(`Claude spawn error: ${err.message}`, 'error');
    });

    claude.stdout.on('data', (data) => {
      stdout += data.toString();
      process.stdout.write(data);
    });

    claude.stderr.on('data', (data) => {
      stderr += data.toString();
      process.stderr.write(data);
    });

    const timer = setTimeout(() => {
      claude.kill('SIGTERM');
      reject(new Error('Claude 超时'));
    }, CONFIG.claudeTimeout);

    claude.on('close', (code) => {
      clearTimeout(timer);
      if (code === 0) {
        resolve(stdout);
      } else {
        reject(new Error(`Claude 退出码: ${code}, stderr: ${stderr}`));
      }
    });
  });
}

// ============ 主流程 ============

async function processItem(item, queue, retryCount = 0) {
  const outputDir = path.join(CONFIG.baseDir, item.slug);

  // 创建输出目录
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
    fs.mkdirSync(path.join(outputDir, 'material/pngs'), { recursive: true });
  }

  log(`\n处理文章 #${item.id}: ${item.title}`, 'info');
  log(`  输出目录: ${outputDir}`);

  try {
    // 调用 Claude CLI
    await runClaudeForArticle(item);

    // 质量检查
    const passed = checkOutputQuality(item.slug, outputDir);

    if (passed) {
      updateQueueStatus(queue, item.id, 'done', outputDir);
      log(`文章 #${item.id} 完成`, 'success');
      return true;
    } else {
      throw new Error('质量检查未通过');
    }
  } catch (error) {
    log(`文章 #${item.id} 失败: ${error.message}`, 'error');

    if (retryCount < CONFIG.maxRetries) {
      log(`  重试 (${retryCount + 1}/${CONFIG.maxRetries})...`, 'warn');
      await new Promise(r => setTimeout(r, 5000)); // 等待 5 秒后重试
      return processItem(item, queue, retryCount + 1);
    }

    updateQueueStatus(queue, item.id, 'failed');
    return false;
  }
}

async function runBatch(options = {}) {
  const queue = readQueue();

  let items;
  if (options.id) {
    items = queue.filter(i => i.id === options.id);
    if (items.length === 0) {
      log(`找不到 ID=${options.id} 的选题`, 'error');
      return;
    }
  } else if (options.continue) {
    items = queue.filter(i => i.status === 'rework' || i.status === 'failed');
    if (items.length === 0) {
      log(`没有需要继续的选题`, 'info');
      return;
    }
  } else {
    items = queue.filter(i => i.status === 'pending' || i.status === 'rework');
  }

  log(`\n批量任务启动: ${items.length} 篇文章待处理\n`);

  let success = 0;
  let failed = 0;

  for (const item of items) {
    const result = await processItem(item, queue);
    if (result) {
      success++;
    } else {
      failed++;
    }
  }

  log(`\n批量任务完成: ${success} 成功, ${failed} 失败`, success === items.length ? 'success' : 'warn');
}

// ============ CLI 入口 ============

async function main() {
  const args = process.argv.slice(2);

  const options = {};
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--id' && args[i + 1]) {
      options.id = parseInt(args[++i]);
    } else if (args[i] === '--parallel' && args[i + 1]) {
      options.parallel = parseInt(args[++i]);
    } else if (args[i] === '--continue') {
      options.continue = true;
    }
  }

  await runBatch(options);
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { runBatch, processItem };
