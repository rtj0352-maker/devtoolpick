# DevToolPick — setup notes (for future agent runs)

## Brand & niche
- **Site name:** DevToolPick
- **Niche:** AI coding / developer SaaS reviews & comparisons (English)
- **Path:** `/workspace/devtoolpick`
- **Target live URL:** `https://rtj0352-maker.github.io/devtoolpick/`
- **GitHub account connected in Cursor:** `rtj0352-maker`

## Stack
- Astro 7 static site
- Content collection: `src/content/reviews/*.md`
- Sitemap: `@astrojs/sitemap`
- Styles: `src/styles/global.css`
- Base path for GitHub project pages: `/devtoolpick`
- Env at build: `SITE_URL`, `BASE_PATH`

## Cornerstone articles (v1)
1. Best AI Coding Assistants in 2026
2. Cursor vs GitHub Copilot vs Devin Desktop vs Claude Code (2026)
3. Claude Code Review (2026)
4. Best AI Coding Tools for Solo Developers on a Budget (2026)
5. GitHub Copilot Pricing Explained (2026)

## Monetization status
- Affiliate disclosure page live at `/disclosure/`
- Per-article disclosure component in `ArticleLayout`
- Green dashed **affiliate placeholders** in articles — replace with real partner URLs when approved
- Display ads: not added yet (wait for traffic)

## Deploy status
- Site builds successfully (`npm run build`)
- GitHub Actions workflow ready: `.github/workflows/deploy.yml`
- **Not auto-deployed yet** — needs user to create public repo + enable Pages (Actions), or authorize `gh`/push credentials for the agent

## User action required to go live
1. Create public repo `devtoolpick` on GitHub (account `rtj0352-maker` is fine)
2. From `/workspace/devtoolpick`:
   ```bash
   git init
   git add .
   git commit -m "Initial DevToolPick site"
   git branch -M main
   git remote add origin https://github.com/rtj0352-maker/devtoolpick.git
   git push -u origin main
   ```
3. Settings → Pages → Source: **GitHub Actions**
4. After deploy, open Search Console and submit sitemap
5. Register affiliate programs (Cursor/GitHub/Anthropic/Devin partner programs, Impact/PartnerStack, etc.) and paste links into placeholders

## Next content ideas
- Cursor Premium vs Plus: who needs third-party models
- Devin Desktop vs Cursor for agentic editing
- JetBrains + Copilot workflow guide
- “Rules files” comparison: CLAUDE.md vs .cursor/rules vs copilot-instructions
- Weekly pricing-change changelog posts (great for freshness SEO)

## Commands
```bash
export PATH="/home/box/.local/node-v22.20.0-linux-x64/bin:$PATH"
cd /workspace/devtoolpick
npm run dev
SITE_URL=https://rtj0352-maker.github.io/devtoolpick BASE_PATH=/devtoolpick npm run build
```

Node 22 is installed locally at `/home/box/.local/node-v22.20.0-linux-x64/bin` (system Node was 20).
