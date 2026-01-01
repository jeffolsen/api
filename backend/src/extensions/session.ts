import {
  INVALID_PROFILE_ID,
  INVALID_SESSION_USER_AGENT,
  MAX_PROFILE_SESSIONS,
} from "../config/constants";
import { CodeType, Prisma } from "../generated/prisma/client";
import date, { getNewRefreshTokenExpirationDate } from "../util/date";
import { API_KEY_SESSION, PROFILE_SESSION, getScope } from "../util/scope";
import { z } from "zod";

export const SessionCreateInput = z.object({
  scope: z
    .union([z.literal(API_KEY_SESSION), z.literal(PROFILE_SESSION)])
    .pipe(z.transform((val) => getScope(val))),
  userAgent: z.string(INVALID_SESSION_USER_AGENT),
  profileId: z.number(INVALID_PROFILE_ID),
}) satisfies z.Schema<Prisma.SessionCreateWithoutProfileInput>;

export const SessionFindWhere = z.looseObject(
  (
    z.object({
      profileId: z.number(INVALID_PROFILE_ID).optional(),
    }) satisfies z.Schema<Prisma.SessionScalarWhereInput>
  ).shape,
);

export const sessionExtension = Prisma.defineExtension((client) => {
  const newClient = client.$extends({
    query: {
      session: {
        async create({ model, operation, args, query }) {
          args.data = await SessionCreateInput.parseAsync(args.data);
          args.data.expiresAt = getNewRefreshTokenExpirationDate();
          const result = await query(args);
          return result;
        },
      },
    },
    model: {
      session: {
        async logOut(id: number) {
          try {
            return await newClient.session.update({
              where: {
                id,
                expiresAt: {
                  gt: new Date(Date.now()),
                },
              },
              data: {
                endedAt: new Date(Date.now()),
              },
            });
          } catch (error) {
            return undefined;
          }
        },
        async logOutAll(profileId: number) {
          try {
            return await newClient.session.updateMany({
              where: {
                profileId,
                expiresAt: {
                  gt: new Date(Date.now()),
                },
              },
              data: {
                endedAt: new Date(Date.now()),
              },
            });
          } catch (error) {
            return undefined;
          }
        },
        async maxExceeded(profileId: number, codeType?: CodeType) {
          if (codeType === "LOGOUT_ALL") return false;
          const sessions = await newClient.session.findMany({
            where: {
              profileId,
              expiresAt: {
                gt: new Date(Date.now()),
              },
              endedAt: null,
              apiKey: null, // dont want to count sessions that are attached to apikeys
            },
            take: MAX_PROFILE_SESSIONS,
          });
          return sessions.length == MAX_PROFILE_SESSIONS;
        },
      },
    },
    result: {
      session: {
        isCurrent: {
          needs: { expiresAt: true, endedAt: true },
          compute(session) {
            return () => {
              return (
                !session.endedAt &&
                (session.expiresAt === null ||
                  date(session.expiresAt).isAfterNow())
              );
            };
          },
        },
      },
    },
  });
  return newClient;
});

export default sessionExtension;
