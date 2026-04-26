import { PaginationParams } from "../api";
import { TDateRangeInput } from "../dataRange/types";
import { TImage } from "../image/types";
import { TTagInput, TTagName } from "../tag/types";

export type TItem = {
  id: number;
  name: string;
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
  "id" | "createdAt" | "updatedAt" | "sortName"
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
} & PaginationParams;

export type GetItemsResponse = {
  items: TItem[];
  totalCount: number;
};
