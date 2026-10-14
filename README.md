# DevToolPick

English niche SEO site: **AI coding / developer SaaS tool reviews & comparisons**.

- Stack: Astro 7 (static), Markdown content collections
- Hosting target: **GitHub Pages** free subdomain  
  `https://rtj0352-maker.github.io/devtoolpick/`
- Monetization: SaaS affiliate links (placeholders ready) → later display ads

## Local development

Requires Node.js 22+.

```bash
npm install
npm run dev
```

## Production build

```bash
SITE_URL=https://rtj0352-maker.github.io/devtoolpick BASE_PATH=/devtoolpick npm run build
npm run preview
```

## Deploy (GitHub Pages)

1. Create a public GitHub repo named `devtoolpick` under `rtj0352-maker` (or your account).
2. Push this project to `main`.
3. Repo **Settings → Pages → Build and deployment → Source: GitHub Actions**.
4. The workflow `.github/workflows/deploy.yml` builds and publishes automatically.
5. Submit `https://<user>.github.io/devtoolpick/sitemap-index.xml` in Google Search Console after go-live.

## Content

Articles live in `src/content/reviews/*.md`.  
Affiliate placeholders are marked with `data-affiliate-placeholder` / dashed green boxes.

## Notes for agents

See `/workspace/devtoolpick/SETUP_NOTES.md` (and the copy under `/workspace/income-site-notes.md`).
