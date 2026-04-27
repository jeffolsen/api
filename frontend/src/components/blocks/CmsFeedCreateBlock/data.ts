import { isAuthenticated } from "@/network/api";
import {
  BlockProps,
  BlockComponentStandardProps,
  BlockComponentDataReturnType,
  BlockData,
} from "@/components/blocks/Block";

const variants = {
  default: {
    width: "md",
  },
} as const;

function useFeedCreateBlockData({
  component,
  params,
  path,
  critical,
}: BlockComponentStandardProps): UseFeedCreateBlockDataReturnType {
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
        critical,
        isPrimaryContent,
      },
      name,
    },
    blockData: { id },
  };
}

export default useFeedCreateBlockData;

type VariantNames = keyof typeof variants;

type PropertyValues = {
  variant: VariantNames;
  isPrimaryContent: boolean;
};

type BlockSettings = (typeof variants)[VariantNames];
type LocalBlockData = object;

export type UseFeedCreateBlockProps = BlockProps<BlockSettings>;
export type UseFeedCreateBlockData = BlockData<LocalBlockData>;
export type UseFeedCreateBlockDataReturnType = BlockComponentDataReturnType<
  BlockSettings,
  LocalBlockData
>;
