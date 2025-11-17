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

    const profile = prismaClient.profile.findUnique({
      where: {
        id: profileId,
      },
    });
    if (!profile) throw createHttpError(404, "Profile not found");

    res.status(200).json(profile);
  } catch (error) {
    next(error);
  }
};
export const changePassword: RequestHandler = async (req, res, next) => {};
export const verifyEmail: RequestHandler = async (req, res, next) => {};
export const deleteProfile: RequestHandler = async (req, res, next) => {};

const profileApi = {
  getAuthenticatedProfile,
  changePassword,
  verifyEmail,
  deleteProfile,
};
export default profileApi;
