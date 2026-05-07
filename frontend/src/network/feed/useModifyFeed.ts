import { useAuthState } from "@/contexts/AuthContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { FEEDS_KEY, TFeedInput } from "./types";
import { FEEDS_ENDPOINT, withErrorHandling } from "../api";

export const useModifyFeed = () => {
  const { api } = useAuthState();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: number;
      data: Partial<TFeedInput>;
    }) =>
      withErrorHandling(async () => {
        console.log("Modifying feed with data:", data);
        const response = await api.patch(`${FEEDS_ENDPOINT}/${id}`, data);
        return response.data;
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [FEEDS_KEY] });
    },
  });
};
