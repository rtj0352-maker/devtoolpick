import { getCollection } from 'astro:content';

// Static search index for the command palette (no external service).
export async function GET() {
  const base = import.meta.env.BASE_URL;
  const map = [
    ['reviews', 'reviews', 'en', 'Guide'],
    ['news', 'news', 'en', 'News'],
    ['jaReviews', 'ja/reviews', 'ja', 'レビュー'],
    ['jaNews', 'ja/news', 'ja', 'ニュース'],
  ] as const;
  const docs: { t: string; d: string; u: string; k: string; l: string; g: string }[] = [];
  for (const [c, path, l, k] of map) {
    for (const p of await getCollection(c, ({ data }) => !data.draft)) {
      docs.push({ t: p.data.title, d: p.data.description, u: `${base}${path}/${p.id}/`, k, l, g: p.data.tags.join(' ') });
    }
  }
  const pages: [string, string, string, string, string][] = [
    ['Tool finder', '4 questions → 1 AI coding tool recommendation', 'tools/finder/', 'Tool', 'en'],
    ['Compare AI coding tools', 'Filter and sort Copilot, Cursor, Claude Code, Devin Desktop', 'tools/compare/', 'Tool', 'en'],
    ['Pricing calculator', 'Estimate monthly cost for your team', 'tools/pricing/', 'Tool', 'en'],
    ['AIツール診断', '3つの質問で業務効率化AIツールを提案', 'ja/tools/finder/', 'ツール', 'ja'],
    ['All reviews', 'Every DevToolPick guide', 'reviews/', 'Page', 'en'],
    ['News', 'Developer and security news', 'news/', 'Page', 'en'],
    ['レビュー一覧', '日本語版のレビュー・比較記事', 'ja/reviews/', 'ページ', 'ja'],
    ['ニュース', '開発者向けニュース', 'ja/news/', 'ページ', 'ja'],
    ['About', 'How DevToolPick reviews tools', 'about/', 'Page', 'en'],
    ['Disclosure & privacy', 'Affiliate disclosure, analytics and privacy', 'disclosure/', 'Page', 'en'],
  ];
  for (const [t, d, u, k, l] of pages) docs.push({ t, d, u: `${base}${u}`, k, l, g: '' });
  return new Response(JSON.stringify(docs), { headers: { 'Content-Type': 'application/json' } });
}
