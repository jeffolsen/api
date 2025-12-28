import { RequestHandler } from "express";
import catchErrors from "../util/catchErrors";
import prismaClient, { CodeType } from "../db/client";
import {
  OK,
  NOT_FOUND,
  BAD_REQUEST,
  VERIFICATION_CODE_LOGIN_ENDPOINT,
  VERIFICATION_CODE_LOGOUT_ALL_ENDPOINT,
  VERIFICATION_CODE_DELETE_PROFILE_ENDPOINT,
  VERIFICATION_CODE_ROUTES,
} from "../config/constants";
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

interface RequestCodeForProfileBody {
  email: string;
  password: string;
}
export const requestVerificationCode: RequestHandler<
  unknown,
  unknown,
  RequestCodeForProfileBody,
  unknown
> = catchErrors(async (req, res, next) => {
  const { email, password } = req.body;
  throwError(email && password, BAD_REQUEST, "Email and password are required");

  let codeType;
  switch (req.path) {
    case VERIFICATION_CODE_ROUTES + VERIFICATION_CODE_LOGIN_ENDPOINT:
      codeType = CodeType.LOGIN;
      break;
    case VERIFICATION_CODE_ROUTES + VERIFICATION_CODE_LOGOUT_ALL_ENDPOINT:
      codeType = CodeType.LOGOUT_ALL;
      break;
    case VERIFICATION_CODE_ROUTES + VERIFICATION_CODE_DELETE_PROFILE_ENDPOINT:
      codeType = CodeType.DELETE_PROFILE;
      break;
    default:
      break;
  }
  throwError(codeType, BAD_REQUEST, "Bad request");

  const profile = await prismaClient.profile.findUnique({ where: { email } });
  throwError(
    profile && (await profile.comparePassword(password)),
    NOT_FOUND,
    "invalid credentials",
  );

  sendVerificationCode({
    profileId: profile.id,
    email: profile.email,
    codeType,
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

const verificationCodeApi = {
  getProfileVerificationCodes,
  requestVerificationCode,
  requestCodeForPasswordReset,
};

export default verificationCodeApi;
