import { c as createAstro, a as createComponent, r as renderTemplate, b as renderComponent, $ as $$BaseHead, d as renderHead, e as $$Header, f as renderSlot, T as TWITTER, G as GITHUB, L as LINKEDIN, g as $$Footer } from '../entry.mjs';
import 'html-escaper';
import '@astrojs/netlify/netlify-functions.js';
import 'react';
import 'react-dom/server';
import 'mime';
import 'sharp';
/* empty css                         *//* empty css                                          */import '@headlessui/react';
import '@splitbee/web';
import 'react/jsx-runtime';
import 'http-cache-semantics';
import 'kleur/colors';
import 'node:fs/promises';
import 'node:os';
import 'node:path';
import 'node:url';
import 'magic-string';
import 'node:stream';
import 'slash';
import 'image-size';
import '@prisma/client';
import 'date-fns';
/* empty css                              */import '@astrojs/rss';
import 'buffer';
import 'stream';
import 'util';
import 'crypto';
import 'url';
import 'http';
import 'assert';
import 'querystring';
import 'zlib';
import 'https';
import 'events';
import 'v8';
import 'cookie';
import 'string-width';
import 'path-browserify';
import 'path-to-regexp';

const $$Astro = createAstro("/Users/chrisrussell/portfolio/src/layouts/BlogPost.astro", "https://www.chrisrusselljr.com/", "file:///Users/chrisrussell/portfolio/");
const $$BlogPost = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$BlogPost;
  const {
    content: { title, description, pubDate, readingTime }
  } = Astro2.props;
  return renderTemplate`<html lang="en">
  <head>
    ${renderComponent($$result, "BaseHead", $$BaseHead, { "title": title, "description": description })}
  ${renderHead($$result)}</head>
  

  <body>
    ${renderComponent($$result, "Header", $$Header, {})}
    <main>
      <article>
        <div data-animate style="--stagger:1">
        <h1>${title}</h1>

        <div class="pt-4 text-neutral-200">
          <div class="flex gap-x-2 items-center">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"></path>
            </svg>

            <time class="text-base">${pubDate}</time>
          </div>

          <div class="flex gap-x-2 items-center">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>

            <span class="text-base">${readingTime}</span>
          </div>
        </div>
        <hr class="border-t border-t-neutral-700 my-8">
      </div>
        <div data-animate style="--stagger:2">
          ${renderSlot($$result, $$slots["default"])}
        </div>
         
        
      </article>
    </main>
    ${renderComponent($$result, "Footer", $$Footer, { "twitter": TWITTER, "github": GITHUB, "linkedin": LINKEDIN, "animate": 3 })}
  </body></html>`;
});

const $$file = "/Users/chrisrussell/portfolio/src/layouts/BlogPost.astro";
const $$url = undefined;

export { $$BlogPost as default, $$file as file, $$url as url };
