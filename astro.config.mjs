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
  // Moved PHP news out of /reviews/ (Oct 23, 2026). Static meta-refresh redirects with canonical.
  redirects: {
    '/reviews/php2shell-cve-2026-109618-109619-facts': `${base}news/php2shell-cve-2026-109618-109619-facts/`,
    '/reviews/how-to-check-and-upgrade-php-version-safely': `${base}news/how-to-check-and-upgrade-php-version-safely/`,
    '/reviews/php-supported-versions-eol-2026': `${base}news/php-supported-versions-eol-2026/`,
    '/ja/reviews/php2shell-php-rce-2026': `${base}ja/news/php2shell-php-rce-2026/`,
  },
  integrations: [sitemap({ filter: (page) => !/\/reviews\/(php2shell|how-to-check-and-upgrade-php|php-supported)/.test(page) })],
  markdown: {
    shikiConfig: {
      theme: 'github-dark',
    },
  },
});
