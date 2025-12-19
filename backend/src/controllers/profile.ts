import { NextFunction, Request, RequestHandler, Response } from "express";
import catchErrors from "../util/catchErrors";
import { NOT_FOUND, OK } from "../config/constants";
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
  },
);

const profileApi = {
  getAuthenticatedProfile,
};
export default profileApi;
