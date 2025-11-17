import bcrypt from "bcrypt";
import jwt, { SignOptions } from "jsonwebtoken";
import prismaClient from "../db/client";
import env from "../util/env";

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

  const tokens = createTokens({
    profileId: profile.id,
    sessionId: session.id,
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

  const tokens = createTokens({
    profileId: profile.id,
    sessionId: session.id,
  });

  return { profile, ...tokens };
};

interface CreateTokenProps {
  profileId: number;
  sessionId: number;
}

const accessOptions = {
  expiresIn: "10m",
  audience: "profile",
} as SignOptions;

const refreshOptions = {
  expiresIn: "1d",
  audience: "profile",
} as SignOptions;

const createTokens = ({ profileId, sessionId }: CreateTokenProps) => {
  return {
    accessToken: jwt.sign(
      {
        profileId,
        sessionId,
      },
      env.JWT_SECRET,
      accessOptions
    ),
    refreshToken: jwt.sign(
      {
        profileId,
        sessionId,
      },
      env.JWT_REFRESH_SECRET,
      refreshOptions
    ),
  };
};
