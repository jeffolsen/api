import { MESSAGE_PROFILE_ID } from "../config/errorMessages";
import { z } from "zod";
import { hashValue } from "../util/bcrypt";
import {
  apiKeyOriginSchema,
  apiKeySlugSchema,
  apiKeyValueSchema,
  userAgentSchema,
  verificationCodeValueSchema,
} from "./properties";

// endpoints
export const ApiKeyGenerateSchema = z.object({
  apiSlug: apiKeySlugSchema,
  origin: apiKeyOriginSchema,
  verificationCode: verificationCodeValueSchema,
  userAgent: userAgentSchema,
});

export const ApiKeyDestroySchema = z.object({
  apiSlug: apiKeySlugSchema,
  verificationCode: verificationCodeValueSchema,
  userAgent: userAgentSchema,
});

export const ApiKeyConnectSchema = z.object({
  apiSlug: apiKeySlugSchema,
  apiKey: apiKeyValueSchema,
  userAgent: userAgentSchema,
});

// extensions
export const ApiKeyCreateTransform = z.object({
  slug: apiKeySlugSchema,
  origin: apiKeyOriginSchema,
  value: apiKeyValueSchema.pipe(
    z.transform(async (val) => await hashValue(val)),
  ),
  profileId: z.number(MESSAGE_PROFILE_ID),
});
