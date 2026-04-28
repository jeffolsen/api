import {
  BlockProps,
  BlockComponentStandardProps,
  BlockData,
  BlockComponentDataReturnType,
} from "@/components/blocks/Block";
import { keepPreviousData } from "@tanstack/react-query";
import { useGetAppItems, useGetAppFeedById } from "@/network/app";

const variants = {
  alpha: {
    variant: "alpha",
    width: "lg",
    pageSize: 5,
  },
  beta: {
    variant: "beta",
    width: "md",
    pageSize: 7,
  },
  gamma: {
    variant: "gamma",
    width: "md",
    pageSize: 10,
  },
} as const;

function useCuratedListBlockData({
  component,
  params,
  path,
  critical,
}: BlockComponentStandardProps): UseCuratedListBlockDataReturnType {
  const { id, name, propertyValues } = component;

  const { variant, itemAllowList, referenceFeed, isPrimaryContent } =
    propertyValues as PropertyValues;

  const { pageSize, ...blockSettings } = variants[variant] || variants["alpha"];

  const items = useGetAppItems(
    {
      pageSize,
      slugs: itemAllowList,
    },
    { placeholderData: keepPreviousData },
  );

  const referenceFeedRecord = useGetAppFeedById(referenceFeed?.[0]);

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
      ...(referenceFeedRecord &&
        !referenceFeedRecord.error && {
          referenceFeedData: referenceFeedRecord,
        }),
    },
  };
}

export default useCuratedListBlockData;

type VariantNames = keyof typeof variants;

type PropertyValues = {
  variant: VariantNames;
  isPrimaryContent: boolean;
  itemAllowList: string[];
  referenceFeed?: number[];
};

type BlockSettings = Omit<(typeof variants)[VariantNames], "pageSize">;
type LocalBlockData = {
  itemsData: ReturnType<typeof useGetAppItems>;
  referenceFeedData?: ReturnType<typeof useGetAppFeedById>;
};

export type UseCuratedListBlockProps = BlockProps<BlockSettings>;
export type UseCuratedListBlockData = BlockData<LocalBlockData>;
export type UseCuratedListBlockDataReturnType = BlockComponentDataReturnType<
  BlockSettings,
  LocalBlockData
>;
