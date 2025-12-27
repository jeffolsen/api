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
  userAgent?: string;
  codeType?: CodeType;
}

export const initSession = async ({
  profile,
  userAgent,
  codeType = "LOGIN",
}: LogInProfileParams) => {
  const { id: profileId, email } = profile;

  const tooManySessions = await prismaClient.session.maxExceeded(
    profile.id,
    codeType,
  );
  throwError(!tooManySessions, CONFLICT, "Max number of sessions reached");

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

  throwError(payload?.sessionId, BAD_REQUEST, "Invalid token");

  const { sessionId } = payload;
  const sessionWithProfile = await prismaClient.session.findUnique({
    where: { id: sessionId },
    include: { profile: true },
  });
  throwError(sessionWithProfile?.profile, BAD_REQUEST, "Invalid token");
  throwError(sessionWithProfile.isCurrent(), UNAUTHORIZED, "Unauthorized");

  const { profile, ...session } = sessionWithProfile;

  return { session, refreshToken, accessToken: signAccessToken(sessionId) };
};

interface SendVerificationCode {
  profileId: number;
  email: string;
  codeType: CodeType;
}

export const sendVerificationCode = async ({
  profileId,
  email,
  codeType,
}: SendVerificationCode) => {
  const tooManyVerifcationCodes =
    (await prismaClient.verificationCode.systemDailyMaxExceeded()) ||
    (await prismaClient.verificationCode.maxExceeded(profileId));
  throwError(
    !tooManyVerifcationCodes,
    TOO_MANY_REQUESTS,
    "Too many verification code requests. Try again later.",
  );

  const code = generateCode();
  const validEmail = sendEmail(email, code, codeType);
  throwError(
    validEmail,
    INTERNAL_SERVER_ERROR,
    "Problem sending email. Try again later.",
  );

  const verificationCode = await prismaClient.verificationCode.create({
    data: {
      profileId,
      type: codeType,
      value: code,
    },
  });

  return verificationCode;
};

interface ProcessVerificationCodeParams {
  profileId: number;
  value: string;
  type: CodeType;
}

export const processVerificationCode = async ({
  profileId,
  value,
  type,
}: ProcessVerificationCodeParams) => {
  const verificationCode = await prismaClient.verificationCode.findFirst({
    where: {
      profileId,
      type,
      usedAt: null,
      expiresAt: { gt: new Date() },
    },
    orderBy: { createdAt: "desc" },
  });
  throwError(verificationCode, NOT_FOUND, "No pending code found");

  const verificationCodeIsValid = await verificationCode.validate(value);
  throwError(verificationCodeIsValid, UNAUTHORIZED, "Invalid code");

  const usedVerificationCode = await prismaClient.verificationCode.use(
    verificationCode.id,
  );
  throwError(
    usedVerificationCode,
    INTERNAL_SERVER_ERROR,
    "Something went wrong",
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
