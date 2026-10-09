import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { bundles } from "@/db/schema";
import { bool, num, requireAdmin, str } from "@/lib/api-guard";

export function bundleValues(b: Record<string, unknown>) {
  const highlighted = bool(b.highlighted);
  const departmentId = highlighted ? null : num(b.departmentId, 0) || null;
  return {
    highlighted,
    departmentId,
    nameEn: str(b.nameEn, 150),
    nameAr: str(b.nameAr, 150),
    descEn: str(b.descEn, 300),
    descAr: str(b.descAr, 300),
    badgeEn: str(b.badgeEn, 80),
    badgeAr: str(b.badgeAr, 80),
    featuresEn: str(b.featuresEn, 4000),
    featuresAr: str(b.featuresAr, 4000),
    price: Math.max(0, num(b.price)),
    oldPrice: b.oldPrice === null || b.oldPrice === "" || b.oldPrice === undefined ? null : Math.max(0, num(b.oldPrice)),
    sortOrder: num(b.sortOrder),
    active: bool(b.active, true),
  };
}

export async function POST(req: NextRequest) {
  const deny = await requireAdmin();
  if (deny) return deny;

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

  const [row] = await db.insert(bundles).values(values).returning();
  return NextResponse.json({ ok: true, bundle: row });
}
