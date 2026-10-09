import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { siteTexts } from "@/db/schema";
import { requireAdmin, str } from "@/lib/api-guard";

export async function PUT(req: NextRequest) {
  const deny = await requireAdmin();
  if (deny) return deny;

  let body: { updates?: Array<{ key?: string; group?: string; label?: string; valueEn?: string; valueAr?: string }> };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "bad_json" }, { status: 400 });
  }

  const updates = Array.isArray(body.updates) ? body.updates.slice(0, 300) : [];

  for (const u of updates) {
    const key = str(u.key, 100);
    if (!key) continue;
    await db
      .insert(siteTexts)
      .values({
        key,
        group: str(u.group, 60) || "general",
        label: str(u.label, 200),
        valueEn: str(u.valueEn, 4000),
        valueAr: str(u.valueAr, 4000),
      })
      .onConflictDoUpdate({
        target: [siteTexts.key],
        set: { valueEn: str(u.valueEn, 4000), valueAr: str(u.valueAr, 4000) },
      });
  }

  return NextResponse.json({ ok: true });
}
