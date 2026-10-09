import { asc } from "drizzle-orm";
import { db } from "@/db";
import { bundles, departments } from "@/db/schema";
import { BundlesManager } from "@/components/admin/BundlesManager";

export const dynamic = "force-dynamic";

export default async function BundlesPage() {
  const [allBundles, depts] = await Promise.all([
    db.select().from(bundles).orderBy(asc(bundles.sortOrder)),
    db.select().from(departments).orderBy(asc(departments.sortOrder)),
  ]);

  return <BundlesManager bundles={allBundles} departments={depts} />;
}
