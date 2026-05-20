import { AxiosInstance } from "axios";
import { FEED_PATH_ENDPOINT, FEEDS_ENDPOINT } from "@/network/clients/api";
import {
  GetFeedsWithIncludesResponse,
  GetFeedWithIncludesResponse,
  FEED_INCLUDES,
  TFeedsParams,
  TFeedParams,
} from "./types";

export const fetchFeedByPath = (
  client: AxiosInstance,
  queryParams: TFeedParams,
): Promise<GetFeedWithIncludesResponse> =>
  client
    .get(FEED_PATH_ENDPOINT, {
      params: { ...queryParams, includes: FEED_INCLUDES },
    })
    .then((r) => r.data);

export const fetchFeeds = (
  client: AxiosInstance,
  queryParams?: TFeedsParams,
): Promise<GetFeedsWithIncludesResponse> =>
  client
    .get(FEEDS_ENDPOINT, {
      params: {
        ...queryParams,
        ids: queryParams?.ids?.join(","),
        paths: queryParams?.paths?.join(","),
        sort: queryParams?.sort?.join(","),
        subjectTypes: queryParams?.subjectTypes?.join(","),
        tags: queryParams?.tags?.join(","),
        includes: FEED_INCLUDES,
      },
    })
    .then((r) => r.data);
