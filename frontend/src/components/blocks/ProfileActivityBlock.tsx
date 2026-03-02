import { useGetAuthenticatedProfile } from "../../network/profile";
import Block, { BlockProps } from "./Block";
import Heading, { HeadingLevelProvider } from "../common/Heading";
import Loading from "../common/Loading";
import dayjs, { longDatetime, techDatetime } from "../../utils/dayjs";
import Text from "../common/Text";
import { Button } from "../common/Button";
import LoggedInSessionSection from "../partials/LoggedInSessionSection";
import LoggedInApiKeySection from "../partials/LoggedInApiKeySection";
import LoggedInCodesSection from "../partials/LoggedInCodesSection";
import LoggedInProfileAdminSection from "../partials/LoggedInProfileAdminSection";

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
            Member since {dayjs(profile?.createdAt).format(longDatetime)}
          </Text>
          <Text textSize="sm" className="text-center text-primary-content/70">
            Last updated: {dayjs(profile?.updatedAt).format(techDatetime)}
          </Text>
        </div>
        <div className="flex flex-wrap md:flex-nowrap justify-center gap-4 mx-auto mt-8 w-full">
          <Button
            as="Link"
            color="primary"
            className="w-full md:flex-1 md:w-auto"
            to="/items"
          >
            Items
          </Button>
          <Button
            as="Link"
            color="primary"
            className="w-full md:flex-1 md:w-auto"
            to="/feeds"
          >
            Feeds
          </Button>
          <Button
            as="Link"
            color="primary"
            className="w-full md:flex-1 md:w-auto"
            to="/"
          >
            Home
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
