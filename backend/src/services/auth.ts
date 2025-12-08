import prismaClient, { CodeType } from "../db/client";
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
import { compareValue } from "../util/bcrypt";
import throwError from "../util/throwError";
import { createVerificationCode } from "./verify";
import sendEmail from "../util/sendEmail";
import { ExtendedProfile } from "../extensions/profile";

interface CheckCredentialsParams {
  email: string;
  password?: string;
}

interface LogInProfileParams {
  profile: ExtendedProfile;
  userAgent: string;
  codeType?: CodeType;
}

export const logInProfile = async ({
  profile,
  userAgent,
  codeType = "EMAIL_VERIFICATION",
}: LogInProfileParams) => {
  const { id: profileId, email } = profile;

  const sessions = await prismaClient.session.findMany({ where: { profile } });
  throwError(
    sessions.length <= MAX_PROFILE_SESSIONS,
    CONFLICT,
    "Max number of sessions reached"
  );

  const session = await prismaClient.session.create({
    data: {
      profileId,
      userAgent,
    },
  });

  session.isCurrent();

  const refreshToken = signRefreshToken(session.id);
  const accessToken = signAccessToken(session.id);

  const code = await createVerificationCode({
    codeType,
    profileId,
    sessionId: session.id,
  });

  sendEmail(email, code);

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

type LoginCredentials = {
  email: string;
  password: string;
};
type VerificationCode = {
  code: string;
};
type LogOutOfAllSessionsParams = LoginCredentials | VerificationCode;

export const logOutOfAllSessions = async (
  options: LogOutOfAllSessionsParams
) => {
  const { email, password } = options as LoginCredentials;
  const { code } = options as VerificationCode;

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
