import { NextFunction, Request, RequestHandler, Response } from "express";
import createHttpError from "http-errors";
import env from "../config/env";
import prismaClient from "../db/client";
import { AccessTokenPayload, validateToken } from "../util/jwt";
import { BAD_REQUEST, UNAUTHORIZED } from "../config/constants";
import D from "../util/date";

const requiresAuth: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { accessToken } = req.cookies;

  if (!accessToken) throw createHttpError(BAD_REQUEST, "Invalid token");

  const payload = (await validateToken({
    secret: env.JWT_SECRET,
    token: accessToken,
  })) as AccessTokenPayload;
  if (!payload) throw createHttpError(BAD_REQUEST, "Invalid token");

  const { sessionId, expiresAt } = payload;

  const accessTokenExpired = D(expiresAt).isBeforeNow();
  if (accessTokenExpired) throw createHttpError(UNAUTHORIZED, "Unauthorized");

  const session = await prismaClient.session.findUnique({
    where: { id: sessionId },
  });
  if (!session) throw createHttpError(UNAUTHORIZED, "Unauthorized");

  const sessionExpired = D(session.expiresAt).isBeforeNow();
  if (sessionExpired) throw createHttpError(UNAUTHORIZED, "Unauthorized");

  const { profileId, scope } = session;

  req.sessionId = sessionId;
  req.profileId = profileId;
  req.scope = scope;

  next();
};

export default requiresAuth;
