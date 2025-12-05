import { RequestHandler } from "express";
import {
  createPasswordResetSession,
  createProfile,
  logInProfile,
  logOutOfAllSessions,
  logOutSession,
} from "../services/auth";
import { setAuthCookies } from "../util/cookie";
import catchErrors from "../util/catchErrors";
import { BAD_REQUEST, CREATED, OK } from "../config/constants";
import throwError from "../util/throwError";
import sendEmail from "../util/sendEmail";
import { createVerificationCode } from "../services/verify";

interface RegisterBody {
  email: string;
  password: string;
  confirmPassword: string;
}

export const register: RequestHandler<unknown, unknown, RegisterBody, unknown> =
  catchErrors(async (req, res, next) => {
    const { email, password: passwordRaw, confirmPassword } = req.body;
    const { ["user-agent"]: userAgent } = req.headers;

    throwError(
      email && passwordRaw && confirmPassword && userAgent,
      BAD_REQUEST,
      "email and password twice are required"
    );

    throwError(
      passwordRaw === confirmPassword,
      BAD_REQUEST,
      "passwords should match"
    );

    const { profile, session, ...tokens } = await createProfile({
      email,
      password: passwordRaw,
      userAgent,
    });

    const code = await createVerificationCode({
      codeType: "EMAIL_VERIFICATION",
      profileId: profile.id,
      sessionId: session.id,
    });

    sendEmail(email, code);

    setAuthCookies({ res, session, ...tokens })
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

    throwError(
      email && password && userAgent,
      BAD_REQUEST,
      "email and password are required"
    );

    const { profile, session, ...tokens } = await logInProfile({
      email,
      password,
      userAgent,
    });

    const code = await createVerificationCode({
      codeType: "EMAIL_VERIFICATION",
      profileId: profile.id,
      sessionId: session.id,
    });

    sendEmail(email, code);

    setAuthCookies({ res, session, ...tokens })
      .status(CREATED)
      .json(profile);
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

  const passwordResetSession = await createPasswordResetSession({
    email,
    userAgent,
  });
  const { session, ...tokens } = passwordResetSession;

  const code = await createVerificationCode({
    codeType: "EMAIL_VERIFICATION",
    profileId: session.profileId,
    sessionId: session.id,
  });

  sendEmail(email, code);

  setAuthCookies({ res, session, ...tokens }).sendStatus(OK);
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

  throwError(
    email && passwordRaw,
    BAD_REQUEST,
    "email and password are required"
  );

  await logOutOfAllSessions({ email, password: passwordRaw });

  res.sendStatus(OK);
});

export const logout: RequestHandler = catchErrors(async (req, res, next) => {
  const { accessToken } = req.cookies;

  throwError(accessToken, BAD_REQUEST, "refresh token is required");

  await logOutSession({ accessToken });

  res.sendStatus(OK);
});

const authApi = {
  register,
  login,
  logout,
  logoutOfAll,
  requestPasswordReset,
};
export default authApi;
