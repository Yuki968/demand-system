# Prisma Generate Checklist

Use this checklist after Prisma changes, on a new Windows machine, or whenever generate/import issues appear.

## Project contract

- Schema file: `prisma/schema.prisma`
- Prisma config: `prisma.config.ts`
- Generator: `prisma-client`
- Output directory: `generated/prisma`
- Runtime import path: `@/generated/prisma/client`
- Seed import path: `../generated/prisma/client`
- Target database: MySQL
- Runtime client: generated `PrismaClient` with `@prisma/adapter-mariadb`
- Active migrations directory: `prisma/migrations`
- Archived SQLite migrations: `prisma/migrations_archive/sqlite`

## Acceptance items

1. Confirm `generated/prisma` exists after `npm run db:generate`.
2. Confirm `generated/prisma/client.ts` exists. The project import path stays `generated/prisma/client` and resolves to `client.ts`.
3. Confirm `PrismaClient` can be imported from runtime code and from `prisma/seed.ts`.
4. Confirm enums can be imported from `generated/prisma/client`: `RequirementStatus`, `RequirementType`, `RequirementBelong`, `PriorityLevel`, `StageName`, `YesNoOption`, and `FeedbackStatus`.
5. Confirm runtime code does not import from `@prisma/client`, `.prisma/client/default`, or any old `prisma-client-js` path.
6. Confirm `prisma.config.ts` still uses `migrations.seed = "tsx prisma/seed.ts"`.
7. Confirm both runtime and seed initialize through `@prisma/adapter-mariadb`, with no SQLite adapter import left in active runtime code.
8. Confirm `npm run db:generate` does not require any manual path edits afterward.
9. Confirm all import statements use forward slashes so Windows paths stay unambiguous.
10. Confirm a new clone can recover the Prisma chain against a disposable MySQL instance with:

```bash
npm install
npm run db:generate
npm run db:migrate:dev
npm run db:seed
```

11. Confirm `.gitignore` contains `/generated/prisma/` if generated output should stay out of version control.
12. Confirm the first active MySQL baseline migration is created before any production deploy attempt.

## Quick troubleshooting order

1. Check whether `generated/prisma/client.ts` exists.
2. Check whether `prisma/schema.prisma` still outputs to `../generated/prisma` and uses `provider = "mysql"`.
3. Check whether `prisma.config.ts` still provides `datasource.url` and `migrations.seed`.
4. Search for old Prisma imports:

```bash
rg "@prisma/adapter-better-sqlite3|better-sqlite3|\.prisma/client/default|prisma-client-js" lib prisma scripts --glob '!prisma/migrations_archive/**'
```

5. Recheck `lib/prisma.ts` and `prisma/seed.ts` together before changing any import path.
6. If migration history looks wrong, inspect `prisma/migrations/README.md` and confirm archived SQLite files were not moved back into the active MySQL directory.
