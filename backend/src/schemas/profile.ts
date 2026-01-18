import {
  ERROR_EMAIL_FORMAT,
  ERROR_PASSWORD_FORMAT,
  ERROR_PASSWORD_MATCH,
  PASSWORD_REGEX,
} from "../config/constants";
import { z } from "zod";
import { verificationCodeValueSchema } from "./verificationCode";

// properties
export const emailSchema = z.email(ERROR_EMAIL_FORMAT);

export const passwordSchema = z
  .string(ERROR_PASSWORD_FORMAT)
  .regex(PASSWORD_REGEX, ERROR_PASSWORD_FORMAT);

// partials
export const ProfileDataSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

// controllers
export const ResetPasswordSchema = ProfileDataSchema.extend({
  confirmPassword: passwordSchema,
  verificationCode: verificationCodeValueSchema,
}).refine(
  (data) => data.password === data.confirmPassword,
  ERROR_PASSWORD_MATCH,
);

export const DeleteProfileSchema = z.object({
  email: emailSchema,
  verificationCode: verificationCodeValueSchema,
});
