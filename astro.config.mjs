// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

const site = process.env.SITE_URL || 'https://rtj0352-maker.github.io/devtoolpick';
let base = process.env.BASE_PATH || '/devtoolpick';
if (!base.endsWith('/')) base = `${base}/`;

export default defineConfig({
  site,
  base,
  trailingSlash: 'always',
  integrations: [sitemap()],
  markdown: {
    shikiConfig: {
      theme: 'github-dark',
    },
  },
});
