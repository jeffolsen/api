import { RequestHandler } from "express";
import createHttpError from "http-errors";
import env from "../config/env";
import prismaClient from "../db/client";
import { AccessTokenPayload, validateToken } from "../util/jwt";
import { BAD_REQUEST, NOT_FOUND, UNAUTHORIZED } from "../config/constants";

const requiresAuth: RequestHandler = async (req, res, next) => {
  const { accessToken } = req.cookies;

  if (!accessToken) throw createHttpError(BAD_REQUEST, "Invalid token");

  const payload = (await validateToken({
    secret: env.JWT_SECRET,
    token: accessToken,
  })) as AccessTokenPayload;
  if (!payload) throw createHttpError(BAD_REQUEST, "Invalid token");

  const { sessionId, scope, expiresAt } = payload;

  const accessTokenExpired = expiresAt <= new Date().getDate();
  if (accessTokenExpired) throw createHttpError(UNAUTHORIZED, "Unauthorized");

  const session = await prismaClient.session.findUnique({
    where: { id: sessionId },
  });
  if (!session) throw createHttpError(UNAUTHORIZED, "Unauthorized");

  const sessionExpired = session.expiresAt.getDate() <= new Date().getDate();
  if (sessionExpired) throw createHttpError(UNAUTHORIZED, "Unauthorized");

  const { profileId } = session;

  req.body.sessionId = sessionId;
  req.body.profileId = profileId;
  req.body.scope = scope;

  next();
};

export default requiresAuth;
