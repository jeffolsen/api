export const COMPONENTS_KEY = "components" as const;

export type TComponentTypes =
  | "TeaserGrid"
  | "HeroCarousel"
  | "Detail"
  | "RelatedContent";

export type TComponent = {
  id: number;
  type: TComponentTypes;
  order: number;
  propertyValues: Record<string, unknown>;
  publishedAt?: string;
  expiredAt?: string;
  createdAt: string;
  updatedAt: string;
};

export type TComponentInput = Omit<TComponent, "id">;
