import { MAX_PROFILE_SESSIONS } from "../config/constants";
import { Prisma, Session } from "../generated/prisma/client";
import date, { getNewRefreshTokenExpirationDate } from "../util/date";
import { defaultProfileScope, preAuthProfileScope } from "../util/scope";

export const sessionExtension = Prisma.defineExtension((client) => {
  const newClient = client.$extends({
    query: {
      session: {
        async create({ model, operation, args, query }) {
          const result = await query({
            ...args,
            data: {
              ...args.data,
              autoRefresh: false,
              scope: preAuthProfileScope(),
              expiresAt: getNewRefreshTokenExpirationDate(),
            },
          });
          return result;
        },
      },
    },
    model: {
      session: {
        async refresh(id: number) {
          return await newClient.session.update({
            where: {
              id,
              autoRefresh: true,
              expiresAt: { lte: new Date(Date.now()) },
            },
            data: {
              expiresAt: getNewRefreshTokenExpirationDate(),
            },
          });
        },
        async rescope(id: number) {
          return await newClient.session.update({
            where: { id },
            data: {
              scope: defaultProfileScope(),
            },
          });
        },
        async logOut(id: number) {
          return await newClient.session.update({
            where: {
              id,
              expiresAt: {
                gt: new Date(Date.now()),
              },
            },
            data: {
              expiresAt: new Date(Date.now()),
            },
          });
        },
        async logOutAll(profileId: number) {
          return await newClient.session.updateMany({
            where: {
              profileId,
              expiresAt: {
                gt: new Date(Date.now()),
              },
            },
            data: {
              expiresAt: new Date(Date.now()),
            },
          });
        },
        async maxExceeded(profileId: number) {
          const sessions = await newClient.session.findMany({
            where: {
              profileId,
              expiresAt: {
                gt: new Date(Date.now()),
              },
            },
          });
          return sessions.length >= MAX_PROFILE_SESSIONS;
        },
      },
    },
    result: {
      session: {
        isCurrent: {
          needs: { expiresAt: true },
          compute(session) {
            return () => {
              return date(session.expiresAt).isAfterNow();
            };
          },
        },
      },
    },
  });
  return newClient;
});

type IsCurrent = () => boolean;
export type ExtendedSession = Session & {
  isCurrent: IsCurrent;
};

export default sessionExtension;
