import { isAuthenticated } from "../../../network/api";
import { TComponent } from "../../../network/component";
import { BlockProps, BlockStandardProps } from "../Block";

const variants = {
  default: {
    width: "md",
  },
} as const;

function useItemCreateBlockData({
  component,
  params,
  path,
}: BlockStandardProps): UseItemCreateBlockDataReturnType {
  const { id, name, propertyValues } = component;

  const { variant, isPrimaryContent } =
    propertyValues as TItemCreateBlockData["propertyValues"];

  const blockSettings = variants[variant] || variants["default"];

  const isLoggedIn = isAuthenticated();

  if (!isLoggedIn) {
    return {
      error: "User is not authenticated",
      params,
      path,
    } as UseItemCreateFailedReturnType;
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
  } as UseItemCreateSuccessReturnType;
}

export default useItemCreateBlockData;

type TItemCreateBlockVariant = keyof typeof variants;

export type TItemCreateBlockData = TComponent & {
  propertyValues: {
    variant: TItemCreateBlockVariant;
    isPrimaryContent: boolean;
  };
};

export type UseItemCreateFailedReturnType = {
  blockProps: never;
  blockData: never;
  error: string;
  params: Record<string, string>;
  path: string;
};

export type UseItemCreateSuccessReturnType = {
  blockProps: BlockProps;
  blockData: object;
  error: never;
  params: never;
  path: never;
};

export type UseItemCreateBlockDataReturnType =
  | UseItemCreateFailedReturnType
  | UseItemCreateSuccessReturnType;
