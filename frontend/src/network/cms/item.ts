import { QueryClient } from "@tanstack/react-query";
import api, { CMS_KEY } from "@/network/clients/api";
import { ITEMS_KEY, TItemQueryParams } from "@/network/item/types";
import { fetchItemBySlug } from "@/network/item/fetchers";

export const cmsItemsCacheOptions = {
  staleTime: 0,
  throwOnError: true,
} as const;

export const cmsItemsQueryKey = (key?: TItemQueryParams | string | number) =>
  [CMS_KEY, ITEMS_KEY, key] as const;

export const queryCmsItemBySlug = (queryClient: QueryClient, slug: string) =>
  queryClient.fetchQuery({
    queryKey: cmsItemsQueryKey(slug),
    queryFn: () => fetchItemBySlug(api, slug),
    staleTime: 0,
  });
