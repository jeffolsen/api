import {
  BlockComponentStandardProps,
  BlockComponentStandardSuccessReturnType,
  BlockProps,
  BlockData,
} from "@/components/blocks/Block";

const variants = {
  default: {
    width: "sm",
  },
} as const;

function useErrorBlockData({
  component,
  params,
  path,
  critical,
}: BlockComponentStandardProps): UseErrorBlockDataReturnType {
  const { id, name, propertyValues } = component;

  const { variant, isPrimaryContent, errorCode } =
    propertyValues as PropertyValues;

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
    blockData: { id, errorCode, params, path },
  };
}

export default useErrorBlockData;

type VariantNames = keyof typeof variants;

type ErrorCodes = 401 | 404 | 429;

type PropertyValues = {
  variant: VariantNames;
  isPrimaryContent: boolean;
  errorCode: ErrorCodes;
};

type BlockSettings = (typeof variants)[VariantNames];
type LocalBlockData = {
  errorCode: ErrorCodes;
  params: Record<string, string>;
  path: string;
};

export type UseErrorBlockProps = BlockProps<BlockSettings>;
export type UseErrorBlockData = BlockData<LocalBlockData>;
export type UseErrorBlockDataReturnType =
  BlockComponentStandardSuccessReturnType<BlockSettings, LocalBlockData>;
