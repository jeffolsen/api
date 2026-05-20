import { QueryClient } from "@tanstack/react-query";
import api, { CMS_KEY } from "@/network/clients/api";
import { FEEDS_KEY, TFeedParams } from "@/network/feed/types";
import { fetchFeedByPath } from "@/network/feed/fetchers";

export const cmsFeedByPathQueryKey = (queryParams: TFeedParams) =>
  [CMS_KEY, FEEDS_KEY, queryParams] as const;

export const queryCmsFeedByPath = (
  queryClient: QueryClient,
  queryParams: TFeedParams,
) =>
  queryClient.fetchQuery({
    queryKey: cmsFeedByPathQueryKey(queryParams),
    queryFn: () => fetchFeedByPath(api, queryParams),
    staleTime: 0,
  });
