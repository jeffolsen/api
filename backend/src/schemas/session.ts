import {
  ERROR_PROFILE_ID,
  ERROR_SESSION_USER_AGENT,
} from "../config/constants";
import { Prisma } from "../db/client";
import { API_KEY_SESSION, PROFILE_SESSION, getScope } from "../util/scope";
import { z } from "zod";

export const userAgentSchema = z.string(ERROR_SESSION_USER_AGENT);

export const SessionCreateInput = z.object({
  scope: z
    .union([z.literal(API_KEY_SESSION), z.literal(PROFILE_SESSION)])
    .pipe(z.transform((val) => getScope(val))),
  userAgent: userAgentSchema,
  profileId: z.number(ERROR_PROFILE_ID),
}) satisfies z.Schema<Prisma.SessionCreateWithoutProfileInput>;

export const SessionFindWhere = z.looseObject(
  (
    z.object({
      profileId: z.number(ERROR_PROFILE_ID).optional(),
    }) satisfies z.Schema<Prisma.SessionScalarWhereInput>
  ).shape,
);
