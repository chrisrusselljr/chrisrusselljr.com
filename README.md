# Portfolio

Personal blog of Chris Russell Jr. made made using [Astro](https://astro.build). Inspired by Nexxel's work [here](https://github.com/nexxeln/nexxel.dev).

## Make it Work

```sh
npm i
npm run dev
```

## Planning

Post Ideas

- [ ] naive with managers (failure to be rude in conversation)
- [ ] knowing your true north (learning, being challenged)

Project Ideas

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
```
