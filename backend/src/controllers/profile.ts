import { NextFunction, Request, RequestHandler, Response } from "express";
import createHttpError from "http-errors";
import prismaClient from "../db/client";
import catchErrors from "../util/catchErrors";
import { BAD_REQUEST, NOT_FOUND, UNAUTHORIZED } from "../config/constants";
import { compareValue } from "../util/bcrypt";

export const getAuthenticatedProfile: RequestHandler = catchErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const { profileId } = req;

    const profile = await prismaClient.profile.findUnique({
      where: {
        id: profileId,
      },
      omit: { password: true },
    });
    if (!profile) throw createHttpError(404, "Profile not found");

    res.status(200).json(profile);
  }
);

interface VerifyEmailBody {
  profileId: number;
  verificationCode: string;
}

export const verifyEmail: RequestHandler<
  unknown,
  unknown,
  VerifyEmailBody,
  unknown
> = catchErrors(async (req: Request, res: Response, next: NextFunction) => {
  const { profileId } = req;
  const { verificationCode } = req.body;
});

interface DeleteProfilelBody {
  profileId: number;
  password: string;
}

export const deleteProfile: RequestHandler<
  unknown,
  unknown,
  DeleteProfilelBody,
  unknown
> = catchErrors(async (req: Request, res: Response, next: NextFunction) => {
  const { profileId } = req;
  const { password } = req.body;

  if (!password) throw createHttpError(BAD_REQUEST, "password is required");

  const profile = await prismaClient.profile.findUnique({
    where: { id: profileId },
  });
  if (!profile) throw createHttpError(NOT_FOUND, "Profile not found");

  const passwordMatch = await compareValue(password, profile.password);
  if (!passwordMatch)
    throw createHttpError(UNAUTHORIZED, "Invalid credentials");

  await prismaClient.profile.delete({
    where: { id: profileId },
  });

  res.status(204);
});

const profileApi = {
  getAuthenticatedProfile,
  verifyEmail,
  deleteProfile,
};
export default profileApi;
