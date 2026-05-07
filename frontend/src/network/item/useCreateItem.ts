import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ITEMS_ENDPOINT, withErrorHandling } from "@/network/api";
import { useAuthState } from "@/contexts/AuthContext";
import { ITEMS_KEY, TItemInput, TItemRelations } from "./types";

export const useCreateItem = () => {
  const { api } = useAuthState();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: TItemInput & TItemRelations) =>
      withErrorHandling(async () => {
        const response = await api.post(ITEMS_ENDPOINT, data);
        return response.data;
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ITEMS_KEY] });
    },
  });
};
