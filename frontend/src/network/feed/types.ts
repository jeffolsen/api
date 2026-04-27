import { PaginationParams } from "@/network/api";
import { TComponent, TComponentWithType } from "@/network/component/types";

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

export type GetFeedsResponse = {
  feeds: TFeed[];
  totalCount: number;
};
