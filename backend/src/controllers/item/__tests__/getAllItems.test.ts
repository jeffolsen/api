import { jest, describe, expect, it, beforeEach } from "@jest/globals";
import { mockReset } from "jest-mock-extended";
import type { DeepMockProxy } from "jest-mock-extended";
import type { PrismaClient, Item } from "@/generated/prisma/client";
import request from "supertest";
import app from "@/server";
import prisma from "@db/client";
import { BASE_API_URL, ITEM_ROUTES } from "@config/routes";
import { OK, UNAUTHORIZED } from "@config/errorCodes";
import {
  MOCK_USER_AGENT,
  getAuthCookie,
  mockAuth,
  mockItem,
  mockSession,
} from "./helpers";

jest.mock("@db/client");

const prismaMock = prisma as unknown as DeepMockProxy<PrismaClient>;

beforeEach(() => {
  mockReset(prismaMock);
});

describe("GET /api/items", () => {
  it("should return status 401 for unauthorized users", async () => {
    const response = await request(app).get(BASE_API_URL + ITEM_ROUTES);
    expect(response.statusCode).toBe(UNAUTHORIZED);
  });

  it("should return status 200 for authorized users", async () => {
    mockAuth(prismaMock);
    prismaMock.$transaction.mockResolvedValue([[], 0] as unknown as [
      Item[],
      number,
    ]);

    const response = await request(app)
      .get(BASE_API_URL + ITEM_ROUTES)
      .set("Cookie", getAuthCookie())
      .set("User-Agent", MOCK_USER_AGENT);

    expect(response.statusCode).toBe(OK);
  });

  it("should return items and totalCount in the response body", async () => {
    mockAuth(prismaMock);
    prismaMock.$transaction.mockResolvedValue([[], 0] as unknown as [
      Item[],
      number,
    ]);

    const response = await request(app)
      .get(BASE_API_URL + ITEM_ROUTES)
      .set("Cookie", getAuthCookie())
      .set("User-Agent", MOCK_USER_AGENT);

    expect(response.body).toEqual({
      items: [],
      totalCount: 0,
    });
  });

  it("should include public items and the user's own private items by default", async () => {
    const publicItem = {
      ...mockItem,
      authorId: 50,
      isPrivate: false,
    };
    mockAuth(prismaMock);
    prismaMock.$transaction.mockResolvedValue([
      [publicItem, mockItem],
      2,
    ] as unknown as [Item[], number]);

    const response = await request(app)
      .get(BASE_API_URL + ITEM_ROUTES)
      .set("Cookie", getAuthCookie())
      .set("User-Agent", MOCK_USER_AGENT);

    expect(response.body).toEqual({
      items: JSON.parse(JSON.stringify([publicItem, mockItem])),
      totalCount: 2,
    });
  });

  it("should return only published but not expired items when liveOnly=true", async () => {
    const published = new Date();
    const expired = new Date(published);
    expired.setDate(published.getDate() + 7);

    const publishedItem = {
      ...mockItem,
      publishedAt: published,
      expiredAt: expired,
    };
    mockAuth(prismaMock);
    prismaMock.$transaction.mockResolvedValue([
      [publishedItem],
      1,
    ] as unknown as [Item[], number]);

    const response = await request(app)
      .get(BASE_API_URL + ITEM_ROUTES)
      .query({ liveOnly: "true" })
      .set("Cookie", getAuthCookie())
      .set("User-Agent", MOCK_USER_AGENT);

    expect(prismaMock.item.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          AND: [
            {
              publishedAt: { lte: expect.any(Date) },
              OR: [
                {
                  expiredAt: {
                    equals: null,
                  },
                },
                {
                  expiredAt: {
                    gt: expect.any(Date),
                  },
                },
              ],
            },
          ],
        }),
      }),
    );

    expect(response.body).toEqual({
      items: JSON.parse(JSON.stringify([publishedItem])),
      totalCount: 1,
    });
  });

  it("should return only the user's own items when privateOnly=true", async () => {
    mockAuth(prismaMock);
    prismaMock.$transaction.mockResolvedValue([[mockItem], 1] as unknown as [
      Item[],
      number,
    ]);

    const response = await request(app)
      .get(BASE_API_URL + ITEM_ROUTES)
      .query({ privateOnly: "true" })
      .set("Cookie", getAuthCookie())
      .set("User-Agent", MOCK_USER_AGENT);

    expect(prismaMock.item.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          authorId: mockSession.profileId,
        }),
      }),
    );

    expect(response.body).toEqual({
      items: JSON.parse(JSON.stringify([mockItem])),
      totalCount: 1,
    });
  });

  it("should filter items by ids", async () => {
    const secondItem = {
      ...mockItem,
      id: 5,
    };
    mockAuth(prismaMock);
    prismaMock.$transaction.mockResolvedValue([
      [mockItem, secondItem],
      2,
    ] as unknown as [Item[], number]);

    const response = await request(app)
      .get(BASE_API_URL + ITEM_ROUTES)
      .query({ ids: "1,5" })
      .set("Cookie", getAuthCookie())
      .set("User-Agent", MOCK_USER_AGENT);

    expect(prismaMock.item.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          id: { in: [1, 5] },
        }),
      }),
    );

    expect(response.body).toEqual({
      items: JSON.parse(JSON.stringify([mockItem, secondItem])),
      totalCount: 2,
    });
  });

  it("should filter items by tag names", async () => {
    mockAuth(prismaMock);
    prismaMock.$transaction.mockResolvedValue([[mockItem], 1] as unknown as [
      Item[],
      number,
    ]);

    const response = await request(app)
      .get(BASE_API_URL + ITEM_ROUTES)
      .query({ tags: "nature" })
      .set("Cookie", getAuthCookie())
      .set("User-Agent", MOCK_USER_AGENT);

    expect(prismaMock.item.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          tags: {
            some: {
              tag: {
                name: { in: ["nature"] },
              },
            },
          },
        }),
      }),
    );

    expect(response.body).toEqual({
      items: JSON.parse(JSON.stringify([mockItem])),
      totalCount: 1,
    });
  });

  it("should filter items by search name", async () => {
    const searchNameItem = {
      ...mockItem,
      name: "Search my item name",
    };
    mockAuth(prismaMock);
    prismaMock.$transaction.mockResolvedValue([
      [searchNameItem],
      1,
    ] as unknown as [Item[], number]);

    const response = await request(app)
      .get(BASE_API_URL + ITEM_ROUTES)
      .query({ searchName: "Search my" })
      .set("Cookie", getAuthCookie())
      .set("User-Agent", MOCK_USER_AGENT);

    expect(prismaMock.item.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          name: {
            contains: "Search my",
            mode: "insensitive",
          },
        }),
      }),
    );

    expect(response.body).toEqual({
      items: JSON.parse(JSON.stringify([searchNameItem])),
      totalCount: 1,
    });
  });

  it("should support pagination via page and pageSize", async () => {
    const itemTwo = {
      ...mockItem,
      id: 2,
    };
    mockAuth(prismaMock);
    prismaMock.$transaction.mockResolvedValue([[itemTwo], 1] as unknown as [
      Item[],
      number,
    ]);

    const response = await request(app)
      .get(BASE_API_URL + ITEM_ROUTES)
      .query({ page: 2, pageSize: 1 })
      .set("Cookie", getAuthCookie())
      .set("User-Agent", MOCK_USER_AGENT);

    expect(prismaMock.item.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        skip: 1,
        take: 1,
      }),
    );

    expect(response.body).toEqual({
      items: JSON.parse(JSON.stringify([itemTwo])),
      totalCount: 1,
    });
  });

  it("should return an empty items array when no items match", async () => {
    mockAuth(prismaMock);
    prismaMock.$transaction.mockResolvedValue([[], 0] as unknown as [
      Item[],
      number,
    ]);

    const response = await request(app)
      .get(BASE_API_URL + ITEM_ROUTES)
      .query({ searchName: "nothing has a name like this" })
      .set("Cookie", getAuthCookie())
      .set("User-Agent", MOCK_USER_AGENT);

    expect(response.body).toEqual({
      items: JSON.parse(JSON.stringify([])),
      totalCount: 0,
    });
  });
});
