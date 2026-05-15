import { QueryClient, QueryOptions, useQuery } from "@tanstack/react-query";
import { TAGS_ENDPOINT } from "@/network/clients/api";
import { GetTagsResponse, TAGS_KEY } from "@/network/tag/types";
import client, { APP_KEY, DAY, MIN } from "../clients/app";

export const appTagsQueryKey = () => [APP_KEY, TAGS_KEY] as const;

export const appTagsCacheOptions = {
  staleTime: 30 * MIN,
  gcTime: DAY,
} as const;

export const fetchAppTags = async (): Promise<GetTagsResponse> => {
  const response = await client.get(TAGS_ENDPOINT);
  return response.data;
};

export const queryAppTags = (queryClient: QueryClient) =>
  queryClient.fetchQuery({
    queryKey: appTagsQueryKey(),
    queryFn: () => fetchAppTags(),
    ...appTagsCacheOptions,
  });

export const useGetAppTags = (options?: QueryOptions<GetTagsResponse>) =>
  useQuery({
    queryKey: appTagsQueryKey(),
    queryFn: () => fetchAppTags(),
    ...appTagsCacheOptions,
    ...options,
  });
