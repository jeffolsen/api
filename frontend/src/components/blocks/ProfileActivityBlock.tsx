import { useGetAuthenticatedProfile } from "../../network/profile";
import { useGetProfilesSessions } from "../../network/session";
import { useGetProfileVerificationCodes } from "../../network/verificationCode";
import Block, { BlockProps } from "./Block";

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

  return <Block {...props}>{profile?.email}</Block>;
}

export default ProfileInfoBlock;
