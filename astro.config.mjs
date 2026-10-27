// @ts-check
import { defineConfig, fontProviders } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import icon from 'astro-icon';
import checkOutput from './src/integrations/check-output.mjs';

// https://astro.build/config
export default defineConfig({
  site: 'https://jovanv123.github.io',

  vite: {
    plugins: [tailwindcss()]
  },

  // Icons: simple-icons (brands) and tabler (generic), inlined as SVG at build time.
  // checkOutput fails the build on broken internal links/assets or a rendered "TODO".
  integrations: [mdx(), sitemap(), icon(), checkOutput()],

  // Families match `typography` in src/data/site.yaml. Downloaded at build time and self-hosted.
  fonts: [
    {
      provider: fontProviders.google(),
      name: 'Geist',
      cssVariable: '--font-geist',
      weights: ['100 900'],
      fallbacks: ['sans-serif']
    },
    {
      provider: fontProviders.google(),
      name: 'Geist Mono',
      cssVariable: '--font-geist-mono',
      weights: ['100 900'],
      fallbacks: ['monospace']
    }
  ]
});
