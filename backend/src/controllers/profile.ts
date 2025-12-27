import { NextFunction, Request, RequestHandler, Response } from "express";
import catchErrors from "../util/catchErrors";
import {
  BAD_REQUEST,
  INTERNAL_SERVER_ERROR,
  NO_CONTENT,
  NOT_FOUND,
  OK,
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
  value: string;
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
  const {
    value: verificationCode,
    email,
    password,
    confirmPassword,
  } = req.body;

  throwError(
    verificationCode && password && confirmPassword,
    BAD_REQUEST,
    "code and password twice are required",
  );

  await processVerificationCode({
    profileId,
    type: CodeType.PASSWORD_RESET,
    value: verificationCode,
  });

  throwError(
    await prismaClient.profile.findUnique({
      where: { id: profileId },
    }),
    INTERNAL_SERVER_ERROR,
    "something went wrong",
  );

  await prismaClient.profile.update({
    where: { id: profileId },
    data: {
      password,
    },
  });

  res.sendStatus(OK);
});

interface deleteProfileBody {
  value: string;
  email: string;
}

export const deleteProfile: RequestHandler<
  unknown,
  unknown,
  deleteProfileBody,
  unknown
> = catchErrors(async (req, res, next) => {
  const { email, value: verificationCode } = req.body;
  throwError(verificationCode, BAD_REQUEST, "code is required");

  await processVerificationCode({
    profileId,
    type: CodeType.DELETE_PROFILE,
    value: verificationCode,
  });

  await prismaClient.profile.delete({
    where: { id: profileId },
  });

  res.sendStatus(NO_CONTENT);
});

const profileApi = {
  getAuthenticatedProfile,
  resetPassword,
  deleteProfile,
};
export default profileApi;
