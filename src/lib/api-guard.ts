import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { ADMIN_COOKIE, isValidSession } from "./auth";

/** Returns a 401 response when not authed, otherwise null (proceed). */
export async function requireAdmin(): Promise<NextResponse | null> {
  const store = await cookies();
  if (!isValidSession(store.get(ADMIN_COOKIE)?.value)) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }
  return null;
}

export function str(v: unknown, max = 2000): string {
  return typeof v === "string" ? v.slice(0, max).trim() : "";
}

export function num(v: unknown, fallback = 0): number {
  const n = Number(v);
  return Number.isFinite(n) ? Math.round(n) : fallback;
}

export function bool(v: unknown, fallback = false): boolean {
  if (typeof v === "boolean") return v;
  if (v === "true" || v === 1 || v === "1") return true;
  if (v === "false" || v === 0 || v === "0") return false;
  return fallback;
}

export function slugify(s: string) {
  const slug = s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return slug || `dept-${Date.now().toString(36)}`;
}
