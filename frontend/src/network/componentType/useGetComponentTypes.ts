import { QueryOptions, useQuery } from "@tanstack/react-query";
import {
  COMPONENT_TYPES_KEY,
  GetComponentTypesResponse,
  TComponentTypesQueryParams,
} from "./types";
import { COMPONENT_TYPES_ENDPOINT } from "../api";
import { useAuthState } from "@/contexts/AuthContext";

export const useGetComponentTypes = (
  queryParams?: TComponentTypesQueryParams,
  options?: QueryOptions<GetComponentTypesResponse>,
) => {
  const { api } = useAuthState();

  return useQuery({
    queryKey: [COMPONENT_TYPES_KEY, queryParams],
    queryFn: async (): Promise<GetComponentTypesResponse> => {
      const response = await api.get(COMPONENT_TYPES_ENDPOINT, {
        params: queryParams,
      });
      return response.data;
    },
    ...options,
  });
};
