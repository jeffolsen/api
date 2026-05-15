import { QueryClient, useQuery, UseQueryOptions } from "@tanstack/react-query";
import { FEED_PATH_ENDPOINT, FEEDS_ENDPOINT } from "@/network/api";
import {
  GetFeedsWithIncludesResponse,
  GetFeedWithIncludesResponse,
  FEEDS_KEY,
  FEED_INCLUDES,
  TFeedsParams,
  TSubjectType,
  TFeedParams,
} from "@/network/feed/types";
import client, { APP_KEY, DAY, MIN, headers, throwOnRateLimit } from "./client";

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

export const fetchAppFeeds = async (
  queryParams?: TFeedsParams,
): Promise<GetFeedsWithIncludesResponse> => {
  const response = await client.get(FEEDS_ENDPOINT, {
    headers,
    params: {
      ...queryParams,
      ids: queryParams?.ids?.join(","),
      paths: queryParams?.paths?.join(","),
      sort: queryParams?.sort?.join(","),
      subjectTypes: queryParams?.subjectTypes?.join(","),
      tags: queryParams?.tags?.join(","),
      includes: FEED_INCLUDES,
    },
  });
  return response.data;
};

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

export const fetchAppFeedByPath = async (
  path: string,
  subjectType: TSubjectType,
): Promise<GetFeedWithIncludesResponse> => {
  const response = await client.get(FEED_PATH_ENDPOINT, {
    headers,
    params: {
      path,
      includes: FEED_INCLUDES,
      subjectType,
    },
  });
  return response.data;
};

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
) => {
  return useQuery({
    queryKey: appFeedsQueryKey({ path, subjectType }),
    queryFn: () => fetchAppFeedByPath(path, subjectType),
    ...appFeedsCacheOptions,
    ...options,
  });
};
