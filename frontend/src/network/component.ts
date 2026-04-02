import { useMutation, useQueryClient } from "@tanstack/react-query";
import { TComponentType } from "./componentType";
import { TFeed } from "./feed";
import { useAuthState } from "../contexts/AuthContext";
import { COMPONENTS_ENDPOINT, withErrorHandling } from "./api";
import { FEEDS_KEY } from "./feed";

export const COMPONENTS_KEY = "components" as const;

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

export type ModifyComponentRequest = Partial<TComponentInput> & {
  feedId: TFeed["id"];
};

export const useModifyComponent = (componentId: number) => {
  const { api } = useAuthState();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: ModifyComponentRequest) =>
      withErrorHandling(async () => {
        console.log("Modifying component with data:", data);
        const response = await api.patch(
          `${COMPONENTS_ENDPOINT}/${componentId}`,
          data,
        );
        return response.data;
      }),
    onSuccess: (_, { feedId }) => {
      queryClient.invalidateQueries({
        queryKey: [FEEDS_KEY, feedId, COMPONENTS_KEY],
      });
    },
  });
};

export type TComponent = {
  id: number;
  typeId: TComponentType["id"];
  feedId: TFeed["id"];
  order: number;
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
