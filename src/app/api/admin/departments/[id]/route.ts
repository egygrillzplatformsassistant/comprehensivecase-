import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { departments } from "@/db/schema";
import { bool, num, requireAdmin, slugify, str } from "@/lib/api-guard";

type Ctx = { params: Promise<{ id: string }> };

export async function PUT(req: NextRequest, ctx: Ctx) {
  const deny = await requireAdmin();
  if (deny) return deny;
  const { id } = await ctx.params;
  const deptId = Number(id);
  if (!Number.isInteger(deptId)) {
    return NextResponse.json({ ok: false, error: "bad_id" }, { status: 400 });
  }

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
    .update(departments)
    .set({
      nameEn,
      nameAr,
      slug: str(b.slug, 80) || slugify(nameEn),
      icon: str(b.icon, 40) || "sparkles",
      sortOrder: num(b.sortOrder),
      active: bool(b.active, true),
    })
    .where(eq(departments.id, deptId))
    .returning();

  return NextResponse.json({ ok: true, department: row });
}

export async function DELETE(_req: NextRequest, ctx: Ctx) {
  const deny = await requireAdmin();
  if (deny) return deny;
  const { id } = await ctx.params;
  const deptId = Number(id);
  if (!Number.isInteger(deptId)) {
    return NextResponse.json({ ok: false, error: "bad_id" }, { status: 400 });
  }
  await db.delete(departments).where(eq(departments.id, deptId));
  return NextResponse.json({ ok: true });
}
