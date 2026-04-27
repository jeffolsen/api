import { mockDeep, DeepMockProxy } from "jest-mock-extended";
import type { PrismaClient } from "../../generated/prisma/client";

export default mockDeep<PrismaClient>() as DeepMockProxy<PrismaClient>;
