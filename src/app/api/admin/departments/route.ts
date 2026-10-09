import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { departments } from "@/db/schema";
import { bool, num, requireAdmin, slugify, str } from "@/lib/api-guard";

export async function POST(req: NextRequest) {
  const deny = await requireAdmin();
  if (deny) return deny;

  let b: Record<string, unknown>;
  try {
    b = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "bad_json" }, { status: 400 });
  }

  const nameEn = str(b.nameEn, 150);
  const nameAr = str(b.nameAr, 150);
  if (!nameEn || !nameAr) {
    return NextResponse.json({ ok: false, error: "name_required" }, { status: 400 });
  }

  const [row] = await db
    .insert(departments)
    .values({
      nameEn,
      nameAr,
      slug: str(b.slug, 80) || slugify(nameEn),
      icon: str(b.icon, 40) || "sparkles",
      sortOrder: num(b.sortOrder),
      active: bool(b.active, true),
    })
    .returning();

  return NextResponse.json({ ok: true, department: row });
}
