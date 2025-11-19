import { RequestHandler } from "express";
import createHttpError from "http-errors";
import { createProfile, logInProfile } from "../services/auth";

interface RegisterBody {
  email: string;
  password: string;
  confirmPassword: string;
  userAgent?: string;
}

export const register: RequestHandler<
  unknown,
  unknown,
  RegisterBody,
  unknown
> = async (req, res, next) => {
  try {
    const {
      email,
      password: passwordRaw,
      confirmPassword,
      userAgent,
    } = req.body;
    if (!email || !passwordRaw || !confirmPassword)
      throw createHttpError(
        400,
        "email, password and confirmation of password are required"
      );

    if (passwordRaw !== confirmPassword)
      throw createHttpError(400, "both passwords should match");

    const profile = await createProfile({
      email,
      password: passwordRaw,
      userAgent,
    });
    if (!profile) throw createHttpError(409, "Email already taken");

    res.status(201).json(profile);
  } catch (error) {
    next(error);
  }
};

interface LogInBody {
  email: string;
  password: string;
  userAgent?: string;
}

export const login: RequestHandler<
  unknown,
  unknown,
  LogInBody,
  unknown
> = async (req, res, next) => {
  try {
    const { email, password: passwordRaw, userAgent } = req.body;
    if (!email || !passwordRaw)
      throw createHttpError(400, "email and password are required");

    const profile = logInProfile({ email, password: passwordRaw, userAgent });
    if (!profile) throw createHttpError(401, "Invalid credentials");

    res.status(201).json(profile);
  } catch (error) {
    next(error);
  }
};

export const refreshToken: RequestHandler = async (req, res, next) => {};
export const logout: RequestHandler = async (req, res, next) => {};
export const logoutOfAll: RequestHandler = async (req, res, next) => {};

const authApi = {
  register,
  login,
  refreshToken,
  logout,
  logoutOfAll,
};
export default authApi;
