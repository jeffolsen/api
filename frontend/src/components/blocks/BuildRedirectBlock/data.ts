import { BlockProps, BlockStandardProps } from "../Block";
import { isAuthenticated } from "../../../network/api";

function useRedirectBlockData({
  component,
}: BlockStandardProps): UseRedirectBlockDataReturnType {
  const { id, name, propertyValues } = component;
  const authenticated = isAuthenticated();

  const { redirectFor } = propertyValues as {
    redirectFor: string;
  };

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
    blockProps: {
      settings: {},
      id,
      title: name,
    },
    blockData: { destination, message },
  };
}

export default useRedirectBlockData;

export type UseRedirectBlockDataReturnType = {
  blockProps: BlockProps;
  blockData: {
    destination?: string;
    message?: string;
  };
};
