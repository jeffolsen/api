import { RequestHandler } from "express";
import createHttpError from "http-errors";
import {
  createProfile,
  logInProfile,
  logOutOfAllSessions,
  logOutSession,
} from "../services/auth";
import { setAuthCookies } from "../util/cookie";
import catchErrors from "../util/catchErrors";
import { BAD_REQUEST, CREATED, OK } from "../config/constants";

interface RegisterBody {
  email: string;
  password: string;
  confirmPassword: string;
}

export const register: RequestHandler<unknown, unknown, RegisterBody, unknown> =
  catchErrors(async (req, res, next) => {
    const { email, password: passwordRaw, confirmPassword } = req.body;
    const { ["user-agent"]: userAgent } = req.headers;

    if (!email || !passwordRaw || !confirmPassword || !userAgent)
      throw createHttpError(
        BAD_REQUEST,
        "email and password twice are required"
      );

    if (passwordRaw !== confirmPassword)
      throw createHttpError(BAD_REQUEST, "passwords should match");

    const { profile, ...cookieOptions } = await createProfile({
      email,
      password: passwordRaw,
      userAgent,
    });

    setAuthCookies({ res, ...cookieOptions })
      .status(CREATED)
      .json(profile);
  });

interface LogInBody {
  email: string;
  password: string;
}

export const login: RequestHandler<unknown, unknown, LogInBody, unknown> =
  catchErrors(async (req, res, next) => {
    const { email, password } = req.body;
    const { ["user-agent"]: userAgent } = req.headers;

    if (!email || !password || !userAgent)
      throw createHttpError(BAD_REQUEST, "email and password are required");

    const { profile, ...cookieOptions } = await logInProfile({
      email,
      password,
      userAgent,
    });

    setAuthCookies({ res, ...cookieOptions })
      .status(CREATED)
      .json(profile);
  });

export const refreshAccessToken: RequestHandler = catchErrors(
  async (req, res, next) => {
    const { refreshToken } = req.cookies;

    if (!refreshToken)
      throw createHttpError(BAD_REQUEST, "refresh token is required");

    res.sendStatus(OK);
  }
);

export const logout: RequestHandler = catchErrors(async (req, res, next) => {
  const { accessToken } = req.cookies;

  if (!accessToken)
    throw createHttpError(BAD_REQUEST, "refresh token is required");

  await logOutSession({ accessToken });

  res.sendStatus(OK);
});

interface LogOutOfAllBody {
  email: string;
  password: string;
}
export const logoutOfAll: RequestHandler<
  unknown,
  unknown,
  LogOutOfAllBody,
  unknown
> = catchErrors(async (req, res, next) => {
  const { email, password: passwordRaw } = req.body;

  if (!email || !passwordRaw)
    throw createHttpError(BAD_REQUEST, "email and password are required");

  await logOutOfAllSessions({ email, password: passwordRaw });

  res.sendStatus(OK);
});

export const changePassword: RequestHandler = catchErrors(
  async (req, res, next) => {}
);

const authApi = {
  register,
  login,
  refreshAccessToken,
  logout,
  logoutOfAll,
  changePassword,
};
export default authApi;
