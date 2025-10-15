import { getStrapiURL } from '@/lib/utils';

export interface Tag {
  id: number;
  documentId: string;
  name: string;
  slug: string;
  description?: string;
  icon?: {
    url: string;
    alternativeText?: string;
  };
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

export interface TagsResponse {
  data: Tag[];
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

/**
 * Fetch all tags from Strapi backend
 */
export async function getTags(): Promise<Tag[]> {
  try {
    const baseUrl = getStrapiURL();
    const url = new URL('/api/tags', baseUrl);
    
    // Add query parameters for better performance
    url.searchParams.set('sort', 'name:asc');
    url.searchParams.set('pagination[pageSize]', '100'); // Get all tags
    
    const response = await fetch(url.href, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      // Add cache for better performance
      next: { revalidate: 3600 }, // Revalidate every hour
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch tags: ${response.status} ${response.statusText}`);
    }

    const data: TagsResponse = await response.json();
    return data.data || [];
  } catch (error) {
    console.error('Error fetching tags:', error);
    // Return fallback categories if API fails
    return getFallbackTags();
  }
}

/**
 * Fetch tags with icons populated
 */
export async function getTagsWithIcons(): Promise<Tag[]> {
  try {
    const baseUrl = getStrapiURL();
    const url = new URL('/api/tags', baseUrl);
    
    // Add populate parameter to include icon data
    url.searchParams.set('populate', 'icon');
    url.searchParams.set('sort', 'name:asc');
    url.searchParams.set('pagination[pageSize]', '100');
    
    const response = await fetch(url.href, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch tags with icons: ${response.status} ${response.statusText}`);
    }

    const data: TagsResponse = await response.json();
    return data.data || [];
  } catch (error) {
    console.error('Error fetching tags with icons:', error);
    return getFallbackTags();
  }
}

/**
 * Fallback tags in case API fails
 */
function getFallbackTags(): Tag[] {
  return [
    { id: 1, documentId: 'fallback-popular', name: 'Popular', slug: 'popular', description: 'Most popular destinations', createdAt: '', updatedAt: '', publishedAt: '' },
    { id: 2, documentId: 'fallback-adventure', name: 'Adventure', slug: 'adventure', description: 'Thrilling experiences', createdAt: '', updatedAt: '', publishedAt: '' },
    { id: 3, documentId: 'fallback-art', name: 'Art', slug: 'art', description: 'Art galleries and museums', createdAt: '', updatedAt: '', publishedAt: '' },
    { id: 4, documentId: 'fallback-budget', name: 'Budget', slug: 'budget', description: 'Affordable travel', createdAt: '', updatedAt: '', publishedAt: '' },
    { id: 5, documentId: 'fallback-cultural', name: 'Cultural', slug: 'cultural', description: 'Cultural experiences', createdAt: '', updatedAt: '', publishedAt: '' },
    { id: 6, documentId: 'fallback-culinary', name: 'Culinary', slug: 'culinary', description: 'Food experiences', createdAt: '', updatedAt: '', publishedAt: '' },
    { id: 7, documentId: 'fallback-eco-tourism', name: 'Eco-Tourism', slug: 'eco-tourism', description: 'Sustainable travel', createdAt: '', updatedAt: '', publishedAt: '' },
    { id: 8, documentId: 'fallback-family', name: 'Family', slug: 'family', description: 'Family-friendly', createdAt: '', updatedAt: '', publishedAt: '' },
    { id: 9, documentId: 'fallback-historical', name: 'Historical', slug: 'historical', description: 'Historical sites', createdAt: '', updatedAt: '', publishedAt: '' },
    { id: 10, documentId: 'fallback-luxury', name: 'Luxury', slug: 'luxury', description: 'Premium experiences', createdAt: '', updatedAt: '', publishedAt: '' },
    { id: 11, documentId: 'fallback-road-trip', name: 'Road Trip', slug: 'road-trip', description: 'Self-drive itineraries', createdAt: '', updatedAt: '', publishedAt: '' },
    { id: 12, documentId: 'fallback-spiritual', name: 'Spiritual', slug: 'spiritual', description: 'Spiritual destinations', createdAt: '', updatedAt: '', publishedAt: '' },
    { id: 13, documentId: 'fallback-wellness', name: 'Wellness', slug: 'wellness', description: 'Health and relaxation', createdAt: '', updatedAt: '', publishedAt: '' },
    { id: 14, documentId: 'fallback-wildlife', name: 'Wildlife', slug: 'wildlife', description: 'Wildlife experiences', createdAt: '', updatedAt: '', publishedAt: '' },
  ];
}

/**
 * Map tag slug to icon name for frontend icons
 */
export function getTagIconName(tagSlug: string): string {
  const iconMap: Record<string, string> = {
    'popular': 'popular',
    'adventure': 'adventure',
    'art': 'art',
    'budget': 'budget',
    'cultural': 'cultural',
    'culinary': 'culinary',
    'eco-tourism': 'eco-tourism',
    'family': 'family',
    'historical': 'historical',
    'luxury': 'luxury',
    'road-trip': 'road-trip',
    'spiritual': 'spiritual',
    'wellness': 'wellness',
    'wildlife': 'wildlife',
  };
  
  return iconMap[tagSlug] || 'popular';
}

/**
 * Get tag icon URL from backend or fallback to frontend icon
 */
export function getTagIconUrl(tag: Tag): string {
  // If tag has an icon from backend, use it
  if (tag.icon?.url) {
    const baseUrl = getStrapiURL();
    return `${baseUrl}${tag.icon.url}`;
  }
  
  // Fallback to frontend icon
  const iconName = getTagIconName(tag.slug);
  return `/assets/icons/${iconName}.svg`;
}
