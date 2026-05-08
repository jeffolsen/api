import { useAuthState } from "@/contexts/AuthContext";
import { FEEDS_KEY } from "./types";
import { COMPONENTS_KEY, TComponent } from "../component/types";
import { useQuery } from "@tanstack/react-query";
import { COMPONENTS_ENDPOINT, FEEDS_ENDPOINT } from "../api";

export const useGetFeedComponents = (feedId: number) => {
  const { api } = useAuthState();

  return useQuery({
    queryKey: [FEEDS_KEY, feedId, COMPONENTS_KEY],
    queryFn: async (): Promise<{ components: TComponent[] }> => {
      const response = await api.get(
        `${FEEDS_ENDPOINT}/${feedId}${COMPONENTS_ENDPOINT}`,
      );
      return response.data;
    },
  });
};
