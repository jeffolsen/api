import { NextFunction, Request, RequestHandler, Response } from "express";
import prismaClient from "../db/client";
import { verifyAccessToken } from "../util/jwt";
import { BAD_REQUEST, UNAUTHORIZED } from "../config/constants";
import date from "../util/date";
import throwError from "../util/throwError";

const authenticate: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { accessToken } = req.cookies;
  throwError(accessToken, BAD_REQUEST, "Invalid token");

  const payload = await verifyAccessToken(accessToken);
  throwError(payload?.expiresAt, BAD_REQUEST, "Invalid token");

  const { sessionId, expiresAt } = payload;
  const accessTokenNotExpired = date(expiresAt).isAfterNow();
  throwError(accessTokenNotExpired, UNAUTHORIZED, "Unauthorized");

  const session = await prismaClient.session.findUnique({
    where: { id: sessionId },
  });
  throwError(session, UNAUTHORIZED, "Unauthorized");

  const sessionStillCurrent = session.isCurrent();
  throwError(sessionStillCurrent, UNAUTHORIZED, "Unauthorized");

  const { profileId, scope } = session;

  req.sessionId = sessionId;
  req.profileId = profileId;
  req.scope = scope;

  next();
};

export default authenticate;
