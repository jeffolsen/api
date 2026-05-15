import { useQuery } from "@tanstack/react-query";
import { FEEDS_ENDPOINT, TAGS_ENDPOINT } from "@/network/clients/api";
import { TAGS_KEY } from "@/network/tag/types";
import { useAuthState } from "@/contexts/AuthContext";
import { FEEDS_KEY } from "./types";

export const useGetFeedsTags = (id: number) => {
  const { api } = useAuthState();

  return useQuery({
    queryKey: [FEEDS_KEY, id, TAGS_KEY],
    queryFn: async () => {
      const response = await api.get(`${FEEDS_ENDPOINT}/${id}${TAGS_ENDPOINT}`);
      return response.data;
    },
  });
};
