import prismaClient from "@db/client";
import { CodeType } from "@db/client";
import { MAX_DAILY_SYSTEM_EMAILS, MAX_PROFILE_CODES } from "@config/constants";
import { getVerificationCodeExpirationWindow, oneDayAgo } from "@util/date";
import throwError from "@util/throwError";
import { compareValue } from "@util/bcrypt";
import { isSessionLimitReached } from "@services/session";
import { NOT_FOUND, TOO_MANY_REQUESTS } from "@config/errorCodes";
import {
  MESSAGE_CREDENTIALS,
  MESSAGE_SESSION_TOO_MANY,
} from "@config/errorMessages";
import {
  findProfileWithReceipt,
  hasConfirmedEmail,
  hasLegalRequirements,
} from "@/services/profile";

export const useVerificationCode = async (id: number) => {
  return await prismaClient.verificationCode.update({
    where: { id },
    data: { usedAt: new Date() },
  });
};

export const isVerificationCodeLimitReached = async (
  profileId: number,
  codeType: CodeType,
) => {
  if (codeType === CodeType.LOGOUT_ALL || codeType === CodeType.DELETE_PROFILE)
    return false;
  const codes = await prismaClient.verificationCode.findMany({
    where: {
      profileId,
      createdAt: { gte: getVerificationCodeExpirationWindow() },
    },
    take: MAX_PROFILE_CODES,
  });
  return codes.length === MAX_PROFILE_CODES;
};

export const isDailyEmailLimitReached = async () => {
  const codes = await prismaClient.verificationCode.findMany({
    where: { createdAt: { gte: oneDayAgo() } },
    take: MAX_DAILY_SYSTEM_EMAILS,
  });
  return codes.length >= MAX_DAILY_SYSTEM_EMAILS;
};

export const requestDeleteProfileCode = async (
  profileId: number,
  password: string | undefined,
) => {
  throwError(password, NOT_FOUND, MESSAGE_CREDENTIALS);
  const profile = await findProfileWithReceipt({ id: profileId });
  throwError(
    profile &&
      hasLegalRequirements(profile) &&
      (await compareValue(password, profile.password)),
    NOT_FOUND,
    MESSAGE_CREDENTIALS,
  );
  return { profile: profile!, codeType: CodeType.DELETE_PROFILE };
};

export const requestManageApiKeyCode = async (
  profileId: number,
  password: string | undefined,
) => {
  throwError(password, NOT_FOUND, MESSAGE_CREDENTIALS);
  const profile = await findProfileWithReceipt({ id: profileId });
  throwError(
    profile &&
      hasLegalRequirements(profile) &&
      hasConfirmedEmail(profile) &&
      (await compareValue(password, profile.password)),
    NOT_FOUND,
    MESSAGE_CREDENTIALS,
  );
  return { profile: profile!, codeType: CodeType.CREATE_API_KEY };
};

export const requestLoginCode = async (
  email: string | undefined,
  password: string | undefined,
) => {
  throwError(email && password, NOT_FOUND, MESSAGE_CREDENTIALS);
  const profile = await findProfileWithReceipt({ email });

  throwError(
    profile &&
      hasLegalRequirements(profile) &&
      (await compareValue(password, profile.password)),
    NOT_FOUND,
    MESSAGE_CREDENTIALS,
  );
  throwError(
    !(await isSessionLimitReached(profile!.id)),
    TOO_MANY_REQUESTS,
    MESSAGE_SESSION_TOO_MANY,
  );
  return { profile: profile!, codeType: CodeType.LOGIN };
};

export const requestSessionResetCode = async (
  email: string | undefined,
  password: string | undefined,
) => {
  throwError(email && password, NOT_FOUND, MESSAGE_CREDENTIALS);
  const profile = await findProfileWithReceipt({ email });
  throwError(
    profile &&
      hasLegalRequirements(profile) &&
      (await compareValue(password, profile.password)),
    NOT_FOUND,
    MESSAGE_CREDENTIALS,
  );
  return { profile: profile!, codeType: CodeType.LOGOUT_ALL };
};

export const requestPasswordResetCode = async (email: string | undefined) => {
  throwError(email, NOT_FOUND, MESSAGE_CREDENTIALS);
  const profile = await findProfileWithReceipt({ email });
  throwError(
    profile && hasLegalRequirements(profile),
    NOT_FOUND,
    MESSAGE_CREDENTIALS,
  );
  return { profile: profile!, codeType: CodeType.PASSWORD_RESET };
};
