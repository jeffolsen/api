import { jest, describe, expect, it, beforeEach } from "@jest/globals";
import { mockReset } from "jest-mock-extended";
import type { DeepMockProxy } from "jest-mock-extended";
import type { PrismaClient, Item, Tag } from "@/generated/prisma/client";
import request from "supertest";
import app from "@/server";
import prisma from "@db/client";
import { BASE_API_URL, ITEM_ROUTES } from "@config/routes";
import { BAD_REQUEST, NOT_FOUND, OK, UNAUTHORIZED } from "@config/errorCodes";
import {
  MOCK_USER_AGENT,
  mockItem,
  getAuthCookie,
  mockAuth,
  mockItemTransaction,
} from "./helpers";

jest.mock("@db/client");

const prismaMock = prisma as unknown as DeepMockProxy<PrismaClient>;

beforeEach(() => {
  mockReset(prismaMock);
});

describe("PUT /api/items/:id", () => {
  it("should return status 401 for unauthorized users", async () => {
    const response = await request(app).put(
      `${BASE_API_URL}${ITEM_ROUTES}/${mockItem.id}`,
    );
    expect(response.statusCode).toBe(UNAUTHORIZED);
  });

  it("should return status 200 for authorized users", async () => {
    mockAuth(prismaMock);
    prismaMock.item.findFirst.mockResolvedValue(mockItem as unknown as Item);
    prismaMock.$transaction.mockResolvedValue(mockItem as unknown as Item);

    const response = await request(app)
      .put(`${BASE_API_URL}${ITEM_ROUTES}/${mockItem.id}`)
      .set("Cookie", getAuthCookie())
      .set("User-Agent", MOCK_USER_AGENT)
      .send({ name: "Updated Item" });

    expect(response.statusCode).toBe(OK);
  });

  it("should return the updated item in the response body", async () => {
    mockAuth(prismaMock);
    prismaMock.item.findFirst.mockResolvedValue(mockItem as unknown as Item);
    prismaMock.$transaction.mockResolvedValue(mockItem as unknown as Item);

    const response = await request(app)
      .put(`${BASE_API_URL}${ITEM_ROUTES}/${mockItem.id}`)
      .set("Cookie", getAuthCookie())
      .set("User-Agent", MOCK_USER_AGENT)
      .send({ name: "Updated Item" });

    expect(response.body).toEqual({
      item: JSON.parse(JSON.stringify(mockItem)),
    });
  });

  it("should return 404 when the item does not exist or belongs to another user", async () => {
    mockAuth(prismaMock);
    prismaMock.item.findFirst.mockResolvedValue(null as unknown as Item);

    const response = await request(app)
      .put(`${BASE_API_URL}${ITEM_ROUTES}/${mockItem.id}`)
      .set("Cookie", getAuthCookie())
      .set("User-Agent", MOCK_USER_AGENT)
      .send({ name: "Updated Item" });

    expect(response.statusCode).toBe(NOT_FOUND);
  });

  it("should return 400 when overrideLink does not match a known feed path", async () => {
    mockAuth(prismaMock);
    prismaMock.item.findFirst.mockResolvedValue(mockItem as unknown as Item);
    prismaMock.feed.findFirst.mockResolvedValue(null);

    const response = await request(app)
      .put(`${BASE_API_URL}${ITEM_ROUTES}/${mockItem.id}`)
      .set("Cookie", getAuthCookie())
      .set("User-Agent", MOCK_USER_AGENT)
      .send({ name: "Updated Item", overrideLink: "wrong/link/for/feed" });

    expect(response.statusCode).toBe(BAD_REQUEST);
  });

  it("should replace all tags on the item", async () => {
    const mockTag = { id: 5, name: "nature" };
    mockAuth(prismaMock);
    prismaMock.item.findFirst.mockResolvedValue(mockItem as unknown as Item);

    const { txUpdate, txTagFindMany } = mockItemTransaction(prismaMock);
    txTagFindMany.mockResolvedValue([mockTag as unknown as Tag]);

    await request(app)
      .put(`${BASE_API_URL}${ITEM_ROUTES}/${mockItem.id}`)
      .set("Cookie", getAuthCookie())
      .set("User-Agent", MOCK_USER_AGENT)
      .send({ name: "Updated Item", tagNames: ["nature"] });

    expect(txUpdate).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          tags: {
            deleteMany: {},
            create: [{ tagId: mockTag.id }],
          },
        }),
      }),
    );
  });

  it("should replace all images on the item", async () => {
    mockAuth(prismaMock);
    prismaMock.item.findFirst.mockResolvedValue(mockItem as unknown as Item);

    const { txUpdate } = mockItemTransaction(prismaMock);

    await request(app)
      .put(`${BASE_API_URL}${ITEM_ROUTES}/${mockItem.id}`)
      .set("Cookie", getAuthCookie())
      .set("User-Agent", MOCK_USER_AGENT)
      .send({ name: "Updated Item", imageIds: [5] });

    expect(txUpdate).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          images: {
            deleteMany: {},
            create: [{ imageId: 5 }],
          },
        }),
      }),
    );
  });

  it("should replace all date ranges on the item", async () => {
    const start = new Date();
    const end = new Date(start);
    end.setDate(start.getDate() + 1);

    mockAuth(prismaMock);
    prismaMock.item.findFirst.mockResolvedValue(mockItem as unknown as Item);

    const { txUpdate } = mockItemTransaction(prismaMock);

    await request(app)
      .put(`${BASE_API_URL}${ITEM_ROUTES}/${mockItem.id}`)
      .set("Cookie", getAuthCookie())
      .set("User-Agent", MOCK_USER_AGENT)
      .send({
        name: "Updated Item",
        dateRanges: [
          {
            description: "event description",
            startAt: start,
            endAt: end,
          },
        ],
      });

    expect(txUpdate).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          dateRanges: {
            deleteMany: {},
            create: [
              {
                slug: expect.anything(),
                description: "event description",
                startAt: start.toISOString(),
                endAt: end.toISOString(),
              },
            ],
          },
        }),
      }),
    );
  });

  it("should not update the item slug", async () => {
    mockAuth(prismaMock);
    prismaMock.item.findFirst.mockResolvedValue(mockItem as unknown as Item);

    const { txUpdate } = mockItemTransaction(prismaMock);

    await request(app)
      .put(`${BASE_API_URL}${ITEM_ROUTES}/${mockItem.id}`)
      .set("Cookie", getAuthCookie())
      .set("User-Agent", MOCK_USER_AGENT)
      .send({ name: "Updated Item" });

    expect(txUpdate).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.not.objectContaining({
          slug: expect.anything(),
        }),
      }),
    );
  });
});
