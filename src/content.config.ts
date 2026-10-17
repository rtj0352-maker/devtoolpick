import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

// Bad frontmatter must fail `npm run build`. Keep these bounds in sync with AGENTS.md.
// Lengths are counted in characters (JA text is denser, so its bounds are lower).
type Bounds = { title: [number, number]; description: [number, number] };

const chars = (s: string) => [...s].length;

const lengthBetween = (field: string, [min, max]: [number, number]) =>
  z
    .string()
    .trim()
    .refine((s) => chars(s) >= min && chars(s) <= max, {
      message: `${field} must be ${min}-${max} characters`,
    });

// Accept YAML dates (2026-10-15) or ISO strings; reject anything that isn't a real date.
// YAML silently rolls over impossible dates (2026-13-45 -> 2027-02-14), so also reject
// dates before the site existed or in the future (+1 day slack for time zones).
const SITE_START = new Date('2026-01-01T00:00:00Z');
const date = z.coerce
  .date()
  .refine((d) => !Number.isNaN(d.valueOf()), { message: 'invalid date' })
  .refine((d) => d >= SITE_START, { message: 'date is before 2026-01-01; check the year' })
  .refine((d) => d.valueOf() <= Date.now() + 86_400_000, {
    message: 'date is in the future; use the real publish/update date (YYYY-MM-DD)',
  });

const reviewSchema = (b: Bounds) =>
  z
    .strictObject({
      title: lengthBetween('title', b.title),
      description: lengthBetween('description', b.description),
      pubDate: date,
      updatedDate: date.optional(),
      author: z.string().min(1).default('DevToolPick Editorial'),
      tags: z.array(z.string().min(1)).min(1, 'add at least one tag').max(10),
      draft: z.boolean().default(false),
      heroLabel: z.string().min(1).max(30).optional(),
    })
    .refine((d) => !d.updatedDate || d.updatedDate.valueOf() >= d.pubDate.valueOf(), {
      message: 'updatedDate must be on or after pubDate',
      path: ['updatedDate'],
    });

// English section (/reviews/): AI coding / developer tools.
const reviews = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/reviews' }),
  schema: reviewSchema({ title: [10, 70], description: [50, 200] }),
});

// Japanese section (/ja/reviews/): Japanese AI/SaaS tool reviews (A8.net affiliate targets).
const jaReviews = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/ja-reviews' }),
  schema: reviewSchema({ title: [10, 60], description: [40, 140] }),
});

export const collections = { reviews, jaReviews };
