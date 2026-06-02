import { PrismaMariaDb } from "@prisma/adapter-mariadb";

import { getDatabaseUrl } from "@/lib/env";

export function createMysqlAdapter() {
  return new PrismaMariaDb(getDatabaseUrl());
}
