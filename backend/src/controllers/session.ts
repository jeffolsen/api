import { RequestHandler } from "express";
import prismaClient, { PrismaClient } from "../db/client";
import createHttpError from "http-errors";
import catchErrors from "../util/catchErrors";
import { NOT_FOUND, OK } from "../config/constants";
import throwError from "../util/throwError";

export const getAllSessions: RequestHandler = catchErrors(
  async (req, res, next) => {
    const sessions = await prismaClient.session.findMany();
    res.status(OK).json(sessions);
  }
);

export const getProfilesSessions: RequestHandler = catchErrors(
  async (req, res, next) => {
    const { profileId } = req;

    const sessions = await prismaClient.session.findMany({
      where: {
        profileId,
      },
    });

    res.status(OK).json(sessions);
  }
);

export const deleteProfileSession: RequestHandler = catchErrors(
  async (req, res, next) => {
    const { profileId, sessionId: currentSessionId } = req;
    const { sessionId } = req.body;
  }
);

const sessionApi = {
  getAllSessions,
  getProfilesSessions,
};

export default sessionApi;
