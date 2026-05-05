import {
  BlockComponentStandardProps,
  BlockComponentDataReturnType,
  BlockProps,
  BlockData,
} from "@/components/blocks/Block";

const variants = {
  unimplemented: {
    variant: "unimplemented",
    component: false,
    width: "md",
  },
  privacy: {
    variant: "privacy",
    component: "PrivacyComponent",
    width: "md",
  },
} as const;

function usePolicyBlockData({
  component,
  params,
  path,
}: BlockComponentStandardProps): UsePolicyBlockDataReturnType {
  const { id, name, propertyValues } = component;

  const { variant, isPrimaryContent } = propertyValues as PropertyValues;

  const blockSettings = variants[variant] || variants["unimplemented"];

  if (!blockSettings || !blockSettings.component)
    return {
      type: "error" as const,
      error: "Failed to find policy",
      params,
      path,
    };

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

export default usePolicyBlockData;

type VariantNames = keyof typeof variants;

type ValidComponentValues = "privacyComponent" | false;

type PropertyValues = {
  variant: VariantNames;
  component: ValidComponentValues;
  isPrimaryContent: boolean;
};

// type BlockSettings = Omit<Variant & Theme & Location, "pageSize">;
type BlockSettings = (typeof variants)[VariantNames];
type LocalBlockData = object;

export type UsePolicyBlockProps = BlockProps<BlockSettings>;
export type UsePolicyBlockData = BlockData<LocalBlockData>;
export type UsePolicyBlockDataReturnType = BlockComponentDataReturnType<
  BlockSettings,
  LocalBlockData
>;
