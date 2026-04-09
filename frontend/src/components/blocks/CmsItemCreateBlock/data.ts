import { isAuthenticated } from "../../../network/api";
import { TComponent } from "../../../network/component";
import { BlockProps, TBlockDataProps } from "../Block";

const variants = {
  default: {
    width: "md",
  },
} as const;

function useItemCreateBlockData(feedProps?: TBlockDataProps) {
  const { feedComponent } = feedProps || {};
  const component =
    feedComponent ||
    ({
      id: 1000,
      name: "Create a new item",
      propertyValues: {
        variant: "default",
        isPrimaryContent: true,
      },
    } as TItemCreateBlockData);

  const { id, name, propertyValues } = component;

  const { variant, isPrimaryContent } =
    propertyValues as TItemCreateBlockData["propertyValues"];

  const isLoggedIn = isAuthenticated();

  if (isLoggedIn) {
    return {
      error: "User is already authenticated",
    };
  }

  return {
    blockProps: {
      settings: variants[variant],
      id,
      title: name,
      isPrimaryContent,
    } as BlockProps,
  };
}

export default useItemCreateBlockData;

type TItemCreateBlockVariant = keyof typeof variants;

export type TItemCreateBlockData = TComponent & {
  propertyValues: {
    variant: TItemCreateBlockVariant;
    isPrimaryContent: boolean;
  };
};
