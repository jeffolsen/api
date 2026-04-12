import axios from "axios";
import { useQuery, QueryOptions } from "@tanstack/react-query";
import {
  BASE_URL,
  COMPONENTS_ENDPOINT,
  DATE_RANGES_ENDPOINT,
  FEED_PATH_ENDPOINT,
  FEEDS_ENDPOINT,
  IMAGES_ENDPOINT,
  ITEMS_ENDPOINT,
  PaginationParams,
  TAGS_ENDPOINT,
} from "./api";
import { ITEMS_KEY } from "./item";
import { FEEDS_KEY } from "./feed";
import { TAGS_KEY } from "./tag";
import { IMAGES_KEY, TImageType, GetImagesResponse } from "./image";
import { DATE_RANGES_KEY } from "./dateRange";
import { COMPONENTS_KEY } from "./component";

const APP_KEY = "app" as const;
const API_KEY_HEADER = "X-Api-Key" as const;
const API_SLUG_HEADER = "X-Api-Slug" as const;
const headers = {
  [API_KEY_HEADER]: import.meta.env.VITE_API_KEY,
  [API_SLUG_HEADER]: import.meta.env.VITE_API_SLUG,
};

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
export const appImagesQueryKey = () => [APP_KEY, IMAGES_KEY] as const;

export const fetchAppFeeds = async () => {
  const response = await app.get(FEEDS_ENDPOINT, {
    headers,
    params: {
      pageSize: 100,
    },
  });
  return response.data;
};

export const fetchAppFeedComponents = async (feedId: number) => {
  const response = await app.get(
    `${FEEDS_ENDPOINT}/${feedId}${COMPONENTS_ENDPOINT}`,
    {
      headers,
    },
  );
  return response.data;
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

export const useGetAppItems = () => {
  return useQuery({
    queryKey: [APP_KEY, ITEMS_KEY],
    queryFn: async () => {
      const response = await app.get(ITEMS_ENDPOINT, {
        headers,
      });
      return response.data;
    },
  });
};

export const useGetAppItemById = (id: number) => {
  return useQuery({
    queryKey: [APP_KEY, ITEMS_KEY, id],
    queryFn: async () => {
      const response = await app.get(`${ITEMS_ENDPOINT}/${id}`, {
        headers,
      });
      return response.data;
    },
  });
};

export const useGetAppItemTags = (id: number) => {
  return useQuery({
    queryKey: [APP_KEY, ITEMS_KEY, id, TAGS_KEY],
    queryFn: async () => {
      const response = await app.get(
        `${ITEMS_ENDPOINT}/${id}${TAGS_ENDPOINT}`,
        {
          headers,
        },
      );
      return response.data;
    },
  });
};

export const useGetAppItemImages = (id: number) => {
  return useQuery({
    queryKey: [APP_KEY, ITEMS_KEY, id, IMAGES_KEY],
    queryFn: async () => {
      const response = await app.get(
        `${ITEMS_ENDPOINT}/${id}${IMAGES_ENDPOINT}`,
        {
          headers,
        },
      );
      return response.data;
    },
  });
};

export const useGetAppItemDateRanges = (id: number) => {
  return useQuery({
    queryKey: [APP_KEY, ITEMS_KEY, id, DATE_RANGES_KEY],
    queryFn: async () => {
      const response = await app.get(
        `${ITEMS_ENDPOINT}/${id}${DATE_RANGES_ENDPOINT}`,
        {
          headers,
        },
      );
      return response.data;
    },
  });
};

export const useGetAppFeeds = () => {
  return useQuery({
    queryKey: [APP_KEY, FEEDS_KEY],
    queryFn: async () => {
      const response = await app.get(FEEDS_ENDPOINT, {
        headers,
        params: {
          subjectTypes: "SINGLE",
          pageSize: 100,
        },
      });
      return response.data;
    },
  });
};

export const useGetAppFeedByPath = (path: string) => {
  return useQuery({
    queryKey: [APP_KEY, FEEDS_KEY, path],
    queryFn: async () => {
      const response = await app.get(`${FEED_PATH_ENDPOINT}/${path}`, {
        headers,
      });
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
        {
          headers,
        },
      );
      return response.data;
    },
  });
};

export default app;
