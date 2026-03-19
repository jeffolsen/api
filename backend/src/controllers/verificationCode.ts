import {
  VERIFICATION_CODE_LOGIN_ENDPOINT,
  VERIFICATION_CODE_SESSION_RESET_ENDPOINT,
  VERIFICATION_CODE_DELETE_PROFILE_ENDPOINT,
  VERIFICATION_CODE_PASSWORD_RESET_ENDPOINT,
  VERIFICATION_CODE_MANAGE_API_KEY_ENDPOINT,
} from "../config/routes";
import {
  MESSAGE_ENDPOINT_NOT_FOUND,
  MESSAGE_CREDENTIALS,
  MESSAGE_MALFORMED,
  MESSAGE_SESSION_TOO_MANY,
} from "../config/errorMessages";
import {
  NOT_FOUND,
  OK,
  BAD_REQUEST,
  TOO_MANY_REQUESTS,
} from "../config/errorCodes";
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
      throwError(profileId && password, NOT_FOUND, MESSAGE_CREDENTIALS);
      profile = await prismaClient.profile.findUnique({
        where: { id: profileId },
      });
      throwError(
        profile && profile.comparePassword(password),
        NOT_FOUND,
        MESSAGE_CREDENTIALS,
      );
      codeType = CodeType.DELETE_PROFILE;
      break;
    // requires password + session
    case VERIFICATION_CODE_MANAGE_API_KEY_ENDPOINT:
      throwError(profileId && password, NOT_FOUND, MESSAGE_CREDENTIALS);
      profile = await prismaClient.profile.findUnique({
        where: { id: profileId },
      });
      throwError(
        profile && profile.comparePassword(password),
        NOT_FOUND,
        MESSAGE_CREDENTIALS,
      );
      codeType = CodeType.CREATE_API_KEY;
      break;
    // requires email + password
    case VERIFICATION_CODE_LOGIN_ENDPOINT:
      throwError(email && password, NOT_FOUND, MESSAGE_CREDENTIALS);
      profile = await prismaClient.profile.findUnique({ where: { email } });
      throwError(
        profile && profile.comparePassword(password),
        NOT_FOUND,
        MESSAGE_CREDENTIALS,
      );
      throwError(
        !(await prismaClient.session.maxExceeded(profile.id)),
        TOO_MANY_REQUESTS,
        MESSAGE_SESSION_TOO_MANY,
      );
      codeType = CodeType.LOGIN;
      break;
    // requires email + password
    case VERIFICATION_CODE_SESSION_RESET_ENDPOINT:
      throwError(email && password, NOT_FOUND, MESSAGE_CREDENTIALS);
      profile = await prismaClient.profile.findUnique({ where: { email } });
      throwError(
        profile && profile.comparePassword(password),
        NOT_FOUND,
        MESSAGE_CREDENTIALS,
      );
      codeType = CodeType.LOGOUT_ALL;
      break;
    // requires email only
    case VERIFICATION_CODE_PASSWORD_RESET_ENDPOINT:
      throwError(email, NOT_FOUND, MESSAGE_CREDENTIALS);
      profile = await prismaClient.profile.findUnique({ where: { email } });
      throwError(profile, NOT_FOUND, MESSAGE_CREDENTIALS);
      codeType = CodeType.PASSWORD_RESET;
      break;
    // bad url fragment
    default:
      throwError(false, NOT_FOUND, MESSAGE_ENDPOINT_NOT_FOUND);
  }
  throwError(profile && codeType, BAD_REQUEST, MESSAGE_MALFORMED);

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
