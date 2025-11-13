import bcrypt from "bcrypt";
import prismaClient from "../db/client";
import jwt from "jsonwebtoken";
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
  if (!existingEmail) return null;

  const passwordHashed = await bcrypt.hash(password, 10);

  const profile = await prismaClient.profile.create({
    data: { email, password: passwordHashed },
  });

  const session = await prismaClient.session.create({
    data: { profileId: profile.id, userAgent },
  });

  const accessToken = jwt.sign(
    {
      profileId: profile.id,
      sessionId: session.id,
    },
    env.JWT_SECRET,
    { expiresIn: "10m", audience: "profile" }
  );

  const refreshToken = jwt.sign(
    {
      profileId: profile.id,
      sessionId: session.id,
    },
    env.JWT_REFRESH_SECRET,
    { expiresIn: "1d", audience: "profile" }
  );

  return { profile, accessToken, refreshToken };
};

interface GetProfileProps {
  email: string;
  password: string;
  userAgent?: string;
}

export const getProfile = async ({
  email,
  password,
  userAgent,
}: GetProfileProps) => {
  const profile = await prismaClient.profile.findUnique({
    where: { email },
  });
  if (!profile) return null;

  const passwordMatch = await bcrypt.compare(password, profile.password);
  if (!passwordMatch) return null;

  const session = await prismaClient.session.create({
    data: { profileId: profile.id, userAgent },
  });

  const accessToken = jwt.sign(
    {
      profileId: profile.id,
      sessionId: session.id,
    },
    env.JWT_SECRET,
    { expiresIn: "10m", audience: "profile" }
  );

  const refreshToken = jwt.sign(
    {
      profileId: profile.id,
      sessionId: session.id,
    },
    env.JWT_REFRESH_SECRET,
    { expiresIn: "1d", audience: "profile" }
  );

  return { profile, accessToken, refreshToken };
};
