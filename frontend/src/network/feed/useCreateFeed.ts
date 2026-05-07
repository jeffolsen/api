import { useAuthState } from "@/contexts/AuthContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { FEEDS_ENDPOINT, withErrorHandling } from "../api";
import { FEEDS_KEY, TFeedInput } from "./types";

export const useCreateFeed = () => {
  const { api } = useAuthState();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: TFeedInput) =>
      withErrorHandling(async () => {
        const response = await api.post(FEEDS_ENDPOINT, data);
        return response.data;
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [FEEDS_KEY] });
    },
  });
};
