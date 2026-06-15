import {
  BlockProps,
  BlockComponentStandardProps,
  BlockData,
  BlockComponentDataReturnType,
} from "@/components/blocks/Block";
import { keepPreviousData } from "@tanstack/react-query";
import { useGetItems } from "@/network/item/useGetItems";
import { TTagName } from "@/network/tag/types";
import handleBlockError from "@/utils/handleBlockError";

const variants = {
  alpha: {
    variant: "alpha",
  },
  beta: {
    variant: "beta",
  },
  gamma: {
    variant: "gamma",
  },
} as const;

function useTeaserGridBlockData({
  component,
  renderFor = "app",
}: BlockComponentStandardProps): UseTeaserGridBlockDataReturnType {
  const { id, name, propertyValues } = component;

  const { variant, tagAllowList, referenceFeed, isPrimaryContent, critical } =
    propertyValues as PropertyValues;

  const { ...blockSettings } = variants[variant] || variants["alpha"];

  const items = useGetItems({
    clientType: renderFor,
    queryParams: {
      tags: tagAllowList,
    },
    options: { placeholderData: keepPreviousData },
  });

  if (items.error) {
    handleBlockError(items.error);
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
      itemsData: items,
      referenceFeedPath: referenceFeed?.[0],
    },
  };
}

export default useTeaserGridBlockData;

type VariantNames = keyof typeof variants;

type PropertyValues = {
  variant: VariantNames;
  isPrimaryContent: boolean;
  tagAllowList: TTagName[];
  referenceFeed?: string[];
  critical?: boolean;
};

type BlockSettings = Omit<(typeof variants)[VariantNames], "pageSize">;
type LocalBlockData = {
  itemsData: ReturnType<typeof useGetItems>;
  referenceFeedPath?: string;
};

export type UseTeaserGridBlockProps = BlockProps<BlockSettings>;
export type UseTeaserGridBlockData = BlockData<LocalBlockData>;
export type UseTeaserGridBlockDataReturnType = BlockComponentDataReturnType<
  BlockSettings,
  LocalBlockData
>;
