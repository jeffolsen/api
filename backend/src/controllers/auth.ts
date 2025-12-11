import { RequestHandler } from "express";
import { initSession } from "../services/auth";
import { setAuthCookies } from "../util/cookie";
import catchErrors from "../util/catchErrors";
import {
  BAD_REQUEST,
  CONFLICT,
  CREATED,
  NOT_FOUND,
  OK,
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
      "Required fields missing"
    );

    const emailNotFound = !(await prismaClient.profile.findUnique({
      where: { email },
    }));
    throwError(emailNotFound, CONFLICT, "Email already taken");

    const profile = await prismaClient.profile.create({
      data: { email, password: passwordSubmit },
    });

    const { session, ...tokens } = await initSession({
      profile,
      userAgent,
    });

    setAuthCookies({
      res,
      sessionExpiresAt: session.expiresAt,
      ...tokens,
    }).sendStatus(CREATED);
  });

interface RequestLogInBody {
  email: string;
  password: string;
}

export const requestLogin: RequestHandler<
  unknown,
  unknown,
  RequestLogInBody,
  unknown
> = catchErrors(async (req, res, next) => {
  const { email, password: passwordSubmit } = req.body;
  const { ["user-agent"]: userAgent } = req.headers;

  throwError(
    email && passwordSubmit && userAgent,
    BAD_REQUEST,
    "email and password are required"
  );

  const profile = await prismaClient.profile.findUnique({ where: { email } });
  throwError(
    profile && (await profile.comparePassword(passwordSubmit)),
    NOT_FOUND,
    "invalid credentials"
  );

  const { session, ...tokens } = await initSession({
    profile,
    userAgent,
  });

  setAuthCookies({
    res,
    sessionExpiresAt: session.expiresAt,
    ...tokens,
  }).sendStatus(OK);
});

interface RequestPasswordResetBody {
  email: string;
}
export const requestPasswordReset: RequestHandler<
  unknown,
  unknown,
  RequestPasswordResetBody,
  unknown
> = catchErrors(async (req, res, next) => {
  const { email } = req.body;
  const { ["user-agent"]: userAgent } = req.headers;

  throwError(email && userAgent, BAD_REQUEST, "email is required");

  const profile = await prismaClient.profile.findUnique({ where: { email } });
  throwError(profile, NOT_FOUND, "invalid credentials");

  const { session, ...tokens } = await initSession({
    profile,
    userAgent,
    codeType: "PASSWORD_RESET",
  });

  setAuthCookies({
    res,
    sessionExpiresAt: session.expiresAt,
    ...tokens,
  }).sendStatus(OK);
});

interface RequestLogoutOAllBody {
  email: string;
  password: string;
}
export const requestLogoutOfAll: RequestHandler<
  unknown,
  unknown,
  RequestLogoutOAllBody,
  unknown
> = catchErrors(async (req, res, next) => {
  const { email, password: passwordSubmit } = req.body;
  const { ["user-agent"]: userAgent } = req.headers;

  throwError(
    email && passwordSubmit && userAgent,
    BAD_REQUEST,
    "email and password are required"
  );

  const profile = await prismaClient.profile.findUnique({ where: { email } });
  throwError(
    profile && (await profile.comparePassword(passwordSubmit)),
    NOT_FOUND,
    "invalid credentials"
  );

  const { session, ...tokens } = await initSession({
    profile,
    userAgent,
    codeType: "LOGOUT_ALL",
  });

  setAuthCookies({
    res,
    sessionExpiresAt: session.expiresAt,
    ...tokens,
  }).sendStatus(OK);
});

interface RequestProfileDeletionBody {
  email: string;
  password: string;
}
export const requestProfileDeletion: RequestHandler<
  unknown,
  unknown,
  RequestProfileDeletionBody,
  unknown
> = catchErrors(async (req, res, next) => {
  const { email } = req.body;
  const { ["user-agent"]: userAgent } = req.headers;

  throwError(email && userAgent, BAD_REQUEST, "email is required");

  const profile = await prismaClient.profile.findUnique({ where: { email } });
  throwError(profile, NOT_FOUND, "invalid credentials");

  const { session, ...tokens } = await initSession({
    profile,
    userAgent,
    codeType: "PASSWORD_RESET",
  });

  setAuthCookies({
    res,
    sessionExpiresAt: session.expiresAt,
    ...tokens,
  }).sendStatus(OK);
});

const authApi = {
  register,
  requestLogin,
  requestLogoutOfAll,
  requestPasswordReset,
  requestProfileDeletion,
};
export default authApi;
