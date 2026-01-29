import z from "zod";

import {
  ERROR_API_KEY_ORIGIN,
  ERROR_API_KEY_SLUG,
  ERROR_API_KEY_VALUE,
  ERROR_CODE_TYPE,
  ERROR_CODE_VALUE,
  ERROR_EMAIL_FORMAT,
  ERROR_ID,
  ERROR_PASSWORD_FORMAT,
  ERROR_SESSION_USER_AGENT,
  NUMERIC_CODE_REGEX,
  PASSWORD_REGEX,
  SLUG_REGEX,
} from "../config/constants";
import { API_KEY_SESSION, PROFILE_SESSION } from "../util/scope";
import { CodeType, TagName } from "../generated/prisma/client";

export const verificationCodeTypeSchema = z.enum(
  [
    CodeType.CREATE_API_KEY,
    CodeType.DELETE_PROFILE,
    CodeType.LOGIN,
    CodeType.LOGOUT_ALL,
    CodeType.PASSWORD_RESET,
  ],
  ERROR_CODE_TYPE,
);

export const idSchema = z.number(ERROR_ID);

export const userAgentSchema = z.string(ERROR_SESSION_USER_AGENT);

export const emailSchema = z.email(ERROR_EMAIL_FORMAT);

export const passwordSchema = z
  .string(ERROR_PASSWORD_FORMAT)
  .regex(PASSWORD_REGEX, ERROR_PASSWORD_FORMAT);

export const apiKeySlugSchema = z
  .string(ERROR_API_KEY_SLUG)
  .max(100, ERROR_API_KEY_SLUG)
  .regex(SLUG_REGEX, ERROR_API_KEY_SLUG);

export const apiKeyOriginSchema = z.url({
  protocol: /^https$/,
  message: ERROR_API_KEY_ORIGIN,
});

export const apiKeyValueSchema = z.uuid(ERROR_API_KEY_VALUE);

export const verificationCodeValueSchema = z
  .string(ERROR_CODE_VALUE)
  .regex(NUMERIC_CODE_REGEX, ERROR_CODE_VALUE);

export const scopeSchema = z.union([
  z.literal(API_KEY_SESSION),
  z.literal(PROFILE_SESSION),
]);

export const titleSchema = z.string();
export const subtitleSchema = z.string();
export const contentSchema = z.string();

const tagArray = [
  TagName.BAR,
  TagName.BAZ,
  TagName.BLUE,
  TagName.FOO,
  TagName.FUTURE,
  TagName.GREEN,
  TagName.PAST,
  TagName.PERSON,
  TagName.PLACE,
  TagName.PRESENT,
  TagName.RED,
  TagName.THING,
] as const;

export const tagNameSchema = z.enum(tagArray, ERROR_CODE_TYPE);

export const tagNameArraySchema = z.array(
  z.union(tagArray.map((val) => z.literal(val))),
);

export const tagNameUniqueArraySchema = z
  .union(tagArray.map((val) => z.literal(val)))
  .refine((items) => {
    return new Set(items).size === items.length;
  });
