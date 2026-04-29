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
  mockItem,
  getAuthCookie,
  mockAuth,
} from "./helpers";

jest.mock("@db/client");

const prismaMock = prisma as unknown as DeepMockProxy<PrismaClient>;
const ITEM_TAG_URL = `${BASE_API_URL}${ITEM_ROUTES}/${MOCK_ITEM_ID}${TAG_ROUTES}/${MOCK_TAG_ID}`;

beforeEach(() => {
  mockReset(prismaMock);
});

describe("GET /api/items/:itemId/tags/:id", () => {
  it("should return status 401 for unauthorized users", async () => {
    const response = await request(app).get(ITEM_TAG_URL);
    expect(response.statusCode).toBe(UNAUTHORIZED);
  });

  it("should return status 200 for authorized users", async () => {
    mockAuth(prismaMock);
    prismaMock.item.findUnique.mockResolvedValue(mockItem as unknown as Item);
    prismaMock.tag.findUnique.mockResolvedValue(mockTag as unknown as Tag);

    const response = await request(app)
      .get(ITEM_TAG_URL)
      .set("Cookie", getAuthCookie())
      .set("User-Agent", MOCK_USER_AGENT);

    expect(response.statusCode).toBe(OK);
  });

  it("should return the tag in the response body", async () => {
    mockAuth(prismaMock);
    prismaMock.item.findUnique.mockResolvedValue(mockItem as unknown as Item);
    prismaMock.tag.findUnique.mockResolvedValue(mockTag as unknown as Tag);

    const response = await request(app)
      .get(ITEM_TAG_URL)
      .set("Cookie", getAuthCookie())
      .set("User-Agent", MOCK_USER_AGENT);

    expect(response.body).toEqual({
      tag: JSON.parse(JSON.stringify(mockTag)),
    });
  });

  it("should return 404 when the item does not exist", async () => {
    mockAuth(prismaMock);
    prismaMock.item.findUnique.mockResolvedValue(null as unknown as Item);

    const response = await request(app)
      .get(ITEM_TAG_URL)
      .set("Cookie", getAuthCookie())
      .set("User-Agent", MOCK_USER_AGENT);

    expect(response.statusCode).toBe(NOT_FOUND);
  });

  it("should return 404 when the tag does not exist on the item", async () => {
    mockAuth(prismaMock);
    prismaMock.item.findUnique.mockResolvedValue(mockItem as unknown as Item);
    prismaMock.tag.findUnique.mockResolvedValue(null as unknown as Tag);

    const response = await request(app)
      .get(ITEM_TAG_URL)
      .set("Cookie", getAuthCookie())
      .set("User-Agent", MOCK_USER_AGENT);

    expect(response.statusCode).toBe(NOT_FOUND);
  });
});
