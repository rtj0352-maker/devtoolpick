import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';

type Coll = 'reviews' | 'jaReviews' | 'news' | 'jaNews';
const PATHS: Record<Coll, string> = { reviews: 'reviews', jaReviews: 'ja/reviews', news: 'news', jaNews: 'ja/news' };

export async function feed(ctx: APIContext, opts: { title: string; description: string; colls: Coll[]; lang: string }) {
  const base = import.meta.env.BASE_URL;
  const items = (
    await Promise.all(opts.colls.map(async (c) => (await getCollection(c, ({ data }) => !data.draft)).map((p) => ({ p, c }))))
  )
    .flat()
    .sort((a, b) => (b.p.data.updatedDate ?? b.p.data.pubDate).valueOf() - (a.p.data.updatedDate ?? a.p.data.pubDate).valueOf());
  return rss({
    title: opts.title,
    description: opts.description,
    site: new URL(base, ctx.site).toString(),
    customData: `<language>${opts.lang}</language>`,
    items: items.map(({ p, c }) => ({
      title: p.data.title,
      description: p.data.description,
      pubDate: p.data.updatedDate ?? p.data.pubDate,
      link: `${base}${PATHS[c]}/${p.id}/`,
      categories: p.data.tags,
    })),
  });
}
