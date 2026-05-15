import { useQuery } from "@tanstack/react-query";
import { ITEMS_ENDPOINT } from "@/network/clients/api";
import { useAuthState } from "@/contexts/AuthContext";
import { ITEMS_KEY, ITEM_INCLUDES } from "./types";

export const useGetItemById = (id: number) => {
  const { api } = useAuthState();

  return useQuery({
    queryKey: [ITEMS_KEY, id],
    queryFn: async () => {
      const response = await api.get(`${ITEMS_ENDPOINT}/${id}`, {
        params: { includes: ITEM_INCLUDES },
      });
      return response.data;
    },
  });
};
