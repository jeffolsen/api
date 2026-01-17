import {
  ERROR_EMAIL_FORMAT,
  ERROR_PASSWORD_FORMAT,
  PASSWORD_REGEX,
} from "../config/constants";
import { z } from "zod";

// properties
export const emailSchema = z.email(ERROR_EMAIL_FORMAT);

export const passwordSchema = z
  .string(ERROR_PASSWORD_FORMAT)
  .regex(PASSWORD_REGEX, ERROR_PASSWORD_FORMAT);

// partials
export const ProfileDataSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});
