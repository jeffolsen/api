import axios, { isAxiosError } from "axios";
import { RateLimitError } from "@/utils/errors";
import { BASE_URL, TOO_MANY_REQUESTS } from "@/network/clients/api";

export const APP_KEY = "app" as const;
export const API_KEY_HEADER = "X-Api-Key" as const;
export const API_SLUG_HEADER = "X-Api-Slug" as const;

export const MIN = 60 * 1000;
export const HOUR = 60 * MIN;
export const DAY = 24 * HOUR;

const client = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: {
    [API_KEY_HEADER]: import.meta.env.VITE_API_KEY,
    [API_SLUG_HEADER]: import.meta.env.VITE_API_SLUG,
  },
});

client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (isAxiosError(error) && error.response?.status === TOO_MANY_REQUESTS) {
      return Promise.reject(new RateLimitError("Too many requests"));
    }
    return Promise.reject(error);
  },
);

export const throwOnRateLimit = (error: Error) =>
  error instanceof RateLimitError;

export default client;
