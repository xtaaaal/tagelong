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
import { MapPin, Calendar, Grid3x3, Search, X } from "lucide-react";

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
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
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
    // Close mobile popup after search
    setIsMobileSearchOpen(false);
  };

  const handleMobileSearchOpen = () => {
    setIsMobileSearchOpen(true);
  };

  const handleMobileSearchClose = () => {
    setIsMobileSearchOpen(false);
  };

  const handleInputChange = (field: keyof SearchFilters, value: string) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Generate search summary text for mobile button
  const getSearchSummary = () => {
    const parts = [];
    
    if (filters.destination) {
      parts.push(filters.destination);
    } else {
      parts.push("Anywhere");
    }
    
    if (filters.duration !== "any") {
      const durationLabel = durations.find(d => d.value === filters.duration)?.label || "Any duration";
      parts.push(durationLabel);
    } else {
      parts.push("How long");
    }
    
    if (filters.category !== "any") {
      const categoryLabel = categories.find(c => c.value === filters.category)?.label || "Any category";
      parts.push(categoryLabel);
    } else {
      parts.push("Which style");
    }
    
    return parts.join(" • ");
  };

  // Show a simple version during server-side render to prevent hydration issues
  if (!isClient) {
    return (
      <div className="relative py-4 px-4" style={{background: 'linear-gradient(180deg, rgba(246, 158, 32, 0) 0%, rgba(246, 158, 32, 0.07) 100%)'}}>
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
    <>
      <div className="relative py-4 px-4" style={{background: 'linear-gradient(180deg, rgba(246, 158, 32, 0) 0%, rgba(246, 158, 32, 0.07) 100%)'}}>
        <div className="max-w-4xl mx-auto text-center">
          {/* Hero Title */}
          <h1 className="text-4xl md:text-6xl font-bold text-text-primary mb-6">
            Explore your <span className="text-brand-500">journey</span>
          </h1>
        
          {/* Mobile Search Button */}
          <div className="md:hidden mb-6">
            <Button 
              onClick={handleMobileSearchOpen}
              className="w-full h-14 bg-white border border-gray-200 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 text-left px-4"
            >
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-3">
                  <Search className="text-brand-500 w-5 h-5" />
                  <div className="text-left">
                    <div className="text-sm font-medium text-text-primary">
                      {getSearchSummary()}
                    </div>
                  </div>
                </div>
                <div className="w-8 h-8 bg-brand-500 rounded-full flex items-center justify-center">
                  <Search className="text-white w-4 h-4" />
                </div>
              </div>
            </Button>
          </div>

          {/* Desktop Search Form */}
          <div className="hidden md:block bg-white rounded-2xl shadow-lg p-6 md:p-8 max-w-4xl mx-auto">
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

      {/* Mobile Full-Screen Search Popup */}
      {isMobileSearchOpen && (
        <div className="fixed inset-0 z-50 bg-white md:hidden">
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <Button
                variant="ghost"
                onClick={handleMobileSearchClose}
                className="p-2"
              >
                <X className="w-6 h-6" />
              </Button>
              <h2 className="text-lg font-semibold text-text-primary">Search</h2>
              <div className="w-10" /> {/* Spacer for centering */}
            </div>

            {/* Search Form */}
            <div className="flex-1 p-4 space-y-6">
              {/* Where */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-text-secondary">
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
                <label className="block text-sm font-medium text-text-secondary">
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
                <label className="block text-sm font-medium text-text-secondary">
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
            </div>

            {/* Footer with Search Button */}
            <div className="p-4 border-t border-gray-200">
              <Button 
                onClick={handleSearch}
                className="w-full h-12 bg-brand-500 hover:bg-brand-600 text-white rounded-xl font-medium"
              >
                Search
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
