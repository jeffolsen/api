import { Prisma, PrismaClient } from "../generated/prisma/client";
import env from "../config/env";
import profileExtension, {
  profileExtensionTypeConfig,
} from "../extensions/profile";
import sessionExtension, {
  sessionExtensionTypeConfig,
} from "../extensions/session";
import verificationCodeExtension, {
  verificationCodeExtensionTypeConfig,
} from "../extensions/verificationCode";
import apiKeyExtension, {
  apiKeyExtensionTypeConfig,
} from "../extensions/apikey";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

const prismaClient = globalForPrisma.prisma || new PrismaClient();

if (env.NODE_ENV !== "production") globalForPrisma.prisma = prismaClient;

export * from "../generated/prisma/client";

const extendedClient = prismaClient
  .$extends(profileExtension)
  .$extends(sessionExtension)
  .$extends(verificationCodeExtension)
  .$extends(apiKeyExtension);

export type ExtendedProfile = Prisma.Result<
  typeof extendedClient.profile,
  profileExtensionTypeConfig,
  "findFirstOrThrow"
>;

export type ExtendedSession = Prisma.Result<
  typeof extendedClient.session,
  sessionExtensionTypeConfig,
  "findFirstOrThrow"
>;

export type ExtendedVerificationCode = Prisma.Result<
  typeof extendedClient.verificationCode,
  verificationCodeExtensionTypeConfig,
  "findFirstOrThrow"
>;

export type ExtendedApiKey = Prisma.Result<
  typeof extendedClient.apiKey,
  apiKeyExtensionTypeConfig,
  "findFirstOrThrow"
>;

export default extendedClient;
