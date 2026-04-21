import { isAuthenticated } from "../../../network/api";
import {
  BlockProps,
  BlockData,
  BlockComponentDataReturnType,
  BlockComponentStandardProps,
  BlockStandardFailedDataReturnType,
} from "../Block";

const variants = {
  default: {
    width: "sm",
  },
} as const;

function useLoginOrRegisterBlockData({
  component,
  params,
  path,
  critical,
}: BlockComponentStandardProps): UseLoginOrRegisterBlockDataReturnType {
  const { id, name, propertyValues } = component;

  const { variant, isPrimaryContent } = propertyValues as PropertyValues;

  const blockSettings = variants[variant] || variants["default"];

  const isLoggedIn = isAuthenticated();

  if (isLoggedIn) {
    return {
      error: "User is already authenticated",
      params,
      path,
    } as BlockStandardFailedDataReturnType;
  }

  return {
    type: "success" as const,
    blockProps: {
      settings: {
        ...blockSettings,
        critical,
        isPrimaryContent,
        id,
      },
      name,
    },
    blockData: { id },
  };
}

export default useLoginOrRegisterBlockData;

type VariantNames = keyof typeof variants;

type PropertyValues = {
  variant: VariantNames;
  isPrimaryContent: boolean;
};

type BlockSettings = (typeof variants)[VariantNames] & { id: number };
type LocalBlockData = object;

export type UseLoginOrRegisterBlockProps = BlockProps<BlockSettings>;
export type UseLoginOrRegisterBlockData = BlockData<LocalBlockData>;
export type UseLoginOrRegisterBlockDataReturnType =
  BlockComponentDataReturnType<BlockSettings, LocalBlockData>;
