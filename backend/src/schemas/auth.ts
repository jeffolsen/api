import { ERROR_PASSWORD_MATCH } from "../config/constants";
import { z } from "zod";
import { passwordSchema, ProfileDataSchema } from "./profile";
import { verificationCodeValueSchema } from "./verificationCode";

// endpoints
export const loginSchema = ProfileDataSchema.omit({
  password: true,
}).extend({
  verificationCode: verificationCodeValueSchema,
  userAgent: z.string(),
});

export const registerSchema = ProfileDataSchema.extend({
  confirmPassword: passwordSchema,
}).refine(
  (data) => data.password === data.confirmPassword,
  ERROR_PASSWORD_MATCH,
);
