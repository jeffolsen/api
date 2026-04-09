import { isAuthenticated } from "../../../network/api";
import { TComponent } from "../../../network/component";
import { BlockProps, TBlockDataProps } from "../Block";

const variants = {
  default: {
    width: "md",
  },
} as const;

function useFeedCreateBlockData(feedProps?: TBlockDataProps) {
  const { feedComponent } = feedProps || {};
  const component =
    feedComponent ||
    ({
      id: 1000,
      name: "Create a new feed",
      propertyValues: {
        variant: "default",
        isPrimaryContent: true,
      },
    } as TFeedCreateBlockData);

  const { id, name, propertyValues } = component;

  const { variant, isPrimaryContent } =
    propertyValues as TFeedCreateBlockData["propertyValues"];

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

export default useFeedCreateBlockData;

type TFeedCreateBlockVariant = keyof typeof variants;

export type TFeedCreateBlockData = TComponent & {
  propertyValues: {
    variant: TFeedCreateBlockVariant;
    isPrimaryContent: boolean;
  };
};
