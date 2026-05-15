import { useMutation, useQueryClient } from "@tanstack/react-query";
import { FEEDS_KEY, TFeed } from "@/network/feed/types";
import { useAuthState } from "@/contexts/AuthContext";
import { COMPONENTS_ENDPOINT, withErrorHandling } from "@/network/clients/api";
import { COMPONENTS_KEY } from "@/network/component/types";

export const useDeleteComponent = () => {
  const { api } = useAuthState();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: { id: number; feedId: TFeed["id"] }) =>
      withErrorHandling(async () => {
        const response = await api.delete(
          `${COMPONENTS_ENDPOINT}/${params.id}`,
        );
        return response.data;
      }),
    onSuccess: (_, params) => {
      const { id, feedId } = params;
      queryClient.invalidateQueries({
        queryKey: [FEEDS_KEY, feedId, COMPONENTS_KEY, id],
      });
      queryClient.invalidateQueries({
        queryKey: [FEEDS_KEY, feedId, COMPONENTS_KEY],
      });
    },
  });
};
