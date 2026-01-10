import { z } from "zod";
import { SLUG_REGEX } from "../config/constants";
import { hashValue } from "../util/bcrypt";
import { Prisma } from "../db/client";

export const ApiKeyCreateWithoutProfileInput = z.object({
  slug: z.string("Invalid slug").max(100).regex(SLUG_REGEX),
  origin: z.url({ protocol: /^https$/, message: "Invalid origin" }).optional(),
  value: z
    .uuid()
    .pipe(z.transform(async (val) => await hashValue(val)))
    .optional(),
  profileId: z.number("Invalid profile id"),
}) satisfies z.Schema<Prisma.ApiKeyCreateWithoutProfileInput>;
