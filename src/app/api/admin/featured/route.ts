import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { featuredOffer } from "@/db/schema";
import { bool, num, requireAdmin, str } from "@/lib/api-guard";

export async function PUT(req: NextRequest) {
  const deny = await requireAdmin();
  if (deny) return deny;

  let b: Record<string, unknown>;
  try {
    b = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "bad_json" }, { status: 400 });
  }

  const values = {
    enabled: bool(b.enabled, true),
    badgeEn: str(b.badgeEn, 120),
    badgeAr: str(b.badgeAr, 120),
    titleEn: str(b.titleEn, 200),
    titleAr: str(b.titleAr, 200),
    descEn: str(b.descEn),
    descAr: str(b.descAr),
    includesEn: str(b.includesEn, 4000),
    includesAr: str(b.includesAr, 4000),
    footnoteEn: str(b.footnoteEn, 300),
    footnoteAr: str(b.footnoteAr, 300),
    price: Math.max(0, num(b.price)),
    oldPrice: b.oldPrice === null || b.oldPrice === "" || b.oldPrice === undefined ? null : Math.max(0, num(b.oldPrice)),
    updatedAt: new Date(),
  };

  const existing = await db.select({ id: featuredOffer.id }).from(featuredOffer).limit(1);
  if (existing[0]) {
    await db.update(featuredOffer).set(values).where(eq(featuredOffer.id, existing[0].id));
  } else {
    await db.insert(featuredOffer).values(values);
  }

  return NextResponse.json({ ok: true });
}
