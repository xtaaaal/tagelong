"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  Crown, 
  Mountain, 
  Palette, 
  DollarSign, 
  Building2, 
  UtensilsCrossed, 
  Leaf, 
  Trees, 
  MapPin, 
  Users, 
  Waves, 
  Sparkles, 
  Heart, 
  Dumbbell
} from "lucide-react";

const categories = [
  { id: "popular", label: "Popular", icon: Crown },
  { id: "adventure", label: "Adventure", icon: Mountain },
  { id: "art", label: "Art", icon: Palette },
  { id: "budget", label: "Budget", icon: DollarSign },
  { id: "cultural", label: "Cultural", icon: Building2 },
  { id: "culinary", label: "Culinary", icon: UtensilsCrossed },
  { id: "eco-tourism", label: "Eco-Tourism", icon: Leaf },
  { id: "family", label: "Family", icon: Users },
  { id: "historical", label: "Historical", icon: MapPin },
  { id: "luxury", label: "Luxury", icon: Sparkles },
  { id: "road-trip", label: "Road Trip", icon: MapPin },
  { id: "spiritual", label: "Spiritual", icon: Heart },
  { id: "wellness", label: "Wellness", icon: Dumbbell },
  { id: "wildlife", label: "Wildlife", icon: Trees },
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
          const IconComponent = category.icon;
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
              <IconComponent className="w-4 h-4" />
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
