import { isAuthenticated } from "../../../network/api";
import { TComponent } from "../../../network/component";
import { BlockProps, TBlockDataProps } from "../Block";

const variants = {
  default: {
    width: "sm",
  },
} as const;

function useLoginOrRegisterBlockData(feedProps?: TBlockDataProps) {
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
    } as TLoginOrRegisterBlockData);

  const { id, name, propertyValues } = component;

  const { variant, isPrimaryContent } =
    propertyValues as TLoginOrRegisterBlockData["propertyValues"];

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

export default useLoginOrRegisterBlockData;

type TLoginOrRegisterBlockVariant = keyof typeof variants;

export type TLoginOrRegisterBlockData = TComponent & {
  propertyValues: {
    variant: TLoginOrRegisterBlockVariant;
    isPrimaryContent: boolean;
  };
};
