"use client";

import { useState, useRef, useEffect } from "react";
import { Tag, getTagsWithIcons, getTagIconName, getTagIconUrl } from "@/data/services/tag-service";

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

interface CategoryFilterProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

export function CategoryFilter({ selectedCategory, onCategoryChange }: CategoryFilterProps) {
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Fetch tags from backend
  useEffect(() => {
    const fetchTags = async () => {
      try {
        setLoading(true);
        const fetchedTags = await getTagsWithIcons();
        setTags(fetchedTags);
      } catch (error) {
        console.error('Failed to fetch tags:', error);
        // Fallback to empty array - the service will handle fallback internally
        setTags([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTags();
  }, []);

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

  // Show loading state
  if (loading) {
    return (
      <div className="w-full max-w-7xl mx-auto px-4 py-6">
        <div className="flex justify-center">
          <div className="flex gap-3">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="flex flex-col items-center gap-2 p-3 min-w-[80px]">
                <div className="w-6 h-6 bg-gray-200 rounded animate-pulse"></div>
                <div className="w-12 h-3 bg-gray-200 rounded animate-pulse"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

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
          {tags.map((tag) => {
            const isActive = selectedCategory === tag.slug;
            const isHovered = hoveredCategory === tag.slug;
            const iconName = getTagIconName(tag.slug);
            
            return (
              <button
                key={tag.id}
                onClick={() => onCategoryChange(tag.slug)}
                onMouseEnter={() => setHoveredCategory(tag.slug)}
                onMouseLeave={() => setHoveredCategory(null)}
                className={`
                  group flex flex-col items-center gap-2 p-3 transition-all duration-200 cursor-pointer
                  hover:bg-gray-50 rounded-lg flex-shrink-0 min-w-[80px]
                  ${isActive ? 'text-brand-500' : 'text-text-primary hover:text-brand-500'}
                `}
                title={tag.description}
              >
                <div className="w-6 h-6 transition-all duration-200">
                  <CategoryIcon
                    iconName={iconName}
                    className="w-6 h-6 transition-all duration-200"
                    fill={isActive ? '#F69E20' : (isHovered ? '#F69E20' : '#6B7280')}
                  />
                </div>
                <span className={`text-xs font-medium text-text-primary transition-all duration-200 pb-1 group-hover:text-brand-500 whitespace-nowrap ${isActive ? 'border-b-2 border-brand-500' : 'border-b-2 border-transparent'}`}>
                  {tag.name}
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

// Helper function to map Strapi tags to category slugs
export function mapTagToCategory(tag?: string | string[] | Tag | Tag[]): string {
  if (!tag) return "popular";
  
  // Handle array of tags (multiple selection) - return the first mapped category
  if (Array.isArray(tag)) {
    for (const singleTag of tag) {
      // Handle Tag objects
      if (typeof singleTag === 'object' && singleTag && 'slug' in singleTag) {
        return singleTag.slug;
      }
      // Handle string tags
      if (typeof singleTag === 'string') {
        const result = mapSingleTagToCategory(singleTag);
        if (result !== "popular") return result;
      }
    }
    return "popular";
  }
  
  // Handle single tag
  if (typeof tag === 'object' && tag && 'slug' in tag) {
    return tag.slug;
  }
  
  return mapSingleTagToCategory(tag as string);
}

// Helper function to map a single tag string to category slug
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

// Helper function to get all category slugs from tags array
export function mapTagsToCategories(tags?: string | string[] | Tag | Tag[]): string[] {
  if (!tags) return ["popular"];
  
  if (Array.isArray(tags)) {
    const categories = tags.map(tag => {
      if (typeof tag === 'object' && tag && 'slug' in tag) {
        return tag.slug;
      }
      return mapSingleTagToCategory(tag as string);
    });
    return [...new Set(categories)]; // Remove duplicates
  }
  
  if (typeof tags === 'object' && tags && 'slug' in tags) {
    return [tags.slug];
  }
  
  return [mapSingleTagToCategory(tags as string)];
}
