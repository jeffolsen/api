import prismaClient, { CodeType, Profile } from "../db/client";
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from "../util/jwt";
import {
  CONFLICT,
  NOT_FOUND,
  BAD_REQUEST,
  UNAUTHORIZED,
  TOO_MANY_REQUESTS,
  INTERNAL_SERVER_ERROR,
} from "../config/constants";
import throwError from "../util/throwError";

import sendEmail from "../util/sendEmail";
import generateCode from "../util/generateCode";
import { getNewRefreshTokenExpirationDate } from "../util/date";
import { API_KEY_SESSION } from "../util/scope";

interface LogInProfileParams {
  profile: Profile;
  verificationCode: string;
  userAgent?: string;
}

export const initProfileSession = async ({
  profile,
  verificationCode,
  userAgent,
}: LogInProfileParams) => {
  const { id: profileId } = profile;

  const usedVerificationCode = await processVerificationCode({
    profileId,
    value: verificationCode,
    codeType: CodeType.LOGIN,
  });

  const tooManySessions = await prismaClient.session.maxExceeded(
    profileId,
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

interface LogInApiKeyParams {
  apiKeySlug: string;
  apiKeyString: string;
  origin?: string;
}

export const connectToApiSession = async ({
  apiKeySlug: slug,
  apiKeyString: value,
  origin,
}: LogInApiKeyParams) => {
  const apiKey = await prismaClient.apiKey.findUnique({ where: { slug } });
  throwError(apiKey, NOT_FOUND, "API slug not found");

  const apiKeyIsValid = await apiKey.validate(value);
  throwError(apiKeyIsValid, UNAUTHORIZED, "Invalid api key");
  // throwError(apiKey.origin, UNAUTHORIZED, "Invalid api key");
  throwError(apiKey.origin === origin, UNAUTHORIZED, "Invalid api key");

  let session;
  if (apiKey.sessionId)
    session = await prismaClient.session.findUnique({
      where: { id: apiKey.sessionId },
    });
  if (!session) {
    session = await prismaClient.session.create({
      data: {
        profileId: apiKey.profileId,
        apiKeyId: apiKey.id,
        userAgent: slug,
        scope: API_KEY_SESSION,
      },
    });
    await prismaClient.apiKey.update({
      where: { slug },
      data: { sessionId: session.id },
    });
  }

  if (!session.isCurrent())
    session = await prismaClient.session.update({
      where: { id: session.id },
      data: {
        expiresAt: getNewRefreshTokenExpirationDate(),
      },
    });

  const refreshToken = signRefreshToken(session.id, apiKey.origin);
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
    (await prismaClient.verificationCode.maxExceeded(profileId, codeType));
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
