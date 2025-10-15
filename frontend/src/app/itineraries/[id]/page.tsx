import { getItineraryById } from "@/data/loaders";
import { notFound } from "next/navigation";
import { SafeImage } from "@/components/custom/safe-image";
import { Badge } from "@/components/ui/badge";
import { getImageUrl } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { SearchHero } from "@/components/custom/search-hero";
import { 
  MapPin, 
  Calendar, 
  DollarSign, 
  Star, 
  ArrowLeft, 
  ExternalLink,
  Clock,
  Bookmark,
  Share2,
  Download,
  User,
  ChevronRight
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
  const imageUrl = getImageUrl(mainPicture?.url);
  
  const priceDisplay = isFree ? "FREE" : price ? `${currency} ${price}` : "Contact for pricing";

  const handleSearch = (filters: any) => {
    // Handle search functionality - redirect to homepage with filters
    const searchParams = new URLSearchParams();
    if (filters.destination) searchParams.set('query', filters.destination);
    if (filters.category) searchParams.set('category', filters.category);
    if (filters.duration) searchParams.set('duration', filters.duration);
    
    window.location.href = `/?${searchParams.toString()}`;
  };

  return (
    <main className="min-h-screen bg-white">
      {/* Search Hero Section */}
      <SearchHero onSearch={handleSearch} />

      {/* Hero Image Section */}
      <div className="relative h-[500px] md:h-[600px] overflow-hidden">
        <SafeImage
          src={imageUrl}
          alt={title}
          title={title}
          location={location}
          fill={true}
          className="object-cover"
          priority={true}
        />
        
        {/* Free with Ads Badge */}
        <div className="absolute top-6 right-6">
          <Badge className="bg-red-500 text-white px-3 py-1">
            Free with Ads
          </Badge>
        </div>
        
        {/* Hero Content Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12 text-white">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-wrap items-center gap-2 mb-4">
              {tags && Array.isArray(tags) && tags.length > 0 && (
                tags.slice(0, 3).map((tag: any, index: number) => (
                  <Badge key={index} variant="secondary" className="bg-orange-100 text-orange-800 border-0 px-3 py-1">
                    {tag.name}
                  </Badge>
                ))
              )}
            </div>
            <h1 className="text-3xl md:text-5xl font-bold mb-2">{title}</h1>
            <div className="flex items-center gap-2 text-lg mb-4">
              <MapPin className="w-5 h-5" />
              {location}
            </div>
            
            {/* Action Icons */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <Star className="w-5 h-5 text-yellow-400 fill-current" />
                <span className="text-lg font-medium">4.5</span>
              </div>
              <button className="p-2 hover:bg-white/20 rounded-full transition-colors">
                <Bookmark className="w-5 h-5" />
              </button>
              <button className="p-2 hover:bg-white/20 rounded-full transition-colors">
                <Share2 className="w-5 h-5" />
              </button>
            </div>
            
            {/* Author Info */}
            <div className="mt-6 flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-gray-600" />
              </div>
              <div>
                <p className="font-medium">Jonny M.</p>
                <p className="text-sm text-gray-300">Travel Expert</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Highlights Section */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">Highlights</h2>
          <div className="max-w-4xl mx-auto">
            <p className="text-text-secondary leading-relaxed text-lg text-center">
              {highlights || "Discover the beauty and culture of this amazing destination with our carefully crafted itinerary."}
            </p>
          </div>
        </div>
      </section>

      {/* Daily Itinerary Section */}
      {days.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Daily Itinerary</h2>
            <div className="space-y-12">
              {days.map((day: any, index: number) => (
                <div key={index} className="bg-white rounded-2xl p-8 shadow-sm">
                  <div className="grid md:grid-cols-2 gap-8 items-center">
                    {/* Left Content */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="bg-orange-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                          {day.dayNumber || index + 1}
                        </div>
                        <h3 className="text-xl font-semibold">
                          {day.subtitle || `Day ${day.dayNumber || index + 1}`}
                        </h3>
                      </div>
                      
                      {day.recommendation && (
                        <p className="text-text-secondary leading-relaxed">
                          {day.recommendation}
                        </p>
                      )}
                      
                      <div className="flex items-center gap-4">
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
                        
                        <Button variant="outline" size="sm" className="text-xs">
                          <Download className="w-3 h-3 mr-1" />
                          PDF Download
                        </Button>
                      </div>
                      
                      {/* Travel Time */}
                      <div className="flex items-center gap-2 text-sm text-text-muted">
                        <div className="w-4 h-4 bg-gray-300 rounded-full"></div>
                        <span>10 mins</span>
                      </div>
                    </div>
                    
                    {/* Right Image */}
                    <div className="relative h-64 rounded-xl overflow-hidden">
                      <SafeImage
                        src={day.picture?.url ? getImageUrl(day.picture.url) : undefined}
                        alt={day.subtitle || `Day ${day.dayNumber || index + 1}`}
                        fill={true}
                        className="object-cover"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Map Section */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">Map</h2>
          <div className="bg-gray-200 rounded-2xl h-96 flex items-center justify-center">
            <p className="text-text-muted">Interactive map will be embedded here</p>
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Reviews</h2>
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {/* Sample Review Cards */}
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white rounded-2xl p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-gray-600" />
                  </div>
                  <div>
                    <p className="font-medium">Gabriela</p>
                    <p className="text-sm text-text-muted">Calgary, Canada</p>
                  </div>
                  <div className="ml-auto flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-sm font-medium">4.5</span>
                  </div>
                </div>
                <p className="text-text-secondary text-sm mb-3">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-text-muted">23 November 2025</span>
                  <Button variant="ghost" size="sm" className="text-xs">
                    Show more
                  </Button>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center">
            <Button className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3">
              Show all reviews
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <h3 className="font-bold text-lg mb-4">Tagelong</h3>
              <p className="text-text-secondary text-sm mb-4">
                Your travel companion for discovering amazing destinations around the world.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="#" className="text-text-secondary hover:text-text-primary">Newsroom</Link></li>
                <li><Link href="#" className="text-text-secondary hover:text-text-primary">Resources & tips for Planners</Link></li>
                <li><Link href="#" className="text-text-secondary hover:text-text-primary">Language & Currency</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="#" className="text-text-secondary hover:text-text-primary">Terms</Link></li>
                <li><Link href="#" className="text-text-secondary hover:text-text-primary">Privacy Policy</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-200 mt-8 pt-8 text-center">
            <p className="text-sm text-text-muted">
              © 2025 Tagelong. Design by HTBS.
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}
