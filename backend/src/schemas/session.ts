import { ERROR_PROFILE_ID } from "../config/constants";
import { z } from "zod";
import { getScope } from "../util/scope";
import {
  emailSchema,
  scopeSchema,
  userAgentSchema,
  verificationCodeValueSchema,
} from "./properties";

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
