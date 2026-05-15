import { useAuthState } from "@/contexts/AuthContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { FEEDS_ENDPOINT, withErrorHandling } from "../clients/api";
import { FEEDS_KEY, TFeedInput } from "./types";

export const useUpdateFeed = () => {
  const { api } = useAuthState();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: TFeedInput }) =>
      withErrorHandling(async () => {
        const response = await api.put(`${FEEDS_ENDPOINT}/${id}`, data);
        return response.data;
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [FEEDS_KEY] });
    },
  });
};
