import {
  MAX_PROFILE_CODES,
  NOT_FOUND,
  TOO_MANY_REQUESTS,
  UNAUTHORIZED,
} from "../config/constants";
import prismaClient, { codeType } from "../db/client";
import { compareValue, hashValue } from "../util/bcrypt";
import { getNewVerificationCodeExpirationDate } from "../util/date";
import generateCode from "../util/generateCode";
import { defaultProfileScope } from "../util/scope";
import throwError from "../util/throwError";

interface CreateVerificationCodeParams {
  profileId: number;
  sessionId: number;
  codeType: codeType;
}

export const createVerificationCode = async ({
  profileId,
  sessionId,
  codeType,
}: CreateVerificationCodeParams) => {
  const activeCodes = await prismaClient.verificationCode.findMany({
    where: {
      profileId,
      expiresAt: {
        gt: new Date(),
      },
    },
  });
  throwError(
    activeCodes.length <= MAX_PROFILE_CODES,
    TOO_MANY_REQUESTS,
    "Too many verification code requests. Try again later."
  );

  const code = generateCode();
  const codeHashed = await hashValue(code);

  await prismaClient.verificationCode.create({
    data: {
      profileId,
      sessionId,
      expiresAt: getNewVerificationCodeExpirationDate(),
      type: codeType,
      value: codeHashed,
    },
  });

  return code;
};

interface ValidateVerificationCodeParams {
  profileId: number;
  sessionId: number;
  value: string;
  type: codeType;
}

export const validateVerificationCode = async ({
  profileId,
  sessionId,
  value,
  type,
}: ValidateVerificationCodeParams) => {
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

  const codeMatch = await compareValue(value, verificationCode.value);
  throwError(codeMatch, UNAUTHORIZED, "Invalid code");

  return await prismaClient.verificationCode.update({
    where: { id: verificationCode.id },
    data: {
      used: true,
    },
  });
};

interface VerifiedUpdateScope {
  sessionId: number;
}

export const verifiedUpdateScope = async ({
  sessionId,
}: VerifiedUpdateScope) => {
  await prismaClient.session.update({
    where: { id: sessionId },
    data: {
      scope: defaultProfileScope(),
    },
  });
};

interface VerifiedUpdatePassword {
  profileId: number;
  password: string;
}

export const verifiedUpdatePassword = async ({
  profileId,
  password: passwordRaw,
}: VerifiedUpdatePassword) => {
  const password = await hashValue(passwordRaw);

  await prismaClient.profile.update({
    where: { id: profileId },
    data: {
      password,
    },
  });
};
