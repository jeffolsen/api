import { CookieOptions, Response } from "express";
import { getNewAccessTokenExpirationDate } from "./date";
import {
  BASE_API_URL,
  AUTH_REFRESH_ENDPOINT,
  AUTH_ROUTES,
} from "../config/routes";
import env from "../config/env";

export const ACCESS_TOKEN_NAME = "accessToken";
export const REFRESH_TOKEN_NAME = "refreshToken";

const secure = env.NODE_ENV === "production";
const sameSite = "lax";

const defaults: CookieOptions = {
  httpOnly: true,
  sameSite,
  secure,
};

const getAccessTokenCookieOptions = (): CookieOptions => {
  return {
    ...defaults,
    expires: getNewAccessTokenExpirationDate(),
  };
};
const getRefreshTokenCookieOptions = (expiredAt: Date): CookieOptions => {
  return {
    ...defaults,
    ...(expiredAt && { expires: expiredAt }),
    path: BASE_API_URL + AUTH_ROUTES + AUTH_REFRESH_ENDPOINT,
  };
};

interface SetAuthCookieParams {
  res: Response;
  sessionexpiredAt: Date;
  accessToken: string;
  refreshToken: string;
}

export const setAuthCookies = ({
  res,
  sessionexpiredAt,
  accessToken,
  refreshToken,
}: SetAuthCookieParams) => {
  return res
    .cookie(ACCESS_TOKEN_NAME, accessToken, getAccessTokenCookieOptions())
    .cookie(
      REFRESH_TOKEN_NAME,
      refreshToken,
      getRefreshTokenCookieOptions(sessionexpiredAt),
    );
};

export const clearAuthCookies = (res: Response) => {
  res.clearCookie(ACCESS_TOKEN_NAME);
  res.clearCookie(REFRESH_TOKEN_NAME, {
    path: BASE_API_URL + AUTH_ROUTES + AUTH_REFRESH_ENDPOINT,
  });
  return res;
};
