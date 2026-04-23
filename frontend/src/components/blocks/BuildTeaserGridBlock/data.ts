import {
  BlockProps,
  BlockComponentStandardProps,
  BlockData,
  BlockComponentDataReturnType,
} from "../Block";
import { keepPreviousData } from "@tanstack/react-query";
import { useGetAppItems, useGetAppFeedById } from "../../../network/app";
import { TTagName } from "../../../network/tag";

const variants = {
  alpha: {
    variant: "alpha",
    width: "xl",
  },
  beta: {
    variant: "beta",
    width: "xl",
  },
  gamma: {
    variant: "gamma",
    width: "xl",
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

export default useTeaserGridBlockData;

type VariantNames = keyof typeof variants;

type PropertyValues = {
  variant: VariantNames;
  isPrimaryContent: boolean;
  tagAllowList: TTagName[];
  referenceFeed?: number[];
};

type BlockSettings = Omit<(typeof variants)[VariantNames], "pageSize">;
type LocalBlockData = {
  itemsData: ReturnType<typeof useGetAppItems>;
  referenceFeedData?: ReturnType<typeof useGetAppFeedById>;
};

export type UseTeaserGridBlockProps = BlockProps<BlockSettings>;
export type UseTeaserGridBlockData = BlockData<LocalBlockData>;
export type UseTeaserGridBlockDataReturnType = BlockComponentDataReturnType<
  BlockSettings,
  LocalBlockData
>;
