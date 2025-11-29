import { RequestHandler } from "express";
import prismaClient, { PrismaClient } from "../db/client";
import createHttpError from "http-errors";
import catchErrors from "../util/catchErrors";
import { OK } from "../config/constants";

export const getAllSessions: RequestHandler = catchErrors(
  async (req, res, next) => {
    const sessions = prismaClient.session.findMany();
    res.status(OK).json(sessions);
  }
);

export const getProfilesSessions: RequestHandler = catchErrors(
  async (req, res, next) => {
    const { profileId } = req.body;

    const sessions = await prismaClient.session.findMany({
      where: {
        profileId,
      },
    });
    if (!sessions) throw createHttpError(404, "Sessions not found");

    res.status(200).json(sessions);
  }
);

const sessionApi = {
  getAllSessions,
  getProfilesSessions,
};

export default sessionApi;
