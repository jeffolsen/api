import {
  OK,
  NOT_FOUND,
  VERIFICATION_CODE_LOGIN_ENDPOINT,
  VERIFICATION_CODE_LOGOUT_ALL_ENDPOINT,
  VERIFICATION_CODE_DELETE_PROFILE_ENDPOINT,
  ERROR_ENDPOINT_NOT_FOUND,
  ERROR_CREDENTIALS,
  VERIFICATION_CODE_PASSWORD_RESET_ENDPOINT,
  UNAUTHORIZED,
  VERIFICATION_CODE_CREATE_API_KEY_ENDPOINT,
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
  const { email, password, userAgent } = requestVerificationCodeSchema.parse({
    ...req.body,
    userAgent: req.headers["user-agent"],
  });

  let codeType;
  switch (req.path) {
    case VERIFICATION_CODE_LOGIN_ENDPOINT:
      codeType = CodeType.LOGIN;
      break;
    case VERIFICATION_CODE_LOGOUT_ALL_ENDPOINT:
      codeType = CodeType.LOGOUT_ALL;
      break;
    case VERIFICATION_CODE_PASSWORD_RESET_ENDPOINT:
      codeType = CodeType.PASSWORD_RESET;
      break;
    case VERIFICATION_CODE_DELETE_PROFILE_ENDPOINT:
      codeType = CodeType.DELETE_PROFILE;
      break;
    case VERIFICATION_CODE_CREATE_API_KEY_ENDPOINT:
      codeType = CodeType.CREATE_API_KEY;
      break;
    default:
      break;
  }
  throwError(codeType, NOT_FOUND, ERROR_ENDPOINT_NOT_FOUND);

  const profile = await prismaClient.profile.findUnique({ where: { email } });
  throwError(profile, UNAUTHORIZED, ERROR_CREDENTIALS);

  await sendVerificationCode({
    profile,
    codeType,
    password,
    userAgent,
  });

  res.sendStatus(OK);
});

const verificationCodeApi = {
  getProfileVerificationCodes,
  requestVerificationCode,
};

export default verificationCodeApi;
