import { ACCESS_TOKEN_LIFESPAN } from "../config/constants";
import { session } from "../db/client";
import { CookieOptions, Response } from "express";

const getAccessTokenCookieOptions = (): CookieOptions => {
  return { expires: new Date(Date() + ACCESS_TOKEN_LIFESPAN) };
};
const getRefreshTokenCookieOptions = (expiresAt: Date): CookieOptions => {
  return {
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
  const expiresAt = new Date(session.expiresAt.getDate());
  return res
    .cookie("accessToken", accessToken, getAccessTokenCookieOptions())
    .cookie(
      "refreshToken",
      refreshToken,
      getRefreshTokenCookieOptions(expiresAt)
    );
};
