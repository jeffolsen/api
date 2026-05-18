import { useGetAuthenticatedProfile } from "@/network/profile/useGetAuthenticatedProfile";
import {
  BlockComponentStandardProps,
  BlockComponentDataReturnType,
  BlockProps,
  BlockData,
} from "@/components/blocks/Block";
import { useGetProfileVerificationCodes } from "@/network/verificationCode/useGetProfileVerificationCodes";
import { useGetProfilesSessions } from "@/network/session";
import handleBlockError from "@/utils/handleBlockError";

const variants = {
  default: {
    width: "lg",
  },
} as const;

function useProfileDashboardBlockData({
  component,
  critical,
}: BlockComponentStandardProps): UseProfileDashboardBlockDataReturnType {
  const { id, name, propertyValues } = component;

  const { variant, isPrimaryContent } = propertyValues as PropertyValues;

  const blockSettings = variants[variant] || variants["default"];

  const profile = useGetAuthenticatedProfile();
  const verificationCodes = useGetProfileVerificationCodes();
  const sessions = useGetProfilesSessions();

  if (profile.error) {
    handleBlockError(profile.error);
  }
  if (verificationCodes.error) {
    handleBlockError(verificationCodes.error);
  }
  if (sessions.error) {
    handleBlockError(sessions.error);
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
    blockData: {
      id,
      profileData: profile,
      sessionsData: sessions,
      verificationCodeData: verificationCodes,
    },
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
  sessionsData: ReturnType<typeof useGetProfilesSessions>;
  verificationCodeData: ReturnType<typeof useGetProfileVerificationCodes>;
};

export type UseProfileDashboardBlockProps = BlockProps<BlockSettings>;
export type UseProfileDashboardBlockData = BlockData<LocalBlockData>;
export type UseProfileDashboardBlockDataReturnType =
  BlockComponentDataReturnType<BlockSettings, LocalBlockData>;
