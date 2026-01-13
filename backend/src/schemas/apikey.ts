import { z } from "zod";
import {
  ERROR_API_KEY_ORIGIN,
  ERROR_API_KEY_SLUG,
  ERROR_API_KEY_VALUE,
  ERROR_PROFILE_ID,
  SLUG_REGEX,
} from "../config/constants";
import { hashValue } from "../util/bcrypt";
import { verificationCodeValueSchema } from "./verificationCode";

export const apiKeySlugSchema = z
  .string(ERROR_API_KEY_SLUG)
  .max(100, ERROR_API_KEY_SLUG)
  .regex(SLUG_REGEX, ERROR_API_KEY_SLUG);
export const apiKeyOriginSchema = z.url({
  protocol: /^https$/,
  message: ERROR_API_KEY_ORIGIN,
});
export const apiKeyValueSchema = z.uuid(ERROR_API_KEY_VALUE);

export const ApiKeyGenerateSchema = z.object({
  apiSlug: apiKeySlugSchema,
  origin: apiKeyOriginSchema,
  verificationCode: verificationCodeValueSchema,
});

export const ApiKeyConnectSchema = z.object({
  apiSlug: apiKeySlugSchema,
  apiKey: apiKeyValueSchema,
});

export const ApiKeyCreateTransform = z.object({
  slug: apiKeySlugSchema,
  origin: apiKeyOriginSchema,
  value: apiKeyValueSchema.pipe(
    z.transform(async (val) => await hashValue(val)),
  ),
  profileId: z.number(ERROR_PROFILE_ID),
});
