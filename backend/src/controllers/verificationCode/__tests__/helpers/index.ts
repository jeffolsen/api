import type { DeepMockProxy } from "jest-mock-extended";
import type { PrismaClient, VerificationCode } from "@/generated/prisma/client";
import { CodeType } from "@/db/client";

export {
  MOCK_SESSION_ID,
  MOCK_PROFILE_ID,
  MOCK_USER_AGENT,
  mockSession,
  getAuthCookie,
  mockAuth,
} from "@controllers/__tests__/helpers";

export {
  MOCK_EMAIL,
  MOCK_PASSWORD,
  mockProfile,
  mockProfileWithReceipt,
} from "@controllers/auth/__tests__/helpers";

import { MOCK_PROFILE_ID } from "@controllers/__tests__/helpers";

export const MOCK_VERIFICATION_CODE = "123456";

export const mockVerificationCode: VerificationCode = {
  id: 1,
  profileId: MOCK_PROFILE_ID,
  type: CodeType.LOGIN,
  value: "$2b$10$hashedcode",
  userAgent: "test-agent",
  usedAt: null,
  expiredAt: new Date(Date.now() + 1000 * 60 * 60 * 8),
  createdAt: new Date(),
  updatedAt: new Date(),
};
