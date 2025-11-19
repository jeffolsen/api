import { RequestHandler } from "express";
import createHttpError from "http-errors";
import env from "../util/env";
import prismaClient from "../db/client";
import { AccessTokenPayload, validateToken } from "../util/jwt";

const requiresAuth: RequestHandler = async (req, res, next) => {
  try {
    const { accessToken } = req.body;

    if (!accessToken) throw createHttpError(401, "Unauthorized");

    const payload = (await validateToken({
      secret: env.JWT_SECRET,
      token: accessToken,
    })) as AccessTokenPayload;
    if (!payload) throw createHttpError(401, "Unauthorized");

    const { profileId, sessionId, scope } = payload;

    const session = await prismaClient.session.findUnique({
      where: { id: sessionId, profileId },
    });
    if (!session) throw createHttpError(401, "Unauthorized");

    req.body.profileId = profileId;
    req.body.sessionId = sessionId;
    req.body.scope = scope;
    next();
  } catch (error) {
    next(error);
  }
};

export default requiresAuth;
