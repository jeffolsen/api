import prismaClient from "../db/client";
import { MAX_PROFILE_SESSIONS } from "../config/constants";
import {
  SessionCreateTransform,
  SessionCreateTransformType,
} from "../schemas/session";
import date, { getNewRefreshTokenExpirationDate } from "../util/date";

export const isSessionCurrent = (session: {
  expiredAt: Date | null;
  endedAt: Date | null;
}) => {
  return (
    !session.endedAt &&
    (session.expiredAt === null || date(session.expiredAt).isAfterNow())
  );
};

export const startSession = async (data: SessionCreateTransformType) => {
  return await prismaClient.session.create({
    data: {
      ...(await SessionCreateTransform.parseAsync(data)),
      expiredAt: getNewRefreshTokenExpirationDate(),
    },
  });
};

export const logOutSession = async (id: number) => {
  try {
    return await prismaClient.session.update({
      where: { id, expiredAt: { gt: new Date() } },
      data: { endedAt: new Date() },
    });
  } catch {
    return undefined;
  }
};

export const logOutAllSessions = async (profileId: number) => {
  try {
    return await prismaClient.session.updateMany({
      where: { profileId, expiredAt: { gt: new Date() } },
      data: { endedAt: new Date() },
    });
  } catch {
    return undefined;
  }
};

export const isSessionLimitReached = async (profileId: number) => {
  const sessions = await prismaClient.session.findMany({
    where: { profileId, expiredAt: { gt: new Date() }, endedAt: null },
    take: MAX_PROFILE_SESSIONS,
  });
  return sessions.length === MAX_PROFILE_SESSIONS;
};
