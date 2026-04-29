import { jest, describe, expect, it, beforeEach } from "@jest/globals";
import { mockReset } from "jest-mock-extended";
import type { DeepMockProxy } from "jest-mock-extended";
import type { PrismaClient, Item, Tag } from "@/generated/prisma/client";
import request from "supertest";
import app from "@/server";
import prisma from "@db/client";
import { BASE_API_URL, ITEM_ROUTES, TAG_ROUTES } from "@config/routes";
import { NOT_FOUND, OK, UNAUTHORIZED } from "@config/errorCodes";
import {
  MOCK_USER_AGENT,
  MOCK_ITEM_ID,
  MOCK_TAG_ID,
  mockTag,
  mockItemWithTags,
  getAuthCookie,
  mockAuth,
} from "./helpers";

jest.mock("@db/client");

const prismaMock = prisma as unknown as DeepMockProxy<PrismaClient>;
const ITEM_TAG_URL = `${BASE_API_URL}${ITEM_ROUTES}/${MOCK_ITEM_ID}${TAG_ROUTES}/${MOCK_TAG_ID}`;

beforeEach(() => {
  mockReset(prismaMock);
});

describe("DELETE /api/items/:itemId/tags/:id", () => {
  it("should return status 401 for unauthorized users", async () => {
    const response = await request(app).delete(ITEM_TAG_URL);
    expect(response.statusCode).toBe(UNAUTHORIZED);
  });

  it("should return status 200 for authorized users", async () => {
    mockAuth(prismaMock);
    prismaMock.item.findFirst.mockResolvedValue(
      mockItemWithTags as unknown as Item,
    );
    prismaMock.tag.findUnique.mockResolvedValue(mockTag as unknown as Tag);

    const response = await request(app)
      .delete(ITEM_TAG_URL)
      .set("Cookie", getAuthCookie())
      .set("User-Agent", MOCK_USER_AGENT);

    expect(response.statusCode).toBe(OK);
  });

  it("should return 404 when the item does not exist or belongs to another user", async () => {
    mockAuth(prismaMock);
    prismaMock.item.findFirst.mockResolvedValue(null as unknown as Item);

    const response = await request(app)
      .delete(ITEM_TAG_URL)
      .set("Cookie", getAuthCookie())
      .set("User-Agent", MOCK_USER_AGENT);

    expect(response.statusCode).toBe(NOT_FOUND);
  });

  it("should return 404 when the tag is not on the item", async () => {
    mockAuth(prismaMock);
    prismaMock.item.findFirst.mockResolvedValue({
      ...mockItemWithTags,
      tags: [],
    } as unknown as Item);

    const response = await request(app)
      .delete(ITEM_TAG_URL)
      .set("Cookie", getAuthCookie())
      .set("User-Agent", MOCK_USER_AGENT);

    expect(response.statusCode).toBe(NOT_FOUND);
  });

  it("should call item.update with a disconnect for the correct tag", async () => {
    mockAuth(prismaMock);
    prismaMock.item.findFirst.mockResolvedValue(
      mockItemWithTags as unknown as Item,
    );
    prismaMock.tag.findUnique.mockResolvedValue(mockTag as unknown as Tag);

    await request(app)
      .delete(ITEM_TAG_URL)
      .set("Cookie", getAuthCookie())
      .set("User-Agent", MOCK_USER_AGENT);

    expect(prismaMock.item.update).toHaveBeenCalledWith(
      expect.objectContaining({
        data: {
          tags: {
            disconnect: {
              itemId_tagId: { itemId: MOCK_ITEM_ID, tagId: MOCK_TAG_ID },
            },
          },
        },
      }),
    );
  });
});
