import Link from "next/link";
import { SafeImage } from "@/components/custom/safe-image";
import { Tag } from "@/data/services/tag-service";
import { getImageUrl } from "@/lib/utils";

interface ItineraryCardProps {
  itinerary: {
    id: string;
    documentId: string;
    title: string;
    country: string;
    region?: string;
    city?: string;
    tags?: Tag[] | string; // Support both new Tag objects and legacy string
    price?: number;
    currency?: string;
    isFree: boolean;
    highlights: string;
    mainPicture?: {
      url: string;
      alternativeText: string;
    };
    publishStatus: string;
  };
  size?: 'small' | 'medium' | 'large' | 'extra-large' | 'wide-small' | 'wide-medium' | 'wide-large' | 'wide-extra-large';
}

export function ItineraryCard({ itinerary, size = 'medium' }: ItineraryCardProps) {
  const {
    documentId,
    title,
    country,
    region,
    city,
    tags,
    price,
    currency = "USD",
    isFree,
    mainPicture,
  } = itinerary;

  // Format location string
  const location = [city, region, country].filter(Boolean).join(", ");

  // Get image URL or use fallback
  const imageUrl = getImageUrl(mainPicture?.url);

  const imageAlt = mainPicture?.alternativeText || `${title} - ${location}`;

  // Format price display
  const priceDisplay = isFree ? "FREE" : price ? `$${price}` : "FREE";

  // Generate star rating (placeholder - you can implement actual ratings later)
  const rating = 4.5; // This would come from your data

  // Get size-specific classes
  const getSizeClasses = () => {
    switch (size) {
      case 'small':
        return 'masonry-item-small';
      case 'medium':
        return 'masonry-item-medium';
      case 'large':
        return 'masonry-item-large';
      case 'extra-large':
        return 'masonry-item-extra-large';
      case 'wide-small':
        return 'masonry-item-wide-small';
      case 'wide-medium':
        return 'masonry-item-wide-medium';
      case 'wide-large':
        return 'masonry-item-wide-large';
      case 'wide-extra-large':
        return 'masonry-item-wide-extra-large';
      default:
        return 'masonry-item-medium';
    }
  };


  return (
    <Link href={`/itineraries/${documentId}`} className={`group block ${getSizeClasses()}`}>
      <div className="relative overflow-hidden rounded-2xl bg-white shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1 h-full">
        {/* Mobile Layout: Stacked image and content */}
        <div className="sm:hidden">
          {/* Image Container with 3:2 aspect ratio */}
          <div className="relative w-full aspect-[3/2] overflow-hidden">
            <SafeImage
              src={imageUrl}
              alt={imageAlt}
              title={title}
              location={location}
              fill={true}
              className="transition-transform duration-300 group-hover:scale-105 object-cover"
              sizes="100vw"
            />
            
            {/* Tags overlay */}
            {tags && (
              <div className="absolute top-3 left-3 flex flex-wrap gap-1">
                {(() => {
                  // Handle both new Tag objects and legacy string format
                  let tagList: string[] = [];
                  
                  if (Array.isArray(tags)) {
                    // New format: Tag objects
                    tagList = tags.slice(0, 3).map(tag => tag.name);
                  } else if (typeof tags === 'string') {
                    // Legacy format: comma-separated string
                    tagList = tags.split(',').slice(0, 3).map(tag => tag.trim());
                  }
                  
                  return tagList.map((tagName, index) => (
                    <span
                      key={index}
                      className="bg-white/20 text-white border-0 text-xs px-2 py-1 backdrop-blur-sm rounded-full"
                    >
                      {tagName}
                    </span>
                  ));
                })()}
              </div>
            )}
            
            {/* Price badge */}
            <div className="absolute bottom-3 right-3">
              <span className="text-lg font-bold text-white">
                {priceDisplay}
              </span>
            </div>
          </div>
          
          {/* Content section with white background */}
          <div className="p-4 bg-white">
            <h3 className="text-xl font-bold mb-1 line-clamp-1 text-text-primary font-albert-sans">
              {title}
            </h3>
            <p className="text-sm text-text-muted mb-2 line-clamp-1 font-poppins">
              {location}
            </p>
            
            {/* Rating */}
            <div className="flex items-center gap-1">
              <span className="text-sm text-text-primary">★</span>
              <span className="text-sm ml-1 text-text-primary font-poppins">{rating}</span>
            </div>
          </div>
        </div>

        {/* Desktop Layout: Overlay content */}
        <div className="hidden sm:block h-full w-full">
          {/* Image Container */}
          <div className="relative h-full w-full overflow-hidden">
            <SafeImage
              src={imageUrl}
              alt={imageAlt}
              title={title}
              location={location}
              fill={true}
              className="transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            />
            
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
            
            {/* Tags overlay */}
            {tags && (
              <div className="absolute top-3 left-3 flex flex-wrap gap-1">
                {(() => {
                  // Handle both new Tag objects and legacy string format
                  let tagList: string[] = [];
                  
                  if (Array.isArray(tags)) {
                    // New format: Tag objects
                    tagList = tags.slice(0, 3).map(tag => tag.name);
                  } else if (typeof tags === 'string') {
                    // Legacy format: comma-separated string
                    tagList = tags.split(',').slice(0, 3).map(tag => tag.trim());
                  }
                  
                  return tagList.map((tagName, index) => (
                    <span
                      key={index}
                      className="bg-white/20 text-white border-0 text-xs px-2 py-1 backdrop-blur-sm rounded-full"
                    >
                      {tagName}
                    </span>
                  ));
                })()}
              </div>
            )}
            
            {/* Price badge */}
            <div className="absolute bottom-3 right-3">
              <span className="text-lg font-bold text-white">
                {priceDisplay}
              </span>
            </div>
            
            {/* Content overlay at bottom */}
            <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
              <h3 className="text-xl font-bold mb-1 line-clamp-1 font-albert-sans">
                {title}
              </h3>
              <p className="text-sm opacity-90 mb-2 line-clamp-1 font-poppins">
                {location}
              </p>
              
            {/* Rating */}
            <div className="flex items-center gap-1">
              <span className="text-sm text-white">★</span>
              <span className="text-sm ml-1 text-white font-poppins">{rating}</span>
            </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

// Loading skeleton component
export function ItineraryCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl bg-navy-200 animate-pulse">
      <div className="h-64 bg-navy-300" />
    </div>
  );
}
