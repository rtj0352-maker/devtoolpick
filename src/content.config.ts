import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const reviewSchema = z.object({
  title: z.string(),
  description: z.string(),
  pubDate: z.coerce.date(),
  updatedDate: z.coerce.date().optional(),
  author: z.string().default('DevToolPick Editorial'),
  tags: z.array(z.string()).default([]),
  draft: z.boolean().default(false),
  heroLabel: z.string().optional(),
});

const reviews = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/reviews' }),
  schema: reviewSchema,
});

// Japanese section (/ja/): Japanese AI/SaaS tool reviews (A8.net affiliate targets)
const jaReviews = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/ja-reviews' }),
  schema: reviewSchema,
});

export const collections = { reviews, jaReviews };
