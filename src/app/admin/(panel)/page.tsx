import { desc } from "drizzle-orm";
import { db } from "@/db";
import { orders } from "@/db/schema";
import { OrdersDashboard, type SerializedOrder } from "@/components/admin/OrdersDashboard";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const rows = await db.select().from(orders).orderBy(desc(orders.createdAt)).limit(500);

  const serialized: SerializedOrder[] = rows.map((o) => ({
    id: o.id,
    name: o.name,
    section: o.section,
    phone: o.phone,
    items: o.items,
    total: o.total,
    status: o.status,
    createdAt: o.createdAt.toISOString(),
  }));

  const stats = {
    total: rows.length,
    pending: rows.filter((r) => r.status === "pending").length,
    contacted: rows.filter((r) => r.status === "contacted").length,
    completed: rows.filter((r) => r.status === "completed").length,
    revenueAll: rows.reduce((s, r) => s + r.total, 0),
    revenueDone: rows.filter((r) => r.status === "completed").reduce((s, r) => s + r.total, 0),
  };

  return <OrdersDashboard orders={serialized} stats={stats} />;
}
