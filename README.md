# Demand System

Internal requirement visualization system built with Next.js 16, Prisma 7, MySQL, and the App Router.

## First local startup

Run these commands in order after a fresh clone or after cleaning generated artifacts:

```bash
npm install
npm run db:generate
npm run db:migrate:dev
npm run db:seed
npm run dev
```

Before the first MySQL startup, set `DATABASE_URL` to a local or disposable MySQL instance. Do not point development commands at the Tencent Cloud production database.

## Database workflow

- Production target: MySQL
- Runtime Prisma client: generated `PrismaClient` with `@prisma/adapter-mariadb`
- Migration flow: `prisma migrate dev` for local development and `prisma migrate deploy` for server deployment
- Prototype-only escape hatch: `npm run db:push:prototype` for disposable local databases only
- Archived SQLite migrations live under `prisma/migrations_archive/sqlite`

If you need to rebuild local demo data on a disposable database, run:

```bash
npm run db:reset:local
```

## Prisma generate flow

- The Prisma generator is `prisma-client`.
- Generated output is `generated/prisma`.
- Runtime code imports Prisma from `@/generated/prisma/client`.
- `prisma/seed.ts` imports Prisma from `../generated/prisma/client` so seed does not depend on runtime alias resolution.
- Runtime and seed both use the generated Prisma client with `@prisma/adapter-mariadb`.

See `docs/prisma-generate-checklist.md` for the full generate acceptance checklist.
