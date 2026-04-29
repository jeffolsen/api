import { jest, describe, expect, it, beforeEach } from "@jest/globals";
import { mockReset } from "jest-mock-extended";
import type { DeepMockProxy } from "jest-mock-extended";
import type { PrismaClient, Item, Tag } from "@/generated/prisma/client";
import request from "supertest";
import app from "@/server";
import prisma from "@db/client";
import { BASE_API_URL, ITEM_ROUTES, TAG_ROUTES } from "@config/routes";
import { OK, UNAUTHORIZED } from "@config/errorCodes";
import {
  MOCK_USER_AGENT,
  MOCK_ITEM_ID,
  mockTag,
  mockItem,
  getAuthCookie,
  mockAuth,
} from "./helpers";

jest.mock("@db/client");

const prismaMock = prisma as unknown as DeepMockProxy<PrismaClient>;
const ITEM_TAGS_URL = `${BASE_API_URL}${ITEM_ROUTES}/${MOCK_ITEM_ID}${TAG_ROUTES}`;

beforeEach(() => {
  mockReset(prismaMock);
});

describe("GET /api/items/:itemId/tags", () => {
  it("should return status 401 for unauthorized users", async () => {
    const response = await request(app).get(ITEM_TAGS_URL);
    expect(response.statusCode).toBe(UNAUTHORIZED);
  });

  it("should return status 200 for authorized users", async () => {
    mockAuth(prismaMock);
    prismaMock.item.findUnique.mockResolvedValue(mockItem as unknown as Item);
    prismaMock.tag.findMany.mockResolvedValue([mockTag as unknown as Tag]);

    const response = await request(app)
      .get(ITEM_TAGS_URL)
      .set("Cookie", getAuthCookie())
      .set("User-Agent", MOCK_USER_AGENT);

    expect(response.statusCode).toBe(OK);
  });

  it("should return tags in the response body", async () => {
    mockAuth(prismaMock);
    prismaMock.item.findUnique.mockResolvedValue(mockItem as unknown as Item);
    prismaMock.tag.findMany.mockResolvedValue([mockTag as unknown as Tag]);

    const response = await request(app)
      .get(ITEM_TAGS_URL)
      .set("Cookie", getAuthCookie())
      .set("User-Agent", MOCK_USER_AGENT);

    expect(response.body).toEqual({
      tags: JSON.parse(JSON.stringify([mockTag])),
    });
  });

  it("should filter tags by itemId", async () => {
    mockAuth(prismaMock);
    prismaMock.item.findUnique.mockResolvedValue(mockItem as unknown as Item);
    prismaMock.tag.findMany.mockResolvedValue([mockTag as unknown as Tag]);

    await request(app)
      .get(ITEM_TAGS_URL)
      .set("Cookie", getAuthCookie())
      .set("User-Agent", MOCK_USER_AGENT);

    expect(prismaMock.tag.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { items: { some: { itemId: MOCK_ITEM_ID } } },
      }),
    );
  });
});
