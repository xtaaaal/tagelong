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
      <div className="relative py-4 px-4 md:py-8 md:px-8" style={{background: 'linear-gradient(180deg, rgba(246, 158, 32, 0) 0%, rgba(246, 158, 32, 0.07) 100%)'}}>
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-text-primary mb-6">
            Explore your <span className="text-brand-500">journey</span>
          </h1>
          <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 max-w-6xl mx-auto">
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
      <div className="relative py-4 px-4 md:py-8 md:px-8" style={{background: 'linear-gradient(180deg, rgba(246, 158, 32, 0) 0%, rgba(246, 158, 32, 0.07) 100%)'}}>
        <div className="max-w-6xl mx-auto text-center">
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
          <div className="hidden md:block bg-white rounded-2xl shadow-lg p-6 md:p-8 max-w-6xl mx-auto">
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
                    className="pl-10 h-12 border-navy-200 rounded-full"
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
                  <SelectTrigger className="h-12 border-navy-200 rounded-full">
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
                <div className="flex gap-2">
                  <Select
                    value={filters.category}
                    onValueChange={(value) => handleInputChange("category", value)}
                  >
                    <SelectTrigger className="h-12 border-navy-200 rounded-full flex-1">
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
                  
                  {/* Search Button */}
                  <Button
                    onClick={handleSearch}
                    className="h-12 w-12 p-0 rounded-full bg-white border border-[#F69E20] hover:bg-orange-50 transition-colors"
                  >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M15.7639 14.6305L13.505 12.3796C14.7296 10.8668 15.327 8.94171 15.174 7.0014C15.021 5.06109 14.1293 3.25347 12.6827 1.95126C11.2362 0.649061 9.34511 -0.0484305 7.39944 0.00261663C5.45378 0.0536637 3.60188 0.849357 2.22562 2.22562C0.849357 3.60188 0.0536637 5.45378 0.00261663 7.39944C-0.0484305 9.34511 0.649061 11.2362 1.95126 12.6827C3.25347 14.1293 5.06109 15.021 7.0014 15.174C8.94171 15.327 10.8668 14.7296 12.3796 13.505L14.6305 15.7639C14.7047 15.8387 14.793 15.8981 14.8902 15.9386C14.9875 15.9791 15.0918 16 15.1972 16C15.3026 16 15.4069 15.9791 15.5041 15.9386C15.6014 15.8981 15.6897 15.8387 15.7639 15.7639C15.8387 15.6897 15.8981 15.6014 15.9386 15.5041C15.9791 15.4069 16 15.3026 16 15.1972C16 15.0918 15.9791 14.9875 15.9386 14.8902C15.8981 14.793 15.8387 14.7047 15.7639 14.6305ZM1.62801 7.61441C1.62801 6.43042 1.97911 5.27301 2.6369 4.28855C3.2947 3.30409 4.22965 2.5368 5.32352 2.0837C6.41739 1.63061 7.62105 1.51205 8.7823 1.74304C9.94355 1.97403 11.0102 2.54418 11.8474 3.38139C12.6846 4.2186 13.2548 5.28528 13.4858 6.44652C13.7168 7.60777 13.5982 8.81144 13.1451 9.90531C12.692 10.9992 11.9247 11.9341 10.9403 12.5919C9.95582 13.2497 8.79841 13.6008 7.61441 13.6008C6.02672 13.6008 4.50406 12.9701 3.38139 11.8474C2.25872 10.7248 1.62801 9.20211 1.62801 7.61441Z" fill="#F69E20"/>
                      </svg>

                  </Button>
                </div>
              </div>

              {/* View All Destinations Button */}
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
                    className="pl-10 h-12 border-navy-200 rounded-full"
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
                  <SelectTrigger className="h-12 border-navy-200 rounded-full">
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
                  <SelectTrigger className="h-12 border-navy-200 rounded-full">
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
