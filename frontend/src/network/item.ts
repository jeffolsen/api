import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ITEMS_ENDPOINT,
  withErrorHandling,
  TAGS_ENDPOINT,
  IMAGES_ENDPOINT,
  DATE_RANGES_ENDPOINT,
} from "./api";
import { TAGS_KEY } from "./tag";
import { IMAGES_KEY } from "./image";
import { useAuthState } from "../contexts/AuthContext";
import { DATE_RANGES_KEY, TDateRange } from "./dateRange";

export const ITEMS_KEY = "items" as const;

export const useGetItems = () => {
  const { api } = useAuthState();

  return useQuery({
    queryKey: [ITEMS_KEY],
    queryFn: async () => {
      const response = await api.get(ITEMS_ENDPOINT);
      return response.data;
    },
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

export type CreateItemInput = {
  name?: string;
  description?: string;
  publishedAt?: string | null;
  expiredAt?: string | null;
  imageIds?: number[];
  tagNames?: string[];
  dateRanges?: TDateRange[];
};

export const useCreateItem = () => {
  const { api } = useAuthState();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateItemInput) =>
      withErrorHandling(async () => {
        console.log("Creating item with data:", data);
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
    mutationFn: async ({ id, data }: { id: number; data: CreateItemInput }) =>
      withErrorHandling(async () => {
        console.log(`Editing item ${id} with data:`, data);
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

export interface Item {
  id: number;
  name: string;
  description: string;
  sortName: string;
  publishedAt: string | null;
  expiredAt: string | null;
  authorId: number;
  createdAt: string;
  updatedAt: string;
}
