import { jest } from "@jest/globals";
import type { DeepMockProxy } from "jest-mock-extended";
import type { PrismaClient, Item, Tag } from "@/generated/prisma/client";
import { mockItem } from "@controllers/item/__tests__/helpers";

export {
  MOCK_SESSION_ID,
  MOCK_PROFILE_ID,
  MOCK_USER_AGENT,
  mockSession,
  getAuthCookie,
  mockAuth,
} from "@controllers/__tests__/helpers";

export { mockItem } from "@controllers/item/__tests__/helpers";

export const MOCK_ITEM_ID = 1;
export const MOCK_TAG_ID = 1;

export const mockTag = {
  id: MOCK_TAG_ID,
  name: "nature",
  createdAt: new Date(),
  updatedAt: new Date(),
};

export const mockItemTag = {
  itemId: MOCK_ITEM_ID,
  tagId: MOCK_TAG_ID,
};

export const mockItemWithTags = {
  ...mockItem,
  tags: [mockItemTag],
};

export const mockItemTagTransaction = (prismaMock: DeepMockProxy<PrismaClient>) => {
  const txItemFindUnique = jest
    .fn<(args: unknown) => Promise<Item | null>>()
    .mockResolvedValue({ ...mockItem, tags: [] } as unknown as Item);
  const txTagFindUnique = jest
    .fn<(args: unknown) => Promise<Tag | null>>()
    .mockResolvedValue(mockTag as unknown as Tag);
  const txItemUpdate = jest
    .fn<(args: unknown) => Promise<Item>>()
    .mockResolvedValue(mockItem as unknown as Item);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  prismaMock.$transaction.mockImplementation((callback: any) =>
    callback({
      item: { findUnique: txItemFindUnique, update: txItemUpdate },
      tag: { findUnique: txTagFindUnique },
    }),
  );

  return { txItemFindUnique, txTagFindUnique, txItemUpdate };
};
