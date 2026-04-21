import { HeadingLevelProvider } from "../../common/Heading";
import Block, { BlockComponentStandardProps } from "../Block";
import useProfileDashboardBlockData, {
  UseProfileDashboardBlockProps,
  UseProfileDashboardBlockData,
} from "./data";
import Loading from "../../common/Loading";
import DashBoardLayout from "../../layout/DashBoardLayout";

import LoggedInSessionSection from "../../partials/LoggedInSessionSection";
import LoggedInCodesSection from "../../partials/LoggedInCodesSection";
import LoggedInApiKeySection from "../../partials/LoggedInApiKeySection";
import LoggedInProfileAdminSection from "../../partials/LoggedInProfileAdminSection";

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
