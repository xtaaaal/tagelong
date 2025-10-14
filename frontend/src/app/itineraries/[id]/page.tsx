import { getItineraryById } from "@/data/loaders";
import { notFound } from "next/navigation";
import { SafeImage } from "@/components/custom/safe-image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  MapPin, 
  Calendar, 
  DollarSign, 
  Star, 
  ArrowLeft, 
  ExternalLink,
  Clock
} from "lucide-react";
import Link from "next/link";

interface ItineraryDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ItineraryDetailPage({ params }: ItineraryDetailPageProps) {
  const { id } = await params;
  const itineraryResponse = await getItineraryById(id);
  const itinerary = itineraryResponse?.data;

  if (!itinerary) {
    notFound();
  }

  const {
    title,
    country,
    region,
    city,
    tags,
    price,
    currency = "USD",
    isFree,
    highlights,
    mainPicture,
    Day: days = []
  } = itinerary;

  const location = [city, region, country].filter(Boolean).join(", ");
  const imageUrl = mainPicture?.url 
    ? `${process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337'}${mainPicture.url}`
    : undefined; // Let SafeImage handle fallback
  
  const priceDisplay = isFree ? "FREE" : price ? `${currency} ${price}` : "Contact for pricing";

  return (
    <main className="min-h-screen bg-white">
      {/* Back Navigation */}
      <div className="container mx-auto px-4 py-6">
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-text-secondary hover:text-text-primary transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to destinations
        </Link>
      </div>

      {/* Hero Image */}
      <div className="relative h-96 md:h-[500px] overflow-hidden">
        <SafeImage
          src={imageUrl}
          alt={title}
          title={title}
          location={location}
          fill={true}
          className=""
          priority={true}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        
        {/* Hero Content */}
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12 text-white">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-wrap items-center gap-2 mb-4">
              {tags && (
                <Badge variant="secondary" className="bg-white/20 text-white border-0">
                  {tags}
                </Badge>
              )}
              <div className="flex items-center gap-1 text-sm">
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <span>4.5</span>
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-2">{title}</h1>
            <div className="flex items-center gap-2 text-lg">
              <MapPin className="w-5 h-5" />
              {location}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="md:col-span-2 space-y-8">
              {/* Overview */}
              <section>
                <h2 className="text-2xl font-bold mb-4">Overview</h2>
                <p className="text-text-secondary leading-relaxed text-lg">
                  {highlights || "Discover the beauty and culture of this amazing destination with our carefully crafted itinerary."}
                </p>
              </section>

              {/* Daily Itinerary */}
              {days.length > 0 && (
                <section>
                  <h2 className="text-2xl font-bold mb-6">Daily Itinerary</h2>
                  <div className="space-y-6">
                    {days.map((day: any, index: number) => (
                      <div key={index} className="border-l-4 border-orange-200 pl-6 pb-6">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="bg-orange-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                            {day.dayNumber || index + 1}
                          </div>
                          <h3 className="text-xl font-semibold">
                            {day.subtitle || `Day ${day.dayNumber || index + 1}`}
                          </h3>
                          {day.dayType && day.dayType !== "Input Number" && (
                            <Badge variant="outline" className="text-xs">
                              {day.dayType}
                            </Badge>
                          )}
                        </div>
                        {day.recommendation && (
                          <p className="text-text-secondary mb-3">{day.recommendation}</p>
                        )}
                        {day.googleMapsLink && (
                          <a
                            href={day.googleMapsLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-orange-600 hover:text-orange-700 text-sm font-medium"
                          >
                            <ExternalLink className="w-4 h-4" />
                            View on Google Maps
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Price Card */}
              <div className="bg-navy-50 rounded-2xl p-6">
                <div className="text-center mb-4">
                  <div className="text-3xl font-bold text-text-primary mb-1">
                    {priceDisplay}
                  </div>
                  {!isFree && (
                    <p className="text-sm text-text-secondary">per person</p>
                  )}
                </div>
                <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white">
                  Book Now
                </Button>
                <p className="text-xs text-text-muted text-center mt-2">
                  Free cancellation up to 24 hours before
                </p>
              </div>

              {/* Quick Info */}
              <div className="bg-white border rounded-2xl p-6">
                <h3 className="font-semibold mb-4">Quick Info</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-text-muted" />
                    <span className="text-sm">{location}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-text-muted" />
                    <span className="text-sm">
                      {days.length > 0 ? `${days.length} days` : "Duration varies"}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <DollarSign className="w-5 h-5 text-text-muted" />
                    <span className="text-sm">
                      {isFree ? "Free experience" : "Paid experience"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Share */}
              <div className="text-center">
                <Button variant="outline" className="w-full">
                  Share this itinerary
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
