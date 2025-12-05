import { RequestHandler } from "express";
import prismaClient from "../db/client";
import catchErrors from "../util/catchErrors";
import { BAD_REQUEST, OK } from "../config/constants";
import throwError from "../util/throwError";
import { setAuthCookies } from "../util/cookie";
import { refreshAccessToken } from "../services/token";

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

    const refreshedTokenOptions = await refreshAccessToken({ refreshToken });

    setAuthCookies({ res, ...refreshedTokenOptions }).sendStatus(OK);
  }
);

const sessionApi = {
  getProfilesSessions,
  refreshToken,
};

export default sessionApi;
