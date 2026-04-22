import {
  useMutation,
  useQuery,
  useQueryClient,
  UseQueryOptions,
} from "@tanstack/react-query";
import {
  ITEMS_ENDPOINT,
  withErrorHandling,
  TAGS_ENDPOINT,
  IMAGES_ENDPOINT,
  DATE_RANGES_ENDPOINT,
} from "../api";
import { TAGS_KEY } from "../tag";
import { IMAGES_KEY } from "../image";
import { useAuthState } from "../../contexts/AuthContext";
import { DATE_RANGES_KEY } from "../dataRange/types";
import {
  GetItemsResponse,
  TItemInput,
  TItemQueryParams,
  TItemRelations,
} from "./types";

export const ITEMS_KEY = "items" as const;

export const useGetItems = (
  queryParams?: TItemQueryParams,
  options?: Omit<UseQueryOptions<GetItemsResponse>, "queryKey" | "queryFn">,
) => {
  const { api } = useAuthState();

  return useQuery({
    queryKey: [ITEMS_KEY, queryParams],
    queryFn: async (): Promise<GetItemsResponse> => {
      const response = await api.get(ITEMS_ENDPOINT, {
        params: {
          ...queryParams,
          ids: queryParams?.ids?.join(","),
          tags: queryParams?.tags?.join(","),
          sort: queryParams?.sort?.join(","),
        },
      });
      return response.data;
    },
    ...options,
  });
};

export const useGetItemById = (id: number) => {
  const { api } = useAuthState();

  return useQuery({
    queryKey: [ITEMS_KEY, id],
    queryFn: async () => {
      const response = await api.get(`${ITEMS_ENDPOINT}/${id}`);
      return response.data;
    },
  });
};

export const useGetItemsTags = (id: number) => {
  const { api } = useAuthState();

  return useQuery({
    queryKey: [ITEMS_KEY, id, TAGS_KEY],
    queryFn: async () => {
      const response = await api.get(`${ITEMS_ENDPOINT}/${id}${TAGS_ENDPOINT}`);
      return response.data;
    },
  });
};

export const useGetItemImages = (id: number) => {
  const { api } = useAuthState();

  return useQuery({
    queryKey: [ITEMS_KEY, id, IMAGES_KEY],
    queryFn: async () => {
      const response = await api.get(
        `${ITEMS_ENDPOINT}/${id}${IMAGES_ENDPOINT}`,
      );
      return response.data;
    },
  });
};

export const useGetItemDateRanges = (id: number) => {
  const { api } = useAuthState();

  return useQuery({
    queryKey: [ITEMS_KEY, id, DATE_RANGES_KEY],
    queryFn: async () => {
      const response = await api.get(
        `${ITEMS_ENDPOINT}/${id}${DATE_RANGES_ENDPOINT}`,
      );
      return response.data;
    },
  });
};

export const useCreateItem = () => {
  const { api } = useAuthState();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: TItemInput & TItemRelations) =>
      withErrorHandling(async () => {
        const response = await api.post(ITEMS_ENDPOINT, data);
        return response.data;
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ITEMS_KEY] });
    },
  });
};

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

export const useDeleteItem = () => {
  const { api } = useAuthState();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) =>
      withErrorHandling(async () => {
        const response = await api.delete(`${ITEMS_ENDPOINT}/${id}`);
        return response.data;
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ITEMS_KEY] });
    },
  });
};

export * from "./types";
