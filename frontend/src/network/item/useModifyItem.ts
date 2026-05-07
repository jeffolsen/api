import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ITEMS_ENDPOINT, withErrorHandling } from "@/network/api";
import { useAuthState } from "@/contexts/AuthContext";
import { ITEMS_KEY, TItemInput, TItemRelations } from "./types";

export const useModifyItem = () => {
  const { api } = useAuthState();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: number;
      data: Partial<TItemInput & TItemRelations>;
    }) =>
      withErrorHandling(async () => {
        const response = await api.patch(`${ITEMS_ENDPOINT}/${id}`, data);
        return response.data;
      }),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: [ITEMS_KEY, id] });
      queryClient.invalidateQueries({ queryKey: [ITEMS_KEY] });
    },
  });
};
