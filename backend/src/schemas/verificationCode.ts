import {
  ERROR_CODE_TYPE,
  ERROR_CODE_VALUE,
  ERROR_CODE_USED_AT_FORMAT,
  NUMERIC_CODE_REGEX,
  ERROR_ID,
} from "../config/constants";
import { CodeType, Prisma } from "../generated/prisma/client";
import { hashValue } from "../util/bcrypt";
import { z } from "zod";
import { ProfileDataSchema } from "./profile";

export const requestVerificationCodeSchema = ProfileDataSchema;

export const requestPasswordResetCodeSchema =
  requestVerificationCodeSchema.omit({
    password: true,
  });

export const requestApiKeyCodeSchema = requestVerificationCodeSchema
  .omit({
    email: true,
  })
  .extend({ id: z.number(ERROR_ID) });

// Model Properties
export const verificationCodeValueSchema = z
  .string(ERROR_CODE_VALUE)
  .regex(NUMERIC_CODE_REGEX, ERROR_CODE_VALUE);

export const verificationCodeTypeSchema = z
  .enum(CodeType, ERROR_CODE_TYPE)
  .optional();

export const VerificationCodeIssueSchema = z.object({
  type: verificationCodeTypeSchema,
  value: verificationCodeValueSchema.pipe(
    z.transform(async (val) => await hashValue(val)),
  ),
  profileId: z.number(),
});
