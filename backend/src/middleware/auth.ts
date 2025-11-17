import { RequestHandler } from "express";
import createHttpError from "http-errors";
import jwt from "jsonwebtoken";
import env from "../util/env";

interface AccessTokenPayload {
  profileId: string;
  sessionId: string;
}

const requiresAuth: RequestHandler = async (req, res, next) => {
  try {
    const { accessToken } = req.cookies;
    if (!accessToken) throw createHttpError(401, "Unauthorized");

    const payload = jwt.verify(
      accessToken,
      env.JWT_SECRET
    ) as AccessTokenPayload;
    if (!payload) throw createHttpError(401, "Unauthorized");

    req.body.profileId = payload.profileId;
    req.body.sessionId = payload.sessionId;
    next();
  } catch (error) {
    next(error);
  }
};

export default requiresAuth;
