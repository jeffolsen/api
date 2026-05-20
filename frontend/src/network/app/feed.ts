import { QueryClient, useQuery, UseQueryOptions } from "@tanstack/react-query";
import {
  GetFeedsWithIncludesResponse,
  GetFeedWithIncludesResponse,
  FEEDS_KEY,
  TFeedsParams,
  TFeedParams,
} from "@/network/feed/types";
import { fetchFeedByPath, fetchFeeds } from "@/network/feed/fetchers";
import client, { APP_KEY, DAY, MIN, throwOnRateLimit } from "../clients/app";

export const appFeedsQueryKey = (
  key?: TFeedParams | TFeedsParams | string | number,
) => [APP_KEY, FEEDS_KEY, key] as const;

export const appFeedsCacheOptions = {
  staleTime: 5 * MIN,
  gcTime: DAY,
  throwOnError: throwOnRateLimit,
} as const;

/*
 * get all feeds
 */

export const fetchAppFeeds = (queryParams?: TFeedsParams) =>
  fetchFeeds(client, queryParams);

export const queryAppFeeds = (
  queryClient: QueryClient,
  queryParams?: TFeedsParams,
  options?: Omit<
    UseQueryOptions<GetFeedsWithIncludesResponse>,
    "queryKey" | "queryFn"
  >,
) =>
  queryClient.fetchQuery({
    queryKey: appFeedsQueryKey(queryParams),
    queryFn: () => fetchAppFeeds(queryParams),
    ...appFeedsCacheOptions,
    ...options,
  });

export const useGetAppFeeds = (
  queryParams?: TFeedsParams,
  options?: Omit<
    UseQueryOptions<GetFeedsWithIncludesResponse>,
    "queryKey" | "queryFn"
  >,
) =>
  useQuery({
    queryKey: appFeedsQueryKey(queryParams),
    queryFn: () => fetchAppFeeds(queryParams),
    ...appFeedsCacheOptions,
    ...options,
  });

/*
 * get feed by path
 */

export const fetchAppFeedByPath = (queryParams: TFeedParams) =>
  fetchFeedByPath(client, { ...queryParams, liveOnly: true });

export const queryAppFeedByPath = (
  queryClient: QueryClient,
  queryParams: TFeedParams,
  options?: Omit<
    UseQueryOptions<GetFeedWithIncludesResponse>,
    "queryKey" | "queryFn"
  >,
) =>
  queryClient.fetchQuery({
    queryKey: appFeedsQueryKey(queryParams),
    queryFn: () => fetchAppFeedByPath(queryParams),
    ...appFeedsCacheOptions,
    ...options,
  });

export const useGetAppFeedByPath = (
  queryParams: TFeedParams,
  options?: Omit<
    UseQueryOptions<GetFeedWithIncludesResponse>,
    "queryKey" | "queryFn"
  >,
) =>
  useQuery({
    queryKey: appFeedsQueryKey(queryParams),
    queryFn: () => fetchAppFeedByPath(queryParams),
    ...appFeedsCacheOptions,
    ...options,
  });
