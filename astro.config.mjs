import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import tailwind from "@astrojs/tailwind";
import react from "@astrojs/react";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import { remarkReadingTime } from "./src/utils/reading-time.mjs";

// https://astro.build/config

// https://astro.build/config

// https://astro.build/config

// https://astro.build/config
import netlify from "@astrojs/netlify";

// https://astro.build/config

// https://astro.build/config
export default defineConfig({
  output: "hybrid",
  adapter: netlify({
    edgeMiddleware: true
  }),
  site: "https://www.chrisrusselljr.com",
  markdown: {
    extendDefaultPlugins: true,
    rehypePlugins: [rehypeAutolinkHeadings],
    remarkPlugins: [remarkReadingTime],
    shikiConfig: {
      theme: "vitesse-dark"
    }
  },
  integrations: [mdx(), sitemap({
    customPages: ["https://www.chrisrusselljr.com/blog",
     "https://www.chrisrusselljr.com/guestbook",
    "https://www.chrisrusselljr.com/blog/empowerment", "https://www.chrisrusselljr.com/blog/five-tips-for-effective-team-members", "https://www.chrisrusselljr.com/blog/dont-ask-for-feedback"]
  }), tailwind({
    // Example: Disable injecting a basic `base.css` import on every page.
    // Useful if you need to define and/or import your own custom `base.css`.
    applyBaseStyles: false
  }), react()],
  prefetch: {
    prefetchAll: true,
    defaultStrategy: "viewport"
  },
  build: {
  },
  vite: {
    ssr: {
      noExternal: ['path-to-regexp'],
    },
  },
});