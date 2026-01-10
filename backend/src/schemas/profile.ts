import { PASSWORD_REGEX } from "../config/constants";
import { Prisma } from "../db/client";
import { z } from "zod";
import { hashValue } from "../util/bcrypt";

export const ProfileCreateInput = z.object({
  email: z.email("Invalid email format"),
  password: z
    .string("Invalid password format")
    .regex(PASSWORD_REGEX, "Invalid password format")
    .pipe(z.transform(async (val) => await hashValue(val))),
}) satisfies z.Schema<Prisma.ProfileCreateInput>;

export const ProfileUpdateInput = ProfileCreateInput.pick({
  password: true,
});

export const ProfileGetWhere = z.union([
  z.object({
    id: z.number("Invalid id"),
  }),
  z.object({
    email: z.email("Invalid email format"),
  }),
]);
