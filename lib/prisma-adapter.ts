import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

import { getDatabaseUrl } from "@/lib/env";

export function createSqliteAdapter() {
  return new PrismaBetterSqlite3(
    {
      url: getDatabaseUrl(),
    },
    {
      timestampFormat: "unixepoch-ms",
    },
  );
}
