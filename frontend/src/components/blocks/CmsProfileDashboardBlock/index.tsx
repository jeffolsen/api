import { HeadingLevelProvider } from "../../common/Heading";
import Block, { BlockStandardProps } from "../Block";
import useProfileDashboardBlockData, {
  UseProfileDashboardSuccessReturnType,
} from "./data";
import Loading from "../../common/Loading";
import DashBoardLayout from "../../layout/DashBoardLayout";

import LoggedInSessionSection from "../../partials/LoggedInSessionSection";
import LoggedInCodesSection from "../../partials/LoggedInCodesSection";
import LoggedInApiKeySection from "../../partials/LoggedInApiKeySection";
import LoggedInProfileAdminSection from "../../partials/LoggedInProfileAdminSection";

export default function Component({
  component,
  params,
  path,
}: BlockStandardProps) {
  const result = useProfileDashboardBlockData({ component, params, path });

  if ("error" in result) return null;

  const { blockProps, blockData } = result;

  return (
    <CmsProfileDashboardBlock blockData={blockData} blockProps={blockProps} />
  );
}

function CmsProfileDashboardBlock({
  blockProps,
  blockData,
}: {
  blockProps: UseProfileDashboardSuccessReturnType["blockProps"];
  blockData: UseProfileDashboardSuccessReturnType["blockData"];
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
