import { TComponentType } from "../componentType/types";
import { TFeed } from "../feed/types";

export type TComponent = {
  id: number;
  typeId: TComponentType["id"];
  typeName: TComponentType["name"];
  feedId: TFeed["id"];
  order: number;
  name: string;
  propertyValues: Record<string, unknown>;
  publishedAt?: string | null;
  expiredAt?: string | null;
  createdAt: string;
  updatedAt: string;
};

export type TComponentInput = Omit<
  TComponent,
  "id" | "createdAt" | "updatedAt" | "typeName"
>;

export type TComponentWithType = TComponent & TComponentType;

export type ModifyComponentRequest = Partial<TComponentInput> & {
  feedId: TFeed["id"];
};
