import { QueryClient } from "@tanstack/react-query";
import api, { CMS_KEY } from "@/network/clients/api";
import { ITEMS_KEY, TItemQueryParams, GetItemWithIncludesResponse } from "@/network/item/types";
import { fetchItemBySlug, fetchItems } from "@/network/item/fetchers";

export const PREVIEW_ITEM_SENTINEL = "item";

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

export const queryCmsAnyItem = (queryClient: QueryClient) =>
  queryClient.fetchQuery<GetItemWithIncludesResponse>({
    queryKey: cmsItemsQueryKey(PREVIEW_ITEM_SENTINEL),
    queryFn: async () => {
      const response = await fetchItems(api, { pageSize: 1 });
      const item = response.items[0];
      if (!item) throw new Error("No items found");
      return { item };
    },
    staleTime: 0,
  });
