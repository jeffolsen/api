import { RequestHandler } from "express";
import catchErrors from "../util/catchErrors";
import prismaClient, { CodeType } from "../db/client";
import { BAD_REQUEST, CONFLICT, NOT_FOUND, OK } from "../config/constants";
import { sendVerificationCode } from "../services/auth";
import throwError from "../util/throwError";

export const getProfileVerificationCodes: RequestHandler = catchErrors(
  async (req, res, next) => {
    const { profileId } = req;
    const codes = await prismaClient.verificationCode.findMany({
      where: { profileId },
      omit: { value: true, sessionId: true },
    });
    res.status(OK).json(codes);
  },
);

interface RequestCodeForLogInBody {
  email: string;
  password: string;
}

export const requestCodeForLogin: RequestHandler<
  unknown,
  unknown,
  RequestCodeForLogInBody,
  unknown
> = catchErrors(async (req, res, next) => {
  const { email, password: passwordSubmit } = req.body;

  throwError(
    email && passwordSubmit,
    BAD_REQUEST,
    "email and password are required",
  );

  const profile = await prismaClient.profile.findUnique({ where: { email } });
  throwError(
    profile && (await profile.comparePassword(passwordSubmit)),
    NOT_FOUND,
    "invalid credentials",
  );

  sendVerificationCode({
    profileId: profile.id,
    email: profile.email,
    codeType: CodeType.LOGIN,
  });

  res.sendStatus(OK);
});

interface RequestCodeForPasswordResetBody {
  email: string;
}
export const requestCodeForPasswordReset: RequestHandler<
  unknown,
  unknown,
  RequestCodeForPasswordResetBody,
  unknown
> = catchErrors(async (req, res, next) => {
  const { email } = req.body;

  throwError(email, BAD_REQUEST, "email is required");

  const profile = await prismaClient.profile.findUnique({ where: { email } });
  throwError(profile, NOT_FOUND, "invalid credentials");

  sendVerificationCode({
    profileId: profile.id,
    email: profile.email,
    codeType: CodeType.PASSWORD_RESET,
  });

  res.sendStatus(OK);
});

interface RequestCodeForLogoutOAllBody {
  email: string;
  password: string;
}
export const requestCodeForLogoutOfAll: RequestHandler<
  unknown,
  unknown,
  RequestCodeForLogoutOAllBody,
  unknown
> = catchErrors(async (req, res, next) => {
  const { email, password: passwordSubmit } = req.body;

  throwError(
    email && passwordSubmit,
    BAD_REQUEST,
    "email and password are required",
  );

  const profile = await prismaClient.profile.findUnique({ where: { email } });
  throwError(
    profile && (await profile.comparePassword(passwordSubmit)),
    NOT_FOUND,
    "invalid credentials",
  );

  sendVerificationCode({
    profileId: profile.id,
    email: profile.email,
    codeType: CodeType.LOGOUT_ALL,
  });

  res.sendStatus(OK);
});

interface RequestCodeForProfileDeletionBody {
  email: string;
  password: string;
}
export const requestCodeForProfileDeletion: RequestHandler<
  unknown,
  unknown,
  RequestCodeForProfileDeletionBody,
  unknown
> = catchErrors(async (req, res, next) => {
  const { email } = req.body;

  throwError(email, BAD_REQUEST, "email is required");

  const profile = await prismaClient.profile.findUnique({ where: { email } });
  throwError(profile, NOT_FOUND, "invalid credentials");

  sendVerificationCode({
    profileId: profile.id,
    email: profile.email,
    codeType: CodeType.DELETE_PROFILE,
  });

  res.sendStatus(OK);
});

const verificationCodeApi = {
  getProfileVerificationCodes,
  requestCodeForLogin,
  requestCodeForLogoutOfAll,
  requestCodeForPasswordReset,
  requestCodeForProfileDeletion,
};

export default verificationCodeApi;
