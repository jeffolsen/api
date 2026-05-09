import { jest, describe, it, beforeEach, expect } from "@jest/globals";
import { mockReset } from "jest-mock-extended";
import type { DeepMockProxy } from "jest-mock-extended";
import type { Component, Feed, PrismaClient } from "@/generated/prisma/client";
import request from "supertest";
import app from "@/server";
import prisma from "@db/client";
import { BASE_API_URL, FEED_ROUTES, COMPONENT_ROUTES } from "@config/routes";
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
const MOCK_COMPONENT_ID = 1;
const ENDPOINT = `${BASE_API_URL}${FEED_ROUTES}/${MOCK_FEED_ID}${COMPONENT_ROUTES}/${MOCK_COMPONENT_ID}`;

const mockComponent: Component = {
  id: MOCK_COMPONENT_ID,
  feedId: MOCK_FEED_ID,
  typeId: 1,
  typeName: "hero",
  name: "hero-1",
  order: 1,
  propertyValues: {},
  publishedAt: null,
  expiredAt: null,
  createdAt: new Date(),
  updatedAt: new Date(),
} as unknown as Component;

const mockFeed = {
  id: MOCK_FEED_ID,
  path: "home",
  subjectType: "COLLECTION",
  profileId: MOCK_PROFILE_ID,
  publishedAt: null,
  expiredAt: null,
  createdAt: new Date(),
  updatedAt: new Date(),
  components: [mockComponent],
} as unknown as Feed & { components: Component[] };

const mockFeedWithoutComponent = {
  ...mockFeed,
  components: [],
} as unknown as Feed & { components: Component[] };

beforeEach(() => {
  mockReset(prismaMock);
});

describe("GET /api/feeds/:feedId/components/:id", () => {
  it("should return 401 when not authenticated", async () => {
    const response = await request(app)
      .get(ENDPOINT)
      .set("User-Agent", MOCK_USER_AGENT);

    expect(response.statusCode).toBe(UNAUTHORIZED);
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

  it("should return 404 when the component is not in the feed", async () => {
    mockAuth(prismaMock);
    prismaMock.feed.findFirst.mockResolvedValue(
      mockFeedWithoutComponent as unknown as Feed,
    );

    const response = await request(app)
      .get(ENDPOINT)
      .set("Cookie", getAuthCookie())
      .set("User-Agent", MOCK_USER_AGENT);

    expect(response.statusCode).toBe(NOT_FOUND);
  });

  it("should return 200 with component on success", async () => {
    mockAuth(prismaMock);
    prismaMock.feed.findFirst.mockResolvedValue(mockFeed as unknown as Feed);

    const response = await request(app)
      .get(ENDPOINT)
      .set("Cookie", getAuthCookie())
      .set("User-Agent", MOCK_USER_AGENT);

    expect(response.statusCode).toBe(OK);
    expect(response.body).toHaveProperty("component");
  });
});
