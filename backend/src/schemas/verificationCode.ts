import { z } from "zod";
import { hashValue } from "../util/bcrypt";
import {
  idSchema,
  passwordSchema,
  userAgentSchema,
  verificationCodeValueSchema,
  verificationCodeTypeSchema,
  emailSchema,
} from "./properties";

// controllers
export const requestVerificationCodeSchema = z.object({
  email: emailSchema.optional(),
  password: passwordSchema.optional(),
  userAgent: userAgentSchema,
});

export const requestApiKeyCodeSchema = requestVerificationCodeSchema
  .omit({
    email: true,
  })
  .extend({ profileId: idSchema });

// extensions
export const VerificationCodeCreateTransform = z.object({
  type: verificationCodeTypeSchema,
  value: verificationCodeValueSchema.pipe(
    z.transform(async (val) => await hashValue(val)),
  ),
  profileId: z.number(),
  userAgent: userAgentSchema,
});
