import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ITEMS_ENDPOINT, withErrorHandling } from "./api";
import { useAuthState } from "../contexts/AuthContext";

const ITEMS_KEY = "items" as const;

export const useGetItems = () => {
  const { api } = useAuthState();

  return useQuery({
    queryKey: [ITEMS_KEY],
    queryFn: async () => {
      const response = await api.get(ITEMS_ENDPOINT);
      return response.data;
    },
  });
};

export type CreateDateRange = {
  startAt: string;
  endAt: string;
};

export type CreateItemInput = {
  title?: string;
  subtitle?: string;
  content?: string;
  imageIds?: number[];
  tabNames?: string[];
  dateRanges?: CreateDateRange[];
};

export const useCreateItem = () => {
  const { api } = useAuthState();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateItemInput) =>
      withErrorHandling(async () => {
        console.log("Creating item with data:", data);
        return data;
        // const response = await api.post(ITEMS_ENDPOINT, data);
        // return response.data;
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ITEMS_KEY] });
    },
  });
};
