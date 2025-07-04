import qs from "qs";
import { getStrapiURL } from "@/lib/utils";

const baseUrl = getStrapiURL();
import { getAuthToken } from "./services/get-token";

async function fetchData(url: string) {
  const authToken = await getAuthToken();

  const headers = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authToken}`,
    },
  };

  try {
    const response = await fetch(url, authToken ? headers : {});
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
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
  return fetchData(url.href);
}

export async function getItineraryById(itineraryId: string) {
  return fetchData(`${baseUrl}/api/itineraries/${itineraryId}?populate=*`);
}