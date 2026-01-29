import { z } from "zod";
import { hashValue } from "../util/bcrypt";
import { ProfileDataSchema } from "./profile";
import {
  idSchema,
  passwordSchema,
  userAgentSchema,
  verificationCodeValueSchema,
  verificationCodeTypeSchema,
} from "./properties";

// controllers
export const requestVerificationCodeSchema = ProfileDataSchema.extend({
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
