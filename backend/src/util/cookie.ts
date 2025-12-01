import { session } from "../db/client";
import { CookieOptions, Response } from "express";
import { getNewAccessTokenExpirationDate } from "./date";
import env from "../config/env";

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
    expires: expiresAt,
  };
};

interface SetAuthCookieParams {
  res: Response;
  session: session;
  accessToken: string;
  refreshToken: string;
}

export const setAuthCookies = ({
  res,
  session,
  accessToken,
  refreshToken,
}: SetAuthCookieParams) => {
  const { expiresAt } = session;
  return res
    .cookie("accessToken", accessToken, getAccessTokenCookieOptions())
    .cookie(
      "refreshToken",
      refreshToken,
      getRefreshTokenCookieOptions(expiresAt)
    );
};
