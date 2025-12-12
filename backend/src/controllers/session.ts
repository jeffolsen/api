import { RequestHandler } from "express";
import catchErrors from "../util/catchErrors";
import { OK } from "../config/constants";
import prismaClient from "../db/client";

export const getProfilesSessions: RequestHandler = catchErrors(
  async (req, res, next) => {
    const { profileId } = req;

    const sessions = await prismaClient.session.findMany({
      where: {
        profileId,
      },
      omit: { scope: true },
    });

    res.status(OK).json(sessions);
  }
);

const sessionApi = {
  getProfilesSessions,
};

export default sessionApi;
