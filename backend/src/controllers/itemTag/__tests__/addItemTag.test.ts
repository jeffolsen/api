import { jest, describe, expect, it, beforeEach } from "@jest/globals";
import { mockReset } from "jest-mock-extended";
import type { DeepMockProxy } from "jest-mock-extended";
import type { PrismaClient, Item, Tag } from "@/generated/prisma/client";
import request from "supertest";
import app from "@/server";
import prisma from "@db/client";
import { BASE_API_URL, ITEM_ROUTES, TAG_ROUTES } from "@config/routes";
import { BAD_REQUEST, NOT_FOUND, OK, UNAUTHORIZED } from "@config/errorCodes";
import {
  MOCK_USER_AGENT,
  MOCK_ITEM_ID,
  MOCK_TAG_ID,
  mockTag,
  mockItemTag,
  mockItem,
  getAuthCookie,
  mockAuth,
  mockItemTagTransaction,
} from "./helpers";

jest.mock("@db/client");

const prismaMock = prisma as unknown as DeepMockProxy<PrismaClient>;
const ITEM_TAGS_URL = `${BASE_API_URL}${ITEM_ROUTES}/${MOCK_ITEM_ID}${TAG_ROUTES}`;

beforeEach(() => {
  mockReset(prismaMock);
});

describe("POST /api/items/:itemId/tags", () => {
  it("should return status 401 for unauthorized users", async () => {
    const response = await request(app).post(ITEM_TAGS_URL);
    expect(response.statusCode).toBe(UNAUTHORIZED);
  });

  it("should return 400 when neither id nor name is provided", async () => {
    mockAuth(prismaMock);

    const response = await request(app)
      .post(ITEM_TAGS_URL)
      .set("Cookie", getAuthCookie())
      .set("User-Agent", MOCK_USER_AGENT)
      .send({});

    expect(response.statusCode).toBe(BAD_REQUEST);
  });

  it("should return status 200 when adding a tag by id", async () => {
    mockAuth(prismaMock);
    mockItemTagTransaction(prismaMock);

    const response = await request(app)
      .post(ITEM_TAGS_URL)
      .set("Cookie", getAuthCookie())
      .set("User-Agent", MOCK_USER_AGENT)
      .send({ id: String(MOCK_TAG_ID) });

    expect(response.statusCode).toBe(OK);
  });

  it("should return status 200 when adding a tag by name", async () => {
    mockAuth(prismaMock);
    mockItemTagTransaction(prismaMock);

    const response = await request(app)
      .post(ITEM_TAGS_URL)
      .set("Cookie", getAuthCookie())
      .set("User-Agent", MOCK_USER_AGENT)
      .send({ name: mockTag.name });

    expect(response.statusCode).toBe(OK);
  });

  it("should return 404 when the item does not exist or belongs to another user", async () => {
    mockAuth(prismaMock);
    const { txItemFindUnique } = mockItemTagTransaction(prismaMock);
    txItemFindUnique.mockResolvedValue(null);

    const response = await request(app)
      .post(ITEM_TAGS_URL)
      .set("Cookie", getAuthCookie())
      .set("User-Agent", MOCK_USER_AGENT)
      .send({ name: mockTag.name });

    expect(response.statusCode).toBe(NOT_FOUND);
  });

  it("should return 404 when the tag does not exist", async () => {
    mockAuth(prismaMock);
    const { txTagFindUnique } = mockItemTagTransaction(prismaMock);
    txTagFindUnique.mockResolvedValue(null);

    const response = await request(app)
      .post(ITEM_TAGS_URL)
      .set("Cookie", getAuthCookie())
      .set("User-Agent", MOCK_USER_AGENT)
      .send({ name: mockTag.name });

    expect(response.statusCode).toBe(NOT_FOUND);
  });

  it("should return 400 when the tag is already on the item", async () => {
    mockAuth(prismaMock);
    const { txItemFindUnique } = mockItemTagTransaction(prismaMock);
    txItemFindUnique.mockResolvedValue({
      ...mockItem,
      tags: [mockItemTag],
    } as unknown as Item);

    const response = await request(app)
      .post(ITEM_TAGS_URL)
      .set("Cookie", getAuthCookie())
      .set("User-Agent", MOCK_USER_AGENT)
      .send({ id: String(MOCK_TAG_ID) });

    expect(response.statusCode).toBe(BAD_REQUEST);
  });

  it("should call item.update with the correct tagId", async () => {
    mockAuth(prismaMock);
    const { txItemUpdate } = mockItemTagTransaction(prismaMock);

    await request(app)
      .post(ITEM_TAGS_URL)
      .set("Cookie", getAuthCookie())
      .set("User-Agent", MOCK_USER_AGENT)
      .send({ id: String(MOCK_TAG_ID) });

    expect(txItemUpdate).toHaveBeenCalledWith(
      expect.objectContaining({
        data: { tags: { create: { tagId: MOCK_TAG_ID } } },
      }),
    );
  });
});
