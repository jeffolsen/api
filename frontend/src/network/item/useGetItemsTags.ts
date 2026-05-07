import { useQuery } from "@tanstack/react-query";
import { ITEMS_ENDPOINT, TAGS_ENDPOINT } from "@/network/api";
import { TAGS_KEY } from "@/network/tag/types";
import { useAuthState } from "@/contexts/AuthContext";
import { ITEMS_KEY } from "./types";

export const useGetItemsTags = (id: number) => {
  const { api } = useAuthState();

  return useQuery({
    queryKey: [ITEMS_KEY, id, TAGS_KEY],
    queryFn: async () => {
      const response = await api.get(`${ITEMS_ENDPOINT}/${id}${TAGS_ENDPOINT}`);
      return response.data;
    },
  });
};
