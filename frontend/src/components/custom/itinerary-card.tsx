import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { SafeImage } from "@/components/custom/safe-image";

interface ItineraryCardProps {
  itinerary: {
    id: string;
    documentId: string;
    title: string;
    country: string;
    region?: string;
    city?: string;
    tags?: string;
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
}

export function ItineraryCard({ itinerary }: ItineraryCardProps) {
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
  const imageUrl = mainPicture?.url 
    ? `${process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337'}${mainPicture.url}`
    : null; // Let SafeImage handle fallback

  const imageAlt = mainPicture?.alternativeText || `${title} - ${location}`;

  // Format price display
  const priceDisplay = isFree ? "FREE" : price ? `$${price}` : "FREE";

  // Generate star rating (placeholder - you can implement actual ratings later)
  const rating = 4.5; // This would come from your data
  const starCount = Math.floor(rating);

  return (
    <Link href={`/itineraries/${documentId}`} className="group block">
      <div className="relative overflow-hidden rounded-2xl bg-white shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
        {/* Image Container */}
        <div className="relative h-64 w-full overflow-hidden">
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
              {tags.split(',').slice(0, 3).map((tag, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="bg-white/20 text-white border-0 text-xs px-2 py-1 backdrop-blur-sm"
                >
                  {tag.trim()}
                </Badge>
              ))}
            </div>
          )}
          
          {/* Price badge */}
          <div className="absolute top-3 right-3">
            <Badge 
              variant={isFree ? "secondary" : "default"}
              className={`text-lg font-bold px-3 py-2 ${
                isFree 
                  ? "bg-green-500 text-white" 
                  : "bg-white text-text-primary"
              }`}
            >
              {priceDisplay}
            </Badge>
          </div>
          
          {/* Content overlay at bottom */}
          <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
            <h3 className="text-xl font-bold mb-1 line-clamp-1">
              {title}
            </h3>
            <p className="text-sm opacity-90 mb-2 line-clamp-1">
              {location}
            </p>
            
            {/* Rating */}
            <div className="flex items-center gap-1">
              <div className="flex text-yellow-400">
                {Array.from({ length: 5 }, (_, i) => (
                  <span key={i} className={`text-sm ${i < starCount ? 'text-yellow-400' : 'text-text-muted'}`}>
                    ★
                  </span>
                ))}
              </div>
              <span className="text-sm ml-1">{rating}</span>
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
