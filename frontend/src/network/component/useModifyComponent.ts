import { useMutation, useQueryClient } from "@tanstack/react-query";
import { FEEDS_KEY, TFeed } from "@/network/feed/types";
import { useAuthState } from "@/contexts/AuthContext";
import { COMPONENTS_ENDPOINT, withErrorHandling } from "@/network/clients/api";
import {
  COMPONENTS_KEY,
  TComponent,
  TComponentInput,
} from "@/network/component/types";

export const useModifyComponent = () => {
  const { api } = useAuthState();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: number;
      data: Partial<TComponentInput> & { feedId: TFeed["id"] };
    }) =>
      withErrorHandling(async (): Promise<TComponent> => {
        const response = await api.patch(`${COMPONENTS_ENDPOINT}/${id}`, data);
        return response.data;
      }),
    onSuccess: (_, { data, id }) => {
      const feedId = data.feedId;
      queryClient.invalidateQueries({
        queryKey: [FEEDS_KEY, feedId, COMPONENTS_KEY, id],
      });
      queryClient.invalidateQueries({
        queryKey: [FEEDS_KEY, feedId, COMPONENTS_KEY],
      });
    },
  });
};
