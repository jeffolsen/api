import { HeadingLevelProvider } from "@/components/common/Heading";
import Block, { BlockComponentStandardProps } from "@/components/blocks/Block";
import useProfileDashboardBlockData, {
  UseProfileDashboardBlockProps,
  UseProfileDashboardBlockData,
} from "@/components/blocks/CmsProfileDashboardBlock/data";
import DashBoardLayout from "@/components/layout/DashBoardLayout";

import LoggedInSessionSection from "@/components/partials/LoggedInSessionSection";
import LoggedInCodesSection from "@/components/partials/LoggedInCodesSection";
import LoggedInProfileAdminSection from "@/components/partials/LoggedInProfileAdminSection";
import Loading from "@/components/common/Loading";
import ScrollInFade from "@/components/common/ScrollInFade";

export default function Component(config: BlockComponentStandardProps) {
  const result = useProfileDashboardBlockData(config);

  if (result.type === "error") return null;

  const { blockProps, blockData } = result;

  return (
    <CmsProfileDashboardBlock blockData={blockData} blockProps={blockProps} />
  );
}

function CmsProfileDashboardBlock({
  blockProps,
  blockData,
}: {
  blockProps: UseProfileDashboardBlockProps;
  blockData: UseProfileDashboardBlockData;
}) {
  const { profileData, sessionsData, verificationCodeData } = blockData;

  if (
    profileData.isLoading ||
    sessionsData.isLoading ||
    verificationCodeData.isLoading
  ) {
    return <Loading />;
  }
  const profile = profileData.data.profile;

  return (
    <Block {...blockProps}>
      <HeadingLevelProvider>
        <DashBoardLayout profile={profile}>
          <HeadingLevelProvider>
            <ScrollInFade className="w-full" critical={true}>
              <LoggedInSessionSection sessionsData={sessionsData} />
            </ScrollInFade>
            <ScrollInFade className="w-full">
              <LoggedInCodesSection
                verificationCodeData={verificationCodeData}
              />
            </ScrollInFade>
            {/* no api keys -JO */}
            <ScrollInFade className="w-full">
              <LoggedInProfileAdminSection />
            </ScrollInFade>
          </HeadingLevelProvider>
        </DashBoardLayout>
      </HeadingLevelProvider>
    </Block>
  );
}
