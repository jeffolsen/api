import {
  ERROR_EMAIL_FORMAT,
  ERROR_ID,
  ERROR_PASSWORD_FORMAT,
  PASSWORD_REGEX,
} from "../config/constants";
import { Prisma } from "../db/client";
import { z } from "zod";
import { hashValue } from "../util/bcrypt";

export const emailSchema = z.email(ERROR_EMAIL_FORMAT);

export const passwordSchema = z
  .string(ERROR_PASSWORD_FORMAT)
  .regex(PASSWORD_REGEX, ERROR_PASSWORD_FORMAT);

export const ProfileDataSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

export const ProfileDataTransformer = z.object({
  email: emailSchema,
  password: passwordSchema.pipe(
    z.transform(async (val) => await hashValue(val)),
  ),
}) satisfies z.Schema<Prisma.ProfileCreateInput>;

export const ProfileGetSchema = z.union([
  z.object({
    id: z.number(ERROR_ID),
  }),
  z.object({
    email: z.email(ERROR_EMAIL_FORMAT),
  }),
]);
