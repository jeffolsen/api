import {
  useMutation,
  useQuery,
  useQueryClient,
  QueryOptions,
} from "@tanstack/react-query";
import { FEEDS_ENDPOINT, COMPONENTS_ENDPOINT } from "./api";
import { TComponent, TComponentInput, COMPONENTS_KEY } from "./component";
import { useAuthState } from "../contexts/AuthContext";

export const FEEDS_KEY = "feeds" as const;

export const useGetFeeds = (options?: QueryOptions) => {
  const { api } = useAuthState();

  return useQuery({
    queryKey: [FEEDS_KEY],
    queryFn: async (): Promise<{ feeds: TFeed[] }> => {
      const response = await api.get(FEEDS_ENDPOINT);
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
      const response = await api.get(`${FEEDS_ENDPOINT}/by-path/${path}`);
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
    mutationFn: async (data: TFeedInput) => {
      const response = await api.post(FEEDS_ENDPOINT, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [FEEDS_KEY] });
    },
  });
};

export type TFeed = {
  id: number;
  path: string;
  components: TComponent[];
  publishedAt?: string | null;
  expiredAt?: string | null;
  createdAt: string;
  updatedAt: string;
};

export type TFeedInput = Omit<TFeed, "id" | "createdAt" | "updatedAt"> & {
  components: TComponentInput[];
};
