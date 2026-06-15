import "server-only";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { getDb, schema } from "@/db";

/**
 * DB-backed single-admin credentials, so the password is changeable in-app.
 *
 * The single `admin_account` row is the source of truth. On first use it is
 * seeded from env (ADMIN_USERNAME + ADMIN_PASSWORD_HASH, or ADMIN_PASSWORD for
 * local dev). After that, changes happen through the admin Account page.
 */

const DEFAULT_USERNAME = process.env.ADMIN_USERNAME ?? "tommy";

async function initialHash(): Promise<string> {
  if (process.env.ADMIN_PASSWORD_HASH) return process.env.ADMIN_PASSWORD_HASH;
  // Local-dev fallback only — production always has ADMIN_PASSWORD_HASH set.
  const plain = process.env.ADMIN_PASSWORD ?? "changeme";
  return bcrypt.hash(plain, 10);
}

/** Return the single admin row, creating it from env on first call. */
export async function ensureAdminAccount() {
  const db = await getDb();
  const rows = await db.select().from(schema.adminAccount).limit(1);
  if (rows[0]) return rows[0];
  const [created] = await db
    .insert(schema.adminAccount)
    .values({ username: DEFAULT_USERNAME, passwordHash: await initialHash() })
    .returning();
  return created;
}

export async function getAdminUsername(): Promise<string> {
  return (await ensureAdminAccount()).username;
}

export async function verifyCredentials(username: string, password: string): Promise<boolean> {
  const account = await ensureAdminAccount();
  if (username !== account.username) return false;
  return bcrypt.compare(password, account.passwordHash);
}

/** Change username and/or password. Returns an error message or null on success. */
export async function updateCredentials(opts: {
  currentPassword: string;
  newUsername?: string;
  newPassword?: string;
}): Promise<string | null> {
  const account = await ensureAdminAccount();
  const ok = await bcrypt.compare(opts.currentPassword, account.passwordHash);
  if (!ok) return "Current password is incorrect.";

  const set: { username?: string; passwordHash?: string; updatedAt: Date } = {
    updatedAt: new Date(),
  };
  if (opts.newUsername && opts.newUsername.trim()) set.username = opts.newUsername.trim();
  if (opts.newPassword) {
    if (opts.newPassword.length < 8) return "New password must be at least 8 characters.";
    set.passwordHash = await bcrypt.hash(opts.newPassword, 10);
  }

  const db = await getDb();
  await db.update(schema.adminAccount).set(set).where(eq(schema.adminAccount.id, account.id));
  return null;
}
