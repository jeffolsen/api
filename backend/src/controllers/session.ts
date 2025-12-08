import { RequestHandler } from "express";
import catchErrors from "../util/catchErrors";
import { BAD_REQUEST, OK } from "../config/constants";
import throwError from "../util/throwError";
import { setAuthCookies } from "../util/cookie";
import { refreshAccessToken } from "../services/token";
import { logOutSession } from "../services/auth";
import prismaClient from "../db/client";

export const getProfilesSessions: RequestHandler = catchErrors(
  async (req, res, next) => {
    const { profileId } = req;

    const sessions = await prismaClient.session.findMany({
      where: {
        profileId,
      },
      omit: { scope: true },
    });

    res.status(OK).json(sessions);
  }
);

export const refreshToken: RequestHandler = catchErrors(
  async (req, res, next) => {
    const { refreshToken } = req.cookies;

    throwError(refreshToken, BAD_REQUEST, "refresh token is required");

    const { session, ...tokens } = await refreshAccessToken({ refreshToken });

    setAuthCookies({
      res,
      sessionExpiresAt: session.expiresAt,
      ...tokens,
    }).sendStatus(OK);
  }
);

export const logout: RequestHandler = catchErrors(async (req, res, next) => {
  const { accessToken } = req.cookies;

  throwError(accessToken, BAD_REQUEST, "refresh token is required");

  await logOutSession({ accessToken });

  res.sendStatus(OK);
});

const sessionApi = {
  getProfilesSessions,
  refreshToken,
  logout,
};

export default sessionApi;
