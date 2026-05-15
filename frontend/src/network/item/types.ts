import { PaginationParams } from "@/network/api";

export const ITEM_INCLUDES = "tags,images,dateRanges" as const;
export const ITEMS_KEY = "items" as const;
import { TDateRange, TDateRangeInput } from "@/network/dateRange/types";
import { TImage } from "@/network/image/types";
import { TTag, TTagInput, TTagName } from "@/network/tag/types";

export type TItem = {
  id: number;
  name: string;
  slug: string;
  description?: string;
  richContent?: Record<string, unknown>;
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
  items: TItemWithIncludes[];
  totalCount: number;
};

export type TItemTag = {
  itemId: number;
  tagId: number;
  tag: TTag;
};

export type TItemImage = {
  itemId: number;
  imageId: number;
  image: TImage;
};

export type TItemWithIncludes = TItem & {
  tags: TItemTag[];
  images: TItemImage[];
  dateRanges: TDateRange[];
};

export type GetItemWithIncludesResponse = {
  item: TItemWithIncludes;
};

export type GetItemsWithIncludesResponse = {
  items: TItemWithIncludes[];
  totalCount: number;
};
