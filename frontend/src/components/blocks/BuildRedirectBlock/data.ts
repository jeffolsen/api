import {
  BlockProps,
  BlockData,
  BlockComponentStandardProps,
  BlockComponentDataReturnType,
} from "../Block";
import { isAuthenticated } from "../../../network/api";

function useRedirectBlockData({
  component,
}: BlockComponentStandardProps): UseRedirectBlockDataReturnType {
  const { id, name, propertyValues } = component;
  const authenticated = isAuthenticated();

  const { redirectFor } = propertyValues as PropertyValues;

  let destination;
  let message;
  if (redirectFor === "everyone") {
    destination = "/";
  } else if (redirectFor === "authenticated" && authenticated) {
    destination = "/";
    message = "Redirecting authenticated user...";
  } else if (redirectFor === "unauthenticated" && !authenticated) {
    destination = "/";
    message = "Redirecting unauthenticated user...";
  }

  return {
    type: "success" as const,
    blockProps: {
      settings: { isPrimaryContent: false, width: "sm" },
      name,
    },
    blockData: { id, destination, message },
  };
}

export default useRedirectBlockData;

type PropertyValues = {
  redirectFor: "everyone" | "authenticated" | "unauthenticated";
};

type BlockSettings = {
  isPrimaryContent: boolean;
  width: "sm";
};
type LocalBlockData = {
  destination?: string;
  message?: string;
};

export type UseRedirectBlockProps = BlockProps<BlockSettings>;
export type UseRedirectBlockData = BlockData<LocalBlockData>;
export type UseRedirectBlockDataReturnType = BlockComponentDataReturnType<
  BlockSettings,
  LocalBlockData
>;
