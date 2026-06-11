import { SignJWT, jwtVerify } from "jose";
import bcrypt from "bcryptjs";

/**
 * Lightweight single-admin auth. Credentials come from env:
 *   ADMIN_USERNAME       (default "tommy")
 *   ADMIN_PASSWORD_HASH  (bcrypt hash) — preferred
 *   ADMIN_PASSWORD       (plaintext)   — dev convenience fallback
 *   AUTH_SECRET          (JWT signing secret)
 *
 * The session is a JWT in an httpOnly cookie. Token verification (jose) is
 * edge-safe so middleware can guard /admin; credential checking (bcrypt) runs
 * in the Node server action only.
 */

export const SESSION_COOKIE = "tt_session";
const MAX_AGE = 60 * 60 * 24 * 7; // 7 days

function secret() {
  return new TextEncoder().encode(
    process.env.AUTH_SECRET ?? "dev-insecure-secret-change-me"
  );
}

export function adminUsername() {
  return process.env.ADMIN_USERNAME ?? "tommy";
}

export async function verifyCredentials(username: string, password: string) {
  if (username !== adminUsername()) return false;
  const hash = process.env.ADMIN_PASSWORD_HASH;
  if (hash) return bcrypt.compare(password, hash);
  const plain = process.env.ADMIN_PASSWORD ?? "tommytrash"; // dev default
  return password === plain;
}

export async function createSessionToken(username: string) {
  return new SignJWT({ username, role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${MAX_AGE}s`)
    .sign(secret());
}

export async function verifySessionToken(token: string | undefined | null) {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secret());
    return payload as { username: string; role: string };
  } catch {
    return null;
  }
}

/** Server-component / action helper: read the current session from cookies. */
export async function getSession() {
  const { cookies } = await import("next/headers");
  const jar = await cookies();
  return verifySessionToken(jar.get(SESSION_COOKIE)?.value);
}

export const SESSION_MAX_AGE = MAX_AGE;
