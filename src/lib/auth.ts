import "server-only";
import crypto from "node:crypto";
import { cookies } from "next/headers";

export const ADMIN_COOKIE = "asu_admin_session";
const SESSION_HOURS = 12;

function getPassword() {
  return process.env.ADMIN_PASSWORD || "asu2026";
}

function getSecret() {
  return process.env.AUTH_SECRET || getPassword() + "|asu-dentistry";
}

function sign(payload: string) {
  return crypto.createHmac("sha256", getSecret()).update(payload).digest("hex");
}

export function verifyAdminPassword(candidate: string) {
  // Hash both sides so comparison is constant-time regardless of input length
  const a = crypto.createHash("sha256").update(candidate).digest();
  const b = crypto.createHash("sha256").update(getPassword()).digest();
  return crypto.timingSafeEqual(a, b);
}

export function createSessionToken() {
  const exp = Date.now() + SESSION_HOURS * 3600 * 1000;
  const payload = String(exp);
  return `${payload}.${sign(payload)}`;
}

export function isValidSession(token: string | undefined | null) {
  if (!token) return false;
  const [payload, sig] = token.split(".");
  if (!payload || !sig) return false;
  const exp = Number(payload);
  if (!Number.isFinite(exp) || exp < Date.now()) return false;
  const expected = sign(payload);
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

/** Use in server components/pages — returns true when an admin session exists */
export async function isAdminAuthed() {
  const store = await cookies();
  return isValidSession(store.get(ADMIN_COOKIE)?.value);
}

/** Lightweight in-memory rate limiting for the login endpoint */
const attempts = new Map<string, { count: number; reset: number }>();
export function loginAllowed(ip: string) {
  const now = Date.now();
  const rec = attempts.get(ip);
  if (!rec || rec.reset < now) {
    attempts.set(ip, { count: 1, reset: now + 10 * 60 * 1000 });
    return true;
  }
  rec.count += 1;
  return rec.count <= 10;
}
