import {
  BlockProps,
  BlockComponentStandardProps,
  BlockData,
  BlockComponentDataReturnType,
} from "@/components/blocks/Block";
import { keepPreviousData } from "@tanstack/react-query";
import { useGetItems } from "@/network/item/useGetItems";
import { TItemWithIncludes } from "@/network/item/types";
import { NotFoundError } from "@/utils/errors";
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

function useRelatedContentBlockData({
  component,
  item,
  renderFor = "app",
}: BlockComponentStandardProps): UseRelatedContentBlockDataReturnType {
  const { id, name, propertyValues } = component;

  const { variant, theme, referenceFeed, isPrimaryContent, critical } =
    propertyValues as PropertyValues;

  const blockSettings = variants[variant] || variants["alpha"];

  const relatedItems = useGetItems({
    clientType: renderFor,
    queryParams: {
      pageSize: 6,
      tags: item?.tags.map(({ tag }) => tag.name) ?? [],
    },
    options: { placeholderData: keepPreviousData },
  });

  if (!item) {
    throw new NotFoundError();
  }
  if (relatedItems.error) {
    handleBlockError(relatedItems.error);
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
      itemData: item,
      itemsData: relatedItems,
      referenceFeedPath: referenceFeed?.[0],
    },
  };
}

export default useRelatedContentBlockData;

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
  referenceFeed?: string[];
  critical?: boolean;
};

type BlockSettings = Omit<Variant & Theme, "pageSize">;
type LocalBlockData = {
  itemData: TItemWithIncludes;
  itemsData: ReturnType<typeof useGetItems>;
  referenceFeedPath?: string;
};

export type UseRelatedContentBlockProps = BlockProps<BlockSettings>;
export type UseRelatedContentBlockData = BlockData<LocalBlockData>;
export type UseRelatedContentBlockDataReturnType = BlockComponentDataReturnType<
  BlockSettings,
  LocalBlockData
>;
