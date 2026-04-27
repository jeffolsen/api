import prismaClient from "@db/client";
import { CodeType } from "@db/client";
import { MAX_DAILY_SYSTEM_EMAILS, MAX_PROFILE_CODES } from "@config/constants";
import { getVerificationCodeExpirationWindow, oneDayAgo } from "@util/date";

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
  return codes.length === MAX_DAILY_SYSTEM_EMAILS;
};
