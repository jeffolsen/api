import { RequestHandler } from "express";
import catchErrors from "../util/catchErrors";
import {
  ERROR_CREDENTIALS,
  ERROR_SESSIONS_NOT_FOUND,
  NOT_FOUND,
  OK,
} from "../config/constants";
import prismaClient, { CodeType } from "../db/client";
import throwError from "../util/throwError";
import { processVerificationCode } from "../services/auth";
import { clearAuthCookies } from "../util/cookie";
import { SessionLogoutAllSchema } from "../schemas/session";
import { passwordSchema } from "../schemas/properties";

export const getProfilesSessions: RequestHandler = catchErrors(
  async (req, res, next) => {
    const { profileId } = req;

    const sessions = await prismaClient.session.findMany({
      where: {
        profileId,
        expiresAt: { gt: new Date() },
        endedAt: null,
      },
      orderBy: { createdAt: "desc" },
      omit: { scope: true },
    });

    res.status(OK).json(sessions);
  },
);

export const logout: RequestHandler = catchErrors(async (req, res, next) => {
  const { sessionId } = req;

  await prismaClient.session.logOut(sessionId);

  clearAuthCookies(res).sendStatus(OK);
});

interface LogoutAllWithSessionBody {
  password: string;
}

export const logoutAllWithSession: RequestHandler<
  unknown,
  unknown,
  LogoutAllWithSessionBody,
  unknown
> = catchErrors(async (req, res, next) => {
  const { profileId } = req;
  const password = passwordSchema.parse(req.body?.password);
  const profile = await prismaClient.profile.findUnique({
    where: { id: profileId },
  });
  throwError(
    profile && (await profile.comparePassword(password)),
    NOT_FOUND,
    ERROR_CREDENTIALS,
  );

  await prismaClient.session.logOutAll(profile.id);

  clearAuthCookies(res).sendStatus(OK);
});

interface LogoutAllBody {
  email: string;
  verificationCode: string;
}

export const logoutAllWithCode: RequestHandler<
  unknown,
  unknown,
  LogoutAllBody,
  unknown
> = catchErrors(async (req, res, next) => {
  const { email, verificationCode, userAgent } = SessionLogoutAllSchema.parse({
    ...(req.body as LogoutAllBody),
    userAgent: req.headers["user-agent"],
  });

  const profile = await prismaClient.profile.findUnique({ where: { email } });
  throwError(profile, NOT_FOUND, ERROR_CREDENTIALS);

  await processVerificationCode({
    profileId: profile.id,
    value: verificationCode,
    codeType: CodeType.LOGOUT_ALL,
    userAgent,
  });

  const sessions = await prismaClient.session.logOutAll(profile.id);
  throwError(sessions?.count, NOT_FOUND, ERROR_SESSIONS_NOT_FOUND);

  clearAuthCookies(res).sendStatus(OK);
});

const sessionApi = {
  getProfilesSessions,
  logout,
  logoutAllWithCode,
  logoutAllWithSession,
};

export default sessionApi;
