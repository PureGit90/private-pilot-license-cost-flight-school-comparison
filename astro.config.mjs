import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  // /publish-directory updates this to the approved domain before the
  // production build, once GATE has approved one (see build-metadata's
  // `domain` field) — it stays a placeholder through build and preview.
  site: 'https://example.com',
  integrations: [sitemap()],
});
