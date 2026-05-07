import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { ITEMS_ENDPOINT } from "@/network/api";
import { useAuthState } from "@/contexts/AuthContext";
import { ITEMS_KEY, GetItemsResponse, TItemQueryParams } from "./types";

export const useGetItems = (
  queryParams?: TItemQueryParams,
  options?: Omit<UseQueryOptions<GetItemsResponse>, "queryKey" | "queryFn">,
) => {
  const { api } = useAuthState();

  return useQuery({
    queryKey: [ITEMS_KEY, queryParams],
    queryFn: async (): Promise<GetItemsResponse> => {
      const response = await api.get(ITEMS_ENDPOINT, {
        params: {
          ...queryParams,
          ids: queryParams?.ids?.join(","),
          slugs: queryParams?.slugs?.join(","),
          tags: queryParams?.tags?.join(","),
          sort: queryParams?.sort?.join(","),
        },
      });
      return response.data;
    },
    ...options,
  });
};
