import { useGetAuthenticatedProfile } from "../../network/profile";
import Block, { BlockProps } from "./Block";
import Heading, { HeadingLevelProvider } from "../common/Heading";
import Loading from "../common/Loading";
import dayjs, { longDatetime, techDatetime } from "../../utils/dayjs";
import Text from "../common/Text";
import { Button } from "../common/Button";
import { useLogout } from "../../network/session";
import LoggedInSessionSection from "../partials/LoggedInSessionSection";
import LoggedInApiKeySection from "../partials/LoggedInApiKeySection";
import LoggedInCodesSection from "../partials/LoggedInCodesSection";
import LoggedInProfileAdminSection from "../partials/LoggedInProfileAdminSection";

function ProfileInfoBlock(props: BlockProps) {
  const getProfile = useGetAuthenticatedProfile();
  const profile = getProfile.data;
  const logout = useLogout();

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
            Member since {dayjs(profile?.createdAt).format(longDatetime)}
          </Text>
          <Text textSize="sm" className="text-center text-primary-content/70">
            Last updated: {dayjs(profile?.updatedAt).format(techDatetime)}
          </Text>
        </div>
        <div className="flex justify-center gap-4 mx-auto mt-8 w-full">
          <Button
            color="primary"
            className="flex-1"
            onClick={() => {
              logout.mutateAsync();
            }}
          >
            Items
          </Button>
          <Button
            color="primary"
            className="flex-1"
            onClick={() => {
              logout.mutateAsync();
            }}
          >
            Feeds
          </Button>
          <Button
            color="error"
            className="flex-1"
            onClick={() => {
              logout.mutateAsync();
            }}
          >
            Logout
          </Button>
        </div>

        <HeadingLevelProvider>
          <LoggedInSessionSection />
          <LoggedInCodesSection />
          <LoggedInApiKeySection />
          <LoggedInProfileAdminSection />
        </HeadingLevelProvider>
      </HeadingLevelProvider>
    </Block>
  );
}

export default ProfileInfoBlock;
