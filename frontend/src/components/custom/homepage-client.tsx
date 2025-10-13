"use client";

import { useState } from "react";
import { SearchHero, type SearchFilters } from "@/components/custom/search-hero";
import { CategoryFilter } from "@/components/custom/category-filter";
import { PopularItineraries } from "@/components/custom/popular-itineraries";

interface HomePageClientProps {
  initialItineraries: any[];
}

export default function HomePageClient({ initialItineraries }: HomePageClientProps) {
  const [itineraries, setItineraries] = useState(initialItineraries);
  const [selectedCategory, setSelectedCategory] = useState("popular");
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({
    destination: "",
    duration: "any",
    category: "any",
  });
  const [loading, setLoading] = useState(false);

  const handleSearch = (filters: SearchFilters) => {
    setSearchFilters(filters);
    setSelectedCategory("popular"); // Reset category when searching
    // In a real app, you'd fetch filtered data here
    console.log("Search filters:", filters);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    // Reset search filters when changing category
    setSearchFilters({
      destination: "",
      duration: "any",
      category: "any",
    });
  };

  return (
    <main className="min-h-screen bg-navy-50">
      {/* Hero Section with Search */}
      <SearchHero onSearch={handleSearch} />
      
      {/* Category Filter */}
      <CategoryFilter 
        selectedCategory={selectedCategory}
        onCategoryChange={handleCategoryChange}
      />
      
      {/* Popular Itineraries Section */}
      <PopularItineraries 
        itineraries={itineraries}
        loading={loading}
        category={selectedCategory}
        searchFilters={searchFilters.destination || (searchFilters.category && searchFilters.category !== 'any') ? searchFilters : undefined}
      />
    </main>
  );
}
