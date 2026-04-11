import { useGetAuthenticatedProfile } from "../../../network/profile";
import { BlockProps, BlockStandardProps } from "../Block";

const variants = {
  default: {
    width: "lg",
  },
} as const;

function useProfileDashboardBlockData({
  component,
  params,
  path,
}: BlockStandardProps): UseProfileDashboardBlockDataReturnType {
  const { id, name, propertyValues } = component;

  const { variant, isPrimaryContent } = propertyValues as {
    variant: TProfileDashboardBlockVariant;
    isPrimaryContent: boolean;
  };

  const blockSettings = variants[variant] || variants["default"];

  const profile = useGetAuthenticatedProfile();

  if (profile.error) {
    return {
      error: "Failed to fetch profile data",
      params,
      path,
    } as UseProfileDashboardFailedReturnType;
  }

  return {
    blockProps: {
      settings: {
        ...blockSettings,
        isPrimaryContent,
      },
      id,
      title: name,
    },
    blockData: { profileData: profile },
  } as UseProfileDashboardSuccessReturnType;
}

export default useProfileDashboardBlockData;

type TProfileDashboardBlockVariant = keyof typeof variants;

export type UseProfileDashboardFailedReturnType = {
  error: string;
  params: Record<string, string>;
  path: string;
  blockProps: never;
  blockData: never;
};

export type UseProfileDashboardSuccessReturnType = {
  blockProps: BlockProps;
  blockData: {
    profileData: ReturnType<typeof useGetAuthenticatedProfile>;
  };
  error: never;
  params: never;
  path: never;
};

export type UseProfileDashboardBlockDataReturnType =
  | UseProfileDashboardFailedReturnType
  | UseProfileDashboardSuccessReturnType;
