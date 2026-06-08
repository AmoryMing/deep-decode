#!/usr/bin/env python3
"""按 domain 过滤 wiki 页面。

输出：命中的文件路径列表（每行一个），供写作时 lazy load。
不修改任何文件。

用法:
  python3 wiki/filter_by_domain.py --domain ai-infra
  python3 wiki/filter_by_domain.py --domain ai-infra ai-product   # 任一命中即可（OR）
  python3 wiki/filter_by_domain.py --domain ai-infra --all         # 必须全部命中（AND）
  python3 wiki/filter_by_domain.py --list-domains                  # 列出当前所有 wiki 用过的 domain

退出码：
  0 命中 ≥3 个文件
  3 命中 < 3 个文件（写作时应警告并 fallback 到全 wiki）
"""
import argparse, re, sys
from pathlib import Path

WIKI = Path(__file__).resolve().parent
SUBDIRS = ['sources', 'concepts', 'topics', 'published']
FRONTMATTER = re.compile(r'^---\n(.*?)\n---', re.DOTALL)
DOMAINS_LINE = re.compile(r'^domains:\s*\[(.*?)\]', re.MULTILINE)


def parse_domains(path: Path) -> set[str]:
    try:
        text = path.read_text(encoding='utf-8', errors='ignore')[:4000]
    except Exception:
        return set()
    m = FRONTMATTER.match(text)
    if not m:
        return set()
    fm = m.group(1)
    dm = DOMAINS_LINE.search(fm)
    if not dm:
        return set()
    raw = dm.group(1)
    return {d.strip().strip('"').strip("'") for d in raw.split(',') if d.strip()}


def all_wiki_files() -> list[Path]:
    files = []
    for sub in SUBDIRS:
        d = WIKI / sub
        if d.is_dir():
            files.extend(p for p in d.rglob('*.md') if p.is_file())
    return files


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--domain', nargs='*', default=[])
    ap.add_argument('--all', action='store_true', help='AND 模式（默认 OR）')
    ap.add_argument('--list-domains', action='store_true')
    ap.add_argument('--root', type=Path, default=WIKI)
    args = ap.parse_args()

    files = all_wiki_files()

    if args.list_domains:
        seen = {}
        for f in files:
            for d in parse_domains(f):
                seen[d] = seen.get(d, 0) + 1
        for d, n in sorted(seen.items(), key=lambda x: -x[1]):
            print(f'{n:4d}  {d}')
        return 0

    if not args.domain:
        ap.error('--domain required (or use --list-domains)')

    targets = set(args.domain)
    hits = []
    for f in files:
        page_d = parse_domains(f)
        if not page_d:
            continue
        if args.all:
            if targets.issubset(page_d):
                hits.append(f)
        else:
            if targets & page_d:
                hits.append(f)

    for h in hits:
        print(h.relative_to(WIKI.parent))

    if len(hits) < 3:
        sys.stderr.write(f'WARN: only {len(hits)} files hit; consider fallback to full wiki\n')
        return 3
    return 0


if __name__ == '__main__':
    sys.exit(main())
