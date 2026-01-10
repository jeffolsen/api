import {
  INVALID_CODE_TYPE,
  INVALID_CODE_VALUE,
  INVALID_PROFILE_ID,
  INVALID_CODE_USED_AT_FORMAT,
  NUMERIC_CODE_REGEX,
} from "../config/constants";
import { CodeType, Prisma } from "../generated/prisma/client";
import { hashValue } from "../util/bcrypt";
import { z } from "zod";

export const VerificationCodeInput = z.object({
  type: z.enum(CodeType, INVALID_CODE_TYPE).optional(),
  value: z
    .string(INVALID_CODE_VALUE)
    .regex(NUMERIC_CODE_REGEX, INVALID_CODE_VALUE)
    .pipe(z.transform(async (val) => await hashValue(val))),
  usedAt: z.date(INVALID_CODE_USED_AT_FORMAT).nullish(),
  profileId: z.number().nullish(),
  sessionId: z.number().nullish(),
}) satisfies z.Schema<Prisma.VerificationCodeCreateInput>;

export const VerificationCodeFindWhere = z.looseObject(
  (
    z.object({
      type: z.enum(CodeType, INVALID_CODE_TYPE).optional(),
      profileId: z.number(INVALID_PROFILE_ID).optional(),
    }) satisfies z.Schema<Prisma.VerificationCodeScalarWhereInput>
  ).shape,
);

export const VerificationCodeCreateInput = VerificationCodeInput.pick({
  type: true,
  value: true,
  profileId: true,
  sessionId: true,
});

export const VerificationCodeUpdateInput = VerificationCodeInput.pick({
  usedAt: true,
});
