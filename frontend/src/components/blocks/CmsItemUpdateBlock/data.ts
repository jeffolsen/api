import {
  useGetItemById,
  useGetItemDateRanges,
  useGetItemImages,
  useGetItemsTags,
} from "@/network/item";
import {
  BlockProps,
  BlockData,
  BlockComponentStandardProps,
  BlockComponentDataReturnType,
} from "@/components/blocks/Block";
import { NotFoundError } from "@/utils/errors";

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
  const getTags = useGetItemsTags(itemId);
  const getImages = useGetItemImages(itemId);
  const getDateRanges = useGetItemDateRanges(itemId);

  if (getItem.error) {
    throw new NotFoundError();
  }
  if (getTags.error) {
    throw new NotFoundError();
  }
  if (getImages.error) {
    throw new NotFoundError();
  }
  if (getDateRanges.error) {
    throw new NotFoundError();
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
      tagsData: getTags,
      imagesData: getImages,
      dateRangesData: getDateRanges,
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
  tagsData: ReturnType<typeof useGetItemsTags>;
  imagesData: ReturnType<typeof useGetItemImages>;
  dateRangesData: ReturnType<typeof useGetItemDateRanges>;
};

export type UseItemUpdateBlockProps = BlockProps<BlockSettings>;
export type UseItemUpdateBlockData = BlockData<LocalBlockData>;
export type UseItemUpdateBlockDataReturnType = BlockComponentDataReturnType<
  BlockSettings,
  LocalBlockData
>;
