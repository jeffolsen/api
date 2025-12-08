import { BAD_REQUEST, UNAUTHORIZED } from "../config/constants";
import env from "../config/env";
import prismaClient from "../db/client";
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

  const profile = await prismaClient.profile.findUnique({
    where: { id: session?.profileId },
  });
  throwError(profile, BAD_REQUEST, "Invalid token");

  const doesntNeedManualRefresh = session.autoRefresh || session.isCurrent();
  throwError(doesntNeedManualRefresh, UNAUTHORIZED, "Unauthorized");

  if (session.autoRefresh && !session.isCurrent()) {
    session = await prismaClient.session.update(session.refresh());
  }

  return { session, refreshToken, accessToken: signAccessToken(sessionId) };
};
