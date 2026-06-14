import { config } from "dotenv";
import { defineConfig } from "prisma/config";

// Load .env.local so Prisma CLI picks up DATABASE_URL and DIRECT_URL
config({ path: ".env.local" });

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    // Use the session pooler (:5432, DIRECT_URL) for the CLI: prisma migrate/push need a
    // direct/session connection — the transaction pooler (:6543, pgbouncer) can't run migrations.
    // At this project's scale the session pooler is fine for runtime too (see lib/db/client.ts).
    url: process.env["DIRECT_URL"]!,
  },
});
