import { HeadingLevelProvider } from "@/components/common/Heading";
import Block, { BlockComponentStandardProps } from "@/components/blocks/Block";
import useProfileDashboardBlockData, {
  UseProfileDashboardBlockProps,
  UseProfileDashboardBlockData,
} from "@/components/blocks/CmsProfileDashboardBlock/data";
import Loading from "@/components/common/Loading";
import DashBoardLayout from "@/components/layout/DashBoardLayout";

import LoggedInSessionSection from "@/components/partials/LoggedInSessionSection";
import LoggedInCodesSection from "@/components/partials/LoggedInCodesSection";
import LoggedInApiKeySection from "@/components/partials/LoggedInApiKeySection";
import LoggedInProfileAdminSection from "@/components/partials/LoggedInProfileAdminSection";

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
  const { profileData } = blockData;

  if (profileData.isLoading) {
    return (
      <Block {...blockProps}>
        <Loading />
      </Block>
    );
  }
  const profile = profileData.data.profile;

  return (
    <Block {...blockProps}>
      <HeadingLevelProvider>
        <DashBoardLayout profile={profile}>
          <HeadingLevelProvider>
            <LoggedInSessionSection />
            <LoggedInCodesSection />
            <LoggedInApiKeySection />
            <LoggedInProfileAdminSection />
          </HeadingLevelProvider>
        </DashBoardLayout>
      </HeadingLevelProvider>
    </Block>
  );
}
