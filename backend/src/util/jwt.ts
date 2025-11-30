import jwt, { SignOptions } from "jsonwebtoken";
import env from "../config/env";
import {
  ACCESS_TOKEN_LIFESPAN,
  ACCESS_TOKEN_OPTIONS,
} from "../config/constants";

export interface RefreshTokenPayload {
  sessionId: number;
}

export interface AccessTokenPayload extends RefreshTokenPayload {
  scope: string;
  expiresAt: number;
}

export interface RefreshToken {
  payload: RefreshTokenPayload;
  secret: string;
  options: SignOptions;
}

export interface AccessToken {
  payload: AccessTokenPayload;
  secret: string;
  options: SignOptions;
}

export type CreateTokenProps = RefreshToken | AccessToken;

export interface ValidateTokenProps {
  token: string;
  secret: string;
}

export const validateToken = ({
  token,
  secret,
}: ValidateTokenProps): RefreshTokenPayload | AccessTokenPayload => {
  const payload = jwt.verify(token, secret);
  return payload as RefreshTokenPayload | AccessTokenPayload;
};

export const signAccessToken = (sessionId: number) => {
  return jwt.sign(
    {
      sessionId,
      expiresAt: new Date().getDate() + ACCESS_TOKEN_LIFESPAN,
    },
    env.JWT_SECRET,
    ACCESS_TOKEN_OPTIONS
  );
};

export const signRefreshToken = (sessionId: number) => {
  return jwt.sign({ sessionId }, env.JWT_REFRESH_SECRET);
};
