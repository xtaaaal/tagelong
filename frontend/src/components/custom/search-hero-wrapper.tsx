"use client";

import { SearchHero } from "./search-hero";

export function SearchHeroWrapper() {
  const handleSearch = (filters: any) => {
    // Handle search functionality - redirect to homepage with filters
    const searchParams = new URLSearchParams();
    if (filters.destination) searchParams.set('query', filters.destination);
    if (filters.category) searchParams.set('category', filters.category);
    if (filters.duration) searchParams.set('duration', filters.duration);
    
    window.location.href = `/?${searchParams.toString()}`;
  };

  return <SearchHero onSearch={handleSearch} />;
}
