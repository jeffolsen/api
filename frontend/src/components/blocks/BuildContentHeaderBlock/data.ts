import {
  BlockProps,
  BlockComponentStandardProps,
  BlockData,
  BlockComponentDataReturnType,
} from "@/components/blocks/Block";
import { keepPreviousData } from "@tanstack/react-query";
import { useGetAppItems } from "@/network/app/item";

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
    width: "md",
  },
} as const;

function useContentHeaderBlockData({
  component,
  params,
  path,
  critical,
}: BlockComponentStandardProps): UseContentHeaderBlockDataReturnType {
  const { id, name, propertyValues } = component;

  const { variant, theme, itemAllowList, referenceFeed, isPrimaryContent } =
    propertyValues as PropertyValues;

  const blockSettings = variants[variant] || variants["alpha"];

  const items = useGetAppItems(
    {
      slugs: [itemAllowList?.[0]].filter(Boolean),
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
        theme,
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

export default useContentHeaderBlockData;

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
  itemsData: ReturnType<typeof useGetAppItems>;
  referenceFeedPath?: string;
};

export type UseContentHeaderBlockProps = BlockProps<BlockSettings>;
export type UseContentHeaderBlockData = BlockData<LocalBlockData>;
export type UseContentHeaderBlockDataReturnType = BlockComponentDataReturnType<
  BlockSettings,
  LocalBlockData
>;
