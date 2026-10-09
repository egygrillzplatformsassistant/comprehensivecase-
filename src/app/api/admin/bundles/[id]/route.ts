import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { bundles } from "@/db/schema";
import { requireAdmin } from "@/lib/api-guard";
import { bundleValues } from "../route";

type Ctx = { params: Promise<{ id: string }> };

export async function PUT(req: NextRequest, ctx: Ctx) {
  const deny = await requireAdmin();
  if (deny) return deny;
  const { id } = await ctx.params;
  const bundleId = Number(id);
  if (!Number.isInteger(bundleId)) {
    return NextResponse.json({ ok: false, error: "bad_id" }, { status: 400 });
  }

  let b: Record<string, unknown>;
  try {
    b = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "bad_json" }, { status: 400 });
  }

  const values = bundleValues(b);
  if (!values.nameEn || !values.nameAr) {
    return NextResponse.json({ ok: false, error: "name_required" }, { status: 400 });
  }

  const [row] = await db.update(bundles).set(values).where(eq(bundles.id, bundleId)).returning();
  return NextResponse.json({ ok: true, bundle: row });
}

export async function DELETE(_req: NextRequest, ctx: Ctx) {
  const deny = await requireAdmin();
  if (deny) return deny;
  const { id } = await ctx.params;
  const bundleId = Number(id);
  if (!Number.isInteger(bundleId)) {
    return NextResponse.json({ ok: false, error: "bad_id" }, { status: 400 });
  }
  await db.delete(bundles).where(eq(bundles.id, bundleId));
  return NextResponse.json({ ok: true });
}
