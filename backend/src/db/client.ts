import { PrismaClient } from "../generated/prisma/client";
import env from "../config/env";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

const prismaClient = globalForPrisma.prisma || new PrismaClient();

if (env.NODE_ENV !== "production") globalForPrisma.prisma = prismaClient;

export * from "../generated/prisma/client";
export default prismaClient;
