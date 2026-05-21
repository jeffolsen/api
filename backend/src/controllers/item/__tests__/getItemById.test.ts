import { jest, describe, expect, it, beforeEach } from "@jest/globals";
import { mockReset } from "jest-mock-extended";
import type { DeepMockProxy } from "jest-mock-extended";
import type { PrismaClient, Item } from "@/generated/prisma/client";
import request from "supertest";
import app from "@/server";
import prisma from "@db/client";
import { BASE_API_URL, ITEM_ROUTES } from "@config/routes";
import { NOT_FOUND, OK, UNAUTHORIZED } from "@config/errorCodes";
import {
  MOCK_USER_AGENT,
  mockSession,
  mockItem,
  getAuthCookie,
  mockAuth,
} from "./helpers";

jest.mock("@db/client");

const prismaMock = prisma as unknown as DeepMockProxy<PrismaClient>;

beforeEach(() => {
  mockReset(prismaMock);
});

describe("GET /api/items/:id", () => {
  it("should return status 401 for unauthorized users", async () => {
    const response = await request(app).get(
      `${BASE_API_URL}${ITEM_ROUTES}/${mockItem.id}`,
    );
    expect(response.statusCode).toBe(UNAUTHORIZED);
  });

  it("should return status 200 for authorized users", async () => {
    mockAuth(prismaMock);
    prismaMock.item.findUnique.mockResolvedValue(mockItem as unknown as Item);

    const response = await request(app)
      .get(`${BASE_API_URL}${ITEM_ROUTES}/${mockItem.id}`)
      .set("Cookie", getAuthCookie())
      .set("User-Agent", MOCK_USER_AGENT);

    expect(response.statusCode).toBe(OK);
  });

  it("should return the item in the response body", async () => {
    mockAuth(prismaMock);
    prismaMock.item.findUnique.mockResolvedValue(mockItem as unknown as Item);

    const response = await request(app)
      .get(`${BASE_API_URL}${ITEM_ROUTES}/${mockItem.id}`)
      .set("Cookie", getAuthCookie())
      .set("User-Agent", MOCK_USER_AGENT);

    expect(response.body).toEqual({
      item: JSON.parse(JSON.stringify(mockItem)),
    });
  });

  it("should return 404 when the item does not exist", async () => {
    mockAuth(prismaMock);
    prismaMock.item.findUnique.mockResolvedValue(null as unknown as Item);

    const response = await request(app)
      .get(`${BASE_API_URL}${ITEM_ROUTES}/${mockItem.id}`)
      .set("Cookie", getAuthCookie())
      .set("User-Agent", MOCK_USER_AGENT);

    expect(response.statusCode).toBe(NOT_FOUND);
  });

  it("should return 404 when the item is private and belongs to another user", async () => {
    mockAuth(prismaMock);
    const find = prismaMock.item.findUnique.mockResolvedValue(
      null as unknown as Item,
    );

    const response = await request(app)
      .get(`${BASE_API_URL}${ITEM_ROUTES}/${mockItem.id}`)
      .set("Cookie", getAuthCookie())
      .set("User-Agent", MOCK_USER_AGENT);

    expect(find).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          OR: [{ isPrivate: false }, { authorId: mockSession.profileId }],
        }),
      }),
    );

    expect(response.statusCode).toBe(NOT_FOUND);
  });

  it("should return 200 for a public item not owned by the requesting user", async () => {
    const otherUsersItem = {
      ...mockItem,
      authorId: 50,
      isPrivate: false,
    };
    mockAuth(prismaMock);
    const find = prismaMock.item.findUnique.mockResolvedValue(
      otherUsersItem as unknown as Item,
    );

    const response = await request(app)
      .get(`${BASE_API_URL}${ITEM_ROUTES}/${mockItem.id}`)
      .set("Cookie", getAuthCookie())
      .set("User-Agent", MOCK_USER_AGENT);

    expect(find).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          OR: [{ isPrivate: false }, { authorId: mockSession.profileId }],
        }),
      }),
    );

    expect(response.statusCode).toBe(OK);
  });

  it("should include related tags when requested via query param", async () => {
    const itemWithTags = {
      ...mockItem,
      tags: [{ id: 4, name: "nature" }],
    };
    mockAuth(prismaMock);
    const find = prismaMock.item.findUnique.mockResolvedValue(
      itemWithTags as unknown as Item,
    );

    const response = await request(app)
      .get(`${BASE_API_URL}${ITEM_ROUTES}/${mockItem.id}`)
      .query({ includes: "tags" })
      .set("Cookie", getAuthCookie())
      .set("User-Agent", MOCK_USER_AGENT);

    expect(find).toHaveBeenCalledWith(
      expect.objectContaining({
        include: expect.objectContaining({
          tags: { include: { tag: true } },
        }),
      }),
    );

    expect(response.body).toEqual({
      item: JSON.parse(JSON.stringify(itemWithTags)),
    });
  });

  it("should include related images when requested via query param", async () => {
    const itemWithImages = {
      ...mockItem,
      images: [{ id: 4, url: "https://site.com/image.jpg" }],
    };
    mockAuth(prismaMock);
    const find = prismaMock.item.findUnique.mockResolvedValue(
      itemWithImages as unknown as Item,
    );

    const response = await request(app)
      .get(`${BASE_API_URL}${ITEM_ROUTES}/${mockItem.id}`)
      .query({ includes: "images" })
      .set("Cookie", getAuthCookie())
      .set("User-Agent", MOCK_USER_AGENT);

    expect(find).toHaveBeenCalledWith(
      expect.objectContaining({
        include: expect.objectContaining({
          images: { include: { image: true } },
        }),
      }),
    );

    expect(response.body).toEqual({
      item: JSON.parse(JSON.stringify(itemWithImages)),
    });
  });

  it("should include related date ranges when requested via query param", async () => {
    const start = new Date();
    const end = new Date(start);
    end.setDate(start.getDate() + 1);

    const itemWithDateRanges = {
      ...mockItem,
      dateRanges: [
        { id: 4, description: "event description", startAt: start, endAt: end },
      ],
    };
    mockAuth(prismaMock);
    const find = prismaMock.item.findUnique.mockResolvedValue(
      itemWithDateRanges as unknown as Item,
    );

    const response = await request(app)
      .get(`${BASE_API_URL}${ITEM_ROUTES}/${mockItem.id}`)
      .query({ includes: "dateRanges" })
      .set("Cookie", getAuthCookie())
      .set("User-Agent", MOCK_USER_AGENT);

    expect(find).toHaveBeenCalledWith(
      expect.objectContaining({
        include: expect.objectContaining({
          dateRanges: true,
        }),
      }),
    );

    expect(response.body).toEqual({
      item: JSON.parse(JSON.stringify(itemWithDateRanges)),
    });
  });
});
