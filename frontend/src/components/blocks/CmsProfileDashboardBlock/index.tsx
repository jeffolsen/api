import { HeadingLevelProvider } from "../../common/Heading";
import Block, { BlockProps } from "../Block";
import useProfileDashboardBlockData from "./data";
import Loading from "../../common/Loading";
import DashBoardLayout from "../../layout/DashBoardLayout";

import LoggedInSessionSection from "../../partials/LoggedInSessionSection";
import LoggedInCodesSection from "../../partials/LoggedInCodesSection";
import LoggedInApiKeySection from "../../partials/LoggedInApiKeySection";
import LoggedInProfileAdminSection from "../../partials/LoggedInProfileAdminSection";

function CmsProfileDashboardBlock(props: BlockProps) {
  const result = useProfileDashboardBlockData({ pageProps: props });
  if ("error" in result) {
    return null;
  }
  const { blockProps, blockData } = result;
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
    <Block {...props}>
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

export default CmsProfileDashboardBlock;
