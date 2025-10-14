"use client";

import { useState, useRef, useEffect } from "react";

// Custom SVG Icon Component with direct fill control
interface CategoryIconProps {
  iconName: string;
  className?: string;
  fill?: string;
}

function CategoryIcon({ iconName, className = "w-6 h-6", fill = "currentColor" }: CategoryIconProps) {
  return (
    <div 
      className={className}
      style={{ 
        WebkitMask: `url(/assets/icons/${iconName}.svg) no-repeat center / contain`,
        mask: `url(/assets/icons/${iconName}.svg) no-repeat center / contain`,
        backgroundColor: fill,
        transition: 'background-color 0.2s ease-in-out',
      }}
    />
  );
}

const categories = [
  { id: "popular", label: "Popular", icon: "popular" },
  { id: "adventure", label: "Adventure", icon: "adventure" },
  { id: "art", label: "Art", icon: "art" },
  { id: "budget", label: "Budget", icon: "budget" },
  { id: "cultural", label: "Cultural", icon: "cultural" },
  { id: "culinary", label: "Culinary", icon: "culinary" },
  { id: "eco-tourism", label: "Eco-Tourism", icon: "eco-tourism" },
  { id: "family", label: "Family", icon: "family" },
  { id: "historical", label: "Historical", icon: "historical" },
  { id: "luxury", label: "Luxury", icon: "luxury" },
  { id: "road-trip", label: "Road Trip", icon: "road-trip" },
  { id: "spiritual", label: "Spiritual", icon: "spiritual" },
  { id: "wellness", label: "Wellness", icon: "wellness" },
  { id: "wildlife", label: "Wildlife", icon: "wildlife" },
];

interface CategoryFilterProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

export function CategoryFilter({ selectedCategory, onCategoryChange }: CategoryFilterProps) {
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Check scroll position and update arrow visibility
  const checkScrollPosition = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth);
    }
  };

  // Scroll left function
  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -200, behavior: 'smooth' });
    }
  };

  // Scroll right function
  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 200, behavior: 'smooth' });
    }
  };

  // Initialize scroll position check
  useEffect(() => {
    checkScrollPosition();
    const handleResize = () => checkScrollPosition();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="relative w-full max-w-7xl mx-auto px-4 py-6">
      <div className="flex items-center justify-center">
        {/* Left Arrow */}
        {canScrollLeft && (
          <button
            onClick={scrollLeft}
            className="absolute bg-white rounded-full left-2 z-10 p-2 hover:bg-gray-50 transition-colors duration-200"
            aria-label="Scroll left"
          >
            <CategoryIcon
              iconName="arrow-left"
              className="w-5 h-5"
              fill="#6B7280"
            />
          </button>
        )}

        {/* Scrollable Categories Container */}
        <div
          ref={scrollContainerRef}
          onScroll={checkScrollPosition}
          className="flex gap-3 overflow-x-auto scrollbar-hide px-8 py-2"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}
        >
          {categories.map((category) => {
            const isActive = selectedCategory === category.id;
            const isHovered = hoveredCategory === category.id;
            
            return (
              <button
                key={category.id}
                onClick={() => onCategoryChange(category.id)}
                onMouseEnter={() => setHoveredCategory(category.id)}
                onMouseLeave={() => setHoveredCategory(null)}
                className={`
                  group flex flex-col items-center gap-2 p-3 transition-all duration-200 cursor-pointer
                  hover:bg-gray-50 rounded-lg flex-shrink-0 min-w-[80px]
                  ${isActive ? 'text-brand-500' : 'text-text-primary hover:text-brand-500'}
                `}
              >
                <div className="w-6 h-6 transition-all duration-200">
                  <CategoryIcon
                    iconName={category.icon}
                    className="w-6 h-6 transition-all duration-200"
                    fill={isActive ? '#F69E20' : (isHovered ? '#F69E20' : '#6B7280')}
                  />
                </div>
                <span className={`text-xs font-medium text-text-primary transition-all duration-200 pb-1 group-hover:text-brand-500 whitespace-nowrap ${isActive ? 'border-b-2 border-brand-500' : 'border-b-2 border-transparent'}`}>
                  {category.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Right Arrow */}
        {canScrollRight && (
          <button
            onClick={scrollRight}
            className="absolute bg-white rounded-full right-2 z-10 p-2 hover:bg-gray-50 transition-colors duration-200"
            aria-label="Scroll right"
          >
            <CategoryIcon
              iconName="arrow-right"
              className="w-5 h-5"
              fill="#6B7280"
            />
          </button>
        )}
      </div>
    </div>
  );
}

// Helper function to map Strapi tags to category IDs
export function mapTagToCategory(tag?: string | string[]): string {
  if (!tag) return "popular";
  
  // Handle array of tags (multiple selection) - return the first mapped category
  if (Array.isArray(tag)) {
    for (const singleTag of tag) {
      const result = mapSingleTagToCategory(singleTag);
      if (result !== "popular") return result; // Return first non-default category
    }
    return "popular";
  }
  
  // Handle single tag
  return mapSingleTagToCategory(tag);
}

// Helper function to map a single tag to category
function mapSingleTagToCategory(tag: string): string {
  const tagLower = tag.toLowerCase();
  const categoryMap: Record<string, string> = {
    popular: "popular",
    adventure: "adventure",
    art: "art",
    budget: "budget",
    cultural: "cultural",
    culinary: "culinary",
    "eco-tourism": "eco-tourism",
    family: "family",
    historical: "historical",
    luxury: "luxury",
    "road trip": "road-trip",
    spiritual: "spiritual",
    wellness: "wellness",
    wildlife: "wildlife",
    // Legacy mappings for backward compatibility
    food: "culinary",
    nature: "eco-tourism",
    urban: "cultural", 
    beach: "wellness",
    mountain: "adventure"
  };
  
  return categoryMap[tagLower] || "popular";
}

// Helper function to get all categories from tags array
export function mapTagsToCategories(tags?: string | string[]): string[] {
  if (!tags) return ["popular"];
  
  if (Array.isArray(tags)) {
    const categories = tags.map(tag => mapSingleTagToCategory(tag));
    return [...new Set(categories)]; // Remove duplicates
  }
  
  return [mapSingleTagToCategory(tags)];
}
