# AGENTS.md — DevToolPick

Static Astro affiliate blog → GitHub Pages at https://rtj0352-maker.github.io/devtoolpick/
Every push to `main` deploys automatically (`.github/workflows/deploy.yml`), so `main` is production.

## Build & verify (required before every push)

```sh
export PATH=/home/box/.local/node-v22.20.0-linux-x64/bin:$PATH   # Node 22 required (box default is 20)
npm ci
npm run check    # astro check + astro build + scripts/check-content.mjs
```

`npm run check` must end with `0 error(s)`. CI runs the same command and will refuse to deploy otherwise.
Warnings about pending `A8_AFFILIATE_LINK` placeholders are expected until A8 approves the program.
Don't weaken the schema or the check script to make a failure go away; fix the content.

## Where things live

- English reviews: `src/content/reviews/*.md` → `/devtoolpick/reviews/<file-name>/`
- Japanese reviews: `src/content/ja-reviews/*.md` → `/devtoolpick/ja/reviews/<file-name>/`
- Frontmatter schema: `src/content.config.ts` (`title`, `description`, `pubDate`, `tags` required; unknown keys rejected).
  Lengths: EN title 10–70 / description 50–200 chars; JA title 10–60 / description 40–140 chars.
- Approved affiliate programs: `scripts/affiliate-programs.json`.
- Layout adds the affiliate disclosure box to every article (`src/components/AffiliateDisclosure.astro`). Don't remove it.

English section = AI coding / developer tools, written in English, Amazon links only.
Japanese section = Japanese AI/SaaS tools, written in natural Japanese, A8.net links. Don't mix languages within an article.

## Links

- Internal links include the base path and end with `/`: `/devtoolpick/reviews/claude-code-review-2026/`. A link without the base is broken on GitHub Pages.
- Amazon: only `https://www.amazon.co.jp/dp/<10-char ASIN>?tag=devtoolpick-22`. No amzn.to links and no other tags.
- A8: copy the link + 1×1 pixel exactly as A8 issues them; the `a8mat` must be listed in `scripts/affiliate-programs.json`.
  Add a program there only after A8 shows 提携完了 (approved).
- Every affiliate `<a>` is raw HTML with `rel="nofollow sponsored noopener"`. Don't use Markdown `[text](url)` for affiliate links, because it can't carry `rel`:
  ```html
  <a href="https://www.amazon.co.jp/dp/0135957052?tag=devtoolpick-22" rel="nofollow sponsored noopener" target="_blank">Title</a>
  ```
- Any article with Amazon links must also contain: "As an Amazon Associate we earn from qualifying purchases."
- When a pending A8 program is approved, replace its `<!-- A8_AFFILIATE_LINK: Name -->` placeholder block with the real link.

## Facts

- Never invent product IDs (ASINs, a8mat), prices, plan names or features. Verify on the vendor's official page and state the check date (Asia/Tokyo) in the article.
  If you can't verify something, leave it out.
- `pubDate` / `updatedDate` are real dates (`YYYY-MM-DD`). Bump `updatedDate` when you change facts.

## Dev server

`npx astro dev --background`; manage with `astro dev stop|status|logs`. Astro docs: https://docs.astro.build
