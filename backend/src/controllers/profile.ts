import { NextFunction, Request, RequestHandler, Response } from "express";
import catchErrors from "../util/catchErrors";
import {
  BAD_REQUEST,
  ERROR_CREDENTIALS,
  ERROR_PROFILE_ID,
  NO_CONTENT,
  OK,
  UNAUTHORIZED,
} from "../config/constants";
import throwError from "../util/throwError";
import prismaClient, { CodeType } from "../db/client";
import { processVerificationCode } from "../services/auth";
import { DeleteProfileSchema, ResetPasswordSchema } from "../schemas/profile";

export const getAuthenticatedProfile: RequestHandler = catchErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const { profileId } = req;

    const profile = await prismaClient.profile.findUnique({
      where: { id: profileId },
    });
    throwError(profile, BAD_REQUEST, ERROR_PROFILE_ID);

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
  const { verificationCode, email, password, userAgent } =
    ResetPasswordSchema.parse({
      ...(req.body as ResetPasswordBody),
      userAgent: req.headers["user-agent"],
    });

  const profile = await prismaClient.profile.findUnique({ where: { email } });
  throwError(profile, UNAUTHORIZED, ERROR_CREDENTIALS);

  await processVerificationCode({
    profileId: profile.id,
    value: verificationCode,
    codeType: CodeType.PASSWORD_RESET,
    userAgent,
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
  const { verificationCode, email, userAgent } = DeleteProfileSchema.parse({
    ...(req.body as ResetPasswordBody),
    userAgent: req.headers["user-agent"],
  });

  const profile = await prismaClient.profile.findUnique({ where: { email } });
  throwError(profile, UNAUTHORIZED, ERROR_CREDENTIALS);

  await processVerificationCode({
    profileId: profile.id,
    value: verificationCode,
    codeType: CodeType.DELETE_PROFILE,
    userAgent,
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
