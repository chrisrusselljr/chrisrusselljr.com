import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import tailwind from "@astrojs/tailwind";
import react from "@astrojs/react";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import { remarkReadingTime } from "./src/utils/reading-time.mjs";

// https://astro.build/config
import prefetch from "@astrojs/prefetch";

// https://astro.build/config

// https://astro.build/config
import image from "@astrojs/image";

// https://astro.build/config

// https://astro.build/config
export default defineConfig({
  site: "https://www.chrisrusselljr.com",
  markdown: {
    extendDefaultPlugins: true,
    rehypePlugins: [rehypeAutolinkHeadings],
    remarkPlugins: [remarkReadingTime],
    shikiConfig: {
      theme: "vitesse-dark"
    }
  },
  integrations: [mdx(), sitemap(), tailwind(), react(), prefetch(), image({
    serviceEntryPoint: '@astrojs/image/sharp'
  })]
  
});