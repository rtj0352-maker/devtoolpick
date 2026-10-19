// Small helpers shared by listing pages, cards and article layout.
export type Lang = 'en' | 'ja';

export function formatDate(d: Date, lang: Lang, style: 'long' | 'short' = 'short'): string {
  return lang === 'ja'
    ? d.toLocaleDateString('ja-JP', { year: 'numeric', month: style === 'long' ? 'long' : 'numeric', day: 'numeric', timeZone: 'Asia/Tokyo' })
    : d.toLocaleDateString('en-US', { year: 'numeric', month: style === 'long' ? 'long' : 'short', day: 'numeric', timeZone: 'Asia/Tokyo' });
}

/** Rough reading time from the Markdown body (EN ~230 words/min, JA ~500 chars/min). */
export function readingMinutes(body: string | undefined, lang: Lang): number {
  const text = (body ?? '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/[|#*_`>\-]/g, ' ');
  const n = lang === 'ja' ? text.replace(/\s+/g, '').length / 500 : text.split(/\s+/).filter(Boolean).length / 230;
  return Math.max(1, Math.round(n));
}

export function readingLabel(min: number, lang: Lang): string {
  return lang === 'ja' ? `約${min}分で読めます` : `${min} min read`;
}
