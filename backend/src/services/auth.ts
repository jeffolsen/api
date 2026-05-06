import prismaClient, { ApiKey, CodeType, Profile } from "@db/client";
import type { Prisma } from "@/generated/prisma/client";
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from "@util/jwt";
import {
  MESSAGE_UNAUTHORIZED,
  MESSAGE_VERIFICATION_CODE_TOO_MANY,
  MESSAGE_COULD_NOT_SEND_EMAIL,
  MESSAGE_INVALID_TOKEN,
  MESSAGE_SESSION_TOO_MANY,
  MESSAGE_CREDENTIALS,
} from "@config/errorMessages";
import {
  TOO_MANY_REQUESTS,
  BAD_REQUEST,
  INTERNAL_SERVER_ERROR,
  FORBIDDEN,
  NOT_FOUND,
} from "@config/errorCodes";
import throwError from "@util/throwError";
import sendEmail from "@util/sendEmail";
import generateCode from "@util/generateCode";
import { getNewVerificationCodeExpirationDate } from "@util/date";
import { PROFILE_SESSION } from "@util/scope";
import { VerificationCodeCreateTransform } from "@schemas/verificationCode";
import { compareValue } from "@util/bcrypt";
import {
  startSession,
  isSessionCurrent,
  isSessionLimitReached,
} from "./session";
import {
  isVerificationCodeLimitReached,
  isDailyEmailLimitReached,
} from "./verificationCode";
import { ProfileGetPayload } from "@/generated/prisma/models";

interface LogInProfileParams {
  profile: ProfileGetPayload<{ include: { profileReceipt: true } }>;
  userAgent: string;
  verificationCode: string;
}

export const initProfileSession = async ({
  profile,
  verificationCode,
  userAgent,
}: LogInProfileParams) => {
  const { id: profileId } = profile;

  const tooManySessions = await isSessionLimitReached(profileId);
  throwError(!tooManySessions, TOO_MANY_REQUESTS, MESSAGE_SESSION_TOO_MANY);

  const session = await prismaClient.$transaction(async (tx) => {
    await processVerificationCode(
      {
        profileId,
        value: verificationCode,
        codeType: CodeType.LOGIN,
        userAgent,
      },
      tx,
    );

    if (!profile.profileReceipt?.verifiedEmailAt) {
      await tx.profileReceipt.update({
        where: { profileId },
        data: { verifiedEmailAt: new Date() },
      });
    }

    return await tx.session.create({
      data: await startSession({
        profileId,
        scope: PROFILE_SESSION,
        userAgent,
      }),
    });
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
  userAgent?: string;
}

export const refreshAccessToken = async ({
  refreshToken,
  userAgent,
}: RefreshAccessTokenParams) => {
  const payload = verifyRefreshToken(refreshToken);
  throwError(payload?.sessionId, BAD_REQUEST, MESSAGE_INVALID_TOKEN);

  const { sessionId } = payload;
  const sessionWithProfile = await prismaClient.session.findUnique({
    where: { id: sessionId, ...(userAgent && { userAgent }) },
    include: { profile: true },
  });
  throwError(sessionWithProfile?.profile, BAD_REQUEST, MESSAGE_INVALID_TOKEN);
  throwError(
    isSessionCurrent(sessionWithProfile),
    FORBIDDEN,
    MESSAGE_UNAUTHORIZED,
  );

  const { profile, ...session } = sessionWithProfile;

  return { session, refreshToken, accessToken: signAccessToken(sessionId) };
};

interface SendVerificationCode {
  profile: ProfileGetPayload<{ include: { profileReceipt: true } }>;
  codeType: CodeType;
  userAgent: string;
}

export const sendVerificationCode = async ({
  profile,
  codeType,
  userAgent,
}: SendVerificationCode) => {
  const { id: profileId, email } = profile;
  const tooManyVerificationCodes =
    (await isDailyEmailLimitReached()) ||
    (await isVerificationCodeLimitReached(profileId, codeType));
  throwError(
    !tooManyVerificationCodes,
    TOO_MANY_REQUESTS,
    MESSAGE_VERIFICATION_CODE_TOO_MANY,
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
  throwError(validEmail, INTERNAL_SERVER_ERROR, MESSAGE_COULD_NOT_SEND_EMAIL);

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

export const processVerificationCode = async (
  { profileId, value, codeType, userAgent }: ProcessVerificationCodeParams,
  tx?: Prisma.TransactionClient,
) => {
  const run = async (client: Prisma.TransactionClient) => {
    const verificationCode = await client.verificationCode.findFirst({
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
      verificationCode && (await compareValue(value, verificationCode.value)),
      NOT_FOUND,
      MESSAGE_CREDENTIALS,
    );

    return await client.verificationCode.update({
      where: { id: verificationCode.id },
      data: { usedAt: new Date() },
    });
  };

  return tx ? run(tx) : prismaClient.$transaction(run);
};

type AuthenticateWithApiKeyResult = ApiKey | null;

type AuthenticateWithApiKeyInput = {
  apiKey?: string;
  apiSlug?: string;
  origin: string;
};

export const authenticateWithApiKey = async ({
  apiKey,
  apiSlug,
  origin,
}: AuthenticateWithApiKeyInput): Promise<AuthenticateWithApiKeyResult> => {
  if (!apiKey || !apiSlug) return null;

  const apiKeyRecord = await prismaClient.apiKey.findFirst({
    where: {
      slug: apiSlug,
      value: apiKey,
    },
  });

  // maybe if the record has no origin then the provided origin is evaluated against an env value
  throwError(
    apiKeyRecord && (apiKeyRecord.origin === origin || !apiKeyRecord.origin),
    BAD_REQUEST,
    MESSAGE_INVALID_TOKEN,
  );

  return apiKeyRecord;
};
