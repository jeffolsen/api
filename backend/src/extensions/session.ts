import { Prisma, Session } from "../generated/prisma/client";
import date, { getNewRefreshTokenExpirationDate } from "../util/date";
import { defaultProfileScope, preAuthProfileScope } from "../util/scope";

export const sessionExtension = Prisma.defineExtension({
  client: {},
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
    session: {},
  },
  result: {
    session: {
      clientSafe: {
        needs: { id: true, createdAt: true, updatedAt: true },
        compute(profile) {
          return () => {
            return {
              id: profile.id,
              createdAt: profile.createdAt,
              updatedAt: profile.updatedAt,
            };
          };
        },
      },
      isCurrent: {
        needs: { expiresAt: true },
        compute(session) {
          return () => {
            return date(session.expiresAt).isAfterNow();
          };
        },
      },
      refresh: {
        needs: { id: true },
        compute(session) {
          return () => {
            return {
              where: { id: session.id },
              data: {
                expiresAt: getNewRefreshTokenExpirationDate(),
              },
            };
          };
        },
      },
      rescope: {
        needs: { id: true },
        compute(session) {
          return () => {
            return {
              where: { id: session.id },
              data: {
                scope: defaultProfileScope(),
              },
            };
          };
        },
      },
    },
  },
});

type IsCurrent = () => Promise<boolean>;
type ClientSafe = () => {
  id: number;
  email: string;
  createdAt: Date;
  updatedAt: Date;
};
type Refresh = () => {
  where: { id: number };
  data: {
    expiresAt: Date;
  };
};
type Rescope = () => {
  where: { id: number };
  data: {
    scope: string;
  };
};
export type ExtendedSesion = Session & {
  isCurrent: IsCurrent;
  refresh: Refresh;
  rescope: Rescope;
  clientSafe: ClientSafe;
};

export default sessionExtension;
