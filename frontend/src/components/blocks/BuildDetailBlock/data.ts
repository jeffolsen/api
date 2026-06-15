import {
  BlockProps,
  BlockComponentStandardProps,
  BlockData,
  BlockComponentDataReturnType,
} from "@/components/blocks/Block";
import { TItemWithIncludes } from "@/network/item/types";
import { NotFoundError } from "@/utils/errors";

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

function useDetailBlockData({
  component,
  item,
}: BlockComponentStandardProps): UseDetailBlockDataReturnType {
  const { id, name, propertyValues } = component;

  const { variant, theme, isPrimaryContent, critical } =
    propertyValues as PropertyValues;

  const blockSettings = variants[variant] || variants["alpha"];

  if (!item) {
    throw new NotFoundError();
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
    },
  };
}

export default useDetailBlockData;

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
  critical?: boolean;
};

type BlockSettings = Omit<Variant & Theme, "pageSize">;
type LocalBlockData = {
  itemData: TItemWithIncludes;
};

export type UseDetailBlockProps = BlockProps<BlockSettings>;
export type UseDetailBlockData = BlockData<LocalBlockData>;
export type UseDetailBlockDataReturnType = BlockComponentDataReturnType<
  BlockSettings,
  LocalBlockData
>;
