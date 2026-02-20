import { CookieOptions, Response } from "express";
import { getNewAccessTokenExpirationDate } from "./date";
import { AUTH_REFRESH_ENDPOINT, AUTH_ROUTES } from "../config/constants";
import env from "../config/env";

export const ACCESS_TOKEN_NAME = "accessToken";
export const REFRESH_TOKEN_NAME = "refreshToken";

const secure = env.NODE_ENV !== "development";

const defaults: CookieOptions = {
  httpOnly: true,
  sameSite: "none",
  secure,
};

const getAccessTokenCookieOptions = (): CookieOptions => {
  return {
    ...defaults,
    expires: getNewAccessTokenExpirationDate(),
  };
};
const getRefreshTokenCookieOptions = (expiresAt: Date): CookieOptions => {
  return {
    ...defaults,
    ...(expiresAt && { expires: expiresAt }),
    path: AUTH_ROUTES + AUTH_REFRESH_ENDPOINT,
  };
};

interface SetAuthCookieParams {
  res: Response;
  sessionExpiresAt: Date;
  accessToken: string;
  refreshToken: string;
}

export const setAuthCookies = ({
  res,
  sessionExpiresAt,
  accessToken,
  refreshToken,
}: SetAuthCookieParams) => {
  return res
    .cookie(ACCESS_TOKEN_NAME, accessToken, getAccessTokenCookieOptions())
    .cookie(
      REFRESH_TOKEN_NAME,
      refreshToken,
      getRefreshTokenCookieOptions(sessionExpiresAt),
    );
};

export const clearAuthCookies = (res: Response) => {
  res.clearCookie(ACCESS_TOKEN_NAME);
  res.clearCookie(REFRESH_TOKEN_NAME);
  return res;
};
