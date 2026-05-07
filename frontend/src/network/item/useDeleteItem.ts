import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ITEMS_ENDPOINT, withErrorHandling } from "@/network/api";
import { useAuthState } from "@/contexts/AuthContext";
import { ITEMS_KEY } from "./types";

export const useDeleteItem = () => {
  const { api } = useAuthState();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) =>
      withErrorHandling(async () => {
        const response = await api.delete(`${ITEMS_ENDPOINT}/${id}`);
        return response.data;
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ITEMS_KEY] });
    },
  });
};
