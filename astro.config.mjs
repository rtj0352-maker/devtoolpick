// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Set SITE_URL at build time for GitHub Pages, e.g.:
// SITE_URL=https://rtj0352-maker.github.io/devtoolpick npm run build
const site = process.env.SITE_URL || 'https://rtj0352-maker.github.io/devtoolpick';
const base = process.env.BASE_PATH || '/devtoolpick';

export default defineConfig({
  site,
  base,
  integrations: [sitemap()],
  markdown: {
    shikiConfig: {
      theme: 'github-dark',
    },
  },
});
