import { BAD_REQUEST, UNAUTHORIZED } from "../config/constants";
import env from "../config/env";
import prismaClient from "../db/client";
import date, { getNewRefreshTokenExpirationDate } from "../util/date";
import {
  AccessTokenPayload,
  signAccessToken,
  validateToken,
} from "../util/jwt";
import throwError from "../util/throwError";

interface RefreshAccessTokenParams {
  refreshToken: string;
}

export const refreshAccessToken = async ({
  refreshToken,
}: RefreshAccessTokenParams) => {
  const payload = (await validateToken({
    secret: env.JWT_REFRESH_SECRET,
    token: refreshToken,
  })) as AccessTokenPayload;
  throwError(payload, BAD_REQUEST, "Invalid token");

  const { sessionId } = payload;
  let session = await prismaClient.session.findUnique({
    where: { id: sessionId },
  });
  throwError(session, BAD_REQUEST, "Invalid token");

  const { profileId, autoRefresh, expiresAt } = session;
  const profile = await prismaClient.profile.findUnique({
    where: { id: profileId },
  });
  throwError(profile, BAD_REQUEST, "Invalid token");

  const sessionExpired = date(expiresAt).isBeforeNow();
  throwError(!sessionExpired || autoRefresh, UNAUTHORIZED, "Unauthorized");

  // if session auto-refreshes and its expired, refresh its expiration now
  if (sessionExpired && autoRefresh) {
    session = await prismaClient.session.update({
      where: { id: sessionId },
      data: {
        expiresAt: getNewRefreshTokenExpirationDate(),
      },
    });
  }

  return { session, refreshToken, accessToken: signAccessToken(sessionId) };
};
