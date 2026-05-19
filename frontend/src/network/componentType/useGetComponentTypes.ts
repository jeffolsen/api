import { QueryOptions, useQuery } from "@tanstack/react-query";
import {
  COMPONENT_TYPES_KEY,
  TGetComponentTypesResponse,
  TComponentTypesQueryParams,
} from "./types";
import { COMPONENT_TYPES_ENDPOINT } from "../clients/api";
import { useAuthState } from "@/contexts/AuthContext";

export const useGetComponentTypes = (
  queryParams?: TComponentTypesQueryParams,
  options?: QueryOptions<TGetComponentTypesResponse>,
) => {
  const { api } = useAuthState();

  return useQuery({
    queryKey: [COMPONENT_TYPES_KEY, queryParams],
    queryFn: async (): Promise<TGetComponentTypesResponse> => {
      const response = await api.get(COMPONENT_TYPES_ENDPOINT, {
        params: queryParams,
      });
      return response.data;
    },
    ...options,
  });
};
