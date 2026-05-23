import {
  BlockProps,
  BlockComponentStandardProps,
  BlockData,
  BlockComponentDataReturnType,
} from "@/components/blocks/Block";
import { keepPreviousData } from "@tanstack/react-query";
import { useGetItems } from "@/network/item/useGetItems";
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

function useContentHeaderBlockData({
  component,
  critical,
  renderFor = "app",
}: BlockComponentStandardProps): UseContentHeaderBlockDataReturnType {
  const { id, name, propertyValues } = component;

  const { variant, theme, itemAllowList, referenceFeed, isPrimaryContent } =
    propertyValues as PropertyValues;

  const blockSettings = variants[variant] || variants["alpha"];

  const items = useGetItems({
    clientType: renderFor,
    queryParams: {
      slugs: [itemAllowList?.[0]].filter(Boolean),
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
  itemsData: ReturnType<typeof useGetItems>;
  referenceFeedPath?: string;
};

export type UseContentHeaderBlockProps = BlockProps<BlockSettings>;
export type UseContentHeaderBlockData = BlockData<LocalBlockData>;
export type UseContentHeaderBlockDataReturnType = BlockComponentDataReturnType<
  BlockSettings,
  LocalBlockData
>;
