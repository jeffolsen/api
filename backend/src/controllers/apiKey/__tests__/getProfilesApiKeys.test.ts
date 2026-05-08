import { jest, describe, it, beforeEach, expect } from "@jest/globals";
import { mockReset } from "jest-mock-extended";
import type { DeepMockProxy } from "jest-mock-extended";
import type { PrismaClient, ApiKey } from "@/generated/prisma/client";
import request from "supertest";
import app from "@/server";
import prisma from "@db/client";
import {
  BASE_API_URL,
  API_KEY_ROUTES,
  COLLECTION_ENDPOINT,
} from "@config/routes";
import {
  MOCK_USER_AGENT,
  MOCK_PROFILE_ID,
  getAuthCookie,
  mockAuth,
} from "./helpers";
import { OK, UNAUTHORIZED } from "@/config/errorCodes";

jest.mock("@db/client");

const prismaMock = prisma as unknown as DeepMockProxy<PrismaClient>;

const ENDPOINT = BASE_API_URL + API_KEY_ROUTES + COLLECTION_ENDPOINT;

const mockApiKey: ApiKey = {
  id: 1,
  slug: "my-api-key",
  value: "$2b$10$hashedvalue",
  origin: "https://example.com",
  profileId: MOCK_PROFILE_ID,
  createdAt: new Date(),
  updatedAt: new Date(),
};

beforeEach(() => {
  mockReset(prismaMock);
});

describe("GET /api/keys/", () => {
  it("should return 401 when not authenticated", async () => {
    const response = await request(app)
      .get(ENDPOINT)
      .set("User-Agent", MOCK_USER_AGENT);

    expect(response.statusCode).toBe(UNAUTHORIZED);
  });

  it("should return 200 with apiKeys on success", async () => {
    mockAuth(prismaMock);
    prismaMock.apiKey.findMany.mockResolvedValue([mockApiKey]);

    const response = await request(app)
      .get(ENDPOINT)
      .set("Cookie", getAuthCookie())
      .set("User-Agent", MOCK_USER_AGENT);

    expect(response.statusCode).toBe(OK);
    expect(response.body).toHaveProperty("apiKeys");
  });
});
