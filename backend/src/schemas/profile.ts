import { ERROR_PASSWORD_MATCH } from "../config/constants";
import { z } from "zod";
import { hashValue } from "../util/bcrypt";
import {
  emailSchema,
  passwordSchema,
  userAgentSchema,
  verificationCodeValueSchema,
} from "./properties";

// partials
export const ProfileDataSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

// controllers
export const ResetPasswordSchema = ProfileDataSchema.extend({
  confirmPassword: passwordSchema,
  verificationCode: verificationCodeValueSchema,
  userAgent: userAgentSchema,
}).refine((data) => data.password === data.confirmPassword, {
  message: ERROR_PASSWORD_MATCH,
  path: ["password", "confirmPassword"],
});

export const DeleteProfileSchema = z.object({
  email: emailSchema,
  verificationCode: verificationCodeValueSchema,
  userAgent: userAgentSchema,
});

// extensions
export const ProfileCreateTransform = z.object({
  email: emailSchema,
  password: passwordSchema.pipe(
    z.transform(async (val) => await hashValue(val)),
  ),
});
