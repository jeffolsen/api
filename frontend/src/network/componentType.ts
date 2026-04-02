import { QueryOptions, useQuery } from "@tanstack/react-query";
import { COMPONENT_TYPES_ENDPOINT } from "./api";
import { useAuthState } from "../contexts/AuthContext";
import { TSubjectType } from "./feed";

export const COMPONENT_TYPES_KEY = "componentsTypes" as const;

export type TComponentTypesQueryParams = {
  subjectType?: TSubjectType;
};

export type GetComponentTypesResponse = {
  componentTypes: TComponentType[];
};

export const useGetComponentTypes = (
  queryParams?: TComponentTypesQueryParams,
  options?: QueryOptions,
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

export type TComponentNames =
  | "TeaserGrid"
  | "HeroCarousel"
  | "Detail"
  | "RelatedContent";

export type TComponentType = {
  id: number;
  name: TComponentNames;
  subjectType: TSubjectType;
  propertySchema: Record<string, unknown>;
};
