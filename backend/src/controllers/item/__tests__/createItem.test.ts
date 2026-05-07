import { jest, describe, expect, it, beforeEach } from "@jest/globals";
import { mockReset } from "jest-mock-extended";
import type { DeepMockProxy } from "jest-mock-extended";
import type { PrismaClient, Item, Tag } from "@/generated/prisma/client";
import request from "supertest";
import app from "@/server";
import prisma from "@db/client";
import { BASE_API_URL, ITEM_ROUTES } from "@config/routes";
import { BAD_REQUEST, OK, UNAUTHORIZED } from "@config/errorCodes";
import {
  MOCK_USER_AGENT,
  mockItem,
  mockSession,
  getAuthCookie,
  mockAuth,
  mockItemTransaction,
} from "./helpers";

jest.mock("@db/client");

const prismaMock = prisma as unknown as DeepMockProxy<PrismaClient>;

beforeEach(() => {
  mockReset(prismaMock);
});

describe("POST /api/items", () => {
  it("should return status 401 for unauthorized users", async () => {
    const response = await request(app).post(BASE_API_URL + ITEM_ROUTES);
    expect(response.statusCode).toBe(UNAUTHORIZED);
  });

  it("should return status 200 for authorized users", async () => {
    mockAuth(prismaMock);
    prismaMock.$transaction.mockResolvedValue(mockItem as unknown as Item);

    const response = await request(app)
      .post(BASE_API_URL + ITEM_ROUTES)
      .set("Cookie", getAuthCookie())
      .set("User-Agent", MOCK_USER_AGENT)
      .send({ name: "Test Item" });

    expect(response.statusCode).toBe(OK);
  });

  it("should return the created item in the response body", async () => {
    mockAuth(prismaMock);
    prismaMock.$transaction.mockResolvedValue(mockItem as unknown as Item);

    const response = await request(app)
      .post(BASE_API_URL + ITEM_ROUTES)
      .set("Cookie", getAuthCookie())
      .set("User-Agent", MOCK_USER_AGENT)
      .send({ name: "Test Item" });

    expect(response.body).toEqual({
      item: JSON.parse(JSON.stringify(mockItem)),
    });
  });

  it("should create the item with isPrivate set to true", async () => {
    mockAuth(prismaMock);
    const { txCreate } = mockItemTransaction(prismaMock);

    await request(app)
      .post(BASE_API_URL + ITEM_ROUTES)
      .set("Cookie", getAuthCookie())
      .set("User-Agent", MOCK_USER_AGENT)
      .send({ name: "Test Item" });

    expect(txCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          isPrivate: true,
        }),
      }),
    );
  });

  it("should create the item with the correct sortName", async () => {
    mockAuth(prismaMock);
    const { txCreate } = mockItemTransaction(prismaMock);

    await request(app)
      .post(BASE_API_URL + ITEM_ROUTES)
      .set("Cookie", getAuthCookie())
      .set("User-Agent", MOCK_USER_AGENT)
      .send({ name: "Test Item" });

    expect(txCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          sortName: "test-item",
        }),
      }),
    );
  });

  it("should create the item with the correct slug", async () => {
    const lastItemRecord = { ...mockItem, id: 99 };
    const nextItem = { ...mockItem, id: 100, slug: "test-item-two-100" };

    mockAuth(prismaMock);
    const { txCreate, txFindFirst } = mockItemTransaction(prismaMock);
    txFindFirst.mockResolvedValue(lastItemRecord as unknown as Item);
    txCreate.mockResolvedValue(nextItem as unknown as Item);

    await request(app)
      .post(BASE_API_URL + ITEM_ROUTES)
      .set("Cookie", getAuthCookie())
      .set("User-Agent", MOCK_USER_AGENT)
      .send({ name: "Test Item 2" });

    expect(txCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          slug: "test-item-two-100",
        }),
      }),
    );
  });

  it("should set authorId to the authenticated user's profileId", async () => {
    mockAuth(prismaMock);
    const { txCreate } = mockItemTransaction(prismaMock);

    await request(app)
      .post(BASE_API_URL + ITEM_ROUTES)
      .set("Cookie", getAuthCookie())
      .set("User-Agent", MOCK_USER_AGENT)
      .send({ name: "Test Item" });

    expect(txCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          authorId: mockSession.profileId,
        }),
      }),
    );
  });

  it("should return 400 when overrideLink does not match a known feed path", async () => {
    mockAuth(prismaMock);
    prismaMock.feed.findFirst.mockResolvedValue(null);

    const response = await request(app)
      .post(BASE_API_URL + ITEM_ROUTES)
      .set("Cookie", getAuthCookie())
      .set("User-Agent", MOCK_USER_AGENT)
      .send({ name: "Test Item", overrideLink: "wrong/link/for/feed" });

    expect(response.statusCode).toBe(BAD_REQUEST);
  });

  it("should associate provided tags with the created item", async () => {
    const mockTag = { id: 5, name: "nature" };

    mockAuth(prismaMock);
    const { txCreate, txTagFindMany } = mockItemTransaction(prismaMock);
    txTagFindMany.mockResolvedValue([mockTag as unknown as Tag]);

    await request(app)
      .post(BASE_API_URL + ITEM_ROUTES)
      .set("Cookie", getAuthCookie())
      .set("User-Agent", MOCK_USER_AGENT)
      .send({ name: "Test Item", tagNames: ["nature"] });

    expect(txCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          tags: {
            create: [{ tagId: mockTag.id }],
          },
        }),
      }),
    );
  });

  it("should associate provided images with the created item", async () => {
    mockAuth(prismaMock);
    const { txCreate } = mockItemTransaction(prismaMock);

    await request(app)
      .post(BASE_API_URL + ITEM_ROUTES)
      .set("Cookie", getAuthCookie())
      .set("User-Agent", MOCK_USER_AGENT)
      .send({ name: "Test Item", imageIds: [5] });

    expect(txCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          images: {
            create: [{ imageId: 5 }],
          },
        }),
      }),
    );
  });

  it("should associate provided date ranges with the created item", async () => {
    const start = new Date();
    const end = new Date(start);
    end.setDate(start.getDate() + 1);

    mockAuth(prismaMock);
    const { txCreate } = mockItemTransaction(prismaMock);

    await request(app)
      .post(BASE_API_URL + ITEM_ROUTES)
      .set("Cookie", getAuthCookie())
      .set("User-Agent", MOCK_USER_AGENT)
      .send({
        name: "Test Item",
        dateRanges: [
          {
            description: "event description",
            startAt: start,
            endAt: end,
          },
        ],
      });

    expect(txCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          dateRanges: {
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
});
