import { NextFunction, Request, RequestHandler, Response } from "express";
import prismaClient from "../db/client";
import { verifyAccessToken } from "../util/jwt";
import {
  BAD_REQUEST,
  ERROR_INVALID_TOKEN,
  UNAUTHORIZED,
} from "../config/constants";
import date from "../util/date";
import throwError from "../util/throwError";

const authenticate: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { accessToken } = req.cookies;
  const userAgent = req.headers["user-agent"];
  throwError(accessToken, BAD_REQUEST, ERROR_INVALID_TOKEN);

  const payload = await verifyAccessToken(accessToken);
  throwError(payload?.expiresAt, BAD_REQUEST, ERROR_INVALID_TOKEN);

  const { sessionId, expiresAt } = payload;
  const accessTokenNotExpired = date(expiresAt).isAfterNow();
  throwError(accessTokenNotExpired, UNAUTHORIZED, ERROR_INVALID_TOKEN);

  const session = await prismaClient.session.findUnique({
    where: { id: sessionId, userAgent },
  });
  throwError(session, UNAUTHORIZED, ERROR_INVALID_TOKEN);

  const sessionStillCurrent = session.isCurrent();
  throwError(sessionStillCurrent, UNAUTHORIZED, ERROR_INVALID_TOKEN);

  const { profileId, scope } = session;

  req.sessionId = sessionId;
  req.profileId = profileId;
  req.scope = scope;

  next();
};

export default authenticate;
