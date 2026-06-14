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
    // DATABASE_URL is the pooler URL (pgbouncer :6543)
    // DIRECT_URL (:5432) is used by migrate/push — passed separately via env at migration time
    url: process.env["DATABASE_URL"]!,
  },
});
