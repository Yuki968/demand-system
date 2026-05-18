# Demand System

Internal requirement visualization system built with Next.js 16, Prisma 7, SQLite, and the App Router.

## First local startup

Run these commands in order after a fresh clone or after cleaning generated artifacts:

```bash
npm install
npm run db:generate
npm run db:push
npm run db:seed
npm run dev
```

If you only need to rebuild local demo data, run:

```bash
npm run db:refresh
```

## Prisma generate flow

- The Prisma generator is `prisma-client`.
- Generated output is `generated/prisma`.
- Runtime code imports Prisma from `@/generated/prisma/client`.
- `prisma/seed.ts` imports Prisma from `../generated/prisma/client` so seed does not depend on runtime alias resolution.
- SQLite connections use `@prisma/adapter-better-sqlite3`.

See `docs/prisma-generate-checklist.md` for the full generate acceptance checklist.
