import { NextRequest, NextResponse } from "next/server";
import { inArray, sql } from "drizzle-orm";
import { db } from "@/db";
import { bundles, departments, featuredOffer, orders, type OrderItem } from "@/db/schema";

/* naive in-memory rate limit: 6 orders / 10 min / IP */
const hits = new Map<string, { count: number; reset: number }>();
function allowed(ip: string) {
  const now = Date.now();
  const rec = hits.get(ip);
  if (!rec || rec.reset < now) {
    hits.set(ip, { count: 1, reset: now + 10 * 60 * 1000 });
    return true;
  }
  rec.count += 1;
  return rec.count <= 6;
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "local";
  if (!allowed(ip)) {
    return NextResponse.json({ ok: false, error: "rate_limited" }, { status: 429 });
  }

  let body: { name?: string; section?: string; phone?: string; items?: string[] };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "bad_json" }, { status: 400 });
  }

  const name = (body.name ?? "").trim().slice(0, 100);
  const section = (body.section ?? "").trim().slice(0, 20);
  const phone = (body.phone ?? "").replace(/\s/g, "").slice(0, 20);
  const keys = Array.isArray(body.items) ? [...new Set(body.items)].slice(0, 20) : [];

  if (name.length < 3 || section.length === 0 || !/^01\d{9}$/.test(phone) || keys.length === 0) {
    return NextResponse.json({ ok: false, error: "invalid" }, { status: 400 });
  }

  /* resolve & re-price every key server-side (never trust the client) */
  const bundleIds = keys
    .filter((k) => k.startsWith("bundle:"))
    .map((k) => Number(k.slice(7)))
    .filter((n) => Number.isInteger(n) && n > 0);

  const [bundleRows, featuredRows] = await Promise.all([
    bundleIds.length
      ? db.select().from(bundles).where(inArray(bundles.id, bundleIds))
      : Promise.resolve([]),
    keys.includes("featured")
      ? db.select().from(featuredOffer).where(sql`${featuredOffer.enabled} = true`).limit(1)
      : Promise.resolve([]),
  ]);

  const deptIds = [...new Set(bundleRows.map((b) => b.departmentId).filter(Boolean))] as number[];
  const deptRows = deptIds.length
    ? await db.select().from(departments).where(inArray(departments.id, deptIds))
    : [];

  const items: OrderItem[] = [];
  for (const b of bundleRows) {
    if (!b.active) continue;
    const dept = b.departmentId ? deptRows.find((d) => d.id === b.departmentId) : undefined;
    items.push({
      key: `bundle:${b.id}`,
      nameEn: b.nameEn,
      nameAr: b.nameAr,
      price: b.price,
      deptEn: dept?.nameEn ?? (b.highlighted ? "Bundle Deal" : undefined),
      deptAr: dept?.nameAr ?? (b.highlighted ? "عرض موفّر" : undefined),
    });
  }
  if (featuredRows[0]) {
    items.push({
      key: "featured",
      nameEn: featuredRows[0].titleEn,
      nameAr: featuredRows[0].titleAr,
      price: featuredRows[0].price,
      deptEn: "Special Offer",
      deptAr: "عرض خاص",
    });
  }

  if (items.length === 0) {
    return NextResponse.json({ ok: false, error: "empty" }, { status: 400 });
  }

  const total = items.reduce((s, i) => s + i.price, 0);

  const [row] = await db
    .insert(orders)
    .values({ name, section, phone, items, total, status: "pending" })
    .returning({ id: orders.id });

  return NextResponse.json({ ok: true, id: row.id });
}
