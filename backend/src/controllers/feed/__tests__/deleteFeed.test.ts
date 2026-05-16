import { jest, describe, it, beforeEach, expect } from "@jest/globals";
import { mockReset } from "jest-mock-extended";
import type { DeepMockProxy } from "jest-mock-extended";
import type { Feed, PrismaClient } from "@/generated/prisma/client";
import request from "supertest";
import app from "@/server";
import prisma from "@db/client";
import { BASE_API_URL, FEED_ROUTES } from "@config/routes";
import {
  MOCK_USER_AGENT,
  MOCK_PROFILE_ID,
  getAuthCookie,
  mockAuth,
} from "./helpers";
import { OK, NOT_FOUND, UNAUTHORIZED } from "@/config/errorCodes";

jest.mock("@db/client");

const prismaMock = prisma as unknown as DeepMockProxy<PrismaClient>;

const MOCK_FEED_ID = 1;
const ENDPOINT = `${BASE_API_URL}${FEED_ROUTES}/${MOCK_FEED_ID}`;

const mockFeed: Feed = {
  id: MOCK_FEED_ID,
  path: "home",
  subjectType: "COLLECTION",
  publishedAt: null,
  expiredAt: null,
  createdAt: new Date(),
  updatedAt: new Date(),
  profileId: MOCK_PROFILE_ID,
  seoTitle: null,
  seoDescription: null,
  seoImage: null,
  schemaType: null,
};

const mockDeleteTransaction = (feedFound = true) => {
  const feedDelete = jest
    .fn<(args: unknown) => Promise<Feed>>()
    .mockResolvedValue(mockFeed);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  prismaMock.$transaction.mockImplementationOnce((callback: any) =>
    callback({
      feed: {
        findFirst: jest
          .fn<(args: unknown) => Promise<Feed | null>>()
          .mockResolvedValue(feedFound ? mockFeed : null),
        delete: feedDelete,
      },
    }),
  );

  return { feedDelete };
};

beforeEach(() => {
  mockReset(prismaMock);
});

describe("DELETE /api/feeds/:id", () => {
  it("should return 401 when not authenticated", async () => {
    const response = await request(app)
      .delete(ENDPOINT)
      .set("User-Agent", MOCK_USER_AGENT);

    expect(response.statusCode).toBe(UNAUTHORIZED);
  });

  it("should return 404 when the feed is not found", async () => {
    mockAuth(prismaMock);
    mockDeleteTransaction(false);

    const response = await request(app)
      .delete(ENDPOINT)
      .set("Cookie", getAuthCookie())
      .set("User-Agent", MOCK_USER_AGENT);

    expect(response.statusCode).toBe(NOT_FOUND);
  });

  it("should return 200 on success", async () => {
    mockAuth(prismaMock);
    mockDeleteTransaction();

    const response = await request(app)
      .delete(ENDPOINT)
      .set("Cookie", getAuthCookie())
      .set("User-Agent", MOCK_USER_AGENT);

    expect(response.statusCode).toBe(OK);
  });

  it("should delete the feed", async () => {
    mockAuth(prismaMock);
    const { feedDelete } = mockDeleteTransaction();

    await request(app)
      .delete(ENDPOINT)
      .set("Cookie", getAuthCookie())
      .set("User-Agent", MOCK_USER_AGENT);

    expect(feedDelete).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ id: MOCK_FEED_ID }),
      }),
    );
  });
});
