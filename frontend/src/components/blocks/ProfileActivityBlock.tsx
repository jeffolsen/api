import { useGetAuthenticatedProfile } from "../../network/profile";
import Block, { BlockProps } from "./Block";
import Heading, { HeadingLevelProvider } from "../common/Heading";
import Loading from "../common/Loading";
import dayjs, { longFormat, techFormat } from "../../utils/dayjs";
import Text from "../common/Text";
import LoggedInSessionSection from "../partials/LoggedInSessionSection";
import LoggedInApiKeySection from "../partials/LoggedInApiKeySection";
import LoggedInCodesSection from "../partials/LoggedInCodesSection";

function ProfileInfoBlock(props: BlockProps) {
  const getProfile = useGetAuthenticatedProfile();
  const profile = getProfile.data;

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
        <Heading
          headingSize="lg"
          headingDecorator="none"
          headingStyles="text-center bold mt-8 text-accent tracking-widest italic"
        >
          {profile?.email}
        </Heading>
        <div className="flex flex-col items-center gap-2">
          <Text textSize="lg" className="text-center text-primary-content/90">
            Member since {dayjs(profile?.createdAt).format(longFormat)}
          </Text>
          <Text textSize="sm" className="text-center text-primary-content/70">
            Last updated: {dayjs(profile?.updatedAt).format(techFormat)}
          </Text>
        </div>

        <HeadingLevelProvider>
          <LoggedInApiKeySection />
          <LoggedInSessionSection />
          <LoggedInCodesSection />
        </HeadingLevelProvider>
      </HeadingLevelProvider>
    </Block>
  );
}

export default ProfileInfoBlock;
