import {
  BlockComponentStandardProps,
  BlockComponentDataReturnType,
} from "../Block";

const variants = {
  default: {
    width: "sm",
  },
} as const;

function useFourOhFourBlockData({
  component,
}: BlockComponentStandardProps): UseFourOhFourBlockDataReturnType {
  const { id, name, propertyValues } = component;

  const { variant, isPrimaryContent } = propertyValues as PropertyValues;

  const blockSettings = variants[variant] || variants["default"];

  return {
    type: "success" as const,
    blockProps: {
      settings: {
        ...blockSettings,
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
