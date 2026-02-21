import { useGetAuthenticatedProfile } from "../../network/profile";
import { useGetProfilesSessions } from "../../network/session";
import { useGetProfileVerificationCodes } from "../../network/verificationCode";
import Grid from "../common/Grid";
import BasicCard from "../cards/BasicCard";
import Block, { BlockProps } from "./Block";
import Heading, { HeadingLevelProvider } from "../common/Heading";

function ProfileInfoBlock(props: BlockProps) {
  const getProfile = useGetAuthenticatedProfile();
  const getSessions = useGetProfilesSessions();
  const getVerificationCodes = useGetProfileVerificationCodes();

  if (getProfile.isLoading) {
    return <Block {...props}>Loading...</Block>;
  }

  const profile = getProfile.data;
  const sessions = getSessions.data;
  const verificationCodes = getVerificationCodes.data;

  console.log(
    "profile",
    profile,
    "sessions",
    sessions,
    "verificationCodes",
    verificationCodes,
  );

  return (
    <Block {...props}>
      <HeadingLevelProvider>
        <Heading
          headingSize="md"
          headingDecorator="none"
          headingStyles="text-center uppercase bold text-primary-content"
        >
          {profile?.email}
        </Heading>
        <HeadingLevelProvider>
          <Heading
            headingSize="md"
            headingDecorator="none"
            headingStyles="text-center uppercase bold text-primary-content"
          >
            Current Sessions
          </Heading>
          {sessions && (
            <Grid
              columns={{ base: "2", sm: "2", md: "3", lg: "4", xl: "5" }}
              items={sessions?.map(
                (session: { userAgent: string; createdAt: string }) => (
                  <BasicCard
                    title={session.userAgent}
                    description={new Date(session.createdAt).toLocaleString()}
                  />
                ),
              )}
            />
          )}
          <Heading
            headingSize="md"
            headingDecorator="none"
            headingStyles="text-center uppercase bold text-primary-content"
          >
            History
          </Heading>
          {verificationCodes && (
            <Grid
              // columns={{ sm: 2, md: 3, lg: 3 }}
              items={verificationCodes?.map(
                (verificationCodes: { type: string; createdAt: string }) => (
                  <BasicCard
                    title={verificationCodes.type}
                    description={new Date(
                      verificationCodes.createdAt,
                    ).toLocaleString()}
                  />
                ),
              )}
            />
          )}
        </HeadingLevelProvider>
      </HeadingLevelProvider>
    </Block>
  );
}

export default ProfileInfoBlock;
