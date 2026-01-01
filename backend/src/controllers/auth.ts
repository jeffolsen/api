import { RequestHandler } from "express";
import { initProfileSession, refreshAccessToken } from "../services/auth";
import { setAuthCookies } from "../util/cookie";
import catchErrors from "../util/catchErrors";
import {
  OK,
  CREATED,
  CONFLICT,
  BAD_REQUEST,
  UNAUTHORIZED,
} from "../config/constants";
import throwError from "../util/throwError";
import prismaClient from "../db/client";

interface RegisterBody {
  email: string;
  password: string;
  confirmPassword: string;
}

export const register: RequestHandler<unknown, unknown, RegisterBody, unknown> =
  catchErrors(async (req, res, next) => {
    const { email, password, confirmPassword } =
      (req.body as RegisterBody) || {};
    throwError(
      email && password && confirmPassword,
      BAD_REQUEST,
      "Required fields missing",
    );

    throwError(
      password === confirmPassword,
      BAD_REQUEST,
      "Password and confirmPassword must match",
    );

    const emailFound = await prismaClient.profile.findUnique({
      where: { email },
    });
    throwError(!emailFound, CONFLICT, "Email already taken");

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
  const { email, verificationCode } =
    (req.body as LoginWithVerificationCodeBody) || {};
  const { ["user-agent"]: userAgent } = req.headers || {};
  throwError(verificationCode, BAD_REQUEST, "code is required");

  const profile = await prismaClient.profile.findUnique({ where: { email } });
  throwError(profile, UNAUTHORIZED, "Invalid credentials");

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
  throwError(refreshToken, UNAUTHORIZED, "unauthorized");

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
