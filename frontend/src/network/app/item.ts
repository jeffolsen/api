import { QueryClient, useQuery, UseQueryOptions } from "@tanstack/react-query";
import { ITEM_SLUG_ENDPOINT, ITEMS_ENDPOINT } from "@/network/api";
import {
  GetItemsWithIncludesResponse,
  GetItemWithIncludesResponse,
  ITEMS_KEY,
  TItemQueryParams,
} from "@/network/item/types";
import client, { APP_KEY, DAY, MIN, headers, throwOnRateLimit } from "./client";

const ITEM_INCLUDES = "tags,images,dateRanges" as const;

export const appItemsQueryKey = (key?: TItemQueryParams | string | number) =>
  [APP_KEY, ITEMS_KEY, key] as const;

export const appItemsCacheOptions = {
  staleTime: 5 * MIN,
  gcTime: DAY,
  throwOnError: throwOnRateLimit,
} as const;

/*
 * get all items
 */

export const fetchAppItems = async (
  queryParams?: TItemQueryParams,
): Promise<GetItemsWithIncludesResponse> => {
  const response = await client.get(ITEMS_ENDPOINT, {
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
};

export const queryAppItems = (
  queryClient: QueryClient,
  queryParams?: TItemQueryParams,
  options?: Omit<
    UseQueryOptions<GetItemsWithIncludesResponse>,
    "queryKey" | "queryFn"
  >,
) =>
  queryClient.fetchQuery({
    queryKey: appItemsQueryKey(queryParams),
    queryFn: () => fetchAppItems(queryParams),
    ...appItemsCacheOptions,
    ...options,
  });

export const useGetAppItems = (
  queryParams?: TItemQueryParams,
  options?: Omit<
    UseQueryOptions<GetItemsWithIncludesResponse>,
    "queryKey" | "queryFn"
  >,
) =>
  useQuery({
    queryKey: appItemsQueryKey(queryParams),
    queryFn: () => fetchAppItems(queryParams),
    ...appItemsCacheOptions,
    ...options,
  });

/*
 * get item by slug
 */

export const fetchAppItemBySlug = async (
  slug: string,
): Promise<GetItemWithIncludesResponse> => {
  const response = await client.get(`${ITEM_SLUG_ENDPOINT}/${slug}`, {
    headers,
    params: {
      includes: ITEM_INCLUDES,
    },
  });
  return response.data;
};

export const queryAppItemBySlug = (
  queryClient: QueryClient,
  slug: string,
  options?: Omit<
    UseQueryOptions<GetItemWithIncludesResponse>,
    "queryKey" | "queryFn"
  >,
) =>
  queryClient.fetchQuery({
    queryKey: appItemsQueryKey(slug),
    queryFn: () => fetchAppItemBySlug(slug),
    ...appItemsCacheOptions,
    ...options,
  });

export const useGetAppItemBySlug = (
  slug: string,
  options?: Omit<
    UseQueryOptions<GetItemWithIncludesResponse>,
    "queryKey" | "queryFn"
  >,
) => {
  return useQuery({
    queryKey: appItemsQueryKey(slug),
    queryFn: () => fetchAppItemBySlug(slug),
    ...appItemsCacheOptions,
    ...options,
  });
};
