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
  credentials: string;
  userAgent?: string;
}

export const initSession = async ({
  profile,
  credentials,
  userAgent,
}: LogInProfileParams) => {
  const { id: profileId } = profile;

  const usedVerificationCode = await processVerificationCode({
    profileId: profile.id,
    value: credentials,
    codeType: CodeType.LOGIN,
  });

  const tooManySessions = await prismaClient.session.maxExceeded(
    profile.id,
    usedVerificationCode.type,
  );
  throwError(!tooManySessions, CONFLICT, "Max number of sessions reached");

  const session = await prismaClient.session.create({
    data: {
      profileId,
      userAgent: userAgent || "",
      scope: usedVerificationCode.type,
      verificationCodes: {
        connect: {
          id: usedVerificationCode.id,
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
  codeType: CodeType;
}

export const processVerificationCode = async ({
  profileId,
  value,
  codeType,
}: ProcessVerificationCodeParams) => {
  const verificationCode = await prismaClient.verificationCode.findFirst({
    where: {
      profileId,
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
    usedVerificationCode?.type === codeType,
    UNAUTHORIZED,
    "Invalid credentials",
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
