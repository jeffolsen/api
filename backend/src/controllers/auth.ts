import { RequestHandler } from "express";
import { initProfileSession, refreshAccessToken } from "../services/auth";
import { setAuthCookies } from "../util/cookie";
import catchErrors from "../util/catchErrors";
import {
  OK,
  CREATED,
  CONFLICT,
  ERROR_EMAIL_TAKEN,
  ERROR_CREDENTIALS,
  NOT_FOUND,
} from "../config/constants";
import throwError from "../util/throwError";
import prismaClient from "../db/client";
import { loginSchema, RegisterSchema } from "../schemas/auth";
import { ProfileCreateTransform } from "../schemas/profile";

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
      data: await ProfileCreateTransform.parseAsync({ email, password }),
    });

    res.sendStatus(CREATED);
  });

interface LoginWithVerificationCodeBody {
  email: string;
}

export const login: RequestHandler<
  unknown,
  unknown,
  LoginWithVerificationCodeBody,
  unknown
> = catchErrors(async (req, res, next) => {
  const code = req.get("X-Verification-Code") as string;
  console.log("Login - Received code:", code);
  const { profileId } = req;
  const loggedIn = !!profileId;
  throwError(!loggedIn, CONFLICT, "Already logged in");

  const { email, verificationCode, userAgent } = loginSchema.parse({
    ...(req.body as LoginWithVerificationCodeBody),
    userAgent: req.headers["user-agent"],
    verificationCode: code || "",
  });

  const profile = await prismaClient.profile.findUnique({ where: { email } });
  throwError(profile, NOT_FOUND, ERROR_CREDENTIALS);

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
  const userAgent = req.headers["user-agent"];
  throwError(refreshToken, NOT_FOUND, ERROR_CREDENTIALS);

  const { session, ...tokens } = await refreshAccessToken({
    refreshToken,
    userAgent,
  });

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
