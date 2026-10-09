import { db } from "@/db";
import { siteTexts } from "@/db/schema";
import { ContentEditor } from "@/components/admin/ContentEditor";

export const dynamic = "force-dynamic";

export default async function ContentPage() {
  const rows = await db.select().from(siteTexts);
  rows.sort((a, b) => a.group.localeCompare(b.group) || a.key.localeCompare(b.key));
  return <ContentEditor rows={rows} />;
}
