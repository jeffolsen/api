import { useMutation, useQueryClient } from "@tanstack/react-query";
import { TComponentType } from "./componentType";
import { TFeed } from "./feed";
import { useAuthState } from "../contexts/AuthContext";
import { COMPONENTS_ENDPOINT, withErrorHandling } from "./api";
import { FEEDS_KEY } from "./feed";

export const COMPONENTS_KEY = "components" as const;

export type TComponent = {
  id: number;
  typeId: TComponentType["id"];
  feedId: TFeed["id"];
  order: number;
  name: string;
  propertyValues: Record<string, unknown>;
  publishedAt?: string | null;
  expiredAt?: string | null;
  createdAt: string;
  updatedAt: string;
};

export type TComponentInput = Omit<
  TComponent,
  "id" | "createdAt" | "updatedAt"
>;

export const useCreateComponent = () => {
  const { api } = useAuthState();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: TComponentInput) =>
      withErrorHandling(async () => {
        console.log("Creating component with data:", data);
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
        console.log(`Modifying component ${id} with data:`, data);
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

export type ModifyComponentRequest = Partial<TComponentInput> & {
  feedId: TFeed["id"];
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
        console.log(`Modifying component ${id} with data:`, data);
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
    mutationFn: async (id: number) =>
      withErrorHandling(async () => {
        console.log(`Deleting component ${id}`);
        const response = await api.delete(`${COMPONENTS_ENDPOINT}/${id}`);
        return response.data;
      }),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: [COMPONENTS_KEY, id] });
      queryClient.invalidateQueries({ queryKey: [COMPONENTS_KEY] });
    },
  });
};
