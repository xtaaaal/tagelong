"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MapPin, Calendar, Grid3x3 } from "lucide-react";

interface SearchHeroProps {
  onSearch: (filters: SearchFilters) => void;
}

export interface SearchFilters {
  destination: string;
  duration: string;
  category: string;
}

const durations = [
  { value: "any", label: "Any duration" },
  { value: "1-3", label: "1-3 days" },
  { value: "4-7", label: "4-7 days" },
  { value: "8-14", label: "1-2 weeks" },
  { value: "15+", label: "2+ weeks" },
];

const categories = [
  { value: "any", label: "Any category" },
  { value: "adventure", label: "Adventure" },
  { value: "cultural", label: "Cultural" },
  { value: "food", label: "Food & Culinary" },
  { value: "nature", label: "Nature" },
  { value: "urban", label: "Urban" },
  { value: "beach", label: "Beach" },
  { value: "mountain", label: "Mountain" },
  { value: "historical", label: "Historical" },
];

export function SearchHero({ onSearch }: SearchHeroProps) {
  const [isClient, setIsClient] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({
    destination: "",
    duration: "any",
    category: "any",
  });

  // Handle hydration
  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleSearch = () => {
    // Convert "any" values to empty strings for the API
    const searchFilters = {
      ...filters,
      duration: filters.duration === "any" ? "" : filters.duration,
      category: filters.category === "any" ? "" : filters.category,
    };
    onSearch(searchFilters);
  };

  const handleInputChange = (field: keyof SearchFilters, value: string) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Show a simple version during server-side render to prevent hydration issues
  if (!isClient) {
    return (
      <div className="relative py-20 px-4" style={{background: 'linear-gradient(180deg, rgba(246, 158, 32, 0) 0%, rgba(246, 158, 32, 0.07) 100%)'}}>
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-text-primary mb-6">
            Explore your <span className="text-brand-500">journey</span>
          </h1>
          <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 max-w-4xl mx-auto">
            <div className="text-center text-text-muted">
              Loading search form...
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative py-20 px-4" style={{background: 'linear-gradient(180deg, rgba(246, 158, 32, 0) 0%, rgba(246, 158, 32, 0.07) 100%)'}}>
      <div className="max-w-4xl mx-auto text-center">
        {/* Hero Title */}
        <h1 className="text-4xl md:text-6xl font-bold text-text-primary mb-6">
          Explore your <span className="text-brand-500">journey</span>
        </h1>
      
        {/* Search Form */}
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            {/* Where */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-text-secondary text-left">
                Where
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-muted w-4 h-4" />
                <Input
                  placeholder="Search destinations"
                  value={filters.destination}
                  onChange={(e) => handleInputChange("destination", e.target.value)}
                  className="pl-10 h-12 border-navy-200 rounded-xl"
                />
              </div>
            </div>

            {/* Duration */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-text-secondary text-left">
                Duration
              </label>
              <Select
                value={filters.duration}
                onValueChange={(value) => handleInputChange("duration", value)}
              >
                <SelectTrigger className="h-12 border-navy-200 rounded-xl">
                  <div className="flex items-center gap-2">
                    <Calendar className="text-text-muted w-4 h-4" />
                    <SelectValue placeholder="Any duration" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  {durations.map((duration) => (
                    <SelectItem key={duration.value} value={duration.value}>
                      {duration.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Category */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-text-secondary text-left">
                Category
              </label>
              <Select
                value={filters.category}
                onValueChange={(value) => handleInputChange("category", value)}
              >
                <SelectTrigger className="h-12 border-navy-200 rounded-xl">
                  <div className="flex items-center gap-2">
                    <Grid3x3 className="text-text-muted w-4 h-4" />
                    <SelectValue placeholder="Any category" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Search Button */}
            <div className="md:col-span-1">
              <Button 
                onClick={handleSearch}
                className="w-full h-12 bg-brand-500 hover:bg-brand-600 text-white rounded-xl font-medium"
              >
                View All Destinations
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
