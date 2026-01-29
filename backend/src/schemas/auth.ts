import { ERROR_PASSWORD_MATCH } from "../config/constants";
import { z } from "zod";
import { ProfileDataSchema } from "./profile";
import { passwordSchema, verificationCodeValueSchema } from "./properties";

// endpoints
export const loginSchema = ProfileDataSchema.omit({
  password: true,
}).extend({
  verificationCode: verificationCodeValueSchema,
  userAgent: z.string(),
});

export const RegisterSchema = ProfileDataSchema.extend({
  confirmPassword: passwordSchema,
}).refine((data) => data.password === data.confirmPassword, {
  message: ERROR_PASSWORD_MATCH,
  path: ["password", "confirmPassword"],
});
