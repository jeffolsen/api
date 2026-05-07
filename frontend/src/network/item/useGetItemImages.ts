import { useQuery } from "@tanstack/react-query";
import { ITEMS_ENDPOINT, IMAGES_ENDPOINT } from "@/network/api";
import { IMAGES_KEY } from "@/network/image";
import { useAuthState } from "@/contexts/AuthContext";
import { ITEMS_KEY } from "./types";

export const useGetItemImages = (id: number) => {
  const { api } = useAuthState();

  return useQuery({
    queryKey: [ITEMS_KEY, id, IMAGES_KEY],
    queryFn: async () => {
      const response = await api.get(
        `${ITEMS_ENDPOINT}/${id}${IMAGES_ENDPOINT}`,
      );
      return response.data;
    },
  });
};
