import { TComponent } from "../../../network/component";
import { useGetAuthenticatedProfile } from "../../../network/profile";
import { BlockProps, TBlockDataProps } from "../Block";

const variants = {
  default: {
    width: "md",
  },
} as const;

function useProfileDashboardBlockData(feedProps?: TBlockDataProps) {
  const { feedComponent } = feedProps || {};
  const component = {
    id: 1000,
    name: "Profile Dashboard",
    propertyValues: {
      variant: "default",
      isPrimaryContent: true,
    },
    ...feedComponent,
  } as TProfileDashboardBlockData;

  const { id, name, propertyValues } = component;

  const { variant, isPrimaryContent } =
    propertyValues as TProfileDashboardBlockData["propertyValues"];

  const profile = useGetAuthenticatedProfile();

  if (profile.error) {
    return {
      error: profile.error,
    };
  }

  return {
    blockProps: {
      settings: variants[variant],
      id,
      title: name,
      isPrimaryContent,
    } as BlockProps,
    blockData: { profileData: profile },
  };
}

export default useProfileDashboardBlockData;

type TProfileDashboardBlockVariant = keyof typeof variants;

export type TProfileDashboardBlockData = TComponent & {
  propertyValues: {
    variant: TProfileDashboardBlockVariant;
    isPrimaryContent: boolean;
  };
};
