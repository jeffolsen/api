import { useGetItemById } from "@/network/item/useGetItemById";
import {
  BlockProps,
  BlockData,
  BlockComponentStandardProps,
  BlockComponentDataReturnType,
} from "@/components/blocks/Block";
import handleBlockError from "@/utils/handleBlockError";

const variants = {
  default: {
    width: "md",
  },
} as const;

function useItemUpdateBlockData({
  component,
  params,
  critical,
}: BlockComponentStandardProps): UseItemUpdateBlockDataReturnType {
  const { id, name, propertyValues } = component;

  const { variant, isPrimaryContent } = propertyValues as PropertyValues;

  const blockSettings = variants[variant] || variants["default"];

  const itemId = parseInt(params?.id || "");
  const getItem = useGetItemById(itemId);

  if (getItem.error) {
    handleBlockError(getItem.error);
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
    blockData: {
      id,
      itemData: getItem,
    },
  };
}

export default useItemUpdateBlockData;

type VariantNames = keyof typeof variants;

type PropertyValues = {
  variant: VariantNames;
  isPrimaryContent: boolean;
};

type BlockSettings = (typeof variants)[VariantNames];
type LocalBlockData = {
  itemData: ReturnType<typeof useGetItemById>;
};

export type UseItemUpdateBlockProps = BlockProps<BlockSettings>;
export type UseItemUpdateBlockData = BlockData<LocalBlockData>;
export type UseItemUpdateBlockDataReturnType = BlockComponentDataReturnType<
  BlockSettings,
  LocalBlockData
>;
