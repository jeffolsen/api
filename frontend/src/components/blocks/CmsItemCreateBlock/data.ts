import { isAuthenticated } from "../../../network/api";
import {
  BlockProps,
  BlockComponentStandardProps,
  BlockComponentDataReturnType,
  BlockData,
} from "../Block";

const variants = {
  default: {
    width: "md",
  },
} as const;

function useItemCreateBlockData({
  component,
  params,
  path,
}: BlockComponentStandardProps): UseItemCreateBlockDataReturnType {
  const { id, name, propertyValues } = component;

  const { variant, isPrimaryContent } = propertyValues as PropertyValues;

  const blockSettings = variants[variant] || variants["default"];

  const isLoggedIn = isAuthenticated();

  if (!isLoggedIn) {
    return {
      type: "error" as const,
      error: "User is not authenticated",
      params,
      path,
    };
  }

  return {
    type: "success" as const,
    blockProps: {
      settings: {
        ...blockSettings,
        isPrimaryContent,
      },
      name,
    },
    blockData: { id },
  };
}

export default useItemCreateBlockData;

type VariantNames = keyof typeof variants;

type PropertyValues = {
  variant: VariantNames;
  isPrimaryContent: boolean;
};

type BlockSettings = (typeof variants)[VariantNames];
type LocalBlockData = object;

export type UseItemCreateBlockProps = BlockProps<BlockSettings>;
export type UseItemCreateBlockData = BlockData<LocalBlockData>;
export type UseItemCreateBlockDataReturnType = BlockComponentDataReturnType<
  BlockSettings,
  LocalBlockData
>;
