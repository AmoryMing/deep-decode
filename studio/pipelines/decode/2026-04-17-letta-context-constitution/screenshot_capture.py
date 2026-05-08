"""
兜底截图脚本 -- 绕开 Playwright MCP 卡死，用 python playwright 直连
截 3 张：博客首屏 / GitHub 仓库首页 / Constitution 原文
"""
import asyncio
from pathlib import Path
from playwright.async_api import async_playwright

OUT = Path(__file__).resolve().parent / "screenshots"
OUT.mkdir(exist_ok=True)

targets = [
    ("https://www.letta.com/blog/context-constitution", "01_letta_blog_hero.png", 1280, 900),
    ("https://github.com/letta-ai/context-constitution", "02_github_repo.png", 1280, 900),
    ("https://raw.githubusercontent.com/letta-ai/context-constitution/main/constitution/CONSTITUTION.md", "03_constitution_raw.png", 1000, 1200),
]

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        for url, name, w, h in targets:
            try:
                ctx = await browser.new_context(viewport={"width": w, "height": h})
                page = await ctx.new_page()
                await page.goto(url, wait_until="networkidle", timeout=30000)
                await page.wait_for_timeout(1500)
                out = OUT / name
                await page.screenshot(path=str(out), full_page=False)
                size_kb = out.stat().st_size / 1024
                print(f"✓ {name}: {size_kb:.0f} KB ({url})")
                await ctx.close()
            except Exception as e:
                print(f"✗ {name} FAILED: {e}")
        await browser.close()

asyncio.run(main())
