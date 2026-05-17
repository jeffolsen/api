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
  renderFor = "app",
}: BlockComponentStandardProps): UseHeroCarouselBlockDataReturnType {
  const { id, name, propertyValues } = component;

  const {
    variant,
    location,
    theme,
    itemAllowList,
    referenceFeed,
    isPrimaryContent,
  } = propertyValues as PropertyValues;

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
        location,
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

export default useHeroCarouselBlockData;

type ThemeNames = "alpha" | "beta" | "gamma";
type Theme = {
  theme: ThemeNames;
};
type VariantNames = keyof typeof variants;
type Variant = (typeof variants)[VariantNames];

type Location = { location: "header" | "body" };

type PropertyValues = {
  variant: VariantNames;
  theme: ThemeNames;
  isPrimaryContent: boolean;
  itemAllowList: string[];
  referenceFeed?: string[];
} & Location;

type BlockSettings = Omit<Variant & Theme & Location, "pageSize">;
type LocalBlockData = {
  itemsData: ReturnType<typeof useGetItems>;
  referenceFeedPath?: string;
  itemOrder: string[];
};

export type UseHeroCarouselBlockProps = BlockProps<BlockSettings>;
export type UseHeroCarouselBlockData = BlockData<LocalBlockData>;
export type UseHeroCarouselBlockDataReturnType = BlockComponentDataReturnType<
  BlockSettings,
  LocalBlockData
>;
