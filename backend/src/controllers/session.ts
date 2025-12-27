import { RequestHandler } from "express";
import catchErrors from "../util/catchErrors";
import { BAD_REQUEST, NOT_FOUND, OK } from "../config/constants";
import prismaClient, { CodeType } from "../db/client";
import throwError from "../util/throwError";
import { processVerificationCode } from "../services/auth";
import { setAuthCookies } from "../util/cookie";

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
  },
);

export const logout: RequestHandler = catchErrors(async (req, res, next) => {
  const { sessionId } = req;

  const session = await prismaClient.session.logOut(sessionId);
  throwError(session, BAD_REQUEST, "Not logged in.");

  setAuthCookies({
    res,
    sessionExpiresAt: new Date(),
    refreshToken: "invalid",
    accessToken: "invalid",
  }).sendStatus(OK);
});

interface logoutAllBody {
  value: string;
}

export const logoutAll: RequestHandler<
  unknown,
  unknown,
  logoutAllBody,
  unknown
> = catchErrors(async (req, res, next) => {
  const { profileId } = req;
  const { value: verificationCode } = req.body;

  throwError(verificationCode, BAD_REQUEST, "code is required");

  await processVerificationCode({
    profileId,
    type: CodeType.LOGOUT_ALL,
    value: verificationCode,
  });

  const sessions = await prismaClient.session.logOutAll(profileId);
  throwError(sessions?.count, NOT_FOUND, "No sessions found");

  setAuthCookies({
    res,
    sessionExpiresAt: new Date(),
    refreshToken: "invalid",
    accessToken: "invalid",
  }).sendStatus(OK);
});

const sessionApi = {
  getProfilesSessions,
  logout,
  logoutAll,
};

export default sessionApi;
