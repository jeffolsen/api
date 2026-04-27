import {
  BlockComponentStandardProps,
  BlockComponentDataReturnType,
} from "@/components/blocks/Block";

const variants = {
  default: {
    width: "sm",
  },
} as const;

function useFourOhFourBlockData({
  component,
  critical,
}: BlockComponentStandardProps): UseFourOhFourBlockDataReturnType {
  const { id, name, propertyValues } = component;

  const { variant, isPrimaryContent } = propertyValues as PropertyValues;

  const blockSettings = variants[variant] || variants["default"];

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
    blockData: { id },
  };
}

export default useFourOhFourBlockData;

type VariantNames = keyof typeof variants;

type PropertyValues = {
  variant: VariantNames;
  isPrimaryContent: boolean;
};

type BlockSettings = (typeof variants)[VariantNames];
type LocalBlockData = object;

export type UseFourOhFourBlockDataReturnType = BlockComponentDataReturnType<
  BlockSettings,
  LocalBlockData
>;
