import { BlockProps, BlockStandardProps } from "../Block";

const variants = {
  default: {
    width: "sm",
  },
} as const;

function useFourOhFourBlockData({
  component,
}: BlockStandardProps): UseFourOhFourBlockDataReturnType {
  const { id, name, propertyValues } = component;

  const { variant, isPrimaryContent } = propertyValues as {
    variant: TFourOhFourBlockVariant;
    isPrimaryContent: boolean;
  };

  const blockSettings = variants[variant] || variants["default"];

  return {
    blockProps: {
      settings: {
        ...blockSettings,
        isPrimaryContent,
      },
      id,
      title: name,
    },
    blockData: {},
  };
}

export default useFourOhFourBlockData;

type TFourOhFourBlockVariant = keyof typeof variants;

export type UseFourOhFourBlockDataReturnType = {
  blockProps: BlockProps;
  blockData: object;
};
