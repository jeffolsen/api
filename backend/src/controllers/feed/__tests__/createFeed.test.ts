import { jest, describe, it, beforeEach, expect } from "@jest/globals";
import { mockReset } from "jest-mock-extended";
import type { DeepMockProxy } from "jest-mock-extended";
import type { Feed, PrismaClient } from "@/generated/prisma/client";
import request from "supertest";
import app from "@/server";
import prisma from "@db/client";
import { BASE_API_URL, FEED_ROUTES, COLLECTION_ENDPOINT } from "@config/routes";
import {
  MOCK_USER_AGENT,
  MOCK_PROFILE_ID,
  getAuthCookie,
  mockAuth,
} from "./helpers";
import { OK, BAD_REQUEST, UNAUTHORIZED } from "@/config/errorCodes";

jest.mock("@db/client");

const prismaMock = prisma as unknown as DeepMockProxy<PrismaClient>;

const ENDPOINT = BASE_API_URL + FEED_ROUTES + COLLECTION_ENDPOINT;

const VALID_BODY = {
  path: "home",
  subjectType: "COLLECTION",
};

const mockFeed: Feed = {
  id: 1,
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

describe("POST /api/feeds/", () => {
  it("should return 401 when not authenticated", async () => {
    const response = await request(app)
      .post(ENDPOINT)
      .set("User-Agent", MOCK_USER_AGENT)
      .send(VALID_BODY);

    expect(response.statusCode).toBe(UNAUTHORIZED);
  });

  it("should return 400 when path is missing", async () => {
    mockAuth(prismaMock);

    const response = await request(app)
      .post(ENDPOINT)
      .set("Cookie", getAuthCookie())
      .set("User-Agent", MOCK_USER_AGENT)
      .send({ subjectType: "COLLECTION" });

    expect(response.statusCode).toBe(BAD_REQUEST);
  });

  it("should return 400 when subjectType is missing", async () => {
    mockAuth(prismaMock);

    const response = await request(app)
      .post(ENDPOINT)
      .set("Cookie", getAuthCookie())
      .set("User-Agent", MOCK_USER_AGENT)
      .send({ path: "home" });

    expect(response.statusCode).toBe(BAD_REQUEST);
  });

  it("should return 400 when path format is invalid", async () => {
    mockAuth(prismaMock);

    const response = await request(app)
      .post(ENDPOINT)
      .set("Cookie", getAuthCookie())
      .set("User-Agent", MOCK_USER_AGENT)
      .send({ ...VALID_BODY, path: "Invalid Path!" });

    expect(response.statusCode).toBe(BAD_REQUEST);
  });

  it("should return 200 on success", async () => {
    mockAuth(prismaMock);
    prismaMock.feed.create.mockResolvedValue(mockFeed);

    const response = await request(app)
      .post(ENDPOINT)
      .set("Cookie", getAuthCookie())
      .set("User-Agent", MOCK_USER_AGENT)
      .send(VALID_BODY);

    expect(response.statusCode).toBe(OK);
    expect(response.body).toHaveProperty("feed");
  });

  it("should create the feed with the authenticated profileId", async () => {
    mockAuth(prismaMock);
    prismaMock.feed.create.mockResolvedValue(mockFeed);

    await request(app)
      .post(ENDPOINT)
      .set("Cookie", getAuthCookie())
      .set("User-Agent", MOCK_USER_AGENT)
      .send(VALID_BODY);

    expect(prismaMock.feed.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ profileId: MOCK_PROFILE_ID }),
      }),
    );
  });
});
