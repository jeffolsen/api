import bcrypt from "bcrypt";
import prismaClient from "../db/client";
import {
  deleteProfileScope,
  joinScopes,
  readProfileScope,
  updateProfileScope,
} from "./scope";
import { signTokenPair } from "../util/jwt";

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

  const tokens = signTokenPair({
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

  const tokens = signTokenPair({
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
