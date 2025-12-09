import prismaClient, { CodeType } from "../db/client";
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from "../util/jwt";
import {
  BAD_REQUEST,
  CONFLICT,
  INTERNAL_SERVER_ERROR,
  NOT_FOUND,
  TOO_MANY_REQUESTS,
  UNAUTHORIZED,
} from "../config/constants";
import throwError from "../util/throwError";
import { ExtendedProfile } from "../extensions/profile";
import sendEmail from "../util/sendEmail";
import generateCode from "../util/generateCode";

interface LogInProfileParams {
  profile: ExtendedProfile;
  userAgent: string;
  codeType?: CodeType;
}

export const logInProfile = async ({
  profile,
  userAgent,
  codeType = "EMAIL_VERIFICATION",
}: LogInProfileParams) => {
  const { id: profileId, email } = profile;

  throwError(
    !(await prismaClient.verificationCode.dailyMaxExceeded(profileId)),
    TOO_MANY_REQUESTS,
    "Too many verification code requests. Try again later."
  );

  throwError(
    !(await prismaClient.session.maxExceeded(profile.id)),
    CONFLICT,
    "Max number of sessions reached"
  );

  const session = await prismaClient.session.create({
    data: {
      profileId,
      userAgent,
    },
  });

  const refreshToken = signRefreshToken(session.id);
  const accessToken = signAccessToken(session.id);
  const code = generateCode();

  await prismaClient.verificationCode.create({
    data: {
      profileId,
      sessionId: session.id,
      type: codeType,
      value: code,
    },
  });

  sendEmail(email, code, codeType);

  return {
    session,
    refreshToken,
    accessToken,
  };
};

interface RefreshAccessTokenParams {
  refreshToken: string;
}

export const refreshAccessToken = async ({
  refreshToken,
}: RefreshAccessTokenParams) => {
  const payload = verifyRefreshToken(refreshToken);
  throwError(payload?.sessionId, BAD_REQUEST, "Invalid token");

  const { sessionId } = payload;
  const sessionWithProfile = await prismaClient.session.findUnique({
    where: { id: sessionId },
    include: { profile: true },
  });
  throwError(sessionWithProfile?.profile, BAD_REQUEST, "Invalid token");

  const doesntNeedManualRefresh =
    sessionWithProfile.autoRefresh || sessionWithProfile.isCurrent();
  throwError(doesntNeedManualRefresh, UNAUTHORIZED, "Unauthorized");

  let { profile, ...session } = sessionWithProfile;

  // attempt session refresh
  session = (await prismaClient.session.refresh(session.id)) || session;

  return { session, refreshToken, accessToken: signAccessToken(sessionId) };
};

interface ProcessVerificationCodeParams {
  profileId: number;
  sessionId: number;
  value: string;
  type: CodeType;
}

export const processVerificationCode = async ({
  profileId,
  sessionId,
  value,
  type,
}: ProcessVerificationCodeParams) => {
  const verificationCode = await prismaClient.verificationCode.findFirst({
    where: {
      profileId,
      sessionId,
      type,
      used: false,
      expiresAt: { gt: new Date() },
    },
    orderBy: { createdAt: "desc" },
  });
  throwError(verificationCode, NOT_FOUND, "No pending code found");
  throwError(verificationCode.validate(value), UNAUTHORIZED, "Invalid code");

  const usedVerificationCode = await prismaClient.verificationCode.use(
    verificationCode.id
  );
  throwError(
    usedVerificationCode,
    INTERNAL_SERVER_ERROR,
    "Something went wrong"
  );

  return usedVerificationCode;
};
