import {
  BlockProps,
  BlockComponentStandardProps,
  BlockData,
  BlockComponentDataReturnType,
} from "@/components/blocks/Block";
import { keepPreviousData } from "@tanstack/react-query";
import { useGetItems } from "@/network/item/useGetItems";

const variants = {
  alpha: {
    variant: "alpha",
    width: "xl",
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
  renderFor = "app",
}: BlockComponentStandardProps): UseCuratedListBlockDataReturnType {
  const { id, name, propertyValues } = component;

  const { variant, theme, itemAllowList, referenceFeed, isPrimaryContent } =
    propertyValues as PropertyValues;

  const { pageSize, ...blockSettings } = variants[variant] || variants["alpha"];

  const items = useGetItems({
    clientType: renderFor,
    queryParams: {
      pageSize,
      slugs: itemAllowList,
    },
    options: { placeholderData: keepPreviousData },
  });

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
        theme,
        critical,
        isPrimaryContent,
      },
      name,
    },
    blockData: {
      id,
      itemOrder: itemAllowList,
      itemsData: items,
      referenceFeedPath: referenceFeed?.[0],
    },
  };
}

export default useCuratedListBlockData;

type ThemeNames = "alpha" | "beta" | "gamma";
type Theme = {
  theme: ThemeNames;
};
type VariantNames = keyof typeof variants;
type Variant = (typeof variants)[VariantNames];

type PropertyValues = {
  variant: VariantNames;
  theme: ThemeNames;
  isPrimaryContent: boolean;
  itemAllowList: string[];
  referenceFeed?: string[];
};

type BlockSettings = Omit<Variant & Theme, "pageSize">;
type LocalBlockData = {
  itemOrder: string[];
  itemsData: ReturnType<typeof useGetItems>;
  referenceFeedPath?: string;
};

export type UseCuratedListBlockProps = BlockProps<BlockSettings>;
export type UseCuratedListBlockData = BlockData<LocalBlockData>;
export type UseCuratedListBlockDataReturnType = BlockComponentDataReturnType<
  BlockSettings,
  LocalBlockData
>;
