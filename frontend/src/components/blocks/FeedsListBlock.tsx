import Block, { BlockProps } from "./Block";
import { HeadingLevelProvider } from "../common/Heading";
import Button from "../common/Button";
import Loading from "../common/Loading";
import DashBoardLayout from "../layout/DashBoardLayout";
import { useGetAuthenticatedProfile } from "../../network/profile";
import SectionHeading from "../partials/SectionHeading";

function FeedsListBlock(props: BlockProps) {
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
          <SectionHeading
            text="Your Feeds"
            description="This lists all your created feeds. Click edit to update a feed or create a new one."
          >
            <Button as="Link" to="/feeds/new" size="md" color="primary">
              Create New Feed
            </Button>
          </SectionHeading>
          Not implemented yet.
        </DashBoardLayout>
      </HeadingLevelProvider>
    </Block>
  );
}

export default FeedsListBlock;
