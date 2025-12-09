import { NextFunction, Request, RequestHandler, Response } from "express";
import catchErrors from "../util/catchErrors";
import {
  BAD_REQUEST,
  NO_CONTENT,
  NOT_FOUND,
  OK,
  UNAUTHORIZED,
} from "../config/constants";
import throwError from "../util/throwError";
import prismaClient from "../db/client";

export const getAuthenticatedProfile: RequestHandler = catchErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const { profileId } = req;

    const profile = await prismaClient.profile.findUnique({
      where: { id: profileId },
    });
    throwError(profile, NOT_FOUND, "Profile not found");

    res.status(OK).json(profile.clientSafe());
  }
);

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
  throwError(password, BAD_REQUEST, "password is required");

  const profile = await prismaClient.profile.findUnique({
    where: { id: profileId },
  });
  throwError(profile, NOT_FOUND, "Profile not found");

  const passwordMatch = await profile.comparePassword(password);
  throwError(passwordMatch, UNAUTHORIZED, "Invalid credentials");

  await prismaClient.profile.delete({
    where: { id: profileId },
  });

  res.sendStatus(NO_CONTENT);
});

const profileApi = {
  getAuthenticatedProfile,
  deleteProfile,
};
export default profileApi;
