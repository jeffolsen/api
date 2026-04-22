import { useMutation, useQueryClient } from "@tanstack/react-query";
import { FEEDS_KEY } from "../feed";
import { useAuthState } from "../../contexts/AuthContext";
import { COMPONENTS_ENDPOINT, withErrorHandling } from "../api";
import { TComponent, TComponentInput } from "./types";
import { TFeed } from "../feed/types";

export const COMPONENTS_KEY = "components" as const;

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

export * from "./types";
