import { NextFunction, Request, RequestHandler, Response } from "express";
import createHttpError from "http-errors";
import env from "../config/env";
import prismaClient from "../db/client";
import { AccessTokenPayload, validateToken } from "../util/jwt";
import { BAD_REQUEST, UNAUTHORIZED } from "../config/constants";
import date from "../util/date";
import throwError from "../util/throwError";

const requiresAuth: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { accessToken } = req.cookies;

  throwError(accessToken, BAD_REQUEST, "Invalid token");

  const payload = (await validateToken({
    secret: env.JWT_SECRET,
    token: accessToken,
  })) as AccessTokenPayload;

  throwError(payload, BAD_REQUEST, "Invalid token");

  const { sessionId, expiresAt } = payload;
  const accessTokenNotExpired = date(expiresAt).isAfterNow();
  throwError(accessTokenNotExpired, UNAUTHORIZED, "Unauthorized");

  const session = await prismaClient.session.findUnique({
    where: { id: sessionId },
  });
  throwError(session, UNAUTHORIZED, "Unauthorized");

  const sessionStillCurrent = date(session.expiresAt).isAfterNow();
  throwError(sessionStillCurrent, UNAUTHORIZED, "Unauthorized");

  const { profileId, scope } = session;

  req.sessionId = sessionId;
  req.profileId = profileId;
  req.scope = scope;

  next();
};

export default requiresAuth;
