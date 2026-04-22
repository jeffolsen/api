import { QueryOptions, useQuery } from "@tanstack/react-query";
import { COMPONENT_TYPES_ENDPOINT } from "../api";
import { useAuthState } from "../../contexts/AuthContext";
import {
  GetComponentTypesResponse,
  TComponentTypesQueryParams,
  TGetComponentTypeByIdResponse,
} from "./types";

export const COMPONENT_TYPES_KEY = "componentsTypes" as const;

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

export const useGetComponentTypeById = (id: number) => {
  const { api } = useAuthState();

  return useQuery({
    queryKey: [COMPONENT_TYPES_KEY, id],
    queryFn: async (): Promise<TGetComponentTypeByIdResponse> => {
      const response = await api.get(`${COMPONENT_TYPES_ENDPOINT}/${id}`);
      return response.data;
    },
  });
};

export * from "./types";
