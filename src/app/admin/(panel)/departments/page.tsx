import { asc } from "drizzle-orm";
import { db } from "@/db";
import { bundles, departments } from "@/db/schema";
import { DepartmentsManager } from "@/components/admin/DepartmentsManager";

export const dynamic = "force-dynamic";

export default async function DepartmentsPage() {
  const [depts, allBundles] = await Promise.all([
    db.select().from(departments).orderBy(asc(departments.sortOrder)),
    db.select({ departmentId: bundles.departmentId }).from(bundles),
  ]);

  const counts = new Map<number, number>();
  for (const b of allBundles) {
    if (b.departmentId) counts.set(b.departmentId, (counts.get(b.departmentId) ?? 0) + 1);
  }

  return (
    <DepartmentsManager
      departments={depts.map((d) => ({ ...d, bundleCount: counts.get(d.id) ?? 0 }))}
    />
  );
}
