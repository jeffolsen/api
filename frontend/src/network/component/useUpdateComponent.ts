import { useMutation, useQueryClient } from "@tanstack/react-query";
import { FEEDS_KEY } from "@/network/feed/types";
import { useAuthState } from "@/contexts/AuthContext";
import { COMPONENTS_ENDPOINT, withErrorHandling } from "@/network/api";
import {
  COMPONENTS_KEY,
  TComponent,
  TComponentInput,
} from "@/network/component/types";

export const useUpdateComponent = () => {
  const { api } = useAuthState();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: TComponentInput }) =>
      withErrorHandling(async (): Promise<TComponent> => {
        const response = await api.put(`${COMPONENTS_ENDPOINT}/${id}`, data);
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
