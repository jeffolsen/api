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
import { OK, BAD_REQUEST, NOT_FOUND, UNAUTHORIZED } from "@/config/errorCodes";

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

const VALID_BODY = { path: "home-updated" };

const mockUpdateTransaction = (feedFound = true) => {
  const feedUpdate = jest
    .fn<(args: unknown) => Promise<Feed>>()
    .mockResolvedValue(mockFeed);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  prismaMock.$transaction.mockImplementationOnce((callback: any) =>
    callback({
      feed: {
        findFirst: jest
          .fn<(args: unknown) => Promise<Feed | null>>()
          .mockResolvedValue(feedFound ? mockFeed : null),
        update: feedUpdate,
      },
    }),
  );

  return { feedUpdate };
};

beforeEach(() => {
  mockReset(prismaMock);
});

describe("PUT /api/feeds/:id", () => {
  it("should return 401 when not authenticated", async () => {
    const response = await request(app)
      .put(ENDPOINT)
      .set("User-Agent", MOCK_USER_AGENT)
      .send(VALID_BODY);

    expect(response.statusCode).toBe(UNAUTHORIZED);
  });

  it("should return 400 when path format is invalid", async () => {
    mockAuth(prismaMock);

    const response = await request(app)
      .put(ENDPOINT)
      .set("Cookie", getAuthCookie())
      .set("User-Agent", MOCK_USER_AGENT)
      .send({ path: "Invalid Path!" });

    expect(response.statusCode).toBe(BAD_REQUEST);
  });

  it("should return 404 when the feed is not found", async () => {
    mockAuth(prismaMock);
    mockUpdateTransaction(false);

    const response = await request(app)
      .put(ENDPOINT)
      .set("Cookie", getAuthCookie())
      .set("User-Agent", MOCK_USER_AGENT)
      .send(VALID_BODY);

    expect(response.statusCode).toBe(NOT_FOUND);
  });

  it("should return 200 on success", async () => {
    mockAuth(prismaMock);
    mockUpdateTransaction();

    const response = await request(app)
      .put(ENDPOINT)
      .set("Cookie", getAuthCookie())
      .set("User-Agent", MOCK_USER_AGENT)
      .send(VALID_BODY);

    expect(response.statusCode).toBe(OK);
    expect(response.body).toHaveProperty("feed");
  });

  it("should update the feed with the provided path", async () => {
    mockAuth(prismaMock);
    const { feedUpdate } = mockUpdateTransaction();

    await request(app)
      .put(ENDPOINT)
      .set("Cookie", getAuthCookie())
      .set("User-Agent", MOCK_USER_AGENT)
      .send(VALID_BODY);

    expect(feedUpdate).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ path: "home-updated" }),
      }),
    );
  });
});
