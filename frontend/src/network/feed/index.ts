import {
  useMutation,
  useQuery,
  useQueryClient,
  UseQueryOptions,
} from "@tanstack/react-query";
import { FEEDS_ENDPOINT, COMPONENTS_ENDPOINT, withErrorHandling } from "../api";
import { COMPONENTS_KEY } from "../component";
import { useAuthState } from "../../contexts/AuthContext";
import { GetFeedsResponse, TFeedInput, TFeedsParams } from "./types";
import { TComponent } from "../component/types";

export const FEEDS_KEY = "feeds" as const;

export const useGetFeeds = (
  queryParams?: TFeedsParams,
  options?: Omit<UseQueryOptions<GetFeedsResponse>, "queryKey" | "queryFn">,
) => {
  const { api } = useAuthState();

  return useQuery({
    queryKey: [FEEDS_KEY, queryParams],
    queryFn: async (): Promise<GetFeedsResponse> => {
      const response = await api.get(FEEDS_ENDPOINT, {
        params: {
          ...queryParams,
          sort: queryParams?.sort?.join(","),
          ids: queryParams?.ids?.join(","),
          subjectTypes: queryParams?.subjectTypes?.join(","),
        },
      });
      return response.data;
    },
    ...options,
  });
};

export const useGetFeedById = (id: number) => {
  const { api } = useAuthState();

  return useQuery({
    queryKey: [FEEDS_KEY, id],
    queryFn: async () => {
      const response = await api.get(`${FEEDS_ENDPOINT}/${id}`);
      return response.data;
    },
  });
};

export const useGetFeedComponents = (feedId: number) => {
  const { api } = useAuthState();

  return useQuery({
    queryKey: [FEEDS_KEY, feedId, COMPONENTS_KEY],
    queryFn: async (): Promise<{ components: TComponent[] }> => {
      const response = await api.get(
        `${FEEDS_ENDPOINT}/${feedId}${COMPONENTS_ENDPOINT}`,
      );
      return response.data;
    },
  });
};

export const useCreateFeed = () => {
  const { api } = useAuthState();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: TFeedInput) =>
      withErrorHandling(async () => {
        const response = await api.post(FEEDS_ENDPOINT, data);
        return response.data;
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [FEEDS_KEY] });
    },
  });
};

export const useUpdateFeed = () => {
  const { api } = useAuthState();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: TFeedInput }) =>
      withErrorHandling(async () => {
        const response = await api.put(`${FEEDS_ENDPOINT}/${id}`, data);
        return response.data;
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [FEEDS_KEY] });
    },
  });
};

export const useModifyFeed = () => {
  const { api } = useAuthState();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: number;
      data: Partial<TFeedInput>;
    }) =>
      withErrorHandling(async () => {
        console.log("Modifying feed with data:", data);
        const response = await api.patch(`${FEEDS_ENDPOINT}/${id}`, data);
        return response.data;
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [FEEDS_KEY] });
    },
  });
};

export const useDeleteFeed = () => {
  const { api } = useAuthState();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) =>
      withErrorHandling(async () => {
        const response = await api.delete(`${FEEDS_ENDPOINT}/${id}`);
        return response.data;
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [FEEDS_KEY] });
    },
  });
};

export * from "./types";
