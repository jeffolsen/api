import { isAuthenticated } from "../../../network/api";
import { BlockProps, BlockStandardProps } from "../Block";

const variants = {
  default: {
    width: "md",
  },
} as const;

function useFeedCreateBlockData({
  component,
  params,
  path,
}: BlockStandardProps): UseFeedCreateBlockDataReturnType {
  const { id, name, propertyValues } = component;

  const { variant, isPrimaryContent } = propertyValues as {
    variant: TFeedCreateBlockVariant;
    isPrimaryContent: boolean;
  };

  const blockSettings = variants[variant] || variants["default"];

  const isLoggedIn = isAuthenticated();

  if (!isLoggedIn) {
    return {
      error: "User is not authenticated",
      params,
      path,
    } as UseFeedCreateFailedDataReturnType;
  }

  return {
    blockProps: {
      settings: {
        ...blockSettings,
        isPrimaryContent,
      },
      id,
      title: name,
    },
    blockData: {},
  } as UseFeedCreateSuccessReturnType;
}

export default useFeedCreateBlockData;

type TFeedCreateBlockVariant = keyof typeof variants;

export type UseFeedCreateFailedDataReturnType = {
  blockProps: never;
  blockData: never;
  error: string;
  params: Record<string, string>;
  path: string;
};

export type UseFeedCreateSuccessReturnType = {
  blockProps: BlockProps;
  blockData: object;
  error: never;
  params: never;
  path: never;
};

export type UseFeedCreateBlockDataReturnType =
  | UseFeedCreateFailedDataReturnType
  | UseFeedCreateSuccessReturnType;
