import { RequestHandler } from "express";
import catchErrors from "@util/catchErrors";
import {
  MESSAGE_CREDENTIALS,
  MESSAGE_SESSIONS_NOT_FOUND,
} from "@config/errorMessages";
import { NOT_FOUND, OK } from "@config/errorCodes";
import prismaClient, { CodeType } from "@db/client";
import throwError from "@util/throwError";
import { processVerificationCode } from "@services/auth";
import { logOutSession, logOutAllSessions } from "@services/session";
import { clearAuthCookies } from "@util/cookie";
import { SessionLogoutAllSchema } from "@schemas/session";
import { passwordSchema } from "@schemas/properties";
import { compareValue } from "@util/bcrypt";
import { Request, Response } from "express";

export const getProfilesSessions: RequestHandler = catchErrors(
  async (req: Request, res: Response) => {
    const { profileId } = req;

    const sessions = await prismaClient.session.findMany({
      where: {
        profileId,
        expiredAt: { gt: new Date() },
        endedAt: null,
      },
      orderBy: { createdAt: "desc" },
      omit: { scope: true },
    });

    res.status(OK).json({ sessions });
  },
);

export const logout: RequestHandler = catchErrors(
  async (req: Request, res: Response) => {
    const { sessionId } = req;

    await logOutSession(sessionId);

    clearAuthCookies(res).sendStatus(OK);
  },
);

interface LogoutAllWithSessionBody {
  password: string;
}

export const logoutAllWithSession: RequestHandler<
  unknown,
  unknown,
  LogoutAllWithSessionBody,
  unknown
> = catchErrors(async (req: Request, res: Response) => {
  const { profileId } = req;
  const password = passwordSchema.parse(req.body?.password);
  const profile = await prismaClient.profile.findUnique({
    where: { id: profileId },
  });
  throwError(
    profile && (await compareValue(password, profile.password)),
    NOT_FOUND,
    MESSAGE_CREDENTIALS,
  );

  await logOutAllSessions(profile.id);

  clearAuthCookies(res).sendStatus(OK);
});

interface LogoutAllBody {
  email: string;
}

export const logoutAllWithCode: RequestHandler<
  unknown,
  unknown,
  LogoutAllBody,
  unknown
> = catchErrors(async (req: Request, res: Response) => {
  const code = req.get("X-Verification-Code");
  const { email, verificationCode, userAgent } = SessionLogoutAllSchema.parse({
    ...req.body,
    verificationCode: code || "",
    userAgent: req.headers["user-agent"],
  });

  const profile = await prismaClient.profile.findUnique({ where: { email } });
  throwError(profile, NOT_FOUND, MESSAGE_CREDENTIALS);

  await processVerificationCode({
    profileId: profile.id,
    value: verificationCode,
    codeType: CodeType.LOGOUT_ALL,
    userAgent,
  });

  const sessions = await logOutAllSessions(profile.id);
  throwError(sessions?.count, NOT_FOUND, MESSAGE_SESSIONS_NOT_FOUND);

  clearAuthCookies(res).sendStatus(OK);
});

const sessionApi = {
  getProfilesSessions,
  logout,
  logoutAllWithCode,
  logoutAllWithSession,
};

export default sessionApi;
