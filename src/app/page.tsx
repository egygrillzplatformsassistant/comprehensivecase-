import { getSiteData } from "@/lib/site-data";
import HomeApp from "@/components/home/HomeApp";

export const dynamic = "force-dynamic";

export default async function Home() {
  const data = await getSiteData();
  return <HomeApp data={data} />;
}
