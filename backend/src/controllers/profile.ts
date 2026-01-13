import { NextFunction, Request, RequestHandler, Response } from "express";
import catchErrors from "../util/catchErrors";
import {
  BAD_REQUEST,
  ERROR_CREDENTIALS,
  NO_CONTENT,
  NOT_FOUND,
  OK,
  UNAUTHORIZED,
} from "../config/constants";
import throwError from "../util/throwError";
import prismaClient, { CodeType } from "../db/client";
import { processVerificationCode } from "../services/auth";

export const getAuthenticatedProfile: RequestHandler = catchErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const { profileId } = req;

    const profile = await prismaClient.profile.findUnique({
      where: { id: profileId },
    });
    throwError(profile, NOT_FOUND, "Profile not found");

    res.status(OK).json(profile.clientSafe());
  },
);

interface ResetPasswordBody {
  verificationCode: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export const resetPassword: RequestHandler<
  unknown,
  unknown,
  ResetPasswordBody,
  unknown
> = catchErrors(async (req, res, next) => {
  const { verificationCode, email, password, confirmPassword } = req.body || {};
  throwError(
    verificationCode && password && confirmPassword && email,
    BAD_REQUEST,
    "value, email, password and confirmPassword are required",
  );

  throwError(
    password === confirmPassword,
    BAD_REQUEST,
    "Password and confirmPassword must match",
  );

  const profile = await prismaClient.profile.findUnique({ where: { email } });
  throwError(profile, UNAUTHORIZED, ERROR_CREDENTIALS);

  await processVerificationCode({
    profileId: profile.id,
    value: verificationCode,
    codeType: CodeType.PASSWORD_RESET,
  });

  await prismaClient.profile.update({
    where: { id: profile.id },
    data: {
      password,
    },
  });

  res.sendStatus(OK);
});

interface deleteProfileBody {
  verificationCode: string;
  email: string;
}

export const deleteProfile: RequestHandler<
  unknown,
  unknown,
  deleteProfileBody,
  unknown
> = catchErrors(async (req, res, next) => {
  const { email, verificationCode } = req.body || {};
  throwError(
    verificationCode && email,
    BAD_REQUEST,
    "verificationCode and email are required",
  );

  const profile = await prismaClient.profile.findUnique({ where: { email } });
  throwError(profile, UNAUTHORIZED, ERROR_CREDENTIALS);

  await processVerificationCode({
    profileId: profile.id,
    value: verificationCode,
    codeType: CodeType.DELETE_PROFILE,
  });

  await prismaClient.profile.delete({
    where: { id: profile.id },
  });

  res.sendStatus(NO_CONTENT);
});

const profileApi = {
  getAuthenticatedProfile,
  resetPassword,
  deleteProfile,
};
export default profileApi;
