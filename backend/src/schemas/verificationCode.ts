import {
  ERROR_CODE_TYPE,
  ERROR_CODE_VALUE,
  NUMERIC_CODE_REGEX,
  ERROR_ID,
  ERROR_SESSION_USER_AGENT,
} from "../config/constants";
import { CodeType } from "../generated/prisma/client";
import { hashValue } from "../util/bcrypt";
import { z } from "zod";
import { passwordSchema, ProfileDataSchema } from "./profile";

// properties
export const verificationCodeValueSchema = z
  .string(ERROR_CODE_VALUE)
  .regex(NUMERIC_CODE_REGEX, ERROR_CODE_VALUE);

export const verificationCodeTypeSchema = z.enum(
  [
    CodeType.CREATE_API_KEY,
    CodeType.DELETE_PROFILE,
    CodeType.LOGIN,
    CodeType.LOGOUT_ALL,
    CodeType.PASSWORD_RESET,
  ],
  ERROR_CODE_TYPE,
);

export const userAgentSchema = z.string(ERROR_SESSION_USER_AGENT);

// controllers
export const requestVerificationCodeSchema = ProfileDataSchema.extend({
  password: passwordSchema.optional(),
  userAgent: userAgentSchema,
});

export const requestApiKeyCodeSchema = requestVerificationCodeSchema
  .omit({
    email: true,
  })
  .extend({ profileId: z.number(ERROR_ID) });

// extensions
export const VerificationCodeCreateTransform = z.object({
  type: verificationCodeTypeSchema,
  value: verificationCodeValueSchema.pipe(
    z.transform(async (val) => await hashValue(val)),
  ),
  profileId: z.number(),
  userAgent: userAgentSchema,
});
