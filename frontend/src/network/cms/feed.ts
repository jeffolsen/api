import { QueryClient } from "@tanstack/react-query";
import api from "@/network/clients/api";
import { FEEDS_KEY, TSubjectType } from "@/network/feed/types";
import { fetchFeedByPath } from "@/network/feed/fetchers";

export const CMS_KEY = "cms" as const;

export const cmsFeedByPathQueryKey = (
  path: string,
  subjectType: TSubjectType,
) => [CMS_KEY, FEEDS_KEY, path, subjectType] as const;

export const queryCmsFeedByPath = (
  queryClient: QueryClient,
  path: string,
  subjectType: TSubjectType,
) =>
  queryClient.fetchQuery({
    queryKey: cmsFeedByPathQueryKey(path, subjectType),
    queryFn: () => fetchFeedByPath(api, path, subjectType),
    staleTime: 0,
  });
