import bcrypt from "bcrypt";
import jwt, { SignOptions } from "jsonwebtoken";
import prismaClient from "../db/client";
import env from "../util/env";
import {
  deleteProfileScope,
  joinScopes,
  readProfileScope,
  updateProfileScope,
} from "./scope";

interface CreateProfileProps {
  email: string;
  password: string;
  userAgent?: string;
}

export const createProfile = async ({
  email,
  password,
  userAgent,
}: CreateProfileProps) => {
  const existingEmail = await prismaClient.profile.findUnique({
    where: { email },
  });
  if (existingEmail) return null;

  const passwordHashed = await bcrypt.hash(password, 10);

  const profile = await prismaClient.profile.create({
    data: { email, password: passwordHashed },
  });

  const session = await prismaClient.session.create({
    data: { profileId: profile.id, userAgent },
  });

  const tokens = createTokenPair({
    profileId: profile.id,
    sessionId: session.id,
    scope: joinScopes([
      readProfileScope,
      updateProfileScope,
      deleteProfileScope,
    ]),
  });

  return { profile, ...tokens };
};

interface LogInProfileProps {
  email: string;
  password: string;
  userAgent?: string;
}

export const logInProfile = async ({
  email,
  password,
  userAgent,
}: LogInProfileProps) => {
  const profile = await prismaClient.profile.findUnique({
    where: { email },
  });
  if (!profile) return null;

  const passwordMatch = await bcrypt.compare(password, profile.password);
  if (!passwordMatch) return null;

  const session = await prismaClient.session.create({
    data: { profileId: profile.id, userAgent },
  });

  const tokens = createTokenPair({
    profileId: profile.id,
    sessionId: session.id,
    scope: joinScopes([
      readProfileScope,
      updateProfileScope,
      deleteProfileScope,
    ]),
  });

  return { profile, ...tokens };
};

const accessOptions = {
  expiresIn: "10m",
  audience: "profile",
} as SignOptions;

const refreshOptions = {
  expiresIn: "1d",
  audience: "profile",
} as SignOptions;

interface TokenPayload {
  profileId: number;
  sessionId: number;
  scope?: string;
}

interface CreateTokenProps extends TokenPayload {
  secret: string;
  options: SignOptions;
}

export const createTokenPair = ({
  profileId,
  sessionId,
  scope,
}: TokenPayload) => {
  return {
    accessToken: createToken({
      profileId,
      sessionId,
      scope,
      secret: env.JWT_SECRET,
      options: accessOptions,
    }),
    refreshToken: createToken({
      profileId,
      sessionId,
      secret: env.JWT_REFRESH_SECRET,
      options: refreshOptions,
    }),
  };
};

export const createToken = ({
  profileId,
  sessionId,
  scope,
  secret,
  options,
}: CreateTokenProps) => {
  return jwt.sign(
    {
      profileId,
      sessionId,
      ...(scope && { scope }),
    },
    secret,
    options
  );
};

interface ValidateTokenProps {
  token: string;
  secret: string;
}

export const validateToken = ({
  token,
  secret,
}: ValidateTokenProps): TokenPayload => {
  return jwt.verify(token, secret) as TokenPayload;
};
