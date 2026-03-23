import { useGetAuthenticatedProfile } from "../../network/profile";
import Block, { BlockProps } from "./Block";
import { HeadingLevelProvider } from "../common/Heading";
import Loading from "../common/Loading";
import LoggedInSessionSection from "../partials/LoggedInSessionSection";
import LoggedInApiKeySection from "../partials/LoggedInApiKeySection";
import LoggedInCodesSection from "../partials/LoggedInCodesSection";
import LoggedInProfileAdminSection from "../partials/LoggedInProfileAdminSection";
import DashBoardLayout from "../layout/DashBoardLayout";

function ProfileInfoBlock(props: BlockProps) {
  const getProfile = useGetAuthenticatedProfile();
  const profile = getProfile.data?.profile;

  if (getProfile.isLoading || !profile?.email) {
    return (
      <Block {...props}>
        <Loading />
      </Block>
    );
  }

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

export default ProfileInfoBlock;
