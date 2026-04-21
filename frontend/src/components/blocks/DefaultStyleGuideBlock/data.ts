import {
  BlockComponentDataReturnType,
  BlockComponentStandardProps,
} from "../Block";

const variants = {
  default: {
    width: "sm",
  },
} as const;

function useStyleGuideBlockData({
  component,
  critical,
}: BlockComponentStandardProps): UseStyleGuideBlockDataReturnType {
  const { id, name, propertyValues } = component;

  const { variant, isPrimaryContent } = propertyValues as PropertyValues;

  const blockSettings = variants[variant] || variants["default"];

  return {
    type: "success" as const,
    blockProps: {
      name,
      settings: {
        ...blockSettings,
        critical,
        isPrimaryContent,
      },
    },
    blockData: { id },
  };
}

export default useStyleGuideBlockData;

type VariantNames = keyof typeof variants;

type PropertyValues = {
  variant: VariantNames;
  isPrimaryContent: boolean;
};

type BlockSettings = (typeof variants)[VariantNames];
type LocalBlockData = object;

export type UseStyleGuideBlockDataReturnType = BlockComponentDataReturnType<
  BlockSettings,
  LocalBlockData
>;
