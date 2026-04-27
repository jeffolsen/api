import { NextFunction, Request, RequestHandler, Response } from "express";
import prismaClient from "../db/client";
import { verifyAccessToken } from "../util/jwt";
import { MESSAGE_INVALID_TOKEN } from "../config/errorMessages";
import { UNAUTHORIZED } from "../config/errorCodes";
import date from "../util/date";
import throwError from "../util/throwError";
import { authenticateWithApiKey } from "../services/auth";
import { defaultApiKeyScope } from "../util/scope";
import { isSessionCurrent } from "../services/session";

const authenticate: RequestHandler = async (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  const origin = req.get("origin") || req.get("referer") || "";
  const apiKey = req.get("X-Api-Key");
  const apiSlug = req.get("X-Api-Slug");
  const apiKeyRecord = await authenticateWithApiKey({
    apiKey,
    apiSlug,
    origin,
  });
  if (apiKeyRecord) {
    req.profileId = apiKeyRecord.profileId;
    req.scope = defaultApiKeyScope();
    return next();
  }

  const { accessToken } = req.cookies;
  const userAgent = req.headers["user-agent"];
  throwError(accessToken && userAgent, UNAUTHORIZED, MESSAGE_INVALID_TOKEN);

  const payload = verifyAccessToken(accessToken);
  throwError(payload?.expiredAt, UNAUTHORIZED, MESSAGE_INVALID_TOKEN);

  const { sessionId, expiredAt } = payload;
  const accessTokenNotExpired = date(expiredAt).isAfterNow();
  throwError(accessTokenNotExpired, UNAUTHORIZED, MESSAGE_INVALID_TOKEN);

  const session = await prismaClient.session.findUnique({
    where: { id: sessionId, userAgent },
  });
  throwError(session, UNAUTHORIZED, MESSAGE_INVALID_TOKEN);

  throwError(isSessionCurrent(session), UNAUTHORIZED, MESSAGE_INVALID_TOKEN);

  const { profileId, scope } = session;

  req.sessionId = sessionId;
  req.profileId = profileId;
  req.scope = scope;

  next();
};

export default authenticate;
