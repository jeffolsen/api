import {
  OK,
  NOT_FOUND,
  VERIFICATION_CODE_LOGIN_ENDPOINT,
  VERIFICATION_CODE_SESSION_RESET_ENDPOINT,
  VERIFICATION_CODE_DELETE_PROFILE_ENDPOINT,
  ERROR_ENDPOINT_NOT_FOUND,
  ERROR_CREDENTIALS,
  VERIFICATION_CODE_PASSWORD_RESET_ENDPOINT,
  VERIFICATION_CODE_MANAGE_API_KEY_ENDPOINT,
  BAD_REQUEST,
  ERROR_MALFORMED,
  ERROR_SESSION_TOO_MANY,
  TOO_MANY_REQUESTS,
} from "../config/constants";
import { RequestHandler } from "express";
import catchErrors from "../util/catchErrors";
import prismaClient, { CodeType } from "../db/client";
import { sendVerificationCode } from "../services/auth";
import throwError from "../util/throwError";
import { requestVerificationCodeSchema } from "../schemas/verificationCode";

export const getProfileVerificationCodes: RequestHandler = catchErrors(
  async (req, res, next) => {
    const { profileId } = req;

    const codes = await prismaClient.verificationCode.findMany({
      where: { profileId },
      orderBy: { createdAt: "desc" },
      omit: { value: true },
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
  const { profileId } = req;
  const { email, password, userAgent } = requestVerificationCodeSchema.parse({
    ...req.body,
    userAgent: req.headers["user-agent"],
  });

  let codeType;
  let profile;
  switch (req.path) {
    // requires password + session
    case VERIFICATION_CODE_DELETE_PROFILE_ENDPOINT:
      throwError(profileId && password, NOT_FOUND, ERROR_CREDENTIALS);
      profile = await prismaClient.profile.findUnique({
        where: { id: profileId },
      });
      throwError(
        profile && profile.comparePassword(password),
        NOT_FOUND,
        ERROR_CREDENTIALS,
      );
      codeType = CodeType.DELETE_PROFILE;
      break;
    // requires password + session
    case VERIFICATION_CODE_MANAGE_API_KEY_ENDPOINT:
      throwError(profileId && password, NOT_FOUND, ERROR_CREDENTIALS);
      profile = await prismaClient.profile.findUnique({
        where: { id: profileId },
      });
      throwError(
        profile && profile.comparePassword(password),
        NOT_FOUND,
        ERROR_CREDENTIALS,
      );
      codeType = CodeType.CREATE_API_KEY;
      break;
    // requires email + password
    case VERIFICATION_CODE_LOGIN_ENDPOINT:
      throwError(email && password, NOT_FOUND, ERROR_CREDENTIALS);
      profile = await prismaClient.profile.findUnique({ where: { email } });
      throwError(
        profile && profile.comparePassword(password),
        NOT_FOUND,
        ERROR_CREDENTIALS,
      );
      throwError(
        !(await prismaClient.session.maxExceeded(profile.id)),
        TOO_MANY_REQUESTS,
        ERROR_SESSION_TOO_MANY,
      );
      codeType = CodeType.LOGIN;
      break;
    // requires email + password
    case VERIFICATION_CODE_SESSION_RESET_ENDPOINT:
      throwError(email && password, NOT_FOUND, ERROR_CREDENTIALS);
      profile = await prismaClient.profile.findUnique({ where: { email } });
      throwError(
        profile && profile.comparePassword(password),
        NOT_FOUND,
        ERROR_CREDENTIALS,
      );
      codeType = CodeType.LOGOUT_ALL;
      break;
    // requires email only
    case VERIFICATION_CODE_PASSWORD_RESET_ENDPOINT:
      throwError(email, NOT_FOUND, ERROR_CREDENTIALS);
      profile = await prismaClient.profile.findUnique({ where: { email } });
      throwError(profile, NOT_FOUND, ERROR_CREDENTIALS);
      codeType = CodeType.PASSWORD_RESET;
      break;
    // bad url fragment
    default:
      throwError(false, NOT_FOUND, ERROR_ENDPOINT_NOT_FOUND);
  }
  throwError(profile && codeType, BAD_REQUEST, ERROR_MALFORMED);

  await sendVerificationCode({
    profile,
    codeType,
    userAgent,
  });

  res.sendStatus(OK);
});

const verificationCodeApi = {
  getProfileVerificationCodes,
  requestVerificationCode,
};

export default verificationCodeApi;
