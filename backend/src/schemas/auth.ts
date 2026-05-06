import {
  MESSAGE_ASSERT_LEGAL_AGE,
  MESSAGE_CONSENT_TO_PRIVACY,
  MESSAGE_CONSENT_TO_TERMS,
  MESSAGE_PASSWORD_MATCH,
} from "@config/errorMessages";
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
  consentToTerms: z.literal(true, {
    error: MESSAGE_CONSENT_TO_TERMS,
  }),
  consentToPrivacy: z.literal(true, {
    error: MESSAGE_CONSENT_TO_PRIVACY,
  }),
  assertEighteenYearsOrOlder: z.literal(true, {
    error: MESSAGE_ASSERT_LEGAL_AGE,
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: MESSAGE_PASSWORD_MATCH,
  path: ["password", "confirmPassword"],
});
