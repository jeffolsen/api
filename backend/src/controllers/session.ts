import { RequestHandler } from "express";
import catchErrors from "../util/catchErrors";
import { BAD_REQUEST, NOT_FOUND, OK, UNAUTHORIZED } from "../config/constants";
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
  verificationCode: string;
  email: string;
}

export const logoutAll: RequestHandler<
  unknown,
  unknown,
  logoutAllBody,
  unknown
> = catchErrors(async (req, res, next) => {
  const { email, verificationCode } = req.body || {};
  throwError(verificationCode, BAD_REQUEST, "code is required");

  const profile = await prismaClient.profile.findUnique({ where: { email } });
  throwError(profile, UNAUTHORIZED, "Invalid credentials");

  await processVerificationCode({
    profileId: profile.id,
    value: verificationCode,
    codeType: CodeType.LOGOUT_ALL,
  });

  const sessions = await prismaClient.session.logOutAll(profile.id);
  throwError(sessions?.count, NOT_FOUND, "No sessions found");

  setAuthCookies({
    res,
    sessionExpiresAt: new Date(),
    refreshToken: "expired",
    accessToken: "expired",
  }).sendStatus(OK);
});

const sessionApi = {
  getProfilesSessions,
  logout,
  logoutAll,
};

export default sessionApi;
