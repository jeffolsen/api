import { ERROR_PROFILE_ID } from "../config/constants";
import { z } from "zod";
import { API_KEY_SESSION, PROFILE_SESSION, getScope } from "../util/scope";
import { verificationCodeValueSchema } from "./verificationCode";
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
});

// extensions
export const SessionCreateTransform = z.object({
  scope: scopeSchema.pipe(z.transform((val) => getScope(val))),

  profileId: z.number(ERROR_PROFILE_ID),
});
