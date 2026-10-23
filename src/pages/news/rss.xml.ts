import type { APIContext } from 'astro';
import { feed } from '../../lib/feeds';
export const GET = (ctx: APIContext) =>
  feed(ctx, { title: 'DevToolPick News', description: 'Dated, sourced developer and security news. Times in JST.', colls: ['news', 'jaNews'], lang: 'en' });
