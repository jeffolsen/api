import { QueryClient, useQuery, UseQueryOptions } from "@tanstack/react-query";
import {
  GetItemsWithIncludesResponse,
  GetItemWithIncludesResponse,
  ITEMS_KEY,
  TItemQueryParams,
} from "@/network/item/types";
import { fetchItemBySlug, fetchItems } from "@/network/item/fetchers";
import client, { APP_KEY, DAY, MIN, throwOnRateLimit } from "../clients/app";

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

export const fetchAppItems = (queryParams?: TItemQueryParams) =>
  fetchItems(client, queryParams);

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

export const fetchAppItemBySlug = (slug: string) =>
  fetchItemBySlug(client, slug);

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
) =>
  useQuery({
    queryKey: appItemsQueryKey(slug),
    queryFn: () => fetchAppItemBySlug(slug),
    ...appItemsCacheOptions,
    ...options,
  });
