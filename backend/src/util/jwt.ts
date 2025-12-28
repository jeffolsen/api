import jwt from "jsonwebtoken";
import env from "../config/env";
import {
  ACCESS_TOKEN_OPTIONS,
  SESSION_TOKEN_OPTIONS,
} from "../config/constants";
import { getNewAccessTokenExpirationDate } from "./date";

export interface TokenPayload {
  sessionId: number;
  expiresAt?: Date;
  origin?: string;
}

export const verifyAccessToken = (accessToken: string): TokenPayload | null => {
  const payload = verifyToken(accessToken, env.JWT_SECRET);
  return payload;
};

export const verifyRefreshToken = (
  refreshToken: string,
): TokenPayload | null => {
  const payload = verifyToken(refreshToken, env.JWT_REFRESH_SECRET);
  return payload;
};

const verifyToken = (token: string, secret: string) => {
  try {
    const payload = jwt.verify(token, secret);
    return payload as TokenPayload;
  } catch (error) {
    return null;
  }
};

export const signAccessToken = (sessionId: number) => {
  return jwt.sign(
    {
      sessionId,
      expiresAt: getNewAccessTokenExpirationDate(),
    },
    env.JWT_SECRET,
    ACCESS_TOKEN_OPTIONS,
  );
};

export const signRefreshToken = (sessionId: number, origin?: string) => {
  return jwt.sign(
    { sessionId, ...(origin && { origin }) },
    env.JWT_REFRESH_SECRET,
    SESSION_TOKEN_OPTIONS,
  );
};
