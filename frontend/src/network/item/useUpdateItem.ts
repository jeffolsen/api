import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ITEMS_ENDPOINT, withErrorHandling } from "@/network/api";
import { TAGS_KEY } from "@/network/tag/types";
import { IMAGES_KEY } from "@/network/image";
import { DATE_RANGES_KEY } from "@/network/dateRange/types";
import { useAuthState } from "@/contexts/AuthContext";
import { ITEMS_KEY, TItemInput, TItemRelations } from "./types";

export const useUpdateItem = () => {
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
        const response = await api.put(`${ITEMS_ENDPOINT}/${id}`, data);
        return response.data;
      }),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: [ITEMS_KEY, id, TAGS_KEY] });
      queryClient.invalidateQueries({ queryKey: [ITEMS_KEY, id, IMAGES_KEY] });
      queryClient.invalidateQueries({
        queryKey: [ITEMS_KEY, id, DATE_RANGES_KEY],
      });
      queryClient.invalidateQueries({ queryKey: [ITEMS_KEY, id] });
      queryClient.invalidateQueries({ queryKey: [ITEMS_KEY] });
    },
  });
};
