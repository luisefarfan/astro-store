// @ts-check
import { defineConfig } from 'astro/config';

import tailwind from '@astrojs/tailwind';
// import netlify from '@astrojs/netlify';

import db from '@astrojs/db';

import auth from 'auth-astro';

import react from '@astrojs/react';

import cloudflare from '@astrojs/cloudflare';

// https://astro.build/config
export default defineConfig({
  output: 'server',

  // adapter: netlify()
  integrations: [tailwind(), db(), auth(), react()],

  adapter: cloudflare(),

  vite: {
    ssr: {
      external: ['bcryptjs'],
    },
  },
});
