import { useGetAuthenticatedProfile } from "@/network/profile";
import {
  BlockComponentStandardProps,
  BlockStandardFailedDataReturnType,
  BlockComponentDataReturnType,
  BlockProps,
  BlockData,
} from "@/components/blocks/Block";

const variants = {
  default: {
    width: "lg",
  },
} as const;

function useProfileDashboardBlockData({
  component,
  params,
  path,
  critical,
}: BlockComponentStandardProps): UseProfileDashboardBlockDataReturnType {
  const { id, name, propertyValues } = component;

  const { variant, isPrimaryContent } = propertyValues as PropertyValues;

  const blockSettings = variants[variant] || variants["default"];

  const profile = useGetAuthenticatedProfile();

  if (profile.error) {
    return {
      error: "Failed to fetch profile data",
      params,
      path,
    } as BlockStandardFailedDataReturnType;
  }

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
    blockData: { id, profileData: profile },
  };
}

export default useProfileDashboardBlockData;

type VariantNames = keyof typeof variants;

type PropertyValues = {
  variant: VariantNames;
  isPrimaryContent: boolean;
};

type BlockSettings = (typeof variants)[VariantNames];
type LocalBlockData = {
  profileData: ReturnType<typeof useGetAuthenticatedProfile>;
};

export type UseProfileDashboardBlockProps = BlockProps<BlockSettings>;
export type UseProfileDashboardBlockData = BlockData<LocalBlockData>;
export type UseProfileDashboardBlockDataReturnType =
  BlockComponentDataReturnType<BlockSettings, LocalBlockData>;
