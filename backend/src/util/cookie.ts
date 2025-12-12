import { CookieOptions, Response } from "express";
import { getNewAccessTokenExpirationDate } from "./date";
import env from "../config/env";
import { AUTH_REFRESH_ENDPOINT, AUTH_ROUTES } from "../config/constants";

const secure = env.NODE_ENV !== "development";

const defaults: CookieOptions = {
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
    .cookie("accessToken", accessToken, getAccessTokenCookieOptions())
    .cookie(
      "refreshToken",
      refreshToken,
      getRefreshTokenCookieOptions(sessionExpiresAt)
    );
};
