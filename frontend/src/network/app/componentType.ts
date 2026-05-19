import { QueryClient, QueryOptions, useQuery } from "@tanstack/react-query";
import { COMPONENT_TYPES_ENDPOINT } from "@/network/clients/api";
import {
  TGetComponentTypesResponse,
  TGetComponentTypeByIdResponse,
  TComponentTypesQueryParams,
  COMPONENT_TYPES_KEY,
} from "@/network/componentType/types";
import client, { APP_KEY, DAY, MIN } from "../clients/app";

export const appComponentTypesQueryKey = (
  key?: TComponentTypesQueryParams | string | number,
) => [APP_KEY, COMPONENT_TYPES_KEY, key] as const;

export const appComponentTypesCacheOptions = {
  staleTime: 30 * MIN,
  gcTime: DAY,
} as const;

export const fetchAppComponentTypes = async (
  queryParams?: TComponentTypesQueryParams,
): Promise<TGetComponentTypesResponse> => {
  const response = await client.get(COMPONENT_TYPES_ENDPOINT, {
    params: queryParams,
  });
  return response.data;
};

export const queryAppComponentTypes = (
  queryClient: QueryClient,
  queryParams?: TComponentTypesQueryParams,
) =>
  queryClient.fetchQuery({
    queryKey: appComponentTypesQueryKey(queryParams),
    queryFn: () => fetchAppComponentTypes(queryParams),
    ...appComponentTypesCacheOptions,
  });

export const useGetAppComponentTypes = (
  queryParams?: TComponentTypesQueryParams,
  options?: QueryOptions<TGetComponentTypesResponse>,
) =>
  useQuery({
    queryKey: appComponentTypesQueryKey(queryParams),
    queryFn: () => fetchAppComponentTypes(queryParams),
    ...appComponentTypesCacheOptions,
    ...options,
  });

export const fetchAppComponentTypeById = async (
  id: number,
): Promise<TGetComponentTypeByIdResponse> => {
  const response = await client.get(`${COMPONENT_TYPES_ENDPOINT}/${id}`);
  return response.data;
};

export const queryAppComponentTypeById = (
  queryClient: QueryClient,
  id: number,
) =>
  queryClient.fetchQuery({
    queryKey: appComponentTypesQueryKey(id),
    queryFn: () => fetchAppComponentTypeById(id),
    ...appComponentTypesCacheOptions,
  });

export const useGetAppComponentTypeById = (
  id: number,
  options?: QueryOptions<TGetComponentTypeByIdResponse>,
) =>
  useQuery({
    queryKey: appComponentTypesQueryKey(id),
    queryFn: () => fetchAppComponentTypeById(id),
    ...appComponentTypesCacheOptions,
    ...options,
  });
