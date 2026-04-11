import { BlockProps, BlockStandardProps } from "../Block";

const variants = {
  default: {
    width: "sm",
  },
} as const;

function useFourOhOneBlockData({
  component,
}: BlockStandardProps): UseFourOhOneBlockDataReturnType {
  const { id, name, propertyValues } = component;

  const { variant, isPrimaryContent } = propertyValues as {
    variant: TFourOhOneBlockVariant;
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

export default useFourOhOneBlockData;

type TFourOhOneBlockVariant = keyof typeof variants;

export type UseFourOhOneBlockDataReturnType = {
  blockProps: BlockProps;
  blockData: object;
};
