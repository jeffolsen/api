import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import {
  BASE_URL,
  DATE_RANGES_ENDPOINT,
  IMAGES_ENDPOINT,
  ITEMS_ENDPOINT,
  TAGS_ENDPOINT,
} from "./api";
import { ITEMS_KEY } from "./item";

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
    queryKey: [APP_KEY, ITEMS_KEY, id, "tags"],
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

export const useGaetAppItemImages = (id: number) => {
  return useQuery({
    queryKey: [APP_KEY, ITEMS_KEY, id, "images"],
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
    queryKey: [APP_KEY, ITEMS_KEY, id, "dateRanges"],
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

export default app;
