import { PrismaClient } from "../generated/prisma/client";
import env from "../config/env";
import profileExtension from "../extensions/profile";
import sessionExtension from "../extensions/session";
import verificationCodeExtension from "../extensions/verificationCode";
import apiKeyExtension from "../extensions/apikey";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

const prismaClient = globalForPrisma.prisma || new PrismaClient();

if (env.NODE_ENV !== "production") globalForPrisma.prisma = prismaClient;

export * from "../generated/prisma/client";

export default prismaClient
  .$extends(profileExtension)
  .$extends(sessionExtension)
  .$extends(verificationCodeExtension)
  .$extends(apiKeyExtension);
