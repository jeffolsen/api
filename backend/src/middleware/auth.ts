import { RequestHandler } from "express";
import createHttpError from "http-errors";
import { validateToken } from "../services/auth";
import env from "../util/env";
import prismaClient from "../db/client";

const requiresAuth: RequestHandler = async (req, res, next) => {
  try {
    const { accessToken } = req.cookies;
    if (!accessToken) throw createHttpError(401, "Unauthorized");

    const payload = validateToken({
      secret: env.JWT_SECRET,
      token: accessToken,
    });
    if (!payload) throw createHttpError(401, "Unauthorized");

    const { profileId, sessionId } = payload;

    const session = await prismaClient.session.findUnique({
      where: { id: sessionId, profileId },
    });
    if (!session) throw createHttpError(401, "Unauthorized");

    req.body.profileId = profileId;
    req.body.sessionId = sessionId;
    next();
  } catch (error) {
    next(error);
  }
};

export default requiresAuth;
