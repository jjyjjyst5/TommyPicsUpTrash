import type { Config } from "drizzle-kit";

/**
 * Used to generate SQL migrations for production (Neon). Local dev bootstraps
 * the schema automatically in db/index.ts, so this is only needed when you
 * want versioned migrations: `npx drizzle-kit generate`.
 */
export default {
  schema: "./db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL ?? "postgres://localhost:5432/tommytrash",
  },
} satisfies Config;
