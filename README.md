# Portfolio

Personal blog of Chris Russell Jr. made made using [Astro](https://astro.build).

## Set Up

```sh
npm i
npm run dev
```

## 2022/2023 Planning

To do:

- [x] Improve SEO (title & description)
- [x] Add socials to footer
- [x] Add images to blog posts
- [x] Refine blog format (slug, image, draft, image preview/thumbnail, tags)
- [ ] Do actual full stack projects
- [ ] Add download resume button
- [x] Convert exisitng blog posts
- [ ] Re-do banner
- [x] Smoothing

Post ideas

- [ ] naive with managers (failure to be rude in conversation)
- [ ] knowing your true north (learning, being challenged)

Project Ideas

- [ ] triple activity timer app (cr3ate)
- [ ] Book Review Log
- [ ] Total net worth tracker (Chase, Amex, USAA, Fidelity, Shareworks)
- [ ] Snake
- [ ] Tic tac toe

## Prisma Installation

```
# install
npm install prisma --save-dev
npx prisma init

# set up schema.prisma with
generator client {
  provider        = "prisma-client-js"
  previewFeatures = ["referentialIntegrity"]
}

datasource db {
  provider     = "mysql"
  url          = env("DATABASE_URL")
  relationMode = "prisma"
}

# push new schema
npx prisma db push

# Run prisma studio with
npx prisma studio

# New database schema
npx prisma migrate reset

# Re-push new schema
npx prisma db push
```
