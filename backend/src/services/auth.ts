import prismaClient, {
  ApiKey,
  CodeType,
  ExtendedProfile,
  Profile,
} from "../db/client";
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from "../util/jwt";
import {
  BAD_REQUEST,
  TOO_MANY_REQUESTS,
  INTERNAL_SERVER_ERROR,
  FORBIDDEN,
  ERROR_UNAUTHORIZED,
  ERROR_VERIFICATION_CODE_TOO_MANY,
  ERROR_COULD_NOT_SEND_EMAIL,
  ERROR_INVALID_TOKEN,
  ERROR_SESSION_CANNOT_REFRESH,
  ERROR_SESSION_TOO_MANY,
  ERROR_INVALID_API_KEY,
  NOT_FOUND,
  ERROR_CREDENTIALS,
  ERROR_ENDPOINT_NOT_FOUND,
} from "../config/constants";
import throwError from "../util/throwError";
import sendEmail from "../util/sendEmail";
import generateCode from "../util/generateCode";
import {
  getNewRefreshTokenExpirationDate,
  getNewVerificationCodeExpirationDate,
} from "../util/date";
import { API_KEY_SESSION, PROFILE_SESSION } from "../util/scope";
import { VerificationCodeCreateTransform } from "../schemas/verificationCode";

interface LogInProfileParams {
  profile: Profile;
  userAgent: string;
  verificationCode: string;
}

export const initProfileSession = async ({
  profile,
  verificationCode,
  userAgent,
}: LogInProfileParams) => {
  const { id: profileId } = profile;

  const tooManySessions = await prismaClient.session.maxExceeded(profileId);
  throwError(!tooManySessions, TOO_MANY_REQUESTS, ERROR_SESSION_TOO_MANY);

  await processVerificationCode({
    profileId,
    value: verificationCode,
    codeType: CodeType.LOGIN,
    userAgent,
  });

  const session = await prismaClient.session.start({
    profileId,
    scope: PROFILE_SESSION,
    userAgent,
  });

  const refreshToken = signRefreshToken(session.id);
  const accessToken = signAccessToken(session.id);

  return {
    session,
    refreshToken,
    accessToken,
  };
};

interface ConnectToApiSessionParams {
  apiKey: ApiKey;
  userAgent: string;
}

export const connectToApiSession = async ({
  apiKey,
  userAgent,
}: ConnectToApiSessionParams) => {
  const { slug, origin, sessionId, profileId, id: apiKeyId } = apiKey;
  throwError(slug && origin && profileId, BAD_REQUEST, ERROR_INVALID_API_KEY);

  let session;
  if (sessionId)
    session = await prismaClient.session.findUnique({
      where: { id: sessionId },
    });

  const needToExtendTheSession = !session?.isCurrent();
  throwError(needToExtendTheSession, FORBIDDEN, ERROR_SESSION_CANNOT_REFRESH);

  if (!session) {
    session = await prismaClient.session.start({
      profileId: profileId,
      apiKeyId: apiKeyId,
      scope: API_KEY_SESSION,
      userAgent,
    });
    apiKey = await prismaClient.apiKey.update({
      where: { slug },
      data: { sessionId: session.id },
    });
  }

  const sessionIsntCurrent = !session.isCurrent();
  const sessionNeedsApiKeyId = session.apiKeyId !== apiKeyId;

  if (sessionIsntCurrent || sessionNeedsApiKeyId)
    session = await prismaClient.session.update({
      where: { id: session.id },
      data: {
        ...(sessionIsntCurrent && {
          expiredAt: getNewRefreshTokenExpirationDate(),
        }),
        ...(sessionNeedsApiKeyId && {
          apiKeyId,
        }),
      },
    });

  const refreshToken = signRefreshToken(session.id, origin);
  const accessToken = signAccessToken(session.id);

  return {
    session,
    refreshToken,
    accessToken,
  };
};

interface RefreshAccessTokenParams {
  refreshToken: string;
  userAgent?: string;
}

export const refreshAccessToken = async ({
  refreshToken,
  userAgent,
}: RefreshAccessTokenParams) => {
  const payload = verifyRefreshToken(refreshToken);

  throwError(payload?.sessionId, BAD_REQUEST, ERROR_INVALID_TOKEN);

  const { sessionId } = payload;
  const sessionWithProfile = await prismaClient.session.findUnique({
    where: { id: sessionId, ...(userAgent && { userAgent }) },
    include: { profile: true },
  });
  throwError(sessionWithProfile?.profile, BAD_REQUEST, ERROR_INVALID_TOKEN);
  throwError(sessionWithProfile.isCurrent(), FORBIDDEN, ERROR_UNAUTHORIZED);

  const { profile, ...session } = sessionWithProfile;

  return { session, refreshToken, accessToken: signAccessToken(sessionId) };
};

interface SendVerificationCode {
  profile: ExtendedProfile;
  codeType: CodeType;
  userAgent: string;
}

export const sendVerificationCode = async ({
  profile,
  codeType,
  userAgent,
}: SendVerificationCode) => {
  const { id: profileId, email } = profile;
  const tooManyVerifcationCodes =
    (await prismaClient.verificationCode.systemDailyMaxExceeded()) ||
    (await prismaClient.verificationCode.maxExceeded(profileId, codeType));
  throwError(
    !tooManyVerifcationCodes,
    TOO_MANY_REQUESTS,
    ERROR_VERIFICATION_CODE_TOO_MANY,
  );

  const code = generateCode();

  const verificationCodeProps =
    await VerificationCodeCreateTransform.parseAsync({
      profileId,
      type: codeType,
      value: code,
      userAgent,
    });

  const validEmail = sendEmail(email, code, codeType);
  throwError(validEmail, INTERNAL_SERVER_ERROR, ERROR_COULD_NOT_SEND_EMAIL);

  return await prismaClient.verificationCode.create({
    data: {
      ...verificationCodeProps,
      expiredAt: getNewVerificationCodeExpirationDate(),
    },
  });
};

interface ProcessVerificationCodeParams {
  profileId: number;
  value: string;
  codeType: CodeType;
  userAgent: string;
}

export const processVerificationCode = async ({
  profileId,
  value,
  codeType,
  userAgent,
}: ProcessVerificationCodeParams) => {
  const verificationCode = await prismaClient.verificationCode.findFirst({
    where: {
      profileId,
      usedAt: null,
      type: codeType,
      expiredAt: { gt: new Date() },
      userAgent,
    },
    orderBy: { createdAt: "desc" },
  });
  throwError(
    verificationCode && (await verificationCode.validate(value)),
    NOT_FOUND,
    ERROR_CREDENTIALS,
  );

  const usedVerificationCode = await prismaClient.verificationCode.use(
    verificationCode.id,
  );

  return usedVerificationCode;
};
