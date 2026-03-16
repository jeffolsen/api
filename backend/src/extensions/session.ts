import { MAX_PROFILE_SESSIONS } from "../config/constants";
import { Prisma } from "../generated/prisma/client";
import {
  SessionCreateTransform,
  SessionCreateTransformType,
} from "../schemas/session";
import date, { getNewRefreshTokenExpirationDate } from "../util/date";

export const sessionExtension = Prisma.defineExtension((client) => {
  const newClient = client.$extends({
    model: {
      session: {
        async start(data: SessionCreateTransformType) {
          return await newClient.session.create({
            data: {
              ...(await SessionCreateTransform.parseAsync(data)),
              expiredAt: getNewRefreshTokenExpirationDate(),
            },
          });
        },
        async logOut(id: number) {
          try {
            return await newClient.session.update({
              where: {
                id,
                expiredAt: {
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
                expiredAt: {
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
        async maxExceeded(profileId: number) {
          const sessions = await newClient.session.findMany({
            where: {
              profileId,
              expiredAt: {
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
          needs: { expiredAt: true, endedAt: true },
          compute(session) {
            return () => {
              return (
                !session.endedAt &&
                (session.expiredAt === null ||
                  date(session.expiredAt).isAfterNow())
              );
            };
          },
        },
      },
    },
  });
  return newClient;
});

export type sessionExtensionTypeConfig = {
  isCurrent: true;
};

export default sessionExtension;
