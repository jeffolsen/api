import { useQuery } from "@tanstack/react-query";
import { ITEMS_ENDPOINT, DATE_RANGES_ENDPOINT } from "@/network/api";
import { DATE_RANGES_KEY } from "@/network/dateRange/types";
import { useAuthState } from "@/contexts/AuthContext";
import { ITEMS_KEY } from "./types";

export const useGetItemDateRanges = (id: number) => {
  const { api } = useAuthState();

  return useQuery({
    queryKey: [ITEMS_KEY, id, DATE_RANGES_KEY],
    queryFn: async () => {
      const response = await api.get(
        `${ITEMS_ENDPOINT}/${id}${DATE_RANGES_ENDPOINT}`,
      );
      return response.data;
    },
  });
};
