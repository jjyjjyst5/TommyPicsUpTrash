import * as schema from "./schema";

/**
 * Database connection.
 *
 * Local dev  -> PGlite (in-process Postgres, file-backed at ./.pglite).
 * Production -> Neon Postgres when DATABASE_URL is set.
 *
 * Both speak the Postgres dialect, so the Drizzle schema and queries are
 * identical — deploying is a driver swap, not a rewrite.
 */

type DrizzleDb = import("drizzle-orm/pglite").PgliteDatabase<typeof schema>;

const globalForDb = globalThis as unknown as {
  __db?: DrizzleDb;
  __dbReady?: Promise<DrizzleDb>;
};

// Idempotent schema bootstrap — keeps local dev frictionless without a
// migration step. For Neon, `drizzle-kit` migrations can be used instead,
// but running this is harmless (IF NOT EXISTS).
const BOOTSTRAP_STATEMENTS = [
  `CREATE TABLE IF NOT EXISTS water_bodies (
    id SERIAL PRIMARY KEY,
    slug TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    location TEXT NOT NULL,
    blurb TEXT NOT NULL DEFAULT '',
    lbs_per_bag DOUBLE PRECISION NOT NULL DEFAULT 20,
    start_date DATE,
    bottles_estimate INTEGER NOT NULL DEFAULT 0,
    kayak_trips INTEGER NOT NULL DEFAULT 0,
    accent_color TEXT NOT NULL DEFAULT '#0ea5e9',
    sort_order INTEGER NOT NULL DEFAULT 0
  )`,
  `CREATE TABLE IF NOT EXISTS cleanups (
    id SERIAL PRIMARY KEY,
    water_body_id INTEGER NOT NULL REFERENCES water_bodies(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    bags INTEGER NOT NULL DEFAULT 0,
    bottles INTEGER NOT NULL DEFAULT 0,
    pounds DOUBLE PRECISION,
    source TEXT NOT NULL DEFAULT 'manual',
    tweet_url TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
  )`,
  `CREATE TABLE IF NOT EXISTS gallery_images (
    id SERIAL PRIMARY KEY,
    url TEXT NOT NULL,
    caption TEXT NOT NULL DEFAULT '',
    water_body_id INTEGER REFERENCES water_bodies(id) ON DELETE SET NULL,
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
  )`,
  `CREATE TABLE IF NOT EXISTS admin_account (
    id SERIAL PRIMARY KEY,
    username TEXT NOT NULL,
    password_hash TEXT NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
  )`,
  `CREATE TABLE IF NOT EXISTS press_items (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    outlet TEXT NOT NULL,
    type TEXT NOT NULL DEFAULT 'article',
    url TEXT,
    published_date DATE,
    excerpt TEXT NOT NULL DEFAULT '',
    audio_embed_url TEXT,
    transcript TEXT,
    sort_order INTEGER NOT NULL DEFAULT 0
  )`,
];

async function init(): Promise<DrizzleDb> {
  if (process.env.DATABASE_URL) {
    const { drizzle } = await import("drizzle-orm/neon-http");
    const { neon } = await import("@neondatabase/serverless");
    const sql = neon(process.env.DATABASE_URL);
    for (const stmt of BOOTSTRAP_STATEMENTS) await sql.query(stmt);
    return drizzle(sql, { schema }) as unknown as DrizzleDb;
  }
  const { drizzle } = await import("drizzle-orm/pglite");
  const { PGlite } = await import("@electric-sql/pglite");
  const client = new PGlite(process.env.PGLITE_DIR ?? ".pglite");
  for (const stmt of BOOTSTRAP_STATEMENTS) await client.exec(stmt);
  return drizzle(client, { schema });
}

export async function getDb(): Promise<DrizzleDb> {
  if (globalForDb.__db) return globalForDb.__db;
  if (!globalForDb.__dbReady) {
    globalForDb.__dbReady = init().then((db) => {
      globalForDb.__db = db;
      return db;
    });
  }
  return globalForDb.__dbReady;
}

export { schema };
