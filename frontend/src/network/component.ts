import { TComponentType } from "./componentType";
import { TFeed } from "./feed";

export const COMPONENTS_KEY = "components" as const;

export type TComponent = {
  id: number;
  typeId: TComponentType["id"];
  feedId: TFeed["id"];
  order: number;
  propertyValues: Record<string, unknown>;
  publishedAt?: string;
  expiredAt?: string;
  createdAt: string;
  updatedAt: string;
};

export type TComponentInput = Omit<
  TComponent,
  "id" | "createdAt" | "updatedAt"
>;
