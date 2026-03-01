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
export const ResetPasswordWithCodeSchema = ProfileDataSchema.extend({
  confirmPassword: passwordSchema,
  verificationCode: verificationCodeValueSchema,
  userAgent: userAgentSchema,
}).refine((data) => data.password === data.confirmPassword, {
  message: ERROR_PASSWORD_MATCH,
  path: ["password", "confirmPassword"],
});

export const ChangePasswordWithSessionSchema = z
  .object({
    password: passwordSchema,
    newPassword: passwordSchema,
    confirmNewPassword: passwordSchema,
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: ERROR_PASSWORD_MATCH,
    path: ["newPassword", "confirmNewPassword"],
  });

export const DeleteProfileSchema = z.object({
  verificationCode: verificationCodeValueSchema,
  userAgent: userAgentSchema,
});

// extensions
export const passwordTransform = passwordSchema.pipe(
  z.transform(async (val) => await hashValue(val)),
);
export const ProfileCreateTransform = z.object({
  email: emailSchema,
  password: passwordTransform,
});
