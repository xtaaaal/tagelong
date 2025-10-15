"use client";

import { useEffect, useState } from "react";
import { ItineraryCard, ItineraryCardSkeleton } from "./itinerary-card";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { Tag } from "@/data/services/tag-service";

interface PopularItinerariesProps {
  itineraries: any[];
  loading?: boolean;
  category?: string;
  searchFilters?: {
    destination: string;
    duration: string;
    category: string;
  };
}

export function PopularItineraries({ 
  itineraries, 
  loading = false, 
  category = "popular",
  searchFilters 
}: PopularItinerariesProps) {
  
  // Filter itineraries based on category and search filters
  const filteredItineraries = itineraries.filter((itinerary) => {
    // Category filter - now works with tag objects
    if (category !== "popular") {
      const itineraryTags = itinerary.tags || [];
      
      // Check if any of the itinerary's tags match the selected category
      const hasMatchingTag = itineraryTags.some((tag: Tag) => 
        tag.slug === category
      );
      
      if (!hasMatchingTag) return false;
    }

    // Search filters
    if (searchFilters?.destination) {
      const destination = searchFilters.destination.toLowerCase();
      const matchesDestination = 
        itinerary.title.toLowerCase().includes(destination) ||
        itinerary.country.toLowerCase().includes(destination) ||
        itinerary.city?.toLowerCase().includes(destination) ||
        itinerary.region?.toLowerCase().includes(destination);
      
      if (!matchesDestination) return false;
    }

    if (searchFilters?.category && searchFilters.category !== 'any') {
      const selectedCategory = searchFilters.category.toLowerCase();
      const itineraryTags = itinerary.tags || [];
      
      // Check if any tag matches the selected category
      const hasMatchingTag = itineraryTags.some((tag: Tag) => 
        tag.slug === selectedCategory
      );
      
      if (!hasMatchingTag) return false;
    }

    return true;
  });

  // Get section title based on category
  const getSectionTitle = () => {
    if (searchFilters?.destination) {
      return `Results for "${searchFilters.destination}"`;
    }
    
    const categoryTitles: Record<string, string> = {
      popular: "Popular Now",
      adventure: "Adventure Trips", 
      cultural: "Cultural Experiences",
      culinary: "Food & Culinary",
      "eco-tourism": "Eco Tourism",
      historical: "Historical Sites",
      wellness: "Wellness & Beach",
      art: "Art & Culture",
      budget: "Budget Friendly",
      family: "Family Friendly",
      luxury: "Luxury Experiences"
    };
    
    return categoryTitles[category] || "Popular Now";
  };

  if (loading) {
    return (
      <section className="py-12 px-4 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-text-primary">Loading...</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }, (_, i) => (
            <ItineraryCardSkeleton key={i} />
          ))}
        </div>
      </section>
    );
  }

  if (filteredItineraries.length === 0) {
    return (
      <section className="py-12 px-4 max-w-7xl mx-auto">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-text-primary mb-4">No itineraries found</h2>
          <p className="text-text-secondary mb-6">
            Try adjusting your search filters or browse our popular destinations.
          </p>
          <Button 
            onClick={() => window.location.reload()} 
            className="bg-brand-500 hover:bg-brand-600"
          >
            Reset Filters
          </Button>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 px-4 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold text-text-primary">
          {getSectionTitle()}
        </h2>
        <Button 
          variant="ghost" 
          className="text-brand-500 hover:text-brand-600 font-medium"
        >
          Load more
          <ChevronRight className="ml-1 w-4 h-4" />
        </Button>
      </div>

      {/* Itinerary Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredItineraries.map((itinerary) => (
          <ItineraryCard
            key={itinerary.documentId}
            itinerary={itinerary}
          />
        ))}
      </div>

      {/* Show count */}
      <div className="text-center mt-8">
        <p className="text-text-secondary">
          Showing {filteredItineraries.length} of {itineraries.length} destinations
        </p>
      </div>
    </section>
  );
}
