export const COMPONENTS_KEY = "components" as const;

export type TComponentTypes = "BASIC_BLOCK";

export type TComponent = {
  id: number;
  title?: string;
  type: TComponentTypes;
  order: number;
  config: Record<string, unknown>;
};

export type TComponentInput = Omit<TComponent, "id">;
