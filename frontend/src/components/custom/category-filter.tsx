"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

const categories = [
  { id: "popular", label: "Popular", icon: "/assets/icons/popular.svg" },
  { id: "adventure", label: "Adventure", icon: "/assets/icons/adventure.svg" },
  { id: "art", label: "Art", icon: "/assets/icons/art.svg" },
  { id: "budget", label: "Budget", icon: "/assets/icons/budget.svg" },
  { id: "cultural", label: "Cultural", icon: "/assets/icons/cultural.svg" },
  { id: "culinary", label: "Culinary", icon: "/assets/icons/culinary.svg" },
  { id: "eco-tourism", label: "Eco-Tourism", icon: "/assets/icons/eco-tourism.svg" },
  { id: "family", label: "Family", icon: "/assets/icons/family.svg" },
  { id: "historical", label: "Historical", icon: "/assets/icons/historical.svg" },
  { id: "luxury", label: "Luxury", icon: "/assets/icons/luxury.svg" },
  { id: "road-trip", label: "Road Trip", icon: "/assets/icons/road-trip.svg" },
  { id: "spiritual", label: "Spiritual", icon: "/assets/icons/spiritual.svg" },
  { id: "wellness", label: "Wellness", icon: "/assets/icons/wellness.svg" },
  { id: "wildlife", label: "Wildlife", icon: "/assets/icons/wildlife.svg" },
];

interface CategoryFilterProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

export function CategoryFilter({ selectedCategory, onCategoryChange }: CategoryFilterProps) {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-6">
      <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
        {categories.map((category) => {
          const isActive = selectedCategory === category.id;
          
          return (
            <Button
              key={category.id}
              variant={isActive ? "default" : "outline"}
              size="sm"
              onClick={() => onCategoryChange(category.id)}
              className={`
                flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-200
                ${isActive 
                  ? "bg-brand-500 hover:bg-brand-600 text-white border-brand-500" 
                  : "bg-white hover:bg-navy-50 text-text-primary border-navy-200 hover:border-navy-300"
                }
              `}
            >
              <Image
                src={category.icon}
                alt={`${category.label} icon`}
                width={16}
                height={16}
                className={`w-4 h-4 ${isActive ? 'brightness-0 invert' : ''}`}
              />
              {category.label}
            </Button>
          );
        })}
      </div>
    </div>
  );
}

// Helper function to map Strapi tags to category IDs
export function mapTagToCategory(tag?: string): string {
  if (!tag) return "popular";
  
  const tagLower = tag.toLowerCase();
  const categoryMap: Record<string, string> = {
    adventure: "adventure",
    cultural: "cultural",
    food: "culinary",
    nature: "eco-tourism",
    urban: "cultural", 
    beach: "wellness",
    mountain: "adventure",
    historical: "historical"
  };
  
  return categoryMap[tagLower] || "popular";
}
