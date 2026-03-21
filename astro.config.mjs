import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://rojadirectaenvivo.top',
  integrations: [
    tailwind(),
    sitemap({
      changefreq: 'daily',
      priority: 0.8,
      lastmod: new Date(),
    }),
  ],
  output: 'static',
  build: {
    format: 'directory',
  },
});
