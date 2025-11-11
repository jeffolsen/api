import { RequestHandler } from "express";
import prismaClient from "../db/client";

export const signup: RequestHandler = async (req, res, next) => {};
export const login: RequestHandler = async (req, res, next) => {};
export const logout: RequestHandler = async (req, res, next) => {};
export const changePassword: RequestHandler = async (req, res, next) => {};
export const verifyEmail: RequestHandler = async (req, res, next) => {};
export const deleteProfile: RequestHandler = async (req, res, next) => {};

const profileApi = {
  signup,
  login,
  logout,
  changePassword,
  verifyEmail,
  delete: deleteProfile,
};
export default profileApi;
