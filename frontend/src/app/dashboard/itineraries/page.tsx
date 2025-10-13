import Link from "next/link";
import Image from "next/image";
import { getItineraries } from "@/data/loaders";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search } from "@/components/custom/search";
import { PaginationComponent } from "@/components/custom/pagination-component";

interface ItineraryCardProps {
  documentId: string;
  title: string;
  country: string;
  city?: string;
  mainPicture?: {
    url: string;
    alternativeText: string;
  };
  price?: number;
  currency?: string;
  isFree: boolean;
  tags: string[];
}

function ItineraryCard({ documentId, title, country, city, mainPicture, price, currency, isFree, tags }: Readonly<ItineraryCardProps>) {
  return (
    <Link href={`/dashboard/itineraries/${documentId}`}>
      <Card className="relative overflow-hidden hover:shadow-lg transition-shadow">
        {mainPicture && (
          <div className="relative h-48 w-full">
            <Image
              src={mainPicture.url}
              alt={mainPicture.alternativeText || title}
              fill
              className="object-cover"
            />
          </div>
        )}
        <CardHeader>
          <CardTitle className="leading-8 text-pink-500">
            {title}
          </CardTitle>
          <div className="text-sm text-text-secondary">
            {city ? `${city}, ` : ''}{country}
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2 mb-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-1 text-xs bg-navy-100 text-text-secondary rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
          <div className="text-lg font-semibold text-text-primary">
            {isFree ? 'Free' : `${price} ${currency || 'USD'}`}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

interface SearchParamsProps {
  searchParams?: {
    page?: string;
    query?: string;
  };
}

export default async function ItinerariesRoute({ searchParams }: SearchParamsProps) {
  const search = await searchParams;
  const query = search?.query ?? "";
  const currentPage = Number(search?.page) || 1;

  const { data, meta } = await getItineraries(query, currentPage);
  const pageCount = meta?.pagination?.pageCount;

  if (!data) return null;
  
  return (
    <div className="grid grid-cols-1 gap-4 p-4">
      <Search />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {data.map((item: ItineraryCardProps) => (
          <ItineraryCard key={item.documentId} {...item} />
        ))}
      </div>
      <PaginationComponent pageCount={pageCount} />
    </div>
  );
} 