import prismaClient from "../db/client";
import { preAuthProfileScope } from "../util/scope";
import {
  AccessTokenPayload,
  signAccessToken,
  signRefreshToken,
  validateToken,
} from "../util/jwt";
import {
  CONFLICT,
  MAX_PROFILE_SESSIONS,
  NOT_FOUND,
  UNAUTHORIZED,
} from "../config/constants";
import env from "../config/env";
import { getNewRefreshTokenExpirationDate } from "../util/date";
import { compareValue, hashValue } from "../util/bcrypt";
import throwError from "../util/throwError";

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
  const emailNotFound = !(await prismaClient.profile.findUnique({
    where: { email },
  }));
  throwError(emailNotFound, CONFLICT, "Email already taken");

  const passwordHashed = await hashValue(password);

  const profile = await prismaClient.profile.create({
    data: { email, password: passwordHashed },
    omit: {
      password: true,
    },
  });

  const session = await prismaClient.session.create({
    data: {
      profileId: profile.id,
      userAgent,
      scope: preAuthProfileScope(),
      expiresAt: getNewRefreshTokenExpirationDate(),
    },
  });

  const refreshToken = signRefreshToken(session.id);
  const accessToken = signAccessToken(session.id);

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
  throwError(profile, NOT_FOUND, "Profile not found");

  const { password: profilePassword, ...profileWithoutPassword } = profile;

  const passwordMatch = await compareValue(password, profilePassword);
  throwError(passwordMatch, UNAUTHORIZED, "Invalid credentials");

  const sessions = await prismaClient.session.findMany({
    where: { profileId: profile.id },
  });
  throwError(
    sessions.length <= MAX_PROFILE_SESSIONS,
    CONFLICT,
    "Max number of sessions reached"
  );

  const session = await prismaClient.session.create({
    data: {
      profileId: profile.id,
      userAgent,
      scope: preAuthProfileScope(),
      expiresAt: getNewRefreshTokenExpirationDate(),
    },
  });

  const refreshToken = signRefreshToken(session.id);
  const accessToken = signAccessToken(session.id);

  return {
    profile: profileWithoutPassword,
    session,
    refreshToken,
    accessToken,
  };
};

interface createPasswordResetSession {
  email: string;
  userAgent: string;
}

export const createPasswordResetSession = async ({
  email,
  userAgent,
}: createPasswordResetSession) => {
  const profile = await prismaClient.profile.findUnique({
    where: { email },
  });
  throwError(profile, NOT_FOUND, "Profile not found");

  const session = await prismaClient.session.create({
    data: {
      profileId: profile.id,
      userAgent,
      scope: preAuthProfileScope(),
      expiresAt: getNewRefreshTokenExpirationDate(),
    },
  });

  const refreshToken = signRefreshToken(session.id);
  const accessToken = signAccessToken(session.id);

  return {
    session,
    refreshToken,
    accessToken,
  };
};

interface LogOutSessionParams {
  accessToken: string;
}

export const logOutSession = async ({ accessToken }: LogOutSessionParams) => {
  const payload = (await validateToken({
    secret: env.JWT_SECRET,
    token: accessToken,
  })) as AccessTokenPayload;
  throwError(payload, UNAUTHORIZED, "Invalid token");

  const { sessionId } = payload;
  throwError(sessionId, UNAUTHORIZED, "Invalid token");

  const session = prismaClient.session.delete({ where: { id: sessionId } });
  throwError(session, UNAUTHORIZED, "Invalid token");

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
  throwError(profile, UNAUTHORIZED, "Invalid credentials");

  const passwordMatch = await compareValue(password, profile.password);
  throwError(passwordMatch, UNAUTHORIZED, "Invalid credentials");

  const sessions = await prismaClient.session.deleteMany({
    where: { profileId: profile.id },
  });
  throwError(sessions.count, NOT_FOUND, "No sessions found");

  return true;
};
