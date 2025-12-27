import { RequestHandler } from "express";
import {
  initSession,
  processVerificationCode,
  refreshAccessToken,
} from "../services/auth";
import { setAuthCookies } from "../util/cookie";
import catchErrors from "../util/catchErrors";
import {
  BAD_REQUEST,
  CONFLICT,
  CREATED,
  INTERNAL_SERVER_ERROR,
  OK,
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
    const { email, password: passwordSubmit, confirmPassword } = req.body;
    const { ["user-agent"]: userAgent } = req.headers;

    throwError(
      email &&
        passwordSubmit &&
        confirmPassword &&
        userAgent &&
        passwordSubmit === confirmPassword,
      BAD_REQUEST,
      "Required fields missing",
    );

    const emailNotFound = !(await prismaClient.profile.findUnique({
      where: { email },
    }));
    throwError(emailNotFound, CONFLICT, "Email already taken");

    const profile = await prismaClient.profile.create({
      data: { email, password: passwordSubmit },
    });
    throwError(profile, INTERNAL_SERVER_ERROR, "Something went wrong");

    res.sendStatus(CREATED);
  });

interface LoginWithVerificationCodeBody {
  value: string;
}

export const loginWithVerificationCode: RequestHandler<
  unknown,
  unknown,
  LoginWithVerificationCodeBody,
  unknown
> = catchErrors(async (req, res, next) => {
  const { email, value: verificationCode } = req.body;
  const { ["user-agent"]: userAgent } = req.headers;
  throwError(verificationCode, BAD_REQUEST, "code is required");

  const profile = await prismaClient.profile.findUnique({ where: { email } });
  throwError(profile, UNAUTHORIZED, "Invalid credentials");

  await processVerificationCode({
    profileId: profile.id,
    type: "LOGIN",
    value: verificationCode,
  });

  const { session, ...tokens } = await initSession({
    profile,
    userAgent,
  });

  setAuthCookies({
    res,
    sessionExpiresAt: session.expiresAt,
    ...tokens,
  }).sendStatus(OK);

  setAuthCookies({
    res,
    sessionExpiresAt: session.expiresAt,
    ...tokens,
  }).sendStatus(OK);
});

interface LoginWithApiKeyBody {
  slug: string;
  value: string;
}

export const loginWithApiKey: RequestHandler<
  unknown,
  unknown,
  LoginWithApiKeyBody,
  unknown
> = catchErrors(async (req, res, next) => {
  const { apiSlug: slug, apiKey: value } = req.body;

  throwError(slug && value, BAD_REQUEST, "API slug and API key required");
  res.sendStatus(OK);
});

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
  },
);

const authApi = {
  register,
  refreshToken,
  loginWithVerificationCode,
  loginWithApiKey,
};
export default authApi;
