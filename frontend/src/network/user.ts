import api, {
  COMPONENTS_ENDPOINT,
  FEEDS_ENDPOINT,
  ITEMS_ENDPOINT,
  REFRESH_ENDPOINT,
} from "@/network/api";
import { ITEMS_KEY } from "@/network/item";
import { FEEDS_KEY } from "@/network/feed";
import { COMPONENTS_KEY } from "@/network/component";

export const userFeedsQueryKey = (queryParams?: unknown) =>
  [FEEDS_KEY, queryParams] as const;

export const userItemQueryKey = (id: number) => [ITEMS_KEY, id] as const;
export const userFeedComponentsQueryKey = (feedId: number) =>
  [FEEDS_KEY, feedId, COMPONENTS_KEY] as const;

export const fetchUserFeeds = async () => {
  const response = await api.get(FEEDS_ENDPOINT, {
    params: {
      pageSize: 100,
    },
  });
  return response.data;
};

export const fetchUserFeedById = async (id: number) => {
  const response = await api.get(`${FEEDS_ENDPOINT}/${id}`, {
    params: {
      pageSize: 100,
    },
  });
  return response.data;
};

export const fetchUserFeedComponents = async (feedId: number) => {
  const response = await api.get(
    `${FEEDS_ENDPOINT}/${feedId}${COMPONENTS_ENDPOINT}`,
    {
      params: {
        published: true,
      },
    },
  );
  return response.data;
};

export const fetchUserItemById = async (id: number) => {
  const response = await api.get(`${ITEMS_ENDPOINT}/${id}`, {
    params: {
      pageSize: 100,
    },
  });
  return response.data;
};

export const fetchUserRefresh = async () => {
  const response = await api.post(REFRESH_ENDPOINT);
  return response.data;
};
