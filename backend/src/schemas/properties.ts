import z from "zod";
import {
  MESSAGE_API_KEY_ORIGIN,
  MESSAGE_API_KEY_SLUG,
  MESSAGE_API_KEY_VALUE,
  MESSAGE_CODE_TYPE,
  MESSAGE_CODE_VALUE,
  MESSAGE_EMAIL_FORMAT,
  MESSAGE_ID,
  MESSAGE_IDS_UNIQUE,
  MESSAGE_PASSWORD_FORMAT,
  MESSAGE_SESSION_USER_AGENT,
} from "../config/errorMessages";
import {
  NUMERIC_CODE_REGEX,
  PASSWORD_REGEX,
  SLUG_REGEX,
} from "../config/constants";
import { API_KEY_SESSION, PROFILE_SESSION } from "../util/scope";
import { CodeType, ImageType } from "../generated/prisma/client";

export const verificationCodeTypeSchema = z.enum(
  [
    CodeType.CREATE_API_KEY,
    CodeType.DELETE_PROFILE,
    CodeType.LOGIN,
    CodeType.LOGOUT_ALL,
    CodeType.PASSWORD_RESET,
  ],
  MESSAGE_CODE_TYPE,
);

export const idSchema = z.number(MESSAGE_ID);
export const idArraySchema = z.array(z.number(MESSAGE_ID)).refine((items) => {
  return new Set(items).size === items.length;
}, MESSAGE_IDS_UNIQUE);
export const dateTimeSchema = z.iso.datetime();

export const userAgentSchema = z.string(MESSAGE_SESSION_USER_AGENT);

export const emailSchema = z.email(MESSAGE_EMAIL_FORMAT);

export const passwordSchema = z
  .string(MESSAGE_PASSWORD_FORMAT)
  .regex(PASSWORD_REGEX, MESSAGE_PASSWORD_FORMAT);

export const apiKeySlugSchema = z
  .string(MESSAGE_API_KEY_SLUG)
  .max(100, MESSAGE_API_KEY_SLUG)
  .regex(SLUG_REGEX, MESSAGE_API_KEY_SLUG);

export const apiKeyOriginSchema = z.url({
  protocol: /^https$/,
  message: MESSAGE_API_KEY_ORIGIN,
});

export const apiKeyValueSchema = z.uuid(MESSAGE_API_KEY_VALUE);

export const verificationCodeValueSchema = z
  .string(MESSAGE_CODE_VALUE)
  .regex(NUMERIC_CODE_REGEX, MESSAGE_CODE_VALUE);

export const scopeSchema = z.union([
  z.literal(API_KEY_SESSION),
  z.literal(PROFILE_SESSION),
]);

export const nameSchema = z.string();
export const descriptionSchema = z.string();
