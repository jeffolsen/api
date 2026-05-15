import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { ITEMS_ENDPOINT } from "@/network/api";
import { useAuthState } from "@/contexts/AuthContext";
import {
  ITEMS_KEY,
  ITEM_INCLUDES,
  GetItemsWithIncludesResponse,
  TItemQueryParams,
} from "./types";

export const useGetItems = (
  queryParams?: TItemQueryParams,
  options?: Omit<
    UseQueryOptions<GetItemsWithIncludesResponse>,
    "queryKey" | "queryFn"
  >,
) => {
  const { api } = useAuthState();

  return useQuery({
    queryKey: [ITEMS_KEY, queryParams],
    queryFn: async (): Promise<GetItemsWithIncludesResponse> => {
      const response = await api.get(ITEMS_ENDPOINT, {
        params: {
          ...queryParams,
          ids: queryParams?.ids?.join(","),
          slugs: queryParams?.slugs?.join(","),
          tags: queryParams?.tags?.join(","),
          sort: queryParams?.sort?.join(","),
          includes: ITEM_INCLUDES,
        },
      });
      return response.data;
    },
    ...options,
  });
};
