import { isAuthenticated } from "@/network/clients/api";
import {
  BlockProps,
  BlockComponentStandardProps,
  BlockComponentDataReturnType,
  BlockData,
} from "@/components/blocks/Block";
import { UnauthorizedError } from "@/utils/errors";

const variants = {
  default: {
    width: "md",
  },
} as const;

function useFeedCreateBlockData({
  component,
  critical,
}: BlockComponentStandardProps): UseFeedCreateBlockDataReturnType {
  const { id, name, propertyValues } = component;

  const { variant, isPrimaryContent } = propertyValues as PropertyValues;

  const blockSettings = variants[variant] || variants["default"];

  const isLoggedIn = isAuthenticated();

  if (!isLoggedIn) {
    throw new UnauthorizedError();
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
