import type { PrismaClient, Session } from "@/generated/prisma/client";
import type { DeepMockProxy } from "jest-mock-extended";

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
} from "@controllers/auth/__tests__/helpers";

export {
  MOCK_VERIFICATION_CODE,
  mockVerificationCode,
} from "@controllers/verificationCode/__tests__/helpers";

import { MOCK_PROFILE_ID, MOCK_SESSION_ID, MOCK_USER_AGENT } from "@controllers/__tests__/helpers";

export const mockActiveSession: Session = {
  id: MOCK_SESSION_ID,
  profileId: MOCK_PROFILE_ID,
  scope: "profile:read profile:write",
  userAgent: MOCK_USER_AGENT,
  expiredAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 4),
  endedAt: null,
  createdAt: new Date(),
  updatedAt: new Date(),
};
