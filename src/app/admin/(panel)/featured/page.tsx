import { db } from "@/db";
import { featuredOffer } from "@/db/schema";
import { FeaturedForm } from "@/components/admin/FeaturedForm";

export const dynamic = "force-dynamic";

export default async function FeaturedPage() {
  const rows = await db.select().from(featuredOffer).limit(1);
  return <FeaturedForm offer={rows[0] ?? null} />;
}
