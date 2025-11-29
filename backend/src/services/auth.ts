import bcrypt from "bcrypt";
import prismaClient from "../db/client";
import {
  deleteProfileScope,
  joinScopes,
  readProfileScope,
  updateProfileScope,
} from "./scope";
import {
  AccessTokenPayload,
  signAccessToken,
  signRefreshToken,
  validateToken,
} from "../util/jwt";
import createHttpError from "http-errors";
import {
  BAD_REQUEST,
  CONFLICT,
  MAX_PROFILE_SESSIONS,
  NOT_FOUND,
  UNAUTHORIZED,
} from "../config/constants";
import env from "../config/env";

interface CreateProfileParams {
  email: string;
  password: string;
  userAgent: string;
}

export const createProfile = async ({
  email,
  password,
  userAgent,
}: CreateProfileParams) => {
  const existingEmail = await prismaClient.profile.findUnique({
    where: { email },
  });
  if (existingEmail) throw createHttpError(CONFLICT, "Email already taken");

  const passwordHashed = await bcrypt.hash(password, 10);

  const profile = await prismaClient.profile.create({
    data: { email, password: passwordHashed },
  });

  const session = await prismaClient.session.create({
    data: { profileId: profile.id, userAgent },
  });

  const refreshToken = signRefreshToken(session.id);
  const accessToken = signAccessToken(
    session.id,
    joinScopes([readProfileScope, updateProfileScope, deleteProfileScope])
  );

  return { profile, session, refreshToken, accessToken };
};

interface LogInProfileParams {
  email: string;
  password: string;
  userAgent: string;
}

export const logInProfile = async ({
  email,
  password,
  userAgent,
}: LogInProfileParams) => {
  const profile = await prismaClient.profile.findUnique({
    where: { email },
  });

  if (!profile) throw createHttpError(UNAUTHORIZED, "Invalid credentials");

  const passwordMatch = await bcrypt.compare(password, profile.password);
  if (!passwordMatch)
    throw createHttpError(UNAUTHORIZED, "Invalid credentials");

  const sessions = await prismaClient.session.findMany({
    where: { profileId: profile.id },
  });
  if (sessions.length >= MAX_PROFILE_SESSIONS)
    throw createHttpError(CONFLICT, "Max number of sessions reached");

  const session = await prismaClient.session.create({
    data: { profileId: profile.id, userAgent },
  });

  const refreshToken = signRefreshToken(session.id);
  const accessToken = signAccessToken(
    session.id,
    joinScopes([readProfileScope, updateProfileScope, deleteProfileScope])
  );

  return { profile, session, refreshToken, accessToken };
};

interface LogOutSessionParams {
  refreshToken: string;
}

export const logOutSession = async ({ refreshToken }: LogOutSessionParams) => {
  const payload = (await validateToken({
    secret: env.JWT_SECRET,
    token: refreshToken,
  })) as AccessTokenPayload;
  if (!payload) throw createHttpError(UNAUTHORIZED, "Invalid token");

  const { sessionId } = payload;
  if (!sessionId) throw createHttpError(UNAUTHORIZED, "Invalid token");

  const session = prismaClient.session.delete({ where: { id: sessionId } });
  if (!session) throw createHttpError(UNAUTHORIZED, "Invalid token");

  return session;
};

interface LogOutOfAllSessionsParams {
  email: string;
  password: string;
}
export const logOutOfAllSessions = async ({
  email,
  password,
}: LogOutOfAllSessionsParams) => {
  const profile = await prismaClient.profile.findUnique({
    where: { email },
  });
  if (!profile) throw createHttpError(UNAUTHORIZED, "Invalid credentials");

  const passwordMatch = await bcrypt.compare(password, profile.password);
  if (!passwordMatch)
    throw createHttpError(UNAUTHORIZED, "Invalid credentials");

  const sessions = await prismaClient.session.deleteMany({
    where: { profileId: profile.id },
  });
  if (!sessions.count) throw createHttpError(NOT_FOUND, "No sessions found");

  return true;
};

interface UpdatePasswordParams {
  email: string;
  password: string;
  userAgent: string;
}

export const updatePassword = async ({
  email,
  password,
  userAgent,
}: UpdatePasswordParams) => {};
