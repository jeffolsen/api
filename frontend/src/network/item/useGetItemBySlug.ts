import {
  useQuery,
  UseQueryOptions,
  UseQueryResult,
} from "@tanstack/react-query";
import { useAuthState } from "@/contexts/AuthContext";
import { GetItemWithIncludesResponse } from "./types";
import { fetchItemBySlug } from "./fetchers";
import app from "@/network/clients/app";
import { appItemsCacheOptions, appItemsQueryKey } from "../app/item";
import { cmsItemsQueryKey, cmsItemsCacheOptions } from "../cms/item";

interface UseGetItemBySlug {
  slug: string;
  clientType?: "user" | "app";
  options?: Omit<
    UseQueryOptions<GetItemWithIncludesResponse>,
    "queryKey" | "queryFn"
  >;
}

export const useGetItemBySlug = ({
  slug,
  clientType = "app",
  options,
}: UseGetItemBySlug): UseQueryResult<GetItemWithIncludesResponse> => {
  const { api } = useAuthState();
  const client = clientType === "user" ? api : app;
  const queryKey =
    clientType === "user" ? cmsItemsQueryKey(slug) : appItemsQueryKey(slug);
  const cacheOptions =
    clientType === "user" ? cmsItemsCacheOptions : appItemsCacheOptions;

  return useQuery({
    queryKey,
    queryFn: () => fetchItemBySlug(client, slug),
    ...cacheOptions,
    ...options,
  });
};
