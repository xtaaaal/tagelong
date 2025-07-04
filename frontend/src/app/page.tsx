import { getHomePageData } from "@/data/loaders";

import { HeroSection } from "@/components/custom/hero-section";
import { FeatureSection } from "@/components/custom/features-section";

export default async function Home() {
  const strapiData = await getHomePageData();
  const blocks = strapiData?.data?.attributes?.blocks || [];

  if (!blocks.length) {
    return (
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-6">Welcome to Tagelong</h1>
        <p className="text-lg mb-4">Your travel companion for amazing adventures.</p>
        <p className="text-lg">Start exploring our itineraries to plan your next journey.</p>
      </main>
    );
  }

  return (
    <main>
      {blocks.map((block: any) => {
        const Component = blockComponents[block.__component as keyof typeof blockComponents];
        return Component ? <Component key={block.id} data={block} /> : null;
      })}
    </main>
  );
}

const blockComponents = {
  "layout.hero-section": HeroSection,
  "layout.features-section": FeatureSection,
};