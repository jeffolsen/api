import { QueryClient, useQuery, UseQueryOptions } from "@tanstack/react-query";
import {
  GetFeedsWithIncludesResponse,
  GetFeedWithIncludesResponse,
  FEEDS_KEY,
  TFeedsParams,
  TSubjectType,
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

export const fetchAppFeedByPath = (path: string, subjectType: TSubjectType) =>
  fetchFeedByPath(client, path, subjectType);

export const queryAppFeedByPath = (
  queryClient: QueryClient,
  path: string,
  subjectType: TSubjectType,
  options?: Omit<
    UseQueryOptions<GetFeedWithIncludesResponse>,
    "queryKey" | "queryFn"
  >,
) =>
  queryClient.fetchQuery({
    queryKey: appFeedsQueryKey({ path, subjectType }),
    queryFn: () => fetchAppFeedByPath(path, subjectType),
    ...appFeedsCacheOptions,
    ...options,
  });

export const useGetAppFeedByPath = (
  path: string,
  subjectType: TSubjectType,
  options?: Omit<
    UseQueryOptions<GetFeedWithIncludesResponse>,
    "queryKey" | "queryFn"
  >,
) =>
  useQuery({
    queryKey: appFeedsQueryKey({ path, subjectType }),
    queryFn: () => fetchAppFeedByPath(path, subjectType),
    ...appFeedsCacheOptions,
    ...options,
  });
