import type { DeepMockProxy } from "jest-mock-extended";
import type { PrismaClient, Session } from "@/generated/prisma/client";
import { getScope, PROFILE_SESSION } from "@util/scope";
import { signAccessToken } from "@util/jwt";

export const MOCK_SESSION_ID = 1;
export const MOCK_PROFILE_ID = 1;
export const MOCK_USER_AGENT = "test-agent";

export const mockSession = {
  id: MOCK_SESSION_ID,
  profileId: MOCK_PROFILE_ID,
  scope: getScope(PROFILE_SESSION),
  userAgent: MOCK_USER_AGENT,
  expiredAt: new Date(Date.now() + 1000 * 60 * 60 * 24),
  endedAt: null,
};

export const getAuthCookie = () =>
  `accessToken=${signAccessToken(MOCK_SESSION_ID)}`;

export const mockAuth = (prismaMock: DeepMockProxy<PrismaClient>) => {
  prismaMock.session.findUnique.mockResolvedValue(
    mockSession as unknown as Session,
  );
};
