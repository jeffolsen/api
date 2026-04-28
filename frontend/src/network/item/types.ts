import { PaginationParams } from "@/network/api";
import { TDateRangeInput } from "@/network/dateRange/types";
import { TImage } from "@/network/image/types";
import { TTagInput, TTagName } from "@/network/tag/types";

export type TItem = {
  id: number;
  name: string;
  slug: string;
  description?: string;
  sortName: string;
  overrideLink?: string;
  publishedAt?: string | null;
  expiredAt?: string | null;
  createdAt: string;
  updatedAt: string;
};

export type TItemRelations = {
  imageIds?: TImage["id"][];
  tagNames?: TTagInput["name"][];
  dateRanges?: TDateRangeInput[];
};

export type TItemInput = Omit<
  TItem,
  "id" | "slug" | "createdAt" | "updatedAt" | "sortName"
>;

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

export type TItemQueryParams = {
  privateOnly?: boolean;
  searchName?: string;
  sort?: TItemSort[];
  tags?: TTagName[];
  ids?: TItem["id"][];
  slugs?: TItem["slug"][];
} & PaginationParams;

export type GetItemsResponse = {
  items: TItem[];
  totalCount: number;
};
