import { useQuery } from "@tanstack/react-query";
import { COMPONENT_TYPES_ENDPOINT } from "./api";
import { useAuthState } from "../contexts/AuthContext";
import { TSubjectType } from "./feed";

export const COMPONENT_TYPES_KEY = "componentsTypes" as const;

export const useGetComponentTypes = () => {
  const { api } = useAuthState();

  return useQuery({
    queryKey: [COMPONENT_TYPES_KEY],
    queryFn: async () => {
      const response = await api.get(COMPONENT_TYPES_ENDPOINT);
      return response.data;
    },
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
  updatedAt: string;
};
