import {
  BlockProps,
  BlockComponentStandardProps,
  BlockData,
  BlockComponentDataReturnType,
} from "@/components/blocks/Block";
import { keepPreviousData } from "@tanstack/react-query";
import { useGetAppItems } from "@/network/app";
import { TTagName } from "@/network/tag";

const variants = {
  alpha: {
    variant: "alpha",
    width: "xl",
  },
  beta: {
    variant: "beta",
    width: "lg",
  },
  gamma: {
    variant: "gamma",
    width: "lg",
  },
} as const;

function useTeaserGridBlockData({
  component,
  params,
  path,
  critical,
}: BlockComponentStandardProps): UseTeaserGridBlockDataReturnType {
  const { id, name, propertyValues } = component;

  const { variant, tagAllowList, referenceFeed, isPrimaryContent } =
    propertyValues as PropertyValues;

  const { ...blockSettings } = variants[variant] || variants["alpha"];

  const items = useGetAppItems(
    {
      tags: tagAllowList,
    },
    { placeholderData: keepPreviousData },
  );

  if (items.error) {
    return {
      type: "error" as const,
      error: "Failed to load item data",
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
};

type BlockSettings = Omit<(typeof variants)[VariantNames], "pageSize">;
type LocalBlockData = {
  itemsData: ReturnType<typeof useGetAppItems>;
  referenceFeedPath?: string;
};

export type UseTeaserGridBlockProps = BlockProps<BlockSettings>;
export type UseTeaserGridBlockData = BlockData<LocalBlockData>;
export type UseTeaserGridBlockDataReturnType = BlockComponentDataReturnType<
  BlockSettings,
  LocalBlockData
>;
