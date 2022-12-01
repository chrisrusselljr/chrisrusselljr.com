# Portfolio

Personal website of Chris Russell Jr.

Made made using [Astro](https://astro.build).

Inspired by Nexxel's work [here](https://github.com/nexxeln/nexxel.dev).

## Setup

```sh
npm i
npm run dev
```

## Planning

Post Ideas

- [ ] naive with managers (failure to be rude in conversation)
- [ ] knowing your true north (learning, being challenged, when to move around)

Project Ideas

- [ ] Snake
- [ ] Tic tac toe

## Prisma Installation

```py
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

# Push new schema
npx prisma db push

# Run prisma studio with
npx prisma studio

# New database schema
npx prisma migrate reset

# Re-push updated schema
npx prisma db push
```

## Environment Variables (.env)

```sh
DATABASE_URL=
NODE_ENV =
JWT_SECRET =
PUBLIC_SIGN_IN_WITH_GOOGLE_CLIENT_ID =
SIGN_IN_WITH_GOOGLE_SECRET =
```
