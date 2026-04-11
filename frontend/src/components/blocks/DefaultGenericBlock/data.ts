import { BlockProps, BlockStandardProps } from "../Block";

const variants = {
  default: {
    width: "sm",
  },
} as const;

function useGenericBlockData({
  component,
}: BlockStandardProps): UseGenericBlockDataReturnType {
  const { id, name, propertyValues } = component;

  const { variant, isPrimaryContent } = propertyValues as {
    variant: TGenericBlockVariant;
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

export default useGenericBlockData;

type TGenericBlockVariant = keyof typeof variants;

export type UseGenericBlockDataReturnType = {
  blockProps: BlockProps;
  blockData: object;
};
