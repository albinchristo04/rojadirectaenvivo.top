import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://rojadirectaenvivo.top',
  integrations: [
    tailwind(),
    sitemap({
      lastmod: new Date(),
      serialize(item) {
        const url = item.url;
        if (url === 'https://rojadirectaenvivo.top/' || url === 'https://rojadirectaenvivo.top') {
          item.changefreq = 'always';
          item.priority = 1.0;
        } else if (url.includes('/hoy') || url.includes('/futbol-libre') || url.includes('/futbol-en-vivo') || url.includes('/partidos-de-hoy') || url.includes('/ver-futbol')) {
          item.changefreq = 'always';
          item.priority = 0.9;
        } else if (url.includes('/rojadirecta-en-vivo') || url.includes('/tarjeta-roja') || url.includes('/pirlo-tv')) {
          item.changefreq = 'daily';
          item.priority = 0.85;
        } else if (url.includes('/liga/')) {
          item.changefreq = 'daily';
          item.priority = 0.8;
        } else if (url.includes('/equipo/')) {
          item.changefreq = 'daily';
          item.priority = 0.7;
        } else if (url.includes('/partido/')) {
          item.changefreq = 'hourly';
          item.priority = 0.6;
        } else {
          item.changefreq = 'weekly';
          item.priority = 0.5;
        }
        return item;
      }
    }),
  ],
  output: 'static',
  build: {
    format: 'directory',
  },
});
