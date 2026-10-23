import type { APIContext } from 'astro';
import { feed } from '../../lib/feeds';
export const GET = (ctx: APIContext) =>
  feed(ctx, { title: 'DevToolPick 日本語版', description: '業務効率化AIツールのレビュー・比較と開発者向けニュース。', colls: ['jaReviews', 'jaNews'], lang: 'ja' });
