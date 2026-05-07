import { useAuthState } from "@/contexts/AuthContext";
import { GetFeedsResponse, TFeedsParams } from "./types";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { FEEDS_ENDPOINT } from "../api";
import { FEEDS_KEY } from "./types";

export const useGetFeeds = (
  queryParams?: TFeedsParams,
  options?: Omit<UseQueryOptions<GetFeedsResponse>, "queryKey" | "queryFn">,
) => {
  const { api } = useAuthState();

  return useQuery({
    queryKey: [FEEDS_KEY, queryParams],
    queryFn: async (): Promise<GetFeedsResponse> => {
      const response = await api.get(FEEDS_ENDPOINT, {
        params: {
          ...queryParams,
          sort: queryParams?.sort?.join(","),
          ids: queryParams?.ids?.join(","),
          paths: queryParams?.ids?.join(","),
          subjectTypes: queryParams?.subjectTypes?.join(","),
        },
      });
      return response.data;
    },
    ...options,
  });
};
