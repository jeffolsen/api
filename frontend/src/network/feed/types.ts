import { PaginationParams } from "@/network/api";
import { TComponent, TComponentWithType } from "@/network/component/types";
import { TTag, TTagInput } from "../tag/types";

export const FEEDS_KEY = "feeds" as const;

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
  ids?: number[];
  paths?: string[];
  tags?: string[];
} & PaginationParams;

export type TFeedParams = {
  subjectType?: TSubjectType;
  path?: string;
};

export type TFeed = {
  id: number;
  path: string;
  subjectType: TSubjectType;
  publishedAt: string | null;
  expiredAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type TFeedTags = {
  tagNames?: TTagInput["name"][];
};

export type TFeedInput = Omit<TFeed, "id" | "createdAt" | "updatedAt">;

export type TFeedWithComponents = TFeed & {
  components: TComponent[];
};

export type TFeedWithComponentsWithTypes = TFeed & {
  components: TComponentWithType[];
};

export type GetFeedsResponse = {
  feeds: TFeed[];
  totalCount: number;
};

export type TFeedTag = {
  feedId: number;
  tagId: number;
  tag: TTag;
};

export type TFeedWithIncludes = TFeedWithComponents & {
  tags: TFeedTag[];
};

export type GetFeedWithIncludesResponse = {
  feed: TFeedWithIncludes;
};

export type GetFeedsWithIncludesResponse = {
  feeds: TFeedWithIncludes[];
  totalCount: number;
};
