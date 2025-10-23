"use client";

import { useEffect, useState } from "react";
import { ItineraryCard, ItineraryCardSkeleton } from "./itinerary-card";
import { MasonryGrid } from "./masonry-grid";
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

  // Function to determine card size based on index and content - matches the exact 12-column pattern
  const getCardSize = (index: number, itinerary: any): 'small' | 'medium' | 'large' | 'extra-large' | 'wide-small' | 'wide-medium' | 'wide-large' | 'wide-extra-large' => {
    // Based on the 12-column grid pattern:
    // Row 1: 6 columns, 3 columns, 3 columns
    // Row 2: 3 columns, 3 columns, 6 columns  
    // Row 3: 6 columns, 3 columns, 3 columns
    // Row 4: 3 columns, 3 columns, 6 columns
    // Pattern repeats every 4 rows (12 cards)
    
    const exactPattern = [
      'extra-large',    // Row 1, Card 1: 6 columns (Patagonia Wilderness Expedition)
      'medium',         // Row 1, Card 2: 3 columns (Greek Islands & Ancient History)
      'medium',         // Row 1, Card 3: 3 columns (Canadian Rockies & Wildlife Safari)
      'medium',         // Row 2, Card 1: 3 columns (Jordan Petra & Wadi Rum Expedition)
      'medium',         // Row 2, Card 2: 3 columns (Scottish Highlands & Whisky Trail)
      'wide-large',     // Row 2, Card 3: 6 columns (Peruvian Andes & Amazon Adventure)
      'medium',         // Row 3, Card 1: 3 columns (Vietnam Food & Culture Journey)
      'medium',         // Row 3, Card 2: 3 columns (New Zealand South Island Explorer)
      'wide-large',     // Row 3, Card 3: 6 columns (Swiss Alps & Chocolate Discovery)
      'extra-large',    // Row 4, Card 1: 6 columns (Sun, Wine & Culture)
      'medium',         // Row 4, Card 2: 3 columns (Moroccan Desert Odyssey)
      'medium'          // Row 4, Card 3: 3 columns (Northern Lights Adventure)
    ];
    
    // Use index to cycle through the exact pattern
    const patternIndex = index % exactPattern.length;
    return exactPattern[patternIndex] as 'small' | 'medium' | 'large' | 'extra-large' | 'wide-small' | 'wide-medium' | 'wide-large' | 'wide-extra-large';
  };

  if (loading) {
    return (
      <section className="py-2 px-4 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-text-primary">Loading...</h2>
        </div>
        <MasonryGrid>
          {Array.from({ length: 8 }, (_, i) => (
            <div key={i} className={getCardSize(i, {})}>
              <ItineraryCardSkeleton />
            </div>
          ))}
        </MasonryGrid>
      </section>
    );
  }

  if (filteredItineraries.length === 0) {
    return (
      <section className="py-2 px-4 max-w-7xl mx-auto">
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
    <section className="py-2 px-4 max-w-7xl mx-auto">
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
      <MasonryGrid>
        {filteredItineraries.map((itinerary, index) => (
          <ItineraryCard
            key={itinerary.documentId}
            itinerary={itinerary}
            size={getCardSize(index, itinerary)}
          />
        ))}
      </MasonryGrid>

      {/* Show count */}
      <div className="text-center mt-8">
        <p className="text-text-secondary">
          Showing {filteredItineraries.length} of {itineraries.length} destinations
        </p>
      </div>
    </section>
  );
}
