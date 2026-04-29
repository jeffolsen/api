import { jest } from "@jest/globals";
import type { DeepMockProxy } from "jest-mock-extended";
import type { PrismaClient, Item, Tag } from "@/generated/prisma/client";
import { SubjectType } from "@/db/client";

export {
  MOCK_SESSION_ID,
  MOCK_PROFILE_ID,
  MOCK_USER_AGENT,
  mockSession,
  getAuthCookie,
  mockAuth,
} from "@controllers/__tests__/helpers";

import { MOCK_PROFILE_ID } from "@controllers/__tests__/helpers";

export const mockItem = {
  id: 1,
  name: "Test Item",
  slug: "test-item-1",
  sortName: "test-item",
  description: null,
  authorId: MOCK_PROFILE_ID,
  isPrivate: true,
  overrideLink: null,
  publishedAt: null,
  expiredAt: null,
  createdAt: new Date(),
  updatedAt: new Date(),
};

export const mockFeed = {
  id: 1,
  path: "path/to/feed",
  subjectType: SubjectType.COLLECTION,
  profileId: MOCK_PROFILE_ID,
  publishedAt: null,
  expiredAt: null,
  createdAt: new Date(),
  updatedAt: new Date(),
};

export const mockItemTransaction = (
  prismaMock: DeepMockProxy<PrismaClient>,
) => {
  const txCreate = jest
    .fn<(args: unknown) => Promise<Item>>()
    .mockResolvedValue(mockItem as unknown as Item);
  const txFindFirst = jest
    .fn<(args: unknown) => Promise<Item | null>>()
    .mockResolvedValue(null);
  const txUpdate = jest
    .fn<(args: unknown) => Promise<Item>>()
    .mockResolvedValue(mockItem as unknown as Item);
  const txTagFindMany = jest
    .fn<(args: unknown) => Promise<Tag[]>>()
    .mockResolvedValue([]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  prismaMock.$transaction.mockImplementation((callback: any) =>
    callback({
      item: { findFirst: txFindFirst, create: txCreate, update: txUpdate },
      tag: { findMany: txTagFindMany },
    }),
  );

  return { txCreate, txFindFirst, txUpdate, txTagFindMany };
};
