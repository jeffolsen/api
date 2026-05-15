import { useQuery } from "@tanstack/react-query";
import { COMPONENT_TYPES_ENDPOINT } from "@/network/clients/api";
import { useAuthState } from "@/contexts/AuthContext";
import {
  COMPONENT_TYPES_KEY,
  TGetComponentTypeByIdResponse,
} from "@/network/componentType/types";

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
