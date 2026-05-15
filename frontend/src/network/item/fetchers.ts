import { AxiosInstance } from "axios";
import { ITEM_SLUG_ENDPOINT, ITEMS_ENDPOINT } from "@/network/clients/api";
import {
  GetItemsWithIncludesResponse,
  GetItemWithIncludesResponse,
  ITEM_INCLUDES,
  TItemQueryParams,
} from "./types";

export const fetchItemBySlug = (
  client: AxiosInstance,
  slug: string,
): Promise<GetItemWithIncludesResponse> =>
  client
    .get(`${ITEM_SLUG_ENDPOINT}/${slug}`, {
      params: { includes: ITEM_INCLUDES },
    })
    .then((r) => r.data);

export const fetchItems = (
  client: AxiosInstance,
  queryParams?: TItemQueryParams,
): Promise<GetItemsWithIncludesResponse> =>
  client
    .get(ITEMS_ENDPOINT, {
      params: {
        ...queryParams,
        ids: queryParams?.ids?.join(","),
        slugs: queryParams?.slugs?.join(","),
        tags: queryParams?.tags?.join(","),
        sort: queryParams?.sort?.join(","),
        includes: ITEM_INCLUDES,
      },
    })
    .then((r) => r.data);
