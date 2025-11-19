import { RequestHandler } from "express";
import prismaClient from "../db/client";
import createHttpError from "http-errors";

export const getProfilesSessions: RequestHandler = async (req, res, next) => {
  try {
    const { profileId } = req.body;

    const sessions = await prismaClient.session.findMany({
      where: {
        profileId,
      },
    });
    if (!sessions) throw createHttpError(404, "Sessions not found");

    res.status(200).json(sessions);
  } catch (error) {
    next(error);
  }
};
