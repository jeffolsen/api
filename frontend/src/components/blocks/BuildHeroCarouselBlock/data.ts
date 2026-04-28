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
    width: "xl",
    pageSize: 5,
  },
  beta: {
    variant: "beta",
    width: "xl",
    pageSize: 7,
  },
  gamma: {
    variant: "gamma",
    width: "xl",
    pageSize: 10,
  },
} as const;

function useHeroCarouselBlockData({
  component,
  params,
  path,
  critical,
}: BlockComponentStandardProps): UseHeroCarouselBlockDataReturnType {
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

export default useHeroCarouselBlockData;

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

export type UseHeroCarouselBlockProps = BlockProps<BlockSettings>;
export type UseHeroCarouselBlockData = BlockData<LocalBlockData>;
export type UseHeroCarouselBlockDataReturnType = BlockComponentDataReturnType<
  BlockSettings,
  LocalBlockData
>;
