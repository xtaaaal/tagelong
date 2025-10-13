import { getHomePageData, getPopularItineraries } from "@/data/loaders";
import HomePageClient from "@/components/custom/homepage-client";

export default async function Home() {
  // Fetch itineraries data
  const itinerariesResponse = await getPopularItineraries(12);
  const itineraries = itinerariesResponse?.data || [];

  // If you still want to support the old block-based system, you can keep this
  // const strapiData = await getHomePageData();
  // const blocks = strapiData?.data?.attributes?.blocks || [];

  return <HomePageClient initialItineraries={itineraries} />;
}