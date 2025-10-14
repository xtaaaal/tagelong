import qs from "qs";
import { getStrapiURL } from "@/lib/utils";

const baseUrl = getStrapiURL();
import { getAuthToken } from "./services/get-token";

async function fetchData(url: string) {
  const authToken = await getAuthToken();

  const fetchOptions: RequestInit = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...(authToken && { Authorization: `Bearer ${authToken}` }),
    },
  };

  try {
    const response = await fetch(url, fetchOptions);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    // Silently handle expected errors (like 403 for unauthorized endpoints)
    return { data: null }; // Return null data instead of throwing
  }
}

// Separate function for public endpoints that don't require authentication
async function fetchPublicData(url: string) {
  const fetchOptions: RequestInit = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  };

  try {
    const response = await fetch(url, fetchOptions);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    // Silently handle fetch errors for public endpoints
    return { data: null }; // Return null data instead of throwing
  }
}

export async function getHomePageData() {
  const url = new URL("/api/home-page", baseUrl);

  url.search = qs.stringify({
    populate: {
      blocks: {
        populate: "*"
      }
    }
  });

  return await fetchData(url.href);
}

export async function getGlobalData() {
  const url = new URL("/api/global", baseUrl);

  url.search = qs.stringify({
    populate: {
      header: {
        populate: ["logoText", "ctaButton"]
      },
      footer: {
        populate: ["logoText", "socialLink"]
      }
    }
  });

  return await fetchData(url.href);
}

export async function getGlobalPageMetadata() {
  const url = new URL("/api/global", baseUrl);

  url.search = qs.stringify({
    fields: ["title", "description"]
  });

  return await fetchData(url.href);
}

export async function getSummaries(queryString: string, currentPage: number) {
  const PAGE_SIZE = 4;

  const query = qs.stringify({
    sort: ["createdAt:desc"],
    filters: {
      $or: [
        { title: { $containsi: queryString } },
        { summary: { $containsi: queryString } },
      ],
    },
    pagination: {
      pageSize: PAGE_SIZE,
      page: currentPage,
    },
  });
  const url = new URL("/api/summaries", baseUrl);
  url.search = query;
  return fetchData(url.href);
}

export async function getSummaryById(summaryId: string) {
  return fetchData(`${baseUrl}/api/summaries/${summaryId}`);
}

export async function getItineraries(queryString: string, currentPage: number) {
  const PAGE_SIZE = 8;

  const query = qs.stringify({
    sort: ["createdAt:desc"],
    filters: {
      $or: [
        { title: { $containsi: queryString } },
        { country: { $containsi: queryString } },
        { city: { $containsi: queryString } }
      ]
    },
    populate: {
      mainPicture: true,
      days: {
        populate: {
          picture: true
        }
      }
    },
    pagination: {
      pageSize: PAGE_SIZE,
      page: currentPage
    }
  });
  
  const url = new URL("/api/itineraries", baseUrl);
  url.search = query;
  return fetchPublicData(url.href);
}

export async function getItineraryById(itineraryId: string) {
  return fetchPublicData(`${baseUrl}/api/itineraries/${itineraryId}?populate=*`);
}

export async function getPopularItineraries(limit = 12) {
  const query = qs.stringify({
    sort: ["createdAt:desc"],
    // Remove the publishStatus filter to get all published content
    // In Strapi 5, published content is accessible by default via public API
    populate: {
      mainPicture: {
        fields: ["url", "alternativeText"]
      }
    },
    pagination: {
      pageSize: limit,
      page: 1
    }
  });
  
  const url = new URL("/api/itineraries", baseUrl);
  url.search = query;
  
  return await fetchPublicData(url.href);
}