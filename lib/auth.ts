import { SignJWT, jwtVerify } from "jose";

/**
 * Session/token helpers ONLY — deliberately edge-safe (jose, no DB, no bcrypt)
 * so `proxy.ts` middleware can import it. Credential checking lives in
 * `lib/adminAuth.ts` (DB-backed, Node-only). AUTH_SECRET signs the JWT.
 */

export const SESSION_COOKIE = "tt_session";
const MAX_AGE = 60 * 60 * 24 * 7; // 7 days

function secret() {
  return new TextEncoder().encode(
    process.env.AUTH_SECRET ?? "dev-insecure-secret-change-me"
  );
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
