import { BlockProps, BlockStandardProps } from "../Block";

const variants = {
  default: {
    width: "sm",
  },
} as const;

function useStyleGuideeBlockData({
  component,
}: BlockStandardProps): UseStyleGuideeBlockDataReturnType {
  const { id, name, propertyValues } = component;

  const { variant, isPrimaryContent } = propertyValues as {
    variant: TStyleGuideeBlockVariant;
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

export default useStyleGuideeBlockData;

type TStyleGuideeBlockVariant = keyof typeof variants;

export type UseStyleGuideeBlockDataReturnType = {
  blockProps: BlockProps;
  blockData: object;
};
