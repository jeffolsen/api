import { jest } from "@jest/globals";
import type { DeepMockProxy } from "jest-mock-extended";
import type { PrismaClient, Item } from "@/generated/prisma/client";

export {
  MOCK_SESSION_ID,
  MOCK_PROFILE_ID,
  MOCK_USER_AGENT,
  mockSession,
  getAuthCookie,
  mockAuth,
} from "@controllers/__tests__/helpers";

export const MOCK_ITEM_ID = 1;

export const mockDateRange = {
  id: 1,
  description: "test date range",
  startAt: new Date(),
  endAt: new Date(),
  itemId: MOCK_ITEM_ID,
  createdAt: new Date(),
  updatedAt: new Date(),
};

export const mockItemWithDateRanges = {
  id: MOCK_ITEM_ID,
  name: "Test Item",
  slug: "test-item-1",
  sortName: "test-item",
  description: null,
  authorId: 1,
  isPrivate: true,
  overrideLink: null,
  publishedAt: null,
  expiredAt: null,
  createdAt: new Date(),
  updatedAt: new Date(),
  dateRanges: [mockDateRange],
};

export const mockAddItemDateRangeTransaction = (
  prismaMock: DeepMockProxy<PrismaClient>,
) => {
  const txItemFindUnique = jest
    .fn<(args: unknown) => Promise<Item | null>>()
    .mockResolvedValue(mockItemWithDateRanges as unknown as Item);
  const txItemUpdate = jest
    .fn<(args: unknown) => Promise<Item>>()
    .mockResolvedValue(mockItemWithDateRanges as unknown as Item);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  prismaMock.$transaction.mockImplementation((callback: any) =>
    callback({
      item: { findUnique: txItemFindUnique, update: txItemUpdate },
    }),
  );

  return { txItemFindUnique, txItemUpdate };
};
