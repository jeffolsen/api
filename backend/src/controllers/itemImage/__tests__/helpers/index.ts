import { jest } from "@jest/globals";
import type { DeepMockProxy } from "jest-mock-extended";
import type { PrismaClient, Item, Image } from "@/generated/prisma/client";
import { ImageType } from "@db/client";
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
export const MOCK_IMAGE_ID = 1;

export const mockImage = {
  id: MOCK_IMAGE_ID,
  url: "https://site.com/image.jpg",
  alt: null,
  type: ImageType.OTHER,
  createdAt: new Date(),
  updatedAt: new Date(),
};

export const mockItemImage = {
  itemId: MOCK_ITEM_ID,
  imageId: MOCK_IMAGE_ID,
};

export const mockItemWithImages = {
  ...mockItem,
  images: [mockItemImage],
};

export const mockAddItemImageTransaction = (prismaMock: DeepMockProxy<PrismaClient>) => {
  const txItemFindUnique = jest
    .fn<(args: unknown) => Promise<Item | null>>()
    .mockResolvedValue({ ...mockItem, images: [] } as unknown as Item);
  const txImageFindUnique = jest
    .fn<(args: unknown) => Promise<Image | null>>()
    .mockResolvedValue(mockImage as unknown as Image);
  const txItemUpdate = jest
    .fn<(args: unknown) => Promise<Item>>()
    .mockResolvedValue(mockItem as unknown as Item);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  prismaMock.$transaction.mockImplementation((callback: any) =>
    callback({
      item: { findUnique: txItemFindUnique, update: txItemUpdate },
      image: { findUnique: txImageFindUnique },
    }),
  );

  return { txItemFindUnique, txImageFindUnique, txItemUpdate };
};

export const mockDeleteItemImageTransaction = (prismaMock: DeepMockProxy<PrismaClient>) => {
  const txItemFindFirst = jest
    .fn<(args: unknown) => Promise<Item | null>>()
    .mockResolvedValue({ ...mockItem, images: [mockItemImage] } as unknown as Item);
  const txItemUpdate = jest
    .fn<(args: unknown) => Promise<Item>>()
    .mockResolvedValue(mockItem as unknown as Item);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  prismaMock.$transaction.mockImplementation((callback: any) =>
    callback({
      item: { findFirst: txItemFindFirst, update: txItemUpdate },
    }),
  );

  return { txItemFindFirst, txItemUpdate };
};
