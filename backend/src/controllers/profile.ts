import { NextFunction, Request, RequestHandler, Response } from "express";
import catchErrors from "../util/catchErrors";
import { BAD_REQUEST, NO_CONTENT, OK, NOT_FOUND } from "../config/errorCodes";
import {
  MESSAGE_CREDENTIALS,
  MESSAGE_PROFILE_ID,
} from "../config/errorMessages";

import throwError from "../util/throwError";
import prismaClient, { CodeType } from "../db/client";
import { processVerificationCode } from "../services/auth";
import {
  DeleteProfileSchema,
  passwordTransform,
  ProfileCreateTransform,
  ResetPasswordWithCodeSchema,
  ChangePasswordWithSessionSchema,
} from "../schemas/profile";
import { clearAuthCookies } from "../util/cookie";

export const getAuthenticatedProfile: RequestHandler = catchErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const { profileId } = req;

    const profile = await prismaClient.profile.findUnique({
      where: { id: profileId },
    });
    throwError(profile, BAD_REQUEST, MESSAGE_PROFILE_ID);

    res.status(OK).json(profile.clientSafe());
  },
);

export const deleteProfile: RequestHandler = catchErrors(
  async (req, res, next) => {
    const code = req.get("X-Verification-Code") as string;
    const { profileId } = req;
    const { verificationCode, userAgent } = DeleteProfileSchema.parse({
      verificationCode: code || "",
      userAgent: req.headers["user-agent"],
    });

    const profile = await prismaClient.profile.findUnique({
      where: { id: profileId },
    });
    throwError(profile, NOT_FOUND, MESSAGE_CREDENTIALS);

    await processVerificationCode({
      profileId: profile.id,
      value: verificationCode,
      codeType: CodeType.DELETE_PROFILE,
      userAgent,
    });

    await prismaClient.profile.delete({
      where: { id: profile.id },
    });

    clearAuthCookies(res).sendStatus(NO_CONTENT);
  },
);

interface ResetPasswordBody {
  email: string;
  password: string;
  confirmPassword: string;
}

// from logged out state, so no profileId in req
export const resetPasswordWithCode: RequestHandler<
  unknown,
  unknown,
  ResetPasswordBody,
  unknown
> = catchErrors(async (req, res, next) => {
  const code = req.get("X-Verification-Code") as string;
  const { verificationCode, email, password, userAgent } =
    ResetPasswordWithCodeSchema.parse({
      ...req.body,
      verificationCode: code || "",
      userAgent: req.headers["user-agent"],
    });

  const profile = await prismaClient.profile.findUnique({ where: { email } });
  throwError(profile, NOT_FOUND, MESSAGE_CREDENTIALS);

  await processVerificationCode({
    profileId: profile.id,
    value: verificationCode,
    codeType: CodeType.PASSWORD_RESET,
    userAgent,
  });

  const { password: newPassword } = await ProfileCreateTransform.parseAsync({
    email,
    password,
  });

  await prismaClient.profile.update({
    where: { id: profile.id },
    data: {
      password: newPassword,
    },
  });

  await prismaClient.session.deleteMany({
    where: { profileId: profile.id },
  });

  res.sendStatus(OK);
});

interface ChangePasswordWithSessionBody {
  password: string;
  newPassword: string;
  confirmNewPassword: string;
}

export const changePasswordWithSession: RequestHandler<
  unknown,
  unknown,
  ChangePasswordWithSessionBody,
  unknown
> = catchErrors(async (req, res, next) => {
  const { profileId, sessionId } = req;
  const { password, newPassword } = ChangePasswordWithSessionSchema.parse(
    req.body,
  );
  const profile = await prismaClient.profile.findUnique({
    where: { id: profileId },
  });
  throwError(
    profile && (await profile.comparePassword(password)),
    NOT_FOUND,
    MESSAGE_PROFILE_ID,
  );
  const hashedNewPassword = await passwordTransform.parseAsync(newPassword);

  await prismaClient.profile.update({
    where: { id: profile.id },
    data: {
      password: hashedNewPassword,
    },
  });

  await prismaClient.session.deleteMany({
    where: { profileId: profile.id, id: { not: sessionId } },
  });

  res.sendStatus(OK);
});

const profileApi = {
  getAuthenticatedProfile,
  deleteProfile,
  resetPasswordWithCode,
  changePasswordWithSession,
};
export default profileApi;
