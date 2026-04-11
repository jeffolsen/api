import {
  useMutation,
  useQuery,
  useQueryClient,
  QueryOptions,
} from "@tanstack/react-query";
import {
  FEEDS_ENDPOINT,
  COMPONENTS_ENDPOINT,
  withErrorHandling,
  PaginationParams,
  FEED_PATH_ENDPOINT,
} from "./api";
import { TComponent, COMPONENTS_KEY, TComponentWithType } from "./component";
import { useAuthState } from "../contexts/AuthContext";
import { GetItemsResponse } from "./item";

export const FEEDS_KEY = "feeds" as const;

export type GetFeedsResponse = {
  feeds: TFeed[];
  totalCount: number;
};

export const useGetFeeds = (
  queryParams?: TFeedsParams,
  options?: QueryOptions,
) => {
  const { api } = useAuthState();

  return useQuery({
    queryKey: [FEEDS_KEY, queryParams],
    queryFn: async (): Promise<GetItemsResponse> => {
      const response = await api.get(FEEDS_ENDPOINT, {
        params: {
          ...queryParams,
          sort: queryParams?.sort?.join(","),
          subjectTypes: queryParams?.subjectTypes?.join(","),
        },
      });
      return response.data;
    },
    ...options,
  });
};

export const useGetFeedByPath = (path: string) => {
  const { api } = useAuthState();

  return useQuery({
    queryKey: [FEEDS_KEY, path],
    queryFn: async () => {
      const response = await api.get(`${FEED_PATH_ENDPOINT}/${path}`);
      return response.data;
    },
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
    mutationFn: async ({ id, data }: { id: number; data: TFeedInput }) =>
      withErrorHandling(async () => {
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

export type TSubjectType = "COLLECTION" | "SINGLE";

export type TFeedSort =
  | "createdAt"
  | "-createdAt"
  | "updatedAt"
  | "-updatedAt"
  | "publishedAt"
  | "-publishedAt"
  | "expiredAt"
  | "-expiredAt";

export type TFeedsParams = {
  sort?: TFeedSort[];
  subjectTypes?: TSubjectType[];
} & PaginationParams;

export type TFeed = {
  id: number;
  path: string;
  subjectType: TSubjectType;
  publishedAt: string | null;
  expiredAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type TFeedInput = Omit<TFeed, "id" | "createdAt" | "updatedAt">;

export type TFeedWithComponents = TFeed & {
  components: TComponent[];
};

export type TFeedWithComponentsWithTypes = TFeed & {
  components: TComponentWithType[];
};
