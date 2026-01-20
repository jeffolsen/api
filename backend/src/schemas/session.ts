import { ERROR_PROFILE_ID } from "../config/constants";
import { z } from "zod";
import { API_KEY_SESSION, PROFILE_SESSION, getScope } from "../util/scope";
import {
  userAgentSchema,
  verificationCodeValueSchema,
} from "./verificationCode";
import { emailSchema } from "./profile";

// properties
export const scopeSchema = z.union([
  z.literal(API_KEY_SESSION),
  z.literal(PROFILE_SESSION),
]);

// endpoints
export const SessionLogoutAllSchema = z.object({
  email: emailSchema,
  verificationCode: verificationCodeValueSchema,
  userAgent: userAgentSchema,
});

// extensions
export const SessionCreateTransform = z.object({
  scope: scopeSchema.pipe(z.transform((val) => getScope(val))),
  userAgent: userAgentSchema,
  profileId: z.number(ERROR_PROFILE_ID),
  apiKeyId: z.number(ERROR_PROFILE_ID).nullish(),
});

export type SessionCreateTransformType = z.infer<typeof SessionCreateTransform>;
