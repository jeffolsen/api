import { isAuthenticated } from "../../../network/api";
import { BlockProps, BlockStandardProps } from "../Block";

const variants = {
  default: {
    width: "sm",
  },
} as const;

function useLoginOrRegisterBlockData({
  component,
  params,
  path,
}: BlockStandardProps): UseLoginOrRegisterBlockDataReturnType {
  const { id, name, propertyValues } = component;

  const { variant, isPrimaryContent } = propertyValues as {
    variant: TLoginOrRegisterBlockVariant;
    isPrimaryContent: boolean;
  };

  const blockSettings = variants[variant] || variants["default"];

  const isLoggedIn = isAuthenticated();

  if (isLoggedIn) {
    return {
      error: "User is already authenticated",
      params,
      path,
    } as UseLoginOrRegisterFailedReturnType;
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
  } as UseLoginOrRegisterSuccessReturnType;
}

export default useLoginOrRegisterBlockData;

type TLoginOrRegisterBlockVariant = keyof typeof variants;

export type UseLoginOrRegisterFailedReturnType = {
  error: string;
  params: Record<string, string>;
  path: string;
  blockProps: never;
  blockData: never;
};

export type UseLoginOrRegisterSuccessReturnType = {
  blockProps: BlockProps;
  blockData: Record<string, unknown>;
  error: never;
  params: never;
  path: never;
};

export type UseLoginOrRegisterBlockDataReturnType =
  | UseLoginOrRegisterFailedReturnType
  | UseLoginOrRegisterSuccessReturnType;
