import { RequestHandler } from "express";
import createHttpError from "http-errors";
import prismaClient from "../db/client";

export const getAuthenticatedProfile: RequestHandler = async (
  req,
  res,
  next
) => {
  try {
    const { profileId } = req.body;

    const profile = await prismaClient.profile.findUnique({
      where: {
        id: profileId,
      },
      omit: { password: true },
    });
    if (!profile) throw createHttpError(404, "Profile not found");

    res.status(200).json(profile);
  } catch (error) {
    next(error);
  }
};

export const changePassword: RequestHandler = async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
};

export const verifyEmail: RequestHandler = async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
};

export const deleteProfile: RequestHandler = async (req, res, next) => {
  try {
    const { profileId } = req.body;
    const sessions = await prismaClient.session.deleteMany({
      where: { profileId },
    });
    if (!sessions.count) throw createHttpError(404, "Profile not found");

    const profile = await prismaClient.profile.delete({
      where: { id: profileId },
    });
    if (!profile) throw createHttpError(404, "Profile not found");

    res.status(204);
  } catch (error) {
    next(error);
  }
};

const profileApi = {
  getAuthenticatedProfile,
  changePassword,
  verifyEmail,
  deleteProfile,
};
export default profileApi;
