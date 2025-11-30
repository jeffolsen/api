import { session } from "../db/client";
import { CookieOptions, Response } from "express";
import { getNewAccessTokenExpirationDate } from "./date";

const getAccessTokenCookieOptions = (): CookieOptions => {
  return { expires: getNewAccessTokenExpirationDate() };
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
  const { expiresAt } = session;
  return res
    .cookie("accessToken", accessToken, getAccessTokenCookieOptions())
    .cookie(
      "refreshToken",
      refreshToken,
      getRefreshTokenCookieOptions(expiresAt)
    );
};
