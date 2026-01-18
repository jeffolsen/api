import { RequestHandler } from "express";
import { initProfileSession, refreshAccessToken } from "../services/auth";
import { setAuthCookies } from "../util/cookie";
import catchErrors from "../util/catchErrors";
import {
  OK,
  CREATED,
  CONFLICT,
  UNAUTHORIZED,
  ERROR_EMAIL_TAKEN,
  ERROR_CREDENTIALS,
  ERROR_UNAUTHORIZED,
} from "../config/constants";
import throwError from "../util/throwError";
import prismaClient from "../db/client";
import { loginSchema, RegisterSchema } from "../schemas/auth";

interface RegisterBody {
  email: string;
  password: string;
  confirmPassword: string;
}

export const register: RequestHandler<unknown, unknown, RegisterBody, unknown> =
  catchErrors(async (req, res, next) => {
    const { email, password } = RegisterSchema.parse({
      ...(req.body as RegisterBody),
    });

    const emailFound = await prismaClient.profile.findUnique({
      where: { email },
    });
    throwError(!emailFound, CONFLICT, ERROR_EMAIL_TAKEN);

    await prismaClient.profile.create({
      data: { email, password },
    });

    res.sendStatus(CREATED);
  });

interface LoginWithVerificationCodeBody {
  email: string;
  verificationCode: string;
}

export const login: RequestHandler<
  unknown,
  unknown,
  LoginWithVerificationCodeBody,
  unknown
> = catchErrors(async (req, res, next) => {
  const { email, verificationCode, userAgent } = loginSchema.parse({
    ...(req.body as LoginWithVerificationCodeBody),
  });

  const profile = await prismaClient.profile.findUnique({ where: { email } });
  throwError(profile, UNAUTHORIZED, ERROR_CREDENTIALS);

  const { session, ...tokens } = await initProfileSession({
    profile,
    verificationCode,
    userAgent,
  });

  setAuthCookies({
    res,
    sessionExpiresAt: session.expiresAt,
    ...tokens,
  }).sendStatus(OK);
});

export const refresh: RequestHandler = catchErrors(async (req, res, next) => {
  const { refreshToken } = req.cookies;
  throwError(refreshToken, UNAUTHORIZED, ERROR_UNAUTHORIZED);

  const { session, ...tokens } = await refreshAccessToken({ refreshToken });

  setAuthCookies({
    res,
    sessionExpiresAt: session.expiresAt,
    ...tokens,
  }).sendStatus(OK);
});

const authApi = {
  register,
  refresh,
  login,
};
export default authApi;
