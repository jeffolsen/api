import axios from "axios";
import { useQuery, QueryOptions, UseQueryOptions } from "@tanstack/react-query";
import {
  BASE_URL,
  COMPONENTS_ENDPOINT,
  FEEDS_ENDPOINT,
  IMAGES_ENDPOINT,
  ITEMS_ENDPOINT,
  PaginationParams,
} from "@/network/api";
import {
  ITEMS_KEY,
  TItemQueryParams,
  TItemWithIncludes,
  GetItemsWithIncludesResponse,
} from "@/network/item/types";
import {
  FEEDS_KEY,
  GetFeedsResponse,
  TFeedsParams,
} from "@/network/feed/types";
import { IMAGES_KEY } from "@/network/image/types";
import { COMPONENTS_KEY } from "@/network/component/types";
import { GetImagesResponse, TImageType } from "@/network/image/types";

const APP_KEY = "app" as const;
const API_KEY_HEADER = "X-Api-Key" as const;
const API_SLUG_HEADER = "X-Api-Slug" as const;
const headers = {
  [API_KEY_HEADER]: import.meta.env.VITE_API_KEY,
  [API_SLUG_HEADER]: import.meta.env.VITE_API_SLUG,
};

const ITEM_INCLUDES = "tags,images,dateRanges" as const;

const app = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

export const appFeedsQueryKey = (queryParams?: unknown) =>
  [APP_KEY, FEEDS_KEY, queryParams] as const;
export const appFeedByPathQueryKey = (path: string) =>
  [APP_KEY, FEEDS_KEY, path] as const;
export const appFeedComponentsQueryKey = (feedId: number) =>
  [APP_KEY, FEEDS_KEY, feedId, COMPONENTS_KEY] as const;
export const appItemBySlugQueryKey = (slug: string) =>
  [APP_KEY, ITEMS_KEY, "slug", slug] as const;
export const appImagesQueryKey = () => [APP_KEY, IMAGES_KEY] as const;

export const fetchAppFeeds = async () => {
  const response = await app.get(FEEDS_ENDPOINT, {
    headers,
    params: { pageSize: 100 },
  });
  return response.data;
};

export const fetchAppFeedComponents = async (feedId: number) => {
  const response = await app.get(
    `${FEEDS_ENDPOINT}/${feedId}${COMPONENTS_ENDPOINT}`,
    {
      headers,
      params: { published: true },
    },
  );
  return response.data;
};

export const fetchAppItemBySlug = async (
  slug: string,
): Promise<TItemWithIncludes | null> => {
  const response = await app.get(ITEMS_ENDPOINT, {
    headers,
    params: { slugs: slug, includes: ITEM_INCLUDES },
  });
  return response.data.items[0] ?? null;
};

type TImageQueryParams = {
  type?: TImageType;
} & PaginationParams;

export const useGetAppImages = (
  queryParams?: TImageQueryParams,
  options?: QueryOptions<GetImagesResponse>,
) => {
  return useQuery({
    queryKey: [APP_KEY, IMAGES_KEY, queryParams],
    queryFn: async (): Promise<GetImagesResponse> => {
      const response = await app.get(IMAGES_ENDPOINT, {
        headers,
        params: queryParams,
      });
      return response.data;
    },
    ...options,
  });
};

export const useGetAppItems = (
  queryParams?: TItemQueryParams,
  options?: Omit<
    UseQueryOptions<GetItemsWithIncludesResponse>,
    "queryKey" | "queryFn"
  >,
) => {
  return useQuery({
    queryKey: [APP_KEY, ITEMS_KEY, queryParams],
    queryFn: async (): Promise<GetItemsWithIncludesResponse> => {
      const response = await app.get(ITEMS_ENDPOINT, {
        headers,
        params: {
          ...queryParams,
          ids: queryParams?.ids?.join(","),
          slugs: queryParams?.slugs?.join(","),
          tags: queryParams?.tags?.join(","),
          sort: queryParams?.sort?.join(","),
          includes: ITEM_INCLUDES,
        },
      });
      return response.data;
    },
    ...options,
  });
};

export const useGetAppItemBySlug = (
  slug: string | undefined,
  options?: Omit<
    UseQueryOptions<TItemWithIncludes | null>,
    "queryKey" | "queryFn"
  >,
) => {
  return useQuery({
    queryKey: appItemBySlugQueryKey(slug ?? ""),
    queryFn: (): Promise<TItemWithIncludes | null> => {
      if (!slug) return Promise.resolve(null);
      return fetchAppItemBySlug(slug);
    },
    enabled: !!slug,
    ...options,
  });
};

export const useGetAppFeeds = (queryParams?: TFeedsParams) => {
  return useQuery({
    queryKey: [APP_KEY, FEEDS_KEY, queryParams],
    queryFn: async (): Promise<GetFeedsResponse> => {
      const response = await app.get(FEEDS_ENDPOINT, {
        headers,
        params: {
          pageSize: 100,
          ...queryParams,
          sort: queryParams?.sort?.join(","),
          ids: queryParams?.ids?.join(","),
          paths: queryParams?.ids?.join(","),
          subjectTypes: queryParams?.subjectTypes?.join(","),
        },
      });
      return response.data;
    },
  });
};

export const useGetAppFeedById = (id?: number) => {
  return useQuery({
    queryKey: [APP_KEY, FEEDS_KEY, id],
    queryFn: async () => {
      if (!id) return null;
      const response = await app.get(`${FEEDS_ENDPOINT}/${id}`, { headers });
      return response.data;
    },
  });
};

export const useGetAppFeedComponents = (feedId: number) => {
  return useQuery({
    queryKey: [APP_KEY, FEEDS_KEY, feedId, COMPONENTS_KEY],
    queryFn: async () => {
      const response = await app.get(
        `${FEEDS_ENDPOINT}/${feedId}${COMPONENTS_ENDPOINT}`,
        { headers },
      );
      return response.data;
    },
  });
};

export default app;
