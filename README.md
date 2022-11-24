# Portfolio 
Personal blog of Chris Russell Jr. made made using [Astro](https://astro.build).

## Set Up
```sh 
npm i
npm run dev 
```

## 2022/2023 Planning

To do:
- [X] Improve SEO (title & description)
- [X] Add socials to footer
- [X] Add images to blog posts
- [X] Refine blog format (slug, image, draft, image preview/thumbnail, tags)
- [ ] Do actual full stack projects
- [ ] Add download resume button
- [X] Convert exisitng blog posts
- [ ] Re-do banner
- [X] Smoothing

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
```
