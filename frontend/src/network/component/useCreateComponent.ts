import { useMutation, useQueryClient } from "@tanstack/react-query";
import { FEEDS_KEY } from "@/network/feed/types";
import { useAuthState } from "@/contexts/AuthContext";
import { COMPONENTS_ENDPOINT, withErrorHandling } from "@/network/api";
import { COMPONENTS_KEY, TComponentInput } from "@/network/component/types";

export const useCreateComponent = () => {
  const { api } = useAuthState();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: TComponentInput) =>
      withErrorHandling(async () => {
        const response = await api.post(COMPONENTS_ENDPOINT, data);
        return response.data;
      }),
    onSuccess: (_, { feedId }) => {
      queryClient.invalidateQueries({
        queryKey: [FEEDS_KEY, feedId, COMPONENTS_KEY],
      });
    },
  });
};
