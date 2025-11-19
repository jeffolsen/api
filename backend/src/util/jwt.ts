import jwt, { SignOptions } from "jsonwebtoken";
import env from "./env";
import {
  ACCESS_TOKEN_OPTIONS,
  REFRESH_TOKEN_OPTIONS,
} from "../config/settings";

export interface TokenPayload {
  profileId: number;
  sessionId: number;
}

export interface AccessTokenPayload extends TokenPayload {
  scope: string;
}

export interface CreateTokenProps {
  payload: AccessTokenPayload | TokenPayload;
  secret: string;
  options: SignOptions;
}

export const signToken = ({ payload, secret, options }: CreateTokenProps) => {
  return jwt.sign(payload, secret, options);
};

export interface ValidateTokenProps {
  token: string;
  secret: string;
}

export const validateToken = ({
  token,
  secret,
}: ValidateTokenProps): TokenPayload => {
  const payload = jwt.verify(token, secret);
  return payload as TokenPayload;
};

export const signTokenPair = ({
  profileId,
  sessionId,
  scope,
}: AccessTokenPayload) => {
  return {
    accessToken: signToken({
      payload: { profileId, sessionId, scope },
      secret: env.JWT_SECRET,
      options: ACCESS_TOKEN_OPTIONS,
    }),
    refreshToken: signToken({
      payload: { profileId, sessionId },
      secret: env.JWT_REFRESH_SECRET,
      options: REFRESH_TOKEN_OPTIONS,
    }),
  };
};
