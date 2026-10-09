import "server-only";
import { asc, eq } from "drizzle-orm";
import { db } from "@/db";
import { bundles, departments, featuredOffer, siteTexts } from "@/db/schema";
import type { SiteData, Texts } from "./types";

export async function getSiteData(): Promise<SiteData> {
  const [textRows, deptRows, bundleRows, featuredRows] = await Promise.all([
    db.select().from(siteTexts),
    db.select().from(departments).where(eq(departments.active, true)).orderBy(asc(departments.sortOrder)),
    db.select().from(bundles).where(eq(bundles.active, true)).orderBy(asc(bundles.sortOrder)),
    db.select().from(featuredOffer).limit(1),
  ]);

  const texts: Texts = {};
  for (const t of textRows) texts[t.key] = { en: t.valueEn, ar: t.valueAr };

  const depts = deptRows.map((d) => ({
    ...d,
    bundles: bundleRows.filter((b) => b.departmentId === d.id && !b.highlighted),
  }));

  const highlighted = bundleRows.filter((b) => b.highlighted);
  const featured = featuredRows.find((f) => f.enabled) ?? null;

  return { texts, departments: depts, highlighted, featured };
}
