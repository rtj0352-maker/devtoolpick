import type { APIContext } from 'astro';
import { feed } from '../lib/feeds';
export const GET = (ctx: APIContext) =>
  feed(ctx, { title: 'DevToolPick', description: 'AI coding tool guides and developer news, with real prices and check dates.', colls: ['reviews', 'news'], lang: 'en' });
