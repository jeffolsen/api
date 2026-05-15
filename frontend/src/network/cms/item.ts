import { QueryClient } from "@tanstack/react-query";
import api from "@/network/clients/api";
import { ITEMS_KEY } from "@/network/item/types";
import { fetchItemBySlug } from "@/network/item/fetchers";
import { CMS_KEY } from "./feed";

export const cmsItemBySlugQueryKey = (slug: string) =>
  [CMS_KEY, ITEMS_KEY, slug] as const;

export const queryCmsItemBySlug = (queryClient: QueryClient, slug: string) =>
  queryClient.fetchQuery({
    queryKey: cmsItemBySlugQueryKey(slug),
    queryFn: () => fetchItemBySlug(api, slug),
    staleTime: 0,
  });
