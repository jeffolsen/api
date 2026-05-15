import { useAuthState } from "@/contexts/AuthContext";
import { FEEDS_ENDPOINT } from "../api";
import { FEED_INCLUDES, FEEDS_KEY } from "./types";
import { useQuery } from "@tanstack/react-query";

export const useGetFeedById = (id: number) => {
  const { api } = useAuthState();

  return useQuery({
    queryKey: [FEEDS_KEY, id],
    queryFn: async () => {
      const response = await api.get(`${FEEDS_ENDPOINT}/${id}`, {
        params: {
          includes: FEED_INCLUDES,
        },
      });
      return response.data;
    },
  });
};
