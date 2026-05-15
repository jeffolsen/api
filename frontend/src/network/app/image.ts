import { QueryClient, QueryOptions, useQuery } from "@tanstack/react-query";
import { IMAGES_ENDPOINT } from "@/network/clients/api";
import {
  GetImagesResponse,
  IMAGES_KEY,
  TImageType,
} from "@/network/image/types";
import { PaginationParams } from "@/network/clients/api";
import client, { APP_KEY, DAY, MIN } from "../clients/app";

export type TImageQueryParams = {
  type?: TImageType;
} & PaginationParams;

export const appImagesQueryKey = (queryParams?: TImageQueryParams) =>
  [APP_KEY, IMAGES_KEY, queryParams] as const;

export const appImagesCacheOptions = {
  staleTime: 30 * MIN,
  gcTime: DAY,
} as const;

export const fetchAppImages = async (
  queryParams?: TImageQueryParams,
): Promise<GetImagesResponse> => {
  const response = await client.get(IMAGES_ENDPOINT, {
    params: queryParams,
  });
  return response.data;
};

export const queryAppImages = (
  queryClient: QueryClient,
  queryParams?: TImageQueryParams,
) =>
  queryClient.fetchQuery({
    queryKey: appImagesQueryKey(queryParams),
    queryFn: () => fetchAppImages(queryParams),
    ...appImagesCacheOptions,
  });

export const useGetAppImages = (
  queryParams?: TImageQueryParams,
  options?: QueryOptions<GetImagesResponse>,
) =>
  useQuery({
    queryKey: appImagesQueryKey(queryParams),
    queryFn: () => fetchAppImages(queryParams),
    ...appImagesCacheOptions,
    ...options,
  });
