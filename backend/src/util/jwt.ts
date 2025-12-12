import jwt from "jsonwebtoken";
import env from "../config/env";
import {
  ACCESS_TOKEN_OPTIONS,
  SESSION_TOKEN_OPTIONS,
} from "../config/constants";
import { getNewAccessTokenExpirationDate } from "./date";
import throwError from "./throwError";

// export interface RefreshToken {
//   payload: RefreshTokenPayload;
//   secret: string;
//   options: SignOptions;
// }

// export interface AccessToken {
//   payload: AccessTokenPayload;
//   secret: string;
//   options: SignOptions;
// }

// export type CreateTokenProps = RefreshToken | AccessToken;

export interface TokenPayload {
  sessionId: number;
  expiresAt?: Date;
}

export const verifyAccessToken = (accessToken: string): TokenPayload | null => {
  const payload = verifyToken(accessToken, env.JWT_SECRET);
  return payload;
};

export const verifyRefreshToken = (
  refreshToken: string
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
  console.log(getNewAccessTokenExpirationDate(), ACCESS_TOKEN_OPTIONS);
  return jwt.sign(
    {
      sessionId,
      expiresAt: getNewAccessTokenExpirationDate(),
    },
    env.JWT_SECRET,
    ACCESS_TOKEN_OPTIONS
  );
};

export const signRefreshToken = (sessionId: number) => {
  return jwt.sign({ sessionId }, env.JWT_REFRESH_SECRET, SESSION_TOKEN_OPTIONS);
};
