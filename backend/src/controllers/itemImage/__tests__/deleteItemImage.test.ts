import { jest, describe, expect, it, beforeEach } from "@jest/globals";
import { mockReset } from "jest-mock-extended";
import type { DeepMockProxy } from "jest-mock-extended";
import type { PrismaClient, Item } from "@/generated/prisma/client";
import request from "supertest";
import app from "@/server";
import prisma from "@db/client";
import { BASE_API_URL, ITEM_ROUTES, IMAGE_ROUTES } from "@config/routes";
import { NOT_FOUND, OK, UNAUTHORIZED } from "@config/errorCodes";
import {
  MOCK_USER_AGENT,
  MOCK_ITEM_ID,
  MOCK_IMAGE_ID,
  mockItem,
  getAuthCookie,
  mockAuth,
  mockDeleteItemImageTransaction,
} from "./helpers";

jest.mock("@db/client");

const prismaMock = prisma as unknown as DeepMockProxy<PrismaClient>;
const ITEM_IMAGE_URL = `${BASE_API_URL}${ITEM_ROUTES}/${MOCK_ITEM_ID}${IMAGE_ROUTES}/${MOCK_IMAGE_ID}`;

beforeEach(() => {
  mockReset(prismaMock);
});

describe("DELETE /api/items/:itemId/images/:id", () => {
  it("should return status 401 for unauthorized users", async () => {
    const response = await request(app).delete(ITEM_IMAGE_URL);
    expect(response.statusCode).toBe(UNAUTHORIZED);
  });

  it("should return status 200 for authorized users", async () => {
    mockAuth(prismaMock);
    mockDeleteItemImageTransaction(prismaMock);

    const response = await request(app)
      .delete(ITEM_IMAGE_URL)
      .set("Cookie", getAuthCookie())
      .set("User-Agent", MOCK_USER_AGENT);

    expect(response.statusCode).toBe(OK);
  });

  it("should return 404 when the item does not exist or belongs to another user", async () => {
    mockAuth(prismaMock);
    const { txItemFindFirst } = mockDeleteItemImageTransaction(prismaMock);
    txItemFindFirst.mockResolvedValue(null);

    const response = await request(app)
      .delete(ITEM_IMAGE_URL)
      .set("Cookie", getAuthCookie())
      .set("User-Agent", MOCK_USER_AGENT);

    expect(response.statusCode).toBe(NOT_FOUND);
  });

  it("should return 404 when the image is not on the item", async () => {
    mockAuth(prismaMock);
    const { txItemFindFirst } = mockDeleteItemImageTransaction(prismaMock);
    txItemFindFirst.mockResolvedValue({
      ...mockItem,
      images: [],
    } as unknown as Item);

    const response = await request(app)
      .delete(ITEM_IMAGE_URL)
      .set("Cookie", getAuthCookie())
      .set("User-Agent", MOCK_USER_AGENT);

    expect(response.statusCode).toBe(NOT_FOUND);
  });

  it("should call item.update with a disconnect for the correct image", async () => {
    mockAuth(prismaMock);
    const { txItemUpdate } = mockDeleteItemImageTransaction(prismaMock);

    await request(app)
      .delete(ITEM_IMAGE_URL)
      .set("Cookie", getAuthCookie())
      .set("User-Agent", MOCK_USER_AGENT);

    expect(txItemUpdate).toHaveBeenCalledWith(
      expect.objectContaining({
        data: {
          images: {
            disconnect: {
              itemId_imageId: { itemId: MOCK_ITEM_ID, imageId: MOCK_IMAGE_ID },
            },
          },
        },
      }),
    );
  });
});
