import { RequestHandler } from "express";
import catchErrors from "../util/catchErrors";
import {
  BAD_REQUEST,
  ERROR_CREDENTIALS,
  NOT_FOUND,
  OK,
  UNAUTHORIZED,
} from "../config/constants";
import prismaClient, { CodeType } from "../db/client";
import throwError from "../util/throwError";
import { processVerificationCode } from "../services/auth";
import { setAuthCookies } from "../util/cookie";
import { SessionLogoutAllSchema } from "../schemas/session";

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

  await prismaClient.session.logOut(sessionId);

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
  const { email, verificationCode } = SessionLogoutAllSchema.parse(
    req.body as logoutAllBody,
  );

  const profile = await prismaClient.profile.findUnique({ where: { email } });
  throwError(profile, UNAUTHORIZED, ERROR_CREDENTIALS);

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
