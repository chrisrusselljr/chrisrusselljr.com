import rss from "@astrojs/rss";

export const GET = () =>
  rss({
    // `<title>` field in output xml
    title: "chris russell jr • blog",
    // `<description>` field in output xml
    description: "Learnings of an aspiring engineer.",
    // base URL for RSS <item> links
    // SITE will use "site" from your project's astro.config.
    site: import.meta.env.SITE,
    // list of `<item>`s in output xml
    // simple example: generate items for every md file in /src/pages
    // see "Generating items" section for required frontmatter and advanced use cases
    items: import.meta.glob("./blog/**/*.{md,mdx}"),
    stylesheet: "/src/rss/styles.xsl",
  });
