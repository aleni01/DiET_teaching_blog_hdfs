// @ts-check
// import { defineConfig } from 'astro/config';

// // https://astro.build/config
// export default defineConfig({});

import { defineConfig } from 'astro/config';

import react from '@astrojs/react';

import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  base: '/DiET_teaching_blog_hdfs/',
  trailingSlash: "always",
  integrations: [react()],

  vite: {
    plugins: [tailwindcss()]
  }
});