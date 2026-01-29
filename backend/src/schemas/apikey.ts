import {
  ERROR_API_KEY_ORIGIN,
  ERROR_API_KEY_SLUG,
  ERROR_API_KEY_VALUE,
  ERROR_PROFILE_ID,
  SLUG_REGEX,
} from "../config/constants";
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
  profileId: z.number(ERROR_PROFILE_ID),
});
