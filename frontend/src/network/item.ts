import {
  useMutation,
  useQuery,
  useQueryClient,
  QueryOptions,
} from "@tanstack/react-query";
import {
  ITEMS_ENDPOINT,
  withErrorHandling,
  TAGS_ENDPOINT,
  IMAGES_ENDPOINT,
  DATE_RANGES_ENDPOINT,
} from "./api";
import { TAGS_KEY, TTagInput, TTagName } from "./tag";
import { IMAGES_KEY, TImage } from "./image";
import { useAuthState } from "../contexts/AuthContext";
import { DATE_RANGES_KEY, TDateRangeInput } from "./dateRange";

export const ITEMS_KEY = "items" as const;

type GetItemsParams = {
  sort?: TItemSort[];
  page?: number;
  pageSize?: number;
  tags?: TTagName[];
};

export const useGetItems = (
  queryParams?: GetItemsParams,
  options?: QueryOptions,
) => {
  const { api } = useAuthState();

  return useQuery({
    queryKey: [ITEMS_KEY, queryParams],
    queryFn: async (): Promise<{ items: TItem[] }> => {
      const response = await api.get(ITEMS_ENDPOINT, { params: queryParams });
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

export type CreateItemRequest = {
  name?: string;
  description?: string;
  publishedAt?: string | null;
  expiredAt?: string | null;
  imageIds?: TImage["id"][];
  tagNames?: TTagInput["name"][];
  dateRanges?: TDateRangeInput[];
};

export const useCreateItem = () => {
  const { api } = useAuthState();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateItemRequest) =>
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
    mutationFn: async ({ id, data }: { id: number; data: CreateItemRequest }) =>
      withErrorHandling(async () => {
        console.log(`Updating item ${id} with data:`, data);
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
    mutationFn: async ({ id, data }: { id: number; data: CreateItemRequest }) =>
      withErrorHandling(async () => {
        console.log(`Modifying item ${id} with data:`, data);
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
        console.log(`Deleting item ${id}`);
        const response = await api.delete(`${ITEMS_ENDPOINT}/${id}`);
        return response.data;
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ITEMS_KEY] });
    },
  });
};

export type TItem = {
  id: number;
  name: string;
  description: string;
  sortName: string;
  publishedAt: string | null;
  expiredAt: string | null;
  authorId: number;
  createdAt: string;
  updatedAt: string;
};

export type TItemInput = Omit<TItem, "id" | "createdAt" | "updatedAt">;

export type TItemSort =
  | "createdAt"
  | "-createdAt"
  | "updatedAt"
  | "-updatedAt"
  | "publishedAt"
  | "-publishedAt"
  | "expiredAt"
  | "-expiredAt"
  | "sortName"
  | "-sortName";

export type TItemStatus = "published" | "unpublished" | "expired";

export type TItemQueryParams = {
  sort?: TItemSort;
  page?: number;
  pageSize?: number;
  limit?: number;
  tags?: TTagName[];
  status?: TItemStatus;
};
