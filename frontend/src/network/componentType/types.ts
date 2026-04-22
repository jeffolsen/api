import { JSONSchemaForArrayOrEnum } from "../../utils/jsonSchemaTransformer";
import { TSubjectType } from "../feed/types";

export type TComponentNames =
  | "TeaserGrid"
  | "HeroCarousel"
  | "Detail"
  | "RelatedContent";

export type TComponentType = {
  id: number;
  name: TComponentNames;
  subjectType: TSubjectType;
  propertySchema: JSONSchemaForArrayOrEnum;
};

export type TComponentTypesQueryParams = {
  subjectType?: TSubjectType;
};

export type GetComponentTypesResponse = {
  componentTypes: TComponentType[];
};

export type TGetComponentTypeByIdResponse = {
  componentType: TComponentType;
};
