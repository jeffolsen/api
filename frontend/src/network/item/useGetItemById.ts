import { useQuery } from "@tanstack/react-query";
import { ITEMS_ENDPOINT } from "@/network/api";
import { useAuthState } from "@/contexts/AuthContext";
import { ITEMS_KEY } from "./types";

export const useGetItemById = (id: number) => {
  const { api } = useAuthState();

  return useQuery({
    queryKey: [ITEMS_KEY, id],
    queryFn: async () => {
      const response = await api.get(`${ITEMS_ENDPOINT}/${id}`);
      return response.data;
    },
  });
};
