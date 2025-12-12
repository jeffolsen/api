import prismaClient, { CodeType, Profile } from "../db/client";
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

import sendEmail from "../util/sendEmail";
import generateCode from "../util/generateCode";

interface LogInProfileParams {
  profile: Profile;
  userAgent: string;
  codeType?: CodeType;
}

export const initSession = async ({
  profile,
  userAgent,
  codeType = "LOGIN",
}: LogInProfileParams) => {
  const { id: profileId, email } = profile;

  throwError(
    !(await prismaClient.verificationCode.systemMaxExceeded()) &&
      !(await prismaClient.verificationCode.maxExceeded(profileId)),
    TOO_MANY_REQUESTS,
    "Too many verification code requests. Try again later."
  );

  throwError(
    !(await prismaClient.session.maxExceeded(profile.id, codeType)),
    CONFLICT,
    "Max number of sessions reached"
  );

  const code = generateCode();

  const verificationCode = await prismaClient.verificationCode.create({
    data: {
      profileId,
      type: codeType,
      value: code,
    },
  });

  sendEmail(email, code, codeType);

  const session = await prismaClient.session.create({
    data: {
      profileId,
      userAgent,
      scope: codeType,
      verificationCodes: {
        connect: {
          id: verificationCode.id,
        },
      },
    },
  });

  const refreshToken = signRefreshToken(session.id);
  const accessToken = signAccessToken(session.id);

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

  console.log("refreshAccessToken", payload);
  throwError(payload?.sessionId, BAD_REQUEST, "Invalid token");

  const { sessionId } = payload;
  const sessionWithProfile = await prismaClient.session.findUnique({
    where: { id: sessionId },
    include: { profile: true },
  });
  throwError(sessionWithProfile?.profile, BAD_REQUEST, "Invalid token");
  throwError(sessionWithProfile.isCurrent(), UNAUTHORIZED, "Unauthorized");

  let { profile, ...session } = sessionWithProfile;

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
      usedAt: null,
      expiresAt: { gt: new Date() },
    },
    orderBy: { createdAt: "desc" },
  });
  console.log("processVerificationCode", verificationCode);
  throwError(verificationCode, NOT_FOUND, "No pending code found");

  throwError(
    await verificationCode.validate(value),
    UNAUTHORIZED,
    "Invalid code"
  );

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

interface MaintainApiKeySessionParams {
  slug: string;
  value: string;
}

const refreshApiKeySession = async ({
  slug,
  value,
}: MaintainApiKeySessionParams) => {};
