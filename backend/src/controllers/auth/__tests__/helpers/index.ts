import { jest } from "@jest/globals";
import type { DeepMockProxy } from "jest-mock-extended";
import type {
  PrismaClient,
  Profile,
  ProfileReceipt,
} from "@/generated/prisma/client";
import { signRefreshToken } from "@util/jwt";

export {
  MOCK_SESSION_ID,
  MOCK_PROFILE_ID,
  MOCK_USER_AGENT,
  mockSession,
  getAuthCookie,
  mockAuth,
} from "@controllers/__tests__/helpers";

import {
  MOCK_PROFILE_ID,
  MOCK_SESSION_ID,
  mockSession,
} from "@controllers/__tests__/helpers";

export const getRefreshCookie = () =>
  `refreshToken=${signRefreshToken(MOCK_SESSION_ID)}`;

export const MOCK_EMAIL = "test@example.com";
export const MOCK_PASSWORD = "Password1!";
export const MOCK_VERIFICATION_CODE = "123456";

export const mockProfileReceipt: ProfileReceipt = {
  id: 1,
  profileId: MOCK_PROFILE_ID,
  consentToTermsAt: new Date(),
  consentToPrivacyAt: new Date(),
  verifiedAgeAt: new Date(),
  verifiedEmailAt: null,
  createdAt: new Date(),
  deletedAt: null,
};

export const mockProfile: Profile = {
  id: MOCK_PROFILE_ID,
  email: MOCK_EMAIL,
  password: "$2b$10$hashedpassword",
  createdAt: new Date(),
  updatedAt: new Date(),
};

export const mockProfileWithReceipt = {
  ...mockProfile,
  profileReceipt: mockProfileReceipt,
};

export const mockSessionWithProfile = {
  ...mockSession,
  profile: mockProfile,
};

export const mockRegisterTransaction = (
  prismaMock: DeepMockProxy<PrismaClient>,
  { emailTaken = false } = {},
) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  prismaMock.$transaction.mockImplementation((callback: any) =>
    callback({
      profile: {
        findUnique: jest
          .fn<(args: unknown) => Promise<Profile | null>>()
          .mockResolvedValue(emailTaken ? mockProfile : null),
        create: jest
          .fn<(args: unknown) => Promise<Profile>>()
          .mockResolvedValue(mockProfile),
      },
    }),
  );
};
