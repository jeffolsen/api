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
};

beforeEach(() => {
  mockReset(prismaMock);
});

describe("GET /api/feeds/:id", () => {
  it("should return 401 when not authenticated", async () => {
    const response = await request(app)
      .get(ENDPOINT)
      .set("User-Agent", MOCK_USER_AGENT);

    expect(response.statusCode).toBe(UNAUTHORIZED);
  });

  it("should return 200 with feed on success", async () => {
    mockAuth(prismaMock);
    prismaMock.feed.findFirst.mockResolvedValue(mockFeed);

    const response = await request(app)
      .get(ENDPOINT)
      .set("Cookie", getAuthCookie())
      .set("User-Agent", MOCK_USER_AGENT);

    expect(response.statusCode).toBe(OK);
    expect(response.body).toHaveProperty("feed");
  });

  it("should return 404 when the feed is not found", async () => {
    mockAuth(prismaMock);
    prismaMock.feed.findFirst.mockResolvedValue(null);

    const response = await request(app)
      .get(ENDPOINT)
      .set("Cookie", getAuthCookie())
      .set("User-Agent", MOCK_USER_AGENT);

    expect(response.statusCode).toBe(NOT_FOUND);
  });
});
